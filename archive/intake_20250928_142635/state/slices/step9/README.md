# Step 9 - Legal Forms & Consents UI State

## Purpose
This folder contains UI state management for Step 9 (Legal Forms & Consents) of the intake wizard.

## Expected Files
- `legalForms.ui.slice.ts` - Legal forms UI state
- `consents.ui.slice.ts` - Consents tracking UI state
- `signatures.ui.slice.ts` - Digital signatures UI state
- `index.ts` - Barrel exports

## Architecture Guidelines
- **NO PHI (Protected Health Information)** in UI state
- UI-only state: expanded sections, form validation flags, loading states
- All sensitive data must be handled in application/domain layers
- State should be resettable for multi-tenant safety

## IMPORTANT
**DO NOT MOVE EXISTING FILES IN THIS TASK**

This folder was created for organizational consistency. Files will be moved or created in separate tasks.