
import { Progress } from "@/components/ui/progress";

interface OverviewProgressProps {
  progress: number;
  nextMilestone: string;
}

const OverviewProgress = ({ progress, nextMilestone }: OverviewProgressProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Insights Progress</span>
        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-3" />
      <p className="text-sm text-gray-600">{nextMilestone}</p>
    </div>
  );
};

export default OverviewProgress;
