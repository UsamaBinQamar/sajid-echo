
-- Update Leadership Professional monthly price to $5.00 (500 cents) for beta testing
UPDATE subscription_tiers 
SET price_monthly = 500
WHERE slug = 'premium';
