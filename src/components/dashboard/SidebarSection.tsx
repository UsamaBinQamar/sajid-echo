
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SubscriptionStatus from "./SubscriptionStatus";
import SmartNotifications from "./SmartNotifications";
import PredictiveInsightsWidget from "./PredictiveInsightsWidget";
import RecentEntries from "./RecentEntries";
import SmartAssessmentCard from "./SmartAssessmentCard";
import DialogueSimulatorCard from "./DialogueSimulatorCard";

const SidebarSection = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <SubscriptionStatus />
      <SmartAssessmentCard />
      <DialogueSimulatorCard />
      <SmartNotifications />
      <PredictiveInsightsWidget />
      <RecentEntries />
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/insights')}
            data-tour="insights-action"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => navigate('/dialogue-simulator')}
            data-tour="dialogue-simulator"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Practice Leadership
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarSection;
