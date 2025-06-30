
import { getTiers } from "./tierService";
import { getUserSubscription } from "./userSubscriptionService";
import { checkFeatureAccess, trackUsage } from "./featureAccessService";

export const subscriptionService = {
  getSubscriptionTiers: getTiers,
  getUserSubscription,
  hasFeatureAccess: checkFeatureAccess,
  trackUsage
};

// Re-export types for backward compatibility
export type { SubscriptionTier, UserSubscription } from "./types";
