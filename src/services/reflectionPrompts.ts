
export interface ReflectionPrompt {
  id: string;
  category: string;
  text: string;
}

export const LEADERSHIP_REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Leadership Foundation
  {
    id: "leadership-1",
    category: "Leadership Foundation",
    text: "Today I noticed myself stepping into leadership when I..."
  },
  {
    id: "leadership-2",
    category: "Leadership Foundation",
    text: "Something that felt difficult or unfamiliar about leading today was..."
  },
  {
    id: "leadership-3",
    category: "Leadership Foundation",
    text: "A value I tried to lead by today was..."
  },
  {
    id: "leadership-4",
    category: "Leadership Foundation",
    text: "I felt unsure about my role when..."
  },
  {
    id: "leadership-5",
    category: "Leadership Foundation",
    text: "I led with integrity even when it was costly by..."
  },

  // Communication & Feedback
  {
    id: "communication-1",
    category: "Communication & Feedback",
    text: "I communicated clearly when I..."
  },
  {
    id: "communication-2",
    category: "Communication & Feedback",
    text: "One way I practiced listening or learning from others today was..."
  },
  {
    id: "communication-3",
    category: "Communication & Feedback",
    text: "A moment I gave or received feedback today was..."
  },
  {
    id: "communication-4",
    category: "Communication & Feedback",
    text: "I made space for others' perspectives by..."
  },

  // Decision Making & Responsibility
  {
    id: "decision-1",
    category: "Decision Making & Responsibility",
    text: "I handled a responsibility or mistake today by..."
  },
  {
    id: "decision-2",
    category: "Decision Making & Responsibility",
    text: "I responded to pressure or urgency today by..."
  },
  {
    id: "decision-3",
    category: "Decision Making & Responsibility",
    text: "A long-term decision or investment I influenced today was..."
  },
  {
    id: "decision-4",
    category: "Decision Making & Responsibility",
    text: "I held tension between competing priorities by..."
  },
  {
    id: "decision-5",
    category: "Decision Making & Responsibility",
    text: "I made a decision that reflects our deeper values when..."
  },

  // Team Dynamics
  {
    id: "team-1",
    category: "Team Dynamics",
    text: "A challenge I'm noticing in team dynamics is..."
  },
  {
    id: "team-2",
    category: "Team Dynamics",
    text: "I delegated (or failed to delegate) effectively when..."
  },
  {
    id: "team-3",
    category: "Team Dynamics",
    text: "My leadership influenced team energy or outcomes today when I..."
  },
  {
    id: "team-4",
    category: "Team Dynamics",
    text: "I set a tone for my team today by..."
  },
  {
    id: "team-5",
    category: "Team Dynamics",
    text: "I mentored or elevated another leader today when..."
  },

  // Self-Awareness
  {
    id: "self-1",
    category: "Self-Awareness",
    text: "I'm learning that good leadership also means..."
  },
  {
    id: "self-2",
    category: "Self-Awareness",
    text: "I noticed myself shrinking back or second-guessing when..."
  },
  {
    id: "self-3",
    category: "Self-Awareness",
    text: "I noticed a pattern in my leadership that I want to shift when..."
  },
  {
    id: "self-4",
    category: "Self-Awareness",
    text: "I showed emotional intelligence today when..."
  },
  {
    id: "self-5",
    category: "Self-Awareness",
    text: "A blind spot I'm noticing in myself or our organization is..."
  },

  // Systemic Leadership
  {
    id: "systemic-1",
    category: "Systemic Leadership",
    text: "A systemic issue I'm navigating is..."
  },
  {
    id: "systemic-2",
    category: "Systemic Leadership",
    text: "Someone's trust in me grew (or declined) today because..."
  },
  {
    id: "systemic-3",
    category: "Systemic Leadership",
    text: "Today I shaped culture or strategy by..."
  },
  {
    id: "systemic-4",
    category: "Systemic Leadership",
    text: "I protected space for innovation or rest by..."
  },
  {
    id: "systemic-5",
    category: "Systemic Leadership",
    text: "Today reminded me of the legacy I'm trying to build when..."
  },
  {
    id: "systemic-6",
    category: "Systemic Leadership",
    text: "My leadership disrupted or upheld a norm today by..."
  }
];

export const getRandomPrompt = (): ReflectionPrompt => {
  const randomIndex = Math.floor(Math.random() * LEADERSHIP_REFLECTION_PROMPTS.length);
  return LEADERSHIP_REFLECTION_PROMPTS[randomIndex];
};

export const getPromptsByCategory = (category: string): ReflectionPrompt[] => {
  return LEADERSHIP_REFLECTION_PROMPTS.filter(prompt => prompt.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(LEADERSHIP_REFLECTION_PROMPTS.map(prompt => prompt.category))];
};

export const getRandomPromptByCategory = (category: string): ReflectionPrompt | null => {
  const categoryPrompts = getPromptsByCategory(category);
  if (categoryPrompts.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * categoryPrompts.length);
  return categoryPrompts[randomIndex];
};
