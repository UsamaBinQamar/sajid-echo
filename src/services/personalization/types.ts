
export interface PersonalizationInsight {
  type: 'recommendation' | 'pattern' | 'contextual_trigger' | 'category_performance' | 'trend_analysis' | 'growth_recommendation';
  category: string;
  title?: string;
  message: string;
  confidence: number;
  suggested_questions?: string[];
  action_items?: string[];
  trend?: number;
}

export interface ContextualTrigger {
  trigger_type: 'journal_keyword' | 'mood_pattern' | 'response_pattern';
  condition: string;
  recommended_questions: string[];
  priority_boost: number;
}

export interface TimingRecommendation {
  preferredTime: string;
  confidence: number;
  reasoning: string;
}

export interface OptimalTimingRecommendation {
  type: 'optimal_timing';
  title: string;
  message: string;
  confidence: number;
  suggestedTime: number;
}

export interface AssessmentPattern {
  category: string;
  avg_score: number;
  trend_direction: 'declining' | 'improving' | 'stable';
  question_frequency: number;
}
