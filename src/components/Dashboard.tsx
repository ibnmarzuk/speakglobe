import React, { useState, useMemo } from "react";
import { 
  Award, 
  Flame, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  Play,
  X
} from "lucide-react";
import { UserProfile, PracticeSession, StreakInfo } from "../types";
import { PRACTICE_SCENARIOS } from "../scenarios";

interface DashboardProps {
  profile: UserProfile;
  history: PracticeSession[];
  streak: StreakInfo;
  onNavigateToTab: (tab: string) => void;
  onLaunchScenario: (scenarioId: string) => void;
  onUpdateSessionTag?: (sessionId: string, newTag: string) => void;
}

export default function Dashboard({ profile, history, streak, onNavigateToTab, onLaunchScenario, onUpdateSessionTag }: DashboardProps) {
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<PracticeSession | null>(null);
  
  // Tag filter state
  const [activeTagFilter, setActiveTagFilter] = useState<string>("All");

  // Extract unique tags present in user history
  const uniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    history.forEach((session) => {
      const sTag = session.tag || "Casual Chat";
      tagsSet.add(sTag);
    });
    return ["All", ...Array.from(tagsSet)];
  }, [history]);

  // Filter history by selected tag
  const filteredHistory = useMemo(() => {
    return history.filter((session) => {
      if (activeTagFilter === "All") return true;
      const sTag = session.tag || "Casual Chat";
      return sTag.toLowerCase() === activeTagFilter.toLowerCase();
    });
  }, [history, activeTagFilter]);

  const handleUpdateTag = (sessionId: string, newTag: string) => {
    if (onUpdateSessionTag) {
      onUpdateSessionTag(sessionId, newTag);
    }
    if (selectedSessionForModal && selectedSessionForModal.id === sessionId) {
      setSelectedSessionForModal({
        ...selectedSessionForModal,
        tag: newTag
      });
    }
  };

  // Daily Challenge Scenario picker (dynamically choose a scenario)
  const dailyChallengeScenario = PRACTICE_SCENARIOS[0];

  // Calculate average confidence score
  const avgConfidence = history.length > 0 
    ? Math.round(history.reduce((acc, s) => acc + s.feedback.confidenceScore, 0) / history.length)
    : 70; // default initial benchmark

  const avgClarity = history.length > 0
    ? Math.round(history.reduce((acc, s) => acc + s.feedback.clarityScore, 0) / history.length)
    : 72;

  return (
    <div className="space-y-10 pb-16 font-sans text-editorial-text">
      {/* Welcome Message Banner for newly registered users */}
      {!profile.isOnboarded && (
        <div className="bg-white border border-editorial-dark shadow-sm relative p-6 space-y-4 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-editorial-dark tracking-tight">Welcome to SpeakGlobal! Your AI Communication Coach is ready.</h3>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Profile Completion: 20%
              </p>
              <p className="text-xs text-editorial-muted font-light leading-relaxed">
                Complete your profile to receive more personalized AI coaching.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("profile")}
              className="px-5 py-2.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer shadow-xs transition-colors"
            >
              Complete Profile
            </button>
          </div>
        </div>
      )}

      {/* Top Banner Grid */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-editorial-border">
        <div>
          <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">PERSONAL ROADMAP ACTIVE</span>
          <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">
            Welcome back, <span className="editorial-serif font-semibold">{profile.name}</span>.
          </h1>
          <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed">
            You are currently on Week 1 of your tailored curriculum for <strong className="font-semibold text-editorial-dark">{profile.profession}</strong> level communication.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab("practice")}
          className="px-6 py-3.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono tracking-widest text-xs uppercase flex items-center gap-2 transition-colors cursor-pointer border border-editorial-dark"
        >
          Launch Practice Arena <ArrowRight size={13} />
        </button>
      </header>

      {/* Metrics Cards Grid (Anti-Slop Clean Design) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak card */}
        <div className="bg-white border border-editorial-border p-6 flex flex-col justify-between relative shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest">PRACTICE STREAK</span>
            <Flame size={16} className="text-editorial-dark" />
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-light text-editorial-dark tracking-tight">{streak.currentStreak}</span>
              <span className="text-xs text-editorial-muted font-light">days</span>
            </div>
            <span className="text-[9px] text-editorial-muted block mt-2 font-mono uppercase tracking-wider">MAX STREAK: {streak.maxStreak} DAYS</span>
          </div>
        </div>

        {/* Confidence score */}
        <div className="bg-white border border-editorial-border p-6 flex flex-col justify-between relative shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest">CONFIDENCE BENCHMARK</span>
            <TrendingUp size={16} className="text-editorial-dark" />
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-light text-editorial-dark tracking-tight">{avgConfidence}%</span>
              <span className="text-[10px] text-editorial-muted font-mono uppercase tracking-wider">+5% trend</span>
            </div>
            <span className="text-[9px] text-editorial-muted block mt-2 font-mono uppercase tracking-wider">MEASURED VIA DELIBERATE RHETORIC</span>
          </div>
        </div>

        {/* Clarity Score */}
        <div className="bg-white border border-editorial-border p-6 flex flex-col justify-between relative shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest">SPEECH CLARITY</span>
            <Award size={16} className="text-editorial-dark" />
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-light text-editorial-dark tracking-tight">{avgClarity}%</span>
              <span className="text-[10px] text-editorial-muted font-mono uppercase tracking-wider">STABLE</span>
            </div>
            <span className="text-[9px] text-editorial-muted block mt-2 font-mono uppercase tracking-wider">DENSITY OF HEDGES: LOW</span>
          </div>
        </div>

        {/* Learning pace */}
        <div className="bg-white border border-editorial-border p-6 flex flex-col justify-between relative shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest">PRACTICE COMMITTED</span>
            <Clock size={16} className="text-editorial-dark" />
          </div>
          <div className="mt-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-semibold tracking-tight text-editorial-dark truncate block max-w-[170px] uppercase font-mono">
                {profile.preferredLearningPace.split(" ")[0]}
              </span>
            </div>
            <span className="text-[9px] text-editorial-muted block mt-3 font-mono uppercase tracking-wider">DAILY EFFORT COMMITMENT</span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Daily Challenge & Roadmap progress) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Daily Challenge Card */}
          <div className="bg-white border border-editorial-border p-8 relative overflow-hidden shadow-xs">
            {/* Architectural Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-editorial-dark" />

            <div className="flex items-center gap-1.5 px-3 py-1 bg-editorial-light-gray border border-editorial-border text-editorial-dark font-mono text-[9px] uppercase tracking-widest w-fit">
              <Sparkles size={11} className="text-editorial-dark" />
              <span>Daily Challenge Active</span>
            </div>
            <h3 className="text-xl font-light text-editorial-dark mt-4 tracking-tight">
              {dailyChallengeScenario.title}
            </h3>
            <p className="text-sm text-editorial-muted font-light mt-2 max-w-xl leading-relaxed italic">
              "{dailyChallengeScenario.prompt}"
            </p>
            <div className="flex items-center gap-4 mt-6 text-[10px] font-mono text-editorial-muted">
              <span className="px-2 py-0.5 bg-editorial-light-gray border border-editorial-border text-editorial-dark uppercase tracking-wider">
                Category: {dailyChallengeScenario.category}
              </span>
              <span>•</span>
              <span className="uppercase tracking-wider">Suggested Duration: {dailyChallengeScenario.suggestedDurationSeconds}s</span>
            </div>
            <button
              onClick={() => onLaunchScenario(dailyChallengeScenario.id)}
              className="mt-6 px-5 py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono uppercase tracking-widest text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-editorial-dark"
            >
              <Play size={11} fill="currentColor" /> Initialize Verbal Drill
            </button>
          </div>

          {/* Curriculum Roadmap Card */}
          {profile.roadmap && (
            <div className="bg-white border border-editorial-border p-8 shadow-xs">
              <h3 className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase mb-6">Tailored 4-Week Progress Roadmap</h3>
              <div className="space-y-6">
                {profile.roadmap.roadmap.map((week) => {
                  const isCurrent = week.week === 1; // Highlight week 1 by default
                  return (
                    <div 
                      key={week.week} 
                      className={`flex gap-6 p-5 border transition-colors ${
                        isCurrent 
                          ? "bg-editorial-light-gray/40 border-editorial-dark" 
                          : "bg-white border-editorial-border opacity-70 text-editorial-muted"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 flex items-center justify-center font-mono font-bold text-xs border ${
                          isCurrent 
                            ? "bg-editorial-dark text-white border-editorial-dark" 
                            : "bg-white text-editorial-muted border-editorial-border"
                        }`}>
                          W{week.week}
                        </div>
                        {week.week < 4 && <div className="w-px flex-1 bg-editorial-border mt-2" />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-semibold tracking-tight ${isCurrent ? "text-editorial-dark" : "text-editorial-muted"}`}>
                            {week.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[8px] bg-white text-editorial-dark border border-editorial-dark font-mono tracking-widest px-2 py-0.5 uppercase font-bold">
                              Active Week
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-light leading-relaxed text-editorial-muted">{week.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {week.exercises.map((ex, i) => (
                            <span 
                              key={i} 
                              className={`text-[9px] px-2 py-1 border font-mono uppercase tracking-wider ${
                                isCurrent 
                                  ? "bg-white border-editorial-border text-editorial-dark" 
                                  : "bg-white border-editorial-border text-editorial-muted"
                              }`}
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Practice Log / History Feed) */}
        <div className="bg-white border border-editorial-border p-6 h-fit space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-editorial-border">
            <h3 className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase">PRACTICE HISTORIC FEED</h3>
            <span className="text-[9px] bg-editorial-light-gray text-editorial-dark border border-editorial-border px-2 py-0.5 font-mono uppercase font-bold">
              {filteredHistory.length} of {history.length}
            </span>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-editorial-muted space-y-3">
              <Flame size={20} className="text-editorial-border mx-auto" />
              <span className="text-xs font-mono uppercase tracking-widest block text-editorial-dark">No Verbal Drills Logged</span>
              <p className="text-xs font-light max-w-[200px] mx-auto leading-relaxed">
                Launch a practice scenario to capture your speech statistics and view reports.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter Row */}
              <div className="space-y-2 pb-2 border-b border-editorial-border/60">
                <span className="text-[8px] font-mono text-editorial-muted uppercase tracking-wider block">Filter by Tag:</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {uniqueTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTagFilter(tag)}
                      className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                        activeTagFilter === tag
                          ? "bg-editorial-dark border-editorial-dark text-white font-bold"
                          : "bg-editorial-light-gray border-editorial-border text-editorial-muted hover:border-editorial-dark hover:text-editorial-dark"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="py-8 text-center text-editorial-muted border border-dashed border-editorial-border/60">
                  <span className="text-[9px] font-mono uppercase tracking-widest block">No results under "{activeTagFilter}"</span>
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {filteredHistory.map((session) => {
                    const tag = session.tag || "Casual Chat";
                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSessionForModal(session)}
                        className="p-4 bg-editorial-light-gray/40 hover:bg-editorial-light-gray/90 border border-editorial-border cursor-pointer transition-colors space-y-2 group"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-editorial-dark group-hover:underline truncate max-w-[150px]">
                            {session.scenarioTitle}
                          </h4>
                          <span className="text-[9px] font-mono text-editorial-muted shrink-0">{session.date}</span>
                        </div>
                        <p className="text-xs text-editorial-muted truncate font-light italic">
                          "{session.userSpeechText}"
                        </p>
                        <div className="flex flex-wrap pt-1">
                          <span className="px-2 py-0.5 bg-white border border-editorial-border text-editorial-dark text-[8px] font-mono uppercase tracking-wider">
                            #{tag}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-editorial-border/60 text-[9px] font-mono text-editorial-muted uppercase tracking-wider">
                          <span>Score: {session.feedback.confidenceScore}%</span>
                          <span className="text-editorial-dark font-bold flex items-center gap-0.5">
                            Review Report <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Polish Report Modal Details */}
      {selectedSessionForModal && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-editorial-border w-full max-w-xl max-h-[85vh] overflow-y-auto p-8 relative shadow-xl space-y-6">
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-editorial-dark" />

            <button
              onClick={() => setSelectedSessionForModal(null)}
              className="absolute top-4 right-4 p-2 text-editorial-muted hover:text-editorial-dark cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div>
              <span className="text-[10px] font-mono text-editorial-muted tracking-widest uppercase">HISTORIC FEED SHEET</span>
              <h3 className="text-xl font-light text-editorial-dark tracking-tight mt-1">{selectedSessionForModal.scenarioTitle}</h3>
              <p className="text-[10px] text-editorial-muted font-mono uppercase tracking-wider mt-1">Logged on: {selectedSessionForModal.date}</p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-editorial-light-gray border border-editorial-border">
              <div className="text-center">
                <span className="text-[9px] text-editorial-muted font-mono block uppercase">CONFIDENCE</span>
                <span className="text-base font-bold text-editorial-dark block mt-1">{selectedSessionForModal.feedback.confidenceScore}%</span>
              </div>
              <div className="text-center border-l border-editorial-border">
                <span className="text-[9px] text-editorial-muted font-mono block uppercase">CLARITY</span>
                <span className="text-base font-bold text-editorial-dark block mt-1">{selectedSessionForModal.feedback.clarityScore}%</span>
              </div>
              <div className="text-center border-l border-editorial-border">
                <span className="text-[9px] text-editorial-muted font-mono block uppercase">VOCABULARY</span>
                <span className="text-base font-bold text-editorial-dark block mt-1">{selectedSessionForModal.feedback.vocabularyScore}%</span>
              </div>
              <div className="text-center border-l border-editorial-border">
                <span className="text-[9px] text-editorial-muted font-mono block uppercase">CADENCE</span>
                <span className="text-base font-bold text-editorial-dark block mt-1 font-mono">{selectedSessionForModal.feedback.wordsPerMinute} WPM</span>
              </div>
            </div>

            {/* Tag Editor */}
            <div className="space-y-2 p-4 border border-editorial-border bg-editorial-light-gray/20">
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">Session Classification Tag</span>
              <div className="flex flex-wrap gap-1.5 items-center">
                {["Interview", "Keynote", "Casual Chat", "Meeting", "Presentation", "Pitch"].map((presetTag) => {
                  const currentTag = selectedSessionForModal.tag || "Casual Chat";
                  const isSelected = currentTag === presetTag;
                  return (
                    <button
                      key={presetTag}
                      type="button"
                      onClick={() => handleUpdateTag(selectedSessionForModal.id, presetTag)}
                      className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-editorial-dark border-editorial-dark text-white font-bold"
                          : "bg-white border-editorial-border text-editorial-muted hover:border-editorial-dark hover:text-editorial-dark"
                      }`}
                    >
                      {presetTag}
                    </button>
                  );
                })}
                {/* Custom tag input */}
                <input
                  type="text"
                  placeholder="CUSTOM..."
                  defaultValue={selectedSessionForModal.tag && !["Interview", "Keynote", "Casual Chat", "Meeting", "Presentation", "Pitch"].includes(selectedSessionForModal.tag) ? selectedSessionForModal.tag : ""}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val) {
                      handleUpdateTag(selectedSessionForModal.id, val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        handleUpdateTag(selectedSessionForModal.id, val);
                        (e.target as HTMLInputElement).blur();
                      }
                    }
                  }}
                  className="px-2 py-1 bg-white border border-editorial-border text-editorial-dark text-[8px] font-mono uppercase w-28 focus:outline-none focus:border-editorial-dark"
                />
              </div>
            </div>

            {/* User transcript */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">YOUR DELIVERED ANSWER</span>
              <p className="text-xs italic text-editorial-dark font-light leading-relaxed p-4 bg-editorial-light-gray/50 border border-editorial-border">
                "{selectedSessionForModal.userSpeechText}"
              </p>
            </div>

            {/* Polished suggestion */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-editorial-dark">
                <Sparkles size={13} />
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold">SWISS EXECUTIVE REWRITE</span>
              </div>
              <blockquote className="text-xs italic text-editorial-dark border-l-2 border-editorial-dark pl-3.5 leading-relaxed font-light">
                "{selectedSessionForModal.feedback.improvedPhrasing}"
              </blockquote>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-editorial-border">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-editorial-dark font-bold uppercase tracking-widest block">STRENGTHS</span>
                <ul className="text-xs font-light text-editorial-muted space-y-1.5 list-disc list-inside">
                  {selectedSessionForModal.feedback.strengths.map((st, i) => (
                    <li key={i} className="leading-relaxed">{st}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-red-700 font-bold uppercase tracking-widest block">AREAS FOR IMPROVEMENT</span>
                <ul className="text-xs font-light text-editorial-muted space-y-1.5 list-disc list-inside">
                  {selectedSessionForModal.feedback.weaknesses.map((wk, i) => (
                    <li key={i} className="leading-relaxed">{wk}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-editorial-muted font-light bg-editorial-light-gray p-4 border border-editorial-border leading-relaxed">
              {selectedSessionForModal.feedback.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
