
import React from 'react';
import { SmartQuestion } from './types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";

interface ActionCommitmentQuestionProps {
  question: SmartQuestion & { options: string[] };
  questionIndex: number;
  totalQuestions: number;
  response: string | string[] | undefined;
  canProceed: boolean;
  onResponse: (value: string | string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ActionCommitmentQuestion: React.FC<ActionCommitmentQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  response,
  canProceed,
  onResponse,
  onPrevious,
  onNext,
}) => {
  const handleCommitmentSelect = (commitment: string) => {
    onResponse(commitment);
  };

  const isSelected = (commitment: string): boolean => {
    return response === commitment;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-muted-foreground">
              Question {questionIndex + 1} of {totalQuestions}
            </span>
          </div>
          {question.required && (
            <span className="text-xs text-red-500">Required</span>
          )}
        </div>
        <CardTitle className="text-lg font-medium leading-relaxed">
          {question.question}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose one action you commit to taking this week
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {question.options.map((commitment, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                hover:shadow-md
                ${isSelected(commitment)
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }
              `}
              onClick={() => handleCommitmentSelect(commitment)}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-5 h-5 rounded-full border-2 mt-0.5 transition-all flex items-center justify-center
                  ${isSelected(commitment)
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected(commitment) && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    {commitment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {response && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Your commitment: {response}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              We'll check in on your progress in future assessments!
            </p>
          </div>
        )}
        
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
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <span>{questionIndex === totalQuestions - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCommitmentQuestion;
