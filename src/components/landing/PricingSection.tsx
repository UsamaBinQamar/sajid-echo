import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { SubscriptionTier } from "@/services/subscription/subscriptionService";
import SubscriptionCard from "./pricing/SubscriptionCard";
import LandingBillingCycleToggle from "./pricing/LandingBillingCycleToggle";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

const PricingSection = ({ sectionClassName = "bg-muted/30" }) => {
  const navigate = useNavigate();
  const { tiers, loading } = useSubscriptionData();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Transform the tiers to match the SubscriptionCard interface
  const transformTier = (tier: unknown): SubscriptionTier => {
    const t = tier as SubscriptionTier & { [key: string]: any };
    return {
      id: t.id,
      name: t.name,
      slug: t.slug,
      description: `${t.name} plan with comprehensive leadership features`,
      monthly_price: t.price_monthly,
      yearly_price: t.price_yearly || t.price_monthly * 10,
      features: Array.isArray(t.features) ? t.features : [],
      monthly_stripe_price_id: t.monthly_stripe_price_id,
      yearly_stripe_price_id: t.yearly_stripe_price_id,
      price_monthly: t.price_monthly,
      price_yearly: t.price_yearly,
      beta_price_monthly: t.beta_price_monthly,
      is_available: t.is_available !== false,
      max_assessments_per_week: t.max_assessments_per_week || null,
      max_journal_entries_per_month: t.max_journal_entries_per_month || null,
      ai_insights_enabled: t.ai_insights_enabled || false,
      team_features_enabled: t.team_features_enabled || false,
      advanced_analytics_enabled: t.advanced_analytics_enabled || false,
      voice_journal_enabled: t.voice_journal_enabled || false,
      export_data_enabled: t.export_data_enabled || false,
      dialogue_simulator_enabled: t.dialogue_simulator_enabled || false,
      max_voice_recordings_per_month: t.max_voice_recordings_per_month || -1,
      max_voice_recording_duration_minutes:
        t.max_voice_recording_duration_minutes || 20,
    };
  };

  const handleSelectTier = (
    tier: SubscriptionTier,
    cycle: "monthly" | "yearly"
  ) => {
    navigate("/subscription");
  };

  if (loading) {
    return (
      <section
        className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 ${sectionClassName}`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 lg:mb-16">
            <LoadingSkeleton className="h-12 sm:h-14 lg:h-16 w-2/3 mx-auto mb-4 lg:mb-6" />
            <LoadingSkeleton className="h-6 w-4/5 mx-auto" />
          </div>

          <div className="flex items-center justify-center mb-8">
            <LoadingSkeleton className="h-12 w-64" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-16 sm:py-20 lg:py-24 px-4 sm:px-6 ${sectionClassName}`}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-foreground">
            Choose Your Growth Path
          </h2>
          <p className="font-body text-lg sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            Select the perfect plan to accelerate your leadership journey with
            AI-powered insights and personalized development tools.
          </p>
        </div>

        <div className="flex justify-center mb-8 lg:mb-12">
          <LandingBillingCycleToggle
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const transformedTier = transformTier(tier);
            const isPopular = tier.slug === "premium";

            return (
              <SubscriptionCard
                key={tier.id}
                tier={transformedTier}
                isCurrentTier={false}
                isPopular={isPopular}
                onSelectTier={handleSelectTier}
                billingCycle={billingCycle}
              />
            );
          })}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <p className="font-body text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6 text-sm text-muted-foreground">
            <span className="flex items-center">
              <span className="h-2 w-2 bg-accent rounded-full mr-2"></span>
              Cancel anytime
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-accent rounded-full mr-2"></span>
              SSL encrypted
            </span>
            <span className="flex items-center">
              <span className="h-2 w-2 bg-accent rounded-full mr-2"></span>
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
