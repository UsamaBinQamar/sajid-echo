
import { supabase } from "@/integrations/supabase/client";
import { CoachingService } from "@/services/dialogue";

interface CoachingIntervention {
  id: string;
  intervention_type: string;
  intervention_content: string;
  exchange_number: number;
}

export const useCoachingIntervention = (sessionId: string, scenarioTitle: string) => {
  const checkForIntervention = async (
    exchangeNumber: number,
    scores: { empathy_score: number; clarity_score: number; inclusion_score: number }
  ): Promise<CoachingIntervention | null> => {
    
    // Use the service to determine if intervention is needed
    if (!CoachingService.shouldTriggerIntervention(exchangeNumber, scores)) {
      return null;
    }

    try {
      const interventionContent = await CoachingService.generateInterventionContent(
        scores,
        exchangeNumber,
        scenarioTitle
      );
      
      const { data, error } = await supabase
        .from('dialogue_coaching_interventions')
        .insert({
          session_id: sessionId,
          exchange_number: exchangeNumber,
          intervention_type: 'coaching_support',
          intervention_content: interventionContent
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving intervention:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error generating intervention:', error);
      return null;
    }
  };

  return {
    checkForIntervention
  };
};
