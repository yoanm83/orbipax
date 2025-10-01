# UI Steps 1-3 Wiring Check Report
## Post-Rollback Audit

**Date**: 2025-09-28
**Task**: Audit UI wiring for Steps 1-3 after rollback
**Status**: ⚠️ PARTIALLY COMPLIANT

---

## Executive Summary

UI audit reveals mixed implementation state:
- ✅ **No Prohibited Imports**: Zero references to `step2-insurance` or `step3-diagnoses`
- ✅ **Correct Component Paths**: Wizard imports from original locations
- ⚠️ **Partial Actions Integration**: Only Steps 1 & 3 wired to Actions
- ❌ **Step 2 Missing Actions**: No Actions integration found
- ❌ **Steps 4+ Have Breaking Imports**: Reference non-existent state slices
- ❌ **ESLint Violations**: 164 errors in UI module

---

## 1. WIZARD INVENTORY

### wizard-content.tsx
```typescript
// Correct imports from original locations:
import { IntakeWizardStep1Demographics } from './step1-demographics'
import { Step2EligibilityInsurance } from './step2-eligibility-insurance'
import { Step3DiagnosesClinical } from './step3-diagnoses-clinical'
import { Step4MedicalProviders } from './step4-medical-providers'
// ... Steps 5-10
```

### Component Mappings
| Step | Component | Path | Status |
|------|-----------|------|--------|
| demographics | IntakeWizardStep1Demographics | step1-demographics | ✅ Actions |
| insurance | Step2EligibilityInsurance | step2-eligibility-insurance | ❌ No Actions |
| diagnoses | Step3DiagnosesClinical | step3-diagnoses-clinical | ✅ Actions |
| medical-providers | Step4MedicalProviders | step4-medical-providers | ❌ Broken imports |

---

## 2. PROHIBITED IMPORTS SEARCH

### Grep Results
```bash
grep -r "step2-insurance\|step3-diagnoses" src/modules/intake/ui
# Result: No files found ✅
```

**Confirmed**: No references to removed directories

---

## 3. STEP-BY-STEP WIRING VERIFICATION

### Step 1: Demographics ✅
```typescript
// Correct imports:
import { demographicsDataSchema } from "@/modules/intake/domain/schemas/demographics.schema"
import { loadDemographicsAction, saveDemographicsAction } from "@/modules/intake/actions/step1"

// React Hook Form with Zod:
const form = useForm<Partial<DemographicsData>>({
  resolver: zodResolver(demographicsDataSchema.partial()),
  mode: 'onBlur'
})

// Actions integration:
✅ loadDemographicsAction() on mount
✅ saveDemographicsAction() on submit
```

### Step 2: Insurance ❌
```typescript
// Missing imports:
❌ No Actions imports
❌ No Domain schema imports
❌ No React Hook Form setup

// Current state:
- Uses local useState for sections
- Has UI components but no data integration
- Only navigation (nextStep/prevStep) implemented
```

### Step 3: Diagnoses ✅
```typescript
// Correct imports:
import { loadStep3Action, upsertDiagnosesAction } from '@/modules/intake/actions/step3'
import { step3DataPartialSchema } from '@/modules/intake/domain/schemas/diagnoses-clinical.schema'

// React Hook Form with Zod:
const form = useForm<Step3DataPartial>({
  resolver: zodResolver(step3DataPartialSchema)
})

// Actions integration:
✅ loadStep3Action() in useEffect
✅ upsertDiagnosesAction() on submit
✅ Generic error messages (no PHI)
```

---

## 4. STEPS 4+ STATUS

### Step 4: Medical Providers ❌
```typescript
// Breaking imports:
import { validateStep4 } from "@/modules/intake/domain/schemas/step4" // ❌ Doesn't exist
import { useProvidersUIStore } from "@/modules/intake/state/slices/step4" // ❌ Doesn't exist
```

### Steps 5-10
Similar issues with non-existent state slice imports

---

## 5. BUILD & QUALITY CHECKS

### TypeScript Check
```bash
npx tsc --noEmit
```
**Result**: ❌ 5 errors (all in /app directory, not intake module)

### ESLint Check
```bash
npx eslint src/modules/intake/ui --max-warnings 0
```
**Result**: ❌ 164 errors, 1 warning
- Import order violations
- Use of native elements instead of primitives
- Missing accessibility attributes

### Key ESLint Issues
```
step1-demographics: 71 errors
step2-eligibility-insurance: 39 errors
step3-diagnoses-clinical: 0 errors ✅
step4-medical-providers: 23 errors
```

---

## 6. CRITICAL FINDINGS

### Issues Requiring Immediate Fix

1. **Step 2 Missing Actions Integration**
   - File: `step2-eligibility-insurance/Step2EligibilityInsurance.tsx`
   - Need: Add RHF + Actions wiring similar to Steps 1 & 3

2. **Steps 4+ Breaking Imports**
   - Files: `step4-medical-providers/Step4MedicalProviders.tsx` and beyond
   - Lines: Import statements for non-existent slices
   - Fix: Comment out or replace with placeholder components

3. **ESLint Violations**
   - Mostly import order and native element usage
   - Can be auto-fixed with `--fix` flag

---

## 7. RECOMMENDED ACTION PLAN

### Priority 1: Fix Breaking Imports (Steps 4+)
```typescript
// Replace in Step4MedicalProviders.tsx:
// import { useProvidersUIStore } from "@/modules/intake/state/slices/step4"

// With placeholder:
// TODO: Implement Step 4 actions when ready
```

### Priority 2: Wire Step 2 to Actions
- Create `loadStep2Action` and `upsertInsuranceAction`
- Add RHF with insuranceDataSchema
- Follow Step 3 pattern

### Priority 3: ESLint Cleanup
```bash
npx eslint src/modules/intake/ui --fix
```

---

## CONCLUSION

### Current State
- **Steps 1 & 3**: ✅ Fully wired to Actions
- **Step 2**: ⚠️ UI exists but no Actions integration
- **Steps 4+**: ❌ Breaking imports to non-existent modules
- **Build**: ⚠️ TypeScript passes for intake, ESLint has violations

### Compliance Status
✅ No prohibited imports (step2-insurance, step3-diagnoses)
⚠️ Partial Actions integration (2 of 3 steps)
❌ Steps 4+ not properly disabled (have breaking imports)
❌ ESLint not green

**Overall Status**: PARTIALLY COMPLIANT - Requires fixes to Steps 2 and 4+ before production ready