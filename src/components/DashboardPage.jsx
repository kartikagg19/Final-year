import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { History, Play, Award, BrainCircuit, Activity } from "lucide-react";

export default function DashboardPage({ user, onNewInterview }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("interviewHistory");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const averageScore = history.length > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / history.length)
    : 0;

  return (
    <div className="px-4 pb-10 w-full">
      <motion.div
        className="mx-auto flex max-w-6xl flex-col gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6 md:p-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">
              Welcome back, <span className="text-brand-500">{user.name.split(" ")[0]}</span>!
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xl">
              Ready to crush your next interview? Track your progress, review past feedback, and continuously improve your soft skills.
            </p>
          </div>
          <Button onClick={onNewInterview} size="lg" className="shrink-0 flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-brand-500/25 transition-all">
            <Play className="w-5 h-5 fill-current" />
            Start Mock Interview
          </Button>
        </section>

        {/* Stats Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card border-none bg-transparent max-h-40">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400">
                <History className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Interviews</p>
                <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-100 mt-1">{history.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-none bg-transparent max-h-40">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Average Score</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <p className="text-3xl font-bold font-display text-slate-800 dark:text-slate-100">{averageScore}</p>
                  <span className="text-sm text-slate-400">/ 100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-none bg-transparent max-h-40">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recent Status</p>
                <p className="text-xl font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  {history.length > 0 ? (history[0].score >= 80 ? "Excellent" : history[0].score >= 60 ? "Good" : "Needs Practice") : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* History Log Section */}
        <section>
          <div className="flex items-center gap-2 mb-6 ml-2">
            <BrainCircuit className="w-5 h-5 text-brand-500" />
            <h2 className="text-xl font-display font-semibold text-slate-800 dark:text-slate-100">Recent Sessions</h2>
          </div>
          
          <div className="grid gap-4">
            {history.length === 0 ? (
              <div className="glass-card p-10 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-300 dark:border-slate-700">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=mock" alt="Empty" className="w-24 h-24 mb-4 opacity-50 grayscale" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">No interviews yet!</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm">
                  Click the "Start Mock Interview" button to begin your first session and get AI-powered feedback.
                </p>
              </div>
            ) : (
              history.map((session, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={session.id || idx}
                  className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:bg-white/40 dark:hover:bg-slate-800/40"
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shadow-inner">
                      {session.config?.role.substring(0, 2).toUpperCase() || "IT"}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                        {session.config?.role || "General Interview"}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex gap-2">
                        <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{session.config?.level || "Beginner"}</span>
                        <span>•</span>
                        <span className="capitalize">{session.config?.focus || "Mixed"}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Score</p>
                      <p className={`text-xl font-bold ${session.score >= 80 ? 'text-emerald-500' : session.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {session.score}<span className="text-xs font-normal text-slate-400 ml-1">/100</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
