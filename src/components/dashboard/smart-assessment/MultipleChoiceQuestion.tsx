
import React from 'react';
import { SmartQuestion } from './types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface MultipleChoiceQuestionProps {
  question: SmartQuestion & { options: string[]; multiple_select?: boolean };
  questionIndex: number;
  totalQuestions: number;
  response: string | string[] | undefined;
  canProceed: boolean;
  onResponse: (value: string | string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  response,
  canProceed,
  onResponse,
  onPrevious,
  onNext,
}) => {
  const handleSingleSelect = (option: string) => {
    onResponse(option);
  };

  const handleMultiSelect = (option: string, checked: boolean) => {
    const currentResponse = Array.isArray(response) ? response : [];
    if (checked) {
      onResponse([...currentResponse, option]);
    } else {
      onResponse(currentResponse.filter(item => item !== option));
    }
  };

  const isSelected = (option: string): boolean => {
    if (question.multiple_select) {
      return Array.isArray(response) && response.includes(option);
    }
    return response === option;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          {question.required && (
            <span className="text-xs text-[#8A1503]">Required</span>
          )}
        </div>
        <CardTitle className="text-lg font-medium leading-relaxed">
          {question.question}
        </CardTitle>
        {question.multiple_select && (
          <p className="text-sm text-muted-foreground">
            Select all that apply
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected(option)
                  ? 'border-[#CEA358] bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }
              `}
              onClick={() => question.multiple_select 
                ? handleMultiSelect(option, !isSelected(option))
                : handleSingleSelect(option)
              }
            >
              <div className="flex items-center space-x-3">
                {question.multiple_select ? (
                  <Checkbox
                    checked={isSelected(option)}
                    onChange={() => {}} // Handled by div onClick
                  />
                ) : (
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-all
                    ${isSelected(option)
                      ? 'border-[#CEA358] bg-[#CEA358]'
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected(option) && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                )}
                <span className="text-sm font-medium">{option}</span>
              </div>
            </div>
          ))}
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
            className="flex items-center space-x-2 bg-gradient-to-r from-[#8A1503] to-[#0A0A08] hover:from-[#7A1202] hover:to-[#0A0A08]"
          >
            <span>{questionIndex === totalQuestions - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceQuestion;
