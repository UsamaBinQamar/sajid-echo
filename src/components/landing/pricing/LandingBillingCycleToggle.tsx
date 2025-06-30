
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface LandingBillingCycleToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

const LandingBillingCycleToggle = ({ billingCycle, onBillingCycleChange }: LandingBillingCycleToggleProps) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span className={billingCycle === 'monthly' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
        Monthly
      </span>
      <Switch
        checked={billingCycle === 'yearly'}
        onCheckedChange={(checked) => onBillingCycleChange(checked ? 'yearly' : 'monthly')}
      />
      <span className={billingCycle === 'yearly' ? 'font-semibold text-foreground' : 'text-muted-foreground'}>
        Yearly
      </span>
      <Badge variant="outline" className="text-green-600 border-green-600">
        Save up to 20%
      </Badge>
    </div>
  );
};

export default LandingBillingCycleToggle;
