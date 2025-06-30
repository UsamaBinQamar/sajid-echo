
import OverviewCards from "./progress-analytics/OverviewCards";
import CategoryPerformance from "./progress-analytics/CategoryPerformance";
import TrendChart from "./progress-analytics/TrendChart";
import CategoryComparisonChart from "./progress-analytics/CategoryComparisonChart";
import { useProgressData } from "./progress-analytics/useProgressData";
import { getCategoryName, processChartData } from "./progress-analytics/utils";
import { Card, CardContent } from "@/components/ui/card";

const ProgressAnalytics = () => {
  const { categoryData, trendData, loading } = useProgressData();

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate overview metrics
  const totalResponses = trendData.length;
  const averageScore = categoryData.length > 0 
    ? categoryData.reduce((sum, cat) => sum + cat.avg_score, 0) / categoryData.length
    : -1;
  const activeCategories = categoryData.length;

  // Prepare chart data
  const categoryAverages = categoryData.map(cat => ({
    category: getCategoryName(cat.category),
    score: cat.avg_score
  }));

  const trendChartData = processChartData(trendData);

  return (
    <div className="space-y-6">
      <OverviewCards 
        totalResponses={totalResponses}
        averageScore={averageScore}
        activeCategories={activeCategories}
      />

      <CategoryPerformance categoryData={categoryData} />

      <TrendChart trendChartData={trendChartData} />

      <CategoryComparisonChart categoryAverages={categoryAverages} />
    </div>
  );
};

export default ProgressAnalytics;
