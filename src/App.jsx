import React, { useState } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import SetupPage from "./components/SetupPage";
import InterviewPage from "./components/InterviewPage";
import FeedbackPage from "./components/FeedbackPage";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  
  // States: login -> dashboard -> setup -> interview -> feedback
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [session, setSession] = useState(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  function handleLogin(u) {
    setUser(u);
  }
  
  function handleRequestNewInterview() {
    setIsSetupOpen(true);
    setSession(null);
    setConfig(null);
  }

  function handleStartInterview(cfg) {
    setConfig(cfg);
    setIsSetupOpen(false); // Move out of setup
  }

  function handleFinishInterview(result) {
    const finalSession = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      feedback: result.feedback,
      answers: result.answers,
      config,
      score: result.feedback?.overallScore || 0
    };
    
    setSession(finalSession);
    
    // Save to history immediately
    try {
      const history = JSON.parse(localStorage.getItem('interviewHistory') || '[]');
      history.unshift(finalSession);
      // Keep only last 10
      localStorage.setItem('interviewHistory', JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.error("Failed to save history");
    }
  }

  function handleGoToDashboard() {
    setSession(null);
    setConfig(null);
    setIsSetupOpen(false);
  }

  // Calculate current step
  let step = "login";
  if (user) {
    if (session) step = "feedback";
    else if (config) step = "interview";
    else if (isSetupOpen) step = "setup";
    else step = "dashboard";
  }

  return (
    <div className="relative min-h-screen selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100 pb-12">
      <AnimatedBackground />
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main className="mt-4 md:mt-8 flex justify-center">
          {step === "login" && <LoginPage onLogin={handleLogin} />}
          {step === "dashboard" && <DashboardPage user={user} onNewInterview={handleRequestNewInterview} />}
          {step === "setup" && <SetupPage user={user} onStart={handleStartInterview} onCancel={handleGoToDashboard} />}
          {step === "interview" && (
             <InterviewPage config={config} user={user} onFinish={handleFinishInterview} />
          )}
          {step === "feedback" && (
            <FeedbackPage
              user={user}
              session={session}
              onRestart={handleRequestNewInterview}
              onDashboard={handleGoToDashboard}
            />
          )}
        </main>
      </div>
    </div>
  );
}
