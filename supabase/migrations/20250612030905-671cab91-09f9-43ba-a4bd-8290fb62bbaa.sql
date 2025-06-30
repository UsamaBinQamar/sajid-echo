
-- Create dialogue scenarios table
CREATE TABLE public.dialogue_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL DEFAULT 1,
  learning_objectives TEXT[],
  cultural_context TEXT,
  power_dynamics TEXT,
  scenario_setup TEXT NOT NULL,
  character_persona JSONB NOT NULL,
  initial_situation TEXT NOT NULL,
  tags TEXT[],
  is_user_created BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dialogue sessions table
CREATE TABLE public.dialogue_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scenario_id UUID NOT NULL REFERENCES public.dialogue_scenarios(id),
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  final_scores JSONB,
  session_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dialogue exchanges table
CREATE TABLE public.dialogue_exchanges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.dialogue_sessions(id),
  exchange_number INTEGER NOT NULL,
  user_response TEXT NOT NULL,
  user_response_type TEXT NOT NULL DEFAULT 'text',
  ai_response TEXT NOT NULL,
  ai_emotional_state JSONB,
  tone_analysis JSONB,
  empathy_score NUMERIC(3,2),
  clarity_score NUMERIC(3,2),
  inclusion_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dialogue assessments table
CREATE TABLE public.dialogue_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.dialogue_sessions(id),
  overall_empathy_score NUMERIC(3,2) NOT NULL,
  overall_clarity_score NUMERIC(3,2) NOT NULL,
  overall_inclusion_score NUMERIC(3,2) NOT NULL,
  strengths TEXT[],
  improvement_areas TEXT[],
  journal_prompt TEXT,
  alternative_responses JSONB,
  growth_insights TEXT,
  achievement_badges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user scenario progress table
CREATE TABLE public.user_scenario_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scenario_id UUID NOT NULL REFERENCES public.dialogue_scenarios(id),
  completion_count INTEGER DEFAULT 0,
  best_empathy_score NUMERIC(3,2),
  best_clarity_score NUMERIC(3,2),
  best_inclusion_score NUMERIC(3,2),
  last_completed_at TIMESTAMP WITH TIME ZONE,
  badges_earned TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scenario_id)
);

-- Enable RLS on all tables
ALTER TABLE public.dialogue_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialogue_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialogue_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialogue_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scenario_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for dialogue_scenarios (public read, creator can modify user-created ones)
CREATE POLICY "Anyone can view dialogue scenarios" 
  ON public.dialogue_scenarios 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create scenarios" 
  ON public.dialogue_scenarios 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own scenarios" 
  ON public.dialogue_scenarios 
  FOR UPDATE 
  USING (auth.uid() = created_by AND is_user_created = true);

-- RLS Policies for dialogue_sessions
CREATE POLICY "Users can view their own dialogue sessions" 
  ON public.dialogue_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dialogue sessions" 
  ON public.dialogue_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dialogue sessions" 
  ON public.dialogue_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS Policies for dialogue_exchanges
CREATE POLICY "Users can view their own dialogue exchanges" 
  ON public.dialogue_exchanges 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.dialogue_sessions 
    WHERE dialogue_sessions.id = dialogue_exchanges.session_id 
    AND dialogue_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own dialogue exchanges" 
  ON public.dialogue_exchanges 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.dialogue_sessions 
    WHERE dialogue_sessions.id = dialogue_exchanges.session_id 
    AND dialogue_sessions.user_id = auth.uid()
  ));

-- RLS Policies for dialogue_assessments
CREATE POLICY "Users can view their own dialogue assessments" 
  ON public.dialogue_assessments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.dialogue_sessions 
    WHERE dialogue_sessions.id = dialogue_assessments.session_id 
    AND dialogue_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own dialogue assessments" 
  ON public.dialogue_assessments 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.dialogue_sessions 
    WHERE dialogue_sessions.id = dialogue_assessments.session_id 
    AND dialogue_sessions.user_id = auth.uid()
  ));

