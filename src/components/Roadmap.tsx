import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  ArrowUp, 
  MessageSquare, 
  Send, 
  HelpCircle,
  ThumbsUp,
  Bookmark,
  Zap,
  Check
} from "lucide-react";

interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming" | "community-request";
  votes: number;
  voted?: boolean;
  category: string;
}

export default function Roadmap() {
  const [features, setFeatures] = useState<RoadmapFeature[]>([
    {
      id: "feat-1",
      title: "Real-time Gaze & Focus Tracking",
      description: "Uses browser web camera to trace gaze stability, checking if you maintain eye contact or repeatedly look away during rehearsals.",
      status: "completed",
      votes: 142,
      category: "Vision AI"
    },
    {
      id: "feat-2",
      title: "Adaptive Conversation Complexity Scaling",
      description: "Enables our AI to scale sentence difficulty and dialogue tone automatically based on whether the speaker is a student or high-level executive.",
      status: "completed",
      votes: 98,
      category: "NLP Engine"
    },
    {
      id: "feat-3",
      title: "Dynamic Ambient Noise & Voice Overlap Detector",
      description: "Alerts user instantly when background noises (e.g. music, TV, other talkers) interfere with speech analysis fidelity.",
      status: "completed",
      votes: 110,
      category: "Audio AI"
    },
    {
      id: "feat-4",
      title: "Continuous Dialogue Interrupt Modifiers",
      description: "Supports micro-intervention prompts directly in the session feed, gently offering anti-filler warnings and pace indicators as you speak.",
      status: "completed",
      votes: 83,
      category: "Rhetoric"
    },
    {
      id: "feat-5",
      title: "Low-Latency Live Conversational Audio Streaming",
      description: "Direct speech-to-speech audio streaming pipeline using WebSocket layers for zero-lag verbal sparring.",
      status: "in-progress",
      votes: 341,
      voted: false,
      category: "Audio AI"
    },
    {
      id: "feat-6",
      title: "Company-Specific Culture Adaptors",
      description: "Practice answering questions crafted precisely around core communication guidelines of Apple, Stripe, Google, or McKinsey.",
      status: "in-progress",
      votes: 212,
      voted: false,
      category: "NLP Engine"
    },
    {
      id: "feat-7",
      title: "Pronunciation Accent-Sparsity Heatmaps",
      description: "Visualize phonemic alignment maps pointing out specific syllables where articulation could sound more global and crisp.",
      status: "upcoming",
      votes: 489,
      voted: false,
      category: "Audio AI"
    },
    {
      id: "feat-8",
      title: "Group Meeting Simulator (3-Person sparring)",
      description: "Spar with three dynamic AI agents simultaneously (e.g. Moderator, Skeptic, Partner) to replicate real executive boardrooms.",
      status: "upcoming",
      votes: 612,
      voted: false,
      category: "Simulation"
    },
    {
      id: "feat-9",
      title: "AI PowerPoint Deck Evaluator",
      description: "Upload slide decks and present live. The coach synchronizes your vocal transitions with your active slide content in real time.",
      status: "community-request",
      votes: 174,
      voted: false,
      category: "Integrations"
    },
    {
      id: "feat-10",
      title: "Offline Speech Buffering Workspace",
      description: "Allows local speech transcription and coaching checks for low-bandwidth zones, syncing metrics once connection stabilizes.",
      status: "community-request",
      votes: 89,
      voted: false,
      category: "Mobile Core"
    }
  ]);

  const [newIdea, setNewIdea] = useState("");
  const [newCategory, setNewCategory] = useState("Simulation");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleVote = (id: string) => {
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        const hasVoted = f.voted;
        return {
          ...f,
          votes: hasVoted ? f.votes - 1 : f.votes + 1,
          voted: !hasVoted
        };
      }
      return f;
    }));
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    const added: RoadmapFeature = {
      id: `custom-${Date.now()}`,
      title: newIdea,
      description: "User submitted roadmap enhancement under active moderation. Community voting open instantly.",
      status: "community-request",
      votes: 1,
      voted: true,
      category: newCategory
    };

    setFeatures(prev => [added, ...prev]);
    setNewIdea("");
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header Eyebrow */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">PRODUCT EVOLUTION TIMELINE</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">SpeakGlobal Roadmap</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Co-create the future of communication coaching. Witness completed breakthroughs, track in-progress developments, and vote on upcoming items directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Timeline (col-span-2) */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Timeline Node - IN PROGRESS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-editorial-border pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-none bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold font-mono text-xs">
                ▸
              </span>
              <h2 className="text-base font-bold text-editorial-dark font-mono uppercase tracking-widest">Active Development (In Progress)</h2>
            </div>

            <div className="space-y-4">
              {features.filter(f => f.status === "in-progress").map(f => (
                <div key={f.id} className="bg-white border border-editorial-border p-6 shadow-xs relative flex justify-between gap-6 hover:border-neutral-400 transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono uppercase bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 font-bold">
                        {f.category}
                      </span>
                      <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} className="text-indigo-600" /> Active Dev
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-editorial-dark">{f.title}</h3>
                    <p className="text-xs text-editorial-muted font-light leading-relaxed">{f.description}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <button
                      onClick={() => handleVote(f.id)}
                      className={`flex flex-col items-center gap-1 p-2.5 border transition-all cursor-pointer w-14 ${
                        f.voted 
                          ? "bg-indigo-600 border-indigo-600 text-white font-bold" 
                          : "bg-white border-editorial-border hover:border-indigo-600 text-editorial-muted hover:text-indigo-600"
                      }`}
                    >
                      <ArrowUp size={14} className={f.voted ? "translate-y-[-1px] transition-transform" : ""} />
                      <span className="text-[10px] font-mono">{f.votes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Node - UPCOMING & COMMUNITY REQUESTS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-editorial-border pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-none bg-neutral-100 border border-neutral-300 text-neutral-700 font-bold font-mono text-xs">
                ◇
              </span>
              <h2 className="text-base font-bold text-editorial-dark font-mono uppercase tracking-widest">Upcoming Backlog & Proposals</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.filter(f => f.status === "upcoming" || f.status === "community-request").map(f => (
                <div key={f.id} className="bg-white border border-editorial-border p-5 flex flex-col justify-between hover:border-neutral-500 transition-colors relative">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-mono uppercase border px-2 py-0.5 font-bold ${
                        f.status === "upcoming" 
                          ? "bg-amber-50 text-amber-800 border-amber-200" 
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {f.category}
                      </span>
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider">
                        {f.status === "upcoming" ? "Q4 Target" : "Community Request"}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-editorial-dark leading-snug">{f.title}</h3>
                    <p className="text-[11px] text-editorial-muted font-light leading-relaxed">{f.description}</p>
                  </div>

                  <div className="pt-4 border-t border-editorial-border mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-editorial-muted font-light">Community Score</span>
                    <button
                      onClick={() => handleVote(f.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 border text-[10px] font-mono uppercase tracking-wider cursor-pointer ${
                        f.voted 
                          ? "bg-indigo-600 border-indigo-600 text-white font-bold" 
                          : "bg-white border-editorial-border text-editorial-dark hover:border-indigo-600"
                      }`}
                    >
                      <ThumbsUp size={11} /> {f.votes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Node - COMPLETED FEATURES */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-editorial-border pb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-none bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold font-mono text-xs">
                ✓
              </span>
              <h2 className="text-base font-bold text-editorial-dark font-mono uppercase tracking-widest">Recently Released (Shipped)</h2>
            </div>

            <div className="space-y-3 opacity-80 hover:opacity-100 transition-opacity">
              {features.filter(f => f.status === "completed").map(f => (
                <div key={f.id} className="bg-editorial-light-gray/60 border border-editorial-border p-4 flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono uppercase bg-white border border-editorial-border px-1.5 py-0.5 text-editorial-dark font-bold">
                        {f.category}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-700 uppercase tracking-widest flex items-center gap-1 font-bold">
                        <Check size={11} /> Shipped
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-editorial-dark">{f.title}</h3>
                    <p className="text-[11px] text-editorial-muted font-light leading-relaxed">{f.description}</p>
                  </div>
                  <span className="text-[10px] font-mono text-editorial-muted shrink-0">Score: {f.votes}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Submit Feature Proposal & Vision block (col-span-1) */}
        <div className="space-y-6">
          
          {/* Submit Idea Card */}
          <div className="bg-white border border-editorial-border p-6 shadow-xs relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            <h3 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-indigo-600" /> Propose New Feature
            </h3>

            <form onSubmit={handleCreateIdea} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">Evolution Idea / Title</label>
                <input
                  type="text"
                  required
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="e.g. Virtual Reality Pitch Deck Practice"
                  className="w-full px-3 py-2 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-xs font-light"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">Target Domain</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-xs font-mono"
                >
                  <option value="Simulation">Simulation Sparring</option>
                  <option value="Vision AI">Vision AI Gaze</option>
                  <option value="Audio AI">Vocal Diagnostics</option>
                  <option value="NLP Engine">Grammar & Phrasing</option>
                  <option value="Integrations">Integrations & Decks</option>
                </select>
              </div>

              {submissionSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] leading-relaxed font-light flex gap-1.5 items-start">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Idea added successfully to Community proposals backlog! Community voting enabled.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-[10px] uppercase tracking-widest cursor-pointer font-bold flex items-center justify-center gap-2"
              >
                Launch Proposal <Send size={11} />
              </button>
            </form>
          </div>

          {/* Long Term Vision Card */}
          <div className="bg-editorial-dark text-white p-6 relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-amber-500" />
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest border-b border-neutral-800 pb-3 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500" /> Long-Term Vision
            </h3>
            
            <p className="text-[11px] text-neutral-300 font-light leading-relaxed mt-4">
              Our ultimate vision is to enable authentic human-level conversational simulations with real-time biometric and structural diagnostic advice. 
            </p>
            <p className="text-[11px] text-neutral-300 font-light leading-relaxed mt-2.5">
              SpeakGlobal is paving the way to dismantle global linguistic boundaries, transforming professional speaking rehearsals into comfortable, fun, and empowering everyday occurrences.
            </p>
          </div>

          {/* FAQ link banner */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle size={15} className="text-indigo-600" />
              <span className="text-[10px] font-mono text-indigo-950 uppercase tracking-wider font-bold">Have an offline request?</span>
            </div>
            <span className="text-[9px] font-mono text-indigo-700 font-bold">Contact Support</span>
          </div>

        </div>

      </div>

    </div>
  );
}
