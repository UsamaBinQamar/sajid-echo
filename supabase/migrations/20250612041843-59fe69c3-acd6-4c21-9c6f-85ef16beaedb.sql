
-- Enhance dialogue_scenarios table with therapeutic context and better categorization
ALTER TABLE dialogue_scenarios 
ADD COLUMN therapeutic_context TEXT,
ADD COLUMN preparation_guidance TEXT,
ADD COLUMN trigger_warnings TEXT[],
ADD COLUMN focus_areas TEXT[],
ADD COLUMN cultural_sensitivity_notes TEXT,
ADD COLUMN emotional_intensity_level INTEGER DEFAULT 1 CHECK (emotional_intensity_level BETWEEN 1 AND 5),
ADD COLUMN prerequisite_scenarios UUID[],
ADD COLUMN estimated_duration_minutes INTEGER DEFAULT 15;

-- Create user dialogue preferences table
CREATE TABLE user_dialogue_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  preferred_emotional_intensity INTEGER DEFAULT 3 CHECK (preferred_emotional_intensity BETWEEN 1 AND 5),
  focus_areas_priority TEXT[],
  trigger_content_to_avoid TEXT[],
  cultural_background_notes TEXT,
  leadership_experience_level TEXT DEFAULT 'intermediate',
  current_challenges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dialogue coaching interventions table
CREATE TABLE dialogue_coaching_interventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  exchange_number INTEGER NOT NULL,
  intervention_type TEXT NOT NULL,
  intervention_content TEXT NOT NULL,
  user_response TEXT,
  was_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update existing user_scenario_progress table structure if needed
DROP TABLE IF EXISTS user_scenario_progress CASCADE;
CREATE TABLE user_scenario_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scenario_id UUID NOT NULL,
  completion_count INTEGER DEFAULT 0,
  best_empathy_score NUMERIC(3,2),
  best_clarity_score NUMERIC(3,2),
  best_inclusion_score NUMERIC(3,2),
  last_completed_at TIMESTAMP WITH TIME ZONE,
  badges_earned TEXT[],
  emotional_growth_notes TEXT,
  key_insights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scenario_id)
);

-- Add RLS policies for new tables
ALTER TABLE user_dialogue_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialogue_coaching_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_scenario_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own dialogue preferences" 
  ON user_dialogue_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view coaching interventions for their sessions" 
  ON dialogue_coaching_interventions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM dialogue_sessions ds 
      WHERE ds.id = session_id AND ds.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert coaching interventions" 
  ON dialogue_coaching_interventions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view their own scenario progress" 
  ON user_scenario_progress 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Insert enhanced scenarios with proper array syntax
