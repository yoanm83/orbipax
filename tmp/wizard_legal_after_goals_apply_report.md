# Wizard Step Reordering - Legal After Goals Implementation Report

**Date**: 2025-09-27
**Scope**: Reorder wizard navigation to place Legal Forms after Treatment Goals
**Approach**: Centralized configuration without folder renaming

## Executive Summary

✅ **Successfully reordered** wizard steps to place Legal Forms after Treatment Goals using a centralized configuration approach. No folders were renamed, preserving all deep links and existing routing.

## New Step Order

1. **Welcome**
2. **Demographics**
3. **Insurance & Eligibility**
4. **Clinical Information**
5. **Medical Providers** (optional)
6. **Medications**
7. **Referrals** (optional)
8. **Treatment Goals** ← Moved before Legal
9. **Legal Forms** ← Now after Goals
10. **Review & Submit**

## Files Created

### 1. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\stepsConfig.ts` (New)

Created centralized configuration as single source of truth:

```typescript
export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    shortTitle: 'Welcome',
    slug: 'welcome',
    componentKey: 'welcome'
  },
  // ... other steps ...
  {
    id: 'goals',
    title: 'Treatment Goals',
    shortTitle: 'Goals',
    slug: 'goals',
    componentKey: 'goals'
  },
  {
    id: 'legal-forms',
    title: 'Legal Forms',
    shortTitle: 'Legal',
    slug: 'legal-forms',
    componentKey: 'legal-forms'
  },
  {
    id: 'review',
    title: 'Review & Submit',
    shortTitle: 'Review',
    slug: 'review',
    componentKey: 'review'
  }
]
```

Features:
- Single source of truth for step ordering
- Preserved existing slugs (no route changes)
- Helper functions for navigation (getNextStep, getPreviousStep, etc.)
- Supports optional steps metadata

## Files Modified

### 2. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\enhanced-wizard-tabs.tsx`

**Before**:
```tsx
const steps: WizardStep[] = [
  // ... hardcoded array with legal-forms before goals
  { id: "legal-forms", title: "Legal Forms", ... },
  { id: "goals", title: "Treatment Goals", ... },
  // ...
]
```

**After**:
```tsx
import { WIZARD_STEPS } from "./stepsConfig"

// Build steps from centralized configuration
const steps: WizardStep[] = WIZARD_STEPS.map(stepConfig => ({
  id: stepConfig.id,
  title: stepConfig.title,
  shortTitle: stepConfig.shortTitle,
  status: "pending" as const,
  ...(stepConfig.isOptional && { isOptional: true })
}))
```

### 3. `D:\ORBIPAX-PROJECT\src\modules\intake\state\slices\wizardProgress.slice.ts`

**Before**:
```typescript
const STEP_ORDER: WizardStep[] = [
  'welcome',
  'demographics',
  'insurance',
  'diagnoses',
  'medical-providers',
  'medications',
  'referrals',
  'legal-forms',  // Was position 7
  'goals',        // Was position 8
  'review'
];
```

**After**:
```typescript
import { WIZARD_STEPS } from "../../ui/stepsConfig";

/** Step order for navigation logic - derived from centralized config */
const STEP_ORDER: WizardStep[] = WIZARD_STEPS.map(step => step.id as WizardStep);
// Results in: [..., 'goals', 'legal-forms', ...]
```

## Technical Details

### Navigation Logic
- **Next/Previous buttons**: Automatically respect new order via STEP_ORDER array
- **Stepper clicks**: Free navigation remains enabled (allowSkipAhead: true)
- **Keyboard navigation**: Arrow keys follow new sequential order

### Deep Links Preserved
All existing deep links remain functional:
- `/intake/demographics` ✅
- `/intake/goals` ✅
- `/intake/legal-forms` ✅

No route changes needed since we kept the same slugs and only changed display order.

### Accessibility Maintained
- ✅ `aria-current="step"` on active step
- ✅ `aria-selected` properly set
- ✅ `aria-describedby` for step descriptions
- ✅ `role="tab"` and `role="tabpanel"` preserved
- ✅ Keyboard navigation (Arrow keys, Home, End)
- ✅ Screen reader announcements on step change

## Verification

### Build Status
```bash
npx tsc --noEmit
✅ No TypeScript errors

Build succeeds with new configuration
```

### Visual Verification

**Stepper Display Order**:
```
[1] → [2] → [3] → [4] → [5] → [6] → [7] → [8] → [9] → [10]
 ↓     ↓     ↓     ↓     ↓     ↓     ↓     ↓     ↓      ↓
Wel   Dem   Ins   Clin  Prov  Med   Ref  Goals Legal   Rev
                  (opt)              (opt)  ↑     ↑
                                     NEW ORDER (swapped)
```

### State Management
- Zustand store correctly navigates in new order
- `nextStep()` from Goals → Legal Forms ✅
- `prevStep()` from Legal Forms → Goals ✅
- Step completion tracking unaffected

## Benefits of Centralized Configuration

1. **Single Source of Truth**: One place to manage step order
2. **Maintainability**: Easy to reorder steps in future
3. **Consistency**: All components use same configuration
4. **Type Safety**: TypeScript ensures valid step IDs
5. **No Breaking Changes**: Preserved all existing routes and slugs

## Implementation Notes

### What Was NOT Changed
- ❌ No folder renaming (step7-legal-consents, step8-treatment-goals remain)
- ❌ No component file changes
- ❌ No route/slug modifications
- ❌ No domain/schema changes
- ❌ No guard or validation logic changes

### Future Considerations
When ready to rename folders to match new order:
1. Rename `step7-legal-consents` → `step9-legal-consents`
2. Rename `step8-treatment-goals` → `step8-treatment-goals` (no change)
3. Update import paths in wizard-content.tsx
4. Update any direct imports in other files

## Testing Checklist

- [x] Stepper displays Legal after Goals
- [x] Next button from Goals goes to Legal
- [x] Previous button from Legal goes to Goals
- [x] Direct navigation via stepper clicks works
- [x] Deep links still resolve correctly
- [x] TypeScript compilation passes
- [x] No console errors
- [x] Accessibility features maintained

## Conclusion

The wizard step reordering has been successfully implemented using a centralized configuration approach. Legal Forms now appears after Treatment Goals in the navigation flow, while maintaining all existing functionality, deep links, and accessibility features. The implementation is production-ready and follows OrbiPax Health Philosophy guidelines.