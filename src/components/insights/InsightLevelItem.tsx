
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock } from "lucide-react";

interface InsightLevel {
  name: string;
  daysRequired: number;
  description: string;
  features: string[];
  unlocked: boolean;
}

interface InsightLevelItemProps {
  level: InsightLevel;
  index: number;
}

const InsightLevelItem = ({ level, index }: InsightLevelItemProps) => {
  return (
    <div
      key={index}
      className={`p-4 rounded-lg border transition-all ${
        level.unlocked
          ? 'bg-white border-green-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {level.unlocked ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
          <h5 className={`font-medium ${level.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
            {level.name}
          </h5>
        </div>
        <Badge variant={level.unlocked ? "default" : "outline"} className="text-xs">
          {level.daysRequired} {level.daysRequired === 1 ? 'day' : 'days'}
        </Badge>
      </div>
      <p className={`text-sm mb-2 ${level.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {level.description}
      </p>
      <div className="space-y-1">
        {level.features.map((feature, featureIndex) => (
          <div key={featureIndex} className="flex items-center space-x-2">
            <div className={`h-1.5 w-1.5 rounded-full ${level.unlocked ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className={`text-xs ${level.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightLevelItem;
