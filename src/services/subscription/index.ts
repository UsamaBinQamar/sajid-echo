import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface SubscriptionTier {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  max_assessments_per_week: number;
  max_journal_entries_per_month: number;
  ai_insights_enabled: boolean;
  team_features_enabled: boolean;
  advanced_analytics_enabled: boolean;
  voice_journal_enabled: boolean;
  export_data_enabled: boolean;
  dialogue_simulator_enabled: boolean;
  features: Record<string, any>;
}

export interface SubscriptionAddon {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  stripe_price_id?: string;
  features: Record<string, any>;
}

export interface UserSubscription {
  subscription_tier_name: string;
  subscription_status: string;
  features: Record<string, any>;
  addons: Record<string, any>[];
}

// Helper function to safely convert Json to Record<string, any>
const parseJsonFeatures = (json: Json): Record<string, any> => {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    return json as Record<string, any>;
  }
  return {};
};

// Helper function to safely convert Json array to Record<string, any>[]
const parseJsonAddons = (json: Json): Record<string, any>[] => {
  if (Array.isArray(json)) {
    return json.map(item => parseJsonFeatures(item));
  }
  return [];
};

class SubscriptionService {
  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('get_user_subscription', {
        user_uuid: user.id
      });

      if (error) throw error;
      
      if (data?.[0]) {
        const rawData = data[0];
        return {
          subscription_tier_name: rawData.subscription_tier_name,
          subscription_status: rawData.subscription_status,
          features: parseJsonFeatures(rawData.features),
          addons: parseJsonAddons(rawData.addons)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  async getSubscriptionTiers(): Promise<SubscriptionTier[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_tiers')
        .select('*')
        .order('price_monthly');

      if (error) throw error;
      
      return (data || []).map(tier => ({
        ...tier,
        features: parseJsonFeatures(tier.features)
      }));
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
      return [];
    }
  }

  async getSubscriptionAddons(): Promise<SubscriptionAddon[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_addons')
        .select('*')
        .order('price_monthly');

      if (error) throw error;
      
      return (data || []).map(addon => ({
        ...addon,
        features: parseJsonFeatures(addon.features)
      }));
    } catch (error) {
      console.error('Error fetching subscription addons:', error);
      return [];
    }
  }

  async canAccessFeature(featureName: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('can_access_feature', {
        user_uuid: user.id,
        feature_name: featureName
      });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  async trackUsage(featureName: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('track_usage', {
        user_uuid: user.id,
        feature_name: featureName
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }

  async getUsageStats(): Promise<Record<string, number>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};

      const currentMonthStart = new Date();
      currentMonthStart.setDate(1);
      currentMonthStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('usage_tracking')
        .select('feature_type, usage_count')
        .eq('user_id', user.id)
        .gte('period_start', currentMonthStart.toISOString().split('T')[0]);

      if (error) throw error;

      const usageStats: Record<string, number> = {};
      data?.forEach(item => {
        usageStats[item.feature_type] = item.usage_count;
      });

      return usageStats;
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      return {};
    }
  }

  async checkVoiceRecordingLimits() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('can_create_voice_recording', {
        user_uuid: user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error checking voice recording limits:', error);
      return null;
    }
  }

  async trackVoiceRecordingUsage(durationSeconds: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.rpc('track_voice_recording_usage', {
        user_uuid: user.id,
        duration_seconds: durationSeconds
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking voice recording usage:', error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
