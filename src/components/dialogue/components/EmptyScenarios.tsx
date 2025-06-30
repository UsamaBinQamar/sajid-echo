
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyScenariosProps {
  onClearFilters: () => void;
}

const EmptyScenarios: React.FC<EmptyScenariosProps> = ({ onClearFilters }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">No scenarios match your current filters.</p>
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="mt-4"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyScenarios;
