
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EnhancedDialogueSimulator from "@/components/dialogue/EnhancedDialogueSimulator";
import FeatureGate from "@/components/subscription/FeatureGate";
import { DesignSystemAuditPanel } from "@/components/dev/DesignSystemAuditPanel";

const DialogueSimulator = () => {
  return (
    <div className="min-h-screen bg-background theme-transition">
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-professional-md py-professional-xl">
          <FeatureGate feature="dialogue_simulator" requiredTier="Professional">
            <EnhancedDialogueSimulator />
          </FeatureGate>
        </main>
        <Footer />
      </div>
      
      {/* Development Mode Design Audit Panel */}
      <DesignSystemAuditPanel />
    </div>
  );
};

export default DialogueSimulator;
