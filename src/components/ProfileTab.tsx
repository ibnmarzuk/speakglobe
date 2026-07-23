import React, { useState, useRef } from "react";
import { 
  User, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Camera,
  Upload,
  Trash2,
  Lock,
  Mail,
  Phone,
  Globe,
  Award,
  Bell,
  Eye,
  Sliders,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  Zap,
  Key,
  Shield,
  Clock,
  Briefcase,
  GraduationCap
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenPictureModal?: () => void;
  showToast?: (message: string, type: "success" | "warning" | "error" | "info") => void;
  theme?: "light" | "dark";
  initialSection?: "personal" | "communication" | "account" | "verifications" | "preferences";
}

export default function ProfileTab({ 
  profile, 
  onUpdateProfile, 
  onOpenPictureModal, 
  showToast,
  theme = "light",
  initialSection = "personal"
}: ProfileTabProps) {
  const [activeSection, setActiveSection] = useState<
    "personal" | "communication" | "account" | "verifications" | "preferences"
  >(initialSection);

  // Profile Form State
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    username: profile.username || profile.name ? profile.name.toLowerCase().replace(/\s+/g, "_") : "global_speaker",
    bio: profile.bio || "Senior Software Engineer passionate about cloud architecture and global leadership.",
    country: profile.country || "United States",
    city: profile.city || "San Francisco",
    timezone: profile.timezone || "PST (UTC-8)",
    preferredLanguage: profile.preferredLanguage || "English (US)",
    occupation: profile.occupation || profile.profession || "Lead Software Engineer",
    educationLevel: profile.educationLevel || "Master's Degree",
    currentRole: profile.currentRole || "Senior Staff Engineer",
    experienceLevel: profile.experienceLevel || "Senior (5-8 yrs)",
    
    // Communication
    communicationGoal: profile.communicationGoal || "Job Interview Prep",
    nativeLanguage: profile.nativeLanguage || "Mandarin",
    languagesSpoken: profile.languagesSpoken || ["English", "Mandarin"],
    confidenceLevel: profile.confidenceLevel || "Moderate",
    practiceInterests: profile.practiceInterests || ["Interviews", "Executive Pitches", "Daily Standups"],
    careerGoal: profile.careerGoal || "Transition to VP of Engineering in a global tech firm",
    preferredCoachStyle: profile.preferredCoachStyle || "Encouraging & Patient",
    preferredLearningPace: profile.preferredLearningPace || "Standard (15 mins/day)",
    targetIndustry: profile.targetIndustry || "Software & Cloud Tech",
    interviewExperience: profile.interviewExperience || "Occasional Interviews",
    presentationExperience: profile.presentationExperience || "Lead Weekly Team Presentations",

    // Account & Verifications
    email: profile.email || "alex.chen@example.com",
    phoneNumber: profile.phoneNumber || "+1 (555) 234-5678",
    twoFactorEnabled: profile.twoFactorEnabled ?? false,
    verifications: {
      emailVerified: true,
      phoneVerified: profile.verifications?.phoneVerified ?? false,
      identityVerified: profile.verifications?.identityVerified ?? false,
      isPremiumMember: profile.verifications?.isPremiumMember ?? true,
      isVerifiedCoach: false
    },
    connectedAccounts: profile.connectedAccounts || {
      google: true,
      github: true,
      linkedin: false
    },

    // Preferences
    preferences: profile.preferences || {
      theme: theme || "light",
      accessibility: {
        fontSize: "normal",
        highContrast: false,
        reducedMotion: false
      },
      notifications: {
        emailDigest: true,
        dailyReminders: true,
        practiceSummaries: true
      },
      aiFeedbackStyle: "Encouraging",
      voicePreferences: {
        speed: 1.0,
        pitch: "Normal",
        accentGender: "Executive Female (US)"
      },
      practiceReminders: {
        timeOfDay: "09:00 AM",
        frequency: "Daily"
      },
      sessionLanguage: "English - Global Standard",
      privacySettings: {
        publicProfile: false,
        shareMetrics: true
      }
    }
  });

  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute profile completion score (25%, 50%, 75%, 100%)
  const calculateCompletion = () => {
    let score = 0;
    const checks = [
      Boolean(formData.name),
      Boolean(formData.avatarUrl),
      Boolean(formData.bio),
      Boolean(formData.country),
      Boolean(formData.occupation),
      Boolean(formData.communicationGoal),
      Boolean(formData.nativeLanguage),
      Boolean(formData.careerGoal),
      Boolean(formData.verifications?.emailVerified),
      Boolean(formData.verifications?.phoneVerified)
    ];
    const passed = checks.filter(Boolean).length;
    score = Math.round((passed / checks.length) * 100);
    return Math.max(25, score);
  };

  const completionPercent = calculateCompletion();

  // Handle Input Changes
  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferencesChange = (category: string, key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: typeof prev.preferences?.[category as keyof typeof prev.preferences] === "object"
          ? { ...(prev.preferences?.[category as keyof typeof prev.preferences] as any), [key]: value }
          : value
      }
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccessMsg("Profile changes saved successfully.");
    if (showToast) showToast("Profile updated successfully!", "success");
    setTimeout(() => setSavedSuccessMsg(""), 3000);
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      if (showToast) showToast("Please select a valid image file.", "warning");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const updated = { ...formData, avatarUrl: ev.target.result as string };
        setFormData(updated);
        onUpdateProfile(updated);
        if (showToast) showToast("Profile photo updated!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pb-20 font-sans text-editorial-text max-w-6xl mx-auto animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-editorial-border pb-6">
        <div>
          <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block">PERSONALIZED AI PROFILE</span>
          <h1 className="text-3xl font-light text-editorial-dark tracking-tight mt-1">
            User & Communication Profile
          </h1>
          <p className="text-xs text-editorial-muted font-light mt-1 max-w-xl leading-relaxed">
            Manage your personal identity, speaking goals, security settings, and AI coach preferences in one unified space.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave()}
            className="px-6 py-2.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Check size={13} /> Save All Changes
          </button>
        </div>
      </div>

      {/* Progressive Profile Completion Bar Banner */}
      <div className="bg-white border border-editorial-border p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-indigo-600" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-editorial-dark">
                  Profile Completion: {completionPercent}%
                </span>
              </div>
              <span className="text-xs font-mono text-editorial-muted font-bold">{completionPercent}/100%</span>
            </div>

            {/* Progress bar line */}
            <div className="w-full bg-editorial-light-gray h-2 border border-editorial-border rounded-none overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
                style={{ width: `${completionPercent}%` }} 
              />
            </div>

            <p className="text-[11px] text-editorial-muted font-light">
              Completing your profile allows SpeakGlobal's AI Coach to deliver hyper-specific interview questions and industry rewrites tailored to your role.
            </p>
          </div>

          {/* Suggested Next Step Quick Action */}
          <div className="bg-editorial-light-gray p-4 border border-editorial-border w-full md:w-auto min-w-[260px] space-y-2">
            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest block font-bold">SUGGESTED NEXT STEP</span>
            {!formData.avatarUrl ? (
              <button
                onClick={() => {
                  if (onOpenPictureModal) onOpenPictureModal();
                  else fileInputRef.current?.click();
                }}
                className="w-full text-left flex items-center justify-between text-xs font-bold text-editorial-dark hover:text-indigo-600 cursor-pointer"
              >
                <span>Add a profile picture</span>
                <ChevronRight size={14} />
              </button>
            ) : !formData.verifications?.phoneVerified ? (
              <button
                onClick={() => setActiveSection("account")}
                className="w-full text-left flex items-center justify-between text-xs font-bold text-editorial-dark hover:text-indigo-600 cursor-pointer"
              >
                <span>Verify your phone number</span>
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => setActiveSection("communication")}
                className="w-full text-left flex items-center justify-between text-xs font-bold text-editorial-dark hover:text-indigo-600 cursor-pointer"
              >
                <span>Refine communication goals</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{savedSuccessMsg}</span>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex border-b border-editorial-border overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: "personal", label: "Personal Information", icon: User },
          { id: "communication", label: "Communication Profile", icon: Target },
          { id: "account", label: "Account & Security", icon: ShieldCheck },
          { id: "verifications", label: "Verifications & Badges", icon: Shield },
          { id: "preferences", label: "Preferences & Voice", icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-editorial-dark text-editorial-dark bg-white"
                  : "border-transparent text-editorial-muted hover:text-editorial-dark hover:bg-editorial-light-gray/40"
              }`}
            >
              <Icon size={14} className={isActive ? "text-indigo-600" : "text-editorial-muted"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT SECTIONS */}
      <div className="bg-white border border-editorial-border p-8 shadow-xs">
        
        {/* 1. PERSONAL INFORMATION */}
        {activeSection === "personal" && (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="border-b border-editorial-border pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-editorial-dark">Personal Information</h3>
                <p className="text-xs text-editorial-muted font-light mt-0.5">Your core identity and professional background details.</p>
              </div>
            </div>

            {/* Profile Photo Area */}
            <div className="p-6 bg-editorial-light-gray/40 border border-editorial-border flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className="h-24 w-24 rounded-full border-2 border-editorial-dark/20 overflow-hidden bg-white flex items-center justify-center shadow-sm">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt={formData.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-editorial-dark text-white font-bold text-2xl flex items-center justify-center font-mono">
                      {formData.name ? formData.name.slice(0, 2).toUpperCase() : "SG"}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block font-bold">PROFILE PHOTO</span>
                <p className="text-sm font-bold text-editorial-dark">Upload, change or remove your picture</p>
                <p className="text-xs text-editorial-muted font-light max-w-md">
                  Supports JPG, PNG, WEBP files up to 5MB. Drag-and-drop or select from preset avatar library.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                  <input type="file" ref={fileInputRef} onChange={handleAvatarFileUpload} accept="image/*" className="hidden" />
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPictureModal) onOpenPictureModal();
                      else fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera size={13} />
                    Manage Photo
                  </button>

                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => handleChange("avatarUrl", undefined)}
                      className="px-4 py-2 bg-white border border-editorial-border hover:bg-editorial-light-gray text-red-600 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Short Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="w-full p-3 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none resize-none leading-relaxed"
                  placeholder="Tell us briefly about your professional background..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Date of Birth (Optional)</label>
                <input
                  type="date"
                  value={formData.dob || ""}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="PST (UTC-8)">PST (UTC-8) San Francisco / Seattle</option>
                  <option value="EST (UTC-5)">EST (UTC-5) New York / Toronto</option>
                  <option value="GMT (UTC+0)">GMT (UTC+0) London / Dublin</option>
                  <option value="CET (UTC+1)">CET (UTC+1) Berlin / Paris</option>
                  <option value="IST (UTC+5:30)">IST (UTC+5:30) New Delhi / Mumbai</option>
                  <option value="JST (UTC+9)">JST (UTC+9) Tokyo / Seoul</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Occupation / Profession</label>
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => handleChange("occupation", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleChange("educationLevel", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="High School">High School</option>
                  <option value="Undergraduate Student">Undergraduate Student</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate / PhD">Doctorate / PhD</option>
                  <option value="Self-Taught / Bootcamp">Self-Taught / Bootcamp</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Current Role</label>
                <input
                  type="text"
                  value={formData.currentRole}
                  onChange={(e) => handleChange("currentRole", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Experience Level</label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => handleChange("experienceLevel", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                  <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                  <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                  <option value="Lead / Executive (8+ yrs)">Lead / Executive (8+ yrs)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-editorial-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Check size={13} /> Save Personal Info
              </button>
            </div>
          </form>
        )}

        {/* 2. COMMUNICATION PROFILE */}
        {activeSection === "communication" && (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="border-b border-editorial-border pb-4">
              <h3 className="text-base font-bold text-editorial-dark">Communication Profile</h3>
              <p className="text-xs text-editorial-muted font-light mt-0.5">Parameters driving the AI coach's conversational depth and evaluation criteria.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Primary Goal</label>
                <select
                  value={formData.communicationGoal}
                  onChange={(e) => handleChange("communicationGoal", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="Job Interview Prep">Job Interview Preparation</option>
                  <option value="Executive Meeting Contribution">Executive Meeting Contribution</option>
                  <option value="Project Presentations & Pitches">Project Presentations & Pitches</option>
                  <option value="Networking & Elevator Pitching">Networking & Elevator Pitching</option>
                  <option value="Remote Global Collaboration">Remote Global Collaboration</option>
                  <option value="Introducing Yourself">Introducing Yourself</option>
                  <option value="Daily Conversation">Daily Conversation</option>
                  <option value="Leadership Communication">Leadership Communication</option>
                  <option value="Sales Pitch">Sales Pitch</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Native Language</label>
                <input
                  type="text"
                  value={formData.nativeLanguage}
                  onChange={(e) => handleChange("nativeLanguage", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Confidence Level</label>
                <select
                  value={formData.confidenceLevel}
                  onChange={(e) => handleChange("confidenceLevel", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="High">High - Speak naturally, working on executive polish</option>
                  <option value="Moderate">Moderate - Comfortable, but experience hesitations</option>
                  <option value="Developing">Developing - Need time to structure thoughts under pressure</option>
                  <option value="Low / Anxious">Low / Anxious - Seeking a safe space to practice daily</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Preferred AI Coach Style</label>
                <select
                  value={formData.preferredCoachStyle}
                  onChange={(e) => handleChange("preferredCoachStyle", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="Encouraging & Patient">Encouraging & Patient</option>
                  <option value="Direct & Strict">Direct & Strict (Boardroom Style)</option>
                  <option value="Detailed & Analytical">Detailed & Analytical</option>
                  <option value="Conversational & Warm">Conversational & Warm</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Learning Pace</label>
                <select
                  value={formData.preferredLearningPace}
                  onChange={(e) => handleChange("preferredLearningPace", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                >
                  <option value="Standard (15 mins/day)">Standard (15 mins/day)</option>
                  <option value="Intensive (30 mins/day)">Intensive (30 mins/day)</option>
                  <option value="Quick Drills (5 mins/day)">Quick Drills (5 mins/day)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Target Industry</label>
                <input
                  type="text"
                  value={formData.targetIndustry}
                  onChange={(e) => handleChange("targetIndustry", e.target.value)}
                  className="w-full px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Career & Speaking Goal</label>
                <textarea
                  rows={2}
                  value={formData.careerGoal}
                  onChange={(e) => handleChange("careerGoal", e.target.value)}
                  className="w-full p-3 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none resize-none leading-relaxed"
                  placeholder="Describe your primary career milestone or speaking target..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-editorial-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Check size={13} /> Save Communication Profile
              </button>
            </div>
          </form>
        )}

        {/* 3. ACCOUNT & SECURITY */}
        {activeSection === "account" && (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="border-b border-editorial-border pb-4">
              <h3 className="text-base font-bold text-editorial-dark">Account & Security</h3>
              <p className="text-xs text-editorial-muted font-light mt-0.5">Manage credentials, authentication, and connected platforms.</p>
            </div>

            <div className="space-y-6">
              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Email Address</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="flex-1 px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                    />
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      className="flex-1 px-3 py-2 bg-editorial-light-gray/30 border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...formData,
                          verifications: { ...formData.verifications, phoneVerified: true }
                        };
                        setFormData(updated);
                        if (showToast) showToast("SMS verification code sent & phone verified!", "success");
                      }}
                      className="px-3 py-2 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer whitespace-nowrap"
                    >
                      {formData.verifications?.phoneVerified ? "Verified ✓" : "Verify SMS"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password update section */}
              <div className="p-5 bg-editorial-light-gray/40 border border-editorial-border space-y-4">
                <span className="text-[10px] font-mono text-editorial-dark uppercase tracking-widest block font-bold flex items-center gap-2">
                  <Lock size={13} className="text-indigo-600" /> Password & Security
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="px-3 py-2 bg-white border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="px-3 py-2 bg-white border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="px-3 py-2 bg-white border border-editorial-border text-xs focus:border-editorial-dark focus:outline-none"
                  />
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest block font-bold">CONNECTED ACCOUNTS</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white border border-editorial-border flex items-center justify-between">
                    <span className="text-xs font-bold text-editorial-dark">Google</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Connected ✓</span>
                  </div>
                  <div className="p-4 bg-white border border-editorial-border flex items-center justify-between">
                    <span className="text-xs font-bold text-editorial-dark">GitHub</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Connected ✓</span>
                  </div>
                  <div className="p-4 bg-white border border-editorial-border flex items-center justify-between">
                    <span className="text-xs font-bold text-editorial-dark">LinkedIn</span>
                    <button
                      type="button"
                      onClick={() => { if (showToast) showToast("LinkedIn OAuth connection initialized.", "info"); }}
                      className="text-[10px] font-mono font-bold text-indigo-600 hover:underline cursor-pointer uppercase"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-5 bg-red-50/50 border border-red-200 space-y-3">
                <span className="text-[10px] font-mono text-red-700 uppercase tracking-widest block font-bold">DANGER ZONE</span>
                <p className="text-xs text-red-600 font-light">
                  Deleting your account will permanently wipe all practice session transcripts, AI metrics reports, and training history.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold tracking-wider cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 4. VERIFICATIONS & BADGES */}
        {activeSection === "verifications" && (
          <div className="space-y-8">
            <div className="border-b border-editorial-border pb-4">
              <h3 className="text-base font-bold text-editorial-dark">Profile Verifications & Badges</h3>
              <p className="text-xs text-editorial-muted font-light mt-0.5">Trust indicators and platform credentials associated with your account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Badge 1: Email Verified */}
              <div className="p-6 bg-white border border-editorial-border space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-editorial-dark">Email Verified</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-300">
                    VERIFIED ✓
                  </span>
                </div>
                <p className="text-xs text-editorial-muted font-light leading-relaxed">
                  Confirms your account email address for secure session recovery and weekly AI progress reports.
                </p>
              </div>

              {/* Badge 2: Phone Verified */}
              <div className="p-6 bg-white border border-editorial-border space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-editorial-dark">Phone Verified</h4>
                  </div>
                  {formData.verifications?.phoneVerified ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-300">
                      VERIFIED ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        const updated = {
                          ...formData,
                          verifications: { ...formData.verifications, phoneVerified: true }
                        };
                        setFormData(updated);
                        if (showToast) showToast("Phone number verified!", "success");
                      }}
                      className="px-3 py-1 bg-editorial-dark text-white font-mono text-[10px] uppercase font-bold cursor-pointer"
                    >
                      Verify Phone
                    </button>
                  )}
                </div>
                <p className="text-xs text-editorial-muted font-light leading-relaxed">
                  Enables SMS two-factor authentication and urgent daily practice reminder notifications.
                </p>
              </div>

              {/* Badge 3: Identity Verified */}
              <div className="p-6 bg-white border border-editorial-border space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-editorial-dark">Identity Verified</h4>
                  </div>
                  {formData.verifications?.identityVerified ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-300">
                      VERIFIED ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        const updated = {
                          ...formData,
                          verifications: { ...formData.verifications, identityVerified: true }
                        };
                        setFormData(updated);
                        if (showToast) showToast("Identity verification completed!", "success");
                      }}
                      className="px-3 py-1 bg-white border border-editorial-border text-editorial-dark font-mono text-[10px] uppercase font-bold cursor-pointer hover:bg-editorial-light-gray"
                    >
                      Verify Identity
                    </button>
                  )}
                </div>
                <p className="text-xs text-editorial-muted font-light leading-relaxed">
                  Professional credential check for executive peer reviews and global community discussions.
                </p>
              </div>

              {/* Badge 4: Premium Member */}
              <div className="p-6 bg-white border border-editorial-border space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-editorial-dark">Premium Member</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-mono text-[10px] font-bold uppercase border border-amber-300">
                    PRO ACCESS ✓
                  </span>
                </div>
                <p className="text-xs text-editorial-muted font-light leading-relaxed">
                  Unlocks unlimited live voice coaching, Gemini 3.6 Flash analysis, and customized 4-week roadmaps.
                </p>
              </div>

              {/* Badge 5: Verified Coach */}
              <div className="p-6 bg-white border border-editorial-border space-y-3 relative opacity-80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-editorial-dark">Verified Coach (Future)</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-editorial-light-gray text-editorial-muted font-mono text-[10px] font-bold uppercase border border-editorial-border">
                    COMING SOON
                  </span>
                </div>
                <p className="text-xs text-editorial-muted font-light leading-relaxed">
                  Allows certified communication coaches to mentor global students on the SpeakGlobal platform.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* 5. PREFERENCES & VOICE */}
        {activeSection === "preferences" && (
          <form onSubmit={handleSave} className="space-y-8">
            <div className="border-b border-editorial-border pb-4">
              <h3 className="text-base font-bold text-editorial-dark">Preferences & Voice Settings</h3>
              <p className="text-xs text-editorial-muted font-light mt-0.5">Customize UI theme, accessibility, notification cadence, and AI voice audio parameters.</p>
            </div>

            <div className="space-y-6">
              
              {/* Notification Toggles */}
              <div className="p-5 bg-editorial-light-gray/40 border border-editorial-border space-y-4">
                <span className="text-[10px] font-mono text-editorial-dark uppercase tracking-widest block font-bold flex items-center gap-2">
                  <Bell size={13} className="text-indigo-600" /> Notification Preferences
                </span>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-editorial-dark">Weekly AI Progress Digest Email</span>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.emailDigest ?? true}
                      onChange={(e) => handlePreferencesChange("notifications", "emailDigest", e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-editorial-dark">Daily Practice Reminders</span>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.dailyReminders ?? true}
                      onChange={(e) => handlePreferencesChange("notifications", "dailyReminders", e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-editorial-dark">Session Summary Notifications</span>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.notifications?.practiceSummaries ?? true}
                      onChange={(e) => handlePreferencesChange("notifications", "practiceSummaries", e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                </div>
              </div>

              {/* AI Voice & Audio Parameters */}
              <div className="p-5 bg-editorial-light-gray/40 border border-editorial-border space-y-4">
                <span className="text-[10px] font-mono text-editorial-dark uppercase tracking-widest block font-bold flex items-center gap-2">
                  <Sliders size={13} className="text-indigo-600" /> Voice & Audio Preferences
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">AI Speaker Persona</label>
                    <select
                      value={formData.preferences?.voicePreferences?.accentGender || "Executive Female (US)"}
                      onChange={(e) => handlePreferencesChange("voicePreferences", "accentGender", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-editorial-border text-xs focus:outline-none"
                    >
                      <option value="Executive Female (US)">Executive Female (US English)</option>
                      <option value="Executive Male (UK)">Executive Male (UK English)</option>
                      <option value="Warm Mentor (Global)">Warm Mentor (Global English)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-editorial-muted uppercase tracking-wider block font-bold">Session Language Standard</label>
                    <input
                      type="text"
                      value={formData.preferences?.sessionLanguage || "English - Global Standard"}
                      onChange={(e) => handlePreferencesChange("sessionLanguage", "", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-editorial-border text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="p-5 bg-editorial-light-gray/40 border border-editorial-border space-y-4">
                <span className="text-[10px] font-mono text-editorial-dark uppercase tracking-widest block font-bold flex items-center gap-2">
                  <Eye size={13} className="text-indigo-600" /> Privacy & Visibility
                </span>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-editorial-dark">Make Profile Discoverable in Global Community</span>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.privacySettings?.publicProfile ?? false}
                      onChange={(e) => handlePreferencesChange("privacySettings", "publicProfile", e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-medium text-editorial-dark">Share Anonymous Speech Benchmark Metrics</span>
                    <input
                      type="checkbox"
                      checked={formData.preferences?.privacySettings?.shareMetrics ?? true}
                      onChange={(e) => handlePreferencesChange("privacySettings", "shareMetrics", e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </label>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-editorial-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-editorial-dark hover:bg-neutral-800 text-white font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Check size={13} /> Save Preferences
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
