import React, { useState } from "react";
import { 
  BookOpen, 
  Volume2, 
  CheckCircle, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Compass, 
  Play, 
  ArrowRight,
  TrendingUp,
  Check
} from "lucide-react";

export default function Resources() {
  const [activeFramework, setActiveFramework] = useState<"prep" | "star">("prep");
  const [activeWarmup, setActiveWarmup] = useState<string | null>(null);

  const frameworks = {
    prep: {
      title: "PREP Rhetorical Structure",
      tagline: "IDEAL FOR PROFESSIONAL MEETINGS & DISCUSSIONS",
      steps: [
        { label: "P - POINT", desc: "State your direct thesis immediately. Eliminate preamble or hesitation phrasing.", eg: "'We should automate our QA test suite starting next sprint.'" },
        { label: "R - REASON", desc: "Justify your recommendation with a high-stakes, rational cause statement.", eg: "'Doing so will reduce our software deployment cycle duration by over thirty percent.'" },
        { label: "E - EXAMPLE", desc: "Back up your reason with a concrete, qualitative or quantitative metric.", eg: "'For instance, our pilot run saved sixteen engineer-hours during database migration testing.'" },
        { label: "P - POINT (RESTATED)", desc: "Re-anchor your core point confidently to conclude your statement.", eg: "'Therefore, automating QA is our best path to accelerating overall developer velocity.'" }
      ]
    },
    star: {
      title: "STAR Storytelling Structure",
      tagline: "IDEAL FOR BEHAVIORAL INTERVIEWS",
      steps: [
        { label: "S - SITUATION", desc: "Establish the brief context, background, and timeline of the event.", eg: "'Last year, our leading payment gateway experienced a twelve-percent latency spike during Black Friday.'" },
        { label: "T - TASK", desc: "Identify the challenge, goal, or specific responsibility assigned to you.", eg: "'My task was to optimize database query caching and restore standard latency margins under 200ms.'" },
        { label: "A - ACTION", desc: "Explain the logical analytical steps you executed to resolve the bottleneck.", eg: "'I isolated the recursive SQL queries, established Redis cache profiles, and pruned obsolete index fields.'" },
        { label: "R - RESULT", desc: "Deliver the direct quantitative outcome and business value your action created.", eg: "'As a result, transaction response speeds improved by forty-two percent, fully stabilizing holiday sales traffic.'" }
      ]
    }
  };

  const warmups = [
    {
      id: "warmup-1",
      title: "The Hum & Cadence Stabilization",
      duration: "1 Min",
      purpose: "Eases vocal cord tension and establishes a balanced breathing baseline.",
      script: "Inhale deeply through your nose. Gently hum a steady, descending musical scale on your exhale. Maintain a flat abdomen and repeat four times."
    },
    {
      id: "warmup-2",
      title: "The Alternating Consonant Grid",
      duration: "2 Mins",
      purpose: "Sharpens syllable articulation and eliminates trailing verbal slurs.",
      script: "Recite these paired sounds quickly and with explosive breath: 'Pa-Ta-Ka', 'Ba-Da-Ga'. Focus on crisp, individual dental and velar transitions."
    },
    {
      id: "warmup-3",
      title: "Filler Substitution Pause Practice",
      duration: "1.5 Mins",
      purpose: "Paves neural pathways to substitute quiet breathing for vocalized hedges.",
      script: "Read a sentence aloud. Whenever you feel the urge to insert 'um' or 'like', hold your breath, seal your lips, count 1 second in silence, then proceed."
    }
  ];

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">DEVELOPMENT CHECKLISTS & CHEATSHEETS</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Linguistic Blueprints</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Equip yourself with premium rhetorical frameworks and vocal warmups compiled by professional communication coaches.
        </p>
      </div>

      {/* Rhetorical Blueprint Selector */}
      <div className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-6">
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-border pb-4">
          <div>
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">RHETORICAL BLUEPRINT</span>
            <h2 className="text-lg font-bold text-editorial-dark tracking-tight mt-1">Structure Framework</h2>
          </div>
          <div className="flex border border-editorial-border p-1 bg-editorial-light-gray">
            <button
              onClick={() => setActiveFramework("prep")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider cursor-pointer ${
                activeFramework === "prep" 
                  ? "bg-white text-editorial-dark font-bold shadow-xs border border-editorial-border" 
                  : "text-editorial-muted hover:text-editorial-dark"
              }`}
            >
              PREP Structure
            </button>
            <button
              onClick={() => setActiveFramework("star")}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider cursor-pointer ${
                activeFramework === "star" 
                  ? "bg-white text-editorial-dark font-bold shadow-xs border border-editorial-border" 
                  : "text-editorial-muted hover:text-editorial-dark"
              }`}
            >
              STAR Storytelling
            </button>
          </div>
        </div>

        {/* Selected Framework Steps */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-editorial-dark font-sans flex items-center gap-2">
              <Compass size={14} className="text-indigo-600" />
              {frameworks[activeFramework].title}
            </h3>
            <span className="text-[9px] font-mono text-indigo-700 font-bold block mt-1 tracking-wider">
              {frameworks[activeFramework].tagline}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {frameworks[activeFramework].steps.map((step, idx) => (
              <div key={idx} className="p-5 bg-editorial-light-gray/60 border border-editorial-border hover:border-neutral-400 transition-colors space-y-3 flex flex-col justify-between min-h-[220px]">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-indigo-700 font-bold block">{step.label}</span>
                  <p className="text-xs text-editorial-dark font-semibold leading-snug">{step.desc}</p>
                </div>
                <div className="pt-3 border-t border-editorial-border mt-3 text-[11px] text-editorial-muted leading-relaxed font-mono italic">
                  <strong>Example:</strong> {step.eg}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Vocal Warmups (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
            <Volume2 size={14} className="text-indigo-600" /> Pre-Session Vocal Warmups
          </h2>

          <div className="space-y-4">
            {warmups.map((w) => {
              const isPlaying = activeWarmup === w.id;
              return (
                <div key={w.id} className="bg-white border border-editorial-border p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-indigo-700 font-bold">
                        {w.duration}
                      </span>
                      <h3 className="text-xs font-bold text-editorial-dark">{w.title}</h3>
                    </div>
                    <p className="text-[11px] text-editorial-muted font-light leading-relaxed">
                      {w.purpose}
                    </p>
                    <blockquote className="text-xs p-3 bg-editorial-light-gray border border-editorial-border leading-relaxed italic text-editorial-dark font-light mt-1">
                      {w.script}
                    </blockquote>
                  </div>

                  <button
                    onClick={() => {
                      setActiveWarmup(isPlaying ? null : w.id);
                      if (!isPlaying) {
                        // Play a brief synthesized audio or flash for high-fidelity simulation
                        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.type = "sine";
                        osc.frequency.setValueAtTime(320, audioCtx.currentTime); // Hum pitch
                        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
                        osc.start();
                        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
                        osc.stop(audioCtx.currentTime + 0.8);
                      }
                    }}
                    className={`px-4 py-2.5 shrink-0 font-mono text-[10px] uppercase tracking-wider cursor-pointer font-bold flex items-center gap-2 border ${
                      isPlaying 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "bg-white border-editorial-border text-editorial-dark hover:border-indigo-600"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Check size={12} /> Practicing...
                      </>
                    ) : (
                      <>
                        <Play size={10} /> Play Tonal Cue
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Transition Matrix (col-span-1) */}
        <div className="space-y-6">
          <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-600" /> Executive Transits
          </h2>

          <div className="bg-white border border-editorial-border p-6 shadow-xs space-y-4">
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block">Assertive Verb Switchboard</span>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-50/20 border border-red-100 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-red-700 block">AVOID WEAK VERB</span>
                  <span className="font-semibold text-red-950 font-mono">"I think we can..."</span>
                </div>
                <ArrowRight size={13} className="text-red-300" />
                <div className="text-right">
                  <span className="text-[8px] font-mono text-emerald-700 block">USE CONFIDENT VERB</span>
                  <span className="font-semibold text-emerald-950 font-mono">"I propose we..."</span>
                </div>
              </div>

              <div className="p-3 bg-red-50/20 border border-red-100 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-red-700 block">AVOID WEAK VERB</span>
                  <span className="font-semibold text-red-950 font-mono">"We try to focus on..."</span>
                </div>
                <ArrowRight size={13} className="text-red-300" />
                <div className="text-right">
                  <span className="text-[8px] font-mono text-emerald-700 block">USE CONFIDENT VERB</span>
                  <span className="font-semibold text-emerald-950 font-mono">"We prioritize..."</span>
                </div>
              </div>

              <div className="p-3 bg-red-50/20 border border-red-100 flex items-center justify-between">
                <div>
                  <span className="text-[8px] font-mono text-red-700 block">AVOID WEAK VERB</span>
                  <span className="font-semibold text-red-950 font-mono">"Basically it is like..."</span>
                </div>
                <ArrowRight size={13} className="text-red-300" />
                <div className="text-right">
                  <span className="text-[8px] font-mono text-emerald-700 block">USE CONFIDENT VERB</span>
                  <span className="font-semibold text-emerald-950 font-mono">"Directly stated..."</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-editorial-muted font-light leading-relaxed">
              Swapping passive speech structures for active verbs projects authority and significantly decreases vocabulary score drag.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
