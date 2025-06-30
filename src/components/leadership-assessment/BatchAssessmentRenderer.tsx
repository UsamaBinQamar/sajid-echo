
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, GripVertical } from "lucide-react";
import { AssessmentQuestion } from "@/services/leadershipAssessment/types";

interface BatchAssessmentRendererProps {
  questions: AssessmentQuestion[];
  title: string;
  description: string;
  category: string;
  responses: Record<string, any>;
  onResponseChange: (questionKey: string, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
}

const BatchAssessmentRenderer: React.FC<BatchAssessmentRendererProps> = ({
  questions,
  title,
  description,
  category,
  responses,
  onResponseChange,
  onSubmit,
  onBack,
  loading = false
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors = {
      values_alignment: "bg-blue-100 text-blue-700 border-blue-200",
      emotional_energy: "bg-green-100 text-green-700 border-green-200",
      authenticity: "bg-purple-100 text-purple-700 border-purple-200",
      boundaries_boldness: "bg-orange-100 text-orange-700 border-orange-200",
      voice_visibility: "bg-pink-100 text-pink-700 border-pink-200",
      bias_navigation: "bg-indigo-100 text-indigo-700 border-indigo-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const renderRankingQuestion = (question: AssessmentQuestion) => {
    const response = responses[question.key] || [];
    const options = question.options || [];
    
    const handleDragStart = (e: React.DragEvent, option: string) => {
      setDraggedItem(option);
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      if (!draggedItem) return;

      const newResponse = [...response];
      const draggedIndex = newResponse.indexOf(draggedItem);
      
      if (draggedIndex > -1) {
        newResponse.splice(draggedIndex, 1);
      }
      newResponse.splice(targetIndex, 0, draggedItem);
      
      onResponseChange(question.key, newResponse);
      setDraggedItem(null);
    };

    const addToRanking = (option: string) => {
      if (!response.includes(option)) {
        onResponseChange(question.key, [...response, option]);
      }
    };

    const removeFromRanking = (option: string) => {
      onResponseChange(question.key, response.filter((item: string) => item !== option));
    };

    const unrankedOptions = options.filter(option => !response.includes(option));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Available Options</h4>
            <div className="space-y-2 min-h-[120px] p-3 bg-gray-50 rounded-lg">
              {unrankedOptions.map((option, index) => (
                <div
                  key={`unranked-${index}`}
                  className="flex items-center justify-between p-2 bg-white rounded border cursor-pointer hover:bg-gray-50"
                  onClick={() => addToRanking(option)}
                >
                  <span className="text-sm">{option}</span>
                  <Button variant="outline" size="sm">Add</Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Your Ranking (drag to reorder)</h4>
            <div className="space-y-2 min-h-[120px] p-3 bg-blue-50 rounded-lg">
              {response.map((option: string, index: number) => (
                <div
                  key={`ranked-${index}`}
                  className="flex items-center gap-2 p-2 bg-white rounded border cursor-move hover:bg-gray-50"
                  draggable
                  onDragStart={(e) => handleDragStart(e, option)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  <span className="text-sm flex-1">{option}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeFromRanking(option)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {response.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">
                  Drag options here to rank them
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActionCommitmentQuestion = (question: AssessmentQuestion) => {
    const response = responses[question.key];
    
    return (
      <div className="space-y-3">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm font-medium mb-2">💪 Commitment to Action</p>
          <p className="text-amber-700 text-sm">
            Choose one action you commit to taking this week. This creates accountability for your growth.
          </p>
        </div>
        
        <RadioGroup 
          value={response} 
          onValueChange={(value) => onResponseChange(question.key, value)}
          className="space-y-3"
        >
          {question.options?.map((option, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={option} id={`${question.key}-commitment-${i}`} className="mt-1" />
              <Label htmlFor={`${question.key}-commitment-${i}`} className="text-sm leading-relaxed cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {response && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✓ Great choice! Remember to follow through on this commitment this week.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const response = responses[question.key];

    switch (question.type) {
      case 'ranking':
        return renderRankingQuestion(question);
        
      case 'action_commitment':
        return renderActionCommitmentQuestion(question);

      case 'likert':
        return (
          <RadioGroup 
            value={response?.toString()} 
            onValueChange={(value) => onResponseChange(question.key, parseInt(value))}
            className="space-y-2"
          >
            {Array.from({ length: question.scale || 5 }, (_, i) => (
              <div key={i + 1} className="flex items-center space-x-2">
                <RadioGroupItem value={(i + 1).toString()} id={`${question.key}-${i + 1}`} />
                <Label htmlFor={`${question.key}-${i + 1}`} className="text-sm">
                  {i + 1} - {i === 0 ? 'Strongly Disagree' : i === Math.floor((question.scale || 5) / 2) ? 'Neutral' : i === (question.scale || 5) - 1 ? 'Strongly Agree' : ''}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <div className="px-3">
              <Slider
                value={[response || question.min || 1]}
                onValueChange={(values) => onResponseChange(question.key, values[0])}
                max={question.max || 5}
                min={question.min || 1}
                step={1}
                className="w-full"
              />
            </div>
            {question.emojis && (
              <div className="flex justify-between text-2xl">
                {question.emojis.map((emoji, i) => (
                  <span key={i} className={response === i + 1 ? 'scale-125' : 'opacity-50'}>
                    {emoji}
                  </span>
                ))}
              </div>
            )}
            <div className="text-center text-sm text-gray-600">
              Value: {response || question.min || 1}
            </div>
          </div>
        );

      case 'multiple_choice':
        if (question.multiple_select) {
          return (
            <div className="space-y-3">
              {question.options?.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.key}-${i}`}
                    checked={Array.isArray(response) && response.includes(option)}
                    onCheckedChange={(checked) => {
                      const currentResponse = Array.isArray(response) ? response : [];
                      if (checked) {
                        onResponseChange(question.key, [...currentResponse, option]);
                      } else {
                        onResponseChange(question.key, currentResponse.filter((item: string) => item !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${question.key}-${i}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <RadioGroup 
              value={response} 
              onValueChange={(value) => onResponseChange(question.key, value)}
              className="space-y-2"
            >
              {question.options?.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.key}-choice-${i}`} />
                  <Label htmlFor={`${question.key}-choice-${i}`} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
        }

      case 'yes_no':
        return (
          <RadioGroup 
            value={response?.toString()} 
            onValueChange={(value) => onResponseChange(question.key, value === 'true')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.key}-yes`} />
              <Label htmlFor={`${question.key}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.key}-no`} />
              <Label htmlFor={`${question.key}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    return questions.every(question => {
      const response = responses[question.key];
      if (question.type === 'multiple_choice' && question.multiple_select) {
        return Array.isArray(response) && response.length > 0;
      }
      if (question.type === 'ranking') {
        return Array.isArray(response) && response.length > 0;
      }
      return response !== undefined && response !== null;
    });
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge className={getCategoryColor(category)}>
                {category.replace('_', ' ')}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.key} className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-900 pr-4">
                {index + 1}. {question.text}
              </h3>
              {responses[question.key] !== undefined && (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
            </div>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="flex justify-between items-center pt-6 border-t border-amber-200">
          <div className="text-sm text-gray-600">
            {Object.keys(responses).length} of {questions.length} questions completed
          </div>
          
          <Button
            onClick={onSubmit}
            disabled={!canSubmit() || loading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {loading ? 'Processing...' : 'Submit Assessment'}
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchAssessmentRenderer;
