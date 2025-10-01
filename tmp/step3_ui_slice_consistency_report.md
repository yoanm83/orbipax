# Step 3 UI Slice Consistency Report

**Date:** 2025-09-29
**Task:** Create canonical Step 3 UI slice following Step 1/Step 2 pattern
**Status:** ✅ **COMPLETE**

---

## Executive Summary

Successfully created **canonical Step 3 UI slice** (`step3-ui.slice.ts`) following the exact pattern from Step 2 (Insurance). The new slice uses UI-only flags (loading, saving, error, dirty states) consistent with the Step 1/Step 2 methodology, replacing the legacy multi-slice approach previously used in Step 3.

**Key Achievements:**
- ✅ Created `step3-ui.slice.ts` with identical structure to Step 2
- ✅ UI-only state (no PHI, no domain data, no tenancy)
- ✅ Devtools middleware with action names (matching Step 2 pattern)
- ✅ TypeScript compilation passes (0 new errors)
- ✅ ESLint validation passes (0 errors, 0 warnings)
- ✅ Legacy Step 3 slices documented for future cleanup

---

## 1. Audit Results: Step 1 vs Step 2 Pattern Analysis

### 1.1 Step 1 (Demographics) - Pattern A

**File:** `src/modules/intake/state/slices/step1.ui.slice.ts`

**Pattern Characteristics:**
- Uses `"use client"` directive
- **No devtools middleware** (plain Zustand store)
- Section-specific UI state (`expandedSections` per section)
- Domain-specific UI flags (`photoUpload` state)
- Action naming: Verbose descriptive names (`toggleSection`, `expandAllSections`)

**State Shape:**
```typescript
interface Step1UIState {
  expandedSections: {
    personal: boolean
    address: boolean
    contact: boolean
    legal: boolean
  }
  uiError: string | null
  isBusy: boolean
  isValid: boolean
  lastAction: 'expand' | 'collapse' | 'validate' | 'reset' | null
  photoUpload: {
    isUploading: boolean
    uploadError: string | null
  }
}
```

**Actions:**
- `toggleSection(section)`
- `expandSection(section)`
- `collapseSection(section)`
- `expandAllSections()`
- `collapseAllSections()`
- `setUiError(error)`
- `setBusy(busy)`
- `setValid(valid)`
- `setPhotoUploading(uploading)`
- `setPhotoUploadError(error)`
- `resetUIState()`

**Export:**
- Named export: `export const useStep1UIStore = create<Step1UIStore>(...)`
- No barrel export

**Store Name:** N/A (no devtools)

---

### 1.2 Step 2 (Insurance) - Pattern B ✅ GOLD STANDARD

**File:** `src/modules/intake/state/slices/step2-ui.slice.ts`

**Pattern Characteristics:**
- **Uses devtools middleware** (better debugging)
- Generic UI flags (not domain-specific)
- Minimal, focused API
- Action naming: Concise verb-based (`markLoading`, `markSaving`)
- Devtools action names: Prefixed with `step2-ui/` (e.g., `step2-ui/markLoading`)

**State Shape:**
```typescript
interface Step2UiState {
  // Loading states
  isLoading: boolean
  isSaving: boolean

  // Error states (generic messages only)
  loadError: string | null
  saveError: string | null

  // Form states
  isDirty: boolean
  lastSavedAt: string | null

  // Actions
  markLoading: (loading: boolean) => void
  markSaving: (saving: boolean) => void
  setLoadError: (error: string | null) => void
  setSaveError: (error: string | null) => void
  markDirty: () => void
  markSaved: (timestamp?: string) => void
  resetStep2Ui: () => void
}
```

**Actions:**
- `markLoading(loading)` - Set loading state
- `markSaving(saving)` - Set saving state
- `setLoadError(error)` - Set load error message
- `setSaveError(error)` - Set save error message
- `markDirty()` - Mark form as dirty
- `markSaved(timestamp?)` - Mark form as saved (clears dirty, sets timestamp)
- `resetStep2Ui()` - Reset all state to initial

