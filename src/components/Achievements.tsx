import React, { useState } from "react";
import { 
  Award, 
  Flame, 
  Zap, 
  Star, 
  Clock, 
  Lock, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp,
  Volume2
} from "lucide-react";

interface Badge {
  id: string;
  title: string;
  description: string;
  category: "Pace" | "Filler" | "Consistency" | "Tone" | "Security";
  unlocked: boolean;
  unlockedAt?: string;
  metricGoal: string;
}

export default function Achievements() {
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(650);
  const maxXp = 1000;

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: "badge-1",
      title: "Silence Master",
      description: "Successfully replace filler words with constructive 1-2 second executive silent pauses in an active session.",
      category: "Filler",
      unlocked: true,
      unlockedAt: "Jul 21, 2026",
      metricGoal: "0 Fillers"
    },
    {
      id: "badge-2",
      title: "Pace Conductor",
      description: "Speak within the absolute optimal global clarity window of 130 - 150 words per minute for a full 2-minute dialogue.",
      category: "Pace",
      unlocked: true,
      unlockedAt: "Jul 18, 2026",
      metricGoal: "135 WPM average"
    },
    {
      id: "badge-3",
      title: "Linguistic Resiliency",
      description: "Trigger the Undo Logout safety mechanism to save and restore your personalized learning roadmap successfully.",
      category: "Security",
      unlocked: true,
      unlockedAt: "Jul 15, 2026",
      metricGoal: "Trigger undo"
    },
    {
      id: "badge-4",
      title: "Assertive Vanguard",
      description: "Receive a perfect 100% Score on the Swiss Executive Phrasing Alignment checks on three consecutive turns.",
      category: "Tone",
      unlocked: false,
      metricGoal: "3 perfect rewrites"
    },
    {
      id: "badge-5",
      title: "Habit Vanguard",
      description: "Maintain a flawless 7-day speaking practice streak using SpeakGlobal's customized curriculum dashboard.",
      category: "Consistency",
      unlocked: false,
      metricGoal: "7 Day Streak"
    },
    {
      id: "badge-6",
      title: "Gaze Sentinel",
      description: "Maintain perfect 95%+ eye contact and focused attention metrics for a multi-turn rehearsal with camera enabled.",
      category: "Tone",
      unlocked: false,
      metricGoal: "95% Eye focus"
    }
  ]);

  const [activeChallenges] = useState([
    {
      id: "chal-1",
      title: "Rhetoric Cleansing",
      task: "Complete a full 10-turn practice session containing absolutely zero instances of 'basically' or 'like'.",
      xpReward: 300,
      progress: 60, // 60%
      timeLeft: "18 hours remaining"
    },
    {
      id: "chal-2",
      title: "Cadence Calibration",
      task: "Perform three practice drills with WPM staying precisely within 130 - 145 limit.",
      xpReward: 250,
      progress: 100, // Completed!
      timeLeft: "Completed"
    }
  ]);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">REWARD & gamification PLATFORM</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Linguistic Accomplishments</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Track your developmental checkpoints, claim XP points, and unlock premium badges validating your evolution towards global communication mastery.
        </p>
      </div>

      {/* Gamification Level Dashboard */}
      <div className="bg-white border border-editorial-border p-8 relative shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Top visual line */}
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
        
        {/* Level Circle info */}
        <div className="flex items-center gap-5 md:border-r border-editorial-border md:pr-8">
          <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex flex-col items-center justify-center shadow-md">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80 leading-none">Lvl</span>
            <span className="text-2xl font-bold font-sans mt-0.5 leading-none">{level}</span>
          </div>
          <div>
            <span className="text-[9px] font-mono text-editorial-muted uppercase block">SPEAKER CLASSIFICATION</span>
            <h3 className="text-sm font-bold text-editorial-dark mt-0.5">Assertive Rehearsal Cadet</h3>
            <span className="text-[10px] text-indigo-700 font-mono font-bold uppercase tracking-wider block mt-0.5">Top 15% of global users</span>
          </div>
        </div>

        {/* Progress bar info */}
        <div className="flex flex-col justify-center md:border-r border-editorial-border md:px-8 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-editorial-muted font-light">Experience points (XP)</span>
            <span className="font-mono font-bold">{xp} / {maxXp} XP</span>
          </div>
          <div className="w-full bg-editorial-light-gray h-2 border border-editorial-border overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-500" 
              style={{ width: `${(xp / maxXp) * 100}%` }}
            />
          </div>
          <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">350 XP required to Level Up</span>
        </div>

        {/* Rapid Stats counters */}
        <div className="grid grid-cols-2 gap-4 items-center pl-0 md:pl-8">
          <div className="space-y-1">
            <span className="text-2xl font-light tracking-tight text-editorial-dark">{unlockedCount} / {badges.length}</span>
            <span className="text-[9px] text-editorial-muted block font-mono uppercase tracking-wider">BADGES UNLOCKED</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-light tracking-tight text-editorial-dark">2</span>
            <span className="text-[9px] text-editorial-muted block font-mono uppercase tracking-wider">ACTIVE CHALLENGES</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Badges Grid (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
            <Award size={14} className="text-indigo-600" /> Executive Accolades Checklist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`p-6 border relative rounded-none flex flex-col justify-between h-[180px] transition-all ${
                  badge.unlocked 
                    ? "bg-white border-editorial-border hover:border-indigo-600 shadow-xs" 
                    : "bg-editorial-light-gray/40 border-neutral-200 opacity-60"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 border font-bold ${
                      badge.unlocked 
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                        : "bg-neutral-100 text-neutral-500 border-neutral-200"
                    }`}>
                      {badge.category}
                    </span>
                    {badge.unlocked ? (
                      <span className="text-[8px] font-mono text-emerald-700 uppercase font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-neutral-500 uppercase font-bold flex items-center gap-1">
                        <Lock size={10} /> Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-editorial-dark">{badge.title}</h3>
                  <p className="text-[11px] text-editorial-muted font-light leading-relaxed">{badge.description}</p>
                </div>

                <div className="border-t border-editorial-border pt-3 mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase">CRITERIA: {badge.metricGoal}</span>
                  {badge.unlockedAt && (
                    <span className="text-[9px] font-mono text-editorial-muted">{badge.unlockedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Daily Active Challenges (col-span-1) */}
        <div className="space-y-6">
          <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
            <Flame size={14} className="text-indigo-600" /> Active Speed Challenges
          </h2>

          <div className="space-y-4">
            {activeChallenges.map((challenge) => {
              const isCompleted = challenge.progress >= 100;
              return (
                <div 
                  key={challenge.id}
                  className={`p-6 border relative rounded-none space-y-4 ${
                    isCompleted 
                      ? "bg-emerald-50/20 border-emerald-200" 
                      : "bg-white border-editorial-border"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 border ${
                        isCompleted 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                          : "bg-indigo-50 text-indigo-800 border-indigo-200"
                      }`}>
                        +{challenge.xpReward} XP REWARD
                      </span>
                      <span className="text-[9px] font-mono text-editorial-muted font-light">
                        {challenge.timeLeft}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-editorial-dark">{challenge.title}</h3>
                    <p className="text-[11px] text-editorial-muted font-light leading-relaxed">
                      {challenge.task}
                    </p>
                  </div>

                  {/* Progress slide */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-editorial-muted">
                      <span>Completion Bar</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-editorial-light-gray h-1.5 border border-editorial-border overflow-hidden">
                      <div 
                        className={`h-full ${isCompleted ? "bg-emerald-600" : "bg-indigo-600"}`} 
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gamified Level Map Info Box */}
          <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-none space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold">
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-[10px] font-mono uppercase tracking-wider">Leveling Advantage</span>
            </div>
            <p className="text-[11px] text-indigo-900 font-light leading-relaxed">
              Every level you gain unlocks high-stakes executive scenarios like <strong>"Venture Board Objections"</strong> and <strong>"Linguistic Hostility Neutralization"</strong>. Keep practice daily to raise your profile!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
