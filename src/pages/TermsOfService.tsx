
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-900">
              Terms of Service
            </CardTitle>
            <p className="text-center text-gray-600">
              Effective Date: June 11, 2025
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-700">
            <p className="text-lg">
              Welcome to EchoStrong. By using our services, you agree to the following terms:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">User Agreement</h3>
                <p>By creating an account, you agree to use EchoStrong ethically and professionally.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coaching Disclaimer</h3>
                <p>EchoStrong is a reflective journaling and growth app, not a replacement for therapy or clinical services.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Usage</h3>
                <p>Insights and suggestions are generated using AI and should be considered for informational purposes only.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Security</h3>
                <p>You are responsible for keeping your login credentials secure.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Termination</h3>
                <p>We may suspend or terminate your account if misuse or breach of terms occurs.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Modifications</h3>
                <p>We reserve the right to modify these terms. Updates will be posted with a revised effective date.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
