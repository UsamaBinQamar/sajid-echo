
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Settings } from "lucide-react";
import { UserSubscription } from "@/services/subscription";

interface CurrentSubscriptionCardProps {
  userSubscription: UserSubscription;
  onManageSubscription: () => void;
  onRefreshSubscription: () => void;
}

const CurrentSubscriptionCard = ({
  userSubscription,
  onManageSubscription,
  onRefreshSubscription
}: CurrentSubscriptionCardProps) => {
  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center font-display">
          <Crown className="h-5 w-5 mr-2 text-primary" />
          Current Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="outline" className="text-primary border-primary/30">
              {userSubscription.subscription_tier_name}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1 font-body">
              Status: {userSubscription.subscription_status}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRefreshSubscription} className="font-ui">
              Refresh Status
            </Button>
            <Button onClick={onManageSubscription} className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-ui">
              <Settings className="h-4 w-4" />
              Manage Subscription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSubscriptionCard;
