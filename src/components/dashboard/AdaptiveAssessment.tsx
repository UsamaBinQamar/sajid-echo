
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AssessmentHeader from "./adaptive-assessment/AssessmentHeader";
import AssessmentQuestion from "./adaptive-assessment/AssessmentQuestion";
import LoadingState from "./adaptive-assessment/LoadingState";
import SubmitButton from "./adaptive-assessment/SubmitButton";
import { useAssessmentLogic } from "./adaptive-assessment/useAssessmentLogic";

interface AdaptiveAssessmentProps {
  focusAreas: string[];
}

const AdaptiveAssessment: React.FC<AdaptiveAssessmentProps> = ({ focusAreas }) => {
  const {
    questions,
    responses,
    notes,
    isSubmitting,
    isLoading,
    quickMode,
    useAdvancedFeatures,
    setQuickMode,
    setUseAdvancedFeatures,
    handleResponseChange,
    handleNotesChange,
    submitResponses
  } = useAssessmentLogic(focusAreas);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <AssessmentHeader
          quickMode={quickMode}
          useAdvancedFeatures={useAdvancedFeatures}
          onQuickModeToggle={setQuickMode}
          onAdvancedFeaturesToggle={setUseAdvancedFeatures}
        />
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">Great job staying current!</p>
              <p className="text-sm">You've completed your regular assessments.</p>
            </div>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-medium mb-2">Ready for deeper insights?</p>
              <p className="text-sm text-amber-700 mb-4">
                Try our specialized leadership assessments for personalized growth insights.
              </p>
              <div className="text-xs text-amber-600">
                ↓ Check out the Leadership Growth Assessments section below
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <AssessmentQuestion
                key={question.id}
                question={question}
                response={responses[question.id]}
                notes={notes[question.id]}
                quickMode={quickMode}
                useAdvancedFeatures={useAdvancedFeatures}
                onResponseChange={handleResponseChange}
                onNotesChange={handleNotesChange}
              />
            ))}
            
            <SubmitButton
              isSubmitting={isSubmitting}
              canSubmit={Object.keys(responses).length === questions.length}
              onSubmit={submitResponses}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdaptiveAssessment;
