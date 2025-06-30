
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ResultsSummaryProps {
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  showQuickFilters: boolean;
  setShowQuickFilters: (show: boolean) => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  filteredCount,
  totalCount,
  hasActiveFilters,
  clearFilters,
  showQuickFilters,
  setShowQuickFilters
}) => {
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div>
        Showing {filteredCount} of {totalCount} scenarios
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-2 text-xs text-primary hover:text-primary-dark"
          >
            <Filter className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
      {!showQuickFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowQuickFilters(true)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Show quick themes
        </Button>
      )}
    </div>
  );
};

export default ResultsSummary;
