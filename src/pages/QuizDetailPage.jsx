import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { getLearningPhase } from "../data/learningData";
import { applyQuizProgress, fallbackProgress, getStoredProgress, saveProgress } from "../services/progressApi";

const API_URL = "http://localhost:3001";

export default function QuizDetailPage() {
  const { phaseId } = useParams();
  const navigate = useNavigate();
  const phase = getLearningPhase(phaseId);
  const [answers, setAnswers] = useState({});
  const [answerTimes, setAnswerTimes] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const startedAtRef = useRef(null);
  const questionStartedAtRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    startedAtRef.current = Date.now();
    questionStartedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    questionStartedAtRef.current = Date.now();
  }, [currentQuestionIndex]);

  const score = useMemo(() => {
    if (!phase) return 0;
    return phase.quiz.questions.reduce((total, question, index) => {
      return total + (answers[index] === question.answer ? 1 : 0);
    }, 0);
  }, [answers, phase]);

  if (!phase) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <h1 className="font-display text-4xl text-[#172017]">Quiz tidak ditemukan</h1>
            <Link to="/roadmap" className="btn-primary mt-6 px-5 py-3">Kembali ke roadmap</Link>
          </div>
        </main>
      </div>
    );
  }

  const total = phase.quiz.questions.length;
  const currentQuestion = phase.quiz.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === total - 1;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    const startedAt = startedAtRef.current ?? Date.now();
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const payload = {
      phaseId: phase.id,
      quizTitle: phase.quiz.title,
      score,
      totalQuestions: total,
      durationSeconds,
      answers: phase.quiz.questions.map((question, index) => {
        const selectedAnswer = answers[index];

        return {
          questionNumber: index + 1,
          question: question.question,
          isCorrect: selectedAnswer === question.answer,
          durationSeconds: answerTimes[index] ?? durationSeconds,
          difficulty: question.difficulty,
          selectedAnswer: question.options[selectedAnswer],
          correctAnswer: question.options[question.answer],
        };
      }),
    };

    try {
      const response = await fetch(`${API_URL}/api/quiz-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan hasil quiz.");
      }

      const result = await response.json();
      const percent = Math.round((score / total) * 100);

      if (result.progress) {
        saveProgress(result.progress);
      } else {
        saveProgress(applyQuizProgress(getStoredProgress() ?? fallbackProgress, phase.id, percent));
      }

      navigate(`/quiz-result/${result.data.id}`);
    } catch (error) {
      setSubmitError(`${error.message} Pastikan backend berjalan dengan npm run server.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <Link to={`/learning/${phase.id}`} className="text-sm font-bold text-[#285b2f]">
              Kembali ke learning
            </Link>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">{phase.phase}</p>
            <h1 className="font-display mt-2 text-4xl text-[#172017] sm:text-5xl">{phase.quiz.title}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Jawab pilihan ganda berikut untuk menguji pemahaman materi {phase.title}.
            </p>
          </div>
          <div className="section-card min-w-[210px] p-5">
            <p className="text-sm font-semibold text-slate-500">Progress jawaban</p>
            <p className="mt-2 text-3xl font-extrabold text-[#285b2f]">
              {answeredCount}/{total}
            </p>
          </div>
        </section>

        <section className="section-card p-4 sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Soal {currentQuestionIndex + 1} dari {total}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Kesulitan: <span className="capitalize text-[#285b2f]">{currentQuestion.difficulty}</span>
              </p>
            </div>
            <div className="flex gap-2">
              {phase.quiz.questions.map((question, index) => (
                <button
                  key={question.question}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={[
                    "grid h-10 w-10 place-items-center rounded-full text-sm font-black transition",
                    index === currentQuestionIndex
                      ? "bg-[#285b2f] text-white"
                      : answers[index] !== undefined
                      ? "bg-[#e8ffe3] text-[#285b2f]"
                      : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                  aria-label={`Buka soal ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          <QuestionCard
            question={currentQuestion}
            selected={currentAnswer}
            onSelect={(optionIndex) => {
              const answerStartedAt = questionStartedAtRef.current ?? Date.now();
              setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
              setAnswerTimes({
                ...answerTimes,
                [currentQuestionIndex]: Math.max(1, Math.round((Date.now() - answerStartedAt) / 1000)),
              });
            }}
          />
        </section>

        <section className="mt-6 section-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-[#172017]">
              Selesaikan semua soal untuk melihat skor.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Jawaban masih bisa diubah sebelum submit.
            </p>
            {submitError && <p className="mt-2 text-sm font-semibold text-red-700">{submitError}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={isFirstQuestion}
              className={[
                "rounded-xl px-5 py-3 text-sm font-bold transition",
                isFirstQuestion
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "btn-secondary text-[#285b2f]",
              ].join(" ")}
            >
              Sebelumnya
            </button>

            {!isLastQuestion ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                disabled={currentAnswer === undefined}
                className={[
                  "rounded-xl px-5 py-3 text-sm font-bold transition",
                  currentAnswer === undefined
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "btn-primary",
                ].join(" ")}
              >
                Lanjut
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={answeredCount < total || isSubmitting}
                className={[
                  "rounded-xl px-5 py-3 text-sm font-bold transition",
                  answeredCount < total || isSubmitting
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : "btn-primary",
                ].join(" ")}
              >
                {isSubmitting ? "Menyimpan..." : "Submit quiz"}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function QuestionCard({ question, selected, onSelect }) {
  return (
    <article className="rounded-3xl border border-emerald-950/10 bg-white p-5 sm:p-7">
      <h2 className="text-xl font-bold leading-8 text-[#172017] sm:text-2xl">{question.question}</h2>

      <div className="mt-5 grid gap-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selected === optionIndex;

          return (
            <button
              key={option}
              onClick={() => onSelect(optionIndex)}
              className={[
                "rounded-2xl border p-4 text-left font-semibold transition",
                isSelected
                  ? "border-[#4d8b41] bg-white text-[#285b2f] shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-[#4d8b41]/50",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </article>
  );
}
