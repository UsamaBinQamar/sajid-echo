
-- Create user profiles table for extended user information
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  pronouns text,
  leadership_role text,
  focus_areas text[], -- Array of selected focus areas
  onboarding_reflection text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text,
  content text NOT NULL,
  entry_type text NOT NULL DEFAULT 'text', -- 'text' or 'voice'
  audio_url text, -- For voice recordings
  tags text[],
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 5),
  ai_summary text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create daily check-ins table for mood and wellness tracking
CREATE TABLE public.daily_checkins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 5),
  energy_level integer CHECK (energy_level >= 1 AND energy_level <= 5),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- RLS policies for journal entries
CREATE POLICY "Users can view their own journal entries" 
  ON public.journal_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
  ON public.journal_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
  ON public.journal_entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
  ON public.journal_entries FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for daily check-ins
CREATE POLICY "Users can view their own daily check-ins" 
  ON public.daily_checkins FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own daily check-ins" 
  ON public.daily_checkins FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily check-ins" 
  ON public.daily_checkins FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
