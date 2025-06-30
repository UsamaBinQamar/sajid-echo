import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { seedDialogueScenarios } from "@/services/dialogueScenarios";
import { useSimplifiedFiltering } from './hooks/useSimplifiedFiltering';
import { ScrollArea } from "@/components/ui/scroll-area";
import ScenarioGridHeader from './components/ScenarioGridHeader';
import SimplifiedScenarioFilters from './components/SimplifiedScenarioFilters';
import ScenarioGridContent from './components/ScenarioGridContent';
import ScenarioGridLoading from './components/ScenarioGridLoading';
import { EnhancedScenario } from './types';

interface EnhancedScenarioGridProps {
  onStartScenario: (scenarioId: string) => void;
}

const EnhancedScenarioGrid: React.FC<EnhancedScenarioGridProps> = ({ onStartScenario }) => {
  const [scenarios, setScenarios] = useState<EnhancedScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const {
    filteredScenarios,
    categoryFilter,
    setCategoryFilter,
    clearFilters,
    categories,
    scenarioCount,
    totalCount,
    filteredCount
  } = useSimplifiedFiltering({ scenarios });

  useEffect(() => {
    loadScenariosWithProgress();
  }, []);

  const loadScenariosWithProgress = async () => {
    try {
      setLoading(true);
      console.log('Loading scenarios with improved seeding process...');
      
      // Get current user (but don't require authentication)
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user?.id || 'not authenticated');

      // Always run the improved seeding process
      console.log('Running improved seeding process...');
      const seedResult = await seedDialogueScenarios();
      
      if (seedResult.success) {
        console.log('Seeding successful:', seedResult.data);
        
        // Load all scenarios after seeding
        const { data: scenariosData, error: scenariosError } = await supabase
          .from('dialogue_scenarios')
          .select('*')
          .order('created_at', { ascending: false });

        if (scenariosError) {
          console.error('Error loading scenarios after seeding:', scenariosError);
          toast({
            title: "Error loading scenarios",
            description: "Failed to load scenario data after seeding.",
            variant: "destructive",
          });
          return;
        }

        console.log('Scenarios loaded successfully:', scenariosData?.length || 0);
        
        if (scenariosData && scenariosData.length > 0) {
          const enhancedScenarios = await enhanceWithUserProgress(scenariosData, user?.id);
          setScenarios(enhancedScenarios);
          console.log('Enhanced scenarios ready:', enhancedScenarios.length);
          
          // Show success with detailed counts
          const totalScenarios = seedResult.data?.totalCount || enhancedScenarios.length;
          toast({
            title: "Scenarios loaded successfully",
            description: `${totalScenarios} leadership scenarios are ready for practice. Original: ${seedResult.data?.original?.length || 0}, Identity-aware: ${seedResult.data?.identityAware?.length || 0}`,
          });
        } else {
          console.warn('No scenarios found after seeding');
          toast({
            title: "No scenarios found",
            description: "Seeding completed but no scenarios were loaded.",
            variant: "destructive",
          });
        }
      } else {
        console.error('Seeding failed:', seedResult.error);
        
        // Try to load existing scenarios as fallback
        const { data: existingScenarios } = await supabase
          .from('dialogue_scenarios')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (existingScenarios && existingScenarios.length > 0) {
          const enhancedScenarios = await enhanceWithUserProgress(existingScenarios, user?.id);
          setScenarios(enhancedScenarios);
          
          toast({
            title: "Using existing scenarios",
            description: `Seeding had issues, but loaded ${enhancedScenarios.length} existing scenarios.`,
          });
        } else {
          toast({
            title: "Error loading scenarios",
            description: "Failed to seed or load scenarios.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error in loadScenariosWithProgress:', error);
      toast({
        title: "Error",
        description: "Failed to load scenarios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const enhanceWithUserProgress = async (scenariosData: any[], userId?: string): Promise<EnhancedScenario[]> => {
    console.log('Enhancing scenarios with user progress for user:', userId);
    
    let progressData: any[] = [];
    
    // Only fetch progress data if user is authenticated
    if (userId) {
      try {
        const { data } = await supabase
          .from('user_scenario_progress')
          .select('*')
          .eq('user_id', userId);
        
        progressData = data || [];
        console.log('User progress data loaded:', progressData.length);
      } catch (error) {
        console.error('Error loading user progress:', error);
        // Continue without progress data if there's an error
      }
    }

    const enhancedScenarios: EnhancedScenario[] = scenariosData.map(scenario => {
      // Ensure all required fields have safe defaults
      const safeScenario = {
        ...scenario,
        tags: scenario.tags || [],
        focus_areas: scenario.focus_areas || [],
        learning_objectives: scenario.learning_objectives || [],
        category: scenario.category || 'general',
        difficulty_level: scenario.difficulty_level || 1,
        emotional_intensity_level: scenario.emotional_intensity_level || 1,
        estimated_duration_minutes: scenario.estimated_duration_minutes || 15
      };

      // Find progress for this scenario
      const progress = progressData.find(p => p.scenario_id === scenario.id);
      
      return {
        ...safeScenario,
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
    
    console.log('Enhanced scenarios created:', enhancedScenarios.length);
    return enhancedScenarios;
  };

  if (loading) {
    return <ScenarioGridLoading />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 theme-transition">
      <ScenarioGridHeader />
      
      <div className="panel-ai p-4">
        <SimplifiedScenarioFilters
          scenarios={scenarios}
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          scenarioCount={scenarioCount}
          totalCount={totalCount}
          filteredCount={filteredCount}
          onSelectScenario={onStartScenario}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-380px)] panel-ai-scroll">
        <div className="p-4">
          <ScenarioGridContent
            filteredScenarios={filteredScenarios}
            onStartScenario={onStartScenario}
            loading={loading}
            onClearFilters={clearFilters}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnhancedScenarioGrid;
