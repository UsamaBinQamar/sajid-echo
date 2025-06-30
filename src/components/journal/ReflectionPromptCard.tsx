
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, X } from "lucide-react";
import { getRandomPrompt, type ReflectionPrompt } from "@/services/reflectionPrompts";

interface ReflectionPromptCardProps {
  onUsePrompt: (prompt: string) => void;
  onDismiss: () => void;
}

const ReflectionPromptCard = ({ onUsePrompt, onDismiss }: ReflectionPromptCardProps) => {
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt>(getRandomPrompt());

  const handleRefreshPrompt = () => {
    setCurrentPrompt(getRandomPrompt());
  };

  const handleUsePrompt = () => {
    onUsePrompt(currentPrompt.text);
    onDismiss();
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-black dark:to-gray-900">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-[#8A1503] text-lg">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Leadership Reflection Prompt
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border border-purple-100">
          <p className="text-[#CEA358] italic text-lg leading-relaxed">
            "{currentPrompt.text}"
          </p>
          <p className="text-sm text-[#8A1503] mt-2 font-medium">
            {currentPrompt.category}
          </p>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshPrompt}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Prompt
          </Button>
          <Button 
            onClick={handleUsePrompt}
            className="bg-[#8A1503] text-white"
            size="sm"
          >
            Use This Prompt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionPromptCard;
