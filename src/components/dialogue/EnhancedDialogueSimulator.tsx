
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import EnhancedScenarioGrid from './EnhancedScenarioGrid';
import DialogueResults from './DialogueResults';
import EnhancedActiveDialogue from './EnhancedActiveDialogue';

const EnhancedDialogueSimulator: React.FC = () => {
  const [currentView, setCurrentView] = useState<'scenarios' | 'active' | 'results'>('scenarios');
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const { toast } = useToast();

  const handleStartScenario = async (scenarioId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to start a dialogue session.",
          variant: "destructive",
        });
        return;
      }

      // Fetch the scenario data
      const { data: scenario, error: scenarioError } = await supabase
        .from('dialogue_scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (scenarioError || !scenario) {
        toast({
          title: "Error",
          description: "Failed to load scenario data.",
          variant: "destructive",
        });
        return;
      }

      // Create a new dialogue session
      const { data: session, error: sessionError } = await supabase
        .from('dialogue_sessions')
        .insert({
          user_id: user.id,
          scenario_id: scenarioId,
          status: 'active'
        })
        .select()
        .single();

      if (sessionError || !session) {
        toast({
          title: "Error",
          description: "Failed to create dialogue session.",
          variant: "destructive",
        });
        return;
      }

      setCurrentSession(session);
      setCurrentScenario(scenario);
      setCurrentView('active');
    } catch (error) {
      console.error('Error starting scenario:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteDialogue = () => {
    setCurrentView('results');
  };

  const handlePauseDialogue = () => {
    setCurrentView('scenarios');
    setCurrentSession(null);
    setCurrentScenario(null);
  };

  const handleReturnToScenarios = () => {
    setCurrentView('scenarios');
    setCurrentSession(null);
    setCurrentScenario(null);
  };

  if (currentView === 'results' && currentSession) {
    return (
      <DialogueResults 
        session={currentSession} 
        onReturnToScenarios={handleReturnToScenarios} 
      />
    );
  }

  if (currentView === 'active' && currentSession && currentScenario) {
    return (
      <EnhancedActiveDialogue 
        scenario={currentScenario}
        sessionId={currentSession.id}
        onComplete={handleCompleteDialogue}
        onPause={handlePauseDialogue}
      />
    );
  }

  return <EnhancedScenarioGrid onStartScenario={handleStartScenario} />;
};

export default EnhancedDialogueSimulator;
