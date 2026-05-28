import { createServer } from "node:http";
import { Buffer } from "node:buffer";
import process from "node:process";

const PORT = process.env.PORT || 3001;
const quizResults = new Map();
const progressState = {
  totalLessons: 40,
  phases: [
    { id: "fondasi-web", progress: 0, status: "Belum dimulai" },
    { id: "javascript", progress: 0, status: "Terkunci" },
    { id: "react-ekosistem", progress: 0, status: "Terkunci" },
    { id: "career-preparation", progress: 0, status: "Terkunci" },
  ],
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    return sendJson(res, 204, null);
  }

  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, { status: "ok", service: "studysync-api" });
    }

    if (req.method === "GET" && url.pathname === "/api/progress") {
      return sendJson(res, 200, { data: getProgressSummary() });
    }

    if (req.method === "POST" && url.pathname === "/api/quiz-results") {
      const payload = await readBody(req);
      const percent = Math.round((Number(payload.score) / Number(payload.totalQuestions)) * 100);
      const id = Date.now().toString();
      const result = {
        id,
        phaseId: payload.phaseId,
        quizTitle: payload.quizTitle,
        score: payload.score,
        totalQuestions: payload.totalQuestions,
        percent,
        durationSeconds: payload.durationSeconds,
        createdAt: new Date().toISOString(),
        answers: payload.answers ?? [],
      };

      quizResults.set(id, result);
      updatePhaseProgress(payload.phaseId, percent);

      return sendJson(res, 201, { data: result, progress: getProgressSummary() });
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/quiz-results/")) {
      const id = url.pathname.split("/").pop();
      const result = quizResults.get(id);

      if (!result) {
        return sendJson(res, 404, { error: "Quiz result not found" });
      }

      return sendJson(res, 200, { data: result });
    }

    return sendJson(res, 404, { error: "Route not found" });
  } catch (error) {
    return sendJson(res, 500, { error: "Internal server error", detail: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`StudySync API running at http://localhost:${PORT}`);
});

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(payload === null ? "" : JSON.stringify(payload));
}

function getProgressSummary() {
  const totalProgress = Math.round(
    progressState.phases.reduce((sum, phase) => sum + phase.progress, 0) / progressState.phases.length
  );
  const results = [...quizResults.values()];
  const averageScore = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.percent, 0) / results.length)
    : 0;

  return {
    totalProgress,
    completedLessons: Math.round((progressState.totalLessons * totalProgress) / 100),
    totalLessons: progressState.totalLessons,
    completedQuizzes: results.length,
    averageScore,
    phases: progressState.phases,
  };
}

function updatePhaseProgress(phaseId, percent) {
  const phase = progressState.phases.find((item) => item.id === phaseId);

  if (!phase) return;

  phase.progress = Math.max(phase.progress, percent);

  if (phase.progress >= 100) {
    phase.status = "Selesai";
  } else if (phase.progress > 0) {
    phase.status = "Sedang berjalan";
  }

  const currentIndex = progressState.phases.findIndex((item) => item.id === phaseId);
  const nextPhase = progressState.phases[currentIndex + 1];

  if (phase.progress >= 80 && nextPhase?.status === "Terkunci") {
    nextPhase.status = "Belum dimulai";
  }
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
