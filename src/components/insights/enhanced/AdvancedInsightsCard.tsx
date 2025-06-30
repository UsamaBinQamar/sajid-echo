
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Lightbulb } from "lucide-react";

interface AdvancedInsight {
  type: string;
  category?: string;
  title: string;
  message: string;
  confidence: number;
  metrics?: any;
  priority?: 'high' | 'medium' | 'low';
}

interface AdvancedInsightsCardProps {
  insights: AdvancedInsight[];
  title: string;
  icon: 'brain' | 'trending' | 'target' | 'lightbulb';
  gradientFrom: string;
  gradientTo: string;
}

const AdvancedInsightsCard = ({ 
  insights, 
  title, 
  icon, 
  gradientFrom, 
  gradientTo 
}: AdvancedInsightsCardProps) => {
  const IconComponent = {
    brain: Brain,
    trending: TrendingUp,
    target: Target,
    lightbulb: Lightbulb
  }[icon];

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-[#37654B] border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`border-2 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <IconComponent className="h-5 w-5 mr-2 text-[#CEA358]" />
            {title}
          </div>
          <Badge variant="outline" className="text-[#CEA358] border-[#CEA358]">
            {insights.length} insights
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <IconComponent className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">No insights available yet. Keep building your data!</p>
          </div>
        ) : (
          insights.map((insight, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-100 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                  {insight.category && (
                    <Badge variant="outline" className="text-xs mb-2">
                      {insight.category.replace('_', ' ')}
                    </Badge>
                  )}
                  <p className="text-sm text-gray-700">{insight.message}</p>
                </div>
                {insight.priority && (
                  <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                  </Badge>
                )}
              </div>

              {/* Metrics display */}
              {insight.metrics && (
                <div className="space-y-2">
                  {insight.metrics.average && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Average Score:</span>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(insight.metrics.average / 5) * 100} 
                          className="w-16 h-2" 
                        />
                        <span className="font-medium">{insight.metrics.average.toFixed(1)}/5</span>
                      </div>
                    </div>
                  )}
                  {insight.metrics.trend !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Trend:</span>
                      <span className={`font-medium ${
                        insight.metrics.trend > 0.1 ? 'text-green-600' : 
                        insight.metrics.trend < -0.1 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {insight.metrics.trend > 0.1 ? '↗ Improving' : 
                         insight.metrics.trend < -0.1 ? '↘ Declining' : '→ Stable'}
                      </span>
                    </div>
                  )}
                  {insight.metrics.responses && (
                    <div className="text-xs text-gray-500">
                      Based on {insight.metrics.responses} responses
                    </div>
                  )}
                </div>
              )}

              {/* Confidence indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">Confidence:</span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={insight.confidence * 100} 
                    className="w-20 h-1" 
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {Math.round(insight.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedInsightsCard;
