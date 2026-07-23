import React, { useState } from "react";
import { 
  Search, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Trash2, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Filter,
  Copy,
  Check,
  Download,
  Play,
  Square,
  Volume2
} from "lucide-react";
import { SessionLog } from "../types";

interface SessionsHistoryProps {
  history: SessionLog[];
  onUpdateSessionTag: (sessionId: string, newTag: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function SessionsHistory({ history, onUpdateSessionTag, onNavigateToTab }: SessionsHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGoal, setFilterGoal] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "score" | "duration">("date");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Upgraded transcript coaching workspace state
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState<number | null>(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  // Fallback demo sessions if history is empty
  const defaultHistory: SessionLog[] = [
    {
      id: "demo-session-1",
      scenarioId: "sc-elevator-pitch",
      scenarioTitle: "Elevator Pitch Rehearsal",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      userSpeechText: "Hi, I am Alex Chen. I'm basically a Lead Software Engineer and I really want to help our team automate our QA things because it is like really slow.",
      speechDurationSeconds: 24,
      analysis: {
        clarityScore: 74,
        paceScore: 82,
        vocabularyScore: 65,
        confidenceScore: 70,
        overallScore: 73,
        wordsPerMinute: 135,
        fillerWordsDetected: ["basically", "like", "really", "things"],
        strengths: ["Clear vocal projection", "Maintained highly stable cadence speed"],
        weaknesses: ["Repetitive filler 'basically' and 'like' reduces impact", "Ending sentence on a descending trailing tone"],
        improvedPhrasing: "Hi, I'm Alex Chen, Lead Software Engineer. I recommend automating our QA pipelines to accelerate developer speed and reduce cycle lag.",
        explanation: "By structuring your pitch as a direct recommendation rather than a personal wish, you assert executive weight.",
        tomorrowChallenge: "Eliminate three instances of 'basically' in your next pitch."
      }
    },
    {
      id: "demo-session-2",
      scenarioId: "sc-salary-neg",
      scenarioTitle: "Executive Compensation Discussion",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      userSpeechText: "I think my value to the firm is, um, quite high. Based on the 30 percent increase in our pipeline efficiency, I want to ask for a base adjust.",
      speechDurationSeconds: 18,
      analysis: {
        clarityScore: 88,
        paceScore: 92,
        vocabularyScore: 85,
        confidenceScore: 81,
        overallScore: 86,
        wordsPerMinute: 140,
        fillerWordsDetected: ["um", "quite", "I think"],
        strengths: ["Highly metric-driven content", "Outstanding professional vocabulary and pacing"],
        weaknesses: ["Starting with a weak hedge 'I think' softens your pitch", "Injected an vocal fill 'um' right before stating value"],
        improvedPhrasing: "Based on the 30% increase in our pipeline efficiency under my lead, I am proposing an alignment of my base salary to market standards.",
        explanation: "Avoid saying 'I think my value is high.' Let the metric (30%) declare your value, then confidently propose a compensation adjustment.",
        tomorrowChallenge: "Initiate negotiation without a single hedge word."
      }
    }
  ];

  const activeHistory = history.length > 0 ? history : defaultHistory;

  // Filter & Search Logic
  const filteredSessions = activeHistory
    .filter(s => {
      const matchSearch = s.scenarioTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.userSpeechText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGoal = filterGoal === "all" || 
                        (filterGoal === "Interview" && s.scenarioTitle.toLowerCase().includes("interview")) ||
                        (filterGoal === "Meeting" && s.scenarioTitle.toLowerCase().includes("meeting")) ||
                        (filterGoal === "Presentation" && s.scenarioTitle.toLowerCase().includes("pitch") || s.scenarioTitle.toLowerCase().includes("compensation"));
      return matchSearch && matchGoal;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === "score") {
        const scoreA = a.analysis?.overallScore || 0;
        const scoreB = b.analysis?.overallScore || 0;
        return scoreB - scoreA;
      } else {
        return (b.speechDurationSeconds || 0) - (a.speechDurationSeconds || 0);
      }
    });

  const selectedSession = filteredSessions.find(s => s.id === selectedSessionId) || filteredSessions[0];

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">HISTORICAL REHEARSALS</span>
          <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Sessions Archive</h1>
          <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed">
            Review your past dialogues, metrics, and transcripts to measure how much your executive presentation has evolved.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab("practice")}
          className="px-5 py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer border border-editorial-dark"
        >
          Begin New Session Rehearsal
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-editorial-border p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-editorial-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcripts or scenario titles..."
            className="w-full pl-9 pr-4 py-2 bg-editorial-light-gray text-editorial-dark border border-editorial-border focus:outline-none focus:border-editorial-dark text-xs font-light"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-editorial-muted" />
            <select
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value)}
              className="px-3 py-1.5 bg-white border border-editorial-border text-xs text-editorial-dark font-mono"
            >
              <option value="all">All Goals</option>
              <option value="Interview">Interviews</option>
              <option value="Meeting">Meetings</option>
              <option value="Presentation">Presentations</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-editorial-border text-xs text-editorial-dark font-mono"
          >
            <option value="date">Sort by: Newest Date</option>
            <option value="score">Sort by: High Score</option>
            <option value="duration">Sort by: Speak Duration</option>
          </select>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="bg-white border border-editorial-border p-12 text-center space-y-4">
          <FileText size={32} className="mx-auto text-editorial-border" />
          <p className="text-sm font-light text-editorial-muted">No historical practice sessions found matching your query filters.</p>
          <button
            onClick={() => { setSearchQuery(""); setFilterGoal("all"); }}
            className="px-4 py-2 bg-editorial-light-gray border border-editorial-border text-xs font-mono uppercase tracking-wider text-editorial-dark cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Interactive Session List (col-span-2) */}
          <div className="lg:col-span-2 space-y-3 max-h-[650px] overflow-y-auto pr-2">
            {filteredSessions.map((session) => {
              const dateObj = new Date(session.timestamp);
              const formattedDate = dateObj.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
              const isSelected = selectedSession?.id === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`p-5 border cursor-pointer transition-all relative rounded-none flex items-start justify-between gap-4 ${
                    isSelected 
                      ? "bg-white border-editorial-dark shadow-sm" 
                      : "bg-white hover:bg-editorial-light-gray/40 border-editorial-border"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-600" />
                  )}
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-editorial-muted flex items-center gap-1">
                        <Calendar size={10} /> {formattedDate}
                      </span>
                      <span className="text-[9px] font-mono text-editorial-muted flex items-center gap-1">
                        <Clock size={10} /> {session.speechDurationSeconds}s
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-editorial-dark truncate">{session.scenarioTitle}</h3>
                    <p className="text-[11px] text-editorial-muted font-light truncate">
                      "{session.userSpeechText}"
                    </p>
                  </div>

                  <div className="flex flex-col items-end shrink-0 justify-between h-full min-h-[50px]">
                    <span className={`text-xs font-bold px-2 py-0.5 border ${
                      (session.analysis?.overallScore || 0) >= 80 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      {session.analysis?.overallScore || 70}%
                    </span>
                    <ChevronRight size={14} className="text-editorial-muted mt-2" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Analysis Panel (col-span-3) */}
          <div className="lg:col-span-3">
            {selectedSession && (
              <div className="bg-white border border-editorial-border p-8 relative shadow-sm space-y-6 animate-fade-in">
                {/* Visual Top Highlight */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />

                {/* Session Header */}
                <div className="flex items-start justify-between border-b border-editorial-border pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">SELECTED PERFORMANCE DRILL</span>
                    <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">{selectedSession.scenarioTitle}</h2>
                    <span className="text-[10px] font-mono text-editorial-muted block mt-1">
                      Session UID: {selectedSession.id} • Registered {new Date(selectedSession.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">OVERALL COACH SCORE</span>
                    <span className="text-3xl font-bold text-indigo-600 block mt-1 leading-none">{selectedSession.analysis?.overallScore || 70}%</span>
                  </div>
                </div>

                {/* Transcript */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-editorial-dark font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <FileText size={12} className="text-editorial-muted" /> RAW TRANSCRIPT RECORDED
                  </span>
                  <div className="p-4 bg-editorial-light-gray border border-editorial-border text-xs font-light text-editorial-dark italic leading-relaxed">
                    "{selectedSession.userSpeechText}"
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-4 gap-4 py-4 border-y border-editorial-border">
                  <div className="text-center p-2 bg-neutral-50/50">
                    <span className="text-[9px] font-mono text-editorial-muted block">CLARITY</span>
                    <span className="text-sm font-bold text-editorial-dark block mt-1">{selectedSession.analysis?.clarityScore || 70}%</span>
                  </div>
                  <div className="text-center p-2 bg-neutral-50/50">
                    <span className="text-[9px] font-mono text-editorial-muted block">PACING</span>
                    <span className="text-sm font-bold text-editorial-dark block mt-1">{selectedSession.analysis?.paceScore || 80}%</span>
                  </div>
                  <span className="text-center p-2 bg-neutral-50/50">
                    <span className="text-[9px] font-mono text-editorial-muted block">VOCABULARY</span>
                    <span className="text-sm font-bold text-editorial-dark block mt-1">{selectedSession.analysis?.vocabularyScore || 75}%</span>
                  </span>
                  <div className="text-center p-2 bg-neutral-50/50">
                    <span className="text-[9px] font-mono text-editorial-muted block">CONFIDENCE</span>
                    <span className="text-sm font-bold text-editorial-dark block mt-1">{selectedSession.analysis?.confidenceScore || 70}%</span>
                  </div>
                </div>

                {/* Crutch word tracking */}
                {selectedSession.analysis?.fillerWordsDetected && selectedSession.analysis.fillerWordsDetected.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-red-700 font-bold uppercase tracking-widest">CRUTCH WORDS DETECTED (PAUSE TRIGGERS)</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSession.analysis.fillerWordsDetected.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 text-[10px] font-mono uppercase">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-emerald-600" /> COACH PRAISE (STRENGTHS)
                    </span>
                    <ul className="space-y-1.5 text-xs text-editorial-muted font-light list-disc list-inside">
                      {(selectedSession.analysis?.strengths || ["Maintained confident eye-contact", "Direct structural presentation"]).map((st, i) => (
                        <li key={i} className="leading-relaxed">{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-red-800 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp size={12} className="text-red-500" /> ALIGNMENT RECOMMENDATIONS
                    </span>
                    <ul className="space-y-1.5 text-xs text-editorial-muted font-light list-disc list-inside">
                      {(selectedSession.analysis?.weaknesses || ["Used several filler words", "Rushed structural argument"]).map((st, i) => (
                        <li key={i} className="leading-relaxed">{st}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Premium Swiss Executive Rewrite */}
                {selectedSession.analysis?.improvedPhrasing && (
                  <div className="p-5 bg-indigo-50/30 border border-indigo-100 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={13} className="text-indigo-600 animate-pulse" />
                      <span className="text-[9px] font-mono text-indigo-900 font-bold uppercase tracking-widest">SWISS EXECUTIVE PHRASING ALIGNMENT</span>
                    </div>
                    <p className="text-xs italic text-indigo-950 font-light leading-relaxed">
                      "{selectedSession.analysis.improvedPhrasing}"
                    </p>
                    <p className="text-[11px] text-indigo-800/80 font-light leading-relaxed pt-1">
                      <strong>Coach Insight:</strong> {selectedSession.analysis.explanation}
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
