
export interface SmartQuestion {
  id: string;
  type: 'mood' | 'stress' | 'energy' | 'work_life_balance' | 'multiple_choice' | 'slider' | 'ranking' | 'action_commitment';
  question: string;
  icon: string;
  emojis: string[];
  value: number | null;
  required: boolean;
  options?: string[];
  multiple_select?: boolean;
  min?: number;
  max?: number;
  config?: Record<string, any>;
  category?: string; // Add optional category property
}

export interface AssessmentResponses {
  [questionId: string]: number | string | string[] | Record<string, any>;
}
