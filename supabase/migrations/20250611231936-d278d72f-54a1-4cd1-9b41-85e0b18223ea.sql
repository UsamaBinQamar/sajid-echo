
-- Create work_life_balance_assessments table
CREATE TABLE public.work_life_balance_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  question_1_score integer CHECK (question_1_score >= 1 AND question_1_score <= 5) NOT NULL,
  question_1_notes text,
  question_2_score integer CHECK (question_2_score >= 1 AND question_2_score <= 5) NOT NULL,
  question_2_notes text,
  question_3_score integer CHECK (question_3_score >= 1 AND question_3_score <= 5) NOT NULL,
  question_3_notes text,
  total_score integer NOT NULL,
  percentage integer NOT NULL,
  status_category text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, assessment_date)
);

-- Enable RLS on the table
ALTER TABLE public.work_life_balance_assessments ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_life_balance_assessments
CREATE POLICY "Users can view their own assessments" 
  ON public.work_life_balance_assessments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
  ON public.work_life_balance_assessments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.work_life_balance_assessments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments" 
  ON public.work_life_balance_assessments FOR DELETE 
  USING (auth.uid() = user_id);
