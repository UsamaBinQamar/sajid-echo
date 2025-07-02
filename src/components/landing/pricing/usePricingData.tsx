
import { Star, Users, Sparkles } from "lucide-react";

export const usePricingData = () => {
  const plans = [
    {
      name: "Leadership Explorer",
      slug: "free",
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      price: { monthly: 1.99, yearly: 20 },
      description: "Perfect for getting started with your leadership journey",
      popular: false,
      features: [
        "3 wellness assessments per week",
        "10 journal entries per month",
        "4 voice recordings per month (5 min max)",
        "Basic progress tracking",
        "Community access",
        "Mobile app access"
      ],
      limitations: [
        "Limited AI insights",
        "Limited voice journaling",
        "No leadership simulator",
        "Limited analytics"
      ]
    },
    {
      name: "Leadership Professional",
      slug: "premium",
      icon: <Star className="h-6 w-6 text-[#f3c012]" />,
      price: { monthly: 5, yearly: 200, originalMonthly: 19.99 },
      description: "Advanced features for serious leadership development",
      popular: true,
      betaOffer: true,
      features: [
        "Unlimited wellness assessments",
        "Unlimited journal entries",
        "Daily voice recordings (20 min max)",
        "AI-powered insights",
        "Leadership simulator",
        "Advanced analytics",
        "Data export",
        "Priority support"
      ],
      limitations: []
    },
    {
      name: "Leadership Enterprise",
      slug: "team",
      icon: <Users className="h-6 w-6 text-green-600" />,
      price: { monthly: 99, yearly: 990 },
      description: "Complete solution for teams and organizations",
      popular: false,
      comingSoon: true,
      features: [
        "Everything in Professional",
        "Daily voice recordings (20 min max)",
        "Leadership simulator",
        "Team management",
        "Organization analytics",
        "Team challenges",
        "Bulk user management",
        "Custom branding",
        "Dedicated support"
      ],
      limitations: []
    }
  ];

  return { plans };
};
