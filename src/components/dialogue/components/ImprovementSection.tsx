
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface ImprovementSectionProps {
  improvementAreas: string[];
}

const ImprovementSection: React.FC<ImprovementSectionProps> = ({ improvementAreas }) => {
  if (!improvementAreas || improvementAreas.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-blue-700">
          <Lightbulb className="h-5 w-5 mr-2" />
          Growth Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {improvementAreas.map((area, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{area}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementSection;
