
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTier } from "./types";
import { parseFeatures } from "./featureParser";

export const getTiers = async (): Promise<SubscriptionTier[]> => {
  try {
    const { data, error } = await supabase
      .from("subscription_tiers")
      .select("*")
      .order("price_monthly", { ascending: true });

    if (error) throw error;

    // Transform the data to match the expected interface
    return (data || []).map(tier => {
      const features = parseFeatures(tier.features, tier);
      
      // Calculate effective pricing
      const effectiveMonthlyPrice = tier.beta_price_monthly || tier.price_monthly;
      const effectiveYearlyPrice = tier.price_yearly || (tier.price_monthly * 10);
      
      return {
        id: tier.id,
        name: tier.name,
        slug: tier.slug,
        description: `${tier.name} plan with comprehensive leadership features`,
        monthly_price: effectiveMonthlyPrice,
        yearly_price: effectiveYearlyPrice,
        features,
        monthly_stripe_price_id: tier.stripe_price_id_monthly,
        yearly_stripe_price_id: tier.stripe_price_id_yearly,
        price_monthly: tier.price_monthly,
        price_yearly: tier.price_yearly,
        beta_price_monthly: tier.beta_price_monthly,
        is_available: tier.is_available !== false,
        max_assessments_per_week: tier.max_assessments_per_week,
        max_journal_entries_per_month: tier.max_journal_entries_per_month,
        ai_insights_enabled: tier.ai_insights_enabled,
        team_features_enabled: false,
        advanced_analytics_enabled: tier.advanced_analytics_enabled,
        voice_journal_enabled: tier.voice_journal_enabled,
        export_data_enabled: tier.export_data_enabled,
        dialogue_simulator_enabled: tier.dialogue_simulator_enabled,
        max_voice_recordings_per_month: tier.max_voice_recordings_per_month || -1,
        max_voice_recording_duration_minutes: tier.max_voice_recording_duration_minutes || 20
      };
    });
  } catch (error) {
    console.error("Error fetching subscription tiers:", error);
    throw error;
  }
};
