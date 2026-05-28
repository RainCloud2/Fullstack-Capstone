import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { getLearningPhase } from "../data/learningData";
import { fallbackProgress, fetchProgress } from "../services/progressApi";

export default function LearningPage() {
  const { phaseId } = useParams();
  const phase = getLearningPhase(phaseId);
  const [progress, setProgress] = useState(fallbackProgress);

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => setProgress(fallbackProgress));
  }, []);

  if (!phase) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <h1 className="font-display text-4xl text-[#172017]">Materi tidak ditemukan</h1>
            <Link to="/roadmap" className="btn-primary mt-6 px-5 py-3">Kembali ke roadmap</Link>
          </div>
        </main>
      </div>
    );
  }

  const phaseProgress = progress.phases.find((item) => item.id === phase.id);
  const currentProgress = phaseProgress?.progress ?? phase.progress;

  return (
    <div className="page-shell">
      <AppNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#1f4725] p-8 text-white shadow-2xl shadow-green-950/20 sm:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-lime-200/20 blur-3xl" />
            <Link to="/roadmap" className="text-sm font-bold text-lime-100/90 hover:text-white">
              Kembali ke roadmap
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.24em] text-lime-100">
              {phase.phase}
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              {phase.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-lime-50/85 sm:text-lg">
              {phase.desc}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {phase.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/12 px-3 py-1 text-sm font-bold text-lime-50">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <aside className="section-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Learning focus</p>
            <h2 className="font-display mt-2 text-3xl text-[#172017]">{phase.focus}</h2>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#4d8b41]" style={{ width: `${currentProgress}%` }} />
            </div>
            <p className="mt-3 text-sm font-bold text-[#285b2f]">{currentProgress}% selesai</p>
            <Link to={`/quiz/${phase.id}`} className="btn-primary mt-7 h-12 w-full">
              Mulai quiz materi ini
            </Link>
          </aside>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Rekomendasi course</p>
              <h2 className="font-display mt-2 text-4xl text-[#172017]">Materi untuk {phase.title}</h2>
            </div>
            <span className="w-fit rounded-full bg-[#eef8e8] px-4 py-2 text-sm font-bold text-[#285b2f]">
              Placeholder data
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {phase.courses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function CourseCard({ course }) {
  return (
    <article className="section-card flex min-h-[250px] flex-col p-6 transition hover:-translate-y-1 hover:border-[#4d8b41]/30">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{course.provider}</p>
      <h3 className="font-display mt-3 text-3xl leading-tight text-[#172017]">{course.title}</h3>
      <p className="mt-3 text-sm font-semibold text-slate-500">{course.duration} - {course.level}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-[#eef8e8] px-3 py-1 text-xs font-bold text-[#285b2f]">
            {tag}
          </span>
        ))}
      </div>
      <button className="btn-secondary mt-auto h-11 w-full text-sm text-[#285b2f]">
        Lihat course
      </button>
    </article>
  );
}
