
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PricingFeatureTable = () => {
  return (
    <div className="mt-16 max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Explorer</th>
                  <th className="text-center p-4 font-semibold">Professional</th>
                  <th className="text-center p-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Weekly Assessments</td>
                  <td className="text-center p-4">3</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Monthly Journal Entries</td>
                  <td className="text-center p-4">10</td>
                  <td className="text-center p-4">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b bg-blue-50">
                  <td className="p-4 font-medium">Voice Journaling</td>
                  <td className="text-center p-4">
                    <span className="text-blue-600 font-medium">4/month</span>
                    <div className="text-xs text-gray-500">(5 min max)</div>
                  </td>
                  <td className="text-center p-4">
                    <span className="text-green-600 font-medium">Daily</span>
                    <div className="text-xs text-gray-500">(20 min max)</div>
                  </td>
                  <td className="text-center p-4">
                    <span className="text-green-600 font-medium">Daily</span>
                    <div className="text-xs text-gray-500">(20 min max)</div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Leadership Simulator</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">AI Insights</td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                  <td className="text-center p-4">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Team Features</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Data Export</td>
                  <td className="text-center p-4">❌</td>
                  <td className="text-center p-4">✅</td>
                  <td className="text-center p-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingFeatureTable;
