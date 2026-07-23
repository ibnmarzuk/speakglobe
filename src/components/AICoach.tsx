import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, Volume2, Globe, RefreshCw, MessageSquare } from "lucide-react";
import { ChatMessage, UserProfile } from "../types";

interface AICoachProps {
  profile: UserProfile;
}

export default function AICoach({ profile }: AICoachProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<any>(null);

  // Initialize with greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello ${profile.name || "Alex"}, I am your SpeakGlobal Executive Mentor. 

I'm ready to help you prepare for critical upcoming communication milestones. Ask me any strategic questions, or click one of our curated drills below to practice:`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }
  }, [profile]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickDrills = [
    { title: "STAR Template Drill", prompt: "Explain how to formulate structural answers for behavioral questions using the STAR framework." },
    { title: "Anti-Filler Pause Drill", prompt: "Give me a practical 1-minute exercise to help me eliminate using 'um' and 'like' during high-stakes presentations." },
    { title: "Salary Negotiation Opening", prompt: "Give me a polished, assertive word-for-word template to propose salary and stock alignment offsets." },
    { title: "Handling Interruption", prompt: "How can I confidently address being interrupted in a virtual remote Zoom meeting?" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map history for API route
      const apiHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiHistory,
          userProfile: profile
        })
      });

      if (!response.ok) throw new Error("Coach chat failed");
      const data = await response.json();

      const coachMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, coachMsg]);

    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: "assistant",
        content: "I apologize, our primary cognitive server is currently undergoing load balancing. However, remember the golden rule of global communication: State your direct claim first, use structured numbering to list reasons, and breathe deeply. How can we rehearse your specific pitch?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto space-y-6 font-sans text-editorial-text">
      {/* Mentor Coach Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">ACTIVE COACHING CHAT</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">SpeakGlobal AI Mentor</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed">
          Ask rhetorical advice, practice standup deliveries, and learn frameworks directly.
        </p>
      </div>

      {/* Main chat window split */}
      <div className="flex-1 bg-white border border-editorial-border flex flex-col justify-between overflow-hidden shadow-xs relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-editorial-dark" />
        
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-editorial-bg/30">
          {messages.map((m) => {
            const isCoach = m.role === "assistant";
            return (
              <div 
                key={m.id} 
                className={`flex gap-4 max-w-[85%] ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Square clean icon */}
                <div className={`h-8 w-8 shrink-0 flex items-center justify-center font-mono font-bold text-xs border ${
                  isCoach 
                    ? "bg-editorial-dark text-white border-editorial-dark" 
                    : "bg-white text-editorial-dark border-editorial-border"
                }`}>
                  {isCoach ? "SG" : "ME"}
                </div>

                {/* Bubble content */}
                <div className={`space-y-1 p-4 border ${
                  isCoach 
                    ? "bg-white border-editorial-border text-editorial-dark" 
                    : "bg-editorial-light-gray border-editorial-border text-editorial-dark"
                }`}>
                  <div className="text-xs sm:text-sm font-light leading-relaxed whitespace-pre-wrap select-text">
                    {m.content}
                  </div>
                  <div className="text-[8px] font-mono text-editorial-muted text-right mt-1.5 uppercase tracking-wider">
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 mr-auto bg-white border border-editorial-border p-4 max-w-sm">
              <RefreshCw size={13} className="animate-spin text-editorial-dark" />
              <span className="text-[10px] text-editorial-muted font-mono uppercase tracking-wider">Mentor formulating rhetorical drill...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Curated Quick Card Helpers */}
        {messages.length === 1 && (
          <div className="p-4 bg-white border-t border-editorial-border grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {quickDrills.map((qd, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qd.prompt)}
                className="p-3.5 text-left bg-white hover:bg-editorial-light-gray border border-editorial-border text-xs transition-colors cursor-pointer space-y-1 group rounded-none"
              >
                <div className="flex items-center gap-1.5 text-editorial-dark font-bold">
                  <Sparkles size={11} className="text-editorial-dark shrink-0" />
                  <span className="group-hover:underline">{qd.title}</span>
                </div>
                <p className="text-[10px] text-editorial-muted truncate font-light leading-none">
                  {qd.prompt}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Input Text Box Bar */}
        <div className="p-4 border-t border-editorial-border bg-white shrink-0 flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
            disabled={isLoading}
            placeholder="Type your message or practicing inquiry..."
            className="flex-1 px-4 py-3 bg-editorial-light-gray border border-editorial-border text-editorial-dark focus:outline-none focus:border-editorial-dark text-sm font-light transition-colors"
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-editorial-dark hover:bg-neutral-800 text-white transition-colors cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-40"
            aria-label="Send Message"
          >
            <Send size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
