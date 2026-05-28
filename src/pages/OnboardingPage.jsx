import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: "software",
    level: "beginner",
    interest: "frontend",
    time: "1-2 jam",
    style: "video",
  });

  const data = [
    {
      key: "goal",
      title: "Apa tujuan belajarmu?",
      subtitle: "Pilih yang paling sesuai denganmu",
      options: [
        ["software", "Jadi software engineer", "Ingin bekerja sebagai developer profesional"],
        ["upgrade", "Upgrade skill saat ini", "Sudah kerja, ingin belajar teknologi baru"],
        ["freelance", "Proyek sampingan / freelance", "Ingin bikin produk atau kerja freelance"],
        ["explore", "Eksplorasi / ingin belajar", "Penasaran ingin tahu coding itu apa"],
      ],
    },
    {
      key: "level",
      title: "Seberapa jauh kemampuanmu?",
      subtitle: "Pilih level belajarmu sekarang",
      options: [
        ["beginner", "Pemula", "Belum terlalu paham coding"],
        ["basic", "Dasar", "Sudah paham HTML, CSS, atau sedikit JavaScript"],
        ["intermediate", "Menengah", "Sudah pernah membuat project sederhana"],
        ["advanced", "Lanjutan", "Ingin memperdalam skill profesional"],
      ],
    },
    {
      key: "interest",
      title: "Bidang apa yang kamu minati?",
      subtitle: "Ini membantu kami memilih course yang cocok",
      options: [
        ["frontend", "Frontend Development", "Membuat tampilan website dan aplikasi"],
        ["backend", "Backend Development", "Membuat server, API, dan database"],
        ["ai", "AI / Machine Learning", "Belajar kecerdasan buatan"],
        ["mobile", "Mobile Development", "Membuat aplikasi Android/iOS"],
      ],
    },
    {
      key: "time",
      title: "Berapa waktu belajar per hari?",
      subtitle: "Pilih waktu yang realistis",
      options: [
        ["30 menit", "30 menit", "Belajar ringan setiap hari"],
        ["1-2 jam", "1-2 jam", "Belajar cukup rutin"],
        ["3-4 jam", "3-4 jam", "Belajar intensif"],
        ["fleksibel", "Fleksibel", "Menyesuaikan waktu kosong"],
      ],
    },
    {
      key: "style",
      title: "Gaya belajar favoritmu?",
      subtitle: "Agar rekomendasi course lebih sesuai",
      options: [
        ["video", "Video Course", "Belajar lewat penjelasan video"],
        ["project", "Project Based", "Belajar sambil membuat project"],
        ["reading", "Artikel / Dokumentasi", "Belajar lewat bacaan"],
        ["mixed", "Campuran", "Gabungan video, project, dan bacaan"],
      ],
    },
  ];

  const current = data[step - 1];

  const handleSelect = (value) => {
    setAnswers({ ...answers, [current.key]: value });
  };

  const handleNext = () => {
    if (step < data.length) {
      setStep(step + 1);
      return;
    }

    console.log("Data onboarding:", answers);
    navigate("/home");
  };

  return (
    <div className="page-shell min-h-screen">
      <header className="border-b border-emerald-950/10 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-2xl text-[#172017]">StudySync <span className="text-[#4d8b41]">AI</span></p>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Onboarding</p>
          </div>
          <p className="rounded-full bg-[#eef8e8] px-4 py-2 text-sm font-bold text-[#285b2f]">
            Langkah {step} dari {data.length}
          </p>
        </div>
        <div className="h-1.5 bg-slate-100">
          <div className="h-full bg-[#4d8b41] transition-all" style={{ width: `${(step / data.length) * 100}%` }} />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <aside className="section-card h-fit p-6">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Personalized path</p>
          <h1 className="font-display mt-3 text-4xl leading-tight text-[#172017]">Biar AI menyusun jalur yang masuk akal.</h1>
          <p className="mt-4 leading-7 text-slate-600">
            Jawabanmu akan dipakai untuk menentukan level awal, rekomendasi course, dan ritme belajar harian.
          </p>
          <div className="mt-6 space-y-3">
            {data.map((item, index) => (
              <div key={item.key} className="flex items-center gap-3">
                <div className={["grid h-8 w-8 place-items-center rounded-full text-xs font-black", index + 1 <= step ? "bg-[#285b2f] text-white" : "bg-slate-100 text-slate-400"].join(" ")}>
                  {index + 1}
                </div>
                <p className={index + 1 === step ? "font-bold text-[#172017]" : "font-semibold text-slate-500"}>{item.title}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="section-card p-5 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Pertanyaan {step}</p>
          <h2 className="font-display mt-3 text-4xl leading-tight text-[#172017]">{current.title}</h2>
          <p className="mt-2 text-slate-600">{current.subtitle}</p>

          <div className="mt-7 grid gap-3">
            {current.options.map(([value, title, desc]) => {
              const active = answers[current.key] === value;

              return (
                <button
                  key={value}
                  onClick={() => handleSelect(value)}
                  className={[
                    "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
                    active
                      ? "border-[#4d8b41] bg-[#eef8e8] shadow-lg shadow-green-950/5"
                      : "border-slate-200 bg-white hover:border-[#4d8b41]/50",
                  ].join(" ")}
                >
                  <span className={["mt-1 h-5 w-5 shrink-0 rounded-full border", active ? "border-[6px] border-[#4d8b41]" : "border-slate-300"].join(" ")} />
                  <span>
                    <span className={["block font-bold", active ? "text-[#285b2f]" : "text-[#172017]"].join(" ")}>{title}</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
              className="rounded-xl px-4 py-3 font-bold text-slate-500 transition hover:bg-slate-100"
            >
              Kembali
            </button>
            <button onClick={handleNext} className="btn-primary px-6 py-3">
              {step === data.length ? "Selesai" : "Lanjut"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
