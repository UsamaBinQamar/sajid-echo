
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface CreateGoalData {
  title: string;
  description?: string;
  category: string;
  target_type: string;
  target_count: number;
}

interface WellnessGoalSelectorProps {
  onCreateGoal: (goalData: CreateGoalData) => void;
}

const WellnessGoalSelector = ({ onCreateGoal }: WellnessGoalSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [targetType, setTargetType] = useState('daily');

  const predefinedGoals = [
    {
      title: 'Daily Mindfulness Practice',
      description: 'Take 5 minutes for mindful breathing or meditation',
      category: 'stress_management'
    },
    {
      title: 'Work-Life Boundary Setting',
      description: 'End work at designated time and resist checking emails after hours',
      category: 'work_life_balance'
    },
    {
      title: 'Team Connection',
      description: 'Have one meaningful conversation with a team member',
      category: 'leadership_growth'
    },
    {
      title: 'Physical Movement',
      description: 'Take a 10-minute walk or stretch break',
      category: 'general'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateGoal({
      title: title.trim(),
      description: description.trim(),
      category,
      target_type: targetType,
      target_count: 1
    });

    setTitle('');
    setDescription('');
    setCategory('general');
    setTargetType('daily');
    setOpen(false);
  };

  const handlePredefinedGoal = (goal: any) => {
    onCreateGoal({
      ...goal,
      target_type: 'daily',
      target_count: 1
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Wellness Goal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Add</Label>
            <div className="grid grid-cols-1 gap-2">
              {predefinedGoals.map((goal, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePredefinedGoal(goal)}
                  className="text-left h-auto p-3 flex flex-col items-start"
                >
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-xs text-muted-foreground">{goal.description}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium">Or Create Custom Goal</Label>
            <form onSubmit={handleSubmit} className="space-y-3 mt-2">
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Take a lunch break"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your goal"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Wellness</SelectItem>
                    <SelectItem value="stress_management">Stress Management</SelectItem>
                    <SelectItem value="work_life_balance">Work-Life Balance</SelectItem>
                    <SelectItem value="leadership_growth">Leadership Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                Create Goal
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WellnessGoalSelector;
