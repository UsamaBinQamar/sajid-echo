
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Star, Users, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { subscriptionService, UserSubscription } from "@/services/subscription";

const DialogueSimulatorCard = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionService.getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasDialogueAccess = subscription?.subscription_tier_name !== 'Leadership Explorer';

  return (
    <Card className="card-gradient-primary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-icon-primary" />
          Leadership Dialogue Simulator
          {hasDialogueAccess ? (
            <Badge variant="outline" className="ml-2 text-status-success border-status-success bg-status-success-soft">
              Available
            </Badge>
          ) : (
            <Badge variant="outline" className="ml-2 text-status-warning border-status-warning bg-status-warning-soft">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="bg-gradient-primary-to-variant rounded-professional p-4 mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-primary-foreground" />
              <Star className="h-4 w-4 text-warning" />
              <Star className="h-4 w-4 text-warning" />
              <Star className="h-4 w-4 text-warning" />
            </div>
            <p className="text-sm font-medium text-primary-foreground">Practice challenging conversations with AI-powered scenarios</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Master difficult leadership conversations through realistic AI simulations with personalized feedback.
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Realistic conversation scenarios
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-info rounded-full mr-2"></div>
            AI-powered feedback and coaching
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
            Performance tracking and improvement
          </div>
        </div>

        {hasDialogueAccess ? (
          <Button 
            onClick={() => navigate('/dialogue-simulator')}
            className="w-full bg-gradient-primary"
          >
            Start Practicing
          </Button>
        ) : (
          <Button 
            onClick={() => navigate('/subscription')}
            className="w-full bg-gradient-primary"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Access
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DialogueSimulatorCard;
