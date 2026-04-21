import React from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar({ theme, toggleTheme }) {
  return (
    <header className="flex items-center justify-between px-6 py-6 lg:px-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-400 to-indigo-500 shadow-lg shadow-brand-500/30">
          <span className="text-xl font-display font-bold text-white">N</span>
        </div>
        <div className="leading-tight">
          <p className="text-lg font-display font-bold text-slate-800 dark:text-slate-50 tracking-wide">
            NovaMock
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Interview Studio
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full glass hover:bg-white/40 dark:hover:bg-slate-800/40 transition flex items-center justify-center text-slate-600 dark:text-slate-300"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="hidden items-center gap-3 text-xs text-brand-600 dark:text-brand-300 font-medium md:flex">
          <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 shadow-sm">
            v2.0
          </span>
        </div>
      </div>
    </header>
  );
}
