from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    AnswerInput,
    AnswerResponse,
    SessionInfoResponse,
    StartSessionRequest,
    StartSessionResponse,
)
from app.services.model_service import get_model, predict_mastery_from_events
from app.services.recommendation import decide_action
from app.services.session_store import session_store

app = FastAPI(title="Agnostic KT API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def warm_up_model():
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