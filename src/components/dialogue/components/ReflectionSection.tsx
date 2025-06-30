
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface ReflectionSectionProps {
  journalPrompt: string;
  onSaveToJournal: () => void;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({ journalPrompt, onSaveToJournal }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-purple-700">
          <BookOpen className="h-5 w-5 mr-2" />
          Reflection & Growth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-purple-50 p-4 rounded-lg mb-4">
          <p className="text-purple-800 italic">"{journalPrompt}"</p>
        </div>
        <Button onClick={onSaveToJournal} variant="outline" className="w-full">
          Save to Journal for Reflection
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReflectionSection;
