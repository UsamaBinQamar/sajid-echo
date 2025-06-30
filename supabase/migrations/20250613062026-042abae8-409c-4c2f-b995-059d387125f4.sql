
-- Create enum for leadership assessment categories
CREATE TYPE leadership_assessment_category AS ENUM (
  'values_alignment',
  'emotional_energy', 
  'authenticity',
  'boundaries_boldness',
  'voice_visibility',
  'bias_navigation'
);

-- Create table for leadership assessment types
CREATE TABLE public.leadership_assessment_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category leadership_assessment_category NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT NOT NULL,
  estimated_duration_minutes INTEGER NOT NULL DEFAULT 5,
  frequency_type TEXT NOT NULL DEFAULT 'weekly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  question_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for leadership assessment sessions
CREATE TABLE public.leadership_assessment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type_id UUID NOT NULL REFERENCES public.leadership_assessment_types(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  session_notes TEXT NULL,
  insights_generated JSONB NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for leadership assessment responses
CREATE TABLE public.leadership_assessment_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.leadership_assessment_sessions(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  response_type TEXT NOT NULL, -- 'likert', 'slider', 'text', 'choice', 'yes_no'
  response_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.leadership_assessment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_assessment_responses ENABLE ROW LEVEL SECURITY;

-- Policies for assessment types (readable by everyone)
CREATE POLICY "Anyone can view leadership assessment types" 
  ON public.leadership_assessment_types 
  FOR SELECT 
  USING (true);

-- Policies for sessions (users can only access their own)
CREATE POLICY "Users can view their own assessment sessions" 
  ON public.leadership_assessment_sessions 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own assessment sessions" 
  ON public.leadership_assessment_sessions 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own assessment sessions" 
  ON public.leadership_assessment_sessions 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Policies for responses (users can only access responses from their sessions)
CREATE POLICY "Users can view their own assessment responses" 
  ON public.leadership_assessment_responses 
  FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM public.leadership_assessment_sessions 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create responses for their own sessions" 
  ON public.leadership_assessment_responses 
  FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.leadership_assessment_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Insert the 6 leadership assessment types
INSERT INTO public.leadership_assessment_types (category, title, description, purpose, estimated_duration_minutes, frequency_type, question_config) VALUES
(
  'values_alignment',
  'Values-in-Action Self-Check',
  'Identify where your core values align with your leadership practices',
  'Helps users identify where their core values are aligned—or out of sync—with their current leadership practices.',
  7,
  'weekly',
  '{
    "questions": [
      {
        "key": "values_reflection_week",
        "type": "likert",
        "text": "How well did your actions reflect your core values this week?",
        "scale": 5
      },
      {
        "key": "most_present_value",
        "type": "text",
        "text": "Which value felt most present in your leadership this week?"
      },
      {
        "key": "neglected_value",
        "type": "text", 
        "text": "Which value felt most neglected or challenging to express?"
      }
    ]
  }'
),
(
  'emotional_energy',
  'Emotional Energy Snapshot',
  'Track emotional highs and drains across work, relationships, and self',
  'Tracks emotional highs and drains across work, relationships, and self.',
  6,
  'bi_weekly',
  '{
    "questions": [
      {
        "key": "work_energy",
        "type": "slider",
        "text": "Rate your energy in work situations this week",
        "min": 1,
        "max": 5,
        "emojis": ["😴", "😑", "😐", "😊", "⚡"]
      },
      {
        "key": "relationship_energy", 
        "type": "slider",
        "text": "Rate your energy in relationship interactions",
        "min": 1,
        "max": 5,
        "emojis": ["😴", "😑", "😐", "😊", "⚡"]
      },
      {
        "key": "self_care_energy",
        "type": "slider", 
        "text": "Rate your energy during self-care time",
        "min": 1,
        "max": 5,
        "emojis": ["😴", "😑", "😐", "😊", "⚡"]
      },
      {
        "key": "energy_restorer",
        "type": "text",
        "text": "What restored you most this week?"
      }
    ]
  }'
),
(
  'authenticity',
  'Authenticity Pulse Check', 
  'Reflect on how consistently you showed up as your full self',
  'Invites reflection on how consistently users showed up as their full selves.',
  5,
  'weekly',
  '{
    "questions": [
      {
        "key": "authentic_frequency",
        "type": "choice",
        "text": "How often did you feel you could be your authentic self this week?",
        "options": ["Never", "Rarely", "Sometimes", "Often", "Always"]
      },
      {
        "key": "most_authentic_moment",
        "type": "text",
        "text": "Describe a moment when you felt most authentic this week"
      },
      {
        "key": "held_back_situation",
        "type": "text",
        "text": "Where did you hold back from being fully yourself?"
      }
    ]
  }'
),
(
  'boundaries_boldness',
  'Boundaries & Boldness Inventory',
  'Reflect on boundary-setting and stretching yourself',
  'Encourages users to reflect on where they set boundaries or stretched themselves this week.',
  8,
  'bi_weekly',
  '{
    "questions": [
      {
        "key": "boundary_scenario",
        "type": "choice",
        "text": "When faced with unrealistic demands this week, you mostly:",
        "options": [
          "Said yes and felt overwhelmed", 
          "Said yes but negotiated terms",
          "Said no and suggested alternatives", 
          "Said no firmly without explanation",
          "Avoided the situation entirely"
        ]
      },
      {
        "key": "boundary_comfort",
        "type": "slider",
        "text": "Rate your comfort level with boundary-setting this week",
        "min": 1,
        "max": 5
      },
      {
        "key": "boldness_moment",
        "type": "text",
        "text": "Describe a moment when you stretched yourself or took a bold action"
      }
    ]
  }'
),
(
  'voice_visibility',
  'Voice & Visibility Meter',
  'Track how often you spoke up and influenced decisions',
  'Tracks how often users spoke up, led, or influenced decisions in their spaces.',
  6,
  'weekly',
  '{
    "questions": [
      {
        "key": "speaking_up_frequency",
        "type": "likert",
        "text": "How often did you speak up in meetings or group discussions?",
        "scale": 5
      },
      {
        "key": "influence_decisions",
        "type": "likert", 
        "text": "How often did your ideas shape a decision this week?",
        "scale": 5
      },
      {
        "key": "visibility_comfort",
        "type": "likert",
        "text": "How comfortable did you feel taking visible leadership roles?", 
        "scale": 5
      },
      {
        "key": "influence_example",
        "type": "text",
        "text": "Describe when your voice influenced a decision or outcome"
      }
    ]
  }'
),
(
  'bias_navigation',
  'Bias Navigation Reflection',
  'Reflect on identity, bias, and microagressions in leadership',
  'Offers a safe space to unpack moments where identity, bias, or microaggressions impacted their leadership experience.',
  10,
  'as_needed',
  '{
    "questions": [
      {
        "key": "identity_impact",
        "type": "yes_no",
        "text": "Did your identity impact a conversation or decision this week?"
      },
      {
        "key": "bias_navigation_story",
        "type": "text",
        "text": "If yes, how did you move through it? What strategies helped?",
        "conditional": "identity_impact === true"
      },
      {
        "key": "support_needed",
        "type": "text", 
        "text": "What support would help you navigate similar situations in the future?"
      }
    ]
  }'
);
