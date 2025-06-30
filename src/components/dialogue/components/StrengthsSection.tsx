
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface StrengthsSectionProps {
  strengths: string[];
}

const StrengthsSection: React.FC<StrengthsSectionProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-green-700">
          <Target className="h-5 w-5 mr-2" />
          Your Strengths
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrengthsSection;
