import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const features = [
  ["Belajar sesuai levelmu", "AI menyesuaikan materi berdasarkan skill kamu saat ini."],
  ["Roadmap yang jelas", "Dari onboarding quiz hingga jadi engineer profesional."],
  ["Rekomendasi course", "Kursus dari berbagai platform dipilih sesuai progresmu."],
];

export default function SigninPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill email and password.");
      return;
    }

    navigate("/onboarding");
  };

  return (
    <main className="grid min-h-screen bg-[#f7f8f3] lg:grid-cols-[0.95fr_1.05fr]">
      <BrandPanel />

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Welcome back</p>
          <h1 className="font-display mt-3 text-5xl text-[#172017]">Sign in</h1>
          <p className="mt-3 text-slate-500">Please login to continue to your learning dashboard.</p>

          <div className="mt-8 space-y-4">
            <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#4d8b41] focus:ring-4 focus:ring-green-100" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#4d8b41] focus:ring-4 focus:ring-green-100" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <label className="mt-5 flex items-center gap-3 text-sm font-semibold text-slate-600">
            <input type="checkbox" className="h-5 w-5 rounded accent-[#285b2f]" />
            Keep me logged in
          </label>

          <button onClick={handleLogin} className="btn-primary mt-6 h-14 w-full">Sign in</button>

          <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            or
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button className="btn-secondary h-14 w-full">Sign in with Google</button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an account?{" "}
            <Link to="/signup" className="font-bold text-[#285b2f]">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function BrandPanel() {
  return (
    <section className="relative hidden overflow-hidden bg-[#1f4725] p-10 text-white lg:flex lg:flex-col lg:justify-center">
      <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-lime-200/20 blur-3xl" />
      <div className="relative max-w-xl">
        <p className="text-sm font-bold uppercase tracking-[0.26em] text-lime-100">StudySync AI</p>
        <h2 className="font-display mt-4 text-6xl leading-tight">Accessible & adaptive learning.</h2>
        <p className="mt-5 text-lg leading-8 text-lime-50/80">
          Satu ruang belajar untuk mengukur skill, menyusun roadmap, dan memilih course yang tepat.
        </p>
      </div>

      <div className="relative mt-10 grid gap-4">
        {features.map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <h3 className="font-display text-2xl">{title}</h3>
            <p className="mt-2 leading-7 text-lime-50/80">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
