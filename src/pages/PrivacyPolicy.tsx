
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
              Privacy Policy
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Personal details (name, email)</li>
                <li>Journal entries (text, audio)</li>
                <li>Reflections and responses to prompts</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>To generate AI insights and summaries</li>
                <li>To track your progress and deliver personalized content</li>
                <li>To communicate updates or support issues</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Data Security</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encrypted storage of journal data</li>
                <li>Role-based access controls for staff</li>
                <li>Secure integration with trusted AI providers</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Sharing of Information</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We do not sell or share your data with third-party marketers</li>
                <li>Anonymous, aggregate data may be used for research and product improvement</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You may request deletion of your data at any time</li>
                <li>You may export your journal data as a downloadable report</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h3>
              <p>
                Questions? Email us at{" "}
                <a 
                  href="mailto:hello@echostrong.app" 
                  className="text-[#CEA358] hover:text-purple-700 underline"
                >
                  hello@echostrong.app
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
