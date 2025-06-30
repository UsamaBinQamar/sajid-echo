
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SmartAssessmentCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-6 w-6 mr-2 text-blue-600" />
          Smart Assessment Features
          <Badge variant="outline" className="ml-2 text-blue-600 border-blue-600/30">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Experience personalized leadership assessments that adapt to your growth journey with advanced AI insights.
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start space-x-3">
            <Target className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Adaptive Questioning</h4>
              <p className="text-xs text-gray-600">Questions that evolve based on your responses and growth patterns</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Zap className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">AI-Powered Insights</h4>
              <p className="text-xs text-gray-600">Get personalized recommendations based on your assessment patterns</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-gray-900">Progress Tracking</h4>
              <p className="text-xs text-gray-600">Monitor your leadership development with detailed analytics</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => navigate('/insights')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          View Your Insights
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartAssessmentCard;