**Export:**
- Named export: `export const useStep2UiStore = create<Step2UiState>()(...)`
- No barrel export

**Store Name:** `step2-ui-store` (devtools name)

**Devtools Action Names:**
- `step2-ui/markLoading`
- `step2-ui/markSaving`
- `step2-ui/setLoadError`
- `step2-ui/setSaveError`
- `step2-ui/markDirty`
- `step2-ui/markSaved`
- `step2-ui/reset`

---

### 1.3 Pattern Selection: Step 2 Chosen as Template

**Rationale:**
1. **Consistency with Production:** Step 2 is the gold standard (referenced in Wizard Playbook)
2. **Better Debugging:** Devtools middleware enables time-travel debugging
3. **Generic API:** Loading/saving/error/dirty flags are universal (not step-specific)
4. **Cleaner Action Names:** Devtools action names provide better traceability

**Decision:** Clone Step 2 pattern exactly for Step 3

---

## 2. Audit Results: Existing Step 3 Slices (Legacy)

### 2.1 Legacy Files Discovered

**Directory:** `src/modules/intake/state/slices/step3/`

| File | Purpose | Status | Lines | Pattern |
|------|---------|--------|-------|---------|
| `diagnoses.ui.slice.ts` | Diagnoses section state | ⚠️ LEGACY | ~150 | Domain-specific (stores form fields) |
| `psychiatricEvaluation.ui.slice.ts` | Psychiatric section state | ⚠️ LEGACY | ~120 | Domain-specific (stores form fields) |
| `functionalAssessment.ui.slice.ts` | Functional section state | ⚠️ LEGACY | ~100 | Domain-specific (stores form fields) |
| `index.ts` | Barrel export | ⚠️ LEGACY | 25 | Aggregates above slices |

**Total Legacy Files:** 4
**Total Legacy Lines:** ~395 lines

---

### 2.2 Legacy Pattern Analysis

**Problem: Domain Data in UI Store**

The legacy Step 3 slices store **actual form field data** in the UI store:

```typescript
// ❌ Legacy: Stores domain data in UI slice
interface DiagnosesUIStore {
  // Form Fields (domain data!)
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  substanceUseDisorder: string
  mentalHealthHistory: string

  // UI State
  isExpanded: boolean
  isDirty: boolean
  validationErrors: Record<string, string>

  // Actions - Field Updates
  setPrimaryDiagnosis: (value: string) => void
  setSecondaryDiagnoses: (value: string[]) => void
  // ...
}
```

**Issues:**
1. **Violates SoC:** UI stores should only contain UI flags, not form data
2. **Duplication:** Form data should be in React Hook Form or component state
3. **Complexity:** 3 separate slices (diagnoses, psychiatric, functional) instead of 1 unified UI slice
4. **Inconsistency:** Different pattern from Step 1/Step 2

---

### 2.3 Canonical Pattern (Step 2/Step 3)

**✅ Correct: UI-only flags (no domain data)**

```typescript
// ✅ Canonical: Only UI flags
interface Step3UiState {
  // Loading states
  isLoading: boolean
  isSaving: boolean

  // Error states (generic messages only)
  loadError: string | null
  saveError: string | null

  // Form states
  isDirty: boolean
  lastSavedAt: string | null

  // Actions
  markLoading: (loading: boolean) => void
  markSaving: (saving: boolean) => void
  setLoadError: (error: string | null) => void
  setSaveError: (error: string | null) => void
  markDirty: () => void
  markSaved: (timestamp?: string) => void
  resetStep3Ui: () => void
}
```

**Benefits:**
1. **Single source of truth:** Form data managed by React Hook Form/component state
2. **Simplicity:** One slice for entire step (not 3 separate slices)
3. **Consistency:** Matches Step 1/Step 2 pattern
4. **Reusability:** Generic flags work for any step

