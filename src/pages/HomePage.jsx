import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { fallbackProgress, fetchProgress } from "../services/progressApi";

export default function HomePage() {
  const [progress, setProgress] = useState(fallbackProgress);

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => setProgress(fallbackProgress));
  }, []);

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#1f4725] p-8 text-white shadow-2xl shadow-green-950/20 sm:p-10">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-lime-200/20 blur-3xl" />
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-lime-100">
              Frontend Engineer Path
            </p>
            <h1 className="font-display max-w-2xl text-4xl leading-tight sm:text-5xl">
              Selamat datang, Cariensya.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-lime-50/85 sm:text-lg">
              Kamu sudah menyelesaikan {progress.totalProgress}% roadmap. Mulai dari fase pertama, kerjakan quiz, lalu progress akan naik otomatis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/roadmap" className="btn-secondary px-5 py-3 text-[#1f4725]">
                Lanjutkan roadmap
              </Link>
              <Link to="/quiz" className="rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition hover:bg-white/10">
                Mulai quiz
              </Link>
            </div>
          </div>

          <div className="section-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Target hari ini
            </p>
            <div className="mt-5 space-y-4">
              <MiniTask label="Pelajari Closure & Scope" done />
              <MiniTask label="Review Git branching" done />
              <MiniTask label="Kerjakan quiz penguat" />
            </div>
            <div className="mt-6 rounded-2xl bg-[#eef8e8] p-4">
              <p className="text-sm font-bold text-[#285b2f]">Streak 7 hari</p>
              <p className="mt-1 text-sm text-slate-600">Pertahankan ritme kecil tapi konsisten.</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <InfoCard title="Level" value="Beginner" desc="Frontend path" />
          <InfoCard
            title="Materi selesai"
            value={`${progress.completedLessons} / ${progress.totalLessons}`}
            desc={`${progress.totalProgress}% roadmap`}
          />
          <InfoCard title="Rata-rata skor" value={`${progress.averageScore}%`} desc={`${progress.completedQuizzes} quiz selesai`} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Skill Tree</p>
                <h2 className="font-display mt-1 text-3xl">Progress belajar</h2>
              </div>
              <Link to="/roadmap" className="text-sm font-bold text-[#285b2f]">Detail</Link>
            </div>
            <SkillTree />
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#4d8b41]" style={{ width: `${progress.totalProgress}%` }} />
            </div>
            <p className="mt-2 text-right text-sm font-bold text-[#285b2f]">{progress.totalProgress}% selesai</p>
          </div>

          <div className="section-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Rekomendasi AI</p>
                <h2 className="font-display mt-1 text-3xl">Course hari ini</h2>
              </div>
              <Link to="/course" className="text-sm font-bold text-[#285b2f]">Lihat semua</Link>
            </div>

            <div className="mt-5 space-y-3">
              <CourseItem title="JavaScript: The Hard Parts" meta="Frontend Masters - 6 jam" tag="Best fit" />
              <CourseItem title="ES6+ In Depth - Modern JS" meta="Udemy - 4.5 jam - * 4.8" tag="Video" />
              <CourseItem title="JavaScript Closure Explained" meta="YouTube - 45 menit - Gratis" tag="Gratis" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoCard({ title, value, desc }) {
  return (
    <div className="section-card p-5">
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-[#172017]">{value}</h2>
      <p className="mt-1 text-sm font-bold text-[#4d8b41]">{desc}</p>
    </div>
  );
}

function SkillTree() {
  const node = (text, active = true) => (
    <div
      className={[
        "rounded-full px-4 py-2 text-sm font-bold",
        active
          ? "bg-[#4d8b41] text-white shadow-lg shadow-green-900/10"
          : "border border-slate-200 bg-white text-slate-400",
      ].join(" ")}
    >
      {text}
    </div>
  );

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">{node("HTML & CSS")}{node("Git Basics")}</div>
      <div>{node("JavaScript Dasar")}</div>
      <div>{node("JavaScript Lanjutan", false)}</div>
      <div className="flex flex-wrap justify-center gap-3">{node("React", false)}{node("TypeScript", false)}</div>
      <div>{node("Portfolio Project", false)}</div>
    </div>
  );
}

function CourseItem({ title, meta, tag }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-950/10 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 className="font-bold text-[#172017]">{title}</h4>
        <p className="mt-1 text-sm text-slate-500">{meta}</p>
        <span className="mt-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {tag}
        </span>
      </div>
      <button className="btn-secondary px-5 py-2 text-sm text-[#285b2f]">Mulai</button>
    </div>
  );
}

function MiniTask({ label, done = false }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "grid h-8 w-8 place-items-center rounded-full text-xs font-black",
          done ? "bg-[#285b2f] text-white" : "bg-white text-slate-400 ring-1 ring-slate-200",
        ].join(" ")}
      >
        {done ? "OK" : ""}
      </div>
      <p className={done ? "font-semibold text-[#172017]" : "font-semibold text-slate-500"}>{label}</p>
    </div>
  );
}
