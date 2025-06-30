
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, X, Lightbulb, Target, MessageCircle, BarChart3 } from "lucide-react";

const helpContent = {
  "mood-checkin": {
    title: "Daily Mood Check-in",
    description: "Track your emotional state to build self-awareness and identify patterns in your leadership journey.",
    tips: [
      "Check in at the same time each day for consistency",
      "Be honest - this data is for your growth",
      "Look for patterns in your weekly/monthly reports"
    ]
  },
  "journal": {
    title: "Leadership Journal",
    description: "Reflect on leadership experiences, challenges, and growth with AI-powered insights.",
    tips: [
      "Write about specific leadership situations",
      "Include both successes and challenges",
      "Review past entries to track growth"
    ]
  },
  "dialogue-simulator": {
    title: "Dialogue Simulator",
    description: "Practice difficult conversations in a safe environment to build your leadership communication skills.",
    tips: [
      "Start with beginner scenarios to build confidence",
      "Focus on empathy, clarity, and inclusion",
      "Review feedback to improve your approach"
    ]
  },
  "insights": {
    title: "Personal Insights",
    description: "View analytics on your progress, strengths, and areas for development.",
    tips: [
      "Check insights weekly to track progress",
      "Use recommendations for focused improvement",
      "Share insights with mentors or coaches"
    ]
  }
};

interface HelpTooltipsProps {
  section: keyof typeof helpContent;
  className?: string;
}

const HelpTooltips: React.FC<HelpTooltipsProps> = ({ section, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = helpContent[section];

  const getIcon = () => {
    switch (section) {
      case 'mood-checkin': return <Target className="h-4 w-4" />;
      case 'journal': return <Lightbulb className="h-4 w-4" />;
      case 'dialogue-simulator': return <MessageCircle className="h-4 w-4" />;
      case 'insights': return <BarChart3 className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute z-10 top-full right-0 mt-2 w-80">
          <Card className="shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {getIcon()}
                  {content.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-600">{content.description}</p>
              
              <div>
                <Badge variant="outline" className="mb-2">Pro Tips</Badge>
                <ul className="text-xs text-gray-600 space-y-1">
                  {content.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HelpTooltips;
