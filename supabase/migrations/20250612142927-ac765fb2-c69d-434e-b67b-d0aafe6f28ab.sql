
-- Update subscription_tiers table to include voice recording limits
ALTER TABLE public.subscription_tiers 
ADD COLUMN max_voice_recordings_per_month integer DEFAULT -1,
ADD COLUMN max_voice_recording_duration_minutes integer DEFAULT 20;

-- Update existing subscription tiers with voice recording limits
-- Leadership Explorer (free tier) - 4 recordings per month, 5 minutes max
UPDATE public.subscription_tiers 
SET 
  voice_journal_enabled = true,
  max_voice_recordings_per_month = 4,
  max_voice_recording_duration_minutes = 5
WHERE slug = 'free';

-- Leadership Professional (premium tier) - daily recordings, 20 minutes max  
UPDATE public.subscription_tiers 
SET 
  max_voice_recordings_per_month = -1,
  max_voice_recording_duration_minutes = 20
WHERE slug = 'premium';

-- Leadership Enterprise (team tier) - daily recordings, 20 minutes max
UPDATE public.subscription_tiers 
SET 
  max_voice_recordings_per_month = -1,
  max_voice_recording_duration_minutes = 20
WHERE slug = 'team';

-- Create function to check voice recording limits
CREATE OR REPLACE FUNCTION public.can_create_voice_recording(user_uuid uuid)
RETURNS TABLE(
  can_record boolean,
  recordings_used integer,
  recordings_limit integer,
  max_duration_minutes integer,
  tier_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month_start DATE := date_trunc('month', CURRENT_DATE)::DATE;
  user_subscription RECORD;
  current_usage INTEGER := 0;
BEGIN
  -- Get user's subscription tier info
  SELECT 
    st.name,
    st.max_voice_recordings_per_month,
    st.max_voice_recording_duration_minutes,
    st.voice_journal_enabled
  INTO user_subscription
  FROM public.subscribers s
  JOIN public.subscription_tiers st ON s.subscription_tier_id = st.id
  WHERE s.user_id = user_uuid
  LIMIT 1;
  
  -- If no subscription found, use free tier defaults
  IF user_subscription IS NULL THEN
    SELECT 
      st.name,
      st.max_voice_recordings_per_month,
      st.max_voice_recording_duration_minutes,
      st.voice_journal_enabled
    INTO user_subscription
    FROM public.subscription_tiers st
    WHERE st.slug = 'free'
    LIMIT 1;
  END IF;
  
  -- Get current month's voice recording usage
  SELECT COALESCE(SUM(usage_count), 0) INTO current_usage
  FROM public.usage_tracking
  WHERE user_id = user_uuid 
    AND feature_type = 'voice_recording'
    AND period_start = current_month_start;
  
  -- Return the results
  RETURN QUERY SELECT
    CASE 
      WHEN user_subscription.max_voice_recordings_per_month = -1 THEN true
      WHEN current_usage < user_subscription.max_voice_recordings_per_month THEN true
      ELSE false
    END as can_record,
    current_usage as recordings_used,
    user_subscription.max_voice_recordings_per_month as recordings_limit,
    user_subscription.max_voice_recording_duration_minutes as max_duration_minutes,
    user_subscription.name as tier_name;
END;
$$;

-- Create function to track voice recording usage
CREATE OR REPLACE FUNCTION public.track_voice_recording_usage(user_uuid uuid, duration_seconds integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_period_start DATE := date_trunc('month', CURRENT_DATE)::DATE;
  current_period_end DATE := (date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day')::DATE;
BEGIN
  -- Track voice recording count
  INSERT INTO public.usage_tracking (user_id, feature_type, usage_count, period_start, period_end)
  VALUES (user_uuid, 'voice_recording', 1, current_period_start, current_period_end)
  ON CONFLICT (user_id, feature_type, period_start)
  DO UPDATE SET 
    usage_count = usage_tracking.usage_count + 1,
    updated_at = now();
    
  -- Track voice recording duration in minutes
  INSERT INTO public.usage_tracking (user_id, feature_type, usage_count, period_start, period_end)
  VALUES (user_uuid, 'voice_recording_duration', CEIL(duration_seconds / 60.0), current_period_start, current_period_end)
  ON CONFLICT (user_id, feature_type, period_start)
  DO UPDATE SET 
    usage_count = usage_tracking.usage_count + CEIL(duration_seconds / 60.0),
    updated_at = now();
END;
$$;
