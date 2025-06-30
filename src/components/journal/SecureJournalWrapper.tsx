import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/security/ProtectedRoute";
import { SecurityMonitor } from "@/components/security/SecurityMonitor";
import Header from "@/components/layout/Header";

interface SecureJournalWrapperProps {
  children: ReactNode;
}

const SecureJournalWrapper = ({ children }: SecureJournalWrapperProps) => {
  return (
    <ProtectedRoute>
      <SecurityMonitor />
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="mb-8 bg-card text-card-foreground rounded-xl p-6 shadow-soft">
            <h1 className="text-4xl font-bold mb-4 font-display">
              Your Reflection Space
            </h1>
            <p className="text-xl">
              This is your safe space to explore, reflect, and grow as a leader.
            </p>
          </div>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SecureJournalWrapper;
