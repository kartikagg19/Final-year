import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const disabled = !name || !email;

  function handleSubmit(e) {
    e.preventDefault();
    if (disabled) return;
    onLogin({ name, email });
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center w-full px-4 pb-10">
      <motion.div
        className="max-w-xl w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="relative overflow-hidden w-full">
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
          <CardHeader className="text-center pt-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-brand-400 to-indigo-500 shadow-xl shadow-brand-500/30 mb-6">
              <span className="text-3xl font-display font-bold text-white">N</span>
            </div>
            <CardTitle className="text-3xl lg:text-4xl">
              Enter the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500">
                Studio
              </span>
            </CardTitle>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Simulate high-pressure behavioral and technical interviews with continuous feedback.
            </p>
          </CardHeader>
          <CardContent className="pb-10">
            <form onSubmit={handleSubmit} className="space-y-5 px-0 md:px-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                  Full name
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-50 outline-none backdrop-blur-sm transition focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Demo Candidate"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-800 dark:text-slate-50 outline-none backdrop-blur-sm transition focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10"
                  placeholder="demo@novamock.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-center pt-4">
                <Button type="submit" disabled={disabled} size="lg" className="w-full md:w-auto min-w-[200px]">
                  Get Started
                </Button>
                <div className="text-[11px] text-slate-400 mt-4 text-center">
                  Mock environment • No password required
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
