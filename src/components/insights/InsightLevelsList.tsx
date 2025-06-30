
import InsightLevelItem from "./InsightLevelItem";

interface InsightLevel {
  name: string;
  daysRequired: number;
  description: string;
  features: string[];
  unlocked: boolean;
}

interface InsightLevelsListProps {
  unlockedLevels: InsightLevel[];
}

const InsightLevelsList = ({ unlockedLevels }: InsightLevelsListProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Insight Levels</h4>
      <div className="grid gap-3">
        {unlockedLevels.map((level, index) => (
          <InsightLevelItem key={index} level={level} index={index} />
        ))}
      </div>
    </div>
  );
};

export default InsightLevelsList;
