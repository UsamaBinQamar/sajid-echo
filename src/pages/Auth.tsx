import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { checkProfileCompletion } from "@/utils/profileUtils";
import AuthForm from "@/components/auth/AuthForm";
import AuthToggle from "@/components/auth/AuthToggle";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "var(--landing-yellow)",
        color: "var(--landing-text)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/landing")}
            className="mb-4 text-black hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <Card
          className="shadow-lg border-0 rounded-2xl"
          style={{
            background: "var(--landing-white)",
            color: "var(--landing-text)",
          }}
        >
          <CardHeader className="text-center">
            <CardTitle
              className="text-2xl font-bold"
              style={{
                color: "var(--landing-green)",
                letterSpacing: "0.01em",
              }}
            >
              {isSignUp ? "Join EchoStrong" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Start your leadership reflection journey"
                : "Continue your growth journey"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              isSignUp={isSignUp}
              loading={loading}
              setLoading={setLoading}
            />

            <AuthToggle
              isSignUp={isSignUp}
              setIsSignUp={setIsSignUp}
              loading={loading}
            />

            {isSignUp && (
              <p
                className="text-xs text-center mt-4"
                style={{ color: "var(--landing-dark-blue)" }}
              >
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
