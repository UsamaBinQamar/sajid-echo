
import { Sparkles, Heart, Brain } from "lucide-react";

interface StickyNoteFeedbackProps {
  feedback: string;
  type?: 'insight' | 'encouragement' | 'suggestion';
  className?: string;
}

const StickyNoteFeedback = ({ 
  feedback, 
  type = 'insight', 
  className = "" 
}: StickyNoteFeedbackProps) => {
  const getIcon = () => {
    switch (type) {
      case 'encouragement':
        return <Heart className="h-4 w-4 text-pink-600" />;
      case 'suggestion':
        return <Brain className="h-4 w-4 text-blue-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-amber-600" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'encouragement':
        return 'Encouragement';
      case 'suggestion':
        return 'Coaching Suggestion';
      default:
        return 'AI Insight';
    }
  };

  return (
    <div className={`sticky-note ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="font-ui font-semibold text-sm text-foreground mb-2">
            {getTitle()}
          </h4>
          <p className="font-body text-sm text-foreground leading-relaxed">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StickyNoteFeedback;
