import React, { useState } from "react";
import { ArrowRight, Sparkles, RefreshCw, ChevronLeft, Globe, Target, Briefcase, Zap } from "lucide-react";
import { UserProfile, CommunicationGoal, TrainingRoadmap } from "../types";
import Logo from "./Logo";

interface OnboardingProps {
  onOnboardingComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onOnboardingComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("Software Engineer");
  const [communicationGoal, setCommunicationGoal] = useState<CommunicationGoal>(CommunicationGoal.INTERVIEW);
  const [nativeLanguage, setNativeLanguage] = useState("English");
  const [confidenceLevel, setConfidenceLevel] = useState("Moderate");
  const [preferredLearningPace, setPreferredLearningPace] = useState("Standard (15 mins/day)");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("");

  const stepsTotal = 4;

  const loaderPhrases = [
    "Analyzing rhetoric profile...",
    "Calibrating ideal speaking pacing...",
    "Tailoring STAR/PREP exercises...",
    "Sourcing executive standup challenges...",
    "Architecting custom 4-week global syllabus..."
  ];

  const handleNext = () => {
    if (step < stepsTotal) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    let phraseIndex = 0;
    setLoaderMessage(loaderPhrases[0]);

    const interval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % loaderPhrases.length;
      setLoaderMessage(loaderPhrases[phraseIndex]);
    }, 1800);

    try {
      const response = await fetch("/api/coach/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communicationGoal,
          profession,
          nativeLanguage,
          confidenceLevel,
          preferredLearningPace
        })
      });

      if (!response.ok) throw new Error("Onboarding API error");
      const roadmap: TrainingRoadmap = await response.json();

      const profile: UserProfile = {
        name: name || "Global Communicator",
        profession,
        communicationGoal,
        nativeLanguage,
        confidenceLevel,
        preferredLearningPace,
        isOnboarded: true,
        roadmap
      };

      onOnboardingComplete(profile);
    } catch (err) {
      console.error(err);
      // Handcrafted premium fallback roadmap in case of unexpected errors
      const fallbackRoadmap: TrainingRoadmap = {
        focusArea: `${communicationGoal} for ${profession}`,
        dailyTimeRecommendation: "15 minutes daily speaking sessions",
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

      const profile: UserProfile = {
        name: name || "Global Communicator",
        profession,
        communicationGoal,
        nativeLanguage,
        confidenceLevel,
        preferredLearningPace,
        isOnboarded: true,
        roadmap: fallbackRoadmap
      };
      onOnboardingComplete(profile);
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-text flex flex-col items-center justify-center px-6 py-12 font-sans">
      <Logo size={32} className="mb-6" />
      {isGenerating ? (
        <div className="text-center space-y-6 max-w-sm w-full bg-white p-12 border border-editorial-border shadow-sm">
          <div className="relative h-12 w-12 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-editorial-border rounded-full" />
            <div className="absolute inset-0 border-2 border-t-editorial-dark rounded-full animate-spin" />
            <Sparkles className="text-editorial-dark absolute" size={16} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold tracking-widest text-editorial-dark uppercase">Generating Custom Roadmap</h3>
            <p className="text-xs text-editorial-muted font-light h-10 transition-all duration-300">
              {loaderMessage}
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-white border border-editorial-border p-8 sm:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle architectural border header accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-editorial-dark" />
          
          {/* Back button */}
          {step > 1 && (
            <button
              onClick={handlePrev}
              className="text-editorial-muted hover:text-editorial-dark flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest mb-6 cursor-pointer"
            >
              <ChevronLeft size={12} /> Back
            </button>
          )}

          {/* Progress Indicators */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-mono tracking-widest text-editorial-muted uppercase">
              ASSESSMENT STEP {step} OF {stepsTotal}
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1 w-6 transition-colors ${
                    s <= step ? "bg-editorial-dark" : "bg-editorial-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Contents */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-light tracking-tight text-editorial-dark">Let's initialize your profile.</h2>
                <p className="text-xs text-editorial-muted">What should we call you during practicing?</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-editorial-muted block mb-2 uppercase tracking-widest">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-4 py-3 bg-editorial-light-gray border border-editorial-border rounded-none text-editorial-dark focus:outline-none focus:border-editorial-dark text-sm transition-colors font-light"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-editorial-muted block mb-2 uppercase tracking-widest">Your Profession / Area</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Lead Developer, Product Manager, Founder"
                    className="w-full px-4 py-3 bg-editorial-light-gray border border-editorial-border rounded-none text-editorial-dark focus:outline-none focus:border-editorial-dark text-sm transition-colors font-light"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-light tracking-tight text-editorial-dark">Select your primary communication goal.</h2>
                <p className="text-xs text-editorial-muted">We will tailor the speaking scenarios to focus heavily on this goal.</p>
              </div>
              <div className="space-y-2.5">
                {Object.values(CommunicationGoal).map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setCommunicationGoal(goal)}
                    className={`w-full text-left p-4 border text-xs tracking-wider uppercase font-mono transition-all flex items-center justify-between cursor-pointer ${
                      communicationGoal === goal
                        ? "bg-editorial-light-gray border-editorial-dark text-editorial-dark"
                        : "bg-white border-editorial-border hover:border-editorial-dark text-editorial-muted hover:text-editorial-dark"
                    }`}
                  >
                    <span>{goal}</span>
                    <Target size={14} className={communicationGoal === goal ? "text-editorial-dark" : "text-editorial-border"} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-light tracking-tight text-editorial-dark">Describe your linguistic background.</h2>
                <p className="text-xs text-editorial-muted">Helps the AI adapt pacing benchmarks to matches your natural fluency context.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-editorial-muted block mb-2 uppercase tracking-widest">Native Language / Accent Context</label>
                  <input
                    type="text"
                    value={nativeLanguage}
                    onChange={(e) => setNativeLanguage(e.target.value)}
                    placeholder="e.g. Spanish, Mandarin, Hindi, English"
                    className="w-full px-4 py-3 bg-editorial-light-gray border border-editorial-border rounded-none text-editorial-dark focus:outline-none focus:border-editorial-dark text-sm transition-colors font-light"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-editorial-muted block mb-2 uppercase tracking-widest">Current Speech Confidence Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low", "Moderate", "High"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setConfidenceLevel(level)}
                        className={`py-2.5 px-3 border text-[10px] font-mono uppercase tracking-wider cursor-pointer transition-colors ${
                          confidenceLevel === level
                            ? "bg-editorial-dark border-editorial-dark text-white"
                            : "bg-white border-editorial-border text-editorial-muted hover:text-editorial-dark hover:border-editorial-dark"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-light tracking-tight text-editorial-dark">Preferred practice pacing.</h2>
                <p className="text-xs text-editorial-muted">Determine how many minutes you want to commit to SpeakGlobal daily.</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { pace: "Casual (5 mins/day)", desc: "Quick daily rhetoric checklist" },
                  { pace: "Standard (15 mins/day)", desc: "1 scenario session + active coach feedback (Recommended)" },
                  { pace: "Intensive (30 mins/day)", desc: "Deep multi-scenario drill exercises + rhetoric chat" }
                ].map((item) => (
                  <button
                    key={item.pace}
                    onClick={() => setPreferredLearningPace(item.pace)}
                    className={`w-full text-left p-4 border transition-all flex justify-between items-center cursor-pointer ${
                      preferredLearningPace === item.pace
                        ? "bg-editorial-light-gray border-editorial-dark text-editorial-dark"
                        : "bg-white border-editorial-border hover:border-editorial-dark text-editorial-muted hover:text-editorial-dark"
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-mono uppercase tracking-wider">{item.pace}</span>
                      <span className="block text-[10px] text-editorial-muted mt-1">{item.desc}</span>
                    </div>
                    <Zap size={14} className={preferredLearningPace === item.pace ? "text-editorial-dark" : "text-editorial-border"} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-editorial-border flex items-center justify-end">
            <button
              onClick={handleNext}
              disabled={step === 1 && !name.trim()}
              className="px-6 py-3 bg-editorial-dark hover:bg-neutral-800 disabled:opacity-40 text-white font-mono uppercase tracking-widest text-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              {step === stepsTotal ? "Build Roadmap" : "Continue"} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
