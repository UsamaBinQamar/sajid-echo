
-- Update subscription tier names from Wellness to Leadership theme
UPDATE subscription_tiers 
SET name = 'Leadership Explorer' 
WHERE name = 'Wellness Explorer';

UPDATE subscription_tiers 
SET name = 'Leadership Professional' 
WHERE name = 'Wellness Professional';

UPDATE subscription_tiers 
SET name = 'Leadership Enterprise' 
WHERE name = 'Wellness Enterprise';