---

## 3. Implementation: Canonical Step 3 UI Slice

### 3.1 File Created

**Path:** `src/modules/intake/state/slices/step3-ui.slice.ts`

**Lines:** 123 lines

**Structure:** Identical to Step 2 with naming adjusted to Step 3

---

### 3.2 State Shape

**Interface:**
```typescript
interface Step3UiState {
  // Loading states
  isLoading: boolean
  isSaving: boolean

  // Error states (generic messages only)
  loadError: string | null
  saveError: string | null

  // Form states
  isDirty: boolean
  lastSavedAt: string | null

  // Actions
  markLoading: (loading: boolean) => void
  markSaving: (saving: boolean) => void
  setLoadError: (error: string | null) => void
  setSaveError: (error: string | null) => void
  markDirty: () => void
  markSaved: (timestamp?: string) => void
  resetStep3Ui: () => void
}
```

**Initial State:**
```typescript
const initialState = {
  isLoading: false,
  isSaving: false,
  loadError: null,
  saveError: null,
  isDirty: false,
  lastSavedAt: null
}
```

---

### 3.3 Actions

| Action | Signature | Purpose | Devtools Name |
|--------|-----------|---------|---------------|
| `markLoading` | `(loading: boolean) => void` | Set loading state | `step3-ui/markLoading` |
| `markSaving` | `(saving: boolean) => void` | Set saving state | `step3-ui/markSaving` |
| `setLoadError` | `(error: string \| null) => void` | Set load error message | `step3-ui/setLoadError` |
| `setSaveError` | `(error: string \| null) => void` | Set save error message | `step3-ui/setSaveError` |
| `markDirty` | `() => void` | Mark form as dirty | `step3-ui/markDirty` |
| `markSaved` | `(timestamp?: string) => void` | Mark saved (clear dirty, set timestamp) | `step3-ui/markSaved` |
| `resetStep3Ui` | `() => void` | Reset all state to initial | `step3-ui/reset` |

---

### 3.4 Export

**Named Export:**
```typescript
export const useStep3UiStore = create<Step3UiState>()(
  devtools(
    (set) => ({ /* ... */ }),
    {
      name: 'step3-ui-store'
    }
  )
)
```

**Store Name (Devtools):** `step3-ui-store`

**No Barrel Export:** Consistent with Step 2 (direct import from file)

---

## 4. Equivalence Table: Step 2 ↔ Step 3

### 4.1 State Fields

| Step 2 | Step 3 | Type | Purpose |
|--------|--------|------|---------|
| `isLoading` | `isLoading` | `boolean` | Data loading state |
| `isSaving` | `isSaving` | `boolean` | Data saving state |
| `loadError` | `loadError` | `string \| null` | Load error message |
| `saveError` | `saveError` | `string \| null` | Save error message |
| `isDirty` | `isDirty` | `boolean` | Form has unsaved changes |
| `lastSavedAt` | `lastSavedAt` | `string \| null` | ISO timestamp of last save |

**Equivalence:** ✅ **100% match** - All state fields identical

---

### 4.2 Actions

| Step 2 | Step 3 | Signature | Purpose |
|--------|--------|-----------|---------|
| `markLoading` | `markLoading` | `(loading: boolean) => void` | Set loading state |
| `markSaving` | `markSaving` | `(saving: boolean) => void` | Set saving state |
| `setLoadError` | `setLoadError` | `(error: string \| null) => void` | Set load error |
| `setSaveError` | `setSaveError` | `(error: string \| null) => void` | Set save error |
| `markDirty` | `markDirty` | `() => void` | Mark form dirty |
| `markSaved` | `markSaved` | `(timestamp?: string) => void` | Mark form saved |
| `resetStep2Ui` | `resetStep3Ui` | `() => void` | Reset state |

