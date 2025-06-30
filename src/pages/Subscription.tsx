
import { useState, useEffect } from "react";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import CurrentSubscriptionCard from "@/components/subscription/CurrentSubscriptionCard";
import BillingCycleToggle from "@/components/subscription/BillingCycleToggle";
import FeatureComparisonTable from "@/components/subscription/FeatureComparisonTable";
import SubscriptionFAQ from "@/components/subscription/SubscriptionFAQ";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { useSubscriptionActions } from "@/hooks/useSubscriptionActions";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { SubscriptionTier } from "@/services/subscription/subscriptionService";

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [refreshing, setRefreshing] = useState(false);
  const { tiers, userSubscription, loading, loadSubscriptionData } = useSubscriptionData();
  const { handleSelectTier, handleManageSubscription, refreshSubscription } = useSubscriptionActions(loadSubscriptionData);
  const { toast } = useToast();

  // Auto-refresh on page load to catch recent subscription changes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') === 'true') {
      handleRefreshStatus();
    }
  }, []);

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      await refreshSubscription();
      toast({
        title: "Status Updated",
        description: "Your subscription status has been refreshed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Choose Your Leadership Journey
        </h1>
        <p className="text-xl text-gray-600">
          Select the perfect plan to enhance your leadership development and growth
        </p>
        
        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleRefreshStatus}
            disabled={refreshing}
            className="text-sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Checking Status...' : 'Refresh Status'}
          </Button>
        </div>
      </div>

      {/* Current Subscription Status */}
      {userSubscription && (
        <CurrentSubscriptionCard 
          userSubscription={userSubscription}
          onManageSubscription={handleManageSubscription}
          onRefreshSubscription={handleRefreshStatus}
        />
      )}

      {/* Billing Cycle Toggle */}
      <BillingCycleToggle 
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
      />

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier: SubscriptionTier) => (
          <SubscriptionCard
            key={tier.id}
            tier={tier}
            isCurrentTier={userSubscription?.subscription_tier_name === tier.name}
            isPopular={tier.slug === 'premium'}
            onSelectTier={handleSelectTier}
            billingCycle={billingCycle}
          />
        ))}
      </div>

      {/* Features Comparison */}
      <FeatureComparisonTable />

      {/* FAQ Section */}
      <SubscriptionFAQ />
    </div>
  );
};

export default Subscription;
