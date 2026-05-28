from typing import List, Tuple

import numpy as np
import pandas as pd

from app.config import DIFFICULTY_MAP, MAX_SEQ_LEN, PADDING_VALUE


FEATURE_COLS = [
    "is_correct",
    "time_cat",
    "diff_encoded",
    "attempt_norm",
    "cum_accuracy",
    "rolling_acc_3",
]


def build_feature_frame(events: List[dict]) -> pd.DataFrame:
    if not events:
        raise ValueError("No answer events provided.")

    df = pd.DataFrame(events).copy().reset_index(drop=True)

    required = ["is_correct", "time_spent_sec", "difficulty"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required fields: {missing}")

    df["is_correct"] = df["is_correct"].astype(int).clip(0, 1)
    df["time_spent_sec"] = pd.to_numeric(df["time_spent_sec"], errors="coerce")

    if df["time_spent_sec"].isnull().any():
        raise ValueError("time_spent_sec contains invalid values.")

    df["attempt_num"] = np.arange(1, len(df) + 1)
    df["attempt_norm"] = (df["attempt_num"] / float(MAX_SEQ_LEN)).clip(0.0, 1.0)

    df["cum_correct"] = df["is_correct"].cumsum()
    df["cum_accuracy"] = df["cum_correct"] / df["attempt_num"]

    df["rolling_acc_3"] = df["is_correct"].rolling(3, min_periods=1).mean()

    df["time_cat"] = pd.cut(
        df["time_spent_sec"],
        bins=[-1, 10, 60, float("inf")],
        labels=[0, 1, 2],
    ).astype(float)

    df["diff_encoded"] = (
        df["difficulty"]
        .astype(str)
        .str.lower()
        .map(DIFFICULTY_MAP)
    )

    if df["diff_encoded"].isnull().any():
        bad_values = df.loc[df["diff_encoded"].isnull(), "difficulty"].unique().tolist()
        raise ValueError(f"Invalid difficulty values: {bad_values}")

    return df


def make_model_input(events: List[dict]) -> Tuple[np.ndarray, int, pd.DataFrame]:
    df = build_feature_frame(events)

    feats = df[FEATURE_COLS].to_numpy(dtype=np.float32)

    if len(feats) > MAX_SEQ_LEN:
        feats = feats[-MAX_SEQ_LEN:]

    valid_len = len(feats)

    if valid_len < MAX_SEQ_LEN:
        pad = np.full(
            (MAX_SEQ_LEN - valid_len, len(FEATURE_COLS)),
            PADDING_VALUE,
            dtype=np.float32,
        )
        feats = np.vstack([feats, pad])

    X = np.expand_dims(feats, axis=0)  # (1, MAX_SEQ_LEN, 6)
    return X, valid_len, df