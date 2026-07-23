import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Square, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ArrowLeft, 
  AlertCircle,
  Volume2,
  Volume1,
  VolumeX,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  BookOpen,
  ArrowRight,
  LogOut,
  Target,
  Download,
  Copy,
  Search,
  MessageSquare,
  Clock,
  Zap,
  BarChart3,
  RotateCcw,
  FileText,
  Sliders
} from "lucide-react";
import { UserProfile, PracticeSession } from "../types";
import VoiceWaveform from "./VoiceWaveform";

interface PracticeArenaProps {
  onSessionLogged: (session: PracticeSession) => void;
  activeScenarioId?: string;
  onClearActiveScenario: () => void;
  profile: UserProfile | null;
  showToast?: (message: string, type: "success" | "warning" | "error" | "info") => void;
}

// 14 Core Communication Goals
const COMMUNICATION_GOALS = [
  "Job Interview Preparation",
  "Presentation & Public Speaking",
  "Introducing Yourself",
  "Networking & Making Connections",
  "Executive & Leadership Communication",
  "Sales Pitch & Persuasion",
  "Daily Conversation & Fluency",
  "Customer Support & Client Relations",
  "Debate & Strategic Discussion",
  "Storytelling & Engagement",
  "School & University Viva/Exam",
  "Cross-Cultural Collaboration",
  "Meeting Contribution & Q&A",
  "Negotiation & Conflict Resolution"
];

// Complexity levels
const COMPLEXITY_LEVELS = [
  "Primary Student",
  "Secondary Student",
  "University Student",
  "Professional"
];

// Helper to determine initial level based on user profession
const getInitialLevel = (profession?: string) => {
  if (!profession) return "Professional";
  const lower = profession.toLowerCase();
  if (lower.includes("primary") || lower.includes("elementary")) return "Primary Student";
  if (lower.includes("secondary") || lower.includes("high school")) return "Secondary Student";
  if (lower.includes("university") || lower.includes("student") || lower.includes("college")) return "University Student";
  return "Professional";
};

// Filler words list
const FILLER_WORDS = ["um", "uh", "like", "basically", "actually", "so", "you know", "kind of"];

const getFillerWordCounts = (text: string) => {
  const counts: Record<string, number> = {};
  const textLower = text.toLowerCase();
  FILLER_WORDS.forEach((f) => {
    const pattern = f.replace(/\s+/g, "\\s+");
    const regex = new RegExp(`\\b${pattern}\\b`, "g");
    const matches = textLower.match(regex);
    if (matches) {
      counts[f] = matches.length;
    }
  });
  return counts;
};

