
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target } from "lucide-react";
import { LeadershipAssessmentService } from "@/services/leadershipAssessment/LeadershipAssessmentService";
import { LeadershipAssessmentType } from "@/services/leadershipAssessment/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LeadershipAssessmentCardProps {
  onStartAssessment: (assessmentType: LeadershipAssessmentType) => void;
}

const LeadershipAssessmentCard: React.FC<LeadershipAssessmentCardProps> = ({ onStartAssessment }) => {
  const [recommendedAssessment, setRecommendedAssessment] = useState<LeadershipAssessmentType | null>(null);
  const [allAssessments, setAllAssessments] = useState<LeadershipAssessmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [recommended, all] = await Promise.all([
        LeadershipAssessmentService.getRecommendedAssessment(user.id),
        LeadershipAssessmentService.getAvailableAssessmentTypes()
      ]);

      setRecommendedAssessment(recommended);
      setAllAssessments(all);
    } catch (error) {
      console.error('Error loading assessments:', error);
      toast({
        title: "Error",
        description: "Failed to load leadership assessments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      values_alignment: "bg-blue-100 text-blue-700",
      emotional_energy: "bg-green-100 text-green-700",
      authenticity: "bg-purple-100 text-purple-700",
      boundaries_boldness: "bg-orange-100 text-orange-700",
      voice_visibility: "bg-pink-100 text-pink-700",
      bias_navigation: "bg-indigo-100 text-indigo-700"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-amber-200 rounded w-3/4"></div>
            <div className="h-3 bg-amber-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-amber-600" />
          Leadership Growth Assessments
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized assessments to deepen your leadership awareness and growth
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {recommendedAssessment && !showAll && (
          <div className="space-y-4">
            <h4 className="font-medium text-amber-800">Recommended for You</h4>
            <div className="p-4 border border-amber-200 rounded-lg bg-white/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">{recommendedAssessment.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{recommendedAssessment.description}</p>
                </div>
                <Badge className={getCategoryColor(recommendedAssessment.category)}>
                  {recommendedAssessment.category.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {recommendedAssessment.estimated_duration_minutes} min
                </span>
                <span className="flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  {recommendedAssessment.frequency_type}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => onStartAssessment(recommendedAssessment)}
                  className="bg-amber-600 hover:bg-amber-700 text-white flex-1"
                >
                  Start Assessment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAll(true)}
                  className="border-amber-200 hover:bg-amber-50"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>
        )}

        {(showAll || !recommendedAssessment) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-amber-800">All Assessments</h4>
              {showAll && (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowAll(false)}
                  className="text-amber-600 hover:text-amber-700 p-0 h-auto"
                >
                  Show Recommended
                </Button>
              )}
            </div>
            
            <div className="grid gap-3">
              {allAssessments.map((assessment) => (
                <div key={assessment.id} className="p-3 border border-amber-200 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 text-sm">{assessment.title}</h5>
                      <p className="text-xs text-gray-600 mt-1">{assessment.description}</p>
                    </div>
                    <Badge className={`${getCategoryColor(assessment.category)} text-xs ml-2`}>
                      {assessment.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {assessment.estimated_duration_minutes} min
                      </span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => onStartAssessment(assessment)}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1"
                    >
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!recommendedAssessment && allAssessments.length === 0 && (
          <div className="text-center py-8 text-amber-600">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No assessments available at the moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadershipAssessmentCard;
