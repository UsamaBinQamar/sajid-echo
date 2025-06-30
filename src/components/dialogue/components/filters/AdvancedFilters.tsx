
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedFiltersProps {
  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;
  intensityFilter: string;
  setIntensityFilter: (intensity: string) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  difficultyFilter,
  setDifficultyFilter,
  intensityFilter,
  setIntensityFilter
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-3 bg-muted/30 rounded-lg border border-border">
      <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
        <SelectTrigger className="w-full bg-background border-border text-foreground h-9 rounded-lg">
          <SelectValue placeholder="Complexity" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-card-foreground">All Complexity</SelectItem>
          <SelectItem value="1" className="text-card-foreground">Foundational</SelectItem>
          <SelectItem value="2" className="text-card-foreground">Developing</SelectItem>
          <SelectItem value="3" className="text-card-foreground">Proficient</SelectItem>
          <SelectItem value="4" className="text-card-foreground">Advanced</SelectItem>
          <SelectItem value="5" className="text-card-foreground">Expert</SelectItem>
        </SelectContent>
      </Select>

      <Select value={intensityFilter} onValueChange={setIntensityFilter}>
        <SelectTrigger className="w-full bg-background border-border text-foreground h-9 rounded-lg">
          <SelectValue placeholder="Emotional Intensity" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-card-foreground">All Intensities</SelectItem>
          <SelectItem value="1" className="text-card-foreground">Light</SelectItem>
          <SelectItem value="2" className="text-card-foreground">Moderate</SelectItem>
          <SelectItem value="3" className="text-card-foreground">Substantial</SelectItem>
          <SelectItem value="4" className="text-card-foreground">Intense</SelectItem>
          <SelectItem value="5" className="text-card-foreground">High Intensity</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AdvancedFilters;
