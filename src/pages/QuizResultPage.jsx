import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

const API_URL = "http://localhost:3001";

export default function QuizResultPage() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const response = await fetch(`${API_URL}/api/quiz-results/${resultId}`);

        if (!response.ok) {
          throw new Error("Hasil quiz tidak ditemukan.");
        }

        const payload = await response.json();
        setResult(payload.data);
      } catch (err) {
        setError(`${err.message} Jika server baru direstart, data sementara memang akan hilang.`);
      }
    }

    loadResult();
  }, [resultId]);

  const percent = useMemo(() => {
    if (!result) return 0;
    return Math.round((result.score / result.totalQuestions) * 100);
  }, [result]);

  if (error) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <h1 className="font-display text-4xl text-[#172017]">Review belum tersedia</h1>
            <p className="mt-3 text-slate-600">{error}</p>
            <Link to="/roadmap" className="btn-primary mt-6 px-5 py-3">Kembali ke roadmap</Link>
          </div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <p className="font-bold text-slate-600">Memuat hasil quiz...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#1f4725] p-8 text-white shadow-2xl shadow-green-950/20 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-lime-100">Hasil quiz</p>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">{result.quizTitle}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-lime-50/85">
              Review jawabanmu untuk melihat bagian mana yang sudah kuat dan mana yang perlu diulang.
            </p>
            <p className="mt-4 w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-lime-50">
              Progress roadmap sudah diperbarui otomatis.
            </p>
          </div>

          <aside className="section-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Ringkasan</p>
            <p className="mt-3 text-5xl font-extrabold text-[#285b2f]">{percent}%</p>
            <p className="mt-2 font-bold text-[#172017]">{result.score}/{result.totalQuestions} benar</p>
            <p className="mt-1 text-sm text-slate-500">Waktu: {formatDuration(result.durationSeconds)}</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#4d8b41]" style={{ width: `${percent}%` }} />
            </div>
          </aside>
        </section>

        <section className="mt-8 space-y-4">
          {result.answers.map((answer) => (
            <ReviewCard key={answer.questionNumber} answer={answer} />
          ))}
        </section>

        <section className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to={`/quiz/${result.phaseId}`} className="btn-secondary px-5 py-3 text-center text-sm text-[#285b2f]">
            Ulangi quiz
          </Link>
          <Link to={`/learning/${result.phaseId}`} className="btn-primary px-5 py-3 text-center text-sm">
            Kembali ke learning
          </Link>
        </section>
      </main>
    </div>
  );
}

function ReviewCard({ answer }) {
  return (
    <article className="section-card p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
            Soal {answer.questionNumber} - {answer.difficulty}
          </p>
          <h2 className="mt-3 text-lg font-bold leading-7 text-[#172017]">{answer.question}</h2>
        </div>
        <span
          className={[
            "w-fit rounded-full px-3 py-1 text-xs font-bold",
            answer.isCorrect ? "bg-[#e8ffe3] text-[#285b2f]" : "bg-red-50 text-red-700",
          ].join(" ")}
        >
          {answer.isCorrect ? "Benar" : "Salah"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Jawaban kamu</p>
          <p className="mt-2 font-bold text-[#172017]">{answer.selectedAnswer}</p>
        </div>
        <div className="rounded-2xl bg-[#eef8e8] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4d8b41]">Jawaban benar</p>
          <p className="mt-2 font-bold text-[#285b2f]">{answer.correctAnswer}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">Lama mengerjakan quiz: {formatDuration(answer.durationSeconds)}</p>
    </article>
  );
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) return `${remainingSeconds} detik`;
  return `${minutes} menit ${remainingSeconds} detik`;
}
