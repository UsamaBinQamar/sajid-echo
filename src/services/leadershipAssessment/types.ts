
export interface LeadershipAssessmentType {
  id: string;
  category: 'values_alignment' | 'emotional_energy' | 'authenticity' | 'boundaries_boldness' | 'voice_visibility' | 'bias_navigation';
  title: string;
  description: string;
  purpose: string;
  estimated_duration_minutes: number;
  frequency_type: string;
  is_active: boolean;
  question_config: QuestionConfig;
  created_at: string;
  updated_at: string;
}

export interface QuestionConfig {
  questions: AssessmentQuestion[];
  reflection_prompts: ReflectionPrompt[];
}

export interface AssessmentQuestion {
  key: string;
  type: 'likert' | 'slider' | 'text' | 'choice' | 'yes_no' | 'multiple_choice' | 'ranking' | 'action_commitment';
  text: string;
  scale?: number;
  min?: number;
  max?: number;
  emojis?: string[];
  options?: string[];
  multiple_select?: boolean;
  conditional?: string;
  question_config?: Record<string, any>;
}

export interface LeadershipQuestionBankItem {
  id: string;
  category: string;
  question_key: string;
  question_type: 'multiple_choice' | 'slider' | 'ranking' | 'action_commitment';
  question_text: string;
  question_config: {
    options?: string[];
    multiple_select?: boolean;
    min?: number;
    max?: number;
    emojis?: string[];
    type?: string;
    commitment_type?: string;
  };
  difficulty_level: number;
  focus_areas: string[];
  frequency_weight: number;
  prerequisites: string[];
  created_at: string;
  updated_at: string;
}

export interface UserLeadershipQuestionHistory {
  id: string;
  user_id: string;
  question_key: string;
  last_asked_at: string;
  times_asked: number;
  avg_response_score?: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ReflectionPrompt {
  key: string;
  text: string;
  trigger_conditions: TriggerCondition[];
  type: 'text' | 'choice';
  options?: string[];
}

export interface TriggerCondition {
  question_key: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface LeadershipAssessmentSession {
  id: string;
  user_id: string;
  assessment_type_id: string;
  started_at: string;
  completed_at?: string;
  status: 'in_progress' | 'reflection_phase' | 'completed' | 'abandoned';
  session_notes?: string;
  insights_generated?: AssessmentInsights;
  created_at: string;
}

export interface LeadershipAssessmentResponse {
  id: string;
  session_id: string;
  question_key: string;
  response_type: string;
  response_value: any;
  is_reflection?: boolean;
  created_at: string;
}

export interface AssessmentInsights {
  summary: string;
  strengths: string[];
  growth_areas: string[];
  recommendations: string[];
  patterns?: Record<string, any>;
  reflection_insights?: string[];
}
