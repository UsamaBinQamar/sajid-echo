
-- Create wellness goals table
CREATE TABLE public.wellness_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general', -- 'stress_management', 'work_life_balance', 'leadership_growth', 'general'
  target_type TEXT NOT NULL DEFAULT 'daily', -- 'daily', 'weekly', 'custom'
  target_count INTEGER DEFAULT 1,
  current_progress INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily goal progress tracking
CREATE TABLE public.daily_goal_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES public.wellness_goals(id) ON DELETE CASCADE,
  progress_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, goal_id, progress_date)
);

-- Enable RLS
ALTER TABLE public.wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goal_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for wellness_goals
CREATE POLICY "Users can view their own wellness goals" 
  ON public.wellness_goals FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own wellness goals" 
  ON public.wellness_goals FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own wellness goals" 
  ON public.wellness_goals FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own wellness goals" 
  ON public.wellness_goals FOR DELETE 
  USING (user_id = auth.uid());

-- RLS policies for daily_goal_progress
CREATE POLICY "Users can view their own goal progress" 
  ON public.daily_goal_progress FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own goal progress" 
  ON public.daily_goal_progress FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own goal progress" 
  ON public.daily_goal_progress FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own goal progress" 
  ON public.daily_goal_progress FOR DELETE 
  USING (user_id = auth.uid());

-- Insert default wellness goals for existing users
INSERT INTO public.wellness_goals (user_id, title, description, category, target_type, target_count)
SELECT 
  id as user_id,
  'Complete Daily Wellness Check-in' as title,
  'Stay consistent with daily mood and energy assessments' as description,
  'general' as category,
  'daily' as target_type,
  1 as target_count
FROM auth.users
WHERE id NOT IN (SELECT DISTINCT user_id FROM public.wellness_goals);
