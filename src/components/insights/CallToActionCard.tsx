
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface CallToActionCardProps {
  hasDataToday: boolean;
  onGoToAssessment: () => void;
}

const CallToActionCard = ({ hasDataToday, onGoToAssessment }: CallToActionCardProps) => {
  if (hasDataToday) return null;

  return (
    <div className="bg-warning-soft p-professional-sm rounded-professional border border-warning">
      <div className="flex items-center gap-professional-sm">
        <Calendar className="h-5 w-5 text-warning" />
        <div className="flex-1">
          <p className="text-professional-sm font-medium text-warning">
            Complete today's check-in to continue building insights
          </p>
          <p className="text-professional-xs text-warning">
            Daily consistency unlocks more powerful analytics
          </p>
        </div>
        <Button size="sm" onClick={onGoToAssessment}>
          Check In
        </Button>
      </div>
    </div>
  );
};

export default CallToActionCard;
