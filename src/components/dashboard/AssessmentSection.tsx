
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, CheckCircle } from "lucide-react";
import WorkLifeBalanceCheckIn from "./WorkLifeBalanceCheckIn";
import AdaptiveAssessment from "./AdaptiveAssessment";

interface AssessmentSectionProps {
  focusAreas: string[];
  hasCompletedWLBToday: boolean;
}

const AssessmentSection = ({ focusAreas, hasCompletedWLBToday }: AssessmentSectionProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
              Wellness Assessments
            </div>
            {hasCompletedWLBToday && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed Today
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Check in with your overall wellbeing
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasCompletedWLBToday ? (
            <WorkLifeBalanceCheckIn />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-600" />
              <p>You've completed your work-life balance check-in for today!</p>
              <p className="text-sm">Come back tomorrow for your next assessment.</p>
            </div>
          )}
          
          <AdaptiveAssessment focusAreas={focusAreas} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentSection;
