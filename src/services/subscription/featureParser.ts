
import { SubscriptionTier } from "./types";

export const parseFeatures = (features: any, tier: any): string[] => {
  const featureList: string[] = [];
  
  // Add tier-specific features based on boolean flags
  if (tier.ai_insights_enabled) {
    featureList.push("AI-powered insights and coaching");
  }
  
  if (tier.voice_journal_enabled) {
    featureList.push("Voice journaling with transcription");
  }
  
  if (tier.advanced_analytics_enabled) {
    featureList.push("Advanced analytics and reporting");
  }
  
  if (tier.dialogue_simulator_enabled) {
    featureList.push("Interactive dialogue simulator");
  }
  
  if (tier.export_data_enabled) {
    featureList.push("Data export capabilities");
  }
  
  // Always include basic features
  featureList.push("Daily mood check-ins");
  featureList.push("Personal journal entries");
  featureList.push("Progress tracking");
  
  // Add usage limits information
  if (tier.max_assessments_per_week === -1) {
    featureList.push("Unlimited weekly assessments");
  } else if (tier.max_assessments_per_week > 0) {
    featureList.push(`Up to ${tier.max_assessments_per_week} assessments per week`);
  }
  
  if (tier.max_journal_entries_per_month === -1) {
    featureList.push("Unlimited journal entries");
  } else if (tier.max_journal_entries_per_month > 0) {
    featureList.push(`Up to ${tier.max_journal_entries_per_month} journal entries per month`);
  }
  
  if (tier.max_voice_recordings_per_month === -1) {
    featureList.push("Unlimited voice recordings");
  } else if (tier.max_voice_recordings_per_month > 0) {
    featureList.push(`Up to ${tier.max_voice_recordings_per_month} voice recordings per month`);
  }
  
  return featureList;
};
