// src/lib/interviewEngine.js

// Basic static question sets as fallback
const beginnerQuestions = [
  "Tell me about yourself.",
  "Why do you want to join this role?",
  "What are your strengths and weaknesses?",
  "Tell me about a time you worked in a team.",
];

const intermediateQuestions = [
  "Describe a challenging project you worked on and your contribution.",
  "How do you handle tight deadlines and pressure?",
  "Tell me about a failure and what you learned from it.",
  "How do you prioritize tasks when everything feels urgent?",
];

const advancedQuestions = [
  "Walk me through a high-impact decision you made recently.",
  "How do you mentor or grow people in your team?",
  "Describe a time you disagreed with leadership and how you handled it.",
  "If you joined us, what would you improve in the first 90 days?",
];

export function getQuestionSet(level = "beginner") {
  switch (level) {
    case "intermediate":
      return intermediateQuestions;
    case "advanced":
      return advancedQuestions;
    default:
      return beginnerQuestions;
  }
}

/**
 * Improved, rule-based feedback.
 * - Handles empty transcript safely
 * - Gives low score if user doesn't answer
 * - Scores based on length + basic structure
 */
export function generateFeedback(transcript) {
  const raw = (transcript || "").trim();

  // Case 1: no answers at all
  if (!raw) {
    return {
      overallScore: 15,
      metrics: { clarity: 10, depth: 10, confidence: 10 },
      communication: "No spoken answers or notes were detected.",
      strengths: ["None detected"],
      weaknesses: ["No participation recorded"],
      tips: [
        "Try to answer at least 3–4 questions to get meaningful feedback.",
        "Even if you are unsure, speak your thought process instead of staying silent.",
        "Use this tool to practice speaking out loud, not just reading questions.",
      ],
      aiEnhanced: false,
    };
  }

  const words = raw.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const avgWordsPerSentence = wordCount / sentenceCount;

  let score = 60; // base score
  let clarityScore = 70;
  let depthScore = 50;
  let confidenceScore = 60;
  
  const strengths = [];
  const weaknesses = [];

  // Length scoring (Depth & Confidence)
  if (wordCount < 15) {
    score -= 45; clarityScore -= 50; depthScore -= 40; confidenceScore -= 40;
    weaknesses.push("You barely provided any answers. Please elaborate significantly next time.");
  } else if (wordCount < 60) {
    score -= 15; depthScore -= 20; confidenceScore -= 10;
    weaknesses.push("Your answers were generally too brief, missing detail.");
  } else if (wordCount > 400) {
    score -= 10; clarityScore -= 15;
    weaknesses.push("Some answers were overly long and might lose the listener's attention.");
    strengths.push("You provided a lot of information and context.");
  } else if (wordCount >= 100 && wordCount <= 300) {
    score += 15; depthScore += 30; confidenceScore += 20;
    strengths.push("Excellent answer length. You hit the 'sweet spot' for detail.");
  }

  // Sentence structure (Clarity)
  if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) {
    score += 10; clarityScore += 20;
    strengths.push("Your sentence structure was clear and easy to follow.");
  } else if (avgWordsPerSentence > 30) {
    score -= 10; clarityScore -= 25;
    weaknesses.push("You use very long, potentially run-on sentences. Pause more often.");
  } else if (Math.random() > 0.5) {
    // Add generic strength
    strengths.push("You stayed on topic well throughout the session.");
  }

  // Limit scores
  score = Math.round(Math.max(20, Math.min(98, score)));
  clarityScore = Math.round(Math.max(20, Math.min(98, clarityScore)));
  depthScore = Math.round(Math.max(20, Math.min(98, depthScore)));
  confidenceScore = Math.round(Math.max(20, Math.min(98, confidenceScore)));

  // Communication description
  let communication;
  if (score < 50) {
    communication = "Your answers lack structure and depth. Consider using the STAR method.";
  } else if (score < 75) {
    communication = "Solid communication, though there is room to refine your key points and examples.";
  } else {
    communication = "Strong, confident communication with excellent clarity and depth.";
  }

  // If we collected no weaknesses (good score)
  if (weaknesses.length === 0) weaknesses.push("None identified – great job!");

  return {
    overallScore: score,
    metrics: { clarity: clarityScore, depth: depthScore, confidence: confidenceScore },
    strengths,
    weaknesses,
    communication,
    tips: [
      "Use the STAR framework: describe the Situation, your Task, the Action you took, and the Result.",
      "Aim for 60–120 seconds per answer – not too short, not too long.",
      "Highlight your personal impact: what you did, not just what the team did.",
    ],
    aiEnhanced: false,
  };
}

/**
 * Optional OpenAI integration for smarter, contextual questions.
 *
 * 1. Create a .env file in the project root with:
 *      VITE_OPENAI_API_KEY=your_api_key_here
 * 2. For production, you should proxy this through a backend instead of
 *    calling OpenAI directly from the browser (for security).
 */
async function callOpenAIForQuestion({ level, role, previousQA }) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) return null; // No key → skip AI

  const difficultyLabel =
    level === "advanced"
      ? "senior / leadership level"
      : level === "intermediate"
      ? "mid-level individual contributor"
      : "beginner / fresher";

  const historyText =
    previousQA
      .map(
        (pair, idx) =>
          `Q${idx + 1}: ${pair.question}\nA${idx + 1}: ${pair.answer}`
      )
      .join("\n\n") || "No previous questions have been asked yet.";

  const systemPrompt =
    "You are an expert technical and behavioral interviewer. " +
    "You ask one concise, natural-sounding interview question at a time. " +
    "Do NOT include numbering, bullets, or explanations. Output ONLY the question text.";

  const userPrompt = `
Role: ${role}
Candidate level: ${difficultyLabel}

Conversation so far:
${historyText}

Now generate the NEXT interview question that logically follows.
Keep it under 40 words and make it a single question.
  `.trim();

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || null;
    return text;
  } catch (error) {
    console.error("OpenAI question error", error);
    return null;
  }
}

/**
 * Main function used by the app.
 * If OpenAI is configured it will generate contextual questions,
 * otherwise it falls back to the static list.
 */
export async function getNextQuestion({ level, previousAnswers, role }) {
  const questions = getQuestionSet(level);
  const askedCount = previousAnswers.length;

  // 1) Try AI question first
  const aiQuestion = await callOpenAIForQuestion({
    level,
    role,
    previousQA: previousAnswers,
  });

  if (aiQuestion) {
    return aiQuestion;
  }

  // 2) Fallback: static questions
  if (askedCount === questions.length) {
    return "That concludes my planned questions. Is there anything you want to ask me?";
  }
  if (askedCount > questions.length) {
    return null; // Signals the interview is completely over
  }
  
  return questions[askedCount];
}
