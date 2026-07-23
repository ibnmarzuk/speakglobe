import React, { useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import Logo from "./Logo";

interface SignupPageProps {
  onSignup: (name: string, email: string) => void;
  onNavigateToLogin: () => void;
}

export default function SignupPage({ onSignup, onNavigateToLogin }: SignupPageProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignup(fullName, email);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-editorial-bg flex items-center justify-center p-4">
      <div className="bg-white border border-editorial-border w-full max-w-md shadow-2xl p-10 space-y-6">
        <div className="text-center space-y-2">
          <Logo size={28} className="mx-auto" />
          <h2 className="text-2xl font-light text-editorial-dark tracking-tight">Create Your Account</h2>
          <p className="text-xs text-editorial-muted font-light">Start speaking clearly & confidently in under 60 seconds.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input type="text" required placeholder="Alex Chen" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors" />
            </div>
          </div>
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
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors" />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm mt-2">
            {isLoading ? "Creating account..." : <>Create Account <ArrowRight size={13} /></>}
          </button>
        </form>

        <div className="text-center text-xs text-editorial-muted font-light">
          Already have an account?{" "}
          <button onClick={onNavigateToLogin} className="text-editorial-dark font-mono font-bold hover:underline cursor-pointer bg-transparent border-none">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
