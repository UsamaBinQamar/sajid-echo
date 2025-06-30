import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { SubscriptionTier } from "@/services/subscription/subscriptionService";

export const useSubscriptionActions = (loadSubscriptionData: () => Promise<void>) => {
  const { toast } = useToast();

  const handleSelectTier = async (tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly') => {
    // Prevent selection of unavailable tiers
    if (tier.is_available === false) {
      toast({
        title: "Coming Soon",
        description: "This tier is currently in development. Stay tuned for updates!",
        variant: "default"
      });
      return;
    }

    // Prevent selection of team/enterprise tier (temporarily disabled)
    if (tier.slug === 'team') {
      toast({
        title: "Coming Soon",
        description: "Team features are currently in development. Focus on individual leadership growth with our Premium plan!",
        variant: "default"
      });
      return;
    }

    try {
      console.log('Starting tier selection:', { tierSlug: tier.slug, billingCycle });
      
      // Handle free tier (Leadership Explorer)
      if (tier.slug === 'free') {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { tier_slug: tier.slug, billing_cycle: billingCycle }
        });

        if (error) {
          console.error('Free tier activation error:', error);
          throw new Error(error.message || 'Failed to activate free tier');
        }

        if (data?.url) {
          window.location.href = data.url;
        } else {
          toast({
            title: "Success",
            description: "Leadership Explorer plan activated successfully!",
          });
          await loadSubscriptionData();
        }
        return;
      }

      // Handle premium tier checkout
      console.log('Invoking create-checkout function...');
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier_slug: tier.slug, billing_cycle: billingCycle }
      });

      if (error) {
        console.error('Checkout error:', error);
        throw new Error(error.message || 'Failed to start checkout process');
      }

      console.log('Checkout response:', data);

      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Subscription selection error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout process. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleManageSubscription = async () => {
    try {
      console.log('Opening customer portal...');
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        console.error('Customer portal error:', error);
        throw new Error(error.message || 'Failed to open customer portal');
      }

      console.log('Customer portal response:', data);

      if (data?.url) {
        console.log('Redirecting to customer portal:', data.url);
        window.open(data.url, '_blank');
      } else {
        throw new Error('No portal URL received');
      }
    } catch (error: any) {
      console.error('Manage subscription error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal. Please try again.",
        variant: "destructive"
      });
    }
  };

  const refreshSubscription = async () => {
    try {
      console.log('Refreshing subscription status...');
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Refresh subscription error:', error);
        throw new Error(error.message || 'Failed to refresh subscription');
      }
      
      console.log('Subscription refresh response:', data);
      await loadSubscriptionData();
      toast({
        title: "Success",
        description: "Subscription status updated",
      });
    } catch (error: any) {
      console.error('Refresh subscription error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to refresh subscription status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    handleSelectTier,
    handleManageSubscription,
    refreshSubscription
  };
};
