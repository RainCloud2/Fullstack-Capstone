from typing import List
import numpy as np
import pandas as pd
import threading

inference_lock = threading.Lock()

from app.config import (
    FAIL_MASTERY_THRESHOLD,
    MIN_ATTEMPTS_FOR_FAIL,
    MIN_ATTEMPTS_FOR_STAGNATION,
    PASS_MASTERY_THRESHOLD,
    STAGNATION_EPS,
    STAGNATION_WINDOW,
)


def _is_stagnant(scores: List[float]) -> bool:
    if len(scores) < STAGNATION_WINDOW:
        return False

    recent = scores[-STAGNATION_WINDOW:]
    return (max(recent) - min(recent)) <= STAGNATION_EPS


def _is_declining(scores: List[float]) -> bool:
    if len(scores) < 2:
        return False

    return scores[-1] < (scores[-2] - STAGNATION_EPS)


def decide_action(mastery_score: float, mastery_history: List[float], attempts: int) -> dict:
    if mastery_score >= PASS_MASTERY_THRESHOLD:
        return {
            "decision": "passed",
            "next_action": "unlock_next_topic",
            "should_stop_quiz": True,
            "reason": f"mastery >= {PASS_MASTERY_THRESHOLD}",
        }

    if attempts >= MIN_ATTEMPTS_FOR_FAIL and mastery_score <= FAIL_MASTERY_THRESHOLD:
        return {
            "decision": "needs_remedial",
            "next_action": "repeat_topic",
            "should_stop_quiz": True,
            "reason": f"mastery <= {FAIL_MASTERY_THRESHOLD}",
        }

    if attempts >= MIN_ATTEMPTS_FOR_STAGNATION and _is_stagnant(mastery_history):
        return {
            "decision": "stagnant",
            "next_action": "repeat_topic",
            "should_stop_quiz": True,
            "reason": "mastery has stagnated",
        }

    if _is_declining(mastery_history):
        return {
            "decision": "declining",
            "next_action": "give_hint_or_review",
            "should_stop_quiz": False,
            "reason": "mastery is declining",
        }

    return {
        "decision": "continue",
        "next_action": "next_question",
        "should_stop_quiz": False,
        "reason": "continue quiz",
    }

import os
import unicodedata
import tensorflow.lite as tflite

def load_vocab(vocab_path):
    """Memuat file vocab.txt ke dalam dictionary Python"""
    vocab = {}
    with open(vocab_path, "r", encoding="utf-8") as f:
        for index, line in enumerate(f):
            token = line.strip()
            vocab[token] = index
    return vocab

def basic_tokenize(text):
    """Membersihkan teks mentah dan memisahkan tanda baca standar"""
    text = unicodedata.normalize("NFD", text.lower())
    text = "".join([ch for ch in text if unicodedata.category(ch) != "Mn"])
    
    output = []
    for char in text:
        if unicodedata.category(char).startswith("P") or char.isspace():
            output.append(" ")
            if unicodedata.category(char).startswith("P"):
                output.append(char)
                output.append(" ")
        else:
            output.append(char)
    return "".join(output).split()

def wordpiece_tokenize(text, vocab, max_len=128):
    """Algoritma Wordpiece BERT murni tanpa library eksternal"""
    tokens = basic_tokenize(text)
    output_tokens = ["[CLS]"]
    
    for token in tokens:
        chars = list(token)
        if len(chars) > 100:
            output_tokens.append("[UNK]")
            continue
            
        is_bad = False
        start = 0
        sub_tokens = []
        while start < len(chars):
            end = len(chars)
            cur_substr = None
            while start < end:
                substr = "".join(chars[start:end])
                if start > 0:
                    substr = "##" + substr
                if substr in vocab:
                    cur_substr = substr
                    break
                end -= 1
            if cur_substr is None:
                is_bad = True
                break
            sub_tokens.append(cur_substr)
            start = end
            
        if is_bad:
            output_tokens.append("[UNK]")
        else:
            output_tokens.extend(sub_tokens)
            
    output_tokens.append("[SEP]")
    
    if len(output_tokens) > max_len:
        output_tokens = output_tokens[:max_len-1] + ["[SEP]"]
    
    input_ids = [vocab[t] if t in vocab else vocab["[UNK]"] for t in output_tokens]
    input_mask = [1] * len(input_ids)
    
    padding_len = max_len - len(input_ids)
    input_ids.extend([0] * padding_len)
    input_mask.extend([0] * padding_len)
    segment_ids = [0] * max_len
    
    return input_ids, input_mask, segment_ids

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

vocab_dict = load_vocab(os.path.join(BASE_DIR, "vocab.txt"))
course_db = pd.read_csv(os.path.join(BASE_DIR, "coursera_courses.csv")).fillna('')
course_vectors = np.load(os.path.join(BASE_DIR, "bert_course_embeddings.npy"))

interpreter = tflite.Interpreter(model_path=os.path.join(BASE_DIR, "bert_model_quantized.tflite"))
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def get_bert_course_recommendations(req) -> list:
    """Fungsi utama pengekstrakan vektor user dan kalkulasi kecocokan kuis"""
    input_ids, input_mask, segment_ids = wordpiece_tokenize(
        req.pretest_profile_text, 
        vocab_dict, 
        max_len=128
    )
    
    arr_ids = np.array([input_ids], dtype=np.int32)
    arr_mask = np.array([input_mask], dtype=np.int32)
    arr_segment = np.array([segment_ids], dtype=np.int32)
    
    with inference_lock:
        for detail in input_details:
            name = detail['name'].lower()
            if 'mask' in name:
                interpreter.set_tensor(detail['index'], arr_mask)
            elif 'type' in name or 'segment' in name:
                interpreter.set_tensor(detail['index'], arr_segment)
            else:
                # Default untuk input_word_ids
                interpreter.set_tensor(detail['index'], arr_ids)
            
        interpreter.invoke()
        
        # Tarik data dari TFLite
        raw_data = interpreter.get_tensor(output_details[0]['index'])
        # Gandakan data ke variabel memori Python seutuhnya
        user_vector = np.copy(raw_data)
        # Hancurkan referensi internal TFLite agar aman untuk request berikutnya
        del raw_data
        
    
    sim_scores = np.dot(user_vector, course_vectors.T).flatten()
    results_df = course_db.copy()
    results_df["base_score"] = sim_scores

    if req.taken_courses:
        results_df = results_df[~results_df["course_title"].isin(req.taken_courses)]
        
    if req.skip_beginner:
        results_df = results_df[results_df["course_difficulty"].str.lower() != "beginner"]
        
    if req.preferred_difficulty:
        is_preferred = results_df["course_difficulty"].str.lower() == req.preferred_difficulty.lower()
        results_df.loc[is_preferred, "base_score"] += 0.05

    top_results = results_df.nlargest(req.top_n, "base_score")
    max_score = top_results["base_score"].max() if not top_results.empty else 1.0

    return [
        {
            "title": row["course_title"],
            "url": row["course_url"],
            "difficulty": row["course_difficulty"],
            "match_score": round((row["base_score"] / max_score) * 98.0, 2),
        }
        for _, row in top_results.iterrows()
    ]