
import { useState, useEffect, useMemo } from 'react';
import { commonSearchTerms } from '../utils/categoryMappings';

interface UseEnhancedScenarioFilteringProps {
  scenarios: any[];
}

export const useEnhancedScenarioFiltering = ({ scenarios }: UseEnhancedScenarioFilteringProps) => {
  const [filteredScenarios, setFilteredScenarios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [intensityFilter, setIntensityFilter] = useState('all');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  // Enhanced search that includes more fields and handles null/undefined values safely
  const enhancedSearch = (scenario: any, term: string): boolean => {
    if (!term) return true;
    
    const searchLower = term.toLowerCase();
    
    // Safely extract search fields, handling null/undefined values
    const searchFields = [
      scenario.title,
      scenario.description,
      scenario.initial_situation,
      scenario.cultural_context,
      scenario.power_dynamics,
      ...(Array.isArray(scenario.tags) ? scenario.tags : []),
      ...(Array.isArray(scenario.focus_areas) ? scenario.focus_areas : []),
      ...(Array.isArray(scenario.learning_objectives) ? scenario.learning_objectives : [])
    ].filter(field => field && typeof field === 'string'); // Filter out null, undefined, and non-string values

    console.log('Searching scenario:', scenario.title, 'with fields:', searchFields.length);
    
    return searchFields.some(field => 
      field.toLowerCase().includes(searchLower)
    );
  };

  // Rotating search placeholders
  const searchPlaceholders = [
    'Search scenarios...',
    'Try "difficult conversation"',
    'Try "team conflict"',
    'Try "giving feedback"',
    'Try "setting boundaries"'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % searchPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterScenarios();
  }, [scenarios, searchTerm, categoryFilter, difficultyFilter, intensityFilter]);

  const filterScenarios = () => {
    console.log('Filtering scenarios, total:', scenarios.length);
    console.log('Filters:', { searchTerm, categoryFilter, difficultyFilter, intensityFilter });
    
    let filtered = scenarios;

    // Enhanced search
    if (searchTerm) {
      filtered = filtered.filter(scenario => enhancedSearch(scenario, searchTerm));
      console.log('After search filter:', filtered.length);
    }

    // Category filter - handle null/undefined categories safely
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(scenario => 
        scenario.category && scenario.category === categoryFilter
      );
      console.log('After category filter:', filtered.length);
    }

    // Difficulty filter - handle null/undefined difficulty levels safely
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(scenario => 
        scenario.difficulty_level !== null && 
        scenario.difficulty_level !== undefined &&
        scenario.difficulty_level === parseInt(difficultyFilter)
      );
      console.log('After difficulty filter:', filtered.length);
    }

    // Intensity filter - handle null/undefined intensity levels safely
    if (intensityFilter !== 'all') {
      filtered = filtered.filter(scenario => 
        scenario.emotional_intensity_level !== null && 
        scenario.emotional_intensity_level !== undefined &&
        scenario.emotional_intensity_level === parseInt(intensityFilter)
      );
      console.log('After intensity filter:', filtered.length);
    }

    console.log('Final filtered scenarios:', filtered.length);
    setFilteredScenarios(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setDifficultyFilter('all');
    setIntensityFilter('all');
  };

  const applyQuickFilter = (searchTerms: string[]) => {
    // Find scenarios that match any of the search terms
    const matchingScenarios = scenarios.filter(scenario =>
      searchTerms.some(term => enhancedSearch(scenario, term))
    );
    console.log('Quick filter applied:', searchTerms, 'matched:', matchingScenarios.length);
    setSearchTerm(searchTerms[0]); // Set the first term as the search
  };

  const categories = useMemo(() => {
    // Safely extract categories, filtering out null/undefined values
    const validCategories = scenarios
      .map(s => s.category)
      .filter(category => category && typeof category === 'string');
    return [...new Set(validCategories)];
  }, [scenarios]);

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const allTerms = new Set<string>();
    
    scenarios.forEach(scenario => {
      // Add focus areas safely
      if (Array.isArray(scenario.focus_areas)) {
        scenario.focus_areas.forEach((area: string) => {
          if (area && typeof area === 'string' && area.toLowerCase().includes(searchTerm.toLowerCase())) {
            allTerms.add(area);
          }
        });
      }
      
      // Add tags safely
      if (Array.isArray(scenario.tags)) {
        scenario.tags.forEach((tag: string) => {
          if (tag && typeof tag === 'string' && tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            allTerms.add(tag);
          }
        });
      }
    });

    // Add common terms that match
    commonSearchTerms.forEach(term => {
      if (term.toLowerCase().includes(searchTerm.toLowerCase())) {
        allTerms.add(term);
      }
    });

    return Array.from(allTerms).slice(0, 5);
  }, [searchTerm, scenarios]);

  return {
    filteredScenarios,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    intensityFilter,
    setIntensityFilter,
    clearFilters,
    applyQuickFilter,
    categories,
    suggestions,
    currentPlaceholder: searchPlaceholders[currentPlaceholder],
    totalCount: scenarios.length,
    filteredCount: filteredScenarios.length
  };
};
