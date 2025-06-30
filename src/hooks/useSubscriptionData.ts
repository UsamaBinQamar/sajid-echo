
import { useState, useEffect } from "react";
import { subscriptionService, SubscriptionTier, UserSubscription } from "@/services/subscription";
import { useToast } from "@/components/ui/use-toast";

export const useSubscriptionData = () => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSubscriptionData = async () => {
    try {
      const [tiersData, userSubData] = await Promise.all([
        subscriptionService.getSubscriptionTiers(),
        subscriptionService.getUserSubscription()
      ]);
      
      setTiers(tiersData);
      setUserSubscription(userSubData);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  return {
    tiers,
    userSubscription,
    loading,
    loadSubscriptionData
  };
};
