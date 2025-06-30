
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ScenarioGridFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  difficultyFilter: string;
  setDifficultyFilter: (difficulty: string) => void;
  categories: string[];
}

const ScenarioGridFilters: React.FC<ScenarioGridFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  difficultyFilter,
  setDifficultyFilter,
  categories
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search scenarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-ai h-10 rounded-lg focus:border-primary transition-colors"
        />
      </div>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full lg:w-56 bg-input border-border text-foreground h-10 rounded-lg">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-card-foreground">All Categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category} className="text-card-foreground">
              {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
        <SelectTrigger className="w-full lg:w-48 bg-input border-border text-foreground h-10 rounded-lg">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-card-foreground">All Levels</SelectItem>
          <SelectItem value="1" className="text-card-foreground">Beginner</SelectItem>
          <SelectItem value="2" className="text-card-foreground">Intermediate</SelectItem>
          <SelectItem value="3" className="text-card-foreground">Advanced</SelectItem>
          <SelectItem value="4" className="text-card-foreground">Expert</SelectItem>
          <SelectItem value="5" className="text-card-foreground">Master</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScenarioGridFilters;
