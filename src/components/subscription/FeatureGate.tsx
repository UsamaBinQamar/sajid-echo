import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Zap } from "lucide-react";
import { subscriptionService } from "@/services/subscription";
import { useNavigate } from "react-router-dom";

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredTier?: string;
}

const FeatureGate = ({
  feature,
  children,
  fallback,
  requiredTier = "Premium",
}: FeatureGateProps) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const access = await subscriptionService.canAccessFeature(feature);
        setHasAccess(access);
      } catch (error) {
        console.error("Error checking feature access:", error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [feature]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardContent>
      </Card>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-black dark:text-white dark:to-gray-900">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="p-3 bg-purple-100 rounded-full">
            {requiredTier === "Professional" ? (
              <Crown className="h-6 w-6 text-[#CEA358]" />
            ) : requiredTier === "Enterprise" ? (
              <Zap className="h-6 w-6 text-blue-600" />
            ) : (
              <Lock className="h-6 w-6 text-gray-600 dark:text-white" />
            )}
          </div>
        </div>
        <CardTitle className="text-xl text-gray-700 dark:text-white">
          {requiredTier} Feature
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600 dark:text-white">
          Unlock this premium feature with a {requiredTier} subscription
        </p>
        <Button
          onClick={() => navigate("/subscription")}
          className="text-white bg-gradient-to-r from-[#8A1503] to-[#CEA358] hover:from-[#7A1202] hover:to-[#B88D44] transition-colors duration-300"
        >
          Upgrade to {requiredTier}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
