
-- Add new fields to subscription_tiers table for beta pricing and availability
ALTER TABLE public.subscription_tiers 
ADD COLUMN beta_price_monthly integer,
ADD COLUMN is_available boolean DEFAULT true;

-- Update Leadership Explorer pricing to $1.99/month and $20/year
UPDATE public.subscription_tiers 
SET 
  price_monthly = 199,
  price_yearly = 2000
WHERE slug = 'free';

-- Update Leadership Professional pricing and add beta special
UPDATE public.subscription_tiers 
SET 
  price_monthly = 1999,
  price_yearly = 20000,
  beta_price_monthly = 500
WHERE slug = 'premium';

-- Mark Leadership Enterprise as coming soon (not available)
UPDATE public.subscription_tiers 
SET is_available = false
WHERE slug = 'team';

-- Also update the names to match the new branding
UPDATE public.subscription_tiers 
SET name = 'Leadership Explorer'
WHERE slug = 'free';

UPDATE public.subscription_tiers 
SET name = 'Leadership Professional'
WHERE slug = 'premium';

UPDATE public.subscription_tiers 
SET name = 'Leadership Enterprise'
WHERE slug = 'team';
