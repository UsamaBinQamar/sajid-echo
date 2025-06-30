
import { Textarea } from "@/components/ui/textarea";

interface AssessmentQuestionProps {
  question: any;
  response?: number;
  notes?: string;
  quickMode: boolean;
  useAdvancedFeatures: boolean;
  onResponseChange: (questionId: string, score: number) => void;
  onNotesChange: (questionId: string, note: string) => void;
}

const AssessmentQuestion = ({
  question,
  response,
  notes,
  quickMode,
  useAdvancedFeatures,
  onResponseChange,
  onNotesChange
}: AssessmentQuestionProps) => {
  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      sleep_recovery: "Sleep & Recovery",
      social_relationships: "Relationships",
      health_wellness: "Health & Wellness",
      work_boundaries: "Work Boundaries",
      personal_growth: "Personal Growth",
      financial_stress: "Financial Wellness"
    };
    return names[category] || category;
  };

  const getEmojiForScore = (score: number) => {
    const emojis = ['😔', '😐', '🙂', '😊', '🤩'];
    return emojis[score - 1] || '🙂';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#CEA358] bg-purple-50 px-2 py-1 rounded-full">
          {getCategoryName(question.category)}
        </span>
        <div className="flex gap-2">
          {(question.personalizedScore || 0) > (question.relevanceScore || 0) && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              🎯 Personalized
            </span>
          )}
          {useAdvancedFeatures && question.id.includes('-') && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              ✨ Dynamic
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-medium">{question.question_text}</h3>
      
      <div className="flex justify-between items-center">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => onResponseChange(question.id, score)}
            className={`p-3 rounded-lg border-2 transition-all ${
              response === score
                ? 'border-purple-500 bg-purple-50 scale-110'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-2xl">{getEmojiForScore(score)}</span>
            <div className="text-xs mt-1">{score}</div>
          </button>
        ))}
      </div>
      
      {!quickMode && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <Textarea
            value={notes || ''}
            onChange={(e) => onNotesChange(question.id, e.target.value)}
            placeholder="Any additional thoughts or context..."
            className="min-h-[80px]"
          />
        </div>
      )}
    </div>
  );
};

export default AssessmentQuestion;
