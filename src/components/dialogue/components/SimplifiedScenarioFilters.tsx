
import React from 'react';
import ScenarioDropdown from './ScenarioDropdown';
import CategoryTabs from './CategoryTabs';
import { EnhancedScenario } from '../types';

interface SimplifiedScenarioFiltersProps {
  scenarios: EnhancedScenario[];
  categories: string[];
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  scenarioCount: Record<string, number>;
  totalCount: number;
  filteredCount: number;
  onSelectScenario: (scenarioId: string) => void;
}

const SimplifiedScenarioFilters: React.FC<SimplifiedScenarioFiltersProps> = ({
  scenarios,
  categories,
  categoryFilter,
  setCategoryFilter,
  scenarioCount,
  totalCount,
  filteredCount,
  onSelectScenario
}) => {
  return (
    <div className="space-y-6">
      {/* Prominent Scenario Dropdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Quick Start</h3>
        <ScenarioDropdown
          scenarios={scenarios}
          onSelectScenario={onSelectScenario}
          placeholder="Browse all scenarios - start practicing immediately"
        />
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        scenarioCount={scenarioCount}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
        <span>
          Showing {filteredCount} of {totalCount} scenarios
        </span>
        {categoryFilter !== 'all' && (
          <button
            onClick={() => setCategoryFilter('all')}
            className="text-primary hover:text-primary/80 underline"
          >
            Show all scenarios
          </button>
        )}
      </div>
    </div>
  );
};

export default SimplifiedScenarioFilters;
