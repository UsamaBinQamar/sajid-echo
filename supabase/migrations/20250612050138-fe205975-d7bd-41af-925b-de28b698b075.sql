
-- Add dialogue_simulator_enabled column to subscription_tiers table
ALTER TABLE public.subscription_tiers 
ADD COLUMN dialogue_simulator_enabled boolean DEFAULT false;

-- Update existing subscription tiers with the new feature flag
-- Leadership Explorer (free tier) - disable dialogue simulator
UPDATE public.subscription_tiers 
SET dialogue_simulator_enabled = false 
WHERE slug = 'free';

-- Leadership Professional (premium tier) - enable dialogue simulator
UPDATE public.subscription_tiers 
SET dialogue_simulator_enabled = true 
WHERE slug = 'premium';

-- Leadership Enterprise (team tier) - enable dialogue simulator
UPDATE public.subscription_tiers 
SET dialogue_simulator_enabled = true 
WHERE slug = 'team';

-- Also update the features JSON to include the new feature
UPDATE public.subscription_tiers 
SET features = jsonb_set(
  COALESCE(features, '{}'),
  '{dialogue_simulator}',
  'false'
)
WHERE slug = 'free';

UPDATE public.subscription_tiers 
SET features = jsonb_set(
  COALESCE(features, '{}'),
  '{dialogue_simulator}',
  'true'
)
WHERE slug = 'premium';

UPDATE public.subscription_tiers 
SET features = jsonb_set(
  COALESCE(features, '{}'),
  '{dialogue_simulator}',
  'true'
)
WHERE slug = 'team';
