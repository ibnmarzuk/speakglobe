import React, { useState } from "react";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Logo from "./Logo";

interface LoginPageProps {
  onSignIn: (email: string) => void;
  onNavigateToSignup: () => void;
}

export default function LoginPage({ onSignIn, onNavigateToSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn(email);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-editorial-bg flex items-center justify-center p-4">
      <div className="bg-white border border-editorial-border w-full max-w-md shadow-2xl p-10 space-y-6">
        <div className="text-center space-y-2">
          <Logo size={28} className="mx-auto" />
          <h2 className="text-2xl font-light text-editorial-dark tracking-tight">Welcome Back</h2>
          <p className="text-xs text-editorial-muted font-light">Sign in to access your personalized AI coaching workspace.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input type="email" required placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm mt-2">
            {isLoading ? "Signing in..." : <>Sign In <ArrowRight size={13} /></>}
          </button>
        </form>

        <div className="text-center text-xs text-editorial-muted font-light">
          Don't have an account?{" "}
          <button onClick={onNavigateToSignup} className="text-editorial-dark font-mono font-bold hover:underline cursor-pointer bg-transparent border-none">
            Start Free AI Session
          </button>
        </div>
      </div>
    </div>
  );
}
