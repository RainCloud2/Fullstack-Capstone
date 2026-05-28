import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/home" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Quiz", to: "/quiz" },
  { label: "Course", to: "/course" },
];

export default function AppNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-950/10 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/home" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#285b2f] text-lg font-black text-white shadow-lg shadow-green-900/15">
            S
          </div>
          <div>
            <p className="font-display text-2xl leading-none text-[#172017]">
              StudySync <span className="text-[#4d8b41]">AI</span>
            </p>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Adaptive learning
            </p>
          </div>
        </Link>

        <div className="hidden items-center rounded-full border border-emerald-950/10 bg-[#f4f6ef] p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-full px-4 py-2 text-sm font-bold transition",
                  isActive
                    ? "bg-white text-[#285b2f] shadow-sm"
                    : "text-slate-500 hover:text-[#285b2f]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3 rounded-full border border-emerald-950/10 bg-white px-2 py-2 shadow-sm">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-[#172017]">Cariensya</p>
            <p className="text-xs text-slate-500">7 day streak</p>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dff4d6] font-extrabold text-[#285b2f]">
            C
          </div>
        </div>
      </nav>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold",
                isActive
                  ? "bg-[#285b2f] text-white"
                  : "bg-white text-slate-500 ring-1 ring-emerald-950/10",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
