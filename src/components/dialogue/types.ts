
export interface EnhancedScenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  character_persona: any;
  initial_situation: string;
  scenario_setup: string;
  cultural_context: string | null;
  power_dynamics: string | null;
  learning_objectives: string[];
  tags: string[];
  therapeutic_context: string | null;
  preparation_guidance: string | null;
  trigger_warnings: string[] | null;
  focus_areas: string[] | null;
  emotional_intensity_level: number;
  estimated_duration_minutes: number;
  cultural_sensitivity_notes: string | null;
  prerequisite_scenarios: string[] | null;
  created_at: string;
  created_by: string | null;
  user_progress?: {
    completion_count: number;
    best_empathy_score: number;
    best_clarity_score: number;
    best_inclusion_score: number;
    badges_earned: string[];
  };
}

export interface ScenarioGridProps {
  onStartScenario: (scenarioId: string) => void;
}
