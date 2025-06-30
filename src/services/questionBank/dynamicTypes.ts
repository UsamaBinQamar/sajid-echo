
export interface DynamicQuestionContext {
  userId: string;
  recentMoodScores: number[];
  recentStressLevels: number[];
  journalKeywords: string[];
  focusAreas: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  dayOfWeek: string;
  recentResponses: any[];
}

export interface ScoredQuestion {
  id: string;
  category: string;
  question_text: string;
  priority_level: number;
  target_focus_areas: string[];
  frequency_type: string;
  triggers?: {
    mood_threshold?: number;
    stress_threshold?: number;
    keywords?: string[];
  };
  variations?: string[];
  relevanceScore: number;
}
