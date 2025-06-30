
-- Create organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization roles enum
CREATE TYPE public.organization_role AS ENUM ('owner', 'admin', 'manager', 'member');

-- Create organization members table
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role organization_role NOT NULL DEFAULT 'member',
  department TEXT,
  title TEXT,
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Create team analytics table for aggregated insights
CREATE TABLE public.team_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  department TEXT,
  analytics_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_members INTEGER NOT NULL DEFAULT 0,
  avg_mood_score NUMERIC(3,2),
  avg_stress_level NUMERIC(3,2),
  avg_energy_level NUMERIC(3,2),
  burnout_risk_count INTEGER DEFAULT 0,
  engagement_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, department, analytics_date)
);

-- Create team challenges table
CREATE TABLE public.team_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL DEFAULT 'wellness',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  target_departments TEXT[],
  goal_metrics JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team challenge participation table
CREATE TABLE public.team_challenge_participation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.team_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_data JSONB DEFAULT '{}',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Create organization invitations table
CREATE TABLE public.organization_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role organization_role NOT NULL DEFAULT 'member',
  department TEXT,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Add organization_id to profiles table
ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id);

-- Enable RLS on all new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_challenge_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners and admins can update" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for organization_members
CREATE POLICY "Users can view members of their organization" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage organization members" ON public.organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for team_analytics
CREATE POLICY "Members can view team analytics" ON public.team_analytics
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for team_challenges
CREATE POLICY "Members can view team challenges" ON public.team_challenges
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can create team challenges" ON public.team_challenges
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'manager')
    )
  );

-- RLS Policies for team_challenge_participation
CREATE POLICY "Users can manage their own participation" ON public.team_challenge_participation
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for organization_invitations
CREATE POLICY "Admins can manage invitations" ON public.organization_invitations
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Function to update team analytics automatically
CREATE OR REPLACE FUNCTION public.update_team_analytics()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update team analytics when daily check-ins are created/updated
  INSERT INTO public.team_analytics (
    organization_id, 
    department, 
    analytics_date,
    total_members,
    avg_mood_score,
    avg_stress_level,
    avg_energy_level
  )
  SELECT 
    p.organization_id,
    om.department,
    CURRENT_DATE,
    COUNT(DISTINCT dc.user_id),
    AVG(dc.mood_score),
    AVG(dc.stress_level),
    AVG(dc.energy_level)
  FROM public.daily_checkins dc
  JOIN public.profiles p ON dc.user_id = p.id
  JOIN public.organization_members om ON dc.user_id = om.user_id AND p.organization_id = om.organization_id
  WHERE dc.date = CURRENT_DATE 
    AND p.organization_id IS NOT NULL
  GROUP BY p.organization_id, om.department
  ON CONFLICT (organization_id, department, analytics_date)
  DO UPDATE SET
    total_members = EXCLUDED.total_members,
    avg_mood_score = EXCLUDED.avg_mood_score,
    avg_stress_level = EXCLUDED.avg_stress_level,
    avg_energy_level = EXCLUDED.avg_energy_level;
    
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for team analytics updates
CREATE TRIGGER update_team_analytics_trigger
  AFTER INSERT OR UPDATE ON public.daily_checkins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_analytics();
