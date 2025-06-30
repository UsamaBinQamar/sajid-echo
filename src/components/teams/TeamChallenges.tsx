
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Target, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface TeamChallengesProps {
  organization: any;
}

const TeamChallenges = ({ organization }: TeamChallengesProps) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [userParticipation, setUserParticipation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        // Load team challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from("team_challenges")
          .select(`
            *,
            team_challenge_participation(count)
          `)
          .eq("organization_id", organization.id)
          .order("created_at", { ascending: false });

        if (challengesError) throw challengesError;
        setChallenges(challengesData || []);

        // Load user's participation
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: participationData, error: participationError } = await supabase
            .from("team_challenge_participation")
            .select("challenge_id")
            .eq("user_id", user.id);

          if (participationError) throw participationError;
          setUserParticipation(participationData?.map(p => p.challenge_id) || []);
        }

      } catch (error: any) {
        toast({
          title: "Error loading challenges",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, [organization.id, toast]);

  const joinChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("team_challenge_participation")
        .insert({
          challenge_id: challengeId,
          user_id: user.id
        });

      if (error) throw error;

      setUserParticipation(prev => [...prev, challengeId]);
      toast({
        title: "Joined challenge!",
        description: "You've successfully joined the team challenge.",
      });
    } catch (error: any) {
      toast({
        title: "Error joining challenge",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading team challenges...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Team Challenges</h2>
          <p className="text-gray-600">Collaborate on wellness goals with your team</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Active Challenges */}
      <div className="grid gap-6">
        {challenges.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Create the first team challenge to get everyone engaged in wellness activities.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Challenge
              </Button>
            </CardContent>
          </Card>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      {challenge.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{challenge.description}</p>
                  </div>
                  <Badge className={getStatusColor(challenge.status)}>
                    {challenge.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(challenge.start_date), 'MMM dd')} - {format(new Date(challenge.end_date), 'MMM dd')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {challenge.team_challenge_participation?.length || 0} participants
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Target className="h-4 w-4 mr-2" />
                    {challenge.challenge_type}
                  </div>
                </div>

                {challenge.target_departments && challenge.target_departments.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Target Departments:</p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.target_departments.map((dept: string) => (
                        <Badge key={dept} variant="outline">{dept}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Created {format(new Date(challenge.created_at), 'MMM dd, yyyy')}
                  </div>
                  {!userParticipation.includes(challenge.id) && challenge.status === "active" && (
                    <Button 
                      onClick={() => joinChallenge(challenge.id)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      Join Challenge
                    </Button>
                  )}
                  {userParticipation.includes(challenge.id) && (
                    <Badge className="bg-green-100 text-green-800">
                      Participating
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TeamChallenges;
