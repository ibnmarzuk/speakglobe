import React, { useState } from "react";
import { ArrowRight, X, Lock, Mail, User, Sparkles, Check } from "lucide-react";
import Logo from "./Logo";
import { UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile, isNewUser: boolean) => void;
  initialMode?: "signup" | "signin";
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = "signup" }: AuthModalProps) {
  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your Full Name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please enter a valid Email Address.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    } else {
      if (!email.trim()) {
        setErrorMsg("Please enter your Email Address.");
        return;
      }
      if (!password) {
        setErrorMsg("Please enter your Password.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const userProfile: UserProfile = {
        name: fullName.trim() || (email ? email.split("@")[0] : "Global Member"),
        email: email.trim() || "user@speakglobal.ai",
        username: email ? email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") : "user",
        profession: "Global Communicator",
        communicationGoal: "Job Interview Prep",
        nativeLanguage: "English",
        confidenceLevel: "Moderate",
        preferredLearningPace: "Standard (15 mins/day)",
        isOnboarded: false, // will prompt progressive profile completion banner
        verifications: {
          emailVerified: true,
          phoneVerified: false,
          identityVerified: false,
          isPremiumMember: false,
          isVerifiedCoach: false
        },
        preferences: {
          theme: "light",
          aiFeedbackStyle: "Encouraging",
          notifications: {
            emailDigest: true,
            dailyReminders: true,
            practiceSummaries: true
          }
        }
      };

      onAuthSuccess(userProfile, mode === "signup");
      onClose();
    }, 600);
  };

  const handleSocialAuth = (provider: "Google" | "GitHub") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userProfile: UserProfile = {
        name: provider === "Google" ? "Alex Chen" : "Alex Chen (GitHub)",
        email: provider === "Google" ? "alex.chen@gmail.com" : "alex.chen@github.user",
        username: "alexchen",
        profession: "Lead Software Engineer",
        communicationGoal: "Job Interview Prep",
        nativeLanguage: "Mandarin",
        confidenceLevel: "Moderate",
        preferredLearningPace: "Standard (15 mins/day)",
        isOnboarded: false,
        verifications: {
          emailVerified: true,
          phoneVerified: true,
          identityVerified: false,
          isPremiumMember: true,
          isVerifiedCoach: false
        },
        connectedAccounts: {
          google: provider === "Google",
          github: provider === "GitHub"
        }
      };

      onAuthSuccess(userProfile, mode === "signup");
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="bg-white border border-editorial-border w-full max-w-md shadow-2xl relative p-8 md:p-10 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-editorial-muted hover:text-editorial-dark hover:bg-editorial-light-gray transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Branding */}
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Logo size={28} />
          </div>
          <h2 className="text-2xl font-light text-editorial-dark tracking-tight">
            {mode === "signup" ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-editorial-muted font-light">
            {mode === "signup" 
              ? "Start speaking clearly & confidently in under 60 seconds." 
              : "Sign in to access your personalized AI coaching workspace."}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-3 text-editorial-muted" />
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-editorial-muted" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors"
              />
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-editorial-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-editorial-light-gray/40 border border-editorial-border text-editorial-dark text-xs focus:border-editorial-dark focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm mt-2"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
            ) : mode === "signup" ? (
              <>
                Create Account <ArrowRight size={13} />
              </>
            ) : (
              <>
                Sign In <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        {/* Social Auth Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-editorial-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-white px-2 text-editorial-muted">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialAuth("Google")}
            className="py-2.5 px-3 bg-white border border-editorial-border hover:bg-editorial-light-gray text-editorial-dark font-mono text-[11px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth("GitHub")}
            className="py-2.5 px-3 bg-white border border-editorial-border hover:bg-editorial-light-gray text-editorial-dark font-mono text-[11px] uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-editorial-dark" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        {/* Footer Toggle */}
        <div className="pt-2 text-center">
          {mode === "signup" ? (
            <p className="text-xs text-editorial-muted font-light">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                }}
                className="text-editorial-dark font-mono font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-xs text-editorial-muted font-light">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                className="text-editorial-dark font-mono font-bold hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
