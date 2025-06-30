
import React, { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";
import { getCategoryInfo } from '../utils/categoryMappings';
import { EnhancedScenario } from '../types';

interface ScenarioDropdownProps {
  scenarios: EnhancedScenario[];
  onSelectScenario: (scenarioId: string) => void;
  placeholder?: string;
}

const ScenarioDropdown: React.FC<ScenarioDropdownProps> = ({
  scenarios,
  onSelectScenario,
  placeholder = "Browse all scenarios..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredScenarios = useMemo(() => {
    if (!searchTerm) return scenarios;
    
    return scenarios.filter(scenario => 
      scenario.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(scenario.tags) && scenario.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }, [scenarios, searchTerm]);

  const handleScenarioSelect = (scenarioId: string) => {
    onSelectScenario(scenarioId);
    setIsOpen(false);
    setSearchTerm('');
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'text-green-600';
      case 2: return 'text-blue-600';
      case 3: return 'text-yellow-600';
      case 4: return 'text-orange-600';
      case 5: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative">
      <Select open={isOpen} onOpenChange={setIsOpen}>
        <SelectTrigger className="w-full bg-input border-border text-foreground h-12 rounded-lg text-left">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border w-full max-h-80">
          {/* Search within dropdown */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-8"
              />
            </div>
          </div>
          
          {/* Scenario list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredScenarios.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No scenarios found
              </div>
            ) : (
              filteredScenarios.map((scenario) => {
                const categoryInfo = getCategoryInfo(scenario.category || '');
                return (
                  <SelectItem
                    key={scenario.id}
                    value={scenario.id}
                    className="text-card-foreground cursor-pointer hover:bg-muted p-3"
                    onSelect={() => handleScenarioSelect(scenario.id)}
                  >
                    <div className="w-full">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm line-clamp-1">{scenario.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(scenario.difficulty_level || 1)}`}>
                          {getDifficultyLabel(scenario.difficulty_level || 1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {scenario.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {categoryInfo.icon} {categoryInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {scenario.estimated_duration_minutes || 15}min
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScenarioDropdown;
