import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useSmartAssessment } from "./smart-assessment/useSmartAssessment";
import AssessmentQuestion from "./smart-assessment/AssessmentQuestion";
import CompletionState from "./smart-assessment/CompletionState";
import WellnessGoalsCard from "./smart-assessment/WellnessGoalsCard";
import DailyPrompt from "./DailyPrompt";
import MotivationalPrompt from "./smart-assessment/MotivationalPrompt";
import QuestionNavigation from "./smart-assessment/QuestionNavigation";
import AssessmentNotes from "./smart-assessment/AssessmentNotes";
import { addIconsToQuestions } from "./smart-assessment/QuestionWithIcons";

interface SmartDailyAssessmentProps {
  focusAreas?: string[];
  onComplete?: () => void;
}

const SmartDailyAssessment = ({
  focusAreas = [],
  onComplete,
}: SmartDailyAssessmentProps) => {
  const [quickMode, setQuickMode] = useState(false);

  const {
    questions,
    currentQuestionIndex,
    responses,
    notes,
    setNotes,
    loading,
    isComplete,
    handleResponse,
    canProceed,
    handleNext,
    handlePrevious,
  } = useSmartAssessment(quickMode);

  // Call onComplete when assessment is completed
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  if (isComplete) {
    return (
      <div className="space-y-6">
        <CompletionState />
        <WellnessGoalsCard />
        <DailyPrompt focusAreas={focusAreas} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card
        data-tour="mood-checkin"
        className="border border-gray-200 dark:border-gray-800 bg-[var(--landing-yellow-light)] dark:bg-gray-900 rounded-2xl shadow-lg"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Daily Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-900 dark:text-white">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-white/80 dark:text-white/80">
              Preparing your personalized assessment...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const questionsWithIcons = addIconsToQuestions(questions);
  const currentQuestion = questionsWithIcons[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questionsWithIcons.length - 1;

  // Helper function to handle response conversion
  const handleQuestionResponse = (value: number | string | string[]) => {
    handleResponse(currentQuestion.id, value);
  };

  return (
    <Card
      data-tour="mood-checkin"
      className="border border-gray-200 dark:border-gray-800 bg-[var(--landing-yellow-light)] dark:bg-gray-900 rounded-2xl shadow-lg"
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Daily Check-in
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="quick-mode"
              className="text-xs text-gray-900 dark:text-white"
            >
              Quick Mode
            </Label>
            <Switch
              id="quick-mode"
              checked={quickMode}
              onCheckedChange={setQuickMode}
            />
          </div>
        </div>

        {isFirstQuestion && <MotivationalPrompt />}
      </CardHeader>
      <CardContent className="space-y-6 text-gray-900 dark:text-white">
        <AssessmentQuestion
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={questionsWithIcons.length}
          response={
            responses[currentQuestion.id] as
              | number
              | string
              | string[]
              | undefined
          }
          canProceed={canProceed()}
          onResponse={handleQuestionResponse}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {isLastQuestion && (
          <AssessmentNotes notes={notes} onNotesChange={setNotes} />
        )}

        <QuestionNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questionsWithIcons.length}
          canProceed={canProceed()}
          loading={loading}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </CardContent>
    </Card>
  );
};

export default SmartDailyAssessment;
