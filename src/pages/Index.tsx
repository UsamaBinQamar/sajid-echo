
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { checkProfileCompletion } from "@/utils/profileUtils";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          navigate("/landing");
          return;
        }

        if (session) {
          // Check if user has completed onboarding
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          const profileCheck = checkProfileCompletion(profile);
          
          if (profileCheck.isComplete) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        } else {
          // Navigate to landing page for unauthenticated users
          navigate("/landing");
        }
      } catch (error) {
        console.error("Error in checkAuthAndRedirect:", error);
        navigate("/landing");
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3c012] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
