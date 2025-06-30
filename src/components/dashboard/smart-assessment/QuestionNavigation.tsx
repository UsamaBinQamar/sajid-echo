
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  canProceed: boolean;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const QuestionNavigation = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  canProceed, 
  loading, 
  onPrevious, 
  onNext 
}: QuestionNavigationProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        Previous
      </Button>

      <Button
        onClick={onNext}
        disabled={!canProceed || loading}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {loading ? (
          "Saving..."
        ) : currentQuestionIndex === totalQuestions - 1 ? (
          "Complete Assessment"
        ) : (
          <>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );
};

export default QuestionNavigation;