-- RLS Policies for user_scenario_progress
CREATE POLICY "Users can view their own scenario progress" 
  ON public.user_scenario_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scenario progress" 
  ON public.user_scenario_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scenario progress" 
  ON public.user_scenario_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert initial dialogue scenarios
INSERT INTO public.dialogue_scenarios (title, description, category, difficulty_level, learning_objectives, cultural_context, power_dynamics, scenario_setup, character_persona, initial_situation, tags) VALUES

-- Navigating Power, Identity & Politics scenarios
('Addressing Tokenism in Leadership', 'Navigate being asked to take on additional DEI work while managing your regular responsibilities', 'power_identity_politics', 2, ARRAY['Setting boundaries', 'Addressing systemic issues', 'Maintaining authenticity'], 'Being the only person of color in senior leadership', 'Power imbalance with supervisor expectations', 'You are in a leadership meeting when your supervisor suggests you lead the new diversity initiative "since you have that perspective."', '{"name": "Alex", "role": "Your supervisor", "personality": "Well-meaning but lacking awareness", "emotional_state": "Expectant and confident", "background": "Has been in leadership for 10+ years, genuinely wants to support diversity but lacks understanding of the burden this places on underrepresented leaders"}', 'Alex turns to you in the meeting: "I think you''d be perfect to head up our new diversity and inclusion committee. You really understand these issues in a way the rest of us don''t. What do you say?"', ARRAY['tokenism', 'boundaries', 'DEI', 'leadership']),

('Being Underestimated in Strategy Meetings', 'Practice asserting your expertise when colleagues dismiss your strategic insights', 'power_identity_politics', 3, ARRAY['Building influence', 'Strategic communication', 'Confidence building'], 'Youngest person and only woman in executive strategy meetings', 'Expertise questioned due to age and gender', 'In a quarterly strategy meeting, you present a well-researched market analysis, but your recommendations are immediately questioned.', '{"name": "Michael", "role": "Senior Director", "personality": "Dismissive, traditional leadership style", "emotional_state": "Skeptical and condescending", "background": "20 years of experience, set in traditional ways, often interrupts younger colleagues"}', 'After your presentation, Michael leans back and says: "That''s an interesting theory, but in my experience, the market doesn''t work that way. Maybe we should have Jennifer run some additional analysis before we consider this approach?"', ARRAY['credibility', 'expertise', 'strategy', 'influence']),

-- Authentic Leadership & Strategic Vulnerability scenarios
('Admitting a Major Mistake', 'Practice owning a significant error while maintaining team confidence in your leadership', 'authentic_leadership', 2, ARRAY['Accountability', 'Vulnerability', 'Trust building'], 'Mixed-generation team with varying expectations of leadership', 'Balancing accountability with authority', 'Your team discovers that a strategic decision you championed has resulted in significant budget overruns and project delays.', '{"name": "Sam", "role": "Team member", "personality": "Direct communicator, values transparency", "emotional_state": "Concerned and looking for answers", "background": "High performer who respects honest leadership but is worried about project impact"}', 'Sam approaches you after the team meeting: "I''m hearing rumors about the budget issues with the Morrison project. People are starting to panic. What''s really going on here?"', ARRAY['accountability', 'transparency', 'mistake', 'leadership']),

('Setting Boundaries with Compassion', 'Learn to say no to additional requests while maintaining relationships and team morale', 'authentic_leadership', 1, ARRAY['Boundary setting', 'Emotional intelligence', 'Team management'], 'High-performing team with burnout risks', 'Balancing team needs with organizational demands', 'Your star performer approaches you with yet another request to take on additional responsibilities during an already overwhelming quarter.', '{"name": "Jordan", "role": "High-performing team member", "personality": "Achievement-oriented, tends to overcommit", "emotional_state": "Eager but showing signs of stress", "background": "Consistently exceeds expectations but has been working excessive hours"}', 'Jordan stops by your office: "I know we''re all swamped, but I think I could also take on the client presentation for the Peterson account. I have some great ideas and I don''t want to miss this opportunity."', ARRAY['boundaries', 'burnout', 'delegation', 'wellness']);
