
-- Add is_reflection column to leadership_assessment_responses table
ALTER TABLE public.leadership_assessment_responses 
ADD COLUMN is_reflection BOOLEAN DEFAULT FALSE;

-- Create leadership_question_bank table
CREATE TABLE public.leadership_question_bank (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  question_key TEXT NOT NULL UNIQUE,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'slider', 'ranking', 'action_commitment'
  question_text TEXT NOT NULL,
  question_config JSONB NOT NULL DEFAULT '{}', -- stores options, scale, etc.
  difficulty_level INTEGER NOT NULL DEFAULT 1, -- 1-3 for progressive difficulty
  focus_areas TEXT[] DEFAULT '{}',
  frequency_weight INTEGER NOT NULL DEFAULT 1, -- higher = appears more often
  prerequisites TEXT[] DEFAULT '{}', -- question keys that should be completed first
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_leadership_question_bank_category ON public.leadership_question_bank(category);
CREATE INDEX idx_leadership_question_bank_difficulty ON public.leadership_question_bank(difficulty_level);

-- Create table to track user's question history
CREATE TABLE public.user_leadership_question_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  question_key TEXT NOT NULL,
  last_asked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  times_asked INTEGER NOT NULL DEFAULT 1,
  avg_response_score NUMERIC(3,2),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_key)
);

-- Add indexes
CREATE INDEX idx_user_leadership_question_history_user ON public.user_leadership_question_history(user_id);
CREATE INDEX idx_user_leadership_question_history_category ON public.user_leadership_question_history(user_id, category);

-- Enable RLS on new tables
ALTER TABLE public.leadership_question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_leadership_question_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for leadership_question_bank (readable by all authenticated users)
CREATE POLICY "Users can view leadership question bank" 
  ON public.leadership_question_bank 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- RLS policies for user_leadership_question_history (users can only see their own)
CREATE POLICY "Users can view their own question history" 
  ON public.user_leadership_question_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question history" 
  ON public.user_leadership_question_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own question history" 
  ON public.user_leadership_question_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert sample questions for each category
INSERT INTO public.leadership_question_bank (category, question_key, question_type, question_text, question_config, difficulty_level, focus_areas) VALUES

-- Values Alignment Questions
('values_alignment', 'values_decision_scenario_1', 'multiple_choice', 'You need to make a budget decision that affects your team. Your core value is fairness, but the most efficient solution would disadvantage one team member. What do you do?', '{"options": ["Choose efficiency despite the unfairness", "Find a middle ground that''s somewhat fair", "Prioritize fairness even if it''s less efficient", "Involve the team in the decision"], "multiple_select": false}', 1, '{"decision_making", "team_dynamics"}'),

('values_alignment', 'values_confidence_slider', 'slider', 'How confident are you in expressing your core values when they conflict with popular opinion?', '{"min": 1, "max": 5, "emojis": ["😰", "😟", "😐", "😊", "💪"]}', 1, '{"authenticity", "courage"}'),

('values_alignment', 'values_priority_ranking', 'ranking', 'Rank these values in order of importance to your leadership approach:', '{"options": ["Integrity", "Innovation", "Collaboration", "Results", "Growth"], "type": "ranking"}', 2, '{"self_awareness", "prioritization"}'),

('values_alignment', 'values_action_commitment', 'action_commitment', 'Choose one way you will demonstrate your core values this week:', '{"options": ["Have a values-based conversation with my team", "Make one decision using my values as the primary guide", "Share my values story with a colleague", "Reflect on a recent decision through my values lens"], "commitment_type": "weekly"}', 1, '{"action_planning", "accountability"}'),

-- Emotional Energy Questions  
('emotional_energy', 'energy_mapping_mc', 'multiple_choice', 'Which activities consistently drain your energy the most?', '{"options": ["Back-to-back meetings without breaks", "Difficult conversations I''ve been avoiding", "Administrative tasks that pile up", "Managing conflicts between team members"], "multiple_select": true}', 1, '{"self_awareness", "energy_management"}'),

('emotional_energy', 'energy_sustainability_slider', 'slider', 'How sustainable is your current energy management approach?', '{"min": 1, "max": 5, "emojis": ["🔋", "⚡", "😴", "💪", "🚀"]}', 1, '{"sustainability", "self_care"}'),

('emotional_energy', 'energy_boundary_scenario', 'multiple_choice', 'Your calendar is packed, but your manager asks you to take on an urgent project. Your energy is already at 70%. What do you do?', '{"options": ["Accept immediately to show commitment", "Negotiate the timeline or scope", "Suggest alternative solutions or people", "Decline and explain your capacity"], "multiple_select": false}', 2, '{"boundaries", "communication"}'),

('emotional_energy', 'energy_practice_commitment', 'action_commitment', 'Choose one energy management practice to implement this week:', '{"options": ["Take 3 five-minute mindfulness breaks daily", "Block 30 minutes for energy-giving activities", "Say no to one energy-draining request", "Schedule one difficult conversation I''ve been avoiding"], "commitment_type": "weekly"}', 1, '{"action_planning", "self_care"}'),

-- Authenticity Questions
('authenticity', 'authenticity_context_ranking', 'ranking', 'Rank these contexts from easiest to hardest for being your authentic self:', '{"options": ["One-on-one with direct reports", "Team meetings", "Meetings with senior leadership", "Cross-functional collaboration", "Public presentations"], "type": "ranking"}', 1, '{"self_awareness", "context_awareness"}'),

