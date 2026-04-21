import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Settings, Clock, Crosshair, Brain, ShieldAlert, ArrowLeft } from "lucide-react";

const difficultyOptions = [
  { id: "beginner", label: "Fresher / Beginner", desc: "First interviews, internships." },
  { id: "intermediate", label: "Experienced", desc: "1–3 years experience, individual contributor." },
  { id: "advanced", label: "Advanced", desc: "Senior / lead roles." }
];

const durations = [5, 10, 15];

export default function SetupPage({ user, onStart, onCancel }) {
  const [level, setLevel] = useState("beginner");
  const [duration, setDuration] = useState(10);
  const [gender, setGender] = useState("female");
  const [role, setRole] = useState("Frontend Developer");
  const [focus, setFocus] = useState("behavioral");
  const [stress, setStress] = useState(40);

  function handleSubmit(e) {
    e.preventDefault();
    onStart({
      level,
      durationMinutes: duration,
      interviewerGender: gender,
      role,
      focus,
      stressLevel: stress
    });
  }

  return (
    <div className="px-4 pb-10 w-full">
      <motion.div
        className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center gap-4">
             <Button variant="ghost" className="p-2 w-auto h-auto rounded-full" onClick={onCancel} aria-label="Go Back">
                <ArrowLeft className="w-5 h-5" />
             </Button>
             <div>
                <p className="text-xs uppercase tracking-[0.25em] text-brand-500 font-semibold">
                  Session Configuration
                </p>
                <CardTitle className="mt-1 text-2xl font-display">
                  Design your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">mock interview</span>
                </CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                  Target Role / Title
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-50 outline-none backdrop-blur-sm transition focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Frontend Developer, HR Manager"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                   Experience Level
                </label>
                <div className="grid gap-3 md:grid-cols-3">
                  {difficultyOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setLevel(opt.id)}
                      className={
                        "rounded-2xl border px-4 py-3 text-left transition " +
                        (level === opt.id
                          ? "border-brand-500 bg-brand-500/10 shadow-sm"
                          : "border-slate-200 dark:border-white/10 hover:border-brand-300 dark:hover:border-white/30 bg-white/50 dark:bg-slate-900/30")
                      }
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        {opt.label}
                      </div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </label>
                  <div className="flex gap-2">
                    {durations.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDuration(m)}
                        className={
                          "flex-1 justify-center rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors " +
                          (duration === m
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500"
                            : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
                        }
                      >
                        {m} min
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1.5">
                    <Crosshair className="w-3.5 h-3.5" /> Interview Focus
                  </label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-50 outline-none backdrop-blur-sm transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 cursor-pointer"
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                  >
                    <option value="behavioral">Behavioral / Culture Fit</option>
                    <option value="technical">Technical / Skills</option>
                    <option value="managerial">Leadership / Management</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" /> AI Voice / Avatar
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={
                        "flex-1 flex justify-center items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors " +
                        (gender === "female"
                          ? "border-pink-500 bg-pink-500/10 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
                      }
                    >
                      <span>👩‍💼</span> Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={
                        "flex-1 flex justify-center items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors " +
                        (gender === "male"
                          ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
                      }
                    >
                      <span>👨‍💼</span> Male
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1 flex justify-between">
                    <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Stress Level</span>
                    <span className="text-brand-600 dark:text-brand-400">
                      {stress}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={stress}
                    onChange={(e) => setStress(Number(e.target.value))}
                    className="w-full accent-brand-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                    Higher values trigger faster pace, tougher tone & follow‑ups.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] text-slate-500">
                  Ready to test your skills?
                </div>
                <Button type="submit" size="lg">Start Session</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm self-start border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-500" /> Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <ul className="space-y-3">
              <li className="flex gap-2">
                 <span className="text-brand-500 shrink-0">✓</span> 
                 <span>Real-time speech-to-text processing API.</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-brand-500 shrink-0">✓</span> 
                 <span>Adaptive AI queries varying by difficulty.</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-brand-500 shrink-0">✓</span> 
                 <span>Stress simulation impacts AI speech rate and tone.</span>
              </li>
            </ul>
            <div className="mt-6 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-4 text-xs">
               <p className="font-semibold text-brand-700 dark:text-brand-400 mb-1">Make sure you are in a quiet place!</p>
               <p className="text-slate-500 dark:text-slate-400">
                 The AI will evaluate the clarity of your voice answers and score them using local heuristics.
               </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
