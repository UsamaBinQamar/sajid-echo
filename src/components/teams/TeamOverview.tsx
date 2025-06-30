
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Users, UserPlus, TrendingUp, AlertTriangle } from "lucide-react";

interface TeamOverviewProps {
  organization: any;
}

const TeamOverview = ({ organization }: TeamOverviewProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        // Load team members
        const { data: membersData, error: membersError } = await supabase
          .from("organization_members")
          .select(`
            *,
            profiles!inner(full_name, focus_areas)
          `)
          .eq("organization_id", organization.id);

        if (membersError) throw membersError;
        setMembers(membersData || []);

        // Load latest team analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from("team_analytics")
          .select("*")
          .eq("organization_id", organization.id)
          .order("analytics_date", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (analyticsError && analyticsError.code !== "PGRST116") throw analyticsError;
        setAnalytics(analyticsData);

      } catch (error: any) {
        toast({
          title: "Error loading team data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [organization.id, toast]);

  if (loading) {
    return <div className="text-center py-8">Loading team overview...</div>;
  }

  const membersByDepartment = members.reduce((acc: any, member) => {
    const dept = member.department || "Unassigned";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(member);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Team Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(membersByDepartment).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Mood</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.avg_mood_score ? Number(analytics.avg_mood_score).toFixed(1) : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.burnout_risk_count || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(membersByDepartment).map(([department, deptMembers]: [string, any]) => (
              <div key={department} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{department}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {deptMembers.map((member: any) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {member.profiles?.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.profiles?.full_name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Team Members
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamOverview;
