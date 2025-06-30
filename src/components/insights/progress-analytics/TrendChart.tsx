
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface TrendChartProps {
  trendChartData: Array<{ date: string; score: number }>;
}

const TrendChart = ({ trendChartData }: TrendChartProps) => {
  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--chart-1))",
    },
  };

  if (trendChartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
          Daily Progress Trend (Last 14 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TrendChart;
