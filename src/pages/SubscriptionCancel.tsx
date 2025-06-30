
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, MessageCircle } from "lucide-react";

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Cancel Header */}
        <div className="space-y-4">
          <XCircle className="h-16 w-16 text-[#8A1503] mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">
            Subscription Cancelled
          </h1>
          <p className="text-xl text-gray-600">
            No worries! Your payment was not processed.
          </p>
        </div>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>What Happened?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              You cancelled the subscription process before completing payment. 
              No charges have been made to your account.
            </p>
            <p className="text-gray-600">
              You can continue using our free Leadership Explorer plan, which includes:
            </p>
            <ul className="text-left space-y-2 text-sm">
              <li>• Basic leadership assessments (3 per week)</li>
              <li>• Simple journaling (10 entries per month)</li>
              <li>• Limited voice recordings (4 per month, 5 min max)</li>
              <li>• Basic insights and analytics</li>
            </ul>
          </CardContent>
        </Card>

        {/* Special Offer Reminder */}
        <Card className="border-purple-300 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-purple-800">Special Beta Pricing Still Available!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 mb-4">
              Don't miss out on our limited-time beta pricing - 74% off Leadership Professional for just $5/month!
            </p>
            <Button 
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              View Pricing Plans
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">What Would You Like to Do?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/subscription')}
              className="bg-gradient-to-r from-[#CEA358] to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              View Plans Again
            </Button>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center justify-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            Questions About Pricing?
          </h4>
          <p className="text-sm text-gray-600">
            We're here to help! Our Leadership Professional plan is designed to accelerate 
            your leadership development with AI-powered insights and personalized coaching.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
