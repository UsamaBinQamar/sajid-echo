
-- Phase 1: Remove Organization RLS Policies and Secure Individual Features (Fixed)

-- Drop all organization-related RLS policies
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners and admins can update" ON public.organizations;
DROP POLICY IF EXISTS "Users can view members of their organization" ON public.organization_members;
DROP POLICY IF EXISTS "Admins can manage organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view their own membership" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view same organization members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can join organization" ON public.organization_members;
DROP POLICY IF EXISTS "Users can update their membership" ON public.organization_members;
DROP POLICY IF EXISTS "Users can leave organization" ON public.organization_members;
DROP POLICY IF EXISTS "Members can view team analytics" ON public.team_analytics;
DROP POLICY IF EXISTS "Members can view team challenges" ON public.team_challenges;
DROP POLICY IF EXISTS "Managers can create team challenges" ON public.team_challenges;
DROP POLICY IF EXISTS "Users can manage their own participation" ON public.team_challenge_participation;
DROP POLICY IF EXISTS "Admins can manage invitations" ON public.organization_invitations;

-- Disable RLS on organization tables to prevent any access
ALTER TABLE public.organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_challenge_participation DISABLE ROW LEVEL SECURITY;

-- Update profiles RLS policies to be individual-only (no organization dependencies)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create simple, individual-focused profile policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Ensure individual feature tables have proper RLS
ALTER TABLE public.wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_life_balance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Add missing individual feature policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'wellness_goals' 
        AND policyname = 'Users can manage their own wellness goals'
    ) THEN
        CREATE POLICY "Users can manage their own wellness goals" 
          ON public.wellness_goals FOR ALL 
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'work_life_balance_assessments' 
        AND policyname = 'Users can manage their own WLB assessments'
    ) THEN
        CREATE POLICY "Users can manage their own WLB assessments" 
          ON public.work_life_balance_assessments FOR ALL 
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal_entries' 
        AND policyname = 'Users can manage their own journal entries'
    ) THEN
        CREATE POLICY "Users can manage their own journal entries" 
          ON public.journal_entries FOR ALL 
          USING (auth.uid() = user_id)
          WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Remove organization-based triggers that might cause issues
DROP TRIGGER IF EXISTS update_team_analytics_trigger ON public.daily_checkins;

-- Update subscription tiers to remove team features temporarily
UPDATE public.subscription_tiers 
SET 
  team_features_enabled = false,
  features = jsonb_set(
    features - 'team_analytics' - 'manager_insights' - 'team_challenges' - 'burnout_alerts',
    '{individual_leadership_focus}', 
    'true'
  )
WHERE slug IN ('premium', 'team');
