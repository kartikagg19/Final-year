import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useWebcam } from "@/hooks/useWebcam";
import { useInterview } from "@/hooks/useInterview";
import { Mic, MicOff, VideoOff, Volume2, VolumeX, ShieldAlert, SkipForward, RefreshCw, Send, CheckCircle2, Play, Square, Loader2 } from "lucide-react";

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function InterviewPage({ config, user, onFinish }) {
  const [answerDraft, setAnswerDraft] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  const { videoRef, error: webcamError } = useWebcam(true);

  const {
    started,
    completed,
    secondsLeft,
    currentQuestion,
    answers,
    feedback,
    isThinking,
    start,
    finish,
    answerQuestion,
  } = useInterview({
    level: config.level,
    durationMinutes: config.durationMinutes,
    role: config.role,
  });

  const interviewerLabel = useMemo(
    () => config.interviewerGender === "female" ? "Priya (AI)" : "Arjun (AI)",
    [config.interviewerGender]
  );
  
  const avatarUrl = useMemo(
    () => config.interviewerGender === "female" 
      ? "https://api.dicebear.com/7.x/bottts/svg?seed=Priya&baseColor=ffb6c1" 
      : "https://api.dicebear.com/7.x/bottts/svg?seed=Arjun&baseColor=4f46e5",
    [config.interviewerGender]
  );

  // 🔊 Speak Question Helper
  const speakQuestion = (textToSpeak) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    
    if (!voiceEnabled || !textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-US";
    utterance.rate = config.stressLevel >= 70 ? 1.15 : 0.95;
    utterance.pitch = config.interviewerGender === "female" ? 1.1 : 0.9;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferred = voices.find((v) =>
        v.name.toLowerCase().includes(config.interviewerGender === "female" ? "female" : "male")
      );
      if (preferred) utterance.voice = preferred;
    }
    
    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Speak when currentQuestion changes
  useEffect(() => {
    if (started && !completed && currentQuestion && !isThinking) {
      speakQuestion(currentQuestion);
    }
    return () => window.speechSynthesis && window.speechSynthesis.cancel();
  }, [currentQuestion, started, completed, voiceEnabled, isThinking]);

  function handleRepeat() {
       speakQuestion(currentQuestion);
  }

  // 🎙️ Setup browser speech recognition (your voice -> text)
  const answerDraftRef = useRef("");
  
  useEffect(() => {
    answerDraftRef.current = answerDraft;
  }, [answerDraft]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setAnswerDraft(transcript.trim());
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error, e.message);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      // Auto-submit when speech recognition ends (either manually or by auto-pause)
      const finalDraft = answerDraftRef.current.trim();
      if (finalDraft && !isThinkingRef.current) {
         handleSubmitAnswerRef.current(finalDraft);
      }
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const isThinkingRef = useRef(isThinking);
  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  const handleSubmitAnswerRef = useRef(null);
  useEffect(() => {
    handleSubmitAnswerRef.current = async (draftValue) => {
      if (!draftValue || isThinking) return;
      
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      
      setAnswerDraft("");
      answerDraftRef.current = "";
      await answerQuestion(draftValue);
    };
  }, [isThinking, answerQuestion]);

  async function handleSubmitAnswer() {
    const draft = answerDraftRef.current.trim();
    if (!draft || isThinking) return;
    
    if (isRecording && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
    } else {
        handleSubmitAnswerRef.current(draft);
    }
  }

  function handleEnd() {
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    if(isRecording && recognitionRef.current) {
        // Prevent auto-submit if we are manually ending the whole interview
        answerDraftRef.current = ""; 
        recognitionRef.current.stop();
    }
    const fb = finish();
    onFinish({ answers, feedback: fb });
  }

  function handleToggleRecording() {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setAnswerDraft(""); 
      answerDraftRef.current = "";
      try {
        recognition.start();
        setIsRecording(true);
      } catch (e) {
        console.error("Speech recognition start error:", e);
      }
    }
  }

  const stressColor = config.stressLevel >= 70 ? 'text-rose-500' : 'text-emerald-500';

  return (
    <div className="px-4 pb-10 w-full">
      <motion.div
        className="mx-auto flex max-w-7xl flex-col xl:flex-row gap-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* MAIN STAGE */}
        <div className="flex-1 space-y-6">
           <Card className="border border-brand-500/20 dark:border-brand-500/10 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap border-b border-slate-200 dark:border-white/5 pb-4">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center p-1 border-2 border-brand-500">
                     <img src={avatarUrl} alt="Avatar" className="w-full h-full object-contain" />
                   </div>
                   <div>
                     <CardTitle className="text-xl flex items-center gap-2">
                       {interviewerLabel}
                       <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                     </CardTitle>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize font-medium">
                       {config.level} • {config.role}
                     </p>
                   </div>
                </div>
                
                <div className="text-right flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                       <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1 justify-end">
                          <ShieldAlert className="w-3.5 h-3.5" /> Stress Test
                       </p>
                       <p className={`text-sm font-bold mt-1 ${stressColor}`}>{config.stressLevel}%</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Time Remaining</p>
                       <p className={`font-display text-2xl font-bold mt-0.5 ${secondsLeft <= 60 ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-slate-100'}`}>
                         {formatTime(secondsLeft)}
                       </p>
                    </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 bg-slate-900 overflow-hidden rounded-b-3xl">
                     
                     {/* Video Feed */}
                     <div className="relative aspect-video md:aspect-auto md:border-r border-white/10 bg-black flex flex-col justify-center">
                        {webcamError ? (
                           <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                              <VideoOff className="w-10 h-10 text-rose-500 mb-3 opacity-50" />
                              <p className="text-sm font-medium text-slate-300 max-w-sm">
                                {webcamError}
                              </p>
                              <p className="text-xs text-slate-500 mt-2">Text-only mode enabled.</p>
                           </div>
                        ) : (
                           <video
                              ref={videoRef}
                              autoPlay
                              muted
                              playsInline
                              className="h-full w-full object-cover"
                           />
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                           <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white flex items-center gap-2 border border-white/10 shadow-xl">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                             {user.name} • Candidate
                           </div>
                        </div>
                     </div>
                     
                     {/* AI Question & Interactions Feed */}
                     <div className="relative flex flex-col p-6 w-full h-[300px] md:h-[400px]">
                        
                        <div className="flex-1 overflow-y-auto w-full flex flex-col justify-end space-y-4 pb-4">
                           {/* Static intro or question */}
                           <AnimatePresence mode="wait">
                              {isThinking ? (
                                 <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="px-5 py-4 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 w-5/6 shadow-lg self-start relative"
                                 >
                                    <div className="flex gap-2">
                                       <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce"></span>
                                       <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                       <span className="h-2 w-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 absolute -top-5 left-1 uppercase font-semibold tracking-wider">AI Generating...</span>
                                 </motion.div>
                              ) : currentQuestion ? (
                                 <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="px-5 py-4 rounded-2xl rounded-tl-none bg-indigo-500/10 border border-indigo-500/20 w-11/12 shadow-lg self-start text-indigo-100 text-[15px] leading-relaxed relative"
                                 >
                                    {currentQuestion}
                                 </motion.div>
                              ) : (
                                 <motion.div className="px-5 py-4 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 w-11/12 shadow-lg self-start text-slate-300 text-sm italic">
                                    When you are ready, press Start below.
                                 </motion.div>
                              )}
                           </AnimatePresence>
                           
                           {/* User Answer Active Draft bubble */}
                           {answerDraft && (
                              <motion.div 
                                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                 className="px-5 py-3 rounded-2xl rounded-tr-none bg-brand-600 border border-brand-500 w-11/12 self-end text-white text-[15px] shadow-lg leading-relaxed relative"
                              >
                                {answerDraft}
                                <span className="absolute -top-5 right-1 text-[10px] text-brand-300 uppercase font-semibold tracking-wider flex items-center gap-1">
                                   <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> Live Transcript
                                </span>
                              </motion.div>
                           )}
                        </div>

                        {/* Controls area */}
                        <div className="pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-900 rounded-b-2xl">
                           <div className="flex gap-2">
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setVoiceEnabled(v => !v)}
                                className="!text-slate-400 hover:!text-slate-200"
                                aria-label="Toggle Interviewer Voice"
                             >
                                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                             </Button>
                             
                             <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleRepeat}
                                disabled={!started || completed || isThinking}
                                className="!text-slate-400 hover:!text-slate-200"
                                title="Repeat Question"
                             >
                                <RefreshCw className="w-4 h-4" />
                             </Button>
                           </div>

                           {!started && !completed && (
                             <Button size="lg" onClick={start} className="bg-brand-500 hover:bg-brand-400 font-bold">
                               <Play className="w-4 h-4 mr-2 fill-current" /> Start Interview
                             </Button>
                           )}

                           {started && !completed && (
                              <div className="flex gap-2">
                                {speechSupported && (
                                   <Button
                                      size="md"
                                      variant={isRecording ? 'danger' : 'secondary'}
                                      className="group relative"
                                      disabled={isThinking}
                                      onClick={handleToggleRecording}
                                   >
                                      {isRecording ? <Square className="w-4 h-4 mr-2 fill-current" /> : <Mic className="w-4 h-4 mr-2" />}
                                      {isRecording ? "Stop Speaking" : "Start Speaking"}
                                      {isRecording && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-black"></span></span>}
                                   </Button>
                                )}
                                <Button
                                   size="md"
                                   disabled={!answerDraft.trim() || isThinking}
                                   onClick={handleSubmitAnswer}
                                >
                                   {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                                </Button>
                              </div>
                           )}

                           {completed && (
                             <Button size="lg" onClick={handleEnd} className="bg-emerald-500 hover:bg-emerald-400 text-white">
                               <CheckCircle2 className="w-4 h-4 mr-2" /> View Feedback
                             </Button>
                           )}
                        </div>
                     </div>
                  </div>
              </CardContent>
           </Card>

           {/* Manual Text Fallback Area (below video) */}
           {started && !completed && (
               <div className="glass-card p-4 flex gap-3 items-start border-t-4 border-t-indigo-500">
                 <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-xl shrink-0 mt-1">
                   <MicOff className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                 </div>
                 <div className="w-full space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Manual Entry</p>
                    <textarea 
                       className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 px-4 py-3 text-sm text-slate-800 dark:text-slate-50 outline-none backdrop-blur-sm transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 min-h-[80px]"
                       placeholder="Prefer typing? Write your answer here manually instead of speaking..."
                       value={answerDraft}
                       onChange={e => setAnswerDraft(e.target.value)}
                       disabled={isRecording || isThinking}
                    />
                 </div>
               </div>
           )}
        </div>

        {/* SIDEBAR LOG */}
        <div className="w-full xl:w-80 shrink-0 space-y-6">
           <Card className="max-h-[calc(100vh-10rem)] flex flex-col h-[500px] xl:h-auto border-brand-500/10">
              <CardHeader className="border-b border-slate-200 dark:border-white/5 pb-4">
                 <CardTitle className="text-base flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Session Log
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-y-auto flex-1 space-y-4 font-mono text-[11px] bg-slate-50/50 dark:bg-black/20 m-2 rounded-2xl">
                 {answers.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center opacity-50 px-4">
                       Your structured Q&A transcript will appear here. Useful for saving directly to your portfolio.
                    </div>
                 ) : (
                    answers.map((entry, idx) => (
                       <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm space-y-2">
                          <div>
                            <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-indigo-500 break-words mb-1 block">Q{idx + 1}</span>
                            <span className="text-slate-700 dark:text-slate-300 font-sans font-medium">{entry.question}</span>
                          </div>
                          <div className="bg-brand-50 dark:bg-brand-900/10 p-2 rounded border border-brand-100 dark:border-brand-500/20 text-slate-600 dark:text-slate-400">
                             {entry.answer}
                          </div>
                       </div>
                    ))
                 )}
              </CardContent>
              {started && !completed && (
                <div className="p-4 border-t border-slate-200 dark:border-white/5">
                    <Button variant="danger" className="w-full" onClick={handleEnd}>
                       Force End Session
                    </Button>
                </div>
              )}
           </Card>
        </div>
      </motion.div>
    </div>
  );
}
