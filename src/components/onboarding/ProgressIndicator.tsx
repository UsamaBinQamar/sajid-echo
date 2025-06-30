
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full ${
              step <= currentStep ? "bg-[#CEA358]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
