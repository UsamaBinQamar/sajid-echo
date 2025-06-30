
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface OverviewCardsProps {
  totalResponses: number;
  averageScore: number;
  activeCategories: number;
}

const OverviewCards = ({ totalResponses, averageScore, activeCategories }: OverviewCardsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalResponses}</div>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageScore >= 0 ? averageScore.toFixed(1) : "N/A"}
          </div>
          <p className="text-xs text-gray-500">Across all categories</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCategories}</div>
          <p className="text-xs text-gray-500">Being tracked</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCards;
