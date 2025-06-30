
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { aiEngineService } from "@/services/ai";
import { MessageCircle, Heart, CheckCircle, ArrowRight } from "lucide-react";

const IntelligentCoachingWidget = () => {
  const [coaching, setCoaching] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [actionCompleted, setActionCompleted] = useState<string[]>([]);

  useEffect(() => {
    loadCoachingRecommendation();
  }, []);

  const loadCoachingRecommendation = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const recommendation = await aiEngineService.getCoachingRecommendation(session.user.id);
      setCoaching(recommendation);
    } catch (error) {
      console.error("Error loading coaching recommendation:", error);
    } finally {
      setLoading(false);
    }
  };

  const markActionCompleted = (action: string) => {
    setActionCompleted(prev => [...prev, action]);
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'encouraging': return <Heart className="h-4 w-4 text-green-600" />;
      case 'celebratory': return <Heart className="h-4 w-4 text-[#CEA358]" />;
      case 'empathetic': return <Heart className="h-4 w-4 text-blue-600" />;
      default: return <MessageCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getCoachingTypeColor = (type: string) => {
    switch (type) {
      case 'motivational': return "bg-green-100 text-[#37654B]";
      case 'supportive': return "bg-blue-100 text-blue-800";
      case 'instructional': return "bg-purple-100 text-purple-800";
      case 'challenging': return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-foreground";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-[#CEA358]" />
            Your AI Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#CEA358]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coaching) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-[#CEA358]" />
            Your AI Coach
          </div>
          <Badge className={getCoachingTypeColor(coaching.coachingType)}>
            {coaching.coachingType}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          {getToneIcon(coaching.tone)}
          <p className="text-foreground leading-relaxed">{coaching.message}</p>
        </div>

        {coaching.actionSteps && coaching.actionSteps.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-2">Suggested Actions:</h4>
            <div className="space-y-2">
              {coaching.actionSteps.map((action: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markActionCompleted(action)}
                    disabled={actionCompleted.includes(action)}
                    className="p-0 h-auto"
                  >
                    <CheckCircle 
                      className={`h-4 w-4 ${
                        actionCompleted.includes(action) 
                          ? 'text-green-600' 
                          : 'text-muted-foreground hover:text-green-500'
                      }`} 
                    />
                  </Button>
                  <span 
                    className={`text-sm ${
                      actionCompleted.includes(action) 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}
                  >
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {coaching.followUpQuestions && coaching.followUpQuestions.length > 0 && (
          <div>
            <h4 className="font-medium text-foreground mb-2">Reflection Questions:</h4>
            <div className="space-y-1">
              {coaching.followUpQuestions.slice(0, 2).map((question: string, index: number) => (
                <p key={index} className="text-sm text-muted-foreground italic">
                  • {question}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={loadCoachingRecommendation}
            className="flex-1 text-xs"
          >
            New Coaching
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          {coaching.timingOptimal && (
            <Badge variant="outline" className="text-xs">
              Perfect timing ⭐
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentCoachingWidget;
