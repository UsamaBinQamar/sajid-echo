
import { useState } from 'react';
import { useDialogueApi } from './useDialogueApi';
import { useCoachingIntervention } from './useCoachingIntervention';
import { useCharacterState } from './useCharacterState';

interface DialogueExchange {
  id: string;
  exchange_number: number;
  user_response: string;
  ai_response: string;
  empathy_score: number;
  clarity_score: number;
  inclusion_score: number;
  tone_analysis: any;
  ai_emotional_state: any;
}

interface CoachingIntervention {
  id: string;
  intervention_type: string;
  intervention_content: string;
  exchange_number: number;
}

export const useDialogueSession = (sessionId: string, scenario: any) => {
  const [exchanges, setExchanges] = useState<DialogueExchange[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  // Use focused hooks for specific concerns
  const { isLoading, createExchange, generateAiResponse, analyzeUserResponse } = useDialogueApi(sessionId);
  const { checkForIntervention } = useCoachingIntervention(sessionId, scenario.title);
  const { aiCharacterState, updateCharacterBasedOnScore } = useCharacterState(scenario.character_persona);

  const handleSendMessage = async (onComplete: () => void) => {
    if (!currentResponse.trim() || isLoading) return;

    const exchangeNumber = exchanges.length + 1;

    try {
      // Generate AI response
      const aiResponse = await generateAiResponse(
        currentResponse,
        aiCharacterState,
        scenario.scenario_setup,
        exchangeNumber
      );
      
      if (!aiResponse) return null;
      
      // Analyze the user's response
      const analysis = await analyzeUserResponse(
        currentResponse,
        aiResponse,
        scenario.scenario_setup
      );
      
      if (!analysis) return null;
      
      // Create the exchange
      const exchangeData = await createExchange(
        exchangeNumber,
        currentResponse,
        aiResponse,
        analysis,
        aiCharacterState
      );

      if (!exchangeData) return null;

      setExchanges(prev => [...prev, exchangeData]);
      
      // Check for coaching intervention
      const intervention = await checkForIntervention(exchangeNumber, analysis);

      // Update AI character emotional state based on user response
      updateCharacterBasedOnScore(analysis.empathy_score);

      setCurrentResponse('');

      // Check if dialogue should end (after 6-8 exchanges)
      if (exchangeNumber >= 6) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }

      return intervention;

    } catch (error: any) {
      console.error('Error in handleSendMessage:', error);
      return null;
    }
  };

  return {
    exchanges,
    currentResponse,
    setCurrentResponse,
    isLoading,
    aiCharacterState,
    handleSendMessage
  };
};
