
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface BillingCycleToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

const BillingCycleToggle = ({ billingCycle, onBillingCycleChange }: BillingCycleToggleProps) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <span className={billingCycle === 'monthly' ? 'font-semibold' : 'text-gray-600'}>
        Monthly
      </span>
      <Switch
        checked={billingCycle === 'yearly'}
        onCheckedChange={(checked) => onBillingCycleChange(checked ? 'yearly' : 'monthly')}
      />
      <span className={billingCycle === 'yearly' ? 'font-semibold' : 'text-gray-600'}>
        Yearly
      </span>
      <Badge variant="outline" className="text-green-600">
        Save up to 20%
      </Badge>
    </div>
  );
};

export default BillingCycleToggle;