**Equivalence:** ✅ **100% match** - All actions identical (except reset name)

---

### 4.3 Devtools Action Names

| Step 2 | Step 3 | Purpose |
|--------|--------|---------|
| `step2-ui/markLoading` | `step3-ui/markLoading` | Loading action |
| `step2-ui/markSaving` | `step3-ui/markSaving` | Saving action |
| `step2-ui/setLoadError` | `step3-ui/setLoadError` | Load error action |
| `step2-ui/setSaveError` | `step3-ui/setSaveError` | Save error action |
| `step2-ui/markDirty` | `step3-ui/markDirty` | Mark dirty action |
| `step2-ui/markSaved` | `step3-ui/markSaved` | Mark saved action |
| `step2-ui/reset` | `step3-ui/reset` | Reset action |

**Equivalence:** ✅ **100% match** - Naming convention consistent

---

### 4.4 Store Configuration

| Aspect | Step 2 | Step 3 | Match? |
|--------|--------|--------|--------|
| **Middleware** | `devtools` | `devtools` | ✅ |
| **Store Name** | `step2-ui-store` | `step3-ui-store` | ✅ |
| **Export Type** | Named (`useStep2UiStore`) | Named (`useStep3UiStore`) | ✅ |
| **Barrel Export** | No | No | ✅ |

**Equivalence:** ✅ **100% match** - Configuration identical

---

## 5. Routes & File Organization

### 5.1 Files Created

**New Canonical Slice:**
- ✅ `src/modules/intake/state/slices/step3-ui.slice.ts` (123 lines)

**Barrel Export:**
- ❌ Not created (consistent with Step 2 - no barrel)

---

### 5.2 Legacy Files (Not Deleted)

**Legacy Directory:** `src/modules/intake/state/slices/step3/`

**Files to Remove in Future Cleanup Task:**
1. `diagnoses.ui.slice.ts` (~150 lines)
2. `psychiatricEvaluation.ui.slice.ts` (~120 lines)
3. `functionalAssessment.ui.slice.ts` (~100 lines)
4. `index.ts` (barrel - 25 lines)

**Total Legacy Lines to Remove:** ~395 lines

**Reason for Keeping (temporarily):**
- UI components currently import from these legacy slices
- Wiring UI to new canonical slice is a separate task
- Allows rollback if needed

**Cleanup Task (Future):**
- Update UI components to use `useStep3UiStore` instead of `useDiagnosesUIStore`, `usePsychiatricEvaluationUIStore`, `useFunctionalAssessmentUIStore`
- Remove legacy files after UI wiring complete

---

## 6. Pseudodiff: Before → After

### 6.1 Before (Legacy)

**Pattern:** 3 separate slices with domain data

```
src/modules/intake/state/slices/step3/
├── diagnoses.ui.slice.ts            # Stores form fields + UI flags
├── psychiatricEvaluation.ui.slice.ts # Stores form fields + UI flags
├── functionalAssessment.ui.slice.ts  # Stores form fields + UI flags
└── index.ts                          # Barrel export
```

**Usage:**
```typescript
import {
  useDiagnosesUIStore,
  usePsychiatricEvaluationUIStore,
  useFunctionalAssessmentUIStore
} from '@/modules/intake/state/slices/step3'

// 3 separate stores to manage
const diagnosesStore = useDiagnosesUIStore()
const psychiatricStore = usePsychiatricEvaluationUIStore()
const functionalStore = useFunctionalAssessmentUIStore()

// Access domain data from stores (wrong pattern)
const primaryDiagnosis = diagnosesStore.primaryDiagnosis
diagnosesStore.setPrimaryDiagnosis("F41.1")

// Access UI flags
const isDirty = diagnosesStore.isDirty
```

---

### 6.2 After (Canonical)

**Pattern:** 1 unified slice with UI-only flags

```
src/modules/intake/state/slices/
└── step3-ui.slice.ts                # UI-only flags (no domain data)
```

**Usage:**
```typescript
import { useStep3UiStore } from '@/modules/intake/state/slices/step3-ui.slice'

// Single store for entire step
const uiStore = useStep3UiStore()

// Access UI flags only
const isLoading = uiStore.isLoading
const isSaving = uiStore.isSaving
const isDirty = uiStore.isDirty
const saveError = uiStore.saveError

// Update UI state
uiStore.markLoading(true)
uiStore.markSaving(false)
uiStore.markDirty()
uiStore.markSaved()
```

**Form Data Management (Separate):**
```typescript
// Form data managed by React Hook Form or component state
const { register, handleSubmit } = useForm()

const onSubmit = async (data) => {
  uiStore.markSaving(true)

  try {
    const result = await saveStep3Action(data)
    if (result.ok) {
      uiStore.markSaved()
    } else {
      uiStore.setSaveError(result.error.message)
    }
  } catch {
    uiStore.setSaveError('An unexpected error occurred')
  } finally {
    uiStore.markSaving(false)
  }
}
```

---

## 7. Validation Results

### 7.1 TypeScript Validation

**Command:**
```bash
npx tsc --noEmit
```

**Result:** ✅ **PASS (0 new errors)**

**Findings:**
- 28 pre-existing errors in other modules (not related to Step 3 slice)
- 0 errors in `step3-ui.slice.ts`
- No broken imports
- No type mismatches

**Conclusion:** New slice introduces **0 new TypeScript errors**

---

### 7.2 ESLint Validation

**Command:**
```bash
npx eslint "src/modules/intake/state/slices/step3-ui.slice.ts"
```

**Initial Result:** ❌ **1 error**

**Error:**
```
105:36  error  Prefer using nullish coalescing operator (`??`) instead of a logical or (`||`), as it is a safer operator  @typescript-eslint/prefer-nullish-coalescing
```

**Issue:**
```typescript
// ❌ Wrong (ESLint error)
lastSavedAt: timestamp || new Date().toISOString()

// ✅ Fixed
lastSavedAt: timestamp ?? new Date().toISOString()
```

**After Fix:** ✅ **PASS (0 errors, 0 warnings)**

**Conclusion:** ESLint passes cleanly after fix

---

### 7.3 Import Integrity Check

**Verification:** Confirmed no UI components currently import `step3-ui.slice.ts`

**Current UI Imports (Legacy):**
```typescript
// UI currently uses legacy slices (not updated yet)
import {
  useDiagnosesUIStore,
  usePsychiatricEvaluationUIStore,
  useFunctionalAssessmentUIStore
} from '@/modules/intake/state/slices/step3'
```

**Impact:** ✅ **No broken imports** - UI wiring is a separate task

**Future Task:** Update UI components to use `useStep3UiStore`

---

## 8. Sentinel Checklist

### 8.1 Audit-First Compliance

- [x] Read Step 1 slice (`step1.ui.slice.ts`)
- [x] Read Step 2 slice (`step2-ui.slice.ts`)
- [x] Read existing Step 3 slices (legacy)
- [x] Identified pattern differences (Step 1 vs Step 2)
- [x] Selected Step 2 as template (gold standard)
- [x] Documented legacy files for future cleanup

**Status:** ✅ **Audit-first approach followed**

---

### 8.2 Change Minimization

- [x] Created **1 new file** only (`step3-ui.slice.ts`)
- [x] No modifications to existing files
- [x] No deletions (legacy files kept for rollback)
- [x] No UI component changes (wiring separate task)
- [x] 123 lines created (minimal, focused)

**Status:** ✅ **Minimal change principle followed**

---

### 8.3 No Functional Duplicates

- [x] Canonical slice replaces legacy pattern (not duplicating)
- [x] UI-only flags (no domain data duplication)
- [x] Single slice for entire step (not 3 separate slices)
- [x] Follows Step 2 pattern (established standard)

