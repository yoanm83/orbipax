# Step 6 - Referrals & Services UI State

## Purpose
This folder contains UI state management for Step 6 (Referrals & Services) of the intake wizard.

## Expected Files
- `referrals.ui.slice.ts` - External referrals UI state
- `services.ui.slice.ts` - Internal services UI state
- `treatmentHistory.ui.slice.ts` - Treatment history UI state
- `index.ts` - Barrel exports

## Architecture Guidelines
- **NO PHI (Protected Health Information)** in UI state
- UI-only state: expanded sections, form validation flags, loading states
- All sensitive data must be handled in application/domain layers
- State should be resettable for multi-tenant safety

## IMPORTANT
**DO NOT MOVE EXISTING FILES IN THIS TASK**

This folder was created for organizational consistency. Files will be moved or created in separate tasks.