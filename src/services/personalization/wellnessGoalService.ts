
import { supabase } from "@/integrations/supabase/client";

export const wellnessGoalService = {
  async autoCompleteWellnessGoal(userId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Auto-completing individual wellness goal for user:', userId);
      
      // Find the default individual wellness goal (daily check-in goal)
      const { data: defaultGoal, error: goalError } = await supabase
        .from('wellness_goals')
        .select('id')
        .eq('user_id', userId)
        .eq('title', 'Complete Daily Wellness Check-in')
        .eq('is_active', true)
        .maybeSingle();

      if (goalError) {
        console.error('Error finding individual wellness goal:', goalError);
        return;
      }

      if (defaultGoal) {
        console.log('Found individual wellness goal, updating progress:', defaultGoal.id);
        
        const { error: progressError } = await supabase
          .from('daily_goal_progress')
          .upsert({
            user_id: userId,
            goal_id: defaultGoal.id,
            progress_date: today,
            completed: true
          });

        if (progressError) {
          console.error('Error updating individual goal progress:', progressError);
        } else {
          console.log('Individual wellness goal progress updated successfully');
        }
      } else {
        console.log('No default individual wellness goal found for user, creating one...');
        
        // Create a default individual wellness goal
        const { data: newGoal, error: createError } = await supabase
          .from('wellness_goals')
          .insert({
            user_id: userId,
            title: 'Complete Daily Wellness Check-in',
            description: 'Check in with your mood, stress, and energy levels daily',
            category: 'wellness',
            target_type: 'daily',
            target_count: 1,
            is_active: true
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating individual wellness goal:', createError);
        } else {
          console.log('Created individual wellness goal:', newGoal.id);
          
          // Mark today as completed
          const { error: progressError } = await supabase
            .from('daily_goal_progress')
            .insert({
              user_id: userId,
              goal_id: newGoal.id,
              progress_date: today,
              completed: true
            });

          if (progressError) {
            console.error('Error updating new individual goal progress:', progressError);
          }
        }
      }
    } catch (error) {
      console.error('Error auto-completing individual wellness goal:', error);
    }
  }
};
