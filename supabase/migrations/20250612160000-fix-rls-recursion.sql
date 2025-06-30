
-- Fix RLS recursion by creating security definer functions

-- Drop existing problematic policies if they exist
DROP POLICY IF EXISTS "Users can view organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Members can view their organization" ON public.organization_members;

-- Create security definer function to check organization membership safely
CREATE OR REPLACE FUNCTION public.get_user_organization_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM public.profiles WHERE id = user_uuid LIMIT 1;
$$;

-- Create security definer function to check if user is organization member
CREATE OR REPLACE FUNCTION public.is_organization_member(user_uuid uuid, org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE user_id = user_uuid AND organization_id = org_id
  );
$$;

-- Create safe RLS policies for organization_members
CREATE POLICY "Users can view their own membership" 
  ON public.organization_members 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view same organization members" 
  ON public.organization_members 
  FOR SELECT 
  USING (
    organization_id = public.get_user_organization_id(auth.uid()) 
    AND public.get_user_organization_id(auth.uid()) IS NOT NULL
  );

-- Allow users to insert their own membership
CREATE POLICY "Users can join organization" 
  ON public.organization_members 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own membership
CREATE POLICY "Users can update their membership" 
  ON public.organization_members 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own membership
CREATE POLICY "Users can leave organization" 
  ON public.organization_members 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Ensure daily_checkins has simple, non-recursive RLS
DROP POLICY IF EXISTS "Users can view their own daily checkins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Users can create their own daily checkins" ON public.daily_checkins;
DROP POLICY IF EXISTS "Users can update their own daily checkins" ON public.daily_checkins;

-- Enable RLS on daily_checkins if not already enabled
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Create simple, safe policies for daily_checkins
CREATE POLICY "Users can view their own daily checkins" 
  ON public.daily_checkins 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily checkins" 
  ON public.daily_checkins 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily checkins" 
  ON public.daily_checkins 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure assessment-related tables have proper RLS
ALTER TABLE public.question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessment_preferences ENABLE ROW LEVEL SECURITY;

-- Fix any missing RLS policies for assessment tables
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

-- Add missing subscribers RLS policies
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscribers' 
        AND policyname = 'Users can view their own subscription'
    ) THEN
        CREATE POLICY "Users can view their own subscription" 
          ON public.subscribers FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscribers' 
        AND policyname = 'Service can manage subscriptions'
    ) THEN
        CREATE POLICY "Service can manage subscriptions" 
          ON public.subscribers FOR ALL 
          USING (true);
    END IF;
END $$;
