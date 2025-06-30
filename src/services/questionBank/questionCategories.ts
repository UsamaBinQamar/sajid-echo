
export interface QuestionTemplate {
  id: string;
  category: string;
  question_text: string;
  priority_level: number;
  frequency_type: 'daily' | 'weekly' | 'bi-weekly' | 'contextual';
  target_focus_areas: string[];
  triggers?: {
    mood_threshold?: number;
    stress_threshold?: number;
    keywords?: string[];
    response_patterns?: string[];
  };
  variations?: string[];
}

export const QUESTION_CATEGORIES = {
  SLEEP_RECOVERY: 'sleep_recovery',
  SOCIAL_RELATIONSHIPS: 'social_relationships',
  HEALTH_WELLNESS: 'health_wellness',
  WORK_BOUNDARIES: 'work_boundaries',
  PERSONAL_GROWTH: 'personal_growth',
  FINANCIAL_STRESS: 'financial_stress',
  EMOTIONAL_REGULATION: 'emotional_regulation',
  PRODUCTIVITY: 'productivity',
  CREATIVITY: 'creativity',
  MINDFULNESS: 'mindfulness'
} as const;

export const EXPANDED_QUESTION_BANK: QuestionTemplate[] = [
  // Sleep & Recovery
  {
    id: 'sleep-quality-1',
    category: QUESTION_CATEGORIES.SLEEP_RECOVERY,
    question_text: "How would you rate the quality of your sleep last night?",
    priority_level: 1,
    frequency_type: 'daily',
    target_focus_areas: ['sleep_recovery', 'health_wellness'],
    variations: [
      "How rested do you feel after last night's sleep?",
      "Rate how refreshing your sleep was last night"
    ]
  },
  {
    id: 'sleep-routine-1',
    category: QUESTION_CATEGORIES.SLEEP_RECOVERY,
    question_text: "How consistent was your bedtime routine this week?",
    priority_level: 2,
    frequency_type: 'weekly',
    target_focus_areas: ['sleep_recovery'],
    triggers: {
      response_patterns: ['irregular_sleep']
    }
  },
  
  // Social Relationships
  {
    id: 'connection-1',
    category: QUESTION_CATEGORIES.SOCIAL_RELATIONSHIPS,
    question_text: "How connected did you feel to others today?",
    priority_level: 1,
    frequency_type: 'daily',
    target_focus_areas: ['social_relationships'],
    variations: [
      "How supported did you feel by your relationships today?",
      "Rate the quality of your social interactions today"
    ]
  },
  {
    id: 'relationship-depth-1',
    category: QUESTION_CATEGORIES.SOCIAL_RELATIONSHIPS,
    question_text: "How meaningful were your conversations this week?",
    priority_level: 2,
    frequency_type: 'weekly',
    target_focus_areas: ['social_relationships', 'personal_growth']
  },
  
  // Work Boundaries
  {
    id: 'work-balance-1',
    category: QUESTION_CATEGORIES.WORK_BOUNDARIES,
    question_text: "How well did you maintain work-life boundaries today?",
    priority_level: 1,
    frequency_type: 'daily',
    target_focus_areas: ['work_boundaries'],
    triggers: {
      stress_threshold: 3,
      keywords: ['overtime', 'deadline', 'pressure']
    }
  },
  {
    id: 'work-fulfillment-1',
    category: QUESTION_CATEGORIES.WORK_BOUNDARIES,
    question_text: "How fulfilling did your work feel this week?",
    priority_level: 2,
    frequency_type: 'weekly',
    target_focus_areas: ['work_boundaries', 'personal_growth']
  },
  
  // Emotional Regulation
  {
    id: 'emotion-awareness-1',
    category: QUESTION_CATEGORIES.EMOTIONAL_REGULATION,
    question_text: "How aware were you of your emotions today?",
    priority_level: 1,
    frequency_type: 'daily',
    target_focus_areas: ['emotional_regulation', 'mindfulness'],
    variations: [
      "How well did you recognize your feelings today?",
      "Rate your emotional self-awareness today"
    ]
  },
  {
    id: 'emotion-response-1',
    category: QUESTION_CATEGORIES.EMOTIONAL_REGULATION,
    question_text: "How effectively did you respond to challenging emotions today?",
    priority_level: 2,
    frequency_type: 'contextual',
    target_focus_areas: ['emotional_regulation'],
    triggers: {
      mood_threshold: 2,
      stress_threshold: 4
    }
  },
  
  // Productivity & Focus
  {
    id: 'focus-quality-1',
    category: QUESTION_CATEGORIES.PRODUCTIVITY,
    question_text: "How focused were you during your most important tasks today?",
    priority_level: 1,
    frequency_type: 'daily',
    target_focus_areas: ['productivity', 'work_boundaries']
  },
  {
    id: 'energy-management-1',
    category: QUESTION_CATEGORIES.PRODUCTIVITY,
    question_text: "How well did you manage your energy throughout the day?",
    priority_level: 2,
    frequency_type: 'daily',
    target_focus_areas: ['productivity', 'health_wellness']
  },
  
  // Creativity & Growth
  {
    id: 'creative-expression-1',
    category: QUESTION_CATEGORIES.CREATIVITY,
    question_text: "How much space did you create for creative thinking today?",
    priority_level: 3,
    frequency_type: 'weekly',
    target_focus_areas: ['creativity', 'personal_growth']
  },
  {
    id: 'learning-growth-1',
    category: QUESTION_CATEGORIES.PERSONAL_GROWTH,
    question_text: "What did you learn about yourself today?",
    priority_level: 2,
    frequency_type: 'bi-weekly',
    target_focus_areas: ['personal_growth']
  },
  
  // Mindfulness & Presence
  {
    id: 'presence-1',
    category: QUESTION_CATEGORIES.MINDFULNESS,
    question_text: "How present were you in your daily activities?",
    priority_level: 2,
    frequency_type: 'daily',
    target_focus_areas: ['mindfulness', 'emotional_regulation'],
    variations: [
      "How mindful were you during routine activities today?",
      "Rate your level of presence and awareness today"
    ]
  },
  {
    id: 'gratitude-1',
    category: QUESTION_CATEGORIES.MINDFULNESS,
    question_text: "What are you most grateful for today?",
    priority_level: 2,
    frequency_type: 'daily',
    target_focus_areas: ['mindfulness', 'emotional_regulation']
  },
  
  // Financial Wellness
  {
    id: 'financial-stress-1',
    category: QUESTION_CATEGORIES.FINANCIAL_STRESS,
    question_text: "How stressed did you feel about finances today?",
    priority_level: 2,
    frequency_type: 'weekly',
    target_focus_areas: ['financial_stress'],
    triggers: {
      keywords: ['money', 'budget', 'expense', 'bills']
    }
  },
  {
    id: 'financial-planning-1',
    category: QUESTION_CATEGORIES.FINANCIAL_STRESS,
    question_text: "How confident do you feel about your financial planning?",
    priority_level: 3,
    frequency_type: 'bi-weekly',
    target_focus_areas: ['financial_stress']
  }
];
