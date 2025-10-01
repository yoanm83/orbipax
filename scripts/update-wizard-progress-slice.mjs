#!/usr/bin/env node
/**
 * Update wizardProgress.slice.ts to use centralized constants
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const filePath = path.join(projectRoot, 'src/modules/intake/state/slices/wizardProgress.slice.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
content = content.replace(
  'import { create } from "zustand";\nimport { WIZARD_STEPS } from "../../ui/enhanced-wizard-tabs/steps.config";\nimport type { WizardStep, TransitionState, WizardFlags, StepCompletion, WizardPreferences } from "../types";',
  'import { create } from "zustand";\nimport type { WizardStep, TransitionState, WizardFlags, StepCompletion, WizardPreferences } from "../types";\nimport { INTAKE_STEP_ORDER, getNextStep, getPreviousStep } from "../constants";'
);

// 2. Replace STEP_ORDER definition
content = content.replace(
  '/** Step order for navigation logic - derived from centralized config */\nconst STEP_ORDER: WizardStep[] = WIZARD_STEPS.map(step => step.id as WizardStep);',
  '/** Step order for navigation logic - using centralized constant */\nconst STEP_ORDER = INTAKE_STEP_ORDER;'
);

// 3. Simplify nextStep
content = content.replace(
  `  nextStep: () => {
    const currentIndex = STEP_ORDER.indexOf(get().currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const nextStep = STEP_ORDER[currentIndex + 1];
      if (nextStep) {
        get().goToStep(nextStep);
      }
    }
  },`,
  `  nextStep: () => {
    const nextStep = getNextStep(get().currentStep);
    if (nextStep) {
      get().goToStep(nextStep);
    }
  },`
);

// 4. Simplify prevStep
content = content.replace(
  `  prevStep: () => {
    const currentIndex = STEP_ORDER.indexOf(get().currentStep);
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      if (prevStep) {
        get().goToStep(prevStep);
      }
    }
  },`,
  `  prevStep: () => {
    const prevStep = getPreviousStep(get().currentStep);
    if (prevStep) {
      get().goToStep(prevStep);
    }
  },`
);

// Write the updated content
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated wizardProgress.slice.ts successfully');
console.log('   - Removed dependency on UI config (WIZARD_STEPS)');
console.log('   - Now uses centralized INTAKE_STEP_ORDER');
console.log('   - Uses helper functions for navigation');