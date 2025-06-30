
import { supabase } from "@/integrations/supabase/client";

export const dialogueRecommendationService = {
  async checkDialogueRecommendations(responses: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Analyze responses to suggest relevant dialogue scenarios
      const stressLevel = responses['stress'] || 3;
      const moodScore = responses['mood'] || 3;
      const energyLevel = responses['energy'] || 3;

      let recommendedCategories: string[] = [];

      // High stress -> suggest boundaries/burnout scenarios
      if (stressLevel >= 4) {
        recommendedCategories.push('boundaries_burnout');
      }

      // Low mood or energy -> suggest authentic leadership scenarios
      if (moodScore <= 2 || energyLevel <= 2) {
        recommendedCategories.push('authentic_leadership');
      }

      if (recommendedCategories.length > 0) {
        // Store recommendation for dashboard display
        await supabase
          .from('user_dialogue_preferences')
          .upsert({
            user_id: user.id,
            focus_areas_priority: recommendedCategories,
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error checking dialogue recommendations:', error);
    }
  }
};
