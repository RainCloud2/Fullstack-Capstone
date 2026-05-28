from typing import List

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