
import UnifiedInsightsCard from "./UnifiedInsightsCard";

// Backward compatibility wrapper - now just uses the unified card
const InsightsOverviewCard = () => {
  return <UnifiedInsightsCard mode="compact" />;
};

export default InsightsOverviewCard;
