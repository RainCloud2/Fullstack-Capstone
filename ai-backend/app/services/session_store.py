from dataclasses import dataclass, field
from datetime import datetime
from threading import RLock
from typing import Dict, List, Optional
from uuid import uuid4


@dataclass
class SessionState:
    session_id: str
    user_id: str
    topic_id: str
    answers: List[dict] = field(default_factory=list)
    mastery_scores: List[float] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)


class SessionStore:
    def __init__(self) -> None:
        self._lock = RLock()
        self._sessions: Dict[str, SessionState] = {}

    def create_session(self, user_id: str, topic_id: str) -> SessionState:
        with self._lock:
            session_id = uuid4().hex
            state = SessionState(
                session_id=session_id,
                user_id=user_id,
                topic_id=topic_id,
            )
            self._sessions[session_id] = state
            return state

    def get_session(self, session_id: str) -> Optional[SessionState]:
        with self._lock:
            return self._sessions.get(session_id)

    def append_answer(self, session_id: str, answer: dict) -> SessionState:
        with self._lock:
            session = self._sessions.get(session_id)
            if session is None:
                raise KeyError(f"Session not found: {session_id}")

            item = dict(answer)
            item["received_at"] = datetime.utcnow().isoformat()
            session.answers.append(item)
            session.updated_at = datetime.utcnow()
            return session

    def append_mastery(self, session_id: str, mastery: float) -> SessionState:
        with self._lock:
            session = self._sessions.get(session_id)
            if session is None:
                raise KeyError(f"Session not found: {session_id}")

            session.mastery_scores.append(float(mastery))
            session.updated_at = datetime.utcnow()
            return session


session_store = SessionStore()