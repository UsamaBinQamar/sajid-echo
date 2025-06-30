
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ScenarioFiltersProps {
  selectedCategory: string;
  selectedIntensity: number | null;
  categories: string[];
  onCategoryChange: (category: string) => void;
  onIntensityChange: (intensity: number | null) => void;
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'authentic_leadership': 'Authentic Leadership',
    'boundaries_burnout': 'Boundaries & Burnout',
    'power_identity_politics': 'Power, Identity & Politics',
    'team_dynamics': 'Team Dynamics'
  };
  return labels[category] || category;
};

const ScenarioFilters: React.FC<ScenarioFiltersProps> = ({
  selectedCategory,
  selectedIntensity,
  categories,
  onCategoryChange,
  onIntensityChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange('all')}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                >
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Intensity Level</label>
            <div className="flex gap-2">
              <Button
                variant={selectedIntensity === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => onIntensityChange(null)}
              >
                All
              </Button>
              {[1, 2, 3, 4, 5].map(level => (
                <Button
                  key={level}
                  variant={selectedIntensity === level ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onIntensityChange(level)}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioFilters;
