
import { useOnboarding } from "@/hooks/useOnboarding";
import ProgressIndicator from "@/components/onboarding/ProgressIndicator";
import StepOne from "@/components/onboarding/StepOne";
import StepTwo from "@/components/onboarding/StepTwo";
import StepThree from "@/components/onboarding/StepThree";
import StepFour from "@/components/onboarding/StepFour";

const Onboarding = () => {
  const {
    step,
    setStep,
    pronouns,
    setPronouns,
    preferredName,
    setPreferredName,
    selectedRole,
    setSelectedRole,
    selectedFocusAreas,
    toggleFocusArea,
    reflection,
    setReflection,
    loading,
    initialLoading,
    handleComplete
  } = useOnboarding();

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f3c012] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            pronouns={pronouns}
            setPronouns={setPronouns}
            preferredName={preferredName}
            setPreferredName={setPreferredName}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <StepTwo
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <StepThree
            selectedFocusAreas={selectedFocusAreas}
            toggleFocusArea={toggleFocusArea}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        );
      case 4:
        return (
          <StepFour
            reflection={reflection}
            setReflection={setReflection}
            loading={loading}
            onComplete={handleComplete}
            onBack={() => setStep(3)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <ProgressIndicator currentStep={step} totalSteps={4} />
        <div className="flex justify-center">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
