
-- Add preferred_name field to profiles table to store how users want to be addressed
ALTER TABLE public.profiles 
ADD COLUMN preferred_name text;
