
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const ResultsHeader: React.FC = () => {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
          Dialogue Complete!
        </CardTitle>
        <p className="text-gray-600">Here's how you performed in this leadership conversation</p>
      </CardHeader>
    </Card>
  );
};

export default ResultsHeader;
