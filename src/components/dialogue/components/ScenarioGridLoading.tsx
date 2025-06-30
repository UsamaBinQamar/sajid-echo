
import React from 'react';

const ScenarioGridLoading: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-cyan-400 border-t-transparent mx-auto mb-6"></div>
        <p className="text-slate-300 text-lg">Loading leadership scenarios...</p>
      </div>
    </div>
  );
};

export default ScenarioGridLoading;
