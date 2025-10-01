# Wizard Navigation Selectors

## Purpose
This folder contains selectors for the overall wizard navigation and progress tracking.

## Expected Files
- `wizard.navigation.selectors.ts` - Navigation state selectors
- `wizard.progress.selectors.ts` - Progress tracking selectors
- `wizard.validation.selectors.ts` - Validation state selectors
- `index.ts` - Barrel exports

## Current Status
The wizard selectors are currently located at:
- `../wizard.selectors.ts` (one level up)

## Architecture Guidelines
- Pure selector functions (no side effects)
- Memoized where appropriate for performance
- Derive UI state from store without PHI
- Type-safe with proper TypeScript types

## IMPORTANT
**DO NOT MOVE EXISTING FILES IN THIS TASK**

This folder was created for organizational consistency. Files will be moved in separate tasks.