
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import { Users, ArrowLeft, Star, Target, TrendingUp } from "lucide-react";

const Teams = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/auth");
          return;
        }
      } catch (error: any) {
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const comingSoonFeatures = [
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Connect with your team members and share wellness insights",
      status: "Coming Soon"
    },
    {
      icon: TrendingUp,
      title: "Team Analytics",
      description: "View aggregated team wellness metrics and trends",
      status: "Coming Soon"
    },
    {
      icon: Target,
      title: "Team Challenges",
      description: "Create and participate in team wellness challenges",
      status: "Coming Soon"
    },
    {
      icon: Star,
      title: "Organization Insights",
      description: "Advanced analytics for organizational wellness",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Team Features</h1>
            <p className="text-gray-600">Team collaboration and organizational wellness features are coming soon!</p>
          </div>

          {/* Coming Soon Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {comingSoonFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Icon className="h-6 w-6 text-[#CEA358] mr-3" />
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        {feature.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                  <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-gray-500 font-medium">Available in Future Release</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Current Focus */}
          <Card className="bg-gradient-to-r from-[#CEA358] to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-xl">Focus on Individual Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                While team features are in development, maximize your individual leadership growth with our comprehensive toolkit:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Daily Assessments</h4>
                  <p className="text-sm opacity-90">Track your mood, stress, and energy levels</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Dialogue Simulator</h4>
                  <p className="text-sm opacity-90">Practice difficult conversations with AI</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Leadership Journal</h4>
                  <p className="text-sm opacity-90">Reflect on your leadership journey</p>
                </div>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => navigate("/dashboard")}
                className="bg-white text-[#CEA358] hover:bg-gray-100"
              >
                Continue Your Leadership Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Teams;
