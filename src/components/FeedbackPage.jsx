import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle2, TrendingUp, Presentation, AlertCircle, ArrowRight, Home } from "lucide-react";

function MetricBar({ label, value, colorClass }) {
  return (
    <div className="space-y-1">
       <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
         <span>{label}</span>
         <span>{value}%</span>
       </div>
       <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
             initial={{ width: 0 }} 
             animate={{ width: `${value}%` }} 
             transition={{ duration: 1, ease: "easeOut" }} 
             className={`h-full ${colorClass}`} 
          />
       </div>
    </div>
  );
}

export default function FeedbackPage({ user, session, onRestart, onDashboard }) {
  const { feedback, answers, config } = session || {};

  const safeScore = typeof feedback?.overallScore === "number" ? feedback.overallScore : null;
  const metrics = feedback?.metrics || { clarity: 0, depth: 0, confidence: 0 };
  const communication = feedback?.communication || "No detailed feedback available.";
  const strengths = feedback?.strengths || ["None detected"];
  const weaknesses = feedback?.weaknesses || ["Try to practice more answers."];
  const tips = feedback?.tips || [];

  return (
    <div className="px-4 pb-12 w-full">
      <motion.div
        className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex-1 space-y-6">
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onDashboard} className="rounded-full px-3" aria-label="Home">
                 <Home className="w-4 h-4 mr-2" /> Dashboard
              </Button>
           </div>
           
           <Card className="glass-card shadow-2xl border-brand-500/20">
             <CardHeader className="text-center md:text-left md:flex md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-white/5 pb-6">
               <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-500 font-semibold mb-2">
                    Interview Report
                  </p>
                  <CardTitle className="text-3xl font-display">
                    Great job, <span className="text-brand-600 dark:text-brand-400">{user.name.split(" ")[0] || user.name}</span> 👏
                  </CardTitle>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Here's a breakdown of your performance during the {config.durationMinutes}-minute {config.role} interview.
                  </p>
               </div>
               
               <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
                  <div className="relative flex items-center justify-center w-24 h-24">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                       <path className="text-slate-200 dark:text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                       <motion.path 
                          initial={{ strokeDasharray: "0, 100" }} 
                          animate={{ strokeDasharray: `${safeScore || 0}, 100` }} 
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`${safeScore >= 80 ? 'text-emerald-500' : safeScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}
                          strokeWidth="3" strokeDasharray="0, 100" strokeLinecap="round" stroke="currentColor" fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                       />
                     </svg>
                     <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">{safeScore || 0}</span>
                     </div>
                  </div>
                  <span className="text-xs uppercase font-bold text-slate-400 mt-2 tracking-widest">Overall Score</span>
               </div>
             </CardHeader>
             
             <CardContent className="pt-6 space-y-8">
               {/* Metrics section */}
               <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                     <TrendingUp className="w-4 h-4 text-brand-500" /> Performance Breakdown
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                     <MetricBar label="Clarity" value={metrics.clarity} colorClass="bg-sky-500" />
                     <MetricBar label="Depth" value={metrics.depth} colorClass="bg-indigo-500" />
                     <MetricBar label="Confidence" value={metrics.confidence} colorClass="bg-emerald-500" />
                  </div>
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                    {communication}
                  </p>
               </div>
               
               <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="glass-panel p-5 border-emerald-500/20 bg-emerald-500/5">
                     <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4" /> Strong Points
                     </h4>
                     <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {strengths.map((s, i) => (
                           <li key={i} className="flex gap-2 items-start"><span className="text-emerald-500">•</span> <span>{s}</span></li>
                        ))}
                     </ul>
                  </div>
                  
                  {/* Weaknesses */}
                  <div className="glass-panel p-5 border-amber-500/20 bg-amber-500/5">
                     <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4" /> Areas to Improve
                     </h4>
                     <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {weaknesses.map((w, i) => (
                           <li key={i} className="flex gap-2 items-start"><span className="text-amber-500">•</span> <span>{w}</span></li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* Tips */}
               <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 p-5">
                 <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 mb-3 flex items-center gap-2">
                    <Presentation className="w-4 h-4" /> Recommended Next Steps
                 </h4>
                 <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 pl-1">
                   {tips.map((tip, idx) => (
                     <li key={idx} className="flex gap-2"><ArrowRight className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" /> <span>{tip}</span></li>
                   ))}
                 </ul>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button size="lg" className="w-full sm:w-auto" onClick={onRestart}>
                    New Session
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onDashboard}>
                    Return to Dashboard
                  </Button>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* SIDEBAR DETAILS */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                Interview Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="space-y-3">
                 <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                   <span className="text-slate-500">Role</span>
                   <span className="font-medium text-right max-w-[150px] truncate">{config.role}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                   <span className="text-slate-500">Duration</span>
                   <span className="font-medium">{config.durationMinutes} min</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                   <span className="text-slate-500">Focus</span>
                   <span className="font-medium capitalize">{config.focus}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                   <span className="text-slate-500">Q's Answered</span>
                   <span className="font-medium">{answers.length}</span>
                 </div>
              </div>
              
              <div className="pt-4 px-3 py-4 rounded-xl bg-brand-500/10 border border-brand-500/20 mt-4">
                 <p className="font-semibold text-brand-700 dark:text-brand-400 text-xs mb-1">
                   Show off your effort!
                 </p>
                 <p className="text-xs text-brand-600/80 dark:text-brand-300/80 leading-relaxed">
                   Looking for a new role? Share a screenshot of this report on LinkedIn to demonstrate your dedication to upskilling.
                 </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
