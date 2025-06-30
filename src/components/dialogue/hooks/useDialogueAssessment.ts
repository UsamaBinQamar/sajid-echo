
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface Assessment {
  overall_empathy_score: number;
  overall_clarity_score: number;
  overall_inclusion_score: number;
  strengths: string[];
  improvement_areas: string[];
  journal_prompt: string;
  achievement_badges: string[];
  growth_insights: string;
}

export const useDialogueAssessment = (sessionId: string) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [sessionId]);

  const fetchAssessment = async () => {
    try {
      const { data, error } = await supabase
        .from('dialogue_assessments')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) throw error;
      setAssessment(data);
    } catch (error) {
      console.error('Error fetching assessment:', error);
    }
    setIsLoading(false);
  };

  const saveToJournal = async () => {
    if (!assessment) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('journal_entries').insert({
        user_id: user.id,
        title: 'Leadership Dialogue Reflection',
        content: `Reflection Prompt: ${assessment.journal_prompt}\n\nMy thoughts:\n\n`,
        entry_type: 'reflection',
        tags: ['leadership', 'dialogue', 'reflection']
      });

      return true;
    } catch (error) {
      console.error('Error saving to journal:', error);
      return false;
    }
  };

  return { assessment, isLoading, saveToJournal };
};
