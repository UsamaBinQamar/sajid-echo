
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Zap, Clock } from "lucide-react";

interface SubscriptionTier {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  monthly_stripe_price_id?: string;
  yearly_stripe_price_id?: string;
  price_monthly: number;
  price_yearly: number | null;
  beta_price_monthly?: number;
  is_available?: boolean;
}

interface SubscriptionCardProps {
  tier: SubscriptionTier;
  isCurrentTier: boolean;
  isPopular?: boolean;
  onSelectTier: (tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly') => void;
  billingCycle: 'monthly' | 'yearly';
}

const SubscriptionCard = ({ 
  tier, 
  isCurrentTier, 
  isPopular, 
  onSelectTier, 
  billingCycle 
}: SubscriptionCardProps) => {
  // Calculate the effective prices
  const effectiveMonthlyPrice = tier.beta_price_monthly || tier.price_monthly;
  const effectiveYearlyPrice = tier.price_yearly || (tier.price_monthly * 10);
  
  const currentPrice = billingCycle === 'monthly' ? effectiveMonthlyPrice : effectiveYearlyPrice;
  const hasBetaPrice = tier.beta_price_monthly && billingCycle === 'monthly';
  const isComingSoon = tier.is_available === false;
  
  // Format price display
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };
  
  const priceDisplay = billingCycle === 'monthly' 
    ? `$${formatPrice(currentPrice)}/month` 
    : `$${formatPrice(currentPrice)}/year`;

  const monthlyEquivalent = billingCycle === 'yearly' 
    ? `$${formatPrice(effectiveYearlyPrice / 12)}/month` 
    : null;

  const safeFeatures = Array.isArray(tier.features) ? tier.features : [];

  const handleSelect = () => {
    if (!isCurrentTier && !isComingSoon) {
      onSelectTier(tier, billingCycle);
    }
  };

  return (
    <Card className={`relative bg-card border transition-all duration-300 hover:shadow-lg ${
      isPopular && !isComingSoon
        ? 'border-primary ring-2 ring-primary/20 scale-105' 
        : isComingSoon
        ? 'border-gray-300 opacity-75'
        : 'border-border hover:border-primary/50'
    }`}>
      {isPopular && !isComingSoon && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 font-semibold">
            <Crown className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isComingSoon && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gray-500 text-white px-3 py-1 font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
      )}

      {hasBetaPrice && !isComingSoon && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-500 text-white px-3 py-1 font-semibold">
            Beta Special
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-card-foreground">
          {tier.name}
        </CardTitle>
        <div className="mt-4">
          {hasBetaPrice ? (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground line-through">
                ${formatPrice(tier.price_monthly)}/month
              </div>
              <div className="text-3xl font-bold text-foreground">
                {priceDisplay}
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-foreground">
              {priceDisplay}
            </div>
          )}
          {monthlyEquivalent && (
            <div className="text-sm text-muted-foreground">
              ({monthlyEquivalent} billed annually)
            </div>
          )}
          {hasBetaPrice && (
            <div className="text-xs text-green-600 font-medium mt-1">
              Limited time beta pricing
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {tier.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {safeFeatures.length > 0 ? (
            safeFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-card-foreground">{feature}</span>
              </div>
            ))
          ) : (
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span className="text-sm text-card-foreground">Standard features included</span>
            </div>
          )}
        </div>

        <Button
          onClick={handleSelect}
          disabled={isCurrentTier || isComingSoon}
          className={`w-full font-semibold transition-all duration-200 ${
            isCurrentTier 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : isComingSoon
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : isPopular
                ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {isCurrentTier ? (
            'Current Plan'
          ) : isComingSoon ? (
            'Coming Soon'
          ) : effectiveMonthlyPrice === 0 ? (
            'Get Started Free'
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              {isPopular ? 'Start Free Trial' : 'Choose Plan'}
            </>
          )}
        </Button>

        {isPopular && !isCurrentTier && !isComingSoon && (
          <p className="text-xs text-center text-muted-foreground">
            ⭐ 74% off during beta period
          </p>
        )}

        {isComingSoon && (
          <p className="text-xs text-center text-muted-foreground">
            Advanced team features coming soon
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
