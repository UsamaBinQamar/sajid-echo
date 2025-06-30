
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { EnhancedScenario } from '../types';

export const useScenarioData = () => {
  const [scenarios, setScenarios] = useState<EnhancedScenario[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScenariosWithProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get scenarios first
      const { data: scenariosData, error: scenariosError } = await supabase
        .from('dialogue_scenarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (scenariosError) {
        console.error('Error loading scenarios:', scenariosError);
        return;
      }

      // Get user progress data separately
      const { data: progressData } = await supabase
        .from('user_scenario_progress')
        .select('*')
        .eq('user_id', user.id);

      if (scenariosData) {
        const enhancedScenarios: EnhancedScenario[] = scenariosData.map(scenario => {
          // Find progress for this scenario
          const progress = progressData?.find(p => p.scenario_id === scenario.id);
          
          return {
            ...scenario,
            user_progress: progress ? {
              completion_count: progress.completion_count || 0,
              best_empathy_score: progress.best_empathy_score || 0,
              best_clarity_score: progress.best_clarity_score || 0,
              best_inclusion_score: progress.best_inclusion_score || 0,
              badges_earned: progress.badges_earned || []
            } : {
              completion_count: 0,
              best_empathy_score: 0,
              best_clarity_score: 0,
              best_inclusion_score: 0,
              badges_earned: []
            }
          };
        });
        
        setScenarios(enhancedScenarios);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScenariosWithProgress();
  }, []);

  return { scenarios, loading };
};
