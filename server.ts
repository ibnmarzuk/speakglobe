import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to construct valid contents array for Gemini API (ensures role starts with 'user' and alternates)
function buildGeminiContents(messages: any[], defaultContext = "Communication Coaching") {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return [
      {
        role: "user",
        parts: [{ text: `Hello! I am ready to start my ${defaultContext} session.` }]
      }
    ];
  }

  const items: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  // Gemini API requires contents[0] to have role: "user".
  // If the first message in history is from assistant, prepend an initial user message.
  if (messages[0].role === "assistant" || messages[0].role === "model") {
    items.push({
      role: "user",
      parts: [{ text: `Hello! Let's begin my ${defaultContext} session.` }]
    });
  }

  for (const m of messages) {
    const role: "user" | "model" = (m.role === "assistant" || m.role === "model") ? "model" : "user";
    const text = (m.content || "").trim();
    if (!text) continue;

    if (items.length > 0 && items[items.length - 1].role === role) {
      items[items.length - 1].parts[0].text += "\n\n" + text;
    } else {
      items.push({ role, parts: [{ text }] });
    }
  }

  if (items.length === 0) {
    return [
      {
        role: "user",
        parts: [{ text: `Hello! I am ready to start my ${defaultContext} session.` }]
      }
    ];
  }

  return items;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client lazily / safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("SpeakGlobal Gemini API initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini Client:", err);
    }
  } else {
    console.warn("SpeakGlobal: GEMINI_API_KEY is missing or holds placeholder value. Running in fallback/demo mode.");
  }

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: ai ? "live" : "demo" });
  });

  // Onboarding Assessment & Custom Roadmap Generator
  app.post("/api/coach/onboard", async (req, res) => {
    const { communicationGoal, profession, nativeLanguage, confidenceLevel, preferredLearningPace } = req.body;

    if (!communicationGoal || !profession) {
      return res.status(400).json({ error: "Missing required fields for onboarding." });
    }

    const prompt = `Generate a personalized 4-week communication training roadmap for a professional/individual with the following profile:
    - Profession: ${profession}
    - Primary Communication Goal: ${communicationGoal}
    - Native Language/Accent context: ${nativeLanguage || "English"}
    - Current Self-Reported Confidence Level: ${confidenceLevel || "Moderate"}
    - Preferred Learning Pace: ${preferredLearningPace || "Standard (15 mins/day)"}
    
    Design a rigorous, helpful, and premium curriculum containing weekly themes, goals, and specific exercise names (like 'Elevator Pitch Practice', 'Meeting Interruption Drill', 'Filler Word Elimination').`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are SpeakGlobal's expert Curriculum Architect. Your roadmaps must feel premium, encouraging, highly specific, and practical.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                focusArea: { type: Type.STRING, description: "Primary custom focus area for the user's profile" },
                dailyTimeRecommendation: { type: Type.STRING, description: "Daily practice duration recommendation (e.g. '15 minutes')" },
                roadmap: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      week: { type: Type.INTEGER, description: "Week index (1 to 4)" },
                      title: { type: Type.STRING, description: "Weekly theme/focus title" },
                      description: { type: Type.STRING, description: "Weekly goal description" },
                      exercises: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "2-3 recommended exercises to practice"
                      }
                    },
                    required: ["week", "title", "description", "exercises"]
                  }
                }
              },
              required: ["focusArea", "dailyTimeRecommendation", "roadmap"]
            }
          }
        });

        const data = JSON.parse(response.text || "{}");
        return res.json(data);
      } catch (err: any) {
        console.error("Gemini Onboard Error:", err);
        return res.status(500).json({ error: "Failed to generate AI roadmap. Using local default roadmap.", details: err.message });
      }
    } else {
      // Return a beautiful Swiss-precision custom fallback response in demo mode
      const fallbackRoadmap = {
        focusArea: `${communicationGoal} within ${profession}`,
        dailyTimeRecommendation: "15 minutes of structured verbal drills",
        roadmap: [
          {
            week: 1,
            title: "Establishing the Baseline & Structuring Thoughts",
            description: "Learn to articulate high-level concepts cleanly without rushing. Eliminate introductory clutter.",
            exercises: ["Elevator Pitch Essentials", "Daily Goal Setup", "Active Pausing Drill"]
          },
          {
            week: 2,
            title: "Clarity, Articulation, and Pace Tuning",
            description: "Align your speech cadence with the standard comfortable pace (130-150 words per minute) to maximize impact.",
            exercises: ["Pace Alignment Trial", "Filler Word Elimination", "Storytelling Frameworks"]
          },
          {
            week: 3,
            title: "Professional Engagement & Persuasion",
            description: "Master techniques for speaking assertively during high-pressure meetings or interview environments.",
            exercises: ["Meeting Contribution Simulator", "Difficult Conversations Practice", "Q&A Handling Mastery"]
          },
          {
            week: 4,
            title: "Polished Delivery & Global Leadership Tone",
            description: "Adopt an authoritative, confident, and highly supportive global communicator tone suitable for any global stage.",
            exercises: ["Mock Interview Final Run", "Global Collaboration Deck Pitch", "Refined Voice Dashboard"]
          }
        ]
      };
      return res.json(fallbackRoadmap);
    }
  });

  // Practice Session Analyzer
  app.post("/api/coach/analyze", async (req, res) => {
    const { scenarioId, scenarioTitle, promptText, userSpeechText, speechDurationSeconds } = req.body;

    if (!userSpeechText) {
      return res.status(400).json({ error: "No user response provided for analysis." });
    }

    const duration = speechDurationSeconds || 30;
    const wordCount = userSpeechText.split(/\s+/).filter(Boolean).length;
    const wpm = Math.round((wordCount / duration) * 60);

    const prompt = `Analyze the following user speech response for a communication practice session:
    - Practice Scenario: "${scenarioTitle || "Custom Scenario"}"
    - Scenario Prompt/Context: "${promptText || "General conversation"}"
    - User's Response: "${userSpeechText}"
    - Estimated Speech Duration: ${duration} seconds
    - Calculated Word Count: ${wordCount} words
    - Approximate Cadence: ${wpm} Words Per Minute (WPM)
    
    Provide an analytical score sheet measuring clarity, pace (ideal is 130-150 WPM, too fast or slow should be scored accordingly), vocabulary, and confidence. Detect filler words used. Highlight 2-3 precise strengths and 2-3 actionable weaknesses. Most importantly, provide an elegant, professional, highly impactful 'improvedPhrasing' rewrite that retains the user's core intent but delivers it with supreme Swiss precision and executive clarity.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are SpeakGlobal's Lead Communication Scientist and Executive Coach. Your feedback is constructive, elite, practical, encouraging, and deeply technical regarding rhetoric, pacing, and executive presence.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                clarityScore: { type: Type.INTEGER },
                paceScore: { type: Type.INTEGER },
                vocabularyScore: { type: Type.INTEGER },
                confidenceScore: { type: Type.INTEGER },
                wordsPerMinute: { type: Type.INTEGER },
                fillerWordsDetected: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                weaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                improvedPhrasing: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: [
                "clarityScore",
                "paceScore",
                "vocabularyScore",
                "confidenceScore",
                "wordsPerMinute",
                "fillerWordsDetected",
                "strengths",
                "weaknesses",
                "improvedPhrasing",
                "explanation"
              ]
            }
          }
        });

        const data = JSON.parse(response.text || "{}");
        return res.json(data);
      } catch (err: any) {
        console.error("Gemini Analyze Error:", err);
        return res.status(500).json({ error: "Failed to perform AI speech analysis.", details: err.message });
      }
    } else {
      // Elegant, context-aware Mock feedback for demo mode
      // Let's make it look authentic based on input!
      let clarity = 85;
      let pace = 80;
      let vocab = 82;
      let confidence = 84;
      const detectedFillers: string[] = [];

      const textLower = userSpeechText.toLowerCase();
      const fillers = ["um", "uh", "like", "basically", "actually", "so", "you know", "kind of"];
      fillers.forEach(f => {
        const regex = new RegExp(`\\b${f}\\b`, 'g');
        const matches = textLower.match(regex);
        if (matches && matches.length > 0) {
          detectedFillers.push(`${f} (x${matches.length})`);
        }
      });

      if (detectedFillers.length > 3) {
        clarity -= 10;
        confidence -= 5;
      }
      if (wpm < 100) {
        pace = 70; // Too slow
      } else if (wpm > 170) {
        pace = 65; // Too fast
      } else {
        pace = 95; // Golden range
      }

      const mockAnalysis = {
        clarityScore: clarity,
        paceScore: pace,
        vocabularyScore: vocab,
        confidenceScore: confidence,
        wordsPerMinute: wpm || 135,
        fillerWordsDetected: detectedFillers.length > 0 ? detectedFillers : ["None detected (Outstanding!)"],
        strengths: [
          userSpeechText.length > 100 ? "Strong comprehensive detailing in your answer." : "Direct, to-the-point response style.",
          "Authentic message delivery with transparent, straightforward structuring."
        ],
        weaknesses: [
          detectedFillers.length > 0 ? "Frequent usage of speech crutches/filler expressions which dilute authority." : "Could inject stronger action verbs to build persuasive momentum.",
          "Consider using structured pausing (silence) instead of vocal fillers to bridge thoughts."
        ],
        improvedPhrasing: `\"Rather than starting with filler introductory statements, I recommend delivering your main thesis immediately: 'In my experience, the optimal approach involves...' followed by clear, numbered structural proof points. This reinforces executive composure.\"`,
        explanation: `Your communication delivery of ${wordCount} words is highly capable but can be elevated. Your pacing is clocked at ${wpm} WPM. The ideal sweet spot is 130–150 WPM, which gives listeners enough time to process your ideas without losing interest. By purposefully embedding micro-pauses at natural transitions, you will sound significantly more authoritative and secure.`
      };

      return res.json(mockAnalysis);
    }
  });

  // Real-time AI Mentor Chat
  app.post("/api/coach/chat", async (req, res) => {
    const { messages, userProfile } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Format chat conversation for Gemini
    const systemPrompt = `You are SpeakGlobal's Executive Mentor, a supportive, elite, and world-class AI communication coach.
    You do NOT give long generic textbook advice. Instead, you analyze user concerns, provide snappy rhetorical framework insights (like using STAR, PREP, or pyramid principle), suggest quick verbal exercises, and respond with deep warmth, architectural clarity, and Swiss design conciseness.
    The user's professional profile is: Goal: ${userProfile?.communicationGoal || "General communication refinement"}, Profession: ${userProfile?.profession || "Professional"}. Use this context naturally.`;

    if (ai) {
      try {
        const contents = buildGeminiContents(messages, "Executive Mentor Chat");

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
          }
        });

        return res.json({ role: "assistant", content: response.text || "" });
      } catch (err: any) {
        console.error("Gemini Chat Error:", err);
        return res.status(500).json({ error: "Failed to generate AI response.", details: err.message });
      }
    } else {
      // Warm, highly actionable fallback response from the SpeakGlobal mentor
      const lastUserMessage = messages[messages.length - 1]?.content || "";
      let answer = "";

      if (lastUserMessage.toLowerCase().includes("interview")) {
        answer = `Interview prep is all about the **PREP Framework** (Point, Reason, Example, Point). When asked a behavioral question:
1. **Point**: State your direct claim.
2. **Reason**: Why this thesis holds.
3. **Example**: Provide a brief 2-sentence story.
4. **Point**: Re-anchor your initial point.

Try writing a 1-sentence answer for: "What is your greatest professional asset?" following PREP. Let's practice it right here.`;
      } else if (lastUserMessage.toLowerCase().includes("filler") || lastUserMessage.toLowerCase().includes("um")) {
        answer = `Filler words like *"um"*, *"basically"*, or *"actually"* serve as cognitive bridges while your brain seeks the next word. 

To eliminate them instantly:
- **Embrace the Silence**: When you feel a filler word coming, close your lips and take a silent breath. Listeners experience silence as deep confidence, not hesitation.
- **The Rhythmic Tap**: Gently tap your index finger on your thigh for each major word. It anchors your rate of articulation.

Shall we try a 30-second speaking exercise where we practice completely silence-bridged pauses?`;
      } else {
        answer = `That is an excellent communication question. To communicate globally and confidently:
- **Lead with the Pyramid Principle**: State your recommendation/result first, group your supporting explanations, and then list your detail points.
- **Vocal Variety**: Modulate your pitch to accent key verbs and take a full 1-second pause before introducing new, important ideas.

How can I help you practice this today? We can rehearse an upcoming meeting presentation, practice a daily standup, or do an executive pitch.`;
      }

      return res.json({ role: "assistant", content: answer });
    }
  });

  // Adaptive Conversational AI Coach Core
  app.post("/api/coach/converse", async (req, res) => {
    const { messages, goal, level, profile } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Conversation messages are required." });
    }

    const userName = profile?.name || "Friend";
    const userTurnsCount = messages.filter((m: any) => m.role === "user").length;
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // Exact system prompt for Gemini
    const systemPrompt = `You are SpeakGlobal's Live AI Communication Coach. You are NOT a chatbot or recording script; you are a warm, human-like voice communication mentor.
    
    CRITICAL BEHAVIOR & FLOW RULES:
    1. GREETING PROTOCOL: If this is the start of the session (user turns count <= 1 and no user message yet), you MUST greet the user with this exact warm framing:
       "Hello ${userName}. Welcome back to SpeakGlobal. I'm your AI Communication Coach. Today we're going to have a real conversation. There are no right or wrong answers. Simply speak naturally. I'll listen carefully, ask follow-up questions, and help you become a more confident communicator. Whenever you're ready, let's begin."
       Then immediately follow with a warm starting question tailored to their Goal: "${goal || "Daily Conversation"}".

    2. INTELLIGENT & CONNECTED FOLLOW-UP QUESTIONS:
       - NEVER ask random, pre-scripted, or unrelated questions.
       - Listen deeply to what the user just said: "${lastUserMessage}".
       - Reference their previous statements directly using phrases like "You mentioned earlier...", "You said your goal is...", or "Earlier you explained...".
       - If the user gave a short answer, ask a gentle probing follow-up ("Could you tell me more about...").
       - If the user gave a detailed answer, dive deeper into the strategy or emotional context behind it.
       - If the user seems nervous or brief, offer warm encouragement ("Take your time, you're doing great.").

    3. CONVERSATION CONCLUSION:
       - Once the user has answered 4 to 5 follow-up questions meaningfully (user turns count >= 4), determine that you have gathered enough information to evaluate their communication style.
       - Conclude your message with this exact phrase:
         "Thank you, ${userName}. I now have a clear understanding of your communication style. Let's review today's session together."

    4. TONE & RESPONSE LENGTH:
       - Keep responses concise (2 to 3 spoken sentences maximum) to maintain fluid voice conversation momentum.
       - Persona: Encouraging, supportive, practical, clear, professional, patient mentor.
       - Goal: ${goal || "Daily Conversation"}, Level: ${level || "Professional"}, User: ${userName}.`;

    if (ai) {
      try {
        const contents = buildGeminiContents(messages, goal || "Voice Conversation");

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
          }
        });

        return res.json({ role: "assistant", content: response.text || "" });
      } catch (err: any) {
        console.error("Gemini Converse Error:", err);
        return res.status(500).json({ error: "Failed to generate AI converse response.", details: err.message });
      }
    } else {
      // Dynamic, highly adaptive fallback conversation logic
      let answer = "";
      const textLower = lastUserMessage.toLowerCase();

      if (userTurnsCount === 0 || (!lastUserMessage && userTurnsCount <= 1)) {
        answer = `Hello ${userName}. Welcome back to SpeakGlobal. I'm your AI Communication Coach. Today we're going to have a real conversation. There are no right or wrong answers. Simply speak naturally. I'll listen carefully, ask follow-up questions, and help you become a more confident communicator. Whenever you're ready, let's begin.\n\nTell me about yourself and what you're working on or preparing for today.`;
      } else if (userTurnsCount >= 4) {
        answer = `That is a fantastic perspective! You've expressed your thoughts with great structure and authenticity.\n\nThank you, ${userName}. I now have a clear understanding of your communication style. Let's review today's session together.`;
      } else {
        // Dynamic contextual follow-ups based on user input content
        if (textLower.includes("computer science") || textLower.includes("code") || textLower.includes("developer") || textLower.includes("website") || textLower.includes("software")) {
          if (!textLower.includes("inspired")) {
            answer = `You mentioned working as a developer! What inspired you to pursue software development in the first place?`;
          } else {
            answer = `You explained earlier how much you enjoy building AI products. What is the most exciting project you've built so far, and what challenge did you face while building it?`;
          }
        } else if (textLower.includes("interview") || textLower.includes("job") || textLower.includes("role") || textLower.includes("apply") || textLower.includes("career")) {
          answer = `Preparing for interviews is a great focus. When an interviewer asks you about a high-stakes scenario, what key project or achievement do you highlight first?`;
        } else if (textLower.includes("student") || textLower.includes("university") || textLower.includes("college") || textLower.includes("study")) {
          answer = `Earlier you mentioned your studies! What has been the most valuable lesson or hands-on experience in your coursework so far?`;
        } else {
          // General contextual follow-up referencing prior point
          answer = `You mentioned your goal is focused on ${goal || "communication"}. Based on what you just shared, what inspired you to focus on this area, and what is one outcome you want to achieve next?`;
        }
      }

      return res.json({ role: "assistant", content: answer });
    }
  });

  // --- Serve Client-Side Application ---

  if (process.env.NODE_ENV !== "production") {
    // Vite middleware for lightning-fast development serving
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SpeakGlobal full-stack server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to boot SpeakGlobal server:", err);
});
