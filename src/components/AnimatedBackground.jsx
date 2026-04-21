import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-brand-50 dark:bg-slate-950 transition-colors duration-500">
      <div className="pointer-events-none absolute -inset-[40%] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent dark:from-indigo-600/20 opacity-60 dark:opacity-40 animate-pulse-slow" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-teal-200/40 via-transparent to-transparent dark:from-teal-600/20 opacity-60 dark:opacity-40" />
      <div className="absolute inset-0 bg-white/40 dark:bg-black/20 backdrop-blur-[2px]" />
    </div>
  );
}
