
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import IntelligentPromptWidget from "@/components/ai/IntelligentPromptWidget";
import AIInsightsWidget from "@/components/ai/AIInsightsWidget";
import IntelligentCoachingWidget from "@/components/ai/IntelligentCoachingWidget";

const AIInsightsSection = () => {
  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-[#f3c012]" />
          AI-Powered Insights
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized recommendations just for you
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <IntelligentPromptWidget />
          <AIInsightsWidget />
          <IntelligentCoachingWidget />
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightsSection;
