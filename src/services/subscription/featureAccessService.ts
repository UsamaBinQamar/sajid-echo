
import { supabase } from "@/integrations/supabase/client";
import { getUserSubscription } from "./userSubscriptionService";

export const checkFeatureAccess = async (feature: string): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription();
    
    const defaultFeatures = {
      basic_mood_checkins: true,
      simple_journal: true,
      limited_prompts: true,
      basic_analytics_7_days: true,
      dialogue_simulator_basic: true
    };

    if (!subscription || !subscription.tier) {
      return defaultFeatures[feature] || false;
    }

    const tierFeatures = subscription.tier.features || [];
    
    switch (feature) {
      case 'ai_insights':
        return subscription.tier.ai_insights_enabled;
      case 'voice_journal':
        return subscription.tier.voice_journal_enabled;
      case 'advanced_analytics':
        return subscription.tier.advanced_analytics_enabled;
      case 'dialogue_simulator':
        return subscription.tier.dialogue_simulator_enabled;
      case 'export_data':
        return subscription.tier.export_data_enabled;
      case 'unlimited_assessments':
        return subscription.tier.max_assessments_per_week === -1;
      case 'unlimited_journal':
        return subscription.tier.max_journal_entries_per_month === -1;
      default:
        return tierFeatures.includes(feature) || defaultFeatures[feature] || false;
    }
  } catch (error) {
    console.error("Error checking feature access:", error);
    return false;
  }
};

export const trackUsage = async (feature: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.rpc('track_usage', {
      user_uuid: user.id,
      feature_name: feature
    });

    if (error) {
      console.error("Error tracking usage:", error);
    }
  } catch (error) {
    console.error("Error in trackUsage:", error);
  }
};
