
import { CheckCircle, Calendar } from "lucide-react";

interface OverviewStatsProps {
  totalResponses: number;
  currentStreak: number;
  hasDataToday: boolean;
}

const OverviewStats = ({ totalResponses, currentStreak, hasDataToday }: OverviewStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center p-3 bg-white rounded-lg">
        <div className="text-lg font-bold text-[#f3c012]">{totalResponses}</div>
        <div className="text-xs text-gray-600">Total Responses</div>
      </div>
      <div className="text-center p-3 bg-white rounded-lg">
        <div className="text-lg font-bold text-[#37654B]">{currentStreak}</div>
        <div className="text-xs text-gray-600">Day Streak</div>
      </div>
      <div className="text-center p-3 bg-white rounded-lg">
        <div className="text-lg font-bold">
          {hasDataToday ? (
            <CheckCircle className="h-5 w-5 mx-auto text-[#37654B]" />
          ) : (
            <Calendar className="h-5 w-5 mx-auto text-gray-400" />
          )}
        </div>
        <div className="text-xs text-gray-600">
          {hasDataToday ? "Checked In" : "Check In Today"}
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;
