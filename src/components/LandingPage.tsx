import React, { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  MessageSquare, 
  Volume2, 
  Mic, 
  Award, 
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Target,
  Users,
  Code2,
  Briefcase,
  GraduationCap,
  Globe2,
  ChevronDown,
  Play,
  Activity,
  BarChart2,
  Check,
  HelpCircle
} from "lucide-react";
import Logo from "./Logo";

interface LandingPageProps {
  onStartOnboarding: () => void;
  onNavigateToLogin: () => void;
  onQuickSignIn?: (profile: any) => void;
  onSelectScenario?: (scenarioId: string) => void;
}

export default function LandingPage({ onStartOnboarding, onNavigateToLogin, onQuickSignIn, onSelectScenario }: LandingPageProps) {
  // Interactive Conversation Preview State
  const [activePreviewTab, setActivePreviewTab] = useState<"interview" | "presentation" | "networking">("interview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Demo Analyzer state
  const [demoInput, setDemoInput] = useState(
    "My name is David. I'm studying Computer Science and I enjoy building websites."
  );
  const [demoResult, setDemoResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const openSignUpModal = () => {
    onStartOnboarding();
  };

  const openSignInModal = () => {
    onNavigateToLogin();
  };

  const handleQuickSignInClick = () => {
    if (onQuickSignIn) {
      const savedBackup = localStorage.getItem("speakglobal_profile_backup") || localStorage.getItem("speakglobal_profile");
      if (savedBackup) {
        try {
          const parsed = JSON.parse(savedBackup);
          onQuickSignIn(parsed);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      onQuickSignIn({
        name: "Alex Chen",
        profession: "Lead Software Engineer",
        communicationGoal: "Interview Preparation",
        nativeLanguage: "Mandarin",
        confidenceLevel: "Moderate",
        preferredLearningPace: "Standard (15 mins/day)",
        isOnboarded: true,
        roadmap: {
          focusArea: "Interview preparation for Lead Software Engineer",
          dailyTimeRecommendation: "15 minutes daily",
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
        }
      });
    }
  };

  const handleDemoAnalyze = async () => {
    setIsAnalyzing(true);
    setDemoResult(null);

    try {
      const response = await fetch("/api/coach/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: "Landing Quick Demo",
          promptText: "Introduce yourself and your focus area.",
          userSpeechText: demoInput,
          speechDurationSeconds: 15
        })
      });

      if (!response.ok) throw new Error("Demo analyze failed");
      const data = await response.json();
      setDemoResult(data);
    } catch (err) {
      console.error(err);
      setDemoResult({
        clarityScore: 92,
        paceScore: 88,
        vocabularyScore: 85,
        confidenceScore: 90,
        wordsPerMinute: 138,
        fillerWordsDetected: ["None detected! Outstanding clarity."],
        strengths: ["Clear direct thesis statement.", "Excellent cadence and vocabulary spacing."],
        weaknesses: ["Could elaborate on a specific project or technical challenge overcome."],
        improvedPhrasing: "I specialize in computer science with a passion for architecting high-performance web applications. Currently, I'm developing scalable frontend systems.",
        explanation: "Your delivery is concise and structured. Adding a specific technical project highlight gives listeners immediate proof of your expertise."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Preview dialogues mapping
  const previewConversations = {
    interview: {
      role: "Job Interviewer Persona",
      userSpeech: "My name is David. I'm studying Computer Science and I enjoy building websites.",
      aiFollowup: "It's great to meet you, David! What inspired you to study Computer Science, and what kind of websites or web applications do you enjoy building most?",
      insights: [
        { label: "Pacing", value: "138 WPM (Optimal)" },
        { label: "Fillers", value: "0 Detected" },
        { label: "Clarity", value: "94%" }
      ]
    },
    presentation: {
      role: "Executive Boardroom Persona",
      userSpeech: "We propose automating our QA regression suite to reduce deployment friction and speed up developer velocity.",
      aiFollowup: "That proposal directly aligns with our operational goals. How do you plan to measure the ROI during the first quarter of automation?",
      insights: [
        { label: "Pacing", value: "142 WPM (Executive)" },
        { label: "Structure", value: "Pyramid Principle" },
        { label: "Authority", value: "High" }
      ]
    },
    networking: {
      role: "Global Conference Partner",
      userSpeech: "I'm currently working on open-source AI tooling designed to help non-native speakers communicate in international teams.",
      aiFollowup: "That sounds incredibly impactful! What was the key problem you identified that led you to start this open-source project?",
      insights: [
        { label: "Warmth", value: "96%" },
        { label: "Pacing", value: "132 WPM" },
        { label: "Engagement", value: "Stellar" }
      ]
    }
  };

  const faqs = [
    {
      q: "What is SpeakGlobal, and how is it different from accent training?",
      a: "SpeakGlobal is an AI Communication Coach that builds real speaking confidence, rhetorical structure (STAR, PREP), and delivery clarity. We DO NOT try to erase or change your native accent—your accent is part of your unique identity. Instead, we help you eliminate speech crutches (like 'um' or 'basically'), structure your thoughts under pressure, and speak assertively."
    },
    {
      q: "How does the AI Coach generate follow-up questions?",
      a: "Our AI Coach uses Gemini 3.6 Flash models on the server to listen deeply to every word you say. It never asks random or pre-scripted questions. If you mention studying Computer Science and building websites, it remembers those exact details and asks connected follow-up questions like 'What inspired you to study CS?' or 'What project are you most proud of building?'"
    },
    {
      q: "Who is SpeakGlobal built for?",
      a: "SpeakGlobal is designed for university students, job seekers preparing for interviews, software engineers, remote workers, founders, and global professionals who want to communicate clearly and confidently during interviews, presentations, meetings, and networking."
    },
    {
      q: "How long should I practice each day?",
      a: "Just 10 to 15 minutes of daily practice is enough to build muscle memory. Our AI Coach provides instant metrics on speaking pace (WPM), filler word count, clarity, and executive rewrites after every session."
    },
    {
      q: "Is my voice data private and secure?",
      a: "Yes. All audio streams and transcripts are processed securely in Cloud Run server instances and are never sold or shared with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text flex flex-col font-sans selection:bg-editorial-dark selection:text-white">
      {/* Top Navigation Header */}
      <header className="h-20 bg-white border-b border-editorial-border w-full flex items-center justify-between px-6 sm:px-12 sticky top-0 z-50">
        <Logo size={28} />
        <div className="flex items-center gap-3">
          <button 
            onClick={openSignInModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-editorial-light-gray text-editorial-muted hover:text-editorial-dark border border-editorial-border font-mono tracking-wider text-[11px] uppercase transition-all cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-28 text-center space-y-8">
        {/* Editorial Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-editorial-light-gray border border-editorial-border text-editorial-muted font-mono text-[10px] uppercase tracking-widest">
          <Sparkles size={12} className="text-editorial-dark" />
          <span>Speak Clearly. Communicate Confidently. Connect Globally.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[1.05] text-editorial-dark max-w-4xl mx-auto">
          The World's Best AI <br className="hidden md:block"/>
          <span className="editorial-serif text-editorial-dark">Communication Coach.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-editorial-muted max-w-2xl mx-auto font-light leading-relaxed">
          SpeakGlobal helps you master high-stakes interviews, presentations, and international meetings. 
          Receive real-time voice coaching, natural follow-up questions, and instant speech metrics. 
          We build real communication confidence—not accent modifications.
        </p>

        {/* Hero CTAs */}
        <div className="pt-4 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={openSignUpModal}
              className="w-full sm:w-auto px-8 py-4 bg-editorial-dark hover:bg-neutral-800 text-white font-mono uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-editorial-dark shadow-md"
            >
              Start Free AI Session <ArrowRight size={14} />
            </button>
            <a
              href="#conversation-preview"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-editorial-light-gray text-editorial-dark font-mono uppercase tracking-wider text-xs transition-colors border border-editorial-dark flex items-center justify-center gap-2 cursor-pointer"
            >
              See How It Works <Play size={12} className="fill-current" />
            </a>
          </div>
        </div>
      </section>

      {/* Real AI Conversation Preview Section */}
      <section id="conversation-preview" className="max-w-5xl mx-auto w-full px-6 py-20">
        <div className="bg-white border border-editorial-border shadow-md relative p-8 md:p-12">
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-editorial-dark" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 border-b border-editorial-border">
            <div>
              <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">INTERACTIVE LIVE DEMO</span>
              <h3 className="text-xl md:text-2xl font-bold text-editorial-dark tracking-tight mt-1">
                Real AI Coach Conversation Preview
              </h3>
            </div>

            {/* Conversation scenario selector tabs */}
            <div className="flex items-center gap-2 bg-editorial-light-gray p-1 border border-editorial-border">
              <button
                onClick={() => setActivePreviewTab("interview")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activePreviewTab === "interview" 
                    ? "bg-editorial-dark text-white shadow-sm" 
                    : "text-editorial-muted hover:text-editorial-dark"
                }`}
              >
                Job Interview
              </button>
              <button
                onClick={() => setActivePreviewTab("presentation")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activePreviewTab === "presentation" 
                    ? "bg-editorial-dark text-white shadow-sm" 
                    : "text-editorial-muted hover:text-editorial-dark"
                }`}
              >
                Executive Pitch
              </button>
              <button
                onClick={() => setActivePreviewTab("networking")}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activePreviewTab === "networking" 
                    ? "bg-editorial-dark text-white shadow-sm" 
                    : "text-editorial-muted hover:text-editorial-dark"
                }`}
              >
                Networking
              </button>
            </div>
          </div>

          {/* Interactive Dialogue Visualizer */}
          <div className="mt-8 space-y-6">
            {/* AI Coach Greeting Turn */}
            <div className="flex items-start gap-4 bg-editorial-light-gray p-5 border border-editorial-border">
              <div className="h-9 w-9 rounded-full bg-editorial-dark text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                AI
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">
                  AI COMMUNICATION COACH • {previewConversations[activePreviewTab].role}
                </span>
                <p className="text-sm text-editorial-dark font-light leading-relaxed">
                  "Hi! I'm your AI Communication Coach. Today we'll have a real conversation together. I'll listen carefully, ask follow-up questions, and help you become a more confident communicator. Let's begin!"
                </p>
              </div>
            </div>

            {/* User Spoken Response Turn */}
            <div className="flex items-start gap-4 bg-white p-5 border border-editorial-border ml-4 md:ml-8">
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                YOU
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider block font-bold">
                  YOUR SPOKEN ANSWER
                </span>
                <p className="text-sm text-editorial-dark font-light leading-relaxed">
                  "{previewConversations[activePreviewTab].userSpeech}"
                </p>
              </div>
            </div>

            {/* AI Coach Natural Follow-up Question Turn */}
            <div className="flex items-start gap-4 bg-editorial-light-gray p-5 border border-editorial-border">
              <div className="h-9 w-9 rounded-full bg-editorial-dark text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                AI
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">
                  INTELLIGENT CONTEXTUAL FOLLOW-UP
                </span>
                <p className="text-sm text-editorial-dark font-light leading-relaxed">
                  "{previewConversations[activePreviewTab].aiFollowup}"
                </p>
              </div>
            </div>

            {/* Real-Time Metrics Bar */}
            <div className="pt-4 border-t border-editorial-border flex flex-wrap items-center justify-between gap-4 bg-neutral-900 text-white p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold">LIVE COACH METRICS</span>
              </div>
              <div className="flex items-center gap-6">
                {previewConversations[activePreviewTab].insights.map((ins, i) => (
                  <div key={i} className="text-right">
                    <span className="text-[9px] text-neutral-400 font-mono uppercase block">{ins.label}</span>
                    <span className="text-xs font-bold text-white font-mono">{ins.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How SpeakGlobal Works Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-editorial-border w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase block">FOUR SIMPLE STEPS TO CONFIDENCE</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-editorial-dark">
            How SpeakGlobal <span className="editorial-serif">Transforms Speaking.</span>
          </h2>
          <p className="text-sm text-editorial-muted max-w-xl mx-auto font-light">
            No robotic scripts. Experience natural dialogue with an AI coach that listens, analyzes, and guides you to executive delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="p-8 bg-white border border-editorial-border flex flex-col justify-between space-y-6 relative hover:border-editorial-dark transition-colors">
            <span className="text-4xl font-light font-mono text-editorial-border">01</span>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-editorial-dark">Choose Your Goal</h4>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Select from 14 goal modes including Job Interviews, Presentations, Sales Pitches, Standups, or Networking.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-editorial-border flex flex-col justify-between space-y-6 relative hover:border-editorial-dark transition-colors">
            <span className="text-4xl font-light font-mono text-editorial-border">02</span>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-editorial-dark">Speak Naturally</h4>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Start a real voice conversation. The AI greets you warmly, listens carefully, and asks intelligent follow-up questions based on what you say.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-editorial-border flex flex-col justify-between space-y-6 relative hover:border-editorial-dark transition-colors">
            <span className="text-4xl font-light font-mono text-editorial-border">03</span>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-editorial-dark">Get Live Metrics</h4>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Track your speaking pace (130-150 WPM), filler words ('um', 'basically'), clarity, tone, and rhetorical structure in real time.
              </p>
            </div>
          </div>

          <div className="p-8 bg-white border border-editorial-border flex flex-col justify-between space-y-6 relative hover:border-editorial-dark transition-colors">
            <span className="text-4xl font-light font-mono text-editorial-border">04</span>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-editorial-dark">Review Coaching Report</h4>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Receive a detailed report with strengths, improvement points, practical exercises, and a confidence score after every session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Speech Polisher Widget */}
      <section className="max-w-4xl mx-auto w-full px-6 py-12">
        <div className="p-8 bg-white border border-editorial-border shadow-sm relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-editorial-border">
            <div>
              <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">INSTANT SPEECH POLISHER</span>
              <h3 className="text-lg font-bold text-editorial-dark tracking-tight mt-1">Test Your Speech Clarity Right Now</h3>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">TYPE OR EDIT YOUR SPEECH</label>
              <textarea
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                className="flex-1 min-h-[160px] p-4 bg-editorial-light-gray text-editorial-dark border border-editorial-border focus:border-editorial-dark focus:outline-none transition-colors text-sm font-light resize-none leading-relaxed"
                placeholder="Type what you want to say in a meeting or interview..."
              />
              <button
                onClick={handleDemoAnalyze}
                disabled={isAnalyzing || !demoInput.trim()}
                className="w-full px-5 py-3 bg-editorial-dark hover:bg-neutral-800 text-white disabled:opacity-50 font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> Analyzing Speech...
                  </>
                ) : (
                  <>
                    Polish Speech <Sparkles size={13} className="text-white" />
                  </>
                )}
              </button>
            </div>

            <div className="bg-editorial-light-gray p-6 border border-editorial-border flex flex-col justify-between min-h-[240px]">
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
                  <div className="h-6 w-6 border-2 border-editorial-dark border-t-transparent animate-spin" />
                  <span className="text-[10px] text-editorial-muted font-mono tracking-widest uppercase">Evaluating cadence & rhetoric...</span>
                </div>
              )}

              {!isAnalyzing && !demoResult && (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-2">
                  <MessageSquare size={22} className="text-editorial-border" />
                  <span className="text-xs font-mono uppercase tracking-widest text-editorial-muted">Awaiting Speech Input</span>
                  <p className="text-xs text-editorial-muted max-w-[220px] font-light">
                    Click "Polish Speech" to view instant metrics and executive phrasing.
                  </p>
                </div>
              )}

              {!isAnalyzing && demoResult && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-editorial-border pb-2">
                    <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest">CLARITY SCORE</span>
                    <span className="text-base font-bold text-editorial-dark bg-white px-3 py-0.5 border border-editorial-border">
                      {demoResult.clarityScore}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-editorial-dark uppercase tracking-widest block font-bold">EXECUTIVE REWRITE</span>
                    <blockquote className="text-xs italic text-editorial-dark border-l-2 border-editorial-dark pl-3 mt-1 leading-relaxed font-light">
                      "{demoResult.improvedPhrasing}"
                    </blockquote>
                  </div>

                  <p className="text-xs text-editorial-muted font-light bg-white p-3 border border-editorial-border leading-relaxed">
                    {demoResult.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Target Audiences Bento Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-editorial-border w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase block">TAILORED FOR GLOBAL AMBITION</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-editorial-dark">
            Who SpeakGlobal Is Built For
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-editorial-border hover:border-editorial-dark transition-colors space-y-4">
            <div className="h-10 w-10 bg-editorial-light-gray border border-editorial-border flex items-center justify-center text-editorial-dark">
              <Code2 size={20} />
            </div>
            <h4 className="text-lg font-semibold text-editorial-dark">Software Developers</h4>
            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Transition from technical jargon to clear business value. Excel in architectural design reviews, client alignment briefings, and daily team standups.
            </p>
          </div>

          <div className="p-8 bg-white border border-editorial-border hover:border-editorial-dark transition-colors space-y-4">
            <div className="h-10 w-10 bg-editorial-light-gray border border-editorial-border flex items-center justify-center text-editorial-dark">
              <Briefcase size={20} />
            </div>
            <h4 className="text-lg font-semibold text-editorial-dark">Job Seekers & Candidates</h4>
            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Conquer interviews using structured frameworks (STAR, PREP). Practice answering behavioral questions under pressure with real pacing feedback.
            </p>
          </div>

          <div className="p-8 bg-white border border-editorial-border hover:border-editorial-dark transition-colors space-y-4">
            <div className="h-10 w-10 bg-editorial-light-gray border border-editorial-border flex items-center justify-center text-editorial-dark">
              <Globe2 size={20} />
            </div>
            <h4 className="text-lg font-semibold text-editorial-dark">Remote Workers & Global Teams</h4>
            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Communicate effectively across distributed international teams. Eliminate hedge words ('kind of', 'maybe') to project clear leadership.
            </p>
          </div>

          <div className="p-8 bg-white border border-editorial-border hover:border-editorial-dark transition-colors space-y-4">
            <div className="h-10 w-10 bg-editorial-light-gray border border-editorial-border flex items-center justify-center text-editorial-dark">
              <Users size={20} />
            </div>
            <h4 className="text-lg font-semibold text-editorial-dark">Founders & Executives</h4>
            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Deliver authoritative elevator pitches, raise venture capital confidently, address investor objections, and present at global conferences.
            </p>
          </div>

          <div className="p-8 bg-white border border-editorial-border hover:border-editorial-dark transition-colors space-y-4">
            <div className="h-10 w-10 bg-editorial-light-gray border border-editorial-border flex items-center justify-center text-editorial-dark">
              <GraduationCap size={20} />
            </div>
            <h4 className="text-lg font-semibold text-editorial-dark">Students & Academics</h4>
            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Prepare for university admission interviews, oral thesis defenses, academic paper presentations, and international fellowship applications.
            </p>
          </div>

          <div className="p-8 bg-white border border-editorial-border hover:border-editorial-dark transition-colors space-y-4">
            <div className="h-10 w-10 bg-editorial-light-gray border border-editorial-border flex items-center justify-center text-editorial-dark">
              <Sparkles size={20} />
            </div>
            <h4 className="text-lg font-semibold text-editorial-dark">Global Communicators</h4>
            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Speak with authentic confidence in English without altering your unique native accent. Focus on clarity, cadence, and vocal presence.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-editorial-border w-full">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase block">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-3xl font-light tracking-tight text-editorial-dark">
            Everything You Need To Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border border-editorial-border transition-colors overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-editorial-light-gray transition-colors"
              >
                <span className="text-sm font-bold text-editorial-dark">{faq.q}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-editorial-muted transition-transform duration-200 shrink-0 ${openFaqIndex === idx ? "rotate-180" : ""}`} 
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-6 pb-6 text-xs text-editorial-muted font-light leading-relaxed border-t border-editorial-border/40 pt-4 bg-editorial-bg">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-editorial-border w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase block">TRANSPARENT ACCESS TIERS</span>
          <h2 className="text-3xl md:text-5xl font-light tracking-tight text-editorial-dark">
            Invest In Your Speaking Confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Starter */}
          <div className="p-8 bg-white border border-editorial-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-editorial-muted tracking-widest block">FREE STARTER</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-editorial-dark font-mono">$0</span>
                <span className="text-xs text-editorial-muted">/ forever</span>
              </div>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Perfect for testing your baseline metrics and running quick daily drills.
              </p>
              <ul className="space-y-2.5 pt-4 text-xs text-editorial-dark">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-editorial-dark shrink-0" />
                  <span>3 Live AI Coaching Sessions / week</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-editorial-dark shrink-0" />
                  <span>Basic Pace & Filler Word Analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-editorial-dark shrink-0" />
                  <span>Access to 3 Practice Scenarios</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onStartOnboarding}
              className="w-full py-3 bg-white hover:bg-editorial-light-gray text-editorial-dark border border-editorial-dark font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Start Free
            </button>
          </div>

          {/* Pro Coach (Popular) */}
          <div className="p-8 bg-neutral-900 text-white border border-neutral-800 flex flex-col justify-between space-y-6 relative shadow-xl">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-neutral-900 font-mono text-[9px] uppercase tracking-widest font-bold">
              RECOMMENDED
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-widest block">PRO COACH</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-white font-mono">$19</span>
                <span className="text-xs text-neutral-400">/ month</span>
              </div>
              <p className="text-xs text-neutral-300 font-light leading-relaxed">
                Unlimited AI voice coaching, custom roadmap generator, and full analytics history.
              </p>
              <ul className="space-y-2.5 pt-4 text-xs text-neutral-200">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span>Unlimited Live AI Voice Sessions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span>Custom 4-Week Practice Roadmap</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span>All 14 Communication Goal Scenarios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span>Detailed Coaching Reports & Executive Rewrites</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onStartOnboarding}
              className="w-full py-3 bg-white hover:bg-neutral-100 text-neutral-900 font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              Get Pro Access
            </button>
          </div>

          {/* Enterprise */}
          <div className="p-8 bg-white border border-editorial-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase text-editorial-muted tracking-widest block">TEAM & ENTERPRISE</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-light text-editorial-dark font-mono">Custom</span>
              </div>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                For organizations, universities, and engineering teams training global talent.
              </p>
              <ul className="space-y-2.5 pt-4 text-xs text-editorial-dark">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-editorial-dark shrink-0" />
                  <span>Dedicated Team Dashboard & Admin Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-editorial-dark shrink-0" />
                  <span>Custom Company Practice Scenarios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-editorial-dark shrink-0" />
                  <span>SSO & Enterprise SLA Support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onStartOnboarding}
              className="w-full py-3 bg-white hover:bg-editorial-light-gray text-editorial-dark border border-editorial-dark font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="bg-white py-24 border-t border-editorial-border text-center w-full mt-auto space-y-6 px-6">
        <h3 className="text-3xl md:text-5xl font-light tracking-tight text-editorial-dark max-w-2xl mx-auto leading-tight">
          Ready To Communicate With <span className="editorial-serif">Unshakeable Confidence?</span>
        </h3>
        <p className="text-sm text-editorial-muted max-w-md mx-auto leading-relaxed font-light">
          Start your first live conversation with our AI Coach in under 60 seconds. No setup required.
        </p>
        <div className="pt-2">
          <button
            onClick={openSignUpModal}
            className="px-10 py-4 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs tracking-wider uppercase transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
          >
            Start Free Practice Session <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Clean Auth Modal */}
    </div>
  );
}