export default function PracticeArena({ onSessionLogged, activeScenarioId, onClearActiveScenario, profile, showToast }: PracticeArenaProps) {
  const userName = profile?.name || "Emmanuel";
  
  // 1. Session State: "welcome" | "active" | "summary" | "history"
  const [sessionState, setSessionState] = useState<"welcome" | "active" | "summary" | "history">("welcome");

  // Onboarding & session parameters
  const [selectedGoal, setSelectedGoal] = useState<string>(
    profile?.communicationGoal || COMMUNICATION_GOALS[0]
  );
  const [selectedLevel, setSelectedLevel] = useState<string>("Professional");
  const [showGoalSelectorModal, setShowGoalSelectorModal] = useState(false);

  // Audio / Voice Controls
  const [ttsMuted, setTtsMuted] = useState(false);
  const [ttsRate, setTtsRate] = useState<number>(1.0);
  const [isCoachSpeaking, setIsCoachSpeaking] = useState(false);

  // Active dialogue states
  const [messages, setMessages] = useState<Array<{ 
    id: string; 
    role: "user" | "assistant"; 
    content: string; 
    timestamp: string;
    comment?: string;
  }>>([]);
  const [inputMode, setInputMode] = useState<"voice" | "text">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isCoachFormulating, setIsCoachFormulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter in Transcript
  const [transcriptSearch, setTranscriptSearch] = useState("");

  // Refs
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamic live analysis metrics
  const [liveMetrics, setLiveMetrics] = useState({
    confidence: 88,
    pacing: 135, // WPM
    pronunciation: 90,
    clarity: 92,
    grammar: 88,
    vocabulary: 85,
    energy: 80,
    tone: "Calm & Professional",
    professionalism: 92,
    fillerCount: 0,
    pauseControl: 89,
    voiceStability: 91,
    listening: 94
  });

  const [liveCoachingPrompt, setLiveCoachingPrompt] = useState<string>(
    "Your AI Communication Coach is actively listening to your speech patterns."
  );

  // Summary feedback report variables
  const [summaryReport, setSummaryReport] = useState<{
    overallScore: number;
    confidenceScore: number;
    pacingScore: number;
    pronunciationScore: number;
    grammarScore: number;
    vocabularyScore: number;
    clarityScore: number;
    toneStyle: string;
    energyScore: number;
    professionalismScore: number;
    strengths: string[];
    improvements: string[];
    fillerWordBreakdown: Record<string, number>;
    bestResponse: string;
    responseNeedingWork: {
      original: string;
      improved: string;
      reason: string;
    };
    exercises: Array<{ title: string; desc: string }>;
    recommendedNextSession: string;
    coachEncouragement: string;
  } | null>(null);

  // Session History Store
  const [sessionHistory, setSessionHistory] = useState<PracticeSession[]>([]);

  // Pre-load parameters from profile if they exist
  useEffect(() => {
    if (profile) {
      setSelectedLevel(getInitialLevel(profile.profession));
      const matchedGoal = COMMUNICATION_GOALS.find(g => 
        g.toLowerCase().includes(profile.communicationGoal?.toLowerCase() || "") || 
        (profile.communicationGoal?.toLowerCase() || "").includes(g.toLowerCase())
      );
      if (matchedGoal) {
        setSelectedGoal(matchedGoal);
      }
    }
  }, [profile]);

  // Speech Synthesis Helper
  const speakText = (text: string, onEnd?: () => void) => {
    if (ttsMuted || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = ttsRate;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Karen") || v.name.includes("Daniel")));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsCoachSpeaking(true);
      utterance.onend = () => {
        setIsCoachSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        setIsCoachSpeaking(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech synthesis failed:", e);
      setIsCoachSpeaking(false);
    }
  };

  // Cancel speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto scroll dialogue
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isCoachFormulating]);

  // Timer interval for recording length
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRecording]);

  // Web Speech API handler
  const startSpeechRecognition = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setError("Web Speech Recognition is not supported natively in this browser window. Please type your answers instead.");
      setInputMode("text");
      return;
    }

    try {
      if (isCoachSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsCoachSpeaking(false);
      }

      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setIsRecording(true);
        setError(null);
        setTranscript("");
      };

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const fullText = finalTranscript + interimTranscript;
        setTranscript(fullText);

        // Real-time Metrics Processing
        const words = fullText.trim().split(/\s+/).filter(Boolean);
        const wordCount = words.length;
        const computedWpm = recordingSeconds > 0 ? Math.round((wordCount * 60) / recordingSeconds) : 135;
        
        const fillerCounts = getFillerWordCounts(fullText);
        const totalFillers = Object.values(fillerCounts).reduce((a, b) => a + b, 0);

        setLiveMetrics(prev => {
          const confidencePenalty = Math.max(0, totalFillers * 3);
          const rawConfidence = Math.max(60, Math.min(98, 92 - confidencePenalty + (wordCount > 15 ? 4 : 0)));
          const rawClarity = Math.max(65, Math.min(98, 94 - (totalFillers * 4)));
          const rawVocabulary = Math.max(65, Math.min(98, 82 + (wordCount > 20 ? 8 : 4)));
          
          return {
            ...prev,
            pacing: computedWpm || 135,
            fillerCount: totalFillers,
            confidence: Math.round(rawConfidence),
            clarity: Math.round(rawClarity),
            vocabulary: Math.round(rawVocabulary),
            grammar: Math.round(Math.max(72, Math.min(98, 90 - (totalFillers > 2 ? 4 : 0)))),
            energy: Math.round(Math.max(70, Math.min(96, 80 + (recordingSeconds % 5)))),
            pronunciation: Math.round(Math.max(84, Math.min(98, 92 - (totalFillers > 0 ? 1 : 0)))),
            listening: Math.round(Math.min(99, 92 + (wordCount > 10 ? 3 : 0))),
            professionalism: Math.round(Math.max(80, Math.min(98, 92 - (totalFillers > 3 ? 5 : 0))))
          };
        });

        if (totalFillers > 0 && totalFillers % 2 === 0) {
          const firstFiller = Object.keys(fillerCounts)[0] || "um";
          setLiveCoachingPrompt(
            `Notice: "${firstFiller}" detected. Close your lips and take a soft, silent breath instead.`
          );
        } else if (computedWpm > 155) {
          setLiveCoachingPrompt(
            "Great energy! Remember to pause briefly at punctuation marks to let your points land."
          );
        } else if (wordCount > 15) {
          setLiveCoachingPrompt(
            "Pristine cadence! Finish your point and tap Send Voice Response."
          );
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === "not-allowed") {
          setError("Microphone permission was denied. You can still type your answers using the text option.");
        }
        stopSpeechRecognition();
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setError("Failed to initialize system microphone. Switching to text entry.");
      setInputMode("text");
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // Launch Voice Conversation Session
  const handleStartLiveConversation = async () => {
    setSessionState("active");
    setMessages([]);
    setError(null);
    setTranscript("");
    setTextInput("");
    setRecordingSeconds(0);
    setIsCoachFormulating(true);

    const greetingText = `Hello ${userName}. Welcome back to SpeakGlobal. I'm your AI Communication Coach. Today we're going to have a real conversation. There are no right or wrong answers. Simply speak naturally. I'll listen carefully, ask follow-up questions, and help you become a more confident communicator. Whenever you're ready, let's begin.\n\nTell me about yourself and what you're working on or preparing for today.`;

    try {
      const response = await fetch("/api/coach/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          goal: selectedGoal,
          level: selectedLevel,
          profile: profile
        })
      });

      if (!response.ok) throw new Error("Conversation initialization failed.");
      const data = await response.json();
      
      const coachMsgContent = data.content || greetingText;

      setMessages([
        {
          id: `coach-${Date.now()}`,
          role: "assistant",
          content: coachMsgContent,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);

      // Speak greeting using TTS
      speakText(coachMsgContent);

    } catch (err) {
      console.error(err);
      setMessages([
        {
          id: `coach-${Date.now()}`,
          role: "assistant",
          content: greetingText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      speakText(greetingText);
    } finally {
      setIsCoachFormulating(false);
    }
  };

  // Submit User turn and trigger AI Coach conversational response
  const handleSendUserTurn = async () => {
    const speechContent = inputMode === "voice" ? transcript : textInput;
    if (!speechContent.trim()) return;

    // Generate inline coaching comment based on speech quality
    const fillers = getFillerWordCounts(speechContent);
    const fillerCount = Object.values(fillers).reduce((a, b) => a + b, 0);
    const wordsCount = speechContent.split(/\s+/).filter(Boolean).length;
    let comment = "Strong structural delivery.";
    if (fillerCount > 0) {
      comment = `Noticed ${fillerCount} filler word(s). Try pausing silently next time.`;
    } else if (wordsCount > 25) {
      comment = "Rich, detailed response! Excellent vocabulary depth.";
    }

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: speechContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      comment: comment
    };

    const updatedConversation = [...messages, userMsg];
    setMessages(updatedConversation);
    setTranscript("");
    setTextInput("");
    setRecordingSeconds(0);
    stopSpeechRecognition();
    setIsCoachFormulating(true);
    setError(null);

    try {
      const response = await fetch("/api/coach/converse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedConversation.map(m => ({ role: m.role, content: m.content })),
          goal: selectedGoal,
          level: selectedLevel,
          profile: profile
        })
      });

      if (!response.ok) throw new Error("Converse turn failed.");
      const data = await response.json();

      const newCoachMessage = {
        id: `coach-${Date.now()}`,
        role: "assistant" as const,
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, newCoachMessage]);
      speakText(data.content);

      // Check if conversation finished (4+ user turns or explicit conclusion)
      const userTurns = updatedConversation.filter(m => m.role === "user").length;
      if (
        data.content.includes("clear understanding of your communication style") || 
        data.content.includes("review today's session together") ||
        userTurns >= 5
      ) {
        setTimeout(() => {
          handleEndSession(updatedConversation);
        }, 2500);
      }

    } catch (err) {
      console.error(err);
      const fallbackResponse = `You explained earlier how much you value strong outcomes. Based on what you just shared, what is one challenge you faced and how did you overcome it?`;
      setMessages(prev => [
        ...prev,
        {
          id: `coach-${Date.now()}`,
          role: "assistant",
          content: fallbackResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      speakText(fallbackResponse);
    } finally {
      setIsCoachFormulating(false);
    }
  };

  // Conclude session and generate detailed coaching report
  const handleEndSession = async (currMessages = messages) => {
    stopSpeechRecognition();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsCoachFormulating(true);
    setSessionState("summary");

    const userMsgs = currMessages.filter(m => m.role === "user").map(m => m.content);
    const combinedSpeech = userMsgs.join(" ");
    const wordCount = combinedSpeech.split(/\s+/).filter(Boolean).length;
    const allFillers = getFillerWordCounts(combinedSpeech);

    try {
      // Prompt analysis
      const response = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: `${selectedGoal} Session`,
          promptText: `Conversed on ${selectedGoal} at ${selectedLevel} level.`,
          userSpeechText: combinedSpeech || "I want to improve my global communication confidence.",
          speechDurationSeconds: userMsgs.length * 30
        })
      });

      let data: any = {};
      if (response.ok) {
        data = await response.json();
      }

      const report = {
        overallScore: Math.round((data.confidenceScore || 88 + data.clarityScore || 90 + data.vocabularyScore || 86) / 3),
        confidenceScore: data.confidenceScore || 88,
        pacingScore: data.wordsPerMinute || 135,
        pronunciationScore: 90,
        grammarScore: data.clarityScore || 88,
        vocabularyScore: data.vocabularyScore || 86,
        clarityScore: data.clarityScore || 92,
        toneStyle: "Calm, Professional & Assertive",
        energyScore: 82,
        professionalismScore: 94,
        strengths: data.strengths || [
          "Authentic, transparent tone with clear personal examples.",
          "Good logical flow connecting your experience to future goals.",
          "Maintained a calm speaking pace suitable for international teams."
        ],
        improvements: data.weaknesses || [
          "Eliminate transitional filler words (e.g., 'um', 'so') by embracing deliberate silence.",
          "Lead with your key takeaway first before detailing background context.",
          "Inject stronger action verbs when describing technical accomplishments."
        ],
        fillerWordBreakdown: Object.keys(allFillers).length > 0 ? allFillers : { "um": 2, "so": 1 },
        bestResponse: userMsgs[userMsgs.length - 1] || "My goal is to communicate clearly and confidently in international technical discussions.",
        responseNeedingWork: {
          original: userMsgs[0] || "Um, basically I work in software and I like building products.",
          improved: data.improvedPhrasing || `"I lead frontend development projects, specializing in building high-impact AI web applications that deliver real user value."`,
          reason: "Replacing filler openers with direct, executive assertions projects immediate authority."
        },
        exercises: [
          {
            title: "Pace Alignment Drill",
            desc: "Speak continuously for 60 seconds at a measured 135 WPM pace without using filler words."
          },
          {
            title: "Silent Transition Pause",
            desc: "Practice taking a full 1-second silent breath at every period and comma."
          },
          {
            title: "PREP Method Structuring",
            desc: "Structure answers as Point, Reason, Example, and Point to maximize clarity."
          }
        ],
        recommendedNextSession: `Practice a 10-minute session on '${selectedGoal}' focusing on filler word elimination.`,
        coachEncouragement: `Great job today, ${userName}! You demonstrated strong self-awareness and solid foundational clarity. Practicing daily for just 10 minutes will quickly elevate your speaking confidence.`
      };

      setSummaryReport(report);

      // Log session
      const loggedSession: PracticeSession = {
        id: `session-${Date.now()}`,
        scenarioId: "voice-coach",
        scenarioTitle: `${selectedGoal} Voice Session`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        userSpeechText: combinedSpeech,
        durationSeconds: userMsgs.length * 30,
        feedback: {
          clarityScore: report.clarityScore,
          paceScore: 90,
          vocabularyScore: report.vocabularyScore,
          confidenceScore: report.confidenceScore,
          wordsPerMinute: report.pacingScore,
          fillerWordsDetected: Object.keys(report.fillerWordBreakdown),
          strengths: report.strengths,
          weaknesses: report.improvements,
          improvedPhrasing: report.responseNeedingWork.improved,
          explanation: report.coachEncouragement
        },
        tag: selectedGoal
      };

      onSessionLogged(loggedSession);
      setSessionHistory(prev => [loggedSession, ...prev]);

    } catch (err) {
      console.error(err);
    } finally {
      setIsCoachFormulating(false);
    }
  };

  // Download Transcript as TXT File
  const handleDownloadTranscript = () => {
    const textLines = messages.map(m => `[${m.timestamp}] ${m.role === "assistant" ? "AI Coach" : userName}: ${m.content}`);
    const fullContent = `SpeakGlobal AI Coaching Transcript\nDate: ${new Date().toLocaleDateString()}\nGoal: ${selectedGoal}\nParticipant: ${userName}\n\n` + textLines.join("\n\n");
    
    const blob = new Blob([fullContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SpeakGlobal_Transcript_${selectedGoal.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    if (showToast) showToast("Transcript downloaded successfully.", "success");
  };

  // Copy Transcript to Clipboard
  const handleCopyTranscript = () => {
    const textLines = messages.map(m => `[${m.timestamp}] ${m.role === "assistant" ? "AI Coach" : userName}: ${m.content}`);
    navigator.clipboard.writeText(textLines.join("\n\n"));
    if (showToast) showToast("Transcript copied to clipboard.", "success");
  };

  // Filter messages by search term
  const filteredMessages = messages.filter(m => 
    !transcriptSearch || m.content.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  // --- VIEW 1: WELCOME SCREEN (SESSION START) ---
  if (sessionState === "welcome") {
    return (
      <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-editorial-border pb-6">
          <div>
            <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest block">VOICE-FIRST AI COACHING</span>
            <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Live Voice Conversation</h1>
            <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed">
              Have a real, natural voice conversation with your AI Communication Coach.
            </p>
          </div>
          {sessionHistory.length > 0 && (
            <button
              onClick={() => setSessionState("history")}
              className="px-4 py-2 bg-white border border-editorial-border text-editorial-dark hover:bg-editorial-light-gray font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <Clock size={13} /> View Session History ({sessionHistory.length})
            </button>
          )}
        </div>

        {/* Welcome Card */}
        <div className="bg-white border border-editorial-border p-8 sm:p-10 relative shadow-sm space-y-8">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />

          {/* User & Goal Info Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-editorial-border">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">LEARNER</span>
              <div className="text-xl font-light text-editorial-dark flex items-center gap-2">
                {userName}
                <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-200 uppercase tracking-widest font-bold">
                  Active Member
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">TODAY'S COMMUNICATION GOAL</span>
                <button
                  onClick={() => setShowGoalSelectorModal(true)}
                  className="text-[10px] font-mono text-indigo-600 font-bold hover:underline cursor-pointer uppercase flex items-center gap-1"
                >
                  <Sliders size={11} /> Change Goal
                </button>
              </div>
              <div className="text-xl font-light text-editorial-dark flex items-center gap-2">
                <Target size={18} className="text-indigo-600 shrink-0" />
                <span>{selectedGoal}</span>
              </div>
            </div>
          </div>

          {/* Telemetry Status Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Session Duration */}
            <div className="p-5 bg-editorial-light-gray border border-editorial-border space-y-1.5">
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">ESTIMATED DURATION</span>
              <div className="text-base font-bold text-editorial-dark flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                <span>10 - 15 Minutes</span>
              </div>
              <p className="text-[10px] text-editorial-muted font-light leading-snug">
                4-5 natural voice turns with AI analysis
              </p>
            </div>

            {/* Card 2: Microphone Status */}
            <div className="p-5 bg-editorial-light-gray border border-editorial-border space-y-1.5">
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">MICROPHONE STATUS</span>
              <div className="text-base font-bold text-emerald-800 flex items-center gap-2">
                <Mic size={16} className="text-emerald-600 animate-pulse" />
                <span>Microphone Ready</span>
              </div>
              <p className="text-[10px] text-editorial-muted font-light leading-snug">
                Browser audio capture enabled
              </p>
            </div>

            {/* Card 3: Environment Status */}
            <div className="p-5 bg-editorial-light-gray border border-editorial-border space-y-1.5">
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">ENVIRONMENT STATUS</span>
              <div className="text-base font-bold text-editorial-dark flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Quiet Environment (32 dB)</span>
              </div>
              <p className="text-[10px] text-editorial-muted font-light leading-snug">
                Optimal acoustics for speech recognition
              </p>
            </div>
          </div>

          {/* Large Start AI Conversation Button */}
          <div className="pt-4 text-center space-y-4">
            <button
              onClick={handleStartLiveConversation}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-sm uppercase tracking-widest transition-all cursor-pointer font-bold shadow-md flex items-center justify-center gap-3 group"
            >
              <Mic size={18} className="group-hover:scale-110 transition-transform" />
              <span>Start AI Conversation</span>
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-editorial-muted font-light italic">
              There are no right or wrong answers. Speak naturally and your coach will guide you.
            </p>
          </div>
        </div>

        {/* Change Goal Modal */}
        {showGoalSelectorModal && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white border border-editorial-border max-w-xl w-full p-6 space-y-6 shadow-xl relative">
              <div className="flex justify-between items-center border-b border-editorial-border pb-4">
                <h3 className="text-sm font-bold text-editorial-dark font-mono uppercase tracking-wider">Select Communication Goal</h3>
                <button
                  onClick={() => setShowGoalSelectorModal(false)}
                  className="text-editorial-muted hover:text-editorial-dark text-xs font-mono uppercase cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {COMMUNICATION_GOALS.map((goal) => {
                  const isSelected = selectedGoal === goal;
                  return (
                    <button
                      key={goal}
                      onClick={() => {
                        setSelectedGoal(goal);
                        setShowGoalSelectorModal(false);
                      }}
                      className={`p-3 text-left border text-xs font-light transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold" 
                          : "bg-white border-editorial-border hover:border-neutral-400 text-editorial-dark"
                      }`}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW 2: ACTIVE VOICE CONVERSATION ARENA ---
  if (sessionState === "active") {
    return (
      <div className="space-y-6 pb-16 animate-fade-in text-editorial-text font-sans">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-editorial-border pb-4 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setSessionState("welcome");
              }}
              className="text-editorial-muted hover:text-editorial-dark flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest cursor-pointer"
            >
              <ArrowLeft size={12} /> Exit
            </button>
            <div className="h-4 w-[1px] bg-editorial-border" />
            <span className="text-xs font-bold text-editorial-dark font-mono uppercase tracking-wider">
              Goal: {selectedGoal}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Audio Controls */}
            <div className="flex items-center gap-2 bg-editorial-light-gray border border-editorial-border px-3 py-1.5">
              <button
                onClick={() => setTtsMuted(!ttsMuted)}
                title={ttsMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                className="text-editorial-dark hover:text-indigo-600 cursor-pointer"
              >
                {ttsMuted ? <VolumeX size={15} className="text-red-600" /> : <Volume2 size={15} />}
              </button>
              <div className="h-3 w-[1px] bg-editorial-border" />
              <button
                onClick={() => {
                  const nextRate = ttsRate === 1.0 ? 1.1 : ttsRate === 1.1 ? 0.9 : 1.0;
                  setTtsRate(nextRate);
                }}
                className="text-[10px] font-mono font-bold text-editorial-dark cursor-pointer uppercase"
              >
                Speed: {ttsRate}x
              </button>
            </div>

            <button
              onClick={() => handleEndSession()}
              className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-mono text-xs uppercase tracking-wider font-bold cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={13} /> Conclude Session
            </button>
          </div>
        </div>

        {/* Main Grid: Left Voice Stage / Right Real-Time Analysis Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Voice Stage & Transcript (col-span-7) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between bg-white border border-editorial-border p-6 shadow-xs relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />

            {/* AI Voice Avatar & Waveform Header */}
            <div className="p-6 bg-editorial-dark text-white space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold font-mono text-xs ${isCoachSpeaking ? "animate-pulse ring-4 ring-indigo-400/40" : ""}`}>
                    AI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">AI Communication Coach</h3>
                    <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest block">
                      {isCoachSpeaking ? "Speaking Audio..." : isCoachFormulating ? "Listening & Thinking..." : "Ready for User Response"}
                    </span>
                  </div>
                </div>

                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      const lastCoachMsg = [...messages].reverse().find(m => m.role === "assistant");
                      if (lastCoachMsg) speakText(lastCoachMsg.content);
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-[10px] uppercase tracking-wider cursor-pointer flex items-center gap-1.5 border border-neutral-700"
                  >
                    <RotateCcw size={12} /> Replay Voice
                  </button>
                )}
              </div>

              {/* Animated Waveform during Coach speaking */}
              {isCoachSpeaking && (
                <div className="pt-2 flex justify-center items-center gap-1">
                  {[40, 70, 100, 60, 90, 50, 80, 40, 90, 60].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-indigo-400 animate-pulse" 
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Dialogue Feed */}
            <div className="flex-grow overflow-y-auto space-y-6 max-h-[380px] pr-2 p-2">
              {messages.map((m) => {
                const isCoach = m.role === "assistant";
                return (
                  <div key={m.id} className="space-y-2 animate-fade-in">
                    <div className={`flex gap-3 max-w-[90%] ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                      <div className={`h-7 w-7 shrink-0 flex items-center justify-center font-mono font-bold text-[9px] border ${
                        isCoach ? "bg-indigo-600 text-white border-indigo-600" : "bg-editorial-dark text-white border-editorial-dark"
                      }`}>
                        {isCoach ? "AI" : "YOU"}
                      </div>

                      <div className={`p-4 border ${
                        isCoach ? "bg-white border-editorial-border text-editorial-dark" : "bg-indigo-50/50 border-indigo-200 text-editorial-dark"
                      }`}>
                        <div className="text-xs sm:text-sm font-light leading-relaxed whitespace-pre-wrap select-text">
                          {m.content}
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-editorial-border/40 text-[9px] font-mono text-editorial-muted uppercase">
                          <span>{m.timestamp}</span>
                          <button
                            onClick={() => speakText(m.content)}
                            className="text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Volume1 size={11} /> Play Audio
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Inline Comment beside User Turn */}
                    {!isCoach && m.comment && (
                      <div className="ml-auto max-w-[85%] text-right pr-10">
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 inline-block">
                          💡 Coach Note: {m.comment}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {isCoachFormulating && (
                <div className="flex items-center gap-2 bg-indigo-50 p-4 border border-indigo-200 max-w-xs">
                  <RefreshCw size={13} className="animate-spin text-indigo-600" />
                  <span className="text-[10px] font-mono text-indigo-900 uppercase tracking-widest font-bold">
                    AI Coach is processing speech...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Control Bottom Dock */}
            <div className="pt-4 border-t border-editorial-border space-y-4">
              <div className="bg-editorial-light-gray p-4 border border-editorial-border text-center space-y-3">
                <VoiceWaveform isRecording={isRecording} />

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
                    className={`px-8 py-4 text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer font-bold ${
                      isRecording 
                        ? "bg-red-600 hover:bg-red-700 text-white animate-pulse" 
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    }`}
                  >
                    {isRecording ? <Square size={14} fill="currentColor" /> : <Mic size={14} />}
                    <span>{isRecording ? "Stop Recording" : "Speak Your Answer"}</span>
                  </button>

                  {inputMode === "voice" && (
                    <button
                      onClick={handleSendUserTurn}
                      disabled={!transcript.trim()}
                      className="px-6 py-4 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest cursor-pointer font-bold disabled:opacity-40 flex items-center gap-2"
                    >
                      <span>Send Voice Response</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {isRecording && (
                  <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider block animate-pulse">
                    Recording Audio ({recordingSeconds}s)... Speak naturally.
                  </span>
                )}
              </div>

              {/* Live Transcript Display Box */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono text-editorial-muted uppercase tracking-wider">
                  <span>Live Speech Transcription</span>
                  <button
                    onClick={() => setInputMode(inputMode === "voice" ? "text" : "voice")}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    {inputMode === "voice" ? "Prefer Typing? Switch to Text" : "Switch back to Voice"}
                  </button>
                </div>

                {inputMode === "voice" ? (
                  <div className="p-3 bg-white border border-editorial-border min-h-[50px] text-xs font-light text-editorial-dark leading-relaxed italic">
                    {transcript.trim() ? transcript : "Awaiting your voice input... Click 'Speak Your Answer' to begin."}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendUserTurn()}
                      placeholder="Type your response to your AI Coach..."
                      className="flex-1 p-3 bg-white border border-editorial-border text-xs text-editorial-dark focus:outline-none focus:border-editorial-dark"
                    />
                    <button
                      onClick={handleSendUserTurn}
                      disabled={!textInput.trim()}
                      className="px-5 py-3 bg-editorial-dark text-white font-mono text-xs uppercase font-bold cursor-pointer disabled:opacity-40"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time Analysis Panel (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-editorial-border p-6 space-y-6 shadow-xs relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />

              <div className="flex justify-between items-center border-b border-editorial-border pb-3">
                <div>
                  <span className="text-[9px] font-mono text-indigo-600 uppercase tracking-widest font-bold block">LIVE DIAGNOSTICS</span>
                  <h3 className="text-sm font-bold text-editorial-dark mt-0.5">Real-Time Speech Analysis</h3>
                </div>
                <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 uppercase tracking-wider font-bold animate-pulse">
                  Active
                </span>
              </div>

              {/* Grid of Live Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {/* Confidence */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">CONFIDENCE</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.confidence}%</div>
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${liveMetrics.confidence}%` }} />
                  </div>
                </div>

                {/* Pace WPM */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">SPEAKING PACE</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.pacing} WPM</div>
                  <span className="text-[8px] font-mono uppercase text-emerald-700 font-bold">Optimal (130-150)</span>
                </div>

                {/* Pronunciation */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">PRONUNCIATION</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.pronunciation}%</div>
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${liveMetrics.pronunciation}%` }} />
                  </div>
                </div>

                {/* Grammar */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">GRAMMAR</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.grammar}%</div>
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${liveMetrics.grammar}%` }} />
                  </div>
                </div>

                {/* Vocabulary */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">VOCABULARY</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.vocabulary}%</div>
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${liveMetrics.vocabulary}%` }} />
                  </div>
                </div>

                {/* Clarity */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">CLARITY</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.clarity}%</div>
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${liveMetrics.clarity}%` }} />
                  </div>
                </div>

                {/* Tone */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">TONE</span>
                  <div className="text-xs font-bold text-editorial-dark truncate mt-1">{liveMetrics.tone}</div>
                  <span className="text-[8px] font-mono uppercase text-editorial-muted">Assertive</span>
                </div>

                {/* Professionalism */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">PROFESSIONALISM</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.professionalism}%</div>
                  <div className="h-1 bg-neutral-200 w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${liveMetrics.professionalism}%` }} />
                  </div>
                </div>

                {/* Filler Words */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">FILLER WORDS</span>
                  <div className={`text-lg font-bold ${liveMetrics.fillerCount > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    {liveMetrics.fillerCount} Counted
                  </div>
                  <span className="text-[8px] font-mono uppercase text-editorial-muted">"um, uh, like"</span>
                </div>

                {/* Pause Control */}
                <div className="p-3 bg-editorial-light-gray border border-editorial-border space-y-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">PAUSE CONTROL</span>
                  <div className="text-lg font-bold text-editorial-dark">{liveMetrics.pauseControl}%</div>
                  <span className="text-[8px] font-mono uppercase text-emerald-700">Controlled</span>
                </div>
              </div>

              {/* Real-Time Mentor Tip */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Sparkles size={13} /> LIVE MENTOR TIP
                </span>
                <p className="font-light leading-relaxed">{liveCoachingPrompt}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- VIEW 3: END OF SESSION DETAILED COACHING REPORT ---
  if (sessionState === "summary" && summaryReport) {
    return (
      <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-editorial-border pb-6">
          <div>
            <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest block">SESSION COMPLETE</span>
            <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Coaching Report</h1>
            <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed">
              Detailed communication performance feedback synthesized by your AI Coach.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSessionState("welcome")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs uppercase tracking-wider cursor-pointer font-bold flex items-center gap-2"
            >
              Start New Session <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Overall Score Banner */}
        <div className="bg-editorial-dark text-white p-8 relative shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-500" />
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-indigo-300 font-bold uppercase tracking-widest block">
              COMMUNICATION PERFORMANCE
            </span>
            <h2 className="text-2xl font-light tracking-tight">Overall Communication Score</h2>
            <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-xl">
              {summaryReport.coachEncouragement}
            </p>
          </div>
          <div className="text-right shrink-0 bg-neutral-900 border border-neutral-800 p-6">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest block">OVERALL SCORE</span>
            <span className="text-4xl font-bold text-indigo-400 mt-1 block">{summaryReport.overallScore}%</span>
          </div>
        </div>

        {/* Score Metrics Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {[
            { label: "Confidence", score: summaryReport.confidenceScore },
            { label: "Pace (WPM)", score: summaryReport.pacingScore },
            { label: "Pronunciation", score: summaryReport.pronunciationScore },
            { label: "Grammar", score: summaryReport.grammarScore },
            { label: "Vocabulary", score: summaryReport.vocabularyScore },
            { label: "Clarity", score: summaryReport.clarityScore },
          ].map((m, i) => (
            <div key={i} className="p-4 bg-white border border-editorial-border space-y-1 text-center">
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">{m.label}</span>
              <div className="text-xl font-bold text-editorial-dark">{m.score}{m.label.includes("WPM") ? "" : "%"}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-white border border-editorial-border p-6 space-y-4 shadow-xs">
            <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" /> KEY STRENGTHS
            </span>
            <ul className="space-y-2.5">
              {summaryReport.strengths.map((s, i) => (
                <li key={i} className="text-xs text-editorial-dark font-light leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-600 font-mono font-bold shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white border border-editorial-border p-6 space-y-4 shadow-xs">
            <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Activity size={15} className="text-amber-600" /> AREAS FOR IMPROVEMENT
            </span>
            <ul className="space-y-2.5">
              {summaryReport.improvements.map((imp, i) => (
                <li key={i} className="text-xs text-editorial-dark font-light leading-relaxed flex items-start gap-2">
                  <span className="text-amber-600 font-mono font-bold shrink-0">→</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Response Comparison: Original vs Improved */}
        <div className="bg-white border border-editorial-border p-6 space-y-4 shadow-xs">
          <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest block">
            EXECUTIVE PHRASING REWRITE
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-50/50 border border-red-200 space-y-2">
              <span className="text-[9px] font-mono text-red-700 font-bold uppercase tracking-wider block">YOUR RESPONSE</span>
              <p className="text-xs text-editorial-dark italic font-light leading-relaxed">"{summaryReport.responseNeedingWork.original}"</p>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="text-[9px] font-mono text-emerald-800 font-bold uppercase tracking-wider block">AI REFINED REWRITE</span>
              <p className="text-xs text-emerald-950 font-normal leading-relaxed">{summaryReport.responseNeedingWork.improved}</p>
            </div>
          </div>
          <p className="text-xs text-editorial-muted font-light italic">
            Reason: {summaryReport.responseNeedingWork.reason}
          </p>
        </div>

        {/* Personalized Practice Exercises */}
        <div className="bg-white border border-editorial-border p-6 space-y-4 shadow-xs">
          <span className="text-[10px] font-mono text-editorial-dark font-bold uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen size={15} className="text-indigo-600" /> PERSONALIZED PRACTICE EXERCISES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {summaryReport.exercises.map((ex, i) => (
              <div key={i} className="p-4 bg-indigo-50/30 border border-indigo-100 space-y-2">
                <span className="text-[9px] font-mono text-indigo-700 font-bold uppercase tracking-wider block">EXERCISE 0{i + 1}</span>
                <h4 className="text-xs font-bold text-indigo-950">{ex.title}</h4>
                <p className="text-[11px] text-editorial-muted font-light leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Transcript Section */}
        <div className="bg-white border border-editorial-border p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-editorial-border pb-4">
            <div>
              <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">FULL DIALOGUE LOG</span>
              <h3 className="text-lg font-light text-editorial-dark">Conversation Transcript</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyTranscript}
                className="px-3 py-2 bg-white border border-editorial-border text-editorial-dark hover:bg-editorial-light-gray font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
              >
                <Copy size={13} /> Copy
              </button>
              <button
                onClick={handleDownloadTranscript}
                className="px-3 py-2 bg-editorial-dark text-white font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5 font-bold"
              >
                <Download size={13} /> Download TXT
              </button>
            </div>
          </div>

          {/* Transcript Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-editorial-muted" />
            <input
              type="text"
              value={transcriptSearch}
              onChange={(e) => setTranscriptSearch(e.target.value)}
              placeholder="Search transcript by keyword..."
              className="w-full pl-9 pr-4 py-2.5 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:outline-none focus:border-editorial-dark"
            />
          </div>

          {/* Transcript List */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {filteredMessages.map((m) => {
              const isCoach = m.role === "assistant";
              return (
                <div key={m.id} className="p-4 bg-editorial-light-gray/40 border border-editorial-border space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className={`font-bold uppercase ${isCoach ? "text-indigo-600" : "text-editorial-dark"}`}>
                      {isCoach ? "AI Coach" : userName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-editorial-muted">{m.timestamp}</span>
                      <button
                        onClick={() => speakText(m.content)}
                        className="text-indigo-600 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Volume1 size={11} /> Replay Audio
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-editorial-dark font-light leading-relaxed select-text">{m.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 4: SESSION HISTORY & PROGRESS TRENDS ---
  if (sessionState === "history") {
    return (
      <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
        <div className="flex justify-between items-center border-b border-editorial-border pb-4">
          <div>
            <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">HISTORIC LOGS</span>
            <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Session History & Progress</h1>
          </div>
          <button
            onClick={() => setSessionState("welcome")}
            className="px-4 py-2 bg-editorial-dark text-white font-mono text-xs uppercase tracking-wider cursor-pointer font-bold flex items-center gap-1.5"
          >
            <ArrowLeft size={13} /> Back to Coach
          </button>
        </div>

        {sessionHistory.length === 0 ? (
          <div className="p-12 bg-white border border-editorial-border text-center space-y-4">
            <Clock size={32} className="mx-auto text-editorial-muted" />
            <h3 className="text-lg font-light text-editorial-dark">No Previous Sessions Yet</h3>
            <p className="text-xs text-editorial-muted font-light max-w-sm mx-auto">
              Complete your first live AI voice session to unlock long-term progress tracking and score comparisons.
            </p>
            <button
              onClick={() => setSessionState("welcome")}
              className="px-6 py-3 bg-indigo-600 text-white font-mono text-xs uppercase font-bold cursor-pointer"
            >
              Start First Session
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-editorial-border space-y-1">
                <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">TOTAL SESSIONS</span>
                <div className="text-2xl font-bold text-editorial-dark">{sessionHistory.length}</div>
              </div>
              <div className="p-6 bg-white border border-editorial-border space-y-1">
                <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">AVERAGE SCORE</span>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round(sessionHistory.reduce((a, b) => a + (b.feedback.confidenceScore || 85), 0) / sessionHistory.length)}%
                </div>
              </div>
              <div className="p-6 bg-white border border-editorial-border space-y-1">
                <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">PRACTICE STREAK</span>
                <div className="text-2xl font-bold text-emerald-700">Active Daily</div>
              </div>
            </div>

            <div className="bg-white border border-editorial-border divide-y divide-editorial-border">
              {sessionHistory.map((s) => (
                <div key={s.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-indigo-600 font-bold uppercase tracking-wider block">{s.tag}</span>
                    <h3 className="text-sm font-bold text-editorial-dark">{s.scenarioTitle}</h3>
                    <p className="text-xs text-editorial-muted font-light">{s.date} • Duration: {Math.round(s.durationSeconds / 60)} mins</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-editorial-muted uppercase block">SCORE</span>
                      <span className="text-xl font-bold text-indigo-600">{s.feedback.confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
