
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeatureComparisonTable = () => {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                <th className="text-center p-4">Explorer</th>
                <th className="text-center p-4">Professional</th>
                <th className="text-center p-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="p-4">Weekly Assessments</td>
                <td className="text-center p-4">3</td>
                <td className="text-center p-4">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Journal Entries</td>
                <td className="text-center p-4">10/month</td>
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
                <td className="p-4">Leadership Simulator</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">✅</td>
                <td className="text-center p-4">✅</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">AI Insights</td>
                <td className="text-center p-4">Basic</td>
                <td className="text-center p-4">Advanced</td>
                <td className="text-center p-4">Advanced</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Team Analytics</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">✅</td>
              </tr>
              <tr className="border-b">
                <td className="p-4">Data Export</td>
                <td className="text-center p-4">❌</td>
                <td className="text-center p-4">✅</td>
                <td className="text-center p-4">✅</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureComparisonTable;