**Status:** ✅ **No functional duplication**

---

### 8.4 SoC (Separation of Concerns)

- [x] UI flags only (no domain data)
- [x] No business logic (only state management)
- [x] No tenancy/organization_id (server-side concern)
- [x] No PHI (Protected Health Information)
- [x] Generic error messages only

**Status:** ✅ **SoC principles followed**

---

### 8.5 Consistency with Step 2

- [x] State shape identical (6 fields)
- [x] Action names identical (except reset)
- [x] Action signatures identical
- [x] Devtools action names follow same pattern
- [x] Store configuration identical
- [x] No barrel export (matches Step 2)

**Status:** ✅ **100% consistent with Step 2**

---

## 9. Usage Examples

### 9.1 Load Data Flow

```typescript
import { useStep3UiStore } from '@/modules/intake/state/slices/step3-ui.slice'
import { loadStep3Action } from '@/modules/intake/actions/step3'

function Step3Component() {
  const uiStore = useStep3UiStore()

  useEffect(() => {
    async function loadData() {
      uiStore.markLoading(true)
      uiStore.setLoadError(null)

      try {
        const result = await loadStep3Action()

        if (!result.ok) {
          uiStore.setLoadError(result.error?.message ?? 'Failed to load data')
        }
      } catch {
        uiStore.setLoadError('An unexpected error occurred')
      } finally {
        uiStore.markLoading(false)
      }
    }

    loadData()
  }, [])

  if (uiStore.isLoading) {
    return <LoadingSpinner />
  }

  if (uiStore.loadError) {
    return <ErrorMessage message={uiStore.loadError} />
  }

  return <Step3Form />
}
```

---

### 9.2 Save Data Flow

```typescript
import { useStep3UiStore } from '@/modules/intake/state/slices/step3-ui.slice'
import { upsertDiagnosesAction } from '@/modules/intake/actions/step3'

function Step3Form() {
  const uiStore = useStep3UiStore()
  const { register, handleSubmit, formState } = useForm()

  // Mark dirty when form changes
  useEffect(() => {
    if (formState.isDirty) {
      uiStore.markDirty()
    }
  }, [formState.isDirty])

  const onSubmit = async (data) => {
    uiStore.markSaving(true)
    uiStore.setSaveError(null)

    try {
      const result = await upsertDiagnosesAction(data)

      if (result.ok) {
        uiStore.markSaved() // Clears dirty, sets timestamp
        toast.success('Data saved successfully')
      } else {
        uiStore.setSaveError(result.error?.message ?? 'Failed to save data')
      }
    } catch {
      uiStore.setSaveError('An unexpected error occurred')
    } finally {
      uiStore.markSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}

      <Button disabled={uiStore.isSaving}>
        {uiStore.isSaving ? 'Saving...' : 'Save'}
      </Button>

      {uiStore.saveError && (
        <ErrorMessage message={uiStore.saveError} />
      )}

      {uiStore.isDirty && (
        <UnsavedChangesWarning />
      )}
    </form>
  )
}
```

---

### 9.3 Reset Flow

```typescript
import { useStep3UiStore } from '@/modules/intake/state/slices/step3-ui.slice'

function Step3Container() {
  const uiStore = useStep3UiStore()

  // Reset UI state when unmounting or navigating away
  useEffect(() => {
    return () => {
      uiStore.resetStep3Ui()
    }
  }, [])

  return <Step3Content />
}
```

---

## 10. Future Work & Recommendations

### 10.1 Immediate Next Task: UI Wiring

**Task:** Update UI components to use canonical slice

**Files to Update:**
- `src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx`
- `src/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection.tsx`
- `src/modules/intake/ui/step3-diagnoses-clinical/components/PsychiatricEvaluationSection.tsx`
- `src/modules/intake/ui/step3-diagnoses-clinical/components/FunctionalAssessmentSection.tsx`

