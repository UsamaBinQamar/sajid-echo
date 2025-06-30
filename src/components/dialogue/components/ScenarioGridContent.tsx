
import React from 'react';
import ConsistentScenarioCard from './ConsistentScenarioCard';
import EmptyScenarios from './EmptyScenarios';

interface ScenarioGridContentProps {
  filteredScenarios: any[];
  onStartScenario: (scenarioId: string) => void;
  loading: boolean;
  onClearFilters: () => void;
}

const ScenarioGridContent: React.FC<ScenarioGridContentProps> = ({
  filteredScenarios,
  onStartScenario,
  loading,
  onClearFilters
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 loading-ai rounded-lg theme-transition" />
        ))}
      </div>
    );
  }

  if (filteredScenarios.length === 0) {
    return <EmptyScenarios onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {filteredScenarios.map((scenario) => (
        <div key={scenario.id} className="card-ai interactive-ai">
          <ConsistentScenarioCard
            scenario={scenario}
            onStartScenario={onStartScenario}
          />
        </div>
      ))}
    </div>
  );
};

export default ScenarioGridContent;
