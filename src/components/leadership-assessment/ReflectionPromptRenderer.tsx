
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, CheckCircle } from "lucide-react";
import { ReflectionPrompt } from "@/services/leadershipAssessment/types";

interface ReflectionPromptRendererProps {
  prompts: ReflectionPrompt[];
  title: string;
  category: string;
  responses: Record<string, any>;
  onResponseChange: (promptKey: string, value: any) => void;
  onComplete: () => void;
  loading?: boolean;
}

const ReflectionPromptRenderer: React.FC<ReflectionPromptRendererProps> = ({
  prompts,
  title,
  category,
  responses,
  onResponseChange,
  onComplete,
  loading = false
}) => {
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

  const renderPrompt = (prompt: ReflectionPrompt) => {
    const response = responses[prompt.key];

    switch (prompt.type) {
      case 'text':
        return (
          <Textarea
            value={response || ''}
            onChange={(e) => onResponseChange(prompt.key, e.target.value)}
            placeholder="Take a moment to reflect and share your thoughts..."
            className="min-h-[100px] resize-none"
          />
        );

      case 'choice':
        return (
          <RadioGroup 
            value={response} 
            onValueChange={(value) => onResponseChange(prompt.key, value)}
            className="space-y-2"
          >
            {prompt.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${prompt.key}-${i}`} />
                <Label htmlFor={`${prompt.key}-${i}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  const canComplete = () => {
    return prompts.every(prompt => {
      const response = responses[prompt.key];
      if (prompt.type === 'text') {
        return response && response.trim().length > 0;
      }
      return response !== undefined && response !== null;
    });
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          Reflection Time
          <Badge className={getCategoryColor(category)}>
            {category.replace('_', ' ')}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your responses to "{title}", take a moment to reflect deeper on your leadership journey.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {prompts.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-muted-foreground">
              <p className="text-lg font-medium">Great job completing the assessment!</p>
              <p className="text-sm">Your insights are being generated...</p>
            </div>
            <Button
              onClick={onComplete}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              View Your Insights
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <>
            {prompts.map((prompt, index) => (
              <div key={prompt.key} className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-900 pr-4">
                    {index + 1}. {prompt.text}
                  </h3>
                  {responses[prompt.key] !== undefined && responses[prompt.key] !== '' && (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  )}
                </div>
                {renderPrompt(prompt)}
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 border-t border-purple-200">
              <div className="text-sm text-gray-600">
                Reflection helps deepen your leadership insights
              </div>
              
              <Button
                onClick={onComplete}
                disabled={!canComplete() || loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? 'Generating Insights...' : 'Complete Reflection'}
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReflectionPromptRenderer;
