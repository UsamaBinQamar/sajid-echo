
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AssessmentPreferences {
  focus_areas: string[];
  preferred_frequency: string;
  skip_weekends: boolean;
  max_daily_questions: number;
}

export const useAssessmentPreferences = () => {
  const [preferences, setPreferences] = useState<AssessmentPreferences>({
    focus_areas: [],
    preferred_frequency: 'adaptive',
    skip_weekends: false,
    max_daily_questions: 3
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileData, prefsData] = await Promise.all([
        supabase.from('profiles').select('focus_areas').eq('id', user.id).single(),
        supabase.from('user_assessment_preferences').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      setPreferences({
        focus_areas: profileData.data?.focus_areas || [],
        preferred_frequency: prefsData.data?.preferred_frequency || 'adaptive',
        skip_weekends: prefsData.data?.skip_weekends || false,
        max_daily_questions: prefsData.data?.max_daily_questions || 3
      });
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Partial<AssessmentPreferences>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updatedPreferences = { ...preferences, ...newPreferences };

      await Promise.all([
        supabase.from('profiles').update({ focus_areas: updatedPreferences.focus_areas }).eq('id', user.id),
        supabase.from('user_assessment_preferences').upsert({
          user_id: user.id,
          preferred_frequency: updatedPreferences.preferred_frequency,
          skip_weekends: updatedPreferences.skip_weekends,
          max_daily_questions: updatedPreferences.max_daily_questions,
          focus_areas_priority: updatedPreferences.focus_areas
        })
      ]);

      setPreferences(updatedPreferences);
      toast({
        title: "Preferences Updated! ✅",
        description: "Your assessment preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  return { preferences, loading, saving, savePreferences, refreshPreferences: loadPreferences };
};
