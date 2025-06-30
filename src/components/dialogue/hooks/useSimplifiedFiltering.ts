
import { useState, useEffect, useMemo } from 'react';
import { EnhancedScenario } from '../types';

interface UseSimplifiedFilteringProps {
  scenarios: EnhancedScenario[];
}

export const useSimplifiedFiltering = ({ scenarios }: UseSimplifiedFilteringProps) => {
  const [filteredScenarios, setFilteredScenarios] = useState<EnhancedScenario[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    filterScenarios();
  }, [scenarios, categoryFilter]);

  const filterScenarios = () => {
    console.log('Filtering scenarios, total:', scenarios.length);
    console.log('Category filter:', categoryFilter);
    
    let filtered = scenarios;

    // Category filter - handle null/undefined categories safely
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(scenario => 
        scenario.category && scenario.category === categoryFilter
      );
      console.log('After category filter:', filtered.length);
    }

    console.log('Final filtered scenarios:', filtered.length);
    setFilteredScenarios(filtered);
  };

  const clearFilters = () => {
    setCategoryFilter('all');
  };

  const categories = useMemo(() => {
    // Safely extract categories, filtering out null/undefined values
    const validCategories = scenarios
      .map(s => s.category)
      .filter(category => category && typeof category === 'string');
    return [...new Set(validCategories)];
  }, [scenarios]);

  // Calculate scenario count per category
  const scenarioCount = useMemo(() => {
    const counts: Record<string, number> = {
      all: scenarios.length
    };
    
    categories.forEach(category => {
      counts[category] = scenarios.filter(s => s.category === category).length;
    });
    
    return counts;
  }, [scenarios, categories]);

  return {
    filteredScenarios,
    categoryFilter,
    setCategoryFilter,
    clearFilters,
    categories,
    scenarioCount,
    totalCount: scenarios.length,
    filteredCount: filteredScenarios.length
  };
};
