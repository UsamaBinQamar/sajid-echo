
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Lightbulb, Target } from "lucide-react";

interface ScenarioPreparationCardProps {
  scenario: any;
}

const ScenarioPreparationCard: React.FC<ScenarioPreparationCardProps> = ({ scenario }) => {
  return (
    <div className="space-y-6">
      {/* Rich Scenario Setup */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Setting the Scene
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-200 leading-relaxed text-lg">
            {scenario.scenario_setup}
          </p>
          <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-cyan-400">
            <p className="text-slate-200 italic leading-relaxed">
              {scenario.initial_situation}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Character & Context */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-amber-300 text-lg">
              Who You're Speaking With
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-slate-200">{scenario.character_persona?.name}</h4>
              <p className="text-sm text-slate-400">{scenario.character_persona?.role}</p>
            </div>
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-medium">Background:</span> {scenario.character_persona?.background}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-300 leading-relaxed">
                <span className="font-medium">Current state:</span> {scenario.character_persona?.emotional_state}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-emerald-300 text-lg">
              Cultural & Power Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenario.cultural_context && (
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-medium text-emerald-400">Cultural Context:</span> {scenario.cultural_context}
                </p>
              </div>
            )}
            {scenario.power_dynamics && (
              <div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-medium text-emerald-400">Power Dynamics:</span> {scenario.power_dynamics}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preparation Guidance */}
      {scenario.preparation_guidance && (
        <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Preparation Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-200 leading-relaxed">
              {scenario.preparation_guidance}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Learning Objectives */}
      <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-cyan-300 flex items-center gap-2">
            <Target className="h-5 w-5" />
            What You'll Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {scenario.learning_objectives?.map((objective: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                {objective}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Advisories */}
      {(scenario.trigger_warnings || scenario.cultural_sensitivity_notes) && (
        <Card className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-300 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Content Advisory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scenario.trigger_warnings && scenario.trigger_warnings.length > 0 && (
              <div>
                <p className="text-sm font-medium text-amber-200 mb-1">Content Notice:</p>
                <p className="text-sm text-amber-100">
                  This scenario includes themes related to: {scenario.trigger_warnings.join(', ')}
                </p>
              </div>
            )}
            {scenario.cultural_sensitivity_notes && (
              <div>
                <p className="text-sm font-medium text-amber-200 mb-1">Cultural Context:</p>
                <p className="text-sm text-amber-100 leading-relaxed">
                  {scenario.cultural_sensitivity_notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScenarioPreparationCard;
