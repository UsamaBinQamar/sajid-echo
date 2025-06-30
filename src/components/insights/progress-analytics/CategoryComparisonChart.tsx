
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface CategoryComparisonChartProps {
  categoryAverages: Array<{ category: string; score: number }>;
}

const CategoryComparisonChart = ({ categoryAverages }: CategoryComparisonChartProps) => {
  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  if (categoryAverages.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[1, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CategoryComparisonChart;
