import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !dob || !email || !password) {
      alert("Please complete all fields.");
      return;
    }

    navigate("/onboarding");
  };

  return (
    <main className="grid min-h-screen bg-[#f7f8f3] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#1f4725] p-10 text-white lg:flex lg:flex-col lg:justify-center">
        <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-lime-200/20 blur-3xl" />
        <div className="relative max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.26em] text-lime-100">StudySync AI</p>
          <h2 className="font-display mt-4 text-6xl leading-tight">Mulai dengan roadmap yang pas.</h2>
          <p className="mt-5 text-lg leading-8 text-lime-50/80">
            Buat akun, jawab onboarding singkat, lalu dapatkan jalur belajar yang sesuai targetmu.
          </p>
        </div>
        <div className="relative mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime-100">Preview</p>
          <p className="font-display mt-3 text-3xl">Frontend path, 40 materi, 8 quiz</p>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[30%] rounded-full bg-lime-200" />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#4d8b41]">Create account</p>
          <h1 className="font-display mt-3 text-5xl text-[#172017]">Sign up</h1>
          <p className="mt-3 text-slate-500">Sign up to continue using StudySync AI.</p>

          <div className="mt-8 space-y-4">
            <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#4d8b41] focus:ring-4 focus:ring-green-100" type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#4d8b41] focus:ring-4 focus:ring-green-100" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#4d8b41] focus:ring-4 focus:ring-green-100" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#4d8b41] focus:ring-4 focus:ring-green-100" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button onClick={handleSignup} className="btn-primary mt-6 h-14 w-full">Sign up</button>

          <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            or
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button className="btn-secondary h-14 w-full">Continue with Google</button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/" className="font-bold text-[#285b2f]">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