**Changes Required:**
1. Replace legacy imports:
   ```typescript
   // ❌ Remove
   import { useDiagnosesUIStore } from '@/modules/intake/state/slices/step3'

   // ✅ Add
   import { useStep3UiStore } from '@/modules/intake/state/slices/step3-ui.slice'
   ```

2. Update store usage:
   ```typescript
   // ❌ Remove (domain data from store)
   const diagnosesStore = useDiagnosesUIStore()
   const primaryDiagnosis = diagnosesStore.primaryDiagnosis

   // ✅ Add (UI flags only)
   const uiStore = useStep3UiStore()
   const isSaving = uiStore.isSaving
   ```

3. Move form data to React Hook Form or component state

---

### 10.2 Cleanup Task: Remove Legacy Slices

**Task:** Delete legacy Step 3 slices after UI wiring complete

**Files to Delete:**
1. `src/modules/intake/state/slices/step3/diagnoses.ui.slice.ts`
2. `src/modules/intake/state/slices/step3/psychiatricEvaluation.ui.slice.ts`
3. `src/modules/intake/state/slices/step3/functionalAssessment.ui.slice.ts`
4. `src/modules/intake/state/slices/step3/index.ts`
5. Remove `step3/` directory (if empty)

**Validation:**
```bash
# Ensure no references to legacy slices
grep -r "useDiagnosesUIStore" src/modules/intake/ui/
grep -r "usePsychiatricEvaluationUIStore" src/modules/intake/ui/
grep -r "useFunctionalAssessmentUIStore" src/modules/intake/ui/
grep -r "from '@/modules/intake/state/slices/step3'" src/
```

**Expected:** 0 matches (all references removed)

---

### 10.3 Step 1 Alignment (Optional, P3)

**Current:** Step 1 uses different pattern (no devtools, section-specific state)

**Recommendation:** Consider aligning Step 1 with Step 2/Step 3 pattern for consistency

**Pros:**
- Consistent debugging experience across all steps
- Generic API (easier to maintain)
- Simpler mental model

**Cons:**
- Requires UI refactoring (low priority)
- Step 1 pattern works fine (not broken)

**Priority:** P3 (nice-to-have, not required)

---

## 11. Conclusion

### Status: ✅ **COMPLETE**

**Summary:**
- ✅ Created canonical Step 3 UI slice (`step3-ui.slice.ts`)
- ✅ 100% consistent with Step 2 (Insurance) gold standard
- ✅ UI-only flags (no domain data, no PHI, no tenancy)
- ✅ TypeScript compilation passes (0 new errors)
- ✅ ESLint validation passes (0 errors, 0 warnings)
- ✅ Legacy slices documented for future cleanup
- ✅ Minimal change (1 file created, 123 lines)
- ✅ No functional duplication
- ✅ SoC principles followed

**Deliverables:**
1. ✅ `src/modules/intake/state/slices/step3-ui.slice.ts` (new canonical slice)
2. ✅ `tmp/step3_ui_slice_consistency_report.md` (this report)

**Equivalence Verification:**
- ✅ State shape: 100% match with Step 2
- ✅ Action names: 100% match with Step 2 (except reset)
- ✅ Action signatures: 100% match with Step 2
- ✅ Devtools action names: 100% match (pattern)
- ✅ Store configuration: 100% match with Step 2

**Legacy Cleanup (Future Task):**
- ⏳ Update UI components to use `useStep3UiStore`
- ⏳ Remove 4 legacy files (~395 lines)
- ⏳ Delete `step3/` directory

**Next Steps:**
1. **Immediate:** Wire UI components to use new canonical slice
2. **After wiring:** Delete legacy slices
3. **Optional:** Align Step 1 with Step 2/Step 3 pattern (P3)

---

**Report Generated:** 2025-09-29
**By:** Claude Code Assistant
**Status:** ✅ Step 3 UI Slice Consistency Complete