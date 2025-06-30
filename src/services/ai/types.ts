
export interface AIInsight {
  id: string;
  type: 'emotional' | 'behavioral' | 'physical' | 'social' | 'cognitive';
  category: string;
  message: string;
  confidence: number;
  actionable: boolean;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  timeframe: string;
  evidencePoints: string[];
  createdAt: Date;
}

export interface ContentRecommendation {
  id: string;
  type: 'prompt' | 'article' | 'exercise' | 'meditation' | 'challenge';
  title: string;
  content: string;
  description?: string;
  tags: string[];
  personalizedReason: string;
  estimatedDuration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  adaptiveContent?: boolean;
}

export interface BehaviorPrediction {
  predictionType: 'mood_decline' | 'stress_spike' | 'engagement_drop' | 'burnout_risk' | 'positive_trend';
  probability: number;
  timeframe: string;
  triggerFactors: string[];
  preventiveActions: string[];
  confidenceLevel: number;
  historicalAccuracy?: number;
}

export interface CoachingRecommendation {
  id: string;
  coachingType: 'motivational' | 'instructional' | 'supportive' | 'challenging' | 'emergency';
  message: string;
  tone: 'encouraging' | 'gentle' | 'direct' | 'empathetic' | 'celebratory';
  actionSteps: string[];
  followUpQuestions?: string[];
  resources?: string[];
  timingOptimal: boolean;
}

export interface ContextualTrigger {
  triggerId: string;
  triggerType: 'time_based' | 'location_based' | 'calendar_based' | 'weather_based' | 'social_based';
  condition: string;
  recommendation: string;
  priority: number;
  active: boolean;
}

export interface SentimentAnalysis {
  overallSentiment: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  emotionalTones: string[];
  stressIndicators: string[];
  positivityScore: number;
  concerningPhrases?: string[];
  themes: string[];
  emotionalTrend: 'improving' | 'stable' | 'declining';
}

export interface PersonalizedLearningPath {
  pathId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  milestones: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    content: ContentRecommendation[];
  }[];
  adaptiveElements: boolean;
  userProgress: number;
}