INSERT INTO dialogue_scenarios (
  title,
  description,
  category,
  difficulty_level,
  character_persona,
  initial_situation,
  scenario_setup,
  cultural_context,
  power_dynamics,
  learning_objectives,
  tags,
  therapeutic_context,
  preparation_guidance,
  trigger_warnings,
  focus_areas,
  emotional_intensity_level,
  estimated_duration_minutes
) VALUES 
(
  'You Think You''re Better Than Us Now',
  'Navigate class shifts, survivor''s guilt, and family tension when a sibling comments on your changes since becoming a leader.',
  'power_identity_politics',
  2,
  '{
    "name": "Alex (Sibling)",
    "role": "Family member",
    "personality": "Defensive, feels left behind, uses humor to mask hurt",
    "emotional_state": "Insecure but trying to appear casual",
    "background": "Works blue-collar job, feels you have become distant since promotion"
  }'::jsonb,
  'You know what? Ever since you got that fancy job, you talk all proper now. Remember when you used to be normal like the rest of us?',
  'You are at a family gathering celebrating your cousin''s birthday. You have recently accepted a new leadership role and feel proud but also somewhat different in how you speak and carry yourself. Your sibling Alex makes this comment in front of other family members, and you feel the familiar sting of not belonging fully anywhere.',
  'Working-class family dynamics, first-generation professional challenges, code-switching pressures',
  'Sibling rivalry mixed with class consciousness, fear of abandonment vs. individual growth',
  ARRAY['Practice identity integration without shame', 'Develop compassionate responses to family judgment', 'Learn to honor growth while maintaining authentic connections', 'Build skills in addressing survivor guilt'],
  ARRAY['family_dynamics', 'class_mobility', 'code_switching', 'identity_work'],
  'This scenario explores the complex emotions around upward mobility and family relationships. Users may experience guilt, shame, or defensive reactions.',
  'Before beginning, reflect on your own experiences with changing social contexts. Consider: What parts of your identity feel most authentic? How do you want to show up with family while honoring your growth?',
  ARRAY['classism', 'family_conflict', 'identity_shame'],
  ARRAY['identity_integration', 'code_switching', 'self_trust', 'compassion'],
  3,
  20
),
(
  'You''re Always Working',
  'Balance ambition and emotional presence when your partner feels neglected by your career focus.',
  'boundaries_burnout',
  2,
  '{
    "name": "Jordan (Partner)",
    "role": "Romantic partner",
    "personality": "Emotionally expressive, values connection, feeling neglected",
    "emotional_state": "Hurt and seeking reassurance but also frustrated",
    "background": "Supportive of your career but feeling increasingly distant from you"
  }'::jsonb,
  'I feel like I am dating your job instead of you. You are always checking emails, taking calls, or thinking about work. I need to know I matter too.',
  'You have been working late frequently due to a major project launch. Your partner Jordan has been patient, but tonight they have expressed feeling like they come second to your career. You know your work is meaningful and demanding, but you also deeply value your relationship.',
  'Modern relationship dynamics, career-driven individuals, work-life integration challenges',
  'Balancing individual ambition with relational needs, managing guilt about professional dedication',
  ARRAY['Practice vulnerability without over-explaining', 'Learn to acknowledge impact without minimizing career importance', 'Develop skills in relational equity and presence', 'Build capacity for emotional regulation under pressure'],
  ARRAY['relationships', 'work_life_balance', 'boundaries', 'emotional_presence'],
  'This scenario addresses the tension between professional ambition and intimate relationships, requiring vulnerability and boundary-setting skills.',
  'Consider your values around work and relationships. Reflect on: How do you want to show up in your relationship? What boundaries support both your career and your partnership?',
  ARRAY['relationship_conflict', 'work_stress', 'guilt_and_shame'],
  ARRAY['boundaries', 'vulnerability', 'relational_equity', 'emotional_regulation'],
  3,
  18
),
(
  'Your Job is Making You Cold',
  'Address concerns about emotional distance after navigating workplace microaggressions and DEI fatigue.',
  'authentic_leadership',
  3,
  '{
    "name": "Casey (Close Friend)",
    "role": "Long-time friend",
    "personality": "Direct, caring, notices changes in people",
    "emotional_state": "Concerned but unsure how to help",
    "background": "Has known you before your leadership role, notices you seem different lately"
  }'::jsonb,
  'I am worried about you. You have been really distant and intense lately. It is like your job is making you cold or something. You do not seem like yourself.',
  'You have had a particularly challenging week at work dealing with multiple microaggressions, leading difficult DEI conversations, and managing team conflict. You came to dinner with Casey feeling emotionally spent and have been quieter than usual. They have noticed the change and are expressing concern.',
  'Workplace racial dynamics, emotional labor for marginalized leaders, friendship maintenance under stress',
  'Managing emotional burden of representation, maintaining authentic relationships while protecting energy',
  ARRAY['Practice sharing emotional reality without over-explaining', 'Learn to advocate for emotional needs', 'Develop skills in boundary communication with friends', 'Build capacity for vulnerability about workplace impact'],
  ARRAY['emotional_burden', 'microaggressions', 'friendship_maintenance', 'authenticity'],
  'This scenario explores how workplace discrimination affects personal relationships and the challenge of maintaining emotional availability.',
  'Reflect on how workplace stress affects your personal relationships. Consider: How do you want to share your experiences? What support do you need from friends?',
  ARRAY['workplace_discrimination', 'emotional_exhaustion', 'relationship_strain'],
  ARRAY['burnout_recognition', 'emotion_coaching', 'storytelling', 'boundary_softening'],
  4,
  22
);
