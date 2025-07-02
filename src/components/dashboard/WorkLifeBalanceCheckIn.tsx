
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const questions = [{
  text: "I have had enough time in my day to manage both work and personal responsibilities without feeling overwhelmed.",
  emojis: ["😩", "😕", "😐", "🙂", "😌"]
}, {
  text: "I have felt mentally and physically energized during both work and personal time.",
  emojis: ["😴", "😓", "😐", "😊", "⚡"]
}, {
  text: "I've been able to set and maintain healthy boundaries between work and personal life.",
  emojis: ["😵", "😬", "😐", "😌", "🧘"]
}];

const WorkLifeBalanceCheckIn = () => {
  const [scores, setScores] = useState(Array(questions.length).fill(null));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmojiSelect = (questionIndex: number, emojiIndex: number) => {
    const newScores = [...scores];
    newScores[questionIndex] = emojiIndex + 1;
    setScores(newScores);
  };

  const getStatusCategory = (percentage: number) => {
    if (percentage >= 80) return "Thriving";
    if (percentage >= 60) return "Balanced but worth monitoring";
    if (percentage >= 40) return "Strained – consider small changes";
    return "At risk – may need active intervention or rebalancing";
  };

  const handleSubmit = async () => {
    if (scores.some(score => score === null)) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please log in to save your assessment.",
          variant: "destructive",
        });
        return;
      }

      const total = scores.reduce((acc, score) => acc + score, 0);
      const maxScore = questions.length * 5;
      const percentage = Math.round((total / maxScore) * 100);
      const statusCategory = getStatusCategory(percentage);

      const { error } = await supabase
        .from("work_life_balance_assessments")
        .insert({
          user_id: session.user.id,
          question_1_score: scores[0],
          question_1_notes: null,
          question_2_score: scores[1],
          question_2_notes: null,
          question_3_score: scores[2],
          question_3_notes: null,
          total_score: total,
          percentage: percentage,
          status_category: statusCategory
        });

      if (error) {
        console.error("Error saving assessment:", error);
        
        if (error.code === "23505") {
          toast({
            title: "Assessment Already Submitted",
            description: "You've already completed your work-life balance check-in for today. Come back tomorrow!",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error Saving Assessment",
            description: "Failed to save your assessment. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      // Reset form and show success
      setScores(Array(questions.length).fill(null));

      toast({
        title: "Assessment Saved! 🌿",
        description: `Your score: ${total}/${maxScore} (${percentage}%) - ${statusCategory}`,
      });

    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          🌿 Work-Life Balance Check-In
        </CardTitle>
        <p className="text-sm text-muted-foreground">How have you been showing up for yourself?</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {question.text}
            </p>
            <div className="flex justify-between items-center space-x-2">
              {question.emojis.map((emoji, emojiIndex) => {
                const isSelected = scores[questionIndex] === emojiIndex + 1;
                return (
                  <Button
                    key={emojiIndex}
                    variant={isSelected ? "default" : "ghost"}
                    onClick={() => handleEmojiSelect(questionIndex, emojiIndex)}
                    disabled={loading}
                    className={`text-2xl h-12 w-12 p-0 ${
                      isSelected 
                        ? "bg-gradient-to-r from-[#f3c012] to-blue-600" 
                        : "hover:bg-accent"
                    }`}
                  >
                    {emoji}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-gradient-to-r from-[#f3c012] to-blue-600 hover:from-purple-700 hover:to-blue-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Check-In"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkLifeBalanceCheckIn;
