const API_URL = "http://localhost:3001";
const STORAGE_KEY = "studysync-progress";

export const fallbackProgress = {
  totalProgress: 0,
  completedLessons: 0,
  totalLessons: 40,
  completedQuizzes: 0,
  averageScore: 0,
  phases: [
    { id: "fondasi-web", progress: 0, status: "Belum dimulai" },
    { id: "javascript", progress: 0, status: "Terkunci" },
    { id: "react-ekosistem", progress: 0, status: "Terkunci" },
    { id: "career-preparation", progress: 0, status: "Terkunci" },
  ],
};

export async function fetchProgress() {
  try {
    const response = await fetch(`${API_URL}/api/progress`);

    if (!response.ok) {
      throw new Error("Gagal mengambil progress.");
    }

    const payload = await response.json();
    saveProgress(payload.data);
    return payload.data;
  } catch {
    return getStoredProgress();
  }
}

export function mergePhasesWithProgress(phases, progress) {
  return phases.map((phase) => {
    const phaseProgress = progress.phases.find((item) => item.id === phase.id);

    return {
      ...phase,
      progress: phaseProgress?.progress ?? phase.progress,
      status: phaseProgress?.status ?? phase.status,
      active: phaseProgress?.status !== "Terkunci",
    };
  });
}

export function getStoredProgress() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : fallbackProgress;
  } catch {
    return fallbackProgress;
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage failures; fallback progress keeps the UI usable.
  }
}

export function applyQuizProgress(currentProgress, phaseId, percent) {
  const phases = currentProgress.phases.map((phase, index, allPhases) => {
    if (phase.id === phaseId) {
      const nextProgress = Math.max(phase.progress, percent);
      return {
        ...phase,
        progress: nextProgress,
        status: nextProgress >= 100 ? "Selesai" : "Sedang berjalan",
      };
    }

    const previousPhase = allPhases[index - 1];
    if (phase.status === "Terkunci" && previousPhase?.id === phaseId && percent >= 80) {
      return { ...phase, status: "Belum dimulai" };
    }

    return phase;
  });
  const totalProgress = Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length);
  const nextCompletedQuizzes = currentProgress.completedQuizzes + 1;
  const previousScoreTotal = currentProgress.averageScore * currentProgress.completedQuizzes;
  const averageScore = Math.round((previousScoreTotal + percent) / nextCompletedQuizzes);

  return {
    ...currentProgress,
    phases,
    totalProgress,
    completedLessons: Math.round((currentProgress.totalLessons * totalProgress) / 100),
    completedQuizzes: nextCompletedQuizzes,
    averageScore,
  };
}
