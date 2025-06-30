
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { checkProfileCompletion } from "@/utils/profileUtils";

export const useOnboarding = () => {
  const [step, setStep] = useState(1);
  const [pronouns, setPronouns] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has already completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        const profileCheck = checkProfileCompletion(profile);
        
        if (profileCheck.isComplete) {
          // User has completed onboarding, redirect to dashboard
          navigate("/dashboard");
          return;
        }

        // Pre-populate existing data
        setIsUpdating(true);
        setPreferredName(profile.preferred_name || "");
        setPronouns(profile.pronouns || "");
        setSelectedRole(profile.leadership_role || "");
        setSelectedFocusAreas(profile.focus_areas || []);
        setReflection(profile.onboarding_reflection || "");
      }

      setInitialLoading(false);
    };

    checkAuthAndProfile();
  }, [navigate]);

  const toggleFocusArea = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(item => item !== area)
        : prev.length < 3 
          ? [...prev, area]
          : prev
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          preferred_name: preferredName,
          pronouns,
          leadership_role: selectedRole,
          focus_areas: selectedFocusAreas,
          onboarding_reflection: reflection,
        });

      if (error) throw error;

      toast({
        title: isUpdating ? "Profile Updated!" : "Welcome to EchoStrong!",
        description: isUpdating ? "Your profile has been updated successfully." : "Your personalized journey begins now.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    pronouns,
    setPronouns,
    preferredName,
    setPreferredName,
    selectedRole,
    setSelectedRole,
    selectedFocusAreas,
    toggleFocusArea,
    reflection,
    setReflection,
    loading,
    initialLoading,
    isUpdating,
    handleComplete
  };
};
