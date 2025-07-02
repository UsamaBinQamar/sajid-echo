
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, ArrowRight } from "lucide-react";
import { subscriptionService } from "@/services/subscription";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  
  const sessionId = searchParams.get('session_id');
  const tierSlug = searchParams.get('tier');

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        // Refresh subscription status after successful payment
        const userSubscription = await subscriptionService.getUserSubscription();
        setSubscription(userSubscription);
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3c012]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Success Header */}
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Leadership Professional!
          </h1>
          <p className="text-xl text-gray-600">
            Your subscription has been successfully activated
          </p>
        </div>

        {/* Subscription Details */}
        <Card className="border-purple-300 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Crown className="h-5 w-5 mr-2 text-[#f3c012]" />
              Your New Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="outline" className="text-[#f3c012] border-purple-300 text-lg px-4 py-2">
              {subscription?.tier?.name || 'Leadership Professional'}
            </Badge>
            <p className="text-sm text-gray-600">
              You now have access to all premium leadership development features
            </p>
            
            {/* Beta Special Callout */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800">
                🎉 Beta Special: You're getting 74% off the regular price during our beta period!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card>
          <CardHeader>
            <CardTitle>What's Included in Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Unlimited leadership assessments and insights</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>AI-powered leadership coaching and recommendations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Leadership dialogue simulator for practice scenarios</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Daily voice journaling (20 min max per recording)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Advanced analytics and progress tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Data export capabilities</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Ready to Start Your Leadership Journey?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/dialogue-simulator')}
            >
              Try Leadership Simulator
            </Button>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600">
            If you have any questions about your subscription or need assistance, 
            you can manage your subscription anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
