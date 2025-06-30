import SmartDailyAssessment from "@/components/dashboard/SmartDailyAssessment";
import DialogueSimulatorCard from "@/components/dashboard/DialogueSimulatorCard";
import RecentEntries from "@/components/dashboard/RecentEntries";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import DashboardInsights from "./DashboardInsights";
import LeadershipAssessmentWrapper from "@/components/leadership-assessment/LeadershipAssessmentWrapper";
import { useState } from "react";

interface DashboardGridProps {
  onNavigate: (path: string) => void;
  focusAreas?: string[];
}

const DashboardGrid = ({ onNavigate, focusAreas = [] }: DashboardGridProps) => {
  const [isSmartAssessmentComplete, setIsSmartAssessmentComplete] =
    useState(false);

  // Handler to track when smart assessment is completed
  const handleSmartAssessmentComplete = () => {
    setIsSmartAssessmentComplete(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Smart Daily Assessment */}
        <SmartDailyAssessment
          focusAreas={focusAreas}
          onComplete={handleSmartAssessmentComplete}
        />

        {/* Leadership Assessment - only show if smart assessment is complete */}
        {isSmartAssessmentComplete && <LeadershipAssessmentWrapper />}

        {/* Dialogue Simulator Card */}
        <DialogueSimulatorCard />

        {/* Today's Insights */}
        <DashboardInsights onNavigate={onNavigate} />
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Recent Journal Entries */}
        <RecentEntries />

        {/* Progress Tracker */}
        <ProgressTracker />
      </div>
    </div>
  );
};

export default DashboardGrid;
