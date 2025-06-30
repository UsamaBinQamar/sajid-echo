export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_patterns: {
        Row: {
          avg_score: number | null
          category: string
          created_at: string
          id: string
          last_low_score_date: string | null
          question_frequency: number | null
          trend_direction: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_score?: number | null
          category: string
          created_at?: string
          id?: string
          last_low_score_date?: string | null
          question_frequency?: number | null
          trend_direction?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_score?: number | null
          category?: string
          created_at?: string
          id?: string
          last_low_score_date?: string | null
          question_frequency?: number | null
          trend_direction?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          category: string
          created_at: string
          emoji_options: string[]
          frequency_type: string
          id: string
          priority_level: number
          question_text: string
          target_focus_areas: string[] | null
        }
        Insert: {
          category: string
          created_at?: string
          emoji_options: string[]
          frequency_type?: string
          id?: string
          priority_level?: number
          question_text: string
          target_focus_areas?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string
          emoji_options?: string[]
          frequency_type?: string
          id?: string
          priority_level?: number
          question_text?: string
          target_focus_areas?: string[] | null
        }
        Relationships: []
      }
      customer_deals: {
        Row: {
          closed_at: string | null
          created_at: string
          customer_id: string
          description: string | null
          expected_close_date: string | null
          id: string
          probability: number | null
          stage: string | null
          title: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: string | null
          title: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          expected_close_date?: string | null
          id?: string
          probability?: number | null
          stage?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_deals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_interactions: {
        Row: {
          completed_at: string | null
          content: string
          created_at: string
          customer_id: string
          id: string
          scheduled_at: string | null
          subject: string | null
          type: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content: string
          created_at?: string
          customer_id: string
          id?: string
          scheduled_at?: string | null
          subject?: string | null
          type: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content?: string
          created_at?: string
          customer_id?: string
          id?: string
          scheduled_at?: string | null
          subject?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          phone: string | null
          position: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_checkins: {
        Row: {
          created_at: string
          date: string
          energy_level: number | null
          id: string
          mood_score: number | null
          notes: string | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_goal_progress: {
        Row: {
          completed: boolean | null
          created_at: string
          goal_id: string
          id: string
          notes: string | null
          progress_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          goal_id: string
          id?: string
          notes?: string | null
          progress_date?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          goal_id?: string
          id?: string
          notes?: string | null
          progress_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_goal_progress_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "wellness_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      dialogue_assessments: {
        Row: {
          achievement_badges: string[] | null
          alternative_responses: Json | null
          created_at: string
          growth_insights: string | null
          id: string
          improvement_areas: string[] | null
          journal_prompt: string | null
          overall_clarity_score: number
          overall_empathy_score: number
          overall_inclusion_score: number
          session_id: string
          strengths: string[] | null
        }
        Insert: {
          achievement_badges?: string[] | null
          alternative_responses?: Json | null
          created_at?: string
          growth_insights?: string | null
          id?: string
          improvement_areas?: string[] | null
          journal_prompt?: string | null
          overall_clarity_score: number
          overall_empathy_score: number
          overall_inclusion_score: number
          session_id: string
          strengths?: string[] | null
        }
        Update: {
          achievement_badges?: string[] | null
          alternative_responses?: Json | null
          created_at?: string
          growth_insights?: string | null
          id?: string
          improvement_areas?: string[] | null
          journal_prompt?: string | null
          overall_clarity_score?: number
          overall_empathy_score?: number
          overall_inclusion_score?: number
          session_id?: string
          strengths?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "dialogue_assessments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "dialogue_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      dialogue_coaching_interventions: {
        Row: {
          created_at: string
          exchange_number: number
          id: string
          intervention_content: string
          intervention_type: string
          session_id: string
          user_response: string | null
          was_helpful: boolean | null
        }
        Insert: {
          created_at?: string
          exchange_number: number
          id?: string
          intervention_content: string
          intervention_type: string
          session_id: string
          user_response?: string | null
          was_helpful?: boolean | null
        }
        Update: {
          created_at?: string
          exchange_number?: number
          id?: string
          intervention_content?: string
          intervention_type?: string
          session_id?: string
          user_response?: string | null
          was_helpful?: boolean | null
        }
        Relationships: []
      }
      dialogue_exchanges: {
        Row: {
          ai_emotional_state: Json | null
          ai_response: string
          clarity_score: number | null
          created_at: string
          empathy_score: number | null
          exchange_number: number
          id: string
          inclusion_score: number | null
          session_id: string
          tone_analysis: Json | null
          user_response: string
          user_response_type: string
        }
        Insert: {
          ai_emotional_state?: Json | null
          ai_response: string
          clarity_score?: number | null
          created_at?: string
          empathy_score?: number | null
          exchange_number: number
          id?: string
          inclusion_score?: number | null
          session_id: string
          tone_analysis?: Json | null
          user_response: string
          user_response_type?: string
        }
        Update: {
          ai_emotional_state?: Json | null
          ai_response?: string
          clarity_score?: number | null
          created_at?: string
          empathy_score?: number | null
          exchange_number?: number
          id?: string
          inclusion_score?: number | null
          session_id?: string
          tone_analysis?: Json | null
          user_response?: string
          user_response_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "dialogue_exchanges_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "dialogue_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      dialogue_scenarios: {
        Row: {
          category: string
          character_persona: Json
          created_at: string
          created_by: string | null
          cultural_context: string | null
          cultural_sensitivity_notes: string | null
          description: string
          difficulty_level: number
          emotional_intensity_level: number | null
          estimated_duration_minutes: number | null
          focus_areas: string[] | null
          id: string
          initial_situation: string
          is_user_created: boolean | null
          learning_objectives: string[] | null
          power_dynamics: string | null
          preparation_guidance: string | null
          prerequisite_scenarios: string[] | null
          scenario_setup: string
          tags: string[] | null
          therapeutic_context: string | null
          title: string
          trigger_warnings: string[] | null
          updated_at: string
        }
        Insert: {
          category: string
          character_persona: Json
          created_at?: string
          created_by?: string | null
          cultural_context?: string | null
          cultural_sensitivity_notes?: string | null
          description: string
          difficulty_level?: number
          emotional_intensity_level?: number | null
          estimated_duration_minutes?: number | null
          focus_areas?: string[] | null
          id?: string
          initial_situation: string
          is_user_created?: boolean | null
          learning_objectives?: string[] | null
          power_dynamics?: string | null
          preparation_guidance?: string | null
          prerequisite_scenarios?: string[] | null
          scenario_setup: string
          tags?: string[] | null
          therapeutic_context?: string | null
          title: string
          trigger_warnings?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          character_persona?: Json
          created_at?: string
          created_by?: string | null
          cultural_context?: string | null
          cultural_sensitivity_notes?: string | null
          description?: string
          difficulty_level?: number
          emotional_intensity_level?: number | null
          estimated_duration_minutes?: number | null
          focus_areas?: string[] | null
          id?: string
          initial_situation?: string
          is_user_created?: boolean | null
          learning_objectives?: string[] | null
          power_dynamics?: string | null
          preparation_guidance?: string | null
          prerequisite_scenarios?: string[] | null
          scenario_setup?: string
          tags?: string[] | null
          therapeutic_context?: string | null
          title?: string
          trigger_warnings?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      dialogue_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          final_scores: Json | null
          id: string
          scenario_id: string
          session_notes: string | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          final_scores?: Json | null
          id?: string
          scenario_id: string
          session_notes?: string | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          final_scores?: Json | null
          id?: string
          scenario_id?: string
          session_notes?: string | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dialogue_sessions_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "dialogue_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          ai_summary: string | null
          audio_url: string | null
          content: string
          created_at: string
          entry_type: string
          id: string
          mood_score: number | null
          tags: string[] | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          audio_url?: string | null
          content: string
          created_at?: string
          entry_type?: string
          id?: string
          mood_score?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          audio_url?: string | null
          content?: string
          created_at?: string
          entry_type?: string
          id?: string
          mood_score?: number | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leadership_assessment_responses: {
        Row: {
          created_at: string
          id: string
          is_reflection: boolean | null
          question_key: string
          response_type: string
          response_value: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_reflection?: boolean | null
          question_key: string
          response_type: string
          response_value: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_reflection?: boolean | null
          question_key?: string
          response_type?: string
          response_value?: Json
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leadership_assessment_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "leadership_assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership_assessment_sessions: {
        Row: {
          assessment_type_id: string
          completed_at: string | null
          created_at: string
          id: string
          insights_generated: Json | null
          session_notes: string | null
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          assessment_type_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          insights_generated?: Json | null
          session_notes?: string | null
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          assessment_type_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          insights_generated?: Json | null
          session_notes?: string | null
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leadership_assessment_sessions_assessment_type_id_fkey"
            columns: ["assessment_type_id"]
            isOneToOne: false
            referencedRelation: "leadership_assessment_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leadership_assessment_types: {
        Row: {
          category: Database["public"]["Enums"]["leadership_assessment_category"]
          created_at: string
          description: string
          estimated_duration_minutes: number
          frequency_type: string
          id: string
          is_active: boolean
          purpose: string
          question_config: Json
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["leadership_assessment_category"]
          created_at?: string
          description: string
          estimated_duration_minutes?: number
          frequency_type?: string
          id?: string
          is_active?: boolean
          purpose: string
          question_config?: Json
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["leadership_assessment_category"]
          created_at?: string
          description?: string
          estimated_duration_minutes?: number
          frequency_type?: string
          id?: string
          is_active?: boolean
          purpose?: string
          question_config?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leadership_question_bank: {
        Row: {
          category: string
          created_at: string
          difficulty_level: number
          focus_areas: string[] | null
          frequency_weight: number
          id: string
          prerequisites: string[] | null
          question_config: Json
          question_key: string
          question_text: string
          question_type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          difficulty_level?: number
          focus_areas?: string[] | null
          frequency_weight?: number
          id?: string
          prerequisites?: string[] | null
          question_config?: Json
          question_key: string
          question_text: string
          question_type: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty_level?: number
          focus_areas?: string[] | null
          frequency_weight?: number
          id?: string
          prerequisites?: string[] | null
          question_config?: Json
          question_key?: string
          question_text?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          department: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          role: Database["public"]["Enums"]["organization_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          department?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          organization_id: string
          role?: Database["public"]["Enums"]["organization_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          department?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["organization_role"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          department: string | null
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          role: Database["public"]["Enums"]["organization_role"]
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["organization_role"]
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["organization_role"]
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          settings: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          focus_areas: string[] | null
          full_name: string | null
          id: string
          leadership_role: string | null
          onboarding_reflection: string | null
          organization_id: string | null
          preferred_name: string | null
          pronouns: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          focus_areas?: string[] | null
          full_name?: string | null
          id: string
          leadership_role?: string | null
          onboarding_reflection?: string | null
          organization_id?: string | null
          preferred_name?: string | null
          pronouns?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          focus_areas?: string[] | null
          full_name?: string | null
          id?: string
          leadership_role?: string | null
          onboarding_reflection?: string | null
          organization_id?: string | null
          preferred_name?: string | null
          pronouns?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          name: string
          organization_id: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          organization_id?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      question_responses: {
        Row: {
          assessment_session_id: string | null
          created_at: string
          id: string
          question_id: string
          response_notes: string | null
          response_score: number
          user_id: string
        }
        Insert: {
          assessment_session_id?: string | null
          created_at?: string
          id?: string
          question_id: string
          response_notes?: string | null
          response_score: number
          user_id: string
        }
        Update: {
          assessment_session_id?: string | null
          created_at?: string
          id?: string
          question_id?: string
          response_notes?: string | null
          response_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_subscription_tier_id_fkey"
            columns: ["subscription_tier_id"]
            isOneToOne: false
            referencedRelation: "subscription_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_addons: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          price_monthly: number
          slug: string
          stripe_price_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price_monthly: number
          slug: string
          stripe_price_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price_monthly?: number
          slug?: string
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      subscription_tiers: {
        Row: {
          advanced_analytics_enabled: boolean | null
          ai_insights_enabled: boolean | null
          beta_price_monthly: number | null
          created_at: string
          dialogue_simulator_enabled: boolean | null
          export_data_enabled: boolean | null
          features: Json | null
          id: string
          is_available: boolean | null
          max_assessments_per_week: number | null
          max_journal_entries_per_month: number | null
          max_voice_recording_duration_minutes: number | null
          max_voice_recordings_per_month: number | null
          name: string
          price_monthly: number
          price_yearly: number | null
          slug: string
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          team_features_enabled: boolean | null
          updated_at: string
          voice_journal_enabled: boolean | null
        }
        Insert: {
          advanced_analytics_enabled?: boolean | null
          ai_insights_enabled?: boolean | null
          beta_price_monthly?: number | null
          created_at?: string
          dialogue_simulator_enabled?: boolean | null
          export_data_enabled?: boolean | null
          features?: Json | null
          id?: string
          is_available?: boolean | null
          max_assessments_per_week?: number | null
          max_journal_entries_per_month?: number | null
          max_voice_recording_duration_minutes?: number | null
          max_voice_recordings_per_month?: number | null
          name: string
          price_monthly: number
          price_yearly?: number | null
          slug: string
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          team_features_enabled?: boolean | null
          updated_at?: string
          voice_journal_enabled?: boolean | null
        }
        Update: {
          advanced_analytics_enabled?: boolean | null
          ai_insights_enabled?: boolean | null
          beta_price_monthly?: number | null
          created_at?: string
          dialogue_simulator_enabled?: boolean | null
          export_data_enabled?: boolean | null
          features?: Json | null
          id?: string
          is_available?: boolean | null
          max_assessments_per_week?: number | null
          max_journal_entries_per_month?: number | null
          max_voice_recording_duration_minutes?: number | null
          max_voice_recordings_per_month?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number | null
          slug?: string
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          team_features_enabled?: boolean | null
          updated_at?: string
          voice_journal_enabled?: boolean | null
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_analytics: {
        Row: {
          analytics_date: string
          avg_energy_level: number | null
          avg_mood_score: number | null
          avg_stress_level: number | null
          burnout_risk_count: number | null
          created_at: string
          department: string | null
          engagement_score: number | null
          id: string
          organization_id: string
          total_members: number
        }
        Insert: {
          analytics_date?: string
          avg_energy_level?: number | null
          avg_mood_score?: number | null
          avg_stress_level?: number | null
          burnout_risk_count?: number | null
          created_at?: string
          department?: string | null
          engagement_score?: number | null
          id?: string
          organization_id: string
          total_members?: number
        }
        Update: {
          analytics_date?: string
          avg_energy_level?: number | null
          avg_mood_score?: number | null
          avg_stress_level?: number | null
          burnout_risk_count?: number | null
          created_at?: string
          department?: string | null
          engagement_score?: number | null
          id?: string
          organization_id?: string
          total_members?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_analytics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_challenge_participation: {
        Row: {
          challenge_id: string
          id: string
          joined_at: string
          progress_data: Json | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          joined_at?: string
          progress_data?: Json | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          joined_at?: string
          progress_data?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_challenge_participation_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "team_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      team_challenges: {
        Row: {
          challenge_type: string
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          goal_metrics: Json | null
          id: string
          organization_id: string
          start_date: string
          status: string
          target_departments: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          challenge_type?: string
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          goal_metrics?: Json | null
          id?: string
          organization_id: string
          start_date: string
          status?: string
          target_departments?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          challenge_type?: string
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          goal_metrics?: Json | null
          id?: string
          organization_id?: string
          start_date?: string
          status?: string
          target_departments?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_challenges_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_tracking: {
        Row: {
          created_at: string
          feature_type: string
          id: string
          period_end: string
          period_start: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature_type: string
          id?: string
          period_end: string
          period_start: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          feature_type?: string
          id?: string
          period_end?: string
          period_start?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_addons: {
        Row: {
          addon_id: string
          created_at: string
          id: string
          status: string
          stripe_subscription_item_id: string | null
          user_id: string
        }
        Insert: {
          addon_id: string
          created_at?: string
          id?: string
          status?: string
          stripe_subscription_item_id?: string | null
          user_id: string
        }
        Update: {
          addon_id?: string
          created_at?: string
          id?: string
          status?: string
          stripe_subscription_item_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "subscription_addons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_assessment_preferences: {
        Row: {
          created_at: string
          focus_areas_priority: string[] | null
          id: string
          max_daily_questions: number
          preferred_frequency: string
          skip_weekends: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          focus_areas_priority?: string[] | null
          id?: string
          max_daily_questions?: number
          preferred_frequency?: string
          skip_weekends?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          focus_areas_priority?: string[] | null
          id?: string
          max_daily_questions?: number
          preferred_frequency?: string
          skip_weekends?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_dialogue_preferences: {
        Row: {
          created_at: string
          cultural_background_notes: string | null
          current_challenges: string[] | null
          focus_areas_priority: string[] | null
          id: string
          leadership_experience_level: string | null
          preferred_emotional_intensity: number | null
          trigger_content_to_avoid: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cultural_background_notes?: string | null
          current_challenges?: string[] | null
          focus_areas_priority?: string[] | null
          id?: string
          leadership_experience_level?: string | null
          preferred_emotional_intensity?: number | null
          trigger_content_to_avoid?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cultural_background_notes?: string | null
          current_challenges?: string[] | null
          focus_areas_priority?: string[] | null
          id?: string
          leadership_experience_level?: string | null
          preferred_emotional_intensity?: number | null
          trigger_content_to_avoid?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_leadership_question_history: {
        Row: {
          avg_response_score: number | null
          category: string
          created_at: string
          id: string
          last_asked_at: string
          question_key: string
          times_asked: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_response_score?: number | null
          category: string
          created_at?: string
          id?: string
          last_asked_at?: string
          question_key: string
          times_asked?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_response_score?: number | null
          category?: string
          created_at?: string
          id?: string
          last_asked_at?: string
          question_key?: string
          times_asked?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_scenario_progress: {
        Row: {
          badges_earned: string[] | null
          best_clarity_score: number | null
          best_empathy_score: number | null
          best_inclusion_score: number | null
          completion_count: number | null
          created_at: string
          emotional_growth_notes: string | null
          id: string
          key_insights: string[] | null
          last_completed_at: string | null
          scenario_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          badges_earned?: string[] | null
          best_clarity_score?: number | null
          best_empathy_score?: number | null
          best_inclusion_score?: number | null
          completion_count?: number | null
          created_at?: string
          emotional_growth_notes?: string | null
          id?: string
          key_insights?: string[] | null
          last_completed_at?: string | null
          scenario_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          badges_earned?: string[] | null
          best_clarity_score?: number | null
          best_empathy_score?: number | null
          best_inclusion_score?: number | null
          completion_count?: number | null
          created_at?: string
          emotional_growth_notes?: string | null
          id?: string
          key_insights?: string[] | null
          last_completed_at?: string | null
          scenario_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wellness_goals: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          current_progress: number | null
          description: string | null
          id: string
          is_active: boolean | null
          target_count: number | null
          target_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_count?: number | null
          target_type?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          target_count?: number | null
          target_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      work_life_balance_assessments: {
        Row: {
          assessment_date: string
          created_at: string
          id: string
          percentage: number
          question_1_notes: string | null
          question_1_score: number
          question_2_notes: string | null
          question_2_score: number
          question_3_notes: string | null
          question_3_score: number
          status_category: string
          total_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_date?: string
          created_at?: string
          id?: string
          percentage: number
          question_1_notes?: string | null
          question_1_score: number
          question_2_notes?: string | null
          question_2_score: number
          question_3_notes?: string | null
          question_3_score: number
          status_category: string
          total_score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_date?: string
          created_at?: string
          id?: string
          percentage?: number
          question_1_notes?: string | null
          question_1_score?: number
          question_2_notes?: string | null
          question_2_score?: number
          question_3_notes?: string | null
          question_3_score?: number
          status_category?: string
          total_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_feature: {
        Args: { user_uuid: string; feature_name: string }
        Returns: boolean
      }
      can_create_voice_recording: {
        Args: { user_uuid: string }
        Returns: {
          can_record: boolean
          recordings_used: number
          recordings_limit: number
          max_duration_minutes: number
          tier_name: string
        }[]
      }
      get_user_organization_id: {
        Args: { user_uuid: string }
        Returns: string
      }
      get_user_subscription: {
        Args: { user_uuid: string }
        Returns: {
          subscription_tier_name: string
          subscription_status: string
          features: Json
          addons: Json
        }[]
      }
      is_organization_member: {
        Args: { user_uuid: string; org_id: string }
        Returns: boolean
      }
      track_usage: {
        Args: { user_uuid: string; feature_name: string }
        Returns: undefined
      }
      track_voice_recording_usage: {
        Args: { user_uuid: string; duration_seconds: number }
        Returns: undefined
      }
    }
    Enums: {
      leadership_assessment_category:
        | "values_alignment"
        | "emotional_energy"
        | "authenticity"
        | "boundaries_boldness"
        | "voice_visibility"
        | "bias_navigation"
      organization_role: "owner" | "admin" | "manager" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      leadership_assessment_category: [
        "values_alignment",
        "emotional_energy",
        "authenticity",
        "boundaries_boldness",
        "voice_visibility",
        "bias_navigation",
      ],
      organization_role: ["owner", "admin", "manager", "member"],
    },
  },
} as const
