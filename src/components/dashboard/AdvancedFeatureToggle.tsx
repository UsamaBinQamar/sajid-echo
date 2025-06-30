
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Target, Clock } from "lucide-react";

interface AdvancedFeatureToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const AdvancedFeatureToggle = ({ enabled, onToggle }: AdvancedFeatureToggleProps) => {
  const features = [
    {
      icon: <Brain className="h-4 w-4" />,
      title: "Dynamic Question Generation",
      description: "AI-powered questions based on your context and patterns"
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Contextual Triggers",
      description: "Questions that adapt to your mood, stress, and journal content"
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Temporal Intelligence",
      description: "Time-aware questions optimized for different parts of your day"
    }
  ];

  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-sm">
            <Sparkles className="h-4 w-4 mr-2 text-[#CEA358]" />
            Advanced Assessment Features
          </CardTitle>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-2 bg-purple-25 rounded-lg">
                <div className="text-[#CEA358] mt-0.5">{feature.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-purple-900">{feature.title}</div>
                  <div className="text-xs text-purple-700 mt-1">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
          <Badge variant="outline" className="mt-3 text-xs text-[#CEA358] border-purple-200">
            Beta Feature
          </Badge>
        </CardContent>
      )}
    </Card>
  );
};

export default AdvancedFeatureToggle;
