
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { openAIService } from "@/services/ai/openAIService";

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

export const useDialogueApi = (sessionId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createExchange = async (
    exchangeNumber: number,
    userResponse: string,
    aiResponse: string,
    analysis: any,
    aiCharacterState: any
  ): Promise<DialogueExchange | null> => {
    try {
      const { data: exchangeData, error: exchangeError } = await supabase
        .from('dialogue_exchanges')
        .insert({
          session_id: sessionId,
          exchange_number: exchangeNumber,
          user_response: userResponse,
          ai_response: aiResponse,
          empathy_score: analysis.empathy_score,
          clarity_score: analysis.clarity_score,
          inclusion_score: analysis.inclusion_score,
          tone_analysis: analysis.tone_analysis,
          ai_emotional_state: aiCharacterState
        })
        .select()
        .single();

      if (exchangeError) throw exchangeError;
      return exchangeData;
    } catch (error: any) {
      toast({
        title: "Error saving exchange",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const generateAiResponse = async (
    userResponse: string,
    aiCharacterState: any,
    scenarioSetup: string,
    exchangeNumber: number
  ): Promise<string | null> => {
    try {
      setIsLoading(true);
      return await openAIService.generateDialogueResponse(
        userResponse,
        aiCharacterState,
        scenarioSetup,
        exchangeNumber
      );
    } catch (error: any) {
      toast({
        title: "Error generating AI response",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeUserResponse = async (
    userResponse: string,
    aiResponse: string,
    scenarioSetup: string
  ) => {
    try {
      return await openAIService.analyzeUserResponse(
        userResponse,
        aiResponse,
        scenarioSetup
      );
    } catch (error: any) {
      toast({
        title: "Error analyzing response",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isLoading,
    createExchange,
    generateAiResponse,
    analyzeUserResponse
  };
};
