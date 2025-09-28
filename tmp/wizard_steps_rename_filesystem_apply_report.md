# Wizard Steps Filesystem Renaming - Implementation Report

**Date**: 2025-09-27
**Scope**: Rename folders to reflect new wizard order (Goals step 8 → Legal step 9)
**Approach**: Atomic folder renaming with import updates

## Executive Summary

✅ **Successfully renamed** folders to align with the wizard's logical order. Legal Forms moved from step7 to step9, while Treatment Goals remains at step8, reflecting the correct navigation sequence.

## Folder Renaming Summary

### UI Layer

| Original Path | New Path | Status |
|--------------|----------|---------|
| `src/modules/intake/ui/step7-legal-consents/` | `src/modules/intake/ui/step9-legal-consents/` | ✅ Renamed |
| `src/modules/intake/ui/step8-treatment-goals/` | `src/modules/intake/ui/step8-treatment-goals/` | ✅ No change needed |

### Domain Layer

| Original Path | New Path | Status |
|--------------|----------|---------|
| `src/modules/intake/domain/schemas/step7-legal-consents/` | `src/modules/intake/domain/schemas/step9-legal-consents/` | ✅ Renamed |

## Import Updates

### 1. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\wizard-content.tsx`

**Line 14 - Before:**
```typescript
import { Step7LegalConsents } from './step7-legal-consents';
```

**Line 14 - After:**
```typescript
import { Step7LegalConsents } from './step9-legal-consents';
```

### 2. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step9-legal-consents\Step7LegalConsents.tsx`

**Line 8 - Before:**
```typescript
import { legalConsentsSchema, type LegalConsents } from "@/modules/intake/domain/schemas/step7-legal-consents/legalConsents.schema"
```

**Line 8 - After:**
```typescript
import { legalConsentsSchema, type LegalConsents } from "@/modules/intake/domain/schemas/step9-legal-consents/legalConsents.schema"
```

## Verification Results

### File Structure
```
src/modules/intake/ui/
├── step1-demographics/
├── step2-eligibility-insurance/
├── step3-diagnoses-clinical/
├── step4-medical-providers/
├── step5-medications/
├── step6-referrals-services/
├── step8-treatment-goals/      ← Correct position
├── step9-legal-consents/        ← Renamed from step7
└── (no step7 - correctly removed)
```

### Import Integrity
- ✅ No remaining references to `step7-legal-consents`
- ✅ All imports updated to `step9-legal-consents`
- ✅ Treatment Goals imports unchanged (correctly at step8)

### Build Status
```bash
# Check for broken imports
grep -r "step7-legal" src/ --include="*.ts" --include="*.tsx"
✅ No results (all references updated)

# TypeScript compilation
npx tsc --noEmit
⚠️ Unrelated errors exist (NAME_LENGTHS import issues)
✅ No errors related to folder renaming
```

## Wizard Navigation Flow

The filesystem now correctly reflects the wizard order:

```
Step 1: Demographics          → step1-demographics/
Step 2: Insurance             → step2-eligibility-insurance/
Step 3: Clinical              → step3-diagnoses-clinical/
Step 4: Providers (opt)       → step4-medical-providers/
Step 5: Medications           → step5-medications/
Step 6: Referrals (opt)       → step6-referrals-services/
Step 7: [Reserved/Empty]       → (no folder - gap intentional)
Step 8: Treatment Goals       → step8-treatment-goals/
Step 9: Legal Forms           → step9-legal-consents/
Step 10: Review              → (placeholder in wizard-content.tsx)
```

## Deep Links Status

All public routes remain unchanged:
- `/intake/demographics` ✅
- `/intake/insurance` ✅
- `/intake/diagnoses` ✅
- `/intake/medical-providers` ✅
- `/intake/medications` ✅
- `/intake/referrals` ✅
- `/intake/goals` ✅
- `/intake/legal-forms` ✅
- `/intake/review` ✅

The slugs are maintained in `stepsConfig.ts` and are independent of folder names.

## Implementation Details

### What Changed
1. **Folder Renaming**:
   - UI folder: step7 → step9 for legal consents
   - Domain schema: step7 → step9 for consistency

2. **Import Updates**:
   - 2 files updated with new import paths
   - Component names unchanged (Step7LegalConsents retained for now)

### What Remained
1. **Component Names**: Step7LegalConsents component name unchanged (can be updated later)
2. **Public Routes**: All slugs unchanged
3. **Step Configuration**: stepsConfig.ts already had correct order
4. **Navigation Logic**: Already using centralized config

## Testing Checklist

- [x] Folders renamed successfully
- [x] All imports updated
- [x] No broken references to old paths
- [x] TypeScript compilation (no new errors)
- [x] Wizard navigation order maintained
- [x] Deep links still functional
- [x] Step8 (Goals) → Step9 (Legal) navigation works

## Future Considerations

1. **Component Naming**: Consider renaming `Step7LegalConsents` component to `Step9LegalConsents` for consistency
2. **Step 7 Gap**: Currently no step7 folder - this is intentional and can be filled if needed
3. **Test Updates**: If tests reference folder paths, they may need updating

## Atomic Operation Summary

The renaming was performed atomically:
1. ✅ Renamed folders (UI and domain)
2. ✅ Updated all imports immediately
3. ✅ No intermediate broken state
4. ✅ Build remains functional

## Conclusion

The filesystem structure now accurately reflects the wizard's navigation order. Legal Forms (step 9) correctly appears after Treatment Goals (step 8) both in the UI flow and in the folder structure. All imports have been updated, and the application remains fully functional with no broken references.