
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, BookOpen, MessageSquare, TrendingUp } from "lucide-react";

interface DashboardRecommendationsProps {
  onNavigate: (path: string) => void;
}

const DashboardRecommendations = ({ onNavigate }: DashboardRecommendationsProps) => {
  return (
    <Card className="card-ai">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Target className="h-6 w-6 mr-3 text-accent" />
          Recommended Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Button 
            variant="outline" 
            onClick={() => onNavigate('/journal')} 
            className="h-auto p-6 flex flex-col items-start space-y-3 text-left group hover:border-accent/50"
          >
            <div className="flex items-center w-full">
              <BookOpen className="h-5 w-5 mr-3 text-accent group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-foreground">Daily Reflection</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Capture today's leadership moments and insights
            </p>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-start space-y-3 text-left group hover:border-primary/50" 
            onClick={() => onNavigate('/dialogue-simulator')}
          >
            <div className="flex items-center w-full">
              <MessageSquare className="h-5 w-5 mr-3 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-foreground">Practice Scenario</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Work through a challenging leadership dialogue
            </p>
          </Button>

          <Button 
            variant="outline" 
            className="h-auto p-6 flex flex-col items-start space-y-3 text-left group hover:border-accent/50" 
            onClick={() => onNavigate('/insights')}
          >
            <div className="flex items-center w-full">
              <TrendingUp className="h-5 w-5 mr-3 text-accent group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-foreground">Review Progress</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Analyze your leadership development trends
            </p>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecommendations;
