import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Brain } from "lucide-react";

interface QuickStartSectionProps {
  hasCompletedMoodToday: boolean;
  hasCompletedWLBToday: boolean;
}

const QuickStartSection = ({
  hasCompletedMoodToday,
  hasCompletedWLBToday,
}: QuickStartSectionProps) => {
  // Unified assessment completion check
  const hasCompletedDailyAssessment =
    hasCompletedMoodToday && hasCompletedWLBToday;

  const quickActions = [
    {
      id: "daily-assessment",
      title: "Smart Daily Check-in",
      description: "Complete your personalized wellness assessment",
      icon: <Brain className="h-5 w-5" />,
      completed: hasCompletedDailyAssessment,
      action: () => {
        // Scroll to assessment section on same page
        const assessmentElement = document.querySelector(
          '[data-tour="mood-checkin"]'
        );
        if (assessmentElement) {
          assessmentElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      },
      priority: 1,
    },
  ];

  const completedCount = quickActions.filter(
    (action) => action.completed
  ).length;
  const progressPercentage = (completedCount / quickActions.length) * 100;

  return (
    <Card className="card-ai">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Today's Focus
          </CardTitle>
          <Badge
            variant={
              completedCount === quickActions.length ? "success" : "secondary"
            }
          >
            {completedCount}/{quickActions.length} Complete
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {completedCount === quickActions.length
              ? "Great job! You've completed today's key activities."
              : "Complete your daily check-in to start your leadership journey"}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <div
              key={action.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                action.completed
                  ? "bg-success/10 border-success/20"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    action.completed
                      ? "bg-success/20 text-success"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {action.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    action.icon
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-foreground">
                    {action.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
              {!action.completed && (
                <Button size="sm" onClick={action.action} variant="default">
                  Start
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartSection;
