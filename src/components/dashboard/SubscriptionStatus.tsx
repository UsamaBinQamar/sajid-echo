import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, ArrowUpRight, Sparkles } from "lucide-react";

// Mock subscription service
const subscriptionService = {
  getUserSubscription: async () => ({
    subscription_tier_name: "Leadership Explorer",
    subscription_status: "active",
  }),
};

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error("Error loading subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
    // Replace with actual navigation logic
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) return null;

  const isFreeTier =
    subscription.subscription_tier_name === "Leadership Explorer";
  const isPremium =
    subscription.subscription_tier_name === "Leadership Professional";
  const isTeam =
    subscription.subscription_tier_name === "Leadership Enterprise";

  return (
    <Card className="dark:bg-gray-900">
      <CardHeader className="pb-3 bg-[#8A1503] dark:bg-[#8A1503]">
        <CardTitle className="flex items-center text-white text-lg">
          {isPremium ? (
            <Crown className="h-5 w-5 mr-2 text-yellow-300" />
          ) : isTeam ? (
            <Zap className="h-5 w-5 mr-2 text-yellow-300" />
          ) : (
            <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
          )}
          Your Plan
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 bg-gray-50 dark:bg-red-950/20 p-6">
        <div>
          <Badge
            variant="outline"
            className={`px-4 py-2 font-semibold border-2 text-sm ${
              isPremium
                ? "border-yellow-500 text-yellow-900 bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-400"
                : isTeam
                ? "border-green-500 text-green-900 bg-green-200 dark:text-green-300 dark:bg-green-900/20 dark:border-green-400"
                : "border-[#8A1503] text-red-900 bg-red-200 dark:text-red-300 dark:bg-red-900/10 dark:border-red-300"
            }`}
          >
            {subscription.subscription_tier_name}
          </Badge>
          <p className="text-sm text-gray-800 dark:text-gray-400 mt-3 font-medium">
            Status:{" "}
            <span className="font-bold text-[#CEA358] dark:text-[#CEA358] bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
              {subscription.subscription_status}
            </span>
          </p>
        </div>

        {isFreeTier && (
          <div className="space-y-3">
            <p className="text-sm text-gray-900 dark:text-gray-300 font-medium">
              Unlock advanced leadership features with Professional
            </p>
            <Button
              size="sm"
              onClick={() => handleNavigate("/subscription")}
              className="w-full bg-[#8A1503] dark:bg-[#8A1503] text-white hover:bg-red-800 dark:hover:bg-[#8A1503] shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        )}

        {(isPremium || isTeam) && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleNavigate("/subscription")}
            className="w-full border-2 border-gray-700 text-gray-900 hover:bg-gray-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20 transition-all duration-300 font-medium"
          >
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