('authenticity', 'authenticity_confidence_slider', 'slider', 'How comfortable are you sharing your authentic perspective when it differs from the majority?', '{"min": 1, "max": 5, "emojis": ["😰", "😟", "😐", "😊", "💪"]}', 1, '{"courage", "voice"}'),

('authenticity', 'authenticity_conflict_scenario', 'multiple_choice', 'In a meeting, you strongly disagree with a popular decision, but you''re the only dissenting voice. You:', '{"options": ["Stay quiet to maintain harmony", "Express your concerns diplomatically", "Voice your disagreement clearly and directly", "Request a private follow-up conversation"], "multiple_select": false}', 2, '{"courage", "communication"}'),

('authenticity', 'authenticity_growth_commitment', 'action_commitment', 'Choose one way to practice authenticity this week:', '{"options": ["Share one genuine concern in a team meeting", "Have an honest conversation about my working style", "Express appreciation in my authentic way", "Ask for feedback on how I come across to others"], "commitment_type": "weekly"}', 1, '{"action_planning", "feedback"}'),

-- Boundaries & Boldness Questions
('boundaries_boldness', 'boundaries_response_scenario', 'multiple_choice', 'A colleague frequently interrupts you in meetings. Your boldest, most appropriate response would be:', '{"options": ["Continue as usual to avoid conflict", "Address it privately after the meeting", "Politely redirect in the moment", "Directly address the pattern in the meeting"], "multiple_select": false}', 2, '{"boundaries", "communication"}'),

('boundaries_boldness', 'boldness_comfort_slider', 'slider', 'How comfortable are you taking calculated risks that could advance your career?', '{"min": 1, "max": 5, "emojis": ["😰", "😟", "😐", "😊", "🚀"]}', 1, '{"risk_taking", "career_growth"}'),

('boundaries_boldness', 'boundaries_priority_ranking', 'ranking', 'Rank these boundary-setting scenarios from easiest to hardest for you:', '{"options": ["Saying no to additional work when overloaded", "Correcting someone who takes credit for your work", "Addressing inappropriate comments or behavior", "Negotiating for better resources or support", "Standing up for a team member"], "type": "ranking"}', 2, '{"boundaries", "difficulty_assessment"}'),

('boundaries_boldness', 'boldness_practice_commitment', 'action_commitment', 'Choose one boundary or bold action to practice this week:', '{"options": ["Say no to one non-essential request", "Speak up about one issue I''ve been quiet about", "Take on one stretch assignment or opportunity", "Have one difficult conversation I''ve been avoiding"], "commitment_type": "weekly"}', 1, '{"action_planning", "courage"}'),

-- Voice & Visibility Questions
('voice_visibility', 'voice_frequency_assessment', 'multiple_choice', 'In team meetings, how often do you contribute your ideas and perspectives?', '{"options": ["Rarely - I mostly listen", "Sometimes - when directly asked", "Often - I share when I have something valuable", "Always - I''m usually among the most vocal"], "multiple_select": false}', 1, '{"participation", "self_awareness"}'),

('voice_visibility', 'visibility_impact_slider', 'slider', 'How well do others understand the scope and impact of your contributions?', '{"min": 1, "max": 5, "emojis": ["🤐", "😐", "👀", "🌟", "💎"]}', 1, '{"visibility", "communication"}'),

('voice_visibility', 'voice_strategy_ranking', 'ranking', 'Rank these strategies for increasing your voice from most to least comfortable:', '{"options": ["Sharing wins in team meetings", "Writing thought leadership content", "Volunteering for high-visibility projects", "Speaking at company events", "Mentoring others publicly"], "type": "ranking"}', 2, '{"visibility_strategies", "comfort_zones"}'),

('voice_visibility', 'voice_commitment', 'action_commitment', 'Choose one way to amplify your voice this week:', '{"options": ["Share one key insight in a meeting", "Document and share one major accomplishment", "Volunteer to present on something I know well", "Start or contribute to one strategic conversation"], "commitment_type": "weekly"}', 1, '{"action_planning", "visibility"}'),

-- Bias Navigation Questions
('bias_navigation', 'bias_awareness_mc', 'multiple_choice', 'Which types of bias do you most commonly observe in your workplace?', '{"options": ["Confirmation bias in decision-making", "Affinity bias in hiring/promotion", "Attribution bias in performance evaluation", "Availability bias in problem-solving"], "multiple_select": true}', 1, '{"awareness", "observation"}'),

('bias_navigation', 'bias_strategy_slider', 'slider', 'How effective are you at addressing bias when you encounter it?', '{"min": 1, "max": 5, "emojis": ["😔", "😐", "🤔", "💪", "🎯"]}', 1, '{"effectiveness", "intervention"}'),

('bias_navigation', 'bias_response_scenario', 'multiple_choice', 'You notice a colleague consistently dismissing ideas from certain team members. Your best response is:', '{"options": ["Document the pattern but don''t intervene", "Speak privately with the dismissive colleague", "Actively amplify the dismissed voices in meetings", "Address the pattern directly in the moment"], "multiple_select": false}', 2, '{"intervention", "advocacy"}'),

('bias_navigation', 'bias_skill_commitment', 'action_commitment', 'Choose one bias navigation skill to practice this week:', '{"options": ["Notice and name one bias pattern I observe", "Amplify one underrepresented voice in meetings", "Ask one clarifying question to interrupt bias", "Research one bias intervention technique"], "commitment_type": "weekly"}', 1, '{"skill_building", "practice"}');
