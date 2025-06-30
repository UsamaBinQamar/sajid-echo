import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Smile } from "lucide-react";
const moods = [{
  emoji: "😊",
  label: "Great",
  value: 5,
  color: "text-success"
}, {
  emoji: "🙂",
  label: "Good",
  value: 4,
  color: "text-primary"
}, {
  emoji: "😐",
  label: "Okay",
  value: 3,
  color: "text-muted-foreground"
}, {
  emoji: "😔",
  label: "Low",
  value: 2,
  color: "text-accent"
}, {
  emoji: "😞",
  label: "Struggling",
  value: 1,
  color: "text-destructive"
}];
const MoodCheckIn = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };
  const handleSubmit = () => {
    if (selectedMood) {
      setHasCheckedIn(true);
      // Here you would typically save to your backend
      console.log("Mood saved:", selectedMood);
    }
  };
  if (hasCheckedIn) {
    return <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-card-foreground">
            <Heart className="h-5 w-5 mr-2 text-success" />
            Check-in Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-muted-foreground text-sm">
            Thanks for checking in! Your mood has been recorded.
          </p>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-card-foreground">
          <Smile className="h-5 w-5 mr-2 text-primary" />
          Daily Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-black ">
          How are you feeling about your leadership today?
        </p>
        
        <div className="grid grid-cols-5 gap-2">
          {moods.map(mood => <button key={mood.value} onClick={() => handleMoodSelect(mood.value)} className={`p-2 rounded-lg border transition-all duration-200 ${selectedMood === mood.value ? "border-primary bg-primary/10 scale-110" : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"}`}>
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className={`text-xs font-medium ${mood.color}`}>
                {mood.label}
              </div>
            </button>)}
        </div>

        {selectedMood && <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Check-in
          </Button>}
      </CardContent>
    </Card>;
};
export default MoodCheckIn;