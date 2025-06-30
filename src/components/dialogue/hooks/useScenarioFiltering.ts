
import { useState, useEffect } from 'react';

interface UseScenarioFilteringProps {
  scenarios: any[];
}

export const useScenarioFiltering = ({ scenarios }: UseScenarioFilteringProps) => {
  const [filteredScenarios, setFilteredScenarios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    filterScenarios();
  }, [scenarios, searchTerm, categoryFilter, difficultyFilter]);

  const filterScenarios = () => {
    let filtered = scenarios;

    if (searchTerm) {
      filtered = filtered.filter(scenario =>
        scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scenario.tags && scenario.tags.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(scenario => scenario.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(scenario => 
        scenario.difficulty_level === parseInt(difficultyFilter)
      );
    }

    setFilteredScenarios(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDifficultyFilter('all');
  };

  return {
    filteredScenarios,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    clearFilters
  };
};
