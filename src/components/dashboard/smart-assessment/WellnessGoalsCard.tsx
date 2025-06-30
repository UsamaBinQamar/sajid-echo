
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, Sparkles } from "lucide-react";
import { useWellnessGoals } from "@/hooks/useWellnessGoals";
import WellnessGoalSelector from "../WellnessGoalSelector";

const WellnessGoalsCard = () => {
  const { goals, loading: goalsLoading, isGoalCompleted, toggleGoalCompletion, createGoal } = useWellnessGoals();

  // Calculate wellness goals completion
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => isGoalCompleted(goal.id)).length;
  const allGoalsComplete = totalGoals > 0 && completedGoals === totalGoals;

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-600" />
            Your Wellness Goals
          </CardTitle>
          <div className="flex items-center gap-2">
            <WellnessGoalSelector onCreateGoal={createGoal} />
            {totalGoals > 0 && (
              <Badge variant="outline" className={`${allGoalsComplete ? 'bg-green-50 text-green-700 border-green-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                {completedGoals}/{totalGoals} Goals
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {goalsLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        ) : goals.length > 0 ? (
          <div className="space-y-3">
            {goals.map((goal) => {
              const completed = isGoalCompleted(goal.id);
              return (
                <div
                  key={goal.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-purple-300'
                  } transition-colors`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleGoalCompletion(goal.id, !completed)}
                    className={`p-0 h-6 w-6 rounded-full border-2 ${
                      completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {completed && <CheckCircle className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1">
                    <h5 className={`text-sm font-medium ${completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                      {goal.title}
                    </h5>
                    {goal.description && (
                      <p className={`text-xs ${completed ? 'text-green-600' : 'text-gray-600'}`}>
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {goal.category.replace('_', ' ')}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-600">
            <p className="text-sm mb-2">No wellness goals set for today.</p>
            <p className="text-xs text-gray-500">Add a goal to track your wellness progress!</p>
          </div>
        )}
        
        {allGoalsComplete && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Amazing! You've completed all your wellness goals today.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WellnessGoalsCard;
