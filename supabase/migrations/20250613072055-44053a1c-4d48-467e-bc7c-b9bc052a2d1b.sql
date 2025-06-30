
-- Fix RLS policies for assessment_questions to allow system-level question creation
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view questions" ON public.assessment_questions;

-- Create new policies that allow reading for authenticated users and system operations
CREATE POLICY "Anyone can view assessment questions" 
  ON public.assessment_questions 
  FOR SELECT 
  USING (true);

-- Allow system to insert questions (for dynamic question creation)
CREATE POLICY "System can insert assessment questions" 
  ON public.assessment_questions 
  FOR INSERT 
  WITH CHECK (true);

-- Allow system to update questions if needed
CREATE POLICY "System can update assessment questions" 
  ON public.assessment_questions 
  FOR UPDATE 
  USING (true);
