import React from "react";
import { 
  Award, 
  Flame, 
  TrendingUp, 
  Globe, 
  CheckCircle2, 
  Zap, 
  Star,
  ShieldAlert,
  Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { PracticeSession } from "../types";

interface ProgressTrackerProps {
  history: PracticeSession[];
}

export default function ProgressTracker({ history }: ProgressTrackerProps) {
  const [sessionAId, setSessionAId] = React.useState<string>("");
  const [sessionBId, setSessionBId] = React.useState<string>("");

  // Automatically set session defaults when history changes
  React.useEffect(() => {
    if (history && history.length >= 2) {
      if (!sessionAId || !history.some(s => s.id === sessionAId)) {
        setSessionAId(history[1].id); // older session by default
      }
      if (!sessionBId || !history.some(s => s.id === sessionBId)) {
        setSessionBId(history[0].id); // newer session by default
      }
    }
  }, [history, sessionAId, sessionBId]);

  const sessionA = history.find(s => s.id === sessionAId) || (history.length > 0 ? history[history.length - 1] : null);
  const sessionB = history.find(s => s.id === sessionBId) || (history.length > 1 ? history[0] : null);

  const confidenceDelta = sessionB && sessionA ? sessionB.feedback.confidenceScore - sessionA.feedback.confidenceScore : 0;

  const getSessionFillerCount = (session: PracticeSession) => {
    if (!session.feedback.fillerWordsDetected || session.feedback.fillerWordsDetected.length === 0) return 0;
    const firstWord = session.feedback.fillerWordsDetected[0].toLowerCase();
    if (firstWord === "none" || firstWord === "" || firstWord === "none detected") return 0;
    
    let count = 0;
    session.feedback.fillerWordsDetected.forEach(f => {
      const match = f.match(/\(x?(\d+)\)/);
      if (match) {
        count += parseInt(match[1], 10);
      } else {
        count += 1;
      }
    });
    return count;
  };

  const fillerCountA = sessionA ? getSessionFillerCount(sessionA) : 0;
  const fillerCountB = sessionB ? getSessionFillerCount(sessionB) : 0;
  const fillerDelta = fillerCountB - fillerCountA;
  
  // Transform history data for Recharts
  const chartData = history.length > 0
    ? [...history].reverse().map((session, index) => ({
        name: `Session ${index + 1}`,
        Confidence: session.feedback.confidenceScore,
        Clarity: session.feedback.clarityScore,
        Vocabulary: session.feedback.vocabularyScore,
        Pace: session.feedback.paceScore,
        wpm: session.feedback.wordsPerMinute
      }))
    : [
        { name: "S1 Baseline", Confidence: 65, Clarity: 70, Vocabulary: 60, Pace: 75, wpm: 120 },
        { name: "S2 Pitch", Confidence: 70, Clarity: 72, Vocabulary: 65, Pace: 80, wpm: 135 },
        { name: "S3 Standup", Confidence: 75, Clarity: 80, Vocabulary: 72, Pace: 85, wpm: 140 }
      ];

  // Achievements checking list
  const achievements = [
    {
      id: "first-drill",
      title: "Vocal Groundbreaking",
      description: "Complete your very first interactive verbal challenge.",
      unlocked: history.length > 0,
      icon: Award,
      accent: "text-editorial-dark border-editorial-dark bg-editorial-light-gray"
    },
    {
      id: "golden-pace",
      title: "Rhythmic Metronome",
      description: "Hit the golden speech sweetspot (130-150 Words Per Minute).",
      unlocked: history.some(s => s.feedback.wordsPerMinute >= 120 && s.feedback.wordsPerMinute <= 160),
      icon: Zap,
      accent: "text-editorial-dark border-editorial-dark bg-editorial-light-gray"
    },
    {
      id: "zero-hedge",
      title: "Direct Rhetorical Edge",
      description: "Deliver an answer with zero hesitation or crutch words detected.",
      unlocked: history.some(s => s.feedback.fillerWordsDetected.length === 0 || s.feedback.fillerWordsDetected[0].includes("None")),
      icon: Star,
      accent: "text-editorial-dark border-editorial-dark bg-editorial-light-gray"
    },
    {
      id: "confident-85",
      title: "Executive Gravitas",
      description: "Cross the 85% score milestone for overall speech confidence.",
      unlocked: history.some(s => s.feedback.confidenceScore >= 85),
      icon: TrendingUp,
      accent: "text-editorial-dark border-editorial-dark bg-editorial-light-gray"
    }
  ];

  return (
    <div className="space-y-10 pb-16 font-sans text-editorial-text">
      {/* Page Header */}
      <div className="pb-6 border-b border-editorial-border">
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">PERFORMANCE DASHBOARD</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Analytics & Achievements</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Chronological analysis of clarity scores, vocabulary metrics, and speech cadence progressions.
        </p>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recharts Analytics Panel */}
        <div className="lg:col-span-2 bg-white border border-editorial-border p-6 space-y-4 shadow-xs relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-editorial-dark" />
          
          <div className="flex items-center justify-between pb-3 border-b border-editorial-border">
            <h3 className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase">Rhetorical Progression Trend</h3>
            <span className="text-[9px] text-editorial-muted font-mono uppercase tracking-wider">SCORES ACROSS PRACTICE WORKFLOW</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.06}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClarity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#666666" stopOpacity={0.03}/>
                    <stop offset="95%" stopColor="#666666" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E1" />
                <XAxis dataKey="name" stroke="#666666" fontSize={10} fontClassName="font-mono" />
                <YAxis domain={[0, 100]} stroke="#666666" fontSize={10} fontClassName="font-mono" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E1", borderRadius: "0px", color: "#1A1A1A", fontSize: "11px" }}
                />
                <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "12px" }} />
                <Area type="monotone" dataKey="Confidence" stroke="#1A1A1A" strokeWidth={1.5} fillOpacity={1} fill="url(#colorConfidence)" />
                <Area type="monotone" dataKey="Clarity" stroke="#666666" strokeWidth={1} fillOpacity={1} fill="url(#colorClarity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cadence Metrics Benchmarks Sidebar */}
        <div className="bg-white border border-editorial-border p-6 space-y-6 shadow-xs relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-editorial-dark" />
          
          <div className="flex items-center justify-between pb-3 border-b border-editorial-border">
            <h3 className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase">CADENCE BENCHMARKS</h3>
            <Globe size={14} className="text-editorial-muted" />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-editorial-light-gray/50 border border-editorial-border space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="text-editorial-dark font-bold">130 - 150 WPM</span>
                <span className="text-editorial-muted">EXECUTIVE STANDARD</span>
              </div>
              <p className="text-[11px] text-editorial-muted leading-relaxed font-light">
                Standard conversational tempo that matches global collaboration environments. Promotes active listening retention and structured speech cadence.
              </p>
            </div>

            <div className="p-4 bg-editorial-light-gray/50 border border-editorial-border space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="text-editorial-dark font-bold">&gt; 170 WPM</span>
                <span className="text-editorial-muted">ACCELERATED / ANXIOUS</span>
              </div>
              <p className="text-[11px] text-editorial-muted leading-relaxed font-light">
                Indicative of high-stress responses, rushing, or severe message dumping. Reduces professional retention and signals imposter hesitation.
              </p>
            </div>

            <div className="p-4 bg-editorial-light-gray/50 border border-editorial-border space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-wider">
                <span className="text-editorial-dark font-bold">&lt; 100 WPM</span>
                <span className="text-editorial-muted">LAGGING / CAUTIOUS</span>
              </div>
              <p className="text-[11px] text-editorial-muted leading-relaxed font-light">
                Slow phrasing that risks losing audience focus or dampening structural impact. Try to use direct claiming to accelerate.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. SIDE-BY-SIDE SESSION COMPARATIVE STUDY */}
      <div className="bg-white border border-editorial-border p-8 space-y-6 shadow-xs relative" id="session-comparison-dashboard">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-editorial-dark" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-editorial-border pb-4 gap-4">
          <div>
            <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">COMPARATIVE STUDY ENGINE</span>
            <h3 className="text-lg font-light text-editorial-dark tracking-tight mt-0.5">Side-by-Side Performance Comparison</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono text-editorial-muted uppercase">
            <Sparkles size={12} className="text-editorial-dark animate-pulse" />
            <span>Track Growth & Filler Reduction</span>
          </div>
        </div>

        {history.length < 2 ? (
          <div className="py-12 px-6 border border-dashed border-editorial-border text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center border border-editorial-border bg-editorial-light-gray text-editorial-muted">
              <TrendingUp size={20} className="opacity-65" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h4 className="text-xs font-mono uppercase tracking-widest text-editorial-dark font-bold">Calibration Threshold Standby</h4>
              <p className="text-xs text-editorial-muted leading-relaxed font-light">
                Complete at least <strong className="text-editorial-dark font-semibold">two practice drill sessions</strong> inside the Practice Arena to unlock historical side-by-side performance comparison reports. Compare confidence curves, WPM cadences, and filler frequencies.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-editorial-light-gray/50 p-4 border border-editorial-border">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">SELECT CHRONOLOGICAL BASELINE (SESSION A)</label>
                <select
                  value={sessionAId}
                  onChange={(e) => setSessionAId(e.target.value)}
                  className="w-full bg-white border border-editorial-border text-xs font-mono p-2.5 focus:outline-none focus:border-editorial-dark cursor-pointer rounded-none text-editorial-dark"
                >
                  {history.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {s.date} — {s.scenarioTitle} ({s.tag || "Drill"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">SELECT PROGRESSION MILESTONE (SESSION B)</label>
                <select
                  value={sessionBId}
                  onChange={(e) => setSessionBId(e.target.value)}
                  className="w-full bg-white border border-editorial-border text-xs font-mono p-2.5 focus:outline-none focus:border-editorial-dark cursor-pointer rounded-none text-editorial-dark"
                >
                  {history.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {s.date} — {s.scenarioTitle} ({s.tag || "Drill"})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {sessionA && sessionB && (
              <div className="space-y-6">
                {/* Visual Growth Trends Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Trend card 1: Confidence growth */}
                  <div className="border border-editorial-border p-4 space-y-2 bg-white relative">
                    <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-widest block">CONFIDENCE TRAJECTORY</span>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-light text-editorial-dark">{sessionA.feedback.confidenceScore}%</span>
                        <span className="text-[10px] text-editorial-muted font-mono">→</span>
                        <span className="text-xl font-bold text-editorial-dark">{sessionB.feedback.confidenceScore}%</span>
                      </div>
                      
                      {/* Delta badge */}
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none border ${
                        confidenceDelta >= 0 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : "bg-red-50 border-red-200 text-red-800"
                      }`}>
                        {confidenceDelta >= 0 ? `+${confidenceDelta}%` : `${confidenceDelta}%`}
                      </span>
                    </div>
                    <div className="h-1 bg-editorial-light-gray relative w-full overflow-hidden">
                      <div 
                        className={`absolute top-0 bottom-0 left-0 transition-all ${
                          confidenceDelta >= 0 ? "bg-emerald-600" : "bg-red-600"
                        }`}
                        style={{ width: `${Math.max(5, Math.min(100, Math.abs(confidenceDelta) * 4))}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-editorial-muted font-light leading-snug">
                      {confidenceDelta > 0 
                        ? "Outstanding vocal presence and assertiveness progression between drills." 
                        : confidenceDelta === 0 
                          ? "Consistency sustained. Maintain assertive focus to scale further." 
                          : "Vocal hesitation observed. Focus on proactive claims and breath control."}
                    </p>
                  </div>

                  {/* Trend card 2: Filler Reduction */}
                  <div className="border border-editorial-border p-4 space-y-2 bg-white relative">
                    <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-widest block">CRUTCH WORD CONVERGENCE</span>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-light text-editorial-dark">{fillerCountA} count</span>
                        <span className="text-[10px] text-editorial-muted font-mono">→</span>
                        <span className="text-xl font-bold text-editorial-dark">{fillerCountB} count</span>
                      </div>
                      
                      {/* Delta badge (negative delta is good!) */}
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none border ${
                        fillerDelta <= 0 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>
                        {fillerDelta <= 0 ? `${fillerDelta} fillers` : `+${fillerDelta} fillers`}
                      </span>
                    </div>
                    <p className="text-[10px] text-editorial-muted font-light leading-snug mt-1">
                      {fillerDelta < 0 
                        ? `Magnificent cleanup! Reduced vocal crutches by ${Math.abs(fillerDelta)} occurrences.` 
                        : fillerDelta === 0 
                          ? "Frictionless transition counts matched. Strive for zero hedge words." 
                          : "Verbal clutter increased. Focus on tactical silences instead of vocal bridges."}
                    </p>
                  </div>

                  {/* Trend card 3: Pacing / WPM Cadence */}
                  <div className="border border-editorial-border p-4 space-y-2 bg-white relative">
                    <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-widest block">PACING VELOCITY (WPM)</span>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-light text-editorial-dark">{sessionA.feedback.wordsPerMinute} WPM</span>
                        <span className="text-[10px] text-editorial-muted font-mono">→</span>
                        <span className="text-xl font-bold text-editorial-dark">{sessionB.feedback.wordsPerMinute} WPM</span>
                      </div>
                      
                      {/* Highlight if either or both are in Golden Zone */}
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-none uppercase font-bold border ${
                        sessionB.feedback.wordsPerMinute >= 110 && sessionB.feedback.wordsPerMinute <= 150
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-amber-50 border-amber-200 text-amber-800"
                      }`}>
                        {sessionB.feedback.wordsPerMinute >= 110 && sessionB.feedback.wordsPerMinute <= 150 ? "Golden Cadence" : "Pace Divergence"}
                      </span>
                    </div>
                    <p className="text-[10px] text-editorial-muted font-light leading-snug mt-1">
                      {sessionB.feedback.wordsPerMinute >= 110 && sessionB.feedback.wordsPerMinute <= 150
                        ? "Currently executing speech delivery at highly comprehensive speeds."
                        : "Pacing remains slightly outside the optimal 110-150 WPM executive spectrum."}
                    </p>
                  </div>

                </div>

                {/* Side-by-side full details table/grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left Column: Session A Details */}
                  <div className="border border-editorial-border bg-editorial-light-gray/40 p-5 space-y-4">
                    <div className="flex justify-between items-start border-b border-editorial-border pb-2.5">
                      <div>
                        <span className="px-1.5 py-0.5 bg-editorial-dark text-white text-[8px] font-mono uppercase tracking-wider font-bold">SESSION A (BASELINE)</span>
                        <h4 className="text-xs font-bold text-editorial-dark mt-1.5">{sessionA.scenarioTitle}</h4>
                        <span className="text-[9px] font-mono text-editorial-muted block uppercase mt-0.5">{sessionA.date} — {sessionA.tag || "General"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-widest block">DURATION</span>
                        <span className="text-xs font-mono font-bold text-editorial-dark">
                          {Math.floor(sessionA.durationSeconds / 60)}:{(sessionA.durationSeconds % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Score Grid A */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">CLARITY</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionA.feedback.clarityScore}%</span>
                      </div>
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">PACING</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionA.feedback.paceScore}%</span>
                      </div>
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">VOCAB</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionA.feedback.vocabularyScore}%</span>
                      </div>
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">CONFIDENCE</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionA.feedback.confidenceScore}%</span>
                      </div>
                    </div>

                    {/* Transcript Excerpt A */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">DICTATED TRANSCRIPT EXCERPT</span>
                      <div className="p-3 bg-white border border-editorial-border max-h-[100px] overflow-y-auto text-[11px] font-light leading-relaxed text-editorial-dark whitespace-pre-wrap italic">
                        "{sessionA.userSpeechText}"
                      </div>
                    </div>

                    {/* AI Coaching Suggestion A */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">RECOMMENDED AI IMPROVED PHRASING</span>
                      <div className="p-3 bg-white border border-editorial-border text-[11px] font-light leading-relaxed text-editorial-dark">
                        {sessionA.feedback.improvedPhrasing}
                      </div>
                    </div>

                    {/* Detected Fillers Tag A */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">DETECTED HEDGES & FILLERS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionA.feedback.fillerWordsDetected.filter(Boolean).map((f, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[8px] font-mono uppercase font-bold">
                            {f}
                          </span>
                        ))}
                        {sessionA.feedback.fillerWordsDetected.length === 0 && (
                          <span className="text-[10px] text-emerald-800 font-mono italic">None detected</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Session B Details */}
                  <div className="border border-editorial-border bg-editorial-light-gray/40 p-5 space-y-4">
                    <div className="flex justify-between items-start border-b border-editorial-border pb-2.5">
                      <div>
                        <span className="px-1.5 py-0.5 bg-editorial-dark text-white text-[8px] font-mono uppercase tracking-wider font-bold">SESSION B (MILESTONE)</span>
                        <h4 className="text-xs font-bold text-editorial-dark mt-1.5">{sessionB.scenarioTitle}</h4>
                        <span className="text-[9px] font-mono text-editorial-muted block uppercase mt-0.5">{sessionB.date} — {sessionB.tag || "General"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-widest block">DURATION</span>
                        <span className="text-xs font-mono font-bold text-editorial-dark">
                          {Math.floor(sessionB.durationSeconds / 60)}:{(sessionB.durationSeconds % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Score Grid B */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">CLARITY</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionB.feedback.clarityScore}%</span>
                      </div>
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">PACING</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionB.feedback.paceScore}%</span>
                      </div>
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">VOCAB</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionB.feedback.vocabularyScore}%</span>
                      </div>
                      <div className="bg-white border border-editorial-border p-2">
                        <span className="text-[7px] font-mono text-editorial-muted uppercase block">CONFIDENCE</span>
                        <span className="text-xs font-bold font-mono text-editorial-dark">{sessionB.feedback.confidenceScore}%</span>
                      </div>
                    </div>

                    {/* Transcript Excerpt B */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">DICTATED TRANSCRIPT EXCERPT</span>
                      <div className="p-3 bg-white border border-editorial-border max-h-[100px] overflow-y-auto text-[11px] font-light leading-relaxed text-editorial-dark whitespace-pre-wrap italic">
                        "{sessionB.userSpeechText}"
                      </div>
                    </div>

                    {/* AI Coaching Suggestion B */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">RECOMMENDED AI IMPROVED PHRASING</span>
                      <div className="p-3 bg-white border border-editorial-border text-[11px] font-light leading-relaxed text-editorial-dark">
                        {sessionB.feedback.improvedPhrasing}
                      </div>
                    </div>

                    {/* Detected Fillers Tag B */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">DETECTED HEDGES & FILLERS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionB.feedback.fillerWordsDetected.filter(Boolean).map((f, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[8px] font-mono uppercase font-bold">
                            {f}
                          </span>
                        ))}
                        {sessionB.feedback.fillerWordsDetected.length === 0 && (
                          <span className="text-[10px] text-emerald-800 font-mono italic">None detected</span>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gamified Achievements Grid */}
      <div className="bg-white border border-editorial-border p-8 space-y-6 shadow-xs relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-editorial-dark" />

        <div className="flex items-center gap-1.5 text-editorial-dark">
          <Sparkles size={14} />
          <h3 className="text-[10px] font-mono tracking-widest uppercase font-bold">Unlocked Speech Milestones</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div 
                key={ach.id}
                className={`p-6 border flex flex-col justify-between transition-all ${
                  ach.unlocked 
                    ? "bg-white border-editorial-dark" 
                    : "bg-white border-editorial-border opacity-50 text-editorial-muted"
                }`}
              >
                <div className="space-y-4">
                  <div className={`h-10 w-10 border flex items-center justify-center ${
                    ach.unlocked ? "border-editorial-dark bg-editorial-light-gray text-editorial-dark" : "border-editorial-border bg-white text-editorial-muted"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-editorial-dark">{ach.title}</h4>
                    <p className="text-[11px] text-editorial-muted font-light mt-1.5 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-editorial-border flex items-center justify-between text-[9px] font-mono">
                  <span className={ach.unlocked ? "text-editorial-dark font-bold uppercase" : "text-editorial-muted"}>
                    {ach.unlocked ? "UNLOCKED" : "LOCKED"}
                  </span>
                  {ach.unlocked && <CheckCircle2 size={11} className="text-editorial-dark" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
