from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "agnostic_kt_model.keras"

MAX_SEQ_LEN = 20
PADDING_VALUE = -1.0

PASS_MASTERY_THRESHOLD = 0.85
FAIL_MASTERY_THRESHOLD = 0.35

STAGNATION_WINDOW = 4
STAGNATION_EPS = 0.05
MIN_ATTEMPTS_FOR_FAIL = 5
MIN_ATTEMPTS_FOR_STAGNATION = 4

DIFFICULTY_MAP = {
    "easy": 0.0,
    "medium": 1.0,
    "normal": 1.0,
    "hard": 2.0,
}