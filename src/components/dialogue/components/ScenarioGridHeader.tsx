
import React from 'react';

const ScenarioGridHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-ai-gradient mb-4 font-display">
        AI Leadership Simulator
      </h1>
      <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg">Practice the conversations that shape your leadership, because navigating power, identity, and purpose shouldn't be guesswork.</p>
      <div className="mt-4 flex justify-center">
        <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
      </div>
    </div>
  );
};

export default ScenarioGridHeader;
