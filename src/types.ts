export enum CommunicationGoal {
  INTERVIEW = "Job Interview Prep",
  MEETINGS = "Executive Meeting Contribution",
  PRESENTATION = "Project Presentations & pitches",
  NETWORKING = "Networking & Elevator Pitching",
  COLLABORATION = "Remote Global Collaboration"
}

export interface UserProfile {
  name: string;
  email?: string;
  username?: string;
  bio?: string;
  dob?: string;
  country?: string;
  city?: string;
  timezone?: string;
  preferredLanguage?: string;
  occupation?: string;
  educationLevel?: string;
  currentRole?: string;
  experienceLevel?: string;
  profession: string;
  communicationGoal: string;
  nativeLanguage: string;
  languagesSpoken?: string[];
  confidenceLevel: string;
  practiceInterests?: string[];
  careerGoal?: string;
  preferredCoachStyle?: string;
  preferredLearningPace: string;
  targetIndustry?: string;
  interviewExperience?: string;
  presentationExperience?: string;
  isOnboarded: boolean;
  avatarUrl?: string;
  roadmap?: TrainingRoadmap;
  
  // Verification badges status
  verifications?: {
    emailVerified?: boolean;
    phoneVerified?: boolean;
    identityVerified?: boolean;
    isPremiumMember?: boolean;
    isVerifiedCoach?: boolean;
  };
  
  // Security & Account
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
  connectedAccounts?: {
    google?: boolean;
    github?: boolean;
    linkedin?: boolean;
  };

  // Preferences
  preferences?: {
    theme?: "light" | "dark";
    accessibility?: {
      fontSize?: "normal" | "large" | "x-large";
      highContrast?: boolean;
      reducedMotion?: boolean;
    };
    notifications?: {
      emailDigest?: boolean;
      dailyReminders?: boolean;
      practiceSummaries?: boolean;
    };
    aiFeedbackStyle?: "Encouraging" | "Direct & Strict" | "Detailed & Analytical";
    voicePreferences?: {
      speed?: number; // 0.8 - 1.2
      pitch?: string;
      accentGender?: string;
    };
    practiceReminders?: {
      timeOfDay?: string;
      frequency?: "Daily" | "Weekdays" | "Custom";
    };
    sessionLanguage?: string;
    privacySettings?: {
      publicProfile?: boolean;
      shareMetrics?: boolean;
    };
  };
}

export interface TrainingRoadmap {
  focusArea: string;
  dailyTimeRecommendation: string;
  roadmap: Array<{
    week: number;
    title: string;
    description: string;
    exercises: string[];
  }>;
}

export interface PracticeScenario {
  id: string;
  title: string;
  category: "Interview" | "Meeting" | "Presentation" | "Networking" | "Leadership";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prompt: string;
  context: string;
  suggestedDurationSeconds: number;
}

export interface FeedbackReport {
  clarityScore: number;
  paceScore: number;
  vocabularyScore: number;
  confidenceScore: number;
  wordsPerMinute: number;
  fillerWordsDetected: string[];
  strengths: string[];
  weaknesses: string[];
  improvedPhrasing: string;
  explanation: string;
}

export interface PracticeSession {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  date: string;
  userSpeechText: string;
  durationSeconds: number;
  feedback: FeedbackReport;
  tag?: string;
}

export interface StreakInfo {
  currentStreak: number;
  maxStreak: number;
  lastPracticeDate: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SessionLog {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  timestamp: string;
  userSpeechText: string;
  speechDurationSeconds: number;
  analysis: FeedbackReport & { overallScore?: number; tomorrowChallenge?: string };
  tag?: string;
}
