from functools import lru_cache
from typing import Dict, List

import tensorflow as tf
from tensorflow.keras.layers import Dense, Dropout

from app.config import MODEL_PATH
from app.services.preprocess import make_model_input


class MasteryOutputLayer(tf.keras.layers.Layer):
    def __init__(self, hidden_dim: int = 32, dropout_rate: float = 0.2, **kwargs):
        super().__init__(**kwargs)
        self.hidden_dim = hidden_dim
        self.dropout_rate = dropout_rate
        self.dense = Dense(hidden_dim, activation="relu")
        self.dropout = Dropout(dropout_rate)
        self.out = Dense(1, activation="sigmoid")

    def build(self, input_shape):
        super().build(input_shape)

    def call(self, x, training=False):
        x = self.dense(x)
        x = self.dropout(x, training=training)
        return self.out(x)

    def get_config(self):
        config = super().get_config()
        config.update(
            {
                "hidden_dim": self.hidden_dim,
                "dropout_rate": self.dropout_rate,
            }
        )
        return config


@lru_cache(maxsize=1)
def get_model():
    model = tf.keras.models.load_model(
        str(MODEL_PATH),
        custom_objects={"MasteryOutputLayer": MasteryOutputLayer},
        compile=False,
    )
    return model


def predict_mastery_from_events(events: List[dict]) -> Dict:
    X, valid_len, df = make_model_input(events)
    model = get_model()

    preds = model.predict(X, verbose=0)[0, :, 0]
    valid_preds = preds[:valid_len].tolist()

    if not valid_preds:
        raise ValueError("No valid predictions were produced.")

    return {
        "mastery_score": float(valid_preds[-1]),
        "mastery_trace": valid_preds,
        "valid_len": valid_len,
        "feature_frame": df,
    }