import React, { useState, useEffect } from "react";
import { 
  User, 
  ShieldCheck, 
  Sliders, 
  Bell, 
  CreditCard, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Volume2, 
  Sun, 
  Moon, 
  Lock, 
  Key, 
  Trash2, 
  SlidersHorizontal, 
  Check, 
  HelpCircle,
  Clock,
  Zap,
  RotateCcw
} from "lucide-react";
import { UserProfile, CommunicationGoal } from "../types";

interface SettingsTabProps {
  profile?: UserProfile | null;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
  initialSection?: string;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
  onResetOnboarding?: () => void;
}

export default function SettingsTab({
  profile,
  onUpdateProfile,
  initialSection = "profile",
  theme = "light",
  setTheme,
  onResetOnboarding
}: SettingsTabProps) {
  const [activeSection, setActiveSection] = useState<string>(initialSection);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Settings saved successfully.");

  // Sync initial section if passed from parent
  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  // Form State - Profile
  const [fullName, setFullName] = useState(profile?.name || "Sarah Jenkins");
  const [username, setUsername] = useState("sarah_global");
  const [bio, setBio] = useState("Lead Software Engineer preparing for international architectural reviews and global keynotes.");
  const [country, setCountry] = useState("United States");
  const [nativeLang, setNativeLang] = useState(profile?.nativeLanguage || "English");
  const [timezone, setTimezone] = useState("UTC-05:00 (EST)");
  const [primaryGoal, setPrimaryGoal] = useState<CommunicationGoal>(profile?.communicationGoal || CommunicationGoal.INTERVIEW);
  const [profession, setProfession] = useState(profile?.profession || "Software Developer");

  // Form State - Account
  const [email, setEmail] = useState("sarah.jenkins@speakglobal.ai");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [connectedGoogle, setConnectedGoogle] = useState(true);
  const [connectedGitHub, setConnectedGitHub] = useState(true);
  const [connectedLinkedIn, setConnectedLinkedIn] = useState(false);

  // Form State - Appearance & Accessibility
  const [appTheme, setAppTheme] = useState<"light" | "dark">(theme);
  const [fontSize, setFontSize] = useState("standard");
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Form State - AI Preferences
  const [aiVoice, setAiVoice] = useState("sarah_us");
  const [speakingSpeed, setSpeakingSpeed] = useState("1.0");
  const [feedbackStyle, setFeedbackStyle] = useState("constructive");
  const [practiceDifficulty, setPracticeDifficulty] = useState("adaptive");
  const [targetPacing, setTargetPacing] = useState(135);

  // Form State - Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);

  // Form State - Communication Profile (Onboarding Revisit)
  const [confidence, setConfidence] = useState(profile?.confidenceLevel || "Moderate");

  const triggerSuccess = (msg: string) => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile && onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        name: fullName,
        profession: profession,
        communicationGoal: primaryGoal,
        nativeLanguage: nativeLang,
        confidenceLevel: confidence
      });
    }
    triggerSuccess("Profile information updated successfully.");
  };

  const handleSaveAIPreferences = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess("AI Coach preferences and voice parameters saved.");
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess("Notification channels and delivery preferences updated.");
  };

  const handleThemeChange = (newT: "light" | "dark") => {
    setAppTheme(newT);
    if (setTheme) {
      setTheme(newT);
    }
    triggerSuccess(`Appearance theme set to ${newT.toUpperCase()}.`);
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal identity, bio, and location" },
    { id: "communication_profile", label: "Communication Profile", icon: Target, desc: "Revisit goals, career, and confidence" },
    { id: "account", label: "Account & Security", icon: ShieldCheck, desc: "Email, password, and connected accounts" },
    { id: "appearance", label: "Appearance", icon: Sun, desc: "Theme, font scale, and motion physics" },
    { id: "ai_preferences", label: "AI Coach Preferences", icon: Sparkles, desc: "Voice, speaking speed, and feedback style" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Email, push alerts, and practice reminders" },
    { id: "billing", label: "Billing & Plans", icon: CreditCard, desc: "Subscription, invoices, and usage limits" },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fade-in text-editorial-text font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">ACCOUNT MANAGEMENT HUB</span>
        <h1 className="text-3xl font-light tracking-tight text-editorial-dark mt-1">Settings & Preferences</h1>
        <p className="text-xs text-editorial-muted font-light mt-1.5 leading-relaxed max-w-2xl">
          Customize your SpeakGlobal experience. Manage your communication profile, AI coach voice parameters, notifications, and security credentials.
        </p>
      </div>

      {/* Save Toast Banner */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-light flex items-center justify-between rounded-none shadow-xs animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{saveMessage}</span>
          </div>
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-700">[SYNCED]</span>
        </div>
      )}

      {/* Main Settings Layout (Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sub-navigation Menu (Col 1) */}
        <div className="lg:col-span-1 space-y-1">
          <span className="text-[9px] font-mono font-bold text-editorial-muted uppercase tracking-widest px-3 mb-2 block">
            NAVIGATION SECTIONS
          </span>
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 text-xs text-left transition-all cursor-pointer rounded-none border ${
                  isActive 
                    ? "bg-editorial-dark text-white border-editorial-dark font-bold shadow-xs" 
                    : "bg-white text-editorial-muted hover:text-editorial-dark hover:bg-editorial-light-gray border-editorial-border"
                }`}
              >
                <Icon size={14} className={isActive ? "text-indigo-400" : "text-editorial-muted"} />
                <div className="min-w-0 flex-grow">
                  <span className="block truncate">{sec.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Panels (Col 2, 3, 4) */}
        <div className="lg:col-span-3">
          
          {/* SECTION: PROFILE */}
          {activeSection === "profile" && (
            <form onSubmit={handleSaveProfile} className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="flex items-center justify-between border-b border-editorial-border pb-4">
                <div>
                  <h2 className="text-xs font-mono font-bold text-editorial-dark uppercase tracking-widest">Public & Member Profile</h2>
                  <p className="text-[11px] text-editorial-muted font-light mt-0.5">Manage how you appear across the SpeakGlobal platform.</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm tracking-wider">
                  {fullName ? fullName.slice(0, 2).toUpperCase() : "SG"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-editorial-dark block">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-editorial-dark block">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-editorial-dark block">Profession / Role</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-editorial-dark block">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-editorial-dark block">Native Language</label>
                  <input
                    type="text"
                    value={nativeLang}
                    onChange={(e) => setNativeLang(e.target.value)}
                    className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-editorial-dark block">Timezone</label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-editorial-dark block">Personal Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark focus:border-editorial-dark focus:outline-none resize-none"
                  placeholder="Share your background and what you hope to achieve..."
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          )}

          {/* SECTION: COMMUNICATION PROFILE */}
          {activeSection === "communication_profile" && (
            <div className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="border-b border-editorial-border pb-4">
                <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest block font-bold">COMMUNICATION PROFILE</span>
                <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">Goals & Practice Interests</h2>
                <p className="text-xs text-editorial-muted font-light mt-1">Revisit your onboarding responses to adapt your AI coaching curriculum.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-editorial-dark block mb-2">Primary Communication Goal</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: CommunicationGoal.INTERVIEW, title: "Job Interviews", desc: "Master STAR framework and behavioral questions under time pressure" },
                      { id: CommunicationGoal.MEETINGS, title: "Meetings & Leadership", desc: "Speak concisely during standups and architectural reviews" },
                      { id: CommunicationGoal.PRESENTATION, title: "Public Keynotes", desc: "Deliver high-impact slide presentations with flawless pacing" },
                      { id: CommunicationGoal.NETWORKING, title: "Global Networking", desc: "Build rapport effortlessly with international collaborators" }
                    ].map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          setPrimaryGoal(g.id);
                          if (profile && onUpdateProfile) {
                            onUpdateProfile({ ...profile, communicationGoal: g.id });
                          }
                          triggerSuccess(`Primary goal updated to ${g.title}.`);
                        }}
                        className={`p-4 border cursor-pointer transition-all ${
                          primaryGoal === g.id 
                            ? "bg-indigo-50/40 border-indigo-600 font-bold text-editorial-dark" 
                            : "bg-white border-editorial-border hover:border-neutral-400"
                        }`}
                      >
                        <span className="text-xs font-bold block">{g.title}</span>
                        <span className="text-[10px] text-editorial-muted font-light block mt-1 leading-relaxed">{g.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-editorial-dark block mb-2">Self-Assessed Confidence Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Low", "Moderate", "High"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setConfidence(c);
                          if (profile && onUpdateProfile) {
                            onUpdateProfile({ ...profile, confidenceLevel: c });
                          }
                          triggerSuccess(`Confidence level updated to ${c}.`);
                        }}
                        className={`py-3 text-xs font-mono uppercase tracking-wider cursor-pointer border ${
                          confidence === c 
                            ? "bg-editorial-dark text-white font-bold border-editorial-dark" 
                            : "bg-white text-editorial-dark border-editorial-border hover:bg-editorial-light-gray"
                        }`}
                      >
                        {c} Confidence
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-editorial-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-editorial-light-gray p-4">
                  <div>
                    <span className="text-xs font-bold text-editorial-dark block">Re-run Full Onboarding Assessment</span>
                    <span className="text-[10px] text-editorial-muted font-light block">Reset your current roadmap and generate a new 4-week custom curriculum.</span>
                  </div>
                  <button
                    type="button"
                    onClick={onResetOnboarding}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs uppercase tracking-wider font-bold cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <RotateCcw size={13} /> Re-Assess Goals
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ACCOUNT & SECURITY */}
          {activeSection === "account" && (
            <div className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="border-b border-editorial-border pb-4">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">SECURITY PROTOCOLS</span>
                <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">Account & Credentials</h2>
                <p className="text-xs text-editorial-muted font-light mt-1">Update authentication credentials and manage connected social logins.</p>
              </div>

              {/* Email Address */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-editorial-dark block">Primary Email Address</label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-grow p-3 bg-editorial-light-gray border border-editorial-border text-xs text-editorial-dark"
                  />
                  <button
                    type="button"
                    onClick={() => triggerSuccess("Verification link sent to new email address.")}
                    className="px-4 py-3 bg-editorial-dark text-white font-mono text-xs uppercase tracking-wider cursor-pointer font-bold shrink-0"
                  >
                    Update Email
                  </button>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-4 pt-4 border-t border-editorial-border">
                <label className="text-xs font-bold text-editorial-dark block">Connected Accounts</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-editorial-border bg-editorial-light-gray/30">
                    <div className="flex items-center gap-3">
                      <Globe size={16} className="text-indigo-600" />
                      <div>
                        <span className="text-xs font-bold text-editorial-dark block">Google SSO</span>
                        <span className="text-[10px] text-editorial-muted font-light block">sarah.jenkins@gmail.com</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConnectedGoogle(!connectedGoogle)}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border cursor-pointer ${
                        connectedGoogle ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-white text-editorial-dark border-editorial-border"
                      }`}
                    >
                      {connectedGoogle ? "Connected" : "Connect"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-editorial-border bg-editorial-light-gray/30">
                    <div className="flex items-center gap-3">
                      <Key size={16} className="text-neutral-800" />
                      <div>
                        <span className="text-xs font-bold text-editorial-dark block">GitHub Integration</span>
                        <span className="text-[10px] text-editorial-muted font-light block">@sarahjenkins-dev</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConnectedGitHub(!connectedGitHub)}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border cursor-pointer ${
                        connectedGitHub ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-white text-editorial-dark border-editorial-border"
                      }`}
                    >
                      {connectedGitHub ? "Connected" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-editorial-border space-y-3">
                <span className="text-[10px] font-mono text-red-700 font-bold uppercase tracking-widest block">DANGER ZONE</span>
                <p className="text-xs text-editorial-muted font-light">
                  Deleting your account permanently removes all practice session transcripts, AI voice logs, and streak metrics.
                </p>
                <button
                  type="button"
                  onClick={() => alert("Please contact support@speakglobal.ai to initiate complete data deletion.")}
                  className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 text-xs font-mono uppercase tracking-wider font-bold cursor-pointer hover:bg-red-100 flex items-center gap-2"
                >
                  <Trash2 size={13} /> Delete Account
                </button>
              </div>
            </div>
          )}

          {/* SECTION: APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="border-b border-editorial-border pb-4">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">VISUAL SYSTEM</span>
                <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">Appearance & Accessibility</h2>
                <p className="text-xs text-editorial-muted font-light mt-1">Adjust interface color mode, typography scale, and animation physics.</p>
              </div>

              {/* Theme Mode Toggle */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-editorial-dark block">Theme Workspace Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`p-5 border cursor-pointer transition-all flex items-center justify-between ${
                      appTheme === "light" 
                        ? "bg-indigo-50/50 border-indigo-600 font-bold text-editorial-dark" 
                        : "bg-white border-editorial-border hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sun size={18} className="text-amber-600" />
                      <div className="text-left">
                        <span className="text-xs font-bold block">Editorial Light</span>
                        <span className="text-[10px] text-editorial-muted font-light block">High-contrast architectural layout</span>
                      </div>
                    </div>
                    {appTheme === "light" && <Check size={16} className="text-indigo-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`p-5 border cursor-pointer transition-all flex items-center justify-between ${
                      appTheme === "dark" 
                        ? "bg-neutral-900 border-indigo-500 font-bold text-white" 
                        : "bg-white border-editorial-border hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Moon size={18} className="text-indigo-400" />
                      <div className="text-left">
                        <span className="text-xs font-bold block">Deep Graphite</span>
                        <span className="text-[10px] text-editorial-muted font-light block">Low-eyestrain dark workspace</span>
                      </div>
                    </div>
                    {appTheme === "dark" && <Check size={16} className="text-indigo-400" />}
                  </button>
                </div>
              </div>

              {/* Font Size Scale */}
              <div className="space-y-3 pt-4 border-t border-editorial-border">
                <label className="text-xs font-bold text-editorial-dark block">Typography Scale</label>
                <div className="grid grid-cols-3 gap-3">
                  {["compact", "standard", "expanded"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setFontSize(s);
                        triggerSuccess(`Font scale updated to ${s.toUpperCase()}.`);
                      }}
                      className={`py-2.5 text-xs font-mono uppercase tracking-wider border cursor-pointer ${
                        fontSize === s ? "bg-editorial-dark text-white font-bold" : "bg-white text-editorial-dark border-editorial-border"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: AI PREFERENCES */}
          {activeSection === "ai_preferences" && (
            <form onSubmit={handleSaveAIPreferences} className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="border-b border-editorial-border pb-4">
                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest block">AI COACH ENGINE</span>
                <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">Voice & Coaching Preferences</h2>
                <p className="text-xs text-editorial-muted font-light mt-1">Calibrate synthetic coach voice persona, speaking speed, and feedback style.</p>
              </div>

              {/* AI Voice Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-editorial-dark block">AI Coach Voice Persona</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "sarah_us", name: "Sarah (US)", accent: "Clear Executive", desc: "Warm, authoritative, articulate" },
                    { id: "alex_uk", name: "Alex (UK)", accent: "Received Pronunciation", desc: "Crisp, formal, professional" },
                    { id: "morgan_neutral", name: "Morgan (Global)", accent: "Global Standard", desc: "Balanced cadence, reassuring" }
                  ].map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setAiVoice(v.id)}
                      className={`p-4 border cursor-pointer transition-all ${
                        aiVoice === v.id ? "bg-indigo-50/50 border-indigo-600 font-bold" : "bg-white border-editorial-border hover:border-neutral-400"
                      }`}
                    >
                      <span className="text-xs font-bold block">{v.name}</span>
                      <span className="text-[10px] text-indigo-600 font-mono font-bold block mt-0.5">{v.accent}</span>
                      <span className="text-[10px] text-editorial-muted font-light block mt-1 leading-relaxed">{v.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaking Speed & Target Pace */}
              <div className="space-y-3 pt-4 border-t border-editorial-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-editorial-dark block">Target Pace Cadence</label>
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-0.5">
                    {targetPacing} WPM
                  </span>
                </div>
                <input
                  type="range"
                  min="110"
                  max="170"
                  value={targetPacing}
                  onChange={(e) => setTargetPacing(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-editorial-light-gray"
                />
                <div className="flex justify-between text-[9px] font-mono text-editorial-muted">
                  <span>110 WPM (Pensive)</span>
                  <span className="text-indigo-600 font-bold">135 WPM (Optimal Clarity)</span>
                  <span>170 WPM (Rapid Pitch)</span>
                </div>
              </div>

              {/* Feedback Style */}
              <div className="space-y-3 pt-4 border-t border-editorial-border">
                <label className="text-xs font-bold text-editorial-dark block">Feedback Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "constructive", label: "Constructive" },
                    { id: "encouraging", label: "Encouraging" },
                    { id: "executive", label: "Strict Executive" },
                    { id: "conversational", label: "Conversational" }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFeedbackStyle(f.id)}
                      className={`py-2.5 text-xs font-mono uppercase tracking-wider border cursor-pointer ${
                        feedbackStyle === f.id ? "bg-editorial-dark text-white font-bold" : "bg-white text-editorial-dark border-editorial-border"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Save AI Coach Settings
              </button>
            </form>
          )}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <form onSubmit={handleSaveNotifications} className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="border-b border-editorial-border pb-4">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">COMMUNICATION CHANNELS</span>
                <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">Notification Preferences</h2>
                <p className="text-xs text-editorial-muted font-light mt-1">Control practice reminders, AI weekly digest reports, and system alerts.</p>
              </div>

              <div className="space-y-4">
                {[
                  { state: emailNotifs, setState: setEmailNotifs, title: "Email Practice Summaries", desc: "Receive post-session analysis breakdown and executive rewrites in your inbox." },
                  { state: pushNotifs, setState: setPushNotifs, title: "Browser Push Alerts", desc: "Instant reminders when your scheduled speaking session is about to begin." },
                  { state: practiceReminders, setState: setPracticeReminders, title: "Daily Practice Reminders", desc: "Keep your 12-day practice streak active with gentle daily nudge notifications." },
                  { state: weeklyReports, setState: setWeeklyReports, title: "Weekly Progress Reports", desc: "Comprehensive Monday morning digest of confidence growth and WPM metrics." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 border border-editorial-border bg-editorial-light-gray/20">
                    <div className="space-y-0.5 max-w-md">
                      <span className="text-xs font-bold text-editorial-dark block">{item.title}</span>
                      <span className="text-[10px] text-editorial-muted font-light leading-relaxed block">{item.desc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => item.setState(!item.state)}
                      className={`px-4 py-2 text-[10px] font-mono uppercase tracking-wider font-bold border cursor-pointer ${
                        item.state ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-white text-editorial-muted border-editorial-border"
                      }`}
                    >
                      {item.state ? "ON" : "OFF"}
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                Update Notification Toggles
              </button>
            </form>
          )}

          {/* SECTION: BILLING */}
          {activeSection === "billing" && (
            <div className="bg-white border border-editorial-border p-8 relative shadow-xs space-y-8">
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
              
              <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-widest block">MEMBERSHIP PLAN</span>
                  <h2 className="text-lg font-light tracking-tight text-editorial-dark mt-1">SpeakGlobal Pro Plan</h2>
                </div>
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold uppercase">
                  ACTIVE SUBSCRIBER
                </span>
              </div>

              {/* Plan usage breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-editorial-light-gray/50 border border-editorial-border">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase block">AI VOICE MINUTES</span>
                  <span className="text-xl font-bold text-editorial-dark block mt-1">Unlimited</span>
                  <span className="text-[10px] text-emerald-700 font-mono block mt-1">Pro Tier Granted</span>
                </div>

                <div className="p-4 bg-editorial-light-gray/50 border border-editorial-border">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase block">NEXT BILLING DATE</span>
                  <span className="text-xl font-bold text-editorial-dark block mt-1">Aug 23, 2026</span>
                  <span className="text-[10px] text-editorial-muted font-mono block mt-1">$29.00 / month</span>
                </div>

                <div className="p-4 bg-editorial-light-gray/50 border border-editorial-border">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase block">PAYMENT METHOD</span>
                  <span className="text-xl font-bold text-editorial-dark block mt-1">Visa •••• 4242</span>
                  <span className="text-[10px] text-editorial-muted font-mono block mt-1">Expires 09/28</span>
                </div>
              </div>

              {/* Invoice History */}
              <div className="space-y-3 pt-4 border-t border-editorial-border">
                <span className="text-xs font-bold text-editorial-dark block">Recent Billing Invoices</span>
                <div className="space-y-2 text-xs">
                  {[
                    { date: "Jul 23, 2026", amount: "$29.00", status: "Paid", inv: "INV-2026-007" },
                    { date: "Jun 23, 2026", amount: "$29.00", status: "Paid", inv: "INV-2026-006" },
                    { date: "May 23, 2026", amount: "$29.00", status: "Paid", inv: "INV-2026-005" }
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-editorial-border bg-white">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="font-bold text-editorial-dark">{inv.inv}</span>
                        <span className="text-editorial-muted">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-editorial-dark">{inv.amount}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] font-mono font-bold uppercase">
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
