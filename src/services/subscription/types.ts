
export interface SubscriptionTier {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  monthly_stripe_price_id?: string;
  yearly_stripe_price_id?: string;
  price_monthly: number;
  price_yearly: number | null;
  beta_price_monthly?: number;
  is_available?: boolean;
  max_assessments_per_week: number | null;
  max_journal_entries_per_month: number | null;
  ai_insights_enabled: boolean;
  team_features_enabled: boolean;
  advanced_analytics_enabled: boolean;
  voice_journal_enabled: boolean;
  export_data_enabled: boolean;
  dialogue_simulator_enabled: boolean;
  max_voice_recordings_per_month: number;
  max_voice_recording_duration_minutes: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  email: string;
  subscription_tier_id: string | null;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at: string | null;
  subscription_tier_name: string;
  subscription_status: string;
  tier?: SubscriptionTier;
}
