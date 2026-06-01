from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    AnswerInput,
    AnswerResponse,
    SessionInfoResponse,
    StartSessionRequest,
    StartSessionResponse,
    RecommendRequest,
    CourseResult,
)
from app.services.model_service import get_model, predict_mastery_from_events
from app.services.recommendation import decide_action, get_bert_recommendations
from app.services.session_store import session_store

app = FastAPI(title="Agnostic KT API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
import urllib.request

@app.on_event("startup")
def warm_up_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "..", "bert_model_quantized.tflite")
    
    drive_file_id = "1su4W7LRC-QcerRSb5YkejXIe9n97p-z4"
    
    url_model_cloud = f"https://docs.google.com/uc?export=download&id={drive_file_id}"
    
    if not os.path.exists(model_path):
        print("🤖 [StudySync AI] File bert_model_quantized.tflite tidak ditemukan lokal. Mengunduh dari Google Drive...")
        try:
            opener = urllib.request.build_opener()
            opener.addheaders = [('User-agent', 'Mozilla/5.0')]
            urllib.request.install_opener(opener)
            
            urllib.request.urlretrieve(url_model_cloud, model_path)
            print("✅ [StudySync AI] Unduhan model bert_model_quantized.tflite berhasil diselesaikan!")
        except Exception as e:
            print(f"❌ [StudySync AI] Gagal mengunduh model dari Drive: {str(e)}")
            
    _ = get_model()


@app.get("/health")
def health():
    return {"status": "ok", "service": "agnostic-kt-api"}


@app.post("/sessions/start", response_model=StartSessionResponse)
def start_session(payload: StartSessionRequest):
    session = session_store.create_session(
        user_id=payload.user_id,
        topic_id=payload.topic_id,
    )
    return StartSessionResponse(
        session_id=session.session_id,
        user_id=session.user_id,
        topic_id=session.topic_id,
        attempts=0,
    )


@app.post("/sessions/{session_id}/answer", response_model=AnswerResponse)
def submit_answer(session_id: str, payload: AnswerInput):
    session = session_store.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    answer_dict = payload.model_dump()
    answer_dict["is_correct"] = int(answer_dict["is_correct"])

    try:
        session = session_store.append_answer(session_id, answer_dict)
        pred = predict_mastery_from_events(session.answers)
        mastery = pred["mastery_score"]
        session_store.append_mastery(session_id, mastery)

        decision_info = decide_action(
            mastery_score=mastery,
            mastery_history=session.mastery_scores,
            attempts=len(session.answers),
        )

        return AnswerResponse(
            session_id=session.session_id,
            user_id=session.user_id,
            topic_id=session.topic_id,
            attempts=len(session.answers),
            mastery_score=mastery,
            recent_mastery_scores=session.mastery_scores[-5:],
            decision=decision_info["decision"],
            next_action=decision_info["next_action"],
            should_stop_quiz=decision_info["should_stop_quiz"],
            reason=decision_info["reason"],
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/sessions/{session_id}", response_model=SessionInfoResponse)
def get_session(session_id: str):
    session = session_store.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return SessionInfoResponse(
        session_id=session.session_id,
        user_id=session.user_id,
        topic_id=session.topic_id,
        attempts=len(session.answers),
        mastery_scores=session.mastery_scores,
        answers=session.answers,
    )

@app.post("/api/recommend", response_model=List[CourseResult])
def recommend_courses(payload: RecommendRequest):
    try:
        recommendations = get_bert_course_recommendations(payload)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
