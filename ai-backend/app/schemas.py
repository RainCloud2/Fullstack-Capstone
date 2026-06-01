from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class StartSessionRequest(BaseModel):
    user_id: str = Field(min_length=1)
    topic_id: str = Field(min_length=1)


class AnswerInput(BaseModel):
    question_id: Optional[str] = None
    is_correct: bool
    time_spent_sec: float = Field(ge=0)
    difficulty: Difficulty


class StartSessionResponse(BaseModel):
    session_id: str
    user_id: str
    topic_id: str
    attempts: int


class AnswerResponse(BaseModel):
    session_id: str
    user_id: str
    topic_id: str
    attempts: int
    mastery_score: float
    recent_mastery_scores: List[float]
    decision: str
    next_action: str
    should_stop_quiz: bool
    reason: str


class SessionInfoResponse(BaseModel):
    session_id: str
    user_id: str
    topic_id: str
    attempts: int
    mastery_scores: List[float]
    answers: List[dict]

class RecommendRequest(BaseModel):
    pretest_profile_text: str
    taken_courses: Optional[List[str]] = []
    preferred_difficulty: Optional[str] = None
    skip_beginner: Optional[bool] = False
    top_n: Optional[int] = 5

class CourseResult(BaseModel):
    title: str
    url: str
    difficulty: str
    match_score: float