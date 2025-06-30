
export interface AssessmentQuestion {
  id: string;
  category: string;
  question_text: string;
  emoji_options: string[];
  priority_level: number;
  target_focus_areas?: string[];
  frequency_type: string;
  relevanceScore?: number;
  personalizedScore?: number;
}

export interface UserPreferences {
  preferred_frequency: string;
  max_daily_questions: number;
  focus_areas_priority?: string[];
  skip_weekends?: boolean;
}

export interface QuestionResponse {
  question_id: string;
  response_score: number;
  response_notes?: string;
  assessment_session_id: string;
}

export interface AssessmentPattern {
  category: string;
  avg_score: number;
  trend_direction: 'declining' | 'improving' | 'stable';
  question_frequency: number;
}
