import { useState } from 'react';

interface Step {
  id: string;
  title: string;
  fields: string[];
}

interface UseFormStepsReturn {
  currentStep: number;
  currentStepData: Step;
  nextStep: () => void;
  previousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  totalSteps: number;
}

export const useFormSteps = (steps: Step[]): UseFormStepsReturn => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    currentStepData: steps[currentStep],
    nextStep,
    previousStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    totalSteps: steps.length,
  };
};
