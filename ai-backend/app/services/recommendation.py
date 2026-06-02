from typing import List
import numpy as np
import pandas as pd
import os
from sentence_transformers import SentenceTransformer

from app.config import (
    FAIL_MASTERY_THRESHOLD,
    MIN_ATTEMPTS_FOR_FAIL,
    MIN_ATTEMPTS_FOR_STAGNATION,
    PASS_MASTERY_THRESHOLD,
    STAGNATION_EPS,
    STAGNATION_WINDOW,
)

# --- FUNGSI KNOWLEDGE TRACING (TETAP SAMA) ---

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


# --- FUNGSI REKOMENDASI (SBERT BI-ENCODER) ---

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Memuat data
course_db = pd.read_csv(os.path.join(BASE_DIR, "coursera_courses.csv")).fillna('')
course_vectors = np.load(os.path.join(BASE_DIR, "bert_course_embeddings.npy"))

# Memuat model HuggingFace SBERT 
# (Otomatis didownload ke cache sistem saat pertama kali dijalankan)
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_bert_course_recommendations(req) -> list:
    """Fungsi ekstraksi teks dengan arsitektur Bi-Encoder (Semantic Search)"""
    
    # 1. Konversi teks user langsung menjadi vektor dengan SBERT
    # normalize_embeddings=True membuat dot_product berfungsi persis seperti Cosine Similarity
    user_vector = sbert_model.encode(req.pretest_profile_text, normalize_embeddings=True)
    
    # 2. Hitung tingkat kecocokan 
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

    # Hindari ZeroDivisionError jika dataset kosong atau skor aneh
    max_score = max_score if max_score > 0 else 1.0

    return [
        {
            "title": row["course_title"],
            "url": row["course_url"],
            "difficulty": row["course_difficulty"],
            "match_score": round((row["base_score"] / max_score) * 98.0, 2),
        }
        for _, row in top_results.iterrows()
    ]