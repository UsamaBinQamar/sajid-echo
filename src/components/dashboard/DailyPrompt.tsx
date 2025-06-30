
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { getRandomPrompt, getRandomPromptByCategory } from "@/services/reflectionPrompts";

interface DailyPromptProps {
  focusAreas?: string[];
}

const DailyPrompt = ({ focusAreas = [] }: DailyPromptProps) => {
  const getPrompt = () => {
    // Map focus areas to prompt categories if they exist
    const categoryMap: Record<string, string> = {
      "Boundaries": "Self-Awareness",
      "Influence": "Systemic Leadership", 
      "Burnout Prevention": "Self-Awareness",
      "Authenticity": "Leadership Foundation",
      "Communication": "Communication & Feedback",
      "Confidence": "Leadership Foundation"
    };

    if (focusAreas && focusAreas.length > 0) {
      // Try to find a matching category for the focus areas
      for (const area of focusAreas) {
        const category = categoryMap[area];
        if (category) {
          const prompt = getRandomPromptByCategory(category);
          if (prompt) {
            return prompt.text;
          }
        }
      }
    }

    // Default to any random leadership prompt
    return getRandomPrompt().text;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Today's Leadership Reflection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground italic leading-relaxed">
          "{getPrompt()}"
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Take a moment to sit with this question. Your leadership journey matters.
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyPrompt;
