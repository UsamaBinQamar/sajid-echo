
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Clock } from "lucide-react";

interface PricingPlan {
  name: string;
  slug: string;
  icon: React.ReactNode;
  price: { 
    monthly: number; 
    yearly: number; 
    originalMonthly?: number;
  };
  description: string;
  popular?: boolean;
  betaOffer?: boolean;
  comingSoon?: boolean;
  features: string[];
  limitations: string[];
}

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  onSelectPlan: (slug: string) => void;
}

const PricingCard = ({ plan, isYearly, onSelectPlan }: PricingCardProps) => {
  const currentPrice = isYearly ? plan.price.yearly : plan.price.monthly;
  const hasOriginalPrice = plan.price.originalMonthly && !isYearly;
  
  const priceDisplay = isYearly 
    ? `$${currentPrice}/year` 
    : `$${currentPrice}/month`;

  const monthlyEquivalent = isYearly 
    ? `$${(plan.price.yearly / 12).toFixed(2)}/month` 
    : null;

  return (
    <Card className={`relative h-full transition-all duration-300 hover:shadow-lg ${
      plan.popular && !plan.comingSoon
        ? 'border-primary ring-2 ring-primary/20 scale-105' 
        : plan.comingSoon
        ? 'border-gray-300 opacity-75'
        : 'border-border hover:border-primary/50'
    }`}>
      {plan.popular && !plan.comingSoon && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 font-semibold">
            <Crown className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {plan.comingSoon && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gray-500 text-white px-3 py-1 font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>
      )}

      {plan.betaOffer && !isYearly && !plan.comingSoon && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-semibold">
            Beta Special
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-2">
          {plan.icon}
        </div>
        <CardTitle className="text-xl font-bold">
          {plan.name}
        </CardTitle>
        <div className="mt-4">
          <div className="text-3xl font-bold">
            {hasOriginalPrice && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground line-through">
                  ${plan.price.originalMonthly}/month
                </div>
                <div>{priceDisplay}</div>
              </div>
            )}
            {!hasOriginalPrice && priceDisplay}
          </div>
          {monthlyEquivalent && (
            <div className="text-sm text-muted-foreground">
              ({monthlyEquivalent} billed annually)
            </div>
          )}
          {plan.betaOffer && !isYearly && (
            <div className="text-xs text-green-600 font-medium mt-1">
              Limited time beta pricing
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button
            onClick={() => onSelectPlan(plan.slug)}
            disabled={plan.comingSoon}
            className={`w-full font-semibold transition-all duration-200 ${
              plan.comingSoon
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : plan.popular
                ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {plan.comingSoon ? 'Coming Soon' : 'Get Started'}
          </Button>
        </div>

        {plan.betaOffer && !plan.comingSoon && (
          <p className="text-xs text-center text-muted-foreground">
            🎉 Save 75% during beta period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PricingCard;
