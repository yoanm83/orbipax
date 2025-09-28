"use client";

// UI Barrel Exports for Intake Module
// OrbiPax Health Philosophy Compliant

import { useCurrentStep } from '@/modules/intake/state';

import { WelcomeStep } from './step0-welcome';
import { IntakeWizardStep1Demographics } from './step1-demographics';
import { Step2EligibilityInsurance } from './step2-eligibility-insurance';
import { Step3DiagnosesClinical } from './step3-diagnoses-clinical';
import { Step4MedicalProviders } from './step4-medical-providers';
import { Step5Medications } from './step5-medications';
import { Step6ReferralsServices } from './step6-referrals-services';
import { Step7LegalConsents } from './step9-legal-consents';
import { Step8TreatmentGoals } from './step8-treatment-goals';
import { Step10Review } from './step10-review';

// Enhanced Wizard Tabs (Stepper Navigation) - Production Ready
export { EnhancedWizardTabs } from './enhanced-wizard-tabs'

// Step Components - OrbiPax Architecture Compliant
export { IntakeWizardStep1Demographics } from './step1-demographics'

// Central Wizard Content Renderer
// Single source of truth for rendering wizard steps based on store state
export function IntakeWizardContent() {
  const currentStep = useCurrentStep();

  // Wrap content in tabpanel for ARIA compliance
  const renderContent = () => {
    switch (currentStep) {
      case 'demographics':
        return <IntakeWizardStep1Demographics />;

      case 'insurance':
        return <Step2EligibilityInsurance />;

      case 'diagnoses':
        return <Step3DiagnosesClinical />;

      case 'medical-providers':
        return <Step4MedicalProviders />;

      case 'medications':
        return <Step5Medications />;

      case 'referrals':
        return <Step6ReferralsServices />;

      case 'legal-forms':
        return <Step7LegalConsents />;

      case 'goals':
        return <Step8TreatmentGoals />;

      case 'review':
        return <Step10Review />;

      case 'welcome':
        return <WelcomeStep />;

      default:
        return null;
    }
  };

  const content = renderContent();

  // Return null if no content to render
  if (!content) {
    return null;
  }

  // Wrap in tabpanel with proper ARIA attributes
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${currentStep}`}
      aria-labelledby={`tab-${currentStep}`}
      tabIndex={0}
    >
      {content}
    </div>
  );
}