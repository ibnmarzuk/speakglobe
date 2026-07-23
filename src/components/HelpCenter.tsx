import React, { useState } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Shield 
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  const faqs: FAQItem[] = [
    {
      question: "Is SpeakGlobal an accent modification or training tool?",
      answer: "No. SpeakGlobal is strictly an AI Communication Coach. We celebrate diverse native backgrounds and accents. True professional communication depends entirely on speech pacing (130-150 WPM), rhetorical organization (PREP or STAR structures), the reduction of trailing vocal fillers (like 'basically', 'um'), and projecting assertive confidence. We will never coach you to lose your cultural linguistic identity."
    },
    {
      question: "How does the real-time background noise check function?",
      answer: "Our real-time environment sensor analyzes audio decibels and harmonic frequencies before you speak. If it detects multiple human voices, heavy hums, television noise, or unstable network connections, the live coach gently prompts an advisory overlay to guarantee optimal audio analytics."
    },
    {
      question: "What is the 'Swiss Executive Phrasing Alignment'?",
      answer: "It is our premium NLP feature. When you complete a practice turn, our coach isolates hesitation strings or soft hedge statements ('I think we can maybe possibly...'), and automatically translates them into authoritative, direct business phrasing ('I propose we...'). It projects high-stakes executive weight."
    },
    {
      question: "Is my webcam or audio footage saved to the cloud?",
      answer: "Never. All camera calculations, eye contact tracking, and microphone level checks are analyzed locally in your client browser canvas sandbox. SpeakGlobal is secure-engineered by default."
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setSubject("");
    setMessage("");
    setTimeout(() => setContactSuccess(false), 4500);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">SECURE KNOWLEDGE CENTER</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Help Center</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-xl">
          Learn how to maximize your speaking evaluations, manage hardware configurations, or access direct engineering support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Collapsible Accordion FAQs (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-2">
            <HelpCircle size={14} className="text-indigo-600" /> Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-editorial-border transition-all rounded-none overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left font-bold text-xs text-editorial-dark hover:bg-neutral-50/50 cursor-pointer transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} />}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-editorial-muted font-light leading-relaxed border-t border-dashed border-editorial-border animate-fade-in">
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Contact Support Form (col-span-1) */}
        <div className="space-y-6">
          <div className="bg-white border border-editorial-border p-6 shadow-xs relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
            
            <h3 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest border-b border-editorial-border pb-3 flex items-center gap-1.5">
              <BookOpen size={13} className="text-indigo-600" /> Direct Support Ticket
            </h3>

            <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Microphone gain issue"
                  className="w-full px-3 py-2 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-xs font-light"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider block">Description / Inquiry</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your technical issue or account question..."
                  className="w-full min-h-[100px] p-3 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-xs font-light resize-none leading-relaxed"
                />
              </div>

              {contactSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] leading-relaxed font-light flex gap-1.5 items-start">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Support ticket filed successfully! Check your registered inbox in under 4 hours.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-widest cursor-pointer font-bold flex items-center justify-center gap-2"
              >
                Send Support Request <Send size={11} />
              </button>
            </form>
          </div>

          <div className="p-5 bg-indigo-50/20 border border-indigo-100 space-y-3 text-xs leading-relaxed text-indigo-900 font-light">
            <div className="flex items-center gap-2 font-bold text-indigo-950 uppercase tracking-wider">
              <Shield size={14} className="text-indigo-600" />
              <span>Response Guarantee</span>
            </div>
            <p>
              Premium account members receive guaranteed priority response turnarounds under <strong>4 hours</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
