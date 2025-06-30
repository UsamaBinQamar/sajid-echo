
import { SmartQuestion } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Smile, Zap, Battery, Scale, Users } from "lucide-react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import RankingQuestion from "./RankingQuestion";
import ActionCommitmentQuestion from "./ActionCommitmentQuestion";

interface AssessmentQuestionProps {
  question: SmartQuestion;
  questionIndex: number;
  totalQuestions: number;
  response: number | string | string[] | undefined;
  canProceed: boolean;
  onResponse: (value: number | string | string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const getIconComponent = (iconName: string) => {
  const iconProps = { className: "h-5 w-5" };
  
  switch (iconName) {
    case 'smile':
      return <Smile {...iconProps} className="h-5 w-5 text-[#CEA358]" />;
    case 'zap':
      return <Zap {...iconProps} className="h-5 w-5 text-orange-600" />;
    case 'battery':
      return <Battery {...iconProps} className="h-5 w-5 text-green-600" />;
    case 'scale':
      return <Scale {...iconProps} className="h-5 w-5 text-blue-600" />;
    case 'users':
      return <Users {...iconProps} className="h-5 w-5 text-indigo-600" />;
    default:
      return <Smile {...iconProps} />;
  }
};

const AssessmentQuestion = ({
  question,
  questionIndex,
  totalQuestions,
  response,
  canProceed,
  onResponse,
  onPrevious,
  onNext,
}: AssessmentQuestionProps) => {
  // Handle different question types
  if (question.type === 'multiple_choice' && (question as any).options) {
    return (
      <MultipleChoiceQuestion
        question={question as SmartQuestion & { options: string[]; multiple_select?: boolean }}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        response={response as string | string[]}
        canProceed={canProceed}
        onResponse={onResponse as (value: string | string[]) => void}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );
  }

  if (question.type === 'ranking' && (question as any).options) {
    return (
      <RankingQuestion
        question={question as SmartQuestion & { options: string[] }}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        response={response as string[]}
        canProceed={canProceed}
        onResponse={onResponse as (value: string[]) => void}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );
  }

  if (question.type === 'action_commitment' && (question as any).options) {
    return (
      <ActionCommitmentQuestion
        question={question as SmartQuestion & { options: string[] }}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        response={response as string | string[]}
        canProceed={canProceed}
        onResponse={onResponse as (value: string | string[]) => void}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );
  }

  // Default emoji slider question for mood, stress, energy, etc.
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getIconComponent(question.icon)}
            <span className="text-sm text-muted-foreground">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>
          {question.required && (
            <span className="text-xs text-[#8A1503]">Required</span>
          )}
        </div>
        <CardTitle className="text-lg font-medium leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Emoji Response Scale */}
        <div className="flex justify-center space-x-2 sm:space-x-4">
          {question.emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onResponse(index + 1)}
              className={`
                p-3 sm:p-4 text-2xl sm:text-3xl rounded-full border-2 transition-all duration-200
                hover:scale-110 hover:shadow-md
                ${response === index + 1 
                  ? 'border-[#CEA358] bg-purple-50 shadow-lg scale-105' 
                  : 'border-gray-200 hover:border-purple-300'
                }
              `}
              aria-label={`Rate ${index + 1} out of 5`}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-muted-foreground px-2">
          <span>Low</span>
          <span>High</span>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center space-x-2 text-white bg-gradient-to-r from-[#8A1503] to-[#0A0A08] hover:from-[#7A1202] hover:to-[#B88D44]"
          >
            <span>{questionIndex === totalQuestions - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentQuestion;
