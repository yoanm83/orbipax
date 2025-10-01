# Step 2 - Eligibility & Insurance UI State

## Purpose
This folder contains UI state management for Step 2 (Eligibility & Insurance) of the intake wizard.

## Expected Files
- `eligibility.ui.slice.ts` - Eligibility section UI state
- `insurance.ui.slice.ts` - Insurance section UI state
- `index.ts` - Barrel exports

## Architecture Guidelines
- **NO PHI (Protected Health Information)** in UI state
- UI-only state: expanded sections, form validation flags, loading states
- All sensitive data must be handled in application/domain layers
- State should be resettable for multi-tenant safety

## IMPORTANT
**DO NOT MOVE EXISTING FILES IN THIS TASK**

This folder was created for organizational consistency. Files will be moved or created in separate tasks.