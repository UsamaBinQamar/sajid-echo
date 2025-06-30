
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubscriptionFAQ = () => {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Can I change my plan anytime?</h4>
          <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated automatically.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Is there a free trial?</h4>
          <p className="text-gray-600">Our Explorer tier is always available. Professional features come with a 14-day free trial.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
          <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers through Stripe.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">When will Enterprise features be available?</h4>
          <p className="text-gray-600">Enterprise features including team management and advanced analytics are currently in development. Stay tuned for updates!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionFAQ;
