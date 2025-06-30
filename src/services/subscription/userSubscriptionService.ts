
import { supabase } from "@/integrations/supabase/client";
import { UserSubscription } from "./types";
import { parseFeatures } from "./featureParser";

export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("subscribers")
      .select(`
        *,
        subscription_tiers(*)
      `)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") throw error;

    return data ? {
      ...data,
      subscription_tier_name: data.subscription_tiers?.name || 'Leadership Explorer',
      subscription_status: data.status || 'inactive',
      tier: data.subscription_tiers ? {
        ...data.subscription_tiers,
        description: `${data.subscription_tiers.name} plan with comprehensive leadership features`,
        monthly_price: data.subscription_tiers.beta_price_monthly || data.subscription_tiers.price_monthly,
        yearly_price: data.subscription_tiers.price_yearly || data.subscription_tiers.price_monthly * 10,
        features: parseFeatures(data.subscription_tiers.features, data.subscription_tiers),
        monthly_stripe_price_id: data.subscription_tiers.stripe_price_id_monthly,
        yearly_stripe_price_id: data.subscription_tiers.stripe_price_id_yearly,
        team_features_enabled: false,
        price_monthly: data.subscription_tiers.price_monthly,
        price_yearly: data.subscription_tiers.price_yearly,
        beta_price_monthly: data.subscription_tiers.beta_price_monthly,
        is_available: data.subscription_tiers.is_available !== false,
        max_assessments_per_week: data.subscription_tiers.max_assessments_per_week,
        max_journal_entries_per_month: data.subscription_tiers.max_journal_entries_per_month,
        ai_insights_enabled: data.subscription_tiers.ai_insights_enabled,
        advanced_analytics_enabled: data.subscription_tiers.advanced_analytics_enabled,
        voice_journal_enabled: data.subscription_tiers.voice_journal_enabled,
        export_data_enabled: data.subscription_tiers.export_data_enabled,
        dialogue_simulator_enabled: data.subscription_tiers.dialogue_simulator_enabled,
        max_voice_recordings_per_month: data.subscription_tiers.max_voice_recordings_per_month || -1,
        max_voice_recording_duration_minutes: data.subscription_tiers.max_voice_recording_duration_minutes || 20
      } : undefined
    } : null;
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    throw error;
  }
};
