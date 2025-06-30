
-- Create question bank table with categories and targeting criteria
CREATE TABLE public.assessment_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  question_text text NOT NULL,
  emoji_options text[] NOT NULL,
  priority_level integer NOT NULL DEFAULT 1, -- 1=high, 2=medium, 3=low
  target_focus_areas text[] DEFAULT NULL, -- matches user focus areas
  frequency_type text NOT NULL DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user assessment preferences table
CREATE TABLE public.user_assessment_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  preferred_frequency text NOT NULL DEFAULT 'adaptive', -- 'daily', 'weekly', 'adaptive'
  max_daily_questions integer NOT NULL DEFAULT 3,
  focus_areas_priority text[] DEFAULT NULL,
  skip_weekends boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create question response tracking table
CREATE TABLE public.question_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  question_id uuid REFERENCES public.assessment_questions NOT NULL,
  response_score integer NOT NULL CHECK (response_score >= 1 AND response_score <= 5),
  response_notes text,
  assessment_session_id uuid, -- groups questions answered together
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create assessment patterns tracking table
CREATE TABLE public.assessment_patterns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  category text NOT NULL,
  avg_score numeric(3,2),
  trend_direction text, -- 'improving', 'declining', 'stable'
  last_low_score_date date,
  question_frequency integer DEFAULT 0, -- how often this category appears
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Enable RLS on all new tables
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_patterns ENABLE ROW LEVEL SECURITY;

-- RLS policies for assessment_questions (readable by all authenticated users)
CREATE POLICY "Authenticated users can view questions" 
  ON public.assessment_questions FOR SELECT 
  TO authenticated;

-- RLS policies for user_assessment_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_assessment_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_assessment_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_assessment_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for question_responses
CREATE POLICY "Users can view their own responses" 
  ON public.question_responses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own responses" 
  ON public.question_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for assessment_patterns
CREATE POLICY "Users can view their own patterns" 
  ON public.assessment_patterns FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own patterns" 
  ON public.assessment_patterns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns" 
  ON public.assessment_patterns FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert initial question bank
INSERT INTO public.assessment_questions (category, question_text, emoji_options, priority_level, target_focus_areas, frequency_type) VALUES
-- Sleep & Recovery
('sleep_recovery', 'How well did you sleep and feel recovered today?', ARRAY['😴', '😓', '😐', '😌', '✨'], 1, ARRAY['Energy Management', 'Health & Wellness'], 'daily'),
('sleep_recovery', 'Did you take adequate breaks and rest periods this week?', ARRAY['😰', '😕', '😐', '😊', '🧘'], 2, ARRAY['Energy Management', 'Work-Life Balance'], 'weekly'),

-- Social & Relationships
('social_relationships', 'How connected did you feel with family and friends today?', ARRAY['😔', '😕', '😐', '😊', '🥰'], 1, ARRAY['Relationships', 'Personal Relationships'], 'daily'),
('social_relationships', 'Have you maintained meaningful relationships this week?', ARRAY['💔', '😞', '😐', '😊', '💕'], 2, ARRAY['Relationships', 'Personal Relationships'], 'weekly'),

-- Health & Wellness
('health_wellness', 'How did you take care of your physical health today?', ARRAY['🤒', '😕', '😐', '💪', '🌟'], 1, ARRAY['Health & Wellness', 'Physical Health'], 'daily'),
('health_wellness', 'How well did you manage stress and mental wellness this week?', ARRAY['😰', '😬', '😐', '😌', '🧠'], 2, ARRAY['Mental Health', 'Stress Management'], 'weekly'),

-- Work Boundaries
('work_boundaries', 'How well did you maintain work-life boundaries today?', ARRAY['📱', '😓', '😐', '✋', '🏠'], 1, ARRAY['Work-Life Balance', 'Boundaries'], 'daily'),
('work_boundaries', 'Did you feel in control of your workload this week?', ARRAY['😵', '😰', '😐', '👍', '🎯'], 2, ARRAY['Time Management', 'Work-Life Balance'], 'weekly'),

-- Personal Growth
('personal_growth', 'Did you engage in activities that bring you joy today?', ARRAY['😑', '😕', '😐', '😊', '🎉'], 2, ARRAY['Personal Development', 'Self-Care'], 'daily'),
('personal_growth', 'How much progress did you make toward personal goals this week?', ARRAY['😞', '😕', '😐', '📈', '🎯'], 2, ARRAY['Personal Development', 'Goal Setting'], 'weekly'),

-- Financial Stress
('financial_stress', 'How much did financial concerns affect your peace of mind this week?', ARRAY['😰', '😟', '😐', '😌', '💰'], 3, ARRAY['Financial Planning', 'Stress Management'], 'weekly');

-- Create function to update assessment patterns
CREATE OR REPLACE FUNCTION update_assessment_patterns()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.assessment_patterns (user_id, category, avg_score, trend_direction, last_low_score_date, question_frequency)
  SELECT 
    NEW.user_id,
    aq.category,
    AVG(qr.response_score)::numeric(3,2),
    CASE 
      WHEN AVG(qr.response_score) < 3 THEN 'declining'
      WHEN AVG(qr.response_score) > 3.5 THEN 'improving'
      ELSE 'stable'
    END,
    CASE WHEN NEW.response_score < 3 THEN CURRENT_DATE ELSE NULL END,
    COUNT(*)
  FROM public.question_responses qr
  JOIN public.assessment_questions aq ON qr.question_id = aq.id
  WHERE qr.user_id = NEW.user_id AND aq.category = (
    SELECT category FROM public.assessment_questions WHERE id = NEW.question_id
  )
  GROUP BY NEW.user_id, aq.category
  ON CONFLICT (user_id, category) 
  DO UPDATE SET
    avg_score = EXCLUDED.avg_score,
    trend_direction = EXCLUDED.trend_direction,
    last_low_score_date = CASE 
      WHEN NEW.response_score < 3 THEN CURRENT_DATE 
      ELSE assessment_patterns.last_low_score_date 
    END,
    question_frequency = EXCLUDED.question_frequency,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update patterns when responses are added
CREATE TRIGGER update_patterns_trigger
  AFTER INSERT ON public.question_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_assessment_patterns();
