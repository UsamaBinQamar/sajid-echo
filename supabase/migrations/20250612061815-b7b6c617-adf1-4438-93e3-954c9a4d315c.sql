
-- Add RLS policies for assessment_questions table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'assessment_questions' 
        AND policyname = 'Authenticated users can view assessment questions'
    ) THEN
        CREATE POLICY "Authenticated users can view assessment questions" 
          ON public.assessment_questions FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
END $$;

-- Add RLS policies for dialogue_scenarios table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'dialogue_scenarios' 
        AND policyname = 'Authenticated users can view dialogue scenarios'
    ) THEN
        CREATE POLICY "Authenticated users can view dialogue scenarios" 
          ON public.dialogue_scenarios FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
END $$;

-- Add RLS policies for subscription_tiers table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_tiers' 
        AND policyname = 'Authenticated users can view subscription tiers'
    ) THEN
        CREATE POLICY "Authenticated users can view subscription tiers" 
          ON public.subscription_tiers FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
END $$;

-- Add RLS policies for subscription_addons table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscription_addons' 
        AND policyname = 'Authenticated users can view subscription addons'
    ) THEN
        CREATE POLICY "Authenticated users can view subscription addons" 
          ON public.subscription_addons FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
END $$;

-- Add missing RLS policies for user_assessment_preferences table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_assessment_preferences' 
        AND policyname = 'Users can view their own assessment preferences'
    ) THEN
        CREATE POLICY "Users can view their own assessment preferences" 
          ON public.user_assessment_preferences FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_assessment_preferences' 
        AND policyname = 'Users can create their own assessment preferences'
    ) THEN
        CREATE POLICY "Users can create their own assessment preferences" 
          ON public.user_assessment_preferences FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_assessment_preferences' 
        AND policyname = 'Users can update their own assessment preferences'
    ) THEN
        CREATE POLICY "Users can update their own assessment preferences" 
          ON public.user_assessment_preferences FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add missing RLS policies for question_responses table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'question_responses' 
        AND policyname = 'Users can view their own question responses'
    ) THEN
        CREATE POLICY "Users can view their own question responses" 
          ON public.question_responses FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'question_responses' 
        AND policyname = 'Users can create their own question responses'
    ) THEN
        CREATE POLICY "Users can create their own question responses" 
          ON public.question_responses FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Add missing RLS policies for assessment_patterns table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'assessment_patterns' 
        AND policyname = 'Users can view their own assessment patterns'
    ) THEN
        CREATE POLICY "Users can view their own assessment patterns" 
          ON public.assessment_patterns FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'assessment_patterns' 
        AND policyname = 'Users can create their own assessment patterns'
    ) THEN
        CREATE POLICY "Users can create their own assessment patterns" 
          ON public.assessment_patterns FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'assessment_patterns' 
        AND policyname = 'Users can update their own assessment patterns'
    ) THEN
        CREATE POLICY "Users can update their own assessment patterns" 
          ON public.assessment_patterns FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
END $$;
