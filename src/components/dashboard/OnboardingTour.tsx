
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Your Leadership Journey!",
    content: "Let's take a quick tour to help you get started with your personal leadership development platform.",
    position: "center"
  },
  {
    id: "mood-checkin",
    title: "Daily Mood Check-in",
    content: "Start each day by tracking your emotional state. This helps build self-awareness and identifies patterns over time.",
    target: "[data-tour='mood-checkin']",
    position: "bottom"
  },
  {
    id: "journal",
    title: "Leadership Journal",
    content: "Reflect on your leadership experiences, challenges, and growth. AI-powered insights will help you identify patterns.",
    target: "[data-tour='journal-action']",
    position: "left"
  },
  {
    id: "simulator",
    title: "Dialogue Simulator",
    content: "Practice difficult leadership conversations in a safe environment. Build empathy, clarity, and inclusive communication skills.",
    target: "[data-tour='dialogue-simulator']",
    position: "left"
  },
  {
    id: "insights",
    title: "Personal Insights",
    content: "View your progress analytics, identify strengths and growth areas, and receive personalized recommendations.",
    target: "[data-tour='insights-action']",
    position: "left"
  }
];

const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedTour = localStorage.getItem('hasCompletedDashboardTour');
    if (hasCompletedTour) {
      setIsVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasCompletedDashboardTour', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('hasCompletedDashboardTour', 'true');
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentStepData = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            <p className="text-sm text-gray-600">{currentStepData.content}</p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTour;
