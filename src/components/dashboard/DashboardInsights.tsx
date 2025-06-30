import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp } from "lucide-react";

interface DashboardInsightsProps {
  onNavigate: (path: string) => void;
}

const DashboardInsights = ({ onNavigate }: DashboardInsightsProps) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-[#CEA358] dark:bg-gray-900 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900 dark:text-white text-xl font-bold">
          <Brain className="h-6 w-6 mr-3 text-[#8A1503]" />
          Today's Leadership Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-gray-900 dark:text-white">
        <div className="p-6 bg-white/80 dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 rounded-xl shadow-sm">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3 flex items-center text-base">
            🎯 <span className="ml-2">Focus Area</span>
          </h4>
          <p className="leading-relaxed text-gray-800 dark:text-gray-200">
            Based on your recent assessments, consider practicing active
            listening in your next team meeting. This aligns with your goal of
            improving communication skills.
          </p>
        </div>
        <div className="p-6 bg-white/80 dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded-xl shadow-sm">
          <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center text-base">
            💡 <span className="ml-2">Growth Opportunity</span>
          </h4>
          <p className="text-muted-foreground leading-relaxed">
            You've shown consistent improvement in decision-making. Try applying
            the same structured approach to conflict resolution scenarios.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNavigate("/insights")}
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          View Full Analytics
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardInsights;
