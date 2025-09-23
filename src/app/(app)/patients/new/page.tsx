"use client";

import { EnhancedWizardTabs, IntakeWizardContent } from "@/modules/intake/ui";
import { useCurrentStep, useWizardProgressStore, type WizardStep } from "@/modules/intake/state";
import { handleCreatePatient } from "./actions";

export default function NewPatientPage() {
  // Use store for wizard navigation state (single source of truth)
  const currentStep = useCurrentStep();
  const { goToStep } = useWizardProgressStore();

  // Handle stepper navigation - dispatches to store only
  const handleStepClick = (stepId: string) => {
    goToStep(stepId as WizardStep);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <a
            href="/(app)/patients"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Patients
          </a>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Patient Intake Wizard</h1>
          <p className="text-gray-600 mt-2">Complete patient onboarding process</p>
        </div>
      </div>

      {/* Intake Wizard */}
      <div className="mb-8">
        <div className="bg-bg border border-border rounded-lg p-6">
          {/* Enhanced Wizard Tabs (Stepper) - Controlled Component */}
          <div className="mb-8">
            <EnhancedWizardTabs
              currentStep={currentStep}
              onStepClick={handleStepClick}
              allowSkipAhead={false}
              showProgress={true}
            />
          </div>

          {/* Step Content - Rendered via Central Renderer */}
          <div className="min-h-[600px]">
            <IntakeWizardContent />
          </div>
        </div>
      </div>
    </div>
  );
}