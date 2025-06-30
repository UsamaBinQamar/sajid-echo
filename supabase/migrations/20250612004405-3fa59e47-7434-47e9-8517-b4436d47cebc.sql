
-- Create subscription tiers table to define available plans
CREATE TABLE public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  price_monthly INTEGER NOT NULL, -- Price in cents
  price_yearly INTEGER, -- Price in cents for yearly billing
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  max_assessments_per_week INTEGER,
  max_journal_entries_per_month INTEGER,
  ai_insights_enabled BOOLEAN DEFAULT false,
  team_features_enabled BOOLEAN DEFAULT false,
  advanced_analytics_enabled BOOLEAN DEFAULT false,
  voice_journal_enabled BOOLEAN DEFAULT false,
  export_data_enabled BOOLEAN DEFAULT false,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscribers table to track user subscriptions
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_tier_id UUID REFERENCES public.subscription_tiers(id),
  status TEXT NOT NULL DEFAULT 'inactive', -- active, inactive, cancelled, past_due
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Create subscription add-ons table
CREATE TABLE public.subscription_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly INTEGER NOT NULL, -- Price in cents
  stripe_price_id TEXT,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user add-ons junction table
CREATE TABLE public.user_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  addon_id UUID REFERENCES public.subscription_addons(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_item_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, addon_id)
);

-- Create usage tracking table
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature_type TEXT NOT NULL, -- 'assessments', 'journal_entries', 'ai_insights', etc.
  usage_count INTEGER DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_type, period_start)
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_tiers (public read access)
CREATE POLICY "Anyone can view subscription tiers" 
  ON public.subscription_tiers FOR SELECT 
  USING (true);

-- RLS policies for subscribers
CREATE POLICY "Users can view their own subscription" 
  ON public.subscribers FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscriptions" 
  ON public.subscribers FOR ALL 
  USING (true);

-- RLS policies for subscription_addons (public read access)
CREATE POLICY "Anyone can view subscription addons" 
  ON public.subscription_addons FOR SELECT 
  USING (true);

-- RLS policies for user_addons
CREATE POLICY "Users can view their own addons" 
  ON public.user_addons FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage user addons" 
  ON public.user_addons FOR ALL 
  USING (true);

-- RLS policies for usage_tracking
CREATE POLICY "Users can view their own usage" 
  ON public.usage_tracking FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage usage tracking" 
  ON public.usage_tracking FOR ALL 
  USING (true);

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, slug, price_monthly, price_yearly, max_assessments_per_week, max_journal_entries_per_month, ai_insights_enabled, team_features_enabled, advanced_analytics_enabled, voice_journal_enabled, export_data_enabled, features) VALUES
('Wellness Explorer', 'free', 0, 0, 3, 10, false, false, false, false, false, '{"basic_mood_checkins": true, "simple_journal": true, "limited_prompts": true, "basic_analytics_7_days": true, "community_read_only": true}'),
('Wellness Professional', 'premium', 1900, 19000, -1, -1, true, false, true, true, true, '{"unlimited_assessments": true, "ai_journal_insights": true, "personalized_prompts": true, "full_analytics": true, "ai_coaching": true, "voice_journal": true, "export_data": true, "priority_support": true}'),
('Wellness Enterprise', 'team', 9900, 99000, -1, -1, true, true, true, true, true, '{"all_premium_features": true, "team_analytics": true, "manager_insights": true, "burnout_alerts": true, "team_challenges": true, "predictive_analytics": true, "custom_programs": true, "sso_integration": true, "dedicated_support": true}');

-- Insert default add-ons
INSERT INTO public.subscription_addons (name, slug, description, price_monthly, features) VALUES
('AI Wellness Coach', 'ai-coach', '24/7 conversational AI wellness support with personalized action plans', 900, '{"ai_chat_support": true, "personalized_plans": true, "crisis_detection": true}'),
('Advanced Analytics Package', 'advanced-analytics', 'Predictive wellness modeling and correlation analysis', 500, '{"predictive_modeling": true, "correlation_analysis": true, "custom_reporting": true}'),
('Integration Hub', 'integrations', 'Connect with wearables and productivity apps', 700, '{"wearable_sync": true, "calendar_integration": true, "third_party_platforms": true}'),
('Professional Network', 'pro-network', 'Access to certified wellness coaches and consultations', 1200, '{"coach_access": true, "monthly_consultations": true, "wellness_curriculum": true}');

-- Function to get user subscription info
CREATE OR REPLACE FUNCTION public.get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  subscription_tier_name TEXT,
  subscription_status TEXT,
  features JSONB,
  addons JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(st.name, 'Wellness Explorer') as subscription_tier_name,
    COALESCE(s.status, 'inactive') as subscription_status,
    COALESCE(st.features, '{"basic_mood_checkins": true}'::jsonb) as features,
    COALESCE(
      (SELECT jsonb_agg(sa.features)
       FROM public.user_addons ua
       JOIN public.subscription_addons sa ON ua.addon_id = sa.id
       WHERE ua.user_id = user_uuid AND ua.status = 'active'),
      '[]'::jsonb
    ) as addons
  FROM public.subscribers s
  LEFT JOIN public.subscription_tiers st ON s.subscription_tier_id = st.id
  WHERE s.user_id = user_uuid
  
  UNION ALL
  
  SELECT 
    'Wellness Explorer' as subscription_tier_name,
    'active' as subscription_status,
    '{"basic_mood_checkins": true, "simple_journal": true, "limited_prompts": true, "basic_analytics_7_days": true, "community_read_only": true}'::jsonb as features,
    '[]'::jsonb as addons
  WHERE NOT EXISTS (SELECT 1 FROM public.subscribers WHERE user_id = user_uuid);
END;
$$;

-- Function to check feature access
CREATE OR REPLACE FUNCTION public.can_access_feature(user_uuid UUID, feature_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_features JSONB;
  addon_features JSONB;
BEGIN
  -- Get user's subscription features
  SELECT features INTO user_features
  FROM public.get_user_subscription(user_uuid)
  LIMIT 1;
  
  -- Check if feature exists in subscription
  IF user_features ? feature_name AND (user_features ->> feature_name)::boolean THEN
    RETURN true;
  END IF;
  
  -- Check add-ons for feature access
  SELECT jsonb_agg(sa.features) INTO addon_features
  FROM public.user_addons ua
  JOIN public.subscription_addons sa ON ua.addon_id = sa.id
  WHERE ua.user_id = user_uuid AND ua.status = 'active';
  
  IF addon_features IS NOT NULL THEN
    FOR i IN 0..jsonb_array_length(addon_features) - 1 LOOP
      IF (addon_features -> i) ? feature_name AND ((addon_features -> i) ->> feature_name)::boolean THEN
        RETURN true;
      END IF;
    END LOOP;
  END IF;
  
  RETURN false;
END;
$$;

-- Function to track feature usage
CREATE OR REPLACE FUNCTION public.track_usage(user_uuid UUID, feature_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_period_start DATE := date_trunc('month', CURRENT_DATE)::DATE;
  current_period_end DATE := (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::DATE;
BEGIN
  INSERT INTO public.usage_tracking (user_id, feature_type, usage_count, period_start, period_end)
  VALUES (user_uuid, feature_name, 1, current_period_start, current_period_end)
  ON CONFLICT (user_id, feature_type, period_start)
  DO UPDATE SET 
    usage_count = usage_tracking.usage_count + 1,
    updated_at = now();
END;
$$;
