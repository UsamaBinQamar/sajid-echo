
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";

interface TeamAnalyticsProps {
  organization: any;
}

const TeamAnalytics = ({ organization }: TeamAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Load historical team analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from("team_analytics")
          .select("*")
          .eq("organization_id", organization.id)
          .order("analytics_date", { ascending: true })
          .limit(30);

        if (analyticsError) throw analyticsError;
        setAnalytics(analyticsData || []);

        // Load department comparison data
        const { data: deptData, error: deptError } = await supabase
          .from("team_analytics")
          .select("*")
          .eq("organization_id", organization.id)
          .gte("analytics_date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .not("department", "is", null);

        if (deptError) throw deptError;
        
        // Aggregate by department
        const deptAggregated = deptData.reduce((acc: any, item) => {
          if (!acc[item.department]) {
            acc[item.department] = {
              department: item.department,
              avg_mood: 0,
              avg_stress: 0,
              avg_energy: 0,
              count: 0
            };
          }
          acc[item.department].avg_mood += Number(item.avg_mood_score || 0);
          acc[item.department].avg_stress += Number(item.avg_stress_level || 0);
          acc[item.department].avg_energy += Number(item.avg_energy_level || 0);
          acc[item.department].count += 1;
          return acc;
        }, {});

        const deptFinal = Object.values(deptAggregated).map((dept: any) => ({
          department: dept.department,
          avg_mood: dept.count > 0 ? (dept.avg_mood / dept.count).toFixed(1) : 0,
          avg_stress: dept.count > 0 ? (dept.avg_stress / dept.count).toFixed(1) : 0,
          avg_energy: dept.count > 0 ? (dept.avg_energy / dept.count).toFixed(1) : 0,
        }));

        setDepartmentData(deptFinal);

      } catch (error: any) {
        toast({
          title: "Error loading analytics",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [organization.id, toast]);

  if (loading) {
    return <div className="text-center py-8">Loading team analytics...</div>;
  }

  const chartData = analytics.map(item => ({
    date: format(new Date(item.analytics_date), 'MMM dd'),
    mood: Number(item.avg_mood_score || 0),
    stress: Number(item.avg_stress_level || 0),
    energy: Number(item.avg_energy_level || 0),
  }));

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "hsl(var(--chart-1))",
    },
    stress: {
      label: "Stress",
      color: "hsl(var(--chart-2))",
    },
    energy: {
      label: "Energy",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Trend Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stress & Energy Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-3))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Comparison */}
      {departmentData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Department Comparison (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[1, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avg_mood" fill="hsl(var(--chart-1))" name="Mood" />
                  <Bar dataKey="avg_stress" fill="hsl(var(--chart-2))" name="Stress" />
                  <Bar dataKey="avg_energy" fill="hsl(var(--chart-3))" name="Energy" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {chartData.length > 0 ? 
                  (chartData.reduce((sum, item) => sum + item.mood, 0) / chartData.length).toFixed(1) :
                  "--"
                }
              </div>
              <p className="text-sm text-gray-600">Average Mood</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {chartData.length > 0 ? 
                  (chartData.reduce((sum, item) => sum + item.stress, 0) / chartData.length).toFixed(1) :
                  "--"
                }
              </div>
              <p className="text-sm text-gray-600">Average Stress</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {chartData.length > 0 ? 
                  (chartData.reduce((sum, item) => sum + item.energy, 0) / chartData.length).toFixed(1) :
                  "--"
                }
              </div>
              <p className="text-sm text-gray-600">Average Energy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamAnalytics;
