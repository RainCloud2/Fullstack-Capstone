const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000";
const ANON_USER_KEY = "studysync-anon-user-id";

function getOrCreateAnonymousUserId() {
  if (typeof window === "undefined") return "anonymous";

  const stored = window.localStorage.getItem(ANON_USER_KEY);
  if (stored) return stored;

  const newId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(ANON_USER_KEY, newId);
  return newId;
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${AI_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function startQuizSession({ userId, topicId }) {
  return requestJson("/sessions/start", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      topic_id: topicId,
    }),
  });
}

export async function submitQuizAnswer({
  sessionId,
  questionId,
  isCorrect,
  timeSpentSec,
  difficulty,
}) {
  return requestJson(`/sessions/${sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      question_id: questionId,
      is_correct: isCorrect,
      time_spent_sec: timeSpentSec,
      difficulty,
    }),
  });
}

export { getOrCreateAnonymousUserId };