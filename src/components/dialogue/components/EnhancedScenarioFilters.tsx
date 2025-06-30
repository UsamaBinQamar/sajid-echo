import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategoryInfo } from '../utils/categoryMappings';

interface EnhancedScenarioFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  difficultyRange: number[];
  setDifficultyRange: (range: number[]) => void;
  emotionalIntensityRange: number[];
  setEmotionalIntensityRange: (range: number[]) => void;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFocusAreas: string[];
  setSelectedFocusAreas: React.Dispatch<React.SetStateAction<string[]>>;
  availableCategories: string[];
  availableTags: string[];
  availableFocusAreas: string[];
  filteredCount: number;
  totalCount: number;
  durationRange: number[];
  setDurationRange: (range: number[]) => void;
  onClearFilters: () => void;
}

const EnhancedScenarioFilters: React.FC<EnhancedScenarioFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  difficultyRange,
  setDifficultyRange,
  emotionalIntensityRange,
  setEmotionalIntensityRange,
  selectedCategories,
  setSelectedCategories,
  selectedTags,
  setSelectedTags,
  selectedFocusAreas,
  setSelectedFocusAreas,
  availableCategories,
  availableTags,
  availableFocusAreas,
  filteredCount,
  totalCount,
  durationRange,
  setDurationRange,
  onClearFilters
}) => {
  const [showQuickFilters, setShowQuickFilters] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev: string[]) => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev: string[]) => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFocusAreaToggle = (area: string) => {
    setSelectedFocusAreas((prev: string[]) => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const hasActiveFilters = searchTerm || 
    selectedCategories.length > 0 || 
    selectedTags.length > 0 || 
    selectedFocusAreas.length > 0 ||
    difficultyRange[0] > 1 || difficultyRange[1] < 5 ||
    emotionalIntensityRange[0] > 1 || emotionalIntensityRange[1] < 5 ||
    durationRange[0] > 5 || durationRange[1] < 60;

  return (
    <div className="space-y-6 p-6 panel-ai rounded-lg">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search scenarios by title, description, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 bg-input border-border text-foreground"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <Collapsible open={showQuickFilters} onOpenChange={setShowQuickFilters}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Quick Filters
            </span>
            {showQuickFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => {
                const categoryInfo = getCategoryInfo(category);
                const isSelected = selectedCategories.includes(category);
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryToggle(category)}
                    className="text-xs h-8"
                  >
                    <span className="mr-1">{categoryInfo.icon}</span>
                    {categoryInfo.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Advanced Filters */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Advanced Filters</span>
            {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 mt-4">
          {/* Difficulty Range */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">
              Difficulty Level: {difficultyRange[0]} - {difficultyRange[1]}
            </h4>
            <Slider
              value={difficultyRange}
              onValueChange={setDifficultyRange}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>

          {/* Emotional Intensity Range */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">
              Emotional Intensity: {emotionalIntensityRange[0]} - {emotionalIntensityRange[1]}
            </h4>
            <Slider
              value={emotionalIntensityRange}
              onValueChange={setEmotionalIntensityRange}
              min={1}
              max={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Duration Range */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">
              Duration: {durationRange[0]} - {durationRange[1]} minutes
            </h4>
            <Slider
              value={durationRange}
              onValueChange={setDurationRange}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
          </div>

          {/* Focus Areas */}
          {availableFocusAreas.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Focus Areas</h4>
              <div className="grid grid-cols-2 gap-2">
                {availableFocusAreas.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedFocusAreas.includes(area)}
                      onCheckedChange={() => handleFocusAreaToggle(area)}
                    />
                    <label className="text-sm capitalize">{area}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3 text-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {availableTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Results Summary and Clear Filters */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
        <span>
          Showing {filteredCount} of {totalCount} scenarios
        </span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary hover:text-primary/80"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedScenarioFilters;
