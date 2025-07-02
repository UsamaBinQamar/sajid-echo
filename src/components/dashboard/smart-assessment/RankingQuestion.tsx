
import React, { useState } from 'react';
import { SmartQuestion } from './types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";

interface RankingQuestionProps {
  question: SmartQuestion & { options: string[] };
  questionIndex: number;
  totalQuestions: number;
  response: string[] | undefined;
  canProceed: boolean;
  onResponse: (value: string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const RankingQuestion: React.FC<RankingQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  response,
  canProceed,
  onResponse,
  onPrevious,
  onNext,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const orderedOptions = response || [...question.options];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newOrder = [...orderedOptions];
    const draggedItem = newOrder[draggedIndex];
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);
    
    onResponse(newOrder);
    setDraggedIndex(null);
  };

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    const newOrder = [...orderedOptions];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex < 0 || toIndex >= newOrder.length) return;
    
    [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
    onResponse(newOrder);
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
        <p className="text-sm text-muted-foreground">
          Drag items to reorder them by priority (most important first)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          {orderedOptions.map((option, index) => (
            <div
              key={option}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`
                flex items-center space-x-3 p-4 rounded-lg border-2 cursor-move
                transition-all duration-200 hover:shadow-md
                ${draggedIndex === index
                  ? 'border-purple-500 bg-purple-50 shadow-lg opacity-50'
                  : 'border-gray-200 hover:border-purple-300'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-[#f3c012] text-sm font-medium">
                  {index + 1}
                </span>
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              
              <span className="flex-1 text-sm font-medium">{option}</span>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="h-6 w-6 p-0"
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === orderedOptions.length - 1}
                  className="h-6 w-6 p-0"
                >
                  ↓
                </Button>
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
            className="flex items-center space-x-2 bg-gradient-to-r from-[#8A1503] to-[#f3c012] hover:from-[#7A1202] hover:to-[#B88D44]"
          >
            <span>{questionIndex === totalQuestions - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingQuestion;
