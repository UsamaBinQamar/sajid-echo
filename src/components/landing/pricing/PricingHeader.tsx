
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface PricingHeaderProps {
  isYearly: boolean;
  onToggleYearly: (yearly: boolean) => void;
}

const PricingHeader = ({ isYearly, onToggleYearly }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Choose Your Leadership Journey
      </h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        Select the perfect plan to enhance your leadership development and unlock your potential
      </p>
      
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <span className={`${!isYearly ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={onToggleYearly}
        />
        <span className={`${isYearly ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          Yearly
        </span>
        <Badge variant="outline" className="text-green-600 border-green-300">
          Save 20%
        </Badge>
      </div>
    </div>
  );
};

export default PricingHeader;
