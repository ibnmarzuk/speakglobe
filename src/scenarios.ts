import { PracticeScenario } from "./types";

export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: "sv-interview",
    title: "Silicon Valley Technical Defense",
    category: "Interview",
    difficulty: "Advanced",
    prompt: "Tell me about a time when you had to make a critical architectural trade-off that caused disagreement in your team. How did you resolve it?",
    context: "You are speaking to a Senior Engineering Director at a top tier tech firm. They are looking for executive reasoning, clear technical vocabulary, and structural trade-off articulation.",
    suggestedDurationSeconds: 45
  },
  {
    id: "elevator-pitch",
    title: "The 60-Second Elevator Pitch",
    category: "Networking",
    difficulty: "Beginner",
    prompt: "Describe what your product/solution does, the core problem it solves, and why you are uniquely qualified to lead it.",
    context: "You just bumped into a leading Seed-stage venture capitalist in a corporate mixer. This is your chance to articulate your vision with supreme impact and zero fluff.",
    suggestedDurationSeconds: 30
  },
  {
    id: "agile-standup",
    title: "The Dynamic Agile Standup",
    category: "Meeting",
    difficulty: "Beginner",
    prompt: "Provide your status update on the database migration delay. Address the blocker clearly and outline your direct remediation plan.",
    context: "You are speaking to your cross-functional development team. Keep it highly action-focused, structured, and avoid rambling or over-apologizing.",
    suggestedDurationSeconds: 30
  },
  {
    id: "salary-neg",
    title: "Salary & Scope Negotiation",
    category: "Leadership",
    difficulty: "Advanced",
    prompt: "Acknowledge the initial offer, state why your specialized skills warrant an offset alignment, and make your case confidently.",
    context: "You are talking with the VP of Talent Acquisition. This requires assertive, polite, and highly balanced persuasion with steady breathing.",
    suggestedDurationSeconds: 40
  },
  {
    id: "pitch-deck",
    title: "Project Pitch & Resource Request",
    category: "Presentation",
    difficulty: "Intermediate",
    prompt: "Present your proposal to automate QA testing. Highlight the initial cost, the long-term developer velocity gains, and make your formal resource request.",
    context: "You are addressing the senior executive stakeholders in the quarterly review meeting. Adopt a steady, structured, and highly commercial delivery.",
    suggestedDurationSeconds: 45
  },
  {
    id: "handling-objection",
    title: "Defending Against Client Objections",
    category: "Meeting",
    difficulty: "Intermediate",
    prompt: "A client states, 'Your security standards look decent, but we are highly hesitant to host our clinical data on a cloud architecture.' How do you address their concern?",
    context: "You are presenting during a high-stakes enterprise sales call. This test measures active reassurance, empathetic framing, and clear security trust articulation.",
    suggestedDurationSeconds: 40
  }
];
