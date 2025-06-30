
-- Fix RLS policies for assessment_questions table to allow reading
-- The error shows that users can't read assessment questions, which blocks the assessment flow

-- First, ensure assessment_questions can be read by authenticated users
DROP POLICY IF EXISTS "Authenticated users can view assessment questions" ON public.assessment_questions;
CREATE POLICY "Authenticated users can view assessment questions" 
  ON public.assessment_questions FOR SELECT 
  TO authenticated 
  USING (true);

-- Ensure question_responses has proper RLS policies for users to manage their own data
DROP POLICY IF EXISTS "Users can view their own question responses" ON public.question_responses;
CREATE POLICY "Users can view their own question responses" 
  ON public.question_responses FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own question responses" ON public.question_responses;
CREATE POLICY "Users can create their own question responses" 
  ON public.question_responses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own question responses" ON public.question_responses;
CREATE POLICY "Users can update their own question responses" 
  ON public.question_responses FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure assessment_patterns has proper RLS policies
DROP POLICY IF EXISTS "Users can view their own assessment patterns" ON public.assessment_patterns;
CREATE POLICY "Users can view their own assessment patterns" 
  ON public.assessment_patterns FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own assessment patterns" ON public.assessment_patterns;
CREATE POLICY "Users can create their own assessment patterns" 
  ON public.assessment_patterns FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own assessment patterns" ON public.assessment_patterns;
CREATE POLICY "Users can update their own assessment patterns" 
  ON public.assessment_patterns FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on all required tables
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_preferences ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for daily_checkins
DROP POLICY IF EXISTS "Users can view their own daily checkins" ON public.daily_checkins;
CREATE POLICY "Users can view their own daily checkins" 
  ON public.daily_checkins FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own daily checkins" ON public.daily_checkins;
CREATE POLICY "Users can create their own daily checkins" 
  ON public.daily_checkins FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own daily checkins" ON public.daily_checkins;
CREATE POLICY "Users can update their own daily checkins" 
  ON public.daily_checkins FOR UPDATE 
  USING (auth.uid() = user_id);
