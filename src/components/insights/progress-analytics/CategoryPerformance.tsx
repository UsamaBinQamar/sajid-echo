
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CategoryData {
  category: string;
  avg_score: number;
  trend_direction: string;
  question_frequency: number;
  last_low_score_date: string | null;
}

interface CategoryPerformanceProps {
  categoryData: CategoryData[];
}

const CategoryPerformance = ({ categoryData }: CategoryPerformanceProps) => {
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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      sleep_recovery: "😴",
      social_relationships: "💕",
      health_wellness: "💪",
      work_boundaries: "⚖️",
      personal_growth: "🌱",
      financial_stress: "💰"
    };
    return icons[category] || "📊";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving": return "bg-green-100 text-[#37654B]";
      case "declining": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-[#f3c012]" />
          Category Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.length > 0 ? (
            categoryData.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(category.category)}</span>
                  <div>
                    <h4 className="font-medium">{getCategoryName(category.category)}</h4>
                    <p className="text-sm text-gray-500">{category.question_frequency} responses</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-bold text-lg">{category.avg_score.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">avg score</div>
                  </div>
                  <Badge className={`${getTrendColor(category.trend_direction)} flex items-center space-x-1`}>
                    {getTrendIcon(category.trend_direction)}
                    <span className="capitalize">{category.trend_direction}</span>
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Complete some assessments to see your analytics!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPerformance;
