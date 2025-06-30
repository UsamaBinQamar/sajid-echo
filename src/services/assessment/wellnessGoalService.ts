
import { supabase } from "@/integrations/supabase/client";

export const wellnessGoalService = {
  async autoCompleteWellnessGoal(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Find the default wellness goal (daily check-in goal)
      const { data: defaultGoal } = await supabase
        .from('wellness_goals')
        .select('id')
        .eq('user_id', userId)
        .eq('title', 'Complete Daily Wellness Check-in')
        .eq('is_active', true)
        .maybeSingle();

      if (defaultGoal) {
        await supabase
          .from('daily_goal_progress')
          .upsert({
            user_id: userId,
            goal_id: defaultGoal.id,
            progress_date: today,
            completed: true
          });
      }
    } catch (error) {
      console.error('Error auto-completing wellness goal:', error);
    }
  }
};
