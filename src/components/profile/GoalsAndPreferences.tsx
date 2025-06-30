
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAssessmentPreferences } from "@/hooks/useAssessmentPreferences";
import { Target, Settings, CheckCircle, Clock } from "lucide-react";

const AVAILABLE_FOCUS_AREAS = [
  { id: 'emotional_wellbeing', label: 'Emotional Wellbeing' },
  { id: 'stress_management', label: 'Stress Management' },
  { id: 'work_life_balance', label: 'Work-Life Balance' },
  { id: 'energy_management', label: 'Energy Management' },
  { id: 'communication', label: 'Communication' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'team_dynamics', label: 'Team Dynamics' },
  { id: 'personal_growth', label: 'Personal Growth' }
];

const GoalsAndPreferences = () => {
  const [open, setOpen] = useState(false);
  const { preferences, loading, saving, savePreferences } = useAssessmentPreferences();

  const handleFocusAreaToggle = (areaId: string) => {
    const newFocusAreas = preferences.focus_areas.includes(areaId)
      ? preferences.focus_areas.filter(id => id !== areaId)
      : [...preferences.focus_areas, areaId];
    
    savePreferences({ focus_areas: newFocusAreas });
  };

  const handleFrequencyChange = (frequency: string) => {
    savePreferences({ preferred_frequency: frequency });
  };

  const handleSkipWeekendsChange = (checked: boolean) => {
    savePreferences({ skip_weekends: checked });
  };

  const handleMaxQuestionsChange = (max: number) => {
    savePreferences({ max_daily_questions: max });
  };

  if (loading) {
    return (
      <Button variant="ghost" className="w-full justify-start h-auto p-3" disabled>
        <Target className="h-4 w-4 mr-3" />
        <div className="flex-1 text-left">
          <div className="font-medium">Loading...</div>
        </div>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start h-auto p-3">
          <Target className="h-4 w-4 mr-3" />
          <div className="flex-1 text-left">
            <div className="font-medium">Goals & Preferences</div>
            <div className="text-xs text-muted-foreground">
              {preferences.focus_areas.length} focus areas selected
            </div>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Goals & Assessment Preferences</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Focus Areas Selection */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-[#CEA358]" />
              <Label className="font-semibold">Focus Areas</Label>
              <Badge variant="outline">{preferences.focus_areas.length} selected</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Choose areas you'd like to track regularly in your assessments.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_FOCUS_AREAS.map((area) => (
                <Button
                  key={area.id}
                  variant={preferences.focus_areas.includes(area.id) ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-auto p-3"
                  onClick={() => handleFocusAreaToggle(area.id)}
                  disabled={saving}
                >
                  {preferences.focus_areas.includes(area.id) && (
                    <CheckCircle className="h-3 w-3 mr-2" />
                  )}
                  <span className="text-xs">{area.label}</span>
                </Button>
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
                <Button
                  key={freq.value}
                  variant={preferences.preferred_frequency === freq.value ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleFrequencyChange(freq.value)}
                  disabled={saving}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">{freq.label}</p>
                    <p className="text-xs opacity-70">{freq.description}</p>
                  </div>
                </Button>
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
                onCheckedChange={handleSkipWeekendsChange}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Maximum Daily Questions</Label>
              <div className="flex space-x-2">
                {[3, 5, 7, 10].map((num) => (
                  <Button
                    key={num}
                    variant={preferences.max_daily_questions === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleMaxQuestionsChange(num)}
                    disabled={saving}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalsAndPreferences;
