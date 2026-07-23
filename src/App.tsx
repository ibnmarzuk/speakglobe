import React, { useState, useEffect } from "react";
import { UserProfile, PracticeSession, StreakInfo } from "./types";
import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import PracticeArena from "./components/PracticeArena";
import AICoach from "./components/AICoach";
import ProgressTracker from "./components/ProgressTracker";

// Extended sidebar tabs imports
import SessionsHistory from "./components/SessionsHistory";
import Achievements from "./components/Achievements";
import Roadmap from "./components/Roadmap";
import Community from "./components/Community";
import Resources from "./components/Resources";
import Notifications from "./components/Notifications";
import Billing from "./components/Billing";
import SettingsTab from "./components/SettingsTab";
import ProfileTab from "./components/ProfileTab";
import HelpCenter from "./components/HelpCenter";
import FeedbackTab from "./components/FeedbackTab";
import ProfilePictureUploadModal from "./components/ProfilePictureUploadModal";

import { 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  LogOut, 
  RotateCcw,
  Bell,
  User,
  Settings as SettingsIcon,
  CreditCard,
  HelpCircle,
  Keyboard,
  Sun,
  Moon,
  ChevronDown,
  Check,
  Target,
  Camera,
  Clock,
  Award
} from "lucide-react";

export interface ToastNotification {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
  actionLabel?: string;
  onAction?: () => void;
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [settingsSection, setSettingsSection] = useState<string>("profile");
  const [profileSection, setProfileSection] = useState<"personal" | "communication" | "account" | "verifications" | "preferences">("personal");
  const [history, setHistory] = useState<PracticeSession[]>([]);
  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 0,
    maxStreak: 0,
    lastPracticeDate: null
  });
  
  // App routing status: "landing" | "onboarding" | "app" | "login" | "signup"
  const [appRoute, setAppRoute] = useState<"landing" | "onboarding" | "app" | "login" | "signup">("landing");
  
  // Header Panel & Menu Dropdown States
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  // Unread notifications mock list
  const [unreadCount, setUnreadCount] = useState(3);
  const [notificationsList, setNotificationsList] = useState([
    { id: "n1", title: "Daily Practice Reminder", desc: "Your 15-min speaking drill is ready.", time: "10m ago", read: false, type: "reminder" },
    { id: "n2", title: "AI Coach Milestone", desc: "Voice pacing improved by +12% this week!", time: "2h ago", read: false, type: "coach" },
    { id: "n3", title: "Weekly Progress Report", desc: "Weekly digest generated for Lead Software Engineer path.", time: "1d ago", read: false, type: "summary" },
    { id: "n4", title: "New Scenario Added", desc: "Practice Architectural Board Review in Practice Arena.", time: "2d ago", read: true, type: "system" }
  ]);

  // State for preloaded scenario from dashboard daily challenge
  const [preloadedScenarioId, setPreloadedScenarioId] = useState<string | undefined>(undefined);

  // Swiss Toast Notification System State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  
  // Custom Minimalist Logout Confirmation Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // Session Recovery State Buffer (For Undo Actions)
  const [undoLogoutData, setUndoLogoutData] = useState<{ 
    profile: UserProfile | null; 
    history: PracticeSession[]; 
    streak: StreakInfo;
  } | null>(null);

  // Dynamic Light / Dark Theme State
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("speakglobal_theme") as "light" | "dark") || "light";
  });

  const handleSetTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("speakglobal_theme", newTheme);
  };

  // Helper to trigger a new premium Toast
  const showToast = (
    message: string, 
    type: "info" | "success" | "warning" = "info", 
    actionLabel?: string, 
    onAction?: () => void
  ) => {
    const id = Math.random().toString(36).substring(2, 11);
    setToasts((prev) => [...prev, { id, message, type, actionLabel, onAction }]);
    
    // Auto-remove standard toasts after 5.5 seconds, but give interactive toasts slightly longer
    const duration = actionLabel ? 9000 : 5500;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // Load state on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem("speakglobal_profile");
      const storedHistory = localStorage.getItem("speakglobal_history");
      const storedStreak = localStorage.getItem("speakglobal_streak");

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        if (parsed.isOnboarded) {
          setAppRoute("app");
          // Welcome Toast
          setTimeout(() => {
            showToast(`Welcome back, ${parsed.name}. Secure connection established.`, "success");
          }, 800);
        } else {
          setAppRoute("landing");
        }
      } else {
        setAppRoute("landing");
      }

      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      if (storedStreak) {
        setStreak(JSON.parse(storedStreak));
      }
    } catch (err) {
      console.error("Failed to restore SpeakGlobal local state:", err);
    }
  }, []);

  // Save profile helper (called after Onboarding is complete)
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("speakglobal_profile", JSON.stringify(newProfile));
    if (newProfile.isOnboarded) {
      setAppRoute("app");
      setActiveTab("dashboard");
      
      setTimeout(() => {
        showToast(`Account created successfully! Welcome to SpeakGlobal, ${newProfile.name}.`, "success");
      }, 300);
      
      setTimeout(() => {
        showToast("Logged in successfully. Your 4-week roadmap is generated.", "info");
      }, 2000);
    }
  };

  // Log a completed practice session & update streak
  const handleSessionLogged = (session: PracticeSession) => {
    const updatedHistory = [session, ...history];
    setHistory(updatedHistory);
    localStorage.setItem("speakglobal_history", JSON.stringify(updatedHistory));

    const todayStr = new Date().toDateString();
    let current = streak.currentStreak;
    let max = streak.maxStreak;

    if (streak.lastPracticeDate === null) {
      current = 1;
      max = Math.max(1, max);
    } else {
      const lastDate = new Date(streak.lastPracticeDate);
      const todayDate = new Date();
      
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        if (streak.lastPracticeDate !== todayStr) {
          current += 1;
          max = Math.max(current, max);
        }
      } else {
        current = 1;
      }
    }

    const updatedStreak = {
      currentStreak: current,
      maxStreak: max,
      lastPracticeDate: todayStr
    };
    setStreak(updatedStreak);
    localStorage.setItem("speakglobal_streak", JSON.stringify(updatedStreak));
  };

  // Update a session tag in history
  const handleUpdateSessionTag = (sessionId: string, newTag: string) => {
    const updatedHistory = history.map(s => {
      if (s.id === sessionId) {
        return { ...s, tag: newTag };
      }
      return s;
    });
    setHistory(updatedHistory);
    localStorage.setItem("speakglobal_history", JSON.stringify(updatedHistory));
  };

  // Reset roadmap profile
  const handleResetProfile = () => {
    if (profile) {
      localStorage.setItem("speakglobal_profile_backup", JSON.stringify(profile));
    }
    const resetProfile = profile ? { ...profile, isOnboarded: false, roadmap: undefined } : null;
    setProfile(resetProfile);
    localStorage.removeItem("speakglobal_profile");
    setAppRoute("onboarding");
    showToast("Roadmap reset. Starting custom assessment.", "info");
  };

  // Triggers the custom logout modal
  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  // Reverses logout state
  const handleUndoLogout = () => {
    let restoredProfile = undoLogoutData?.profile;
    let restoredHistory = undoLogoutData?.history || [];
    let restoredStreak = undoLogoutData?.streak || { currentStreak: 0, maxStreak: 0, lastPracticeDate: null };

    if (!restoredProfile) {
      const backupProfile = localStorage.getItem("speakglobal_profile_backup");
      const backupHistory = localStorage.getItem("speakglobal_history_backup");
      const backupStreak = localStorage.getItem("speakglobal_streak_backup");
      if (backupProfile) restoredProfile = JSON.parse(backupProfile);
      if (backupHistory) restoredHistory = JSON.parse(backupHistory);
      if (backupStreak) restoredStreak = JSON.parse(backupStreak);
    }

    if (restoredProfile) {
      setProfile(restoredProfile);
      setHistory(restoredHistory);
      setStreak(restoredStreak);
      localStorage.setItem("speakglobal_profile", JSON.stringify(restoredProfile));
      localStorage.setItem("speakglobal_history", JSON.stringify(restoredHistory));
      localStorage.setItem("speakglobal_streak", JSON.stringify(restoredStreak));
      setAppRoute("app");
      setUndoLogoutData(null);
      
      localStorage.removeItem("speakglobal_profile_backup");
      localStorage.removeItem("speakglobal_history_backup");
      localStorage.removeItem("speakglobal_streak_backup");
      
      setTimeout(() => {
        showToast("Log out reversed. Your customized roadmap is restored.", "success");
      }, 400);
    } else {
      showToast("Unable to restore session data automatically.", "warning");
    }
  };

  // Execute logout
  const executeLogout = () => {
    setUndoLogoutData({ profile, history, streak });

    if (profile) {
      localStorage.setItem("speakglobal_profile_backup", JSON.stringify(profile));
      localStorage.setItem("speakglobal_history_backup", JSON.stringify(history));
      localStorage.setItem("speakglobal_streak_backup", JSON.stringify(streak));
    }

    setProfile(null);
    setHistory([]);
    setStreak({ currentStreak: 0, maxStreak: 0, lastPracticeDate: null });

    localStorage.removeItem("speakglobal_profile");
    localStorage.removeItem("speakglobal_history");
    localStorage.removeItem("speakglobal_streak");
    
    setIsLogoutModalOpen(false);
    setAppRoute("landing");
    setActiveTab("dashboard");

    setTimeout(() => {
      showToast(
        "You have logged out of SpeakGlobal.", 
        "info", 
        "Undo Logout", 
        handleUndoLogout
      );
    }, 400);
  };

  const handleLaunchScenarioDirectly = (scenarioId: string) => {
    setPreloadedScenarioId(scenarioId);
    setActiveTab("practice");
  };

  const handleClearActiveScenario = () => {
    setPreloadedScenarioId(undefined);
  };

  const navigateToSettingsSection = (sec: string) => {
    setSettingsSection(sec);
    setActiveTab("settings");
    setIsProfileDropdownOpen(false);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    showToast("All notifications marked as read.", "info");
  };

  // --- Premium Toast Rendering ---
  const renderToasts = () => {
    return (
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isWarning = t.type === "warning";
          
          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-white border border-editorial-border p-4 shadow-lg text-editorial-dark flex items-start gap-3 relative overflow-hidden rounded-none animate-slide-up"
              style={{
                borderLeft: `3px solid ${isSuccess ? "#059669" : isWarning ? "#d97706" : "#171717"}`
              }}
            >
              {isSuccess ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : isWarning ? (
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info size={16} className="text-neutral-800 shrink-0 mt-0.5" />
              )}
              
              <div className="flex-grow pr-4">
                <p className="text-xs font-light leading-relaxed font-sans">{t.message}</p>
                {t.actionLabel && t.onAction && (
                  <button
                    onClick={() => {
                      t.onAction?.();
                      setToasts((prev) => prev.filter((toast) => toast.id !== t.id));
                    }}
                    className="mt-2 text-[10px] font-mono uppercase tracking-wider text-editorial-dark hover:text-neutral-600 font-bold underline cursor-pointer block"
                  >
                    [{t.actionLabel}]
                  </button>
                )}
              </div>

              <button
                onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
                className="text-editorial-muted hover:text-editorial-dark transition-colors cursor-pointer shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // --- Keyboard Shortcuts Modal ---
  const renderShortcutsModal = () => {
    if (!isShortcutsModalOpen) return null;

    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/50 backdrop-blur-xs">
        <div className="bg-white border border-editorial-border max-w-md w-full shadow-2xl p-6 rounded-none relative animate-fade-in">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-indigo-600" />
          <div className="flex items-center justify-between border-b border-editorial-border pb-3 mb-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-editorial-dark flex items-center gap-2">
              <Keyboard size={14} className="text-indigo-600" /> Keyboard Shortcuts
            </h3>
            <button 
              onClick={() => setIsShortcutsModalOpen(false)}
              className="text-editorial-muted hover:text-editorial-dark cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { keys: "⌘ + P", desc: "Open Practice Arena" },
              { keys: "⌘ + D", desc: "Return to Dashboard" },
              { keys: "⌘ + S", desc: "Go to Settings" },
              { keys: "⌘ + B", desc: "Open Billing & Plans" },
              { keys: "Esc", desc: "Close Modals & Drawers" }
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 border border-editorial-border bg-editorial-light-gray/30">
                <span className="text-editorial-muted font-light">{s.desc}</span>
                <span className="px-2 py-0.5 bg-white border border-editorial-border font-mono text-[10px] font-bold text-editorial-dark">
                  {s.keys}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Logout Modal ---
  const renderLogoutModal = () => {
    if (!isLogoutModalOpen) return null;

    return (
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-xs">
        <div className="bg-white border border-editorial-border max-w-md w-full shadow-2xl relative overflow-hidden p-8 rounded-none animate-fade-in">
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-red-600" />

          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-editorial-border pb-4">
              <div className="p-2 bg-red-50 text-red-700">
                <LogOut size={20} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-editorial-dark uppercase">Security Protocol</h3>
                <h2 className="text-lg font-light tracking-tight text-editorial-dark">Confirm Session Termination</h2>
              </div>
            </div>

            <p className="text-xs text-editorial-muted font-light leading-relaxed">
              Are you sure you want to sign out of <strong className="text-editorial-dark font-normal">SpeakGlobal</strong>? 
              This action terminates your session and clears your personalized curriculum roadmap.
            </p>

            <div className="p-3 bg-editorial-light-gray border border-editorial-border text-[11px] font-mono text-editorial-muted flex gap-2 items-start">
              <RotateCcw size={13} className="text-editorial-dark shrink-0 mt-0.5" />
              <span>
                <strong>UNDO SUPPORTED:</strong> If you accidentally terminate this session, you can restore your state using our undo safety net.
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-editorial-border">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full sm:w-auto order-2 sm:order-1 px-5 py-3 bg-white hover:bg-editorial-light-gray text-editorial-muted hover:text-editorial-dark border border-editorial-border text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                onClick={executeLogout}
                className="w-full sm:w-auto order-1 sm:order-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer font-bold flex items-center justify-center gap-2"
              >
                Proceed to Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- Router Orchestration ---

  if (appRoute === "landing") {
    return (
      <>
        <LandingPage 
          onStartOnboarding={() => setAppRoute("signup")} 
          onNavigateToLogin={() => setAppRoute("login")}
          onQuickSignIn={(p) => {
            setProfile(p);
            localStorage.setItem("speakglobal_profile", JSON.stringify(p));
            setAppRoute("app");
            setActiveTab("dashboard");
            setTimeout(() => {
              showToast(`Logged in successfully as ${p.name}.`, "success");
            }, 300);
          }}
        />
        {renderToasts()}
      </>
    );
  }

  if (appRoute === "login") {
    return (
      <LoginPage 
        onSignIn={(email) => {
          // Simulate sign-in and set profile
          const p: UserProfile = {
            name: email.split("@")[0],
            email: email,
            username: email.split("@")[0].toLowerCase(),
            profession: "Global Communicator",
            communicationGoal: "Job Interview Prep",
            nativeLanguage: "English",
            confidenceLevel: "Moderate",
            preferredLearningPace: "Standard (15 mins/day)",
            isOnboarded: true,
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
          setProfile(p);
          localStorage.setItem("speakglobal_profile", JSON.stringify(p));
          setAppRoute("app");
          setActiveTab("dashboard");
        }}
        onNavigateToSignup={() => setAppRoute("signup")}
      />
    );
  }

  if (appRoute === "signup") {
    return (
      <SignupPage 
        onSignup={(name, email) => {
          // Create new user, set profile, and go to onboarding (or directly to dashboard)
          const p: UserProfile = {
            name,
            email,
            username: email.split("@")[0].toLowerCase(),
            profession: "Global Communicator",
            communicationGoal: "Job Interview Prep",
            nativeLanguage: "English",
            confidenceLevel: "Moderate",
            preferredLearningPace: "Standard (15 mins/day)",
            isOnboarded: false,
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
          setProfile(p);
          localStorage.setItem("speakglobal_profile", JSON.stringify(p));
          setAppRoute("onboarding");
        }}
        onNavigateToLogin={() => setAppRoute("login")}
      />
    );
  }

  if (appRoute === "onboarding") {
    return (
      <>
        <Onboarding 
          onOnboardingComplete={(p) => handleSaveProfile(p)} 
        />
        {renderToasts()}
      </>
    );
  }

  return (
    <div className={`min-h-screen flex font-sans selection:bg-editorial-dark selection:text-white antialiased transition-colors duration-200 ${
      theme === "dark" ? "bg-neutral-950 text-neutral-100" : "bg-editorial-bg text-editorial-text"
    }`}>
      {/* Sidebar Navigation */}
      {profile && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          theme={theme}
          onOpenProfileDropdown={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        />
      )}

      {/* Main App Workspace */}
      <main className="flex-1 md:pl-[270px] min-h-screen flex flex-col">
        
        {/* Top Header Bar */}
        <header className={`h-16 px-6 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md ${
          theme === "dark" ? "bg-neutral-950/90 border-neutral-800" : "bg-white/90 border-editorial-border"
        }`}>
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-indigo-600 font-bold uppercase tracking-wider">SPEAKGLOBAL</span>
            <span className="text-editorial-muted">•</span>
            <span className="font-medium text-editorial-dark capitalize">{activeTab}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 relative">
            
            {/* Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationPanelOpen(!isNotificationPanelOpen);
                  setIsProfileDropdownOpen(false);
                }}
                className={`p-2 border rounded-none relative cursor-pointer transition-colors ${
                  theme === "dark" 
                    ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white" 
                    : "bg-white border-editorial-border text-editorial-dark hover:bg-editorial-light-gray"
                }`}
                aria-label="Notifications"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Slide-Over Dropdown */}
              {isNotificationPanelOpen && (
                <div className={`absolute right-0 mt-2 w-80 sm:w-96 border shadow-xl z-50 p-4 font-sans animate-fade-in ${
                  theme === "dark" ? "bg-neutral-900 border-neutral-800 text-neutral-100" : "bg-white border-editorial-border text-editorial-dark"
                }`}>
                  <div className="flex items-center justify-between border-b border-editorial-border pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-indigo-600" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider">Notifications ({unreadCount} Unread)</span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[10px] font-mono text-indigo-600 hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notificationsList.map((n) => (
                      <div key={n.id} className={`p-3 border text-xs relative ${
                        n.read ? "bg-editorial-light-gray/20 border-editorial-border opacity-70" : "bg-indigo-50/20 border-indigo-200"
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-editorial-dark">{n.title}</span>
                          <span className="text-[9px] font-mono text-editorial-muted">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-editorial-muted font-light mt-1">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 mt-3 border-t border-editorial-border flex justify-between items-center text-[10px] font-mono">
                    <button
                      onClick={() => {
                        setIsNotificationPanelOpen(false);
                        navigateToSettingsSection("notifications");
                      }}
                      className="text-indigo-600 hover:underline uppercase font-bold cursor-pointer"
                    >
                      Notification Preferences →
                    </button>
                    <button
                      onClick={() => setIsNotificationPanelOpen(false)}
                      className="text-editorial-muted hover:text-editorial-dark cursor-pointer uppercase"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown Button */}
            {profile && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                    setIsNotificationPanelOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-1.5 px-3 border transition-all cursor-pointer rounded-none ${
                    theme === "dark" 
                      ? "bg-neutral-900 border-neutral-800 text-neutral-100 hover:border-neutral-700" 
                      : "bg-white border-editorial-border text-editorial-dark hover:bg-editorial-light-gray"
                  }`}
                >
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name || "User Avatar"} 
                      className="h-6 w-6 rounded-full object-cover shrink-0 border border-indigo-200"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {profile.name ? profile.name.slice(0, 2).toUpperCase() : "SG"}
                    </div>
                  )}
                  <span className="text-xs font-bold truncate max-w-[110px] hidden sm:inline">{profile.name || "Member"}</span>
                  <ChevronDown size={13} className="text-editorial-muted" />
                </button>

                {/* Dropdown Menu Items */}
                {isProfileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-60 border shadow-2xl z-50 py-2 font-sans animate-fade-in ${
                    theme === "dark" ? "bg-neutral-900 border-neutral-800 text-neutral-100" : "bg-white border-editorial-border text-editorial-dark"
                  }`}>
                    {/* Header with quick picture upload button */}
                    <div className="px-4 py-3 border-b border-editorial-border mb-1 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative group shrink-0">
                          {profile.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.name} className="h-9 w-9 rounded-full object-cover border border-indigo-200" />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                              {profile.name ? profile.name.slice(0, 2).toUpperCase() : "SG"}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setIsProfilePictureModalOpen(true);
                              setIsProfileDropdownOpen(false);
                            }}
                            className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                            title="Upload / Change Profile Picture"
                          >
                            <Camera size={10} />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold block truncate">{profile.name}</span>
                          <span className="text-[10px] text-editorial-muted font-light block truncate">{profile.profession || "Global Communicator"}</span>
                        </div>
                      </div>
                    </div>

                    {[
                      { label: "My Profile", icon: User, action: () => { setProfileSection("personal"); setActiveTab("profile"); setIsProfileDropdownOpen(false); } },
                      { label: "Communication Profile", icon: Target, action: () => { setProfileSection("communication"); setActiveTab("profile"); setIsProfileDropdownOpen(false); } },
                      { label: "Practice History", icon: Clock, action: () => { setActiveTab("sessions"); setIsProfileDropdownOpen(false); } },
                      { label: "Achievements", icon: Award, action: () => { setActiveTab("achievements"); setIsProfileDropdownOpen(false); } },
                      { label: "Settings", icon: SettingsIcon, action: () => { setActiveTab("settings"); setIsProfileDropdownOpen(false); } },
                    ].map((m, idx) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={idx}
                          onClick={m.action}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-xs text-left cursor-pointer transition-colors ${
                            theme === "dark" ? "hover:bg-neutral-800 text-neutral-300" : "hover:bg-editorial-light-gray text-editorial-dark"
                          }`}
                        >
                          <Icon size={13} className="text-editorial-muted" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}

                    <div className="border-t border-editorial-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs text-left text-red-600 hover:bg-red-50 font-bold cursor-pointer transition-colors"
                      >
                        <LogOut size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </header>

        {/* Dynamic Panel Canvas */}
        <div className="flex-grow p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {activeTab === "dashboard" && profile && (
            <Dashboard
              profile={profile}
              history={history}
              streak={streak}
              onNavigateToTab={setActiveTab}
              onLaunchScenario={handleLaunchScenarioDirectly}
              onUpdateSessionTag={handleUpdateSessionTag}
            />
          )}

          {activeTab === "practice" && (
            <PracticeArena
              onSessionLogged={handleSessionLogged}
              activeScenarioId={preloadedScenarioId}
              onClearActiveScenario={handleClearActiveScenario}
              profile={profile}
              showToast={showToast}
            />
          )}

          {activeTab === "coach" && profile && (
            <AICoach profile={profile} />
          )}

          {activeTab === "progress" && (
            <ProgressTracker history={history} />
          )}

          {activeTab === "sessions" && (
            <SessionsHistory
              history={history}
              onUpdateSessionTag={handleUpdateSessionTag}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === "achievements" && (
            <Achievements />
          )}

          {activeTab === "roadmap" && (
            <Roadmap />
          )}

          {activeTab === "community" && (
            <Community />
          )}

          {activeTab === "resources" && (
            <Resources />
          )}

          {activeTab === "notifications" && (
            <Notifications />
          )}

          {activeTab === "billing" && (
            <Billing />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              profile={profile}
              onUpdateProfile={handleSaveProfile}
              initialSection={settingsSection}
              theme={theme}
              setTheme={handleSetTheme}
              onResetOnboarding={handleResetProfile}
            />
          )}

          {activeTab === "profile" && profile && (
            <ProfileTab
              profile={profile}
              onUpdateProfile={handleSaveProfile}
              initialSection={profileSection}
              onOpenPictureModal={() => setIsProfilePictureModalOpen(true)}
              showToast={showToast}
              theme={theme}
            />
          )}

          {activeTab === "help" && (
            <HelpCenter />
          )}

          {activeTab === "feedback" && (
            <FeedbackTab />
          )}
        </div>
      </main>

      {/* Custom Minimalist Modals and Toast Containers */}
      {profile && (
        <ProfilePictureUploadModal
          isOpen={isProfilePictureModalOpen}
          onClose={() => setIsProfilePictureModalOpen(false)}
          profile={profile}
          onUpdateProfile={handleSaveProfile}
          showToast={showToast}
          theme={theme}
        />
      )}
      {renderLogoutModal()}
      {renderShortcutsModal()}
      {renderToasts()}
    </div>
  );
}

