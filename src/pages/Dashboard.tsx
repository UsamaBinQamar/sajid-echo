import Header from "@/components/layout/Header";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import SubscriptionStatus from "@/components/dashboard/SubscriptionStatus";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import DashboardRecommendations from "@/components/dashboard/DashboardRecommendations";
import { PageLoader } from "@/components/ui/page-loader";
import { useDashboard } from "@/hooks/useDashboard";

const Dashboard = () => {
  const {
    user,
    loading,
    quickMode,
    focusMode,
    userName,
    navigate,
    handleToggleQuick,
    handleToggleFocus,
  } = useDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header showBreadcrumbs={false} />
        <PageLoader variant="dashboard" title="Loading your dashboard..." />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  // Focus areas could be derived from user preferences or assessment history
  // For now, we'll use some example focus areas that would typically come from user data
  const focusAreas = ["Boundaries", "Communication", "Authenticity"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Welcome Section */}
        <WelcomeHeader
          userName={userName}
          quickMode={quickMode}
          focusMode={focusMode}
          onToggleQuick={handleToggleQuick}
          onToggleFocus={handleToggleFocus}
        />

        {/* Subscription Status */}
        <SubscriptionStatus />

        {/* Main Dashboard Grid */}
        <DashboardGrid onNavigate={navigate} focusAreas={focusAreas} />

        {/* Recommended Actions */}
        <DashboardRecommendations onNavigate={navigate} />
      </main>
    </div>
  );
};

export default Dashboard;
