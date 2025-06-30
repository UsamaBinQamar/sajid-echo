
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  target_type: string;
  target_count: number;
  current_progress: number;
  is_active: boolean;
  completed_at: string | null;
}

interface DailyGoalProgress {
  id: string;
  goal_id: string;
  progress_date: string;
  completed: boolean;
  notes: string | null;
}

interface CreateGoalData {
  title: string;
  description?: string;
  category: string;
  target_type: string;
  target_count: number;
}

export const useWellnessGoals = () => {
  const [goals, setGoals] = useState<WellnessGoal[]>([]);
  const [dailyProgress, setDailyProgress] = useState<DailyGoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGoalsAndProgress();
  }, []);

  const fetchGoalsAndProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const [goalsData, progressData] = await Promise.all([
        supabase
          .from('wellness_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('daily_goal_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('progress_date', today)
      ]);

      if (goalsData.data) setGoals(goalsData.data);
      if (progressData.data) setDailyProgress(progressData.data);
    } catch (error) {
      console.error('Error fetching wellness goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGoalCompletion = async (goalId: string, completed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      await supabase
        .from('daily_goal_progress')
        .upsert({
          user_id: user.id,
          goal_id: goalId,
          progress_date: today,
          completed
        });

      await fetchGoalsAndProgress();

      if (completed) {
        toast({
          title: "Goal Completed! 🎉",
          description: "Great job on completing your wellness goal today!",
        });
      }
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: "Error",
        description: "Failed to update goal progress",
        variant: "destructive",
      });
    }
  };

  const createGoal = async (goalData: CreateGoalData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('wellness_goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description || '',
          category: goalData.category,
          target_type: goalData.target_type,
          target_count: goalData.target_count
        });

      await fetchGoalsAndProgress();

      toast({
        title: "Goal Created!",
        description: "Your new wellness goal has been added.",
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    }
  };

  const isGoalCompleted = (goalId: string) => {
    return dailyProgress.some(p => p.goal_id === goalId && p.completed);
  };

  return {
    goals,
    loading,
    isGoalCompleted,
    toggleGoalCompletion,
    createGoal,
    refreshGoals: fetchGoalsAndProgress
  };
};
