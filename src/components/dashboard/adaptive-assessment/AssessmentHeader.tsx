
import { CardTitle } from "@/components/ui/card";
import { Zap, Brain } from "lucide-react";
import QuickModeToggle from "../QuickModeToggle";

interface AssessmentHeaderProps {
  quickMode: boolean;
  useAdvancedFeatures: boolean;
  onQuickModeToggle: (quickMode: boolean) => void;
  onAdvancedFeaturesToggle: (enabled: boolean) => void;
}

const AssessmentHeader = ({
  quickMode,
  useAdvancedFeatures,
  onQuickModeToggle,
  onAdvancedFeaturesToggle
}: AssessmentHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center">
          {quickMode ? (
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          ) : (
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
          )}
          {quickMode ? "Quick Check-in" : "Smart Assessment"}
          {useAdvancedFeatures && !quickMode && (
            <span className="ml-2 text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-1 rounded-full">
              ✨ Advanced
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-2">
          <QuickModeToggle quickMode={quickMode} onToggle={onQuickModeToggle} />
        </div>
      </div>
      <p className="text-sm text-gray-600">
        {quickMode 
          ? "A quick pulse check to track your day" 
          : useAdvancedFeatures
            ? "AI-powered questions with contextual insights and dynamic generation"
            : "Personalized questions based on your patterns and goals"
        }
      </p>
      {!quickMode && (
        <div className="flex items-center gap-2 mt-2">
          <label className="text-xs text-gray-500">Advanced Features:</label>
          <button
            onClick={() => onAdvancedFeaturesToggle(!useAdvancedFeatures)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              useAdvancedFeatures 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {useAdvancedFeatures ? 'ON' : 'OFF'}
          </button>
        </div>
      )}
    </>
  );
};

export default AssessmentHeader;
