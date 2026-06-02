import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { getCourseRecommendations } from "../services/aiApi";

const STORAGE_KEY = "studysync-last-quiz-result";

export default function QuizResultPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // 1. Mengambil hasil quiz dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setResult(JSON.parse(storedData));
      } else {
        setError("Tidak ada data hasil quiz terakhir yang ditemukan.");
      }
    } catch (err) {
      console.error("Gagal membaca hasil dari localStorage", err);
      setError("Gagal memuat data hasil quiz.");
    }
  }, []);

  // 2. Memanggil AI Recommendations ketika 'result' sudah berhasil dimuat
  useEffect(() => {
    if (!result) return;

    async function fetchAIRecommendations() {
      setLoadingRecs(true);
      try {
        const isStruggling = result.decision === "needs_remedial" || result.decision === "declining";
        const topic = result.quizTitle || "Computer Science";
        
        // Gunakan deskripsi bahasa Inggris yang deskriptif agar SBERT lebih mudah 
        // mencocokkan maknanya dengan judul dan deskripsi kursus Coursera
        const semanticPrompt = isStruggling 
            ? `Fundamental and basic concepts of ${topic} for beginners`
            : `Advanced techniques, best practices, and real-world projects in ${topic}`;
        
        const payload = {
          pretest_profile_text: semanticPrompt,
          taken_courses: [],
          preferred_difficulty: isStruggling ? "Beginner" : "Intermediate",
          skip_beginner: !isStruggling,
          top_n: 2
        };

        const recs = await getCourseRecommendations(payload);
        setRecommendations(recs);
      } catch (err) {
        console.error("Gagal mengambil rekomendasi", err);
      } finally {
        setLoadingRecs(false);
      }
    }

    fetchAIRecommendations();
  }, [result]);

  const percent = useMemo(() => {
    if (!result) return 0;
    return Math.max(0, Math.min(100, Number(result.roadmapPercent ?? result.quizPercent ?? 0)));
  }, [result]);

  const stateConfig = useMemo(() => {
    if (!result) return null;

    const decision = result.decision || "continue";

    const configMap = {
      passed: {
        badge: "Lulus",
        title: "Kamu siap lanjut ke materi berikutnya.",
        desc: "AI melihat performamu stabil dan cukup kuat untuk membuka fase berikutnya.",
        tone: "green",
      },
      needs_remedial: {
        badge: "Perlu ulang",
        title: "Materi ini masih perlu diulang.",
        desc: "AI mendeteksi pemahaman belum stabil. Lebih aman kalau kamu review dulu.",
        tone: "red",
      },
      stagnant: {
        badge: "Stagnan",
        title: "Progress kamu mulai stagnan.",
        desc: "AI menghentikan sesi lebih awal supaya kamu tidak lanjut saat progress tidak naik.",
        tone: "amber",
      },
      declining: {
        badge: "Turun",
        title: "Performa kamu sedang menurun.",
        desc: "AI melihat penurunan performa di beberapa jawaban terakhir.",
        tone: "orange",
      },
      continue: {
        badge: "Lanjut",
        title: "Quiz selesai dan sesi dinilai aman untuk lanjut.",
        desc: "AI belum menemukan sinyal kuat untuk menghentikan sesi lebih awal.",
        tone: "blue",
      },
    };

    return configMap[decision] ?? configMap.continue;
  }, [result]);

  if (error) {
    return (
      <div className="page-shell">
        <AppNavbar />
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="section-card p-8 text-center">
            <h1 className="font-display text-4xl text-[#172017]">Review belum tersedia</h1>
            <p className="mt-3 text-slate-600">{error}</p>
            <Link to="/roadmap" className="btn-primary mt-6 px-5 py-3">
              Kembali ke roadmap
            </Link>
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
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-lime-100">
              Hasil quiz
            </p>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              {result.quizTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-lime-50/85">
              {stateConfig?.desc}
            </p>
            <p className="mt-4 w-fit rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-lime-50">
              Progress roadmap sudah diperbarui otomatis.
            </p>
          </div>

          <aside className="section-card p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              Ringkasan
            </p>
            <p className="mt-3 text-5xl font-extrabold text-[#285b2f]">{percent}%</p>
            <p className="mt-2 font-bold text-[#172017]">
              {result.correctCount} pertanyaan benar
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {stateConfig?.badge || "Selesai"}
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#4d8b41]"
                style={{ width: `${percent}%` }}
              />
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="section-card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-[#172017]">AI evaluation summary</h2>
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-bold",
                  stateConfig?.tone === "green"
                    ? "bg-[#e8ffe3] text-[#285b2f]"
                    : stateConfig?.tone === "red"
                    ? "bg-red-50 text-red-700"
                    : stateConfig?.tone === "amber"
                    ? "bg-amber-50 text-amber-700"
                    : stateConfig?.tone === "orange"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-blue-50 text-blue-700",
                ].join(" ")}
              >
                {stateConfig?.badge || "Status"}
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Berikut adalah evaluasi AI berdasarkan performa dan pola jawabanmu selama sesi ini.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#eef8e8] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4d8b41]">
                  Status
                </p>
                <p className="mt-2 text-sm font-semibold text-[#285b2f]">
                  {stateConfig?.title}
                </p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                  Saran AI
                </p>
                <p className="mt-2 text-sm font-semibold text-red-700">
                  {result.decision === "passed" || result.decision === "continue"
                    ? "Pertahankan performamu dan lanjut ke materi rekomendasi di samping."
                    : "Sebaiknya ulangi materi ini dan fokus pada rekomendasi di samping."}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Alasan detail AI: {result.reason || "Belum ada alasan tambahan dari backend."}
            </p>
          </div>

          <div className="section-card p-6">
            <h2 className="font-display text-2xl text-[#172017]">Rekomendasi course AI</h2>
            
            <div className="mt-4">
              {loadingRecs ? (
                <div className="rounded-3xl border border-dashed border-[#4d8b41]/30 bg-[#f7fff4] p-5 text-center">
                  <p className="text-sm font-bold text-[#285b2f] animate-pulse">
                    AI sedang meracik rekomendasi kursus untukmu...
                  </p>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recommendations.map((course, idx) => (
                    <a 
                      key={idx}
                      href={course.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-[#4d8b41] hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#e8ffe3] px-2 py-1 text-xs font-bold text-[#285b2f]">
                          {course.match_score}% Cocok
                        </span>
                        <span className="text-xs font-semibold text-slate-500 capitalize">
                          {course.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#172017] group-hover:text-[#285b2f]">
                        {course.title}
                      </h3>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                  <p className="text-sm text-slate-500">
                    Belum ada rekomendasi kursus yang tersedia saat ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/quiz/${result.phaseId}`}
            className="btn-secondary px-5 py-3 text-center text-sm text-[#285b2f]"
          >
            Ulangi quiz
          </Link>
          <Link
            to={`/learning/${result.phaseId}`}
            className="btn-primary px-5 py-3 text-center text-sm"
          >
            Kembali ke learning
          </Link>
        </section>
      </main>
    </div>
  );
}