import React, { useState } from "react";
import { 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Send, 
  Sparkles,
  Volume2
} from "lucide-react";

export default function FeedbackTab() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [coachAccuracy, setCoachAccuracy] = useState("excellent");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setFeedbackText("");
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">CONTINUOUS PRODUCT CALIBRATION</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Share Feedback</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Help us refine the cognitive metrics engine. Share your coaching experience, request specific pronunciation evaluations, or suggest layout additions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Interactive Feedback Form (col-span-2) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitFeedback} className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-6">
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
            
            <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-600" /> Coach Performance Card
            </h2>

            {/* Star Rating Selectors */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-editorial-dark block">Overall Coaching Experience</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoverRating ?? rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star 
                        size={24} 
                        className={`transition-colors ${
                          isActive ? "text-amber-500 fill-amber-500" : "text-neutral-200"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-mono text-editorial-muted ml-3 uppercase">
                  {rating === 5 ? "Incredible Coach" : rating === 4 ? "Very High Quality" : rating === 3 ? "Satisfactory" : "Needs Tuning"}
                </span>
              </div>
            </div>

            {/* Coach Speech accuracy select matrix */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-semibold text-editorial-dark block">Speech Metrics Accuracy & Pacing Calibration</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "excellent", label: "Highly Accurate", desc: "Filler words and speed matched my speaking perfectly." },
                  { id: "good", label: "Sufficient", desc: "Detected main pacing; minor lag in filler capture." },
                  { id: "uncalibrated", label: "Needs Fine-Tuning", desc: "Missed some syllables or verbal hedges." }
                ].map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setCoachAccuracy(acc.id)}
                    className={`p-4 border cursor-pointer transition-all flex flex-col justify-between rounded-none min-h-[110px] ${
                      coachAccuracy === acc.id 
                        ? "bg-indigo-50/20 border-indigo-600" 
                        : "bg-white border-editorial-border hover:border-neutral-400"
                    }`}
                  >
                    <span className="text-xs font-bold text-editorial-dark">{acc.label}</span>
                    <span className="text-[10px] text-editorial-muted font-light leading-relaxed mt-1.5">{acc.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantitative comment */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">Coaching Review Comments</label>
              <textarea
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your personal speaking breakthroughs or constructive code proposals with our engineering team..."
                className="w-full min-h-[120px] p-4 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-xs font-light resize-none leading-relaxed"
              />
            </div>

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] leading-relaxed font-light flex gap-2 items-center">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span>Feedback submitted successfully! We thank you for co-calibrating SpeakGlobal.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-widest cursor-pointer font-bold flex items-center justify-center gap-2"
            >
              Submit Feedback Review <Send size={12} />
            </button>
          </form>
        </div>

        {/* Right: Team guidelines (col-span-1) */}
        <div className="space-y-6">
          <div className="p-5 bg-indigo-50/20 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" />
              <span className="text-[9px] font-mono text-indigo-950 font-bold uppercase tracking-widest block">OUR COMMITMENT</span>
            </div>
            <p className="text-xs font-light text-indigo-900 leading-relaxed">
              We review 100% of community-submitted feedback tickets within 24 hours. Your evaluations directly inform which custom speech templates and pacing filters we train next.
            </p>
          </div>

          <div className="bg-white border border-editorial-border p-6 shadow-xs relative space-y-4">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            <h3 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-1.5">
              <Volume2 size={13} className="text-indigo-600" /> Acoustic Research
            </h3>
            
            <p className="text-[11px] text-editorial-muted font-light leading-relaxed">
              Our ongoing speech synthesis project targets natural multi-dialect recognition accuracy. By voicing your insights, you help expand access to global speaking opportunities.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
