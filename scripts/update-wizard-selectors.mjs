#!/usr/bin/env node
/**
 * Update wizard.selectors.ts to use centralized constants
 * This script removes duplicated stepOrder arrays
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const filePath = path.join(projectRoot, 'src/modules/intake/state/selectors/wizard.selectors.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import for constants
const importLine = 'import type { WizardStep } from "../types";';
const newImports = `import type { WizardStep } from "../types";
import { INTAKE_STEP_ORDER, getStepIndex, getNextStep, getPreviousStep, getStepProgress, isLastStep, isFirstStep } from "../constants";`;

content = content.replace(importLine, newImports);

// 2. Replace useCanAdvance
const oldCanAdvance = /export const useCanAdvance = \(\) =>\s*useWizardProgressStore\(\(state\) => \{[\s\S]*?return !isLastStep && \(state\.isCurrentStepValid \|\| state\.allowSkipAhead\);[\s\S]*?\}\);/;
const newCanAdvance = `export const useCanAdvance = () =>
  useWizardProgressStore((state) => {
    const isLast = isLastStep(state.currentStep);
    return !isLast && (state.isCurrentStepValid || state.allowSkipAhead);
  });`;

content = content.replace(oldCanAdvance, newCanAdvance);

// 3. Replace useCanGoBack
const oldCanGoBack = /export const useCanGoBack = \(\) =>\s*useWizardProgressStore\(\(state\) => \{[\s\S]*?return currentIndex > 0;[\s\S]*?\}\);/;
const newCanGoBack = `export const useCanGoBack = () =>
  useWizardProgressStore((state) => {
    return !isFirstStep(state.currentStep);
  });`;

content = content.replace(oldCanGoBack, newCanGoBack);

// 4. Replace useProgressPercentage
const oldProgress = /export const useProgressPercentage = \(\) =>\s*useWizardProgressStore\(\(state\) => \{[\s\S]*?return Math\.round[\s\S]*?\}\);/;
const newProgress = `export const useProgressPercentage = () =>
  useWizardProgressStore((state) => {
    return getStepProgress(state.currentStep);
  });`;

content = content.replace(oldProgress, newProgress);

// 5. Replace useNextStep
const oldNextStep = /export const useNextStep = \(\) =>\s*useWizardProgressStore\(\(state\) => \{[\s\S]*?return currentIndex < stepOrder\.length - 1 \? stepOrder\[currentIndex \+ 1\] : null;[\s\S]*?\}\);/;
const newNextStep = `export const useNextStep = () =>
  useWizardProgressStore((state) => {
    return getNextStep(state.currentStep);
  });`;

content = content.replace(oldNextStep, newNextStep);

// 6. Replace usePrevStep
const oldPrevStep = /export const usePrevStep = \(\) =>\s*useWizardProgressStore\(\(state\) => \{[\s\S]*?return currentIndex > 0 \? stepOrder\[currentIndex - 1\] : null;[\s\S]*?\}\);/;
const newPrevStep = `export const usePrevStep = () =>
  useWizardProgressStore((state) => {
    return getPreviousStep(state.currentStep);
  });`;

content = content.replace(oldPrevStep, newPrevStep);

// Write the updated content
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Updated wizard.selectors.ts successfully');
console.log('   - Added imports for centralized constants');
console.log('   - Removed 5 duplicated stepOrder arrays');
console.log('   - Functions now use centralized helpers');