
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/useNavigation";

interface QuickActionsProps {
  user: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({ user }) => {
  const { navigationActions } = useNavigation();

  if (!user) return null;

  // Get the primary action (New Journal Entry)
  const primaryAction = navigationActions.find(action => 
    action.title === "New Journal Entry" && action.showOnDesktop
  );

  if (!primaryAction) return null;

  return (
    <div className="hidden lg:flex items-center space-x-2">
      <Button
        onClick={primaryAction.action}
        variant={primaryAction.variant || "default"}
        className="flex items-center gap-2"
        size="sm"
      >
        {primaryAction.icon}
        <span className="hidden xl:inline">{primaryAction.shortTitle || primaryAction.title}</span>
      </Button>
    </div>
  );
};

export default QuickActions;
