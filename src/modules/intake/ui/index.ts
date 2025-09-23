// UI Barrel Exports for Intake Module
// OrbiPax Health Philosophy Compliant
// This file re-exports from index.tsx to resolve module resolution

// Re-export everything from the TSX file
export { EnhancedWizardTabs } from './enhanced-wizard-tabs';
export { IntakeWizardStep1Demographics } from './step1-demographics';

// Re-export the central renderer from the renamed file
// Note: index.tsx needs to be renamed to a different name to avoid circular dependency
export { IntakeWizardContent } from './wizard-content';