import { useEffect, useState } from "react";
import { getNextQuestion, generateFeedback } from "@/lib/interviewEngine";

export function useInterview({ level, durationMinutes, role }) {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || completed) return;
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, completed, secondsLeft]);

  // Load first question when interview starts
  useEffect(() => {
    if (!started) return;
    async function loadFirst() {
      setIsThinking(true);
      await new Promise(r => setTimeout(r, 1500)); // Simulating connection
      const q = await getNextQuestion({ level, previousAnswers: [], role });
      setCurrentQuestion(q);
      setIsThinking(false);
    }
    loadFirst();
  }, [started, level, role]);

  async function answerQuestion(text) {
    const updatedAnswers = [
      ...answers,
      { question: currentQuestion, answer: text },
    ];
    setAnswers(updatedAnswers);
    setIsThinking(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulating processing
    const next = await getNextQuestion({
      level,
      previousAnswers: updatedAnswers,
      role,
    });
    
    if (!next) {
      setIsThinking(false);
      finish();
    } else {
      setCurrentQuestion(next);
      setIsThinking(false);
    }
  }

  function start() {
    setStarted(true);
  }

  function finish() {
    if (completed) {
      return feedback;
    }

    const transcript = answers.map((a) => a.answer).join(" ");
    const fb = generateFeedback(transcript || "");

    setCompleted(true);
    setFeedback(fb);

    return fb;
  }

  return {
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
  };
}
