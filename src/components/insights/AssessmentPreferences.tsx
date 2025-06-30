
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Settings, Target, Clock, CheckCircle } from "lucide-react";

interface AssessmentPreferences {
  focus_areas: string[];
  preferred_frequency: string;
  skip_weekends: boolean;
  max_daily_questions: number;
}

const AVAILABLE_FOCUS_AREAS = [
  { id: 'emotional_wellbeing', label: 'Emotional Wellbeing', description: 'Mood, feelings, emotional regulation' },
  { id: 'stress_management', label: 'Stress Management', description: 'Stress levels, coping strategies' },
  { id: 'work_life_balance', label: 'Work-Life Balance', description: 'Balance between work and personal life' },
  { id: 'energy_management', label: 'Energy Management', description: 'Physical and mental energy levels' },
  { id: 'communication', label: 'Communication', description: 'Interpersonal communication skills' },
  { id: 'leadership', label: 'Leadership', description: 'Leadership skills and challenges' },
  { id: 'team_dynamics', label: 'Team Dynamics', description: 'Team relationships and collaboration' },
  { id: 'personal_growth', label: 'Personal Growth', description: 'Self-development and learning' }
];

const AssessmentPreferences = () => {
  const [preferences, setPreferences] = useState<AssessmentPreferences>({
    focus_areas: [],
    preferred_frequency: 'adaptive',
    skip_weekends: false,
    max_daily_questions: 3
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile focus areas
      const { data: profile } = await supabase
        .from('profiles')
        .select('focus_areas')
        .eq('id', user.id)
        .single();

      // Get assessment preferences
      const { data: prefs } = await supabase
        .from('user_assessment_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setPreferences({
        focus_areas: profile?.focus_areas || [],
        preferred_frequency: prefs?.preferred_frequency || 'adaptive',
        skip_weekends: prefs?.skip_weekends || false,
        max_daily_questions: prefs?.max_daily_questions || 3
      });
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocusAreaToggle = (areaId: string) => {
    setPreferences(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.includes(areaId)
        ? prev.focus_areas.filter(id => id !== areaId)
        : [...prev.focus_areas, areaId]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile focus areas
      await supabase
        .from('profiles')
        .update({ focus_areas: preferences.focus_areas })
        .eq('id', user.id);

      // Update or insert assessment preferences
      await supabase
        .from('user_assessment_preferences')
        .upsert({
          user_id: user.id,
          preferred_frequency: preferences.preferred_frequency,
          skip_weekends: preferences.skip_weekends,
          max_daily_questions: preferences.max_daily_questions,
          focus_areas_priority: preferences.focus_areas
        });

      toast({
        title: "Preferences Updated! ✅",
        description: "Your assessment preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CEA358]"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-600" />
          Assessment Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Focus Areas Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-[#CEA358]" />
            <Label className="font-semibold">Focus Areas</Label>
            <Badge variant="outline">{preferences.focus_areas.length} selected</Badge>
          </div>
          <p className="text-sm text-gray-600">
            Choose areas you'd like to track regularly. This will include additional targeted questions in your daily assessments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AVAILABLE_FOCUS_AREAS.map((area) => (
              <div
                key={area.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  preferences.focus_areas.includes(area.id)
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handleFocusAreaToggle(area.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{area.label}</span>
                  {preferences.focus_areas.includes(area.id) && (
                    <CheckCircle className="h-4 w-4 text-[#CEA358]" />
                  )}
                </div>
                <p className="text-xs text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Frequency */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <Label className="font-semibold">Assessment Frequency</Label>
          </div>
          <div className="space-y-2">
            {[
              { value: 'daily', label: 'Daily', description: 'Complete assessments every day' },
              { value: 'adaptive', label: 'Adaptive (Recommended)', description: 'Smart frequency based on your patterns' },
              { value: 'weekly', label: 'Weekly', description: 'Complete assessments once per week' }
            ].map((freq) => (
              <div
                key={freq.value}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  preferences.preferred_frequency === freq.value
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPreferences(prev => ({ ...prev, preferred_frequency: freq.value }))}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{freq.label}</p>
                    <p className="text-xs text-gray-600">{freq.description}</p>
                  </div>
                  {preferences.preferred_frequency === freq.value && (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Settings */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="skip-weekends" className="font-medium">Skip Weekends</Label>
              <p className="text-sm text-gray-600">Don't send assessment reminders on weekends</p>
            </div>
            <Switch
              id="skip-weekends"
              checked={preferences.skip_weekends}
              onCheckedChange={(checked) => 
                setPreferences(prev => ({ ...prev, skip_weekends: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Maximum Daily Questions</Label>
            <p className="text-sm text-gray-600">Limit the total number of questions per day</p>
            <div className="flex space-x-2">
              {[3, 5, 7, 10].map((num) => (
                <Button
                  key={num}
                  variant={preferences.max_daily_questions === num ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreferences(prev => ({ ...prev, max_daily_questions: num }))}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssessmentPreferences;
