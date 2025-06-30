
import { Heart, Brain, Zap, BarChart3 } from "lucide-react";
import { SmartQuestion } from "./types";

export interface QuestionWithIcon extends SmartQuestion {
  iconComponent: JSX.Element;
}

export const addIconsToQuestions = (questions: SmartQuestion[]): QuestionWithIcon[] => {
  return questions.map(question => {
    let iconComponent;
    switch (question.id) {
      case 'mood':
        iconComponent = <Heart className="h-4 w-4 text-pink-500" />;
        break;
      case 'stress':
        iconComponent = <Brain className="h-4 w-4 text-blue-500" />;
        break;
      case 'energy':
        iconComponent = <Zap className="h-4 w-4 text-yellow-500" />;
        break;
      case 'wlb_time':
      case 'wlb_energy':
      case 'wlb_boundaries':
        iconComponent = <BarChart3 className="h-4 w-4 text-green-500" />;
        break;
      default:
        iconComponent = <Brain className="h-4 w-4 text-[#CEA358]" />;
    }
    return { ...question, iconComponent };
  });
};
