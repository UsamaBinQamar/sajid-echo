
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tags } from "lucide-react";
import { quickFilters } from '../../utils/categoryMappings';

interface QuickFiltersProps {
  showQuickFilters: boolean;
  setShowQuickFilters: (show: boolean) => void;
  applyQuickFilter: (searchTerms: string[]) => void;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  showQuickFilters,
  setShowQuickFilters,
  applyQuickFilter
}) => {
  if (!showQuickFilters) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tags className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Quick themes:</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQuickFilters(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Hide
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(filter.searchTerms)}
            className="text-xs border-border hover:bg-muted hover:border-primary transition-colors"
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;
