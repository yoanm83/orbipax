"use client";

// UI Barrel Exports for Intake Module
// OrbiPax Health Philosophy Compliant

import { useCurrentStep } from '@/modules/intake/state';
import { IntakeWizardStep1Demographics } from './step1-demographics';

// Enhanced Wizard Tabs (Stepper Navigation) - Production Ready
export { EnhancedWizardTabs } from './enhanced-wizard-tabs'

// Step Components - OrbiPax Architecture Compliant
export { IntakeWizardStep1Demographics } from './step1-demographics'

// Central Wizard Content Renderer
// Single source of truth for rendering wizard steps based on store state
export function IntakeWizardContent() {
  const currentStep = useCurrentStep();

  // Central switch for step rendering
  switch (currentStep) {
    case 'demographics':
      return <IntakeWizardStep1Demographics />;

    case 'welcome':
    case 'insurance':
    case 'diagnoses':
    case 'medical-providers':
    case 'medications':
    case 'referrals':
    case 'legal-forms':
    case 'goals':
    case 'review':
      // Placeholder for unimplemented steps (no style changes)
      return (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">Step: {currentStep}</p>
            <p className="text-sm mt-2">Enhanced Wizard Tabs navigation functional</p>
            <div className="mt-4 px-4 py-2 bg-bg border border-border rounded-lg">
              <p className="text-xs text-muted-foreground">✅ Enhanced Wizard Tabs: Hardened & Production Ready</p>
              <p className="text-xs text-muted-foreground">⏳ Step Components: Ready for OrbiPax implementation</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}