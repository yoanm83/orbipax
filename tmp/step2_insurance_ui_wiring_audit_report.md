# Step 2 Insurance UI Wiring Audit Report
## Governance Compliance and Technical Audit

**Date**: 2025-09-28
**Module**: `src/modules/intake/ui/step2-insurance`
**Audit Type**: AUDIT-ONLY
**Status**: 🔴 CRITICAL VIOLATIONS FOUND

---

## Executive Summary

The Step 2 Insurance UI implementation has **critical governance violations** that must be addressed:
1. **🔴 PII Exposure**: UI displays `error.message` directly (Lines 71, 95, 159)
2. **🟡 State Management**: Using local `useState` instead of store pattern
3. **🟡 Directory Structure**: Duplicate folder structure detected
4. **🟢 Accessibility**: Mostly compliant with minor gaps

---

## 1. ERROR HANDLING VIOLATIONS

### 🔴 CRITICAL: PII/PHI Exposure Risk

**Finding**: UI displays raw `error.message` from server actions

**Evidence**:
```typescript
// Line 71 - Load error handler
setLoadError(result.error?.message || 'Failed to load insurance data')

// Line 95 - Save error handler
setSaveError(result.error?.message || 'Failed to save insurance data')

// Line 159 - Error display
<span>{loadError}</span>
```

**Violation**: The UI should NEVER display `error.message` directly. Must map `error.code` to generic UI messages.

**Locations**:
- `intake-wizard-step2-insurance.tsx:71` - setLoadError uses message
- `intake-wizard-step2-insurance.tsx:95` - setSaveError uses message
- `intake-wizard-step2-insurance.tsx:159` - Renders raw error message

### ✅ SoC Compliance

**Finding**: Proper separation maintained
- No business logic in UI
- No direct fetch calls
- Delegates to server actions correctly
- Uses Domain schema for validation

---

## 2. ACCESSIBILITY AUDIT

### ✅ Compliant Elements

**Finding**: Good accessibility implementation

**Evidence**:
- Line 154-155: `role="alert"` and `aria-live="polite"` on error divs
- Line 195: `<FormMessage role="alert" />` for field errors
- Line 186: `aria-label` on form controls
- Line 97-98: Focus management on save error

### 🟡 Minor Gaps

**Finding**: Missing aria-describedby associations

**Evidence**:
- Form inputs don't link to their error messages via `aria-describedby`
- Should use: `aria-describedby={errors.field ? fieldErrorId : undefined}`

**Locations**:
- All `FormField` components (lines 175-198+)

---

## 3. STATE MANAGEMENT VIOLATIONS

### 🟡 MODERATE: Local useState Instead of Store

**Finding**: UI flags managed with local `useState`

**Evidence**:
```typescript
// Lines 38-41
const [isLoading, setIsLoading] = useState(true)
const [isSaving, setIsSaving] = useState(false)
const [loadError, setLoadError] = useState<string | null>(null)
const [saveError, setSaveError] = useState<string | null>(null)
```

**Violation**: Step 1 pattern uses UI-only store slice for these flags

**Required State Slice**:
- `step2UiSlice` with:
  - `isLoading`
  - `isSaving`
  - `loadError`
  - `saveError`
  - `isDirty`
  - `lastSavedAt`

---

## 4. STRUCTURE & DUPLICATION

### 🟡 MODERATE: Duplicate Directory Structure

**Finding**: Two parallel Step 2 directories exist

**Evidence**:
```bash
src/modules/intake/ui/
├── step2-eligibility-insurance/  # Original (Sept 24)
│   ├── Step2EligibilityInsurance.tsx
│   └── components/
└── step2-insurance/              # New (Sept 28)
    └── intake-wizard-step2-insurance.tsx
```

**Violation**: "Search before create" principle - should have reused existing structure

**Recommendation**: Consolidate into single `step2-insurance` directory

---

## 5. SENTINEL CHECKLIST

| Item | Status | Evidence |
|------|--------|----------|
| **SoC Maintained** | ✅ PASS | No business logic in UI |
| **A11y Compliant** | 🟡 PARTIAL | Missing some aria-describedby |
| **Generic Errors Only** | 🔴 FAIL | Shows error.message (Line 71, 95) |
| **Store UI-Only Pattern** | 🔴 FAIL | Uses useState (Line 38-41) |
| **Search Before Create** | 🔴 FAIL | Created duplicate directory |
| **No console.*** | ✅ PASS | No console statements found |
| **No Toasts** | ✅ PASS | No toast usage |
| **Semantic Tokens** | ✅ PASS | Uses CSS variables |

**Overall**: 4/8 PASS (50%)

---

## 6. ADDITIONAL FINDINGS

### ✅ Positive Findings
- Proper use of RHF + Zod
- Good form.reset() on data load
- Correct server action integration
- Semantic Tailwind tokens

### 🟡 Code Quality Issues
- No loading skeleton (just text)
- No error retry mechanism
- No unsaved changes warning

---

## 7. PRIORITY REMEDIATION PLAN

### 🚨 CRITICAL MICRO-TASK (Next APPLY)

**Task**: Fix PII exposure and migrate to store pattern

**Steps**:
1. **Create error mapper** (30 min):
   ```typescript
   const ERROR_MESSAGES = {
     UNAUTHORIZED: 'Please sign in to continue',
     VALIDATION_FAILED: 'Please check the form for errors',
     CONFLICT: 'This insurance record already exists',
     NOT_FOUND: 'Insurance information not found',
     UNKNOWN: 'An error occurred. Please try again'
   }

   // Replace lines 71, 95:
   setLoadError(ERROR_MESSAGES[result.error?.code] || ERROR_MESSAGES.UNKNOWN)
   ```

2. **Create Step2 UI slice** (45 min):
   ```typescript
   // state/slices/step2-ui.slice.ts
   interface Step2UiState {
     isLoading: boolean
     isSaving: boolean
     loadError: string | null
     saveError: string | null
     isDirty: boolean
     lastSavedAt: string | null
   }
   ```

3. **Replace useState with store** (30 min):
   ```typescript
   // Remove lines 38-41
   const { isLoading, isSaving, loadError, saveError } = useStep2UiStore()
   const { setLoading, setSaving, setLoadError, setSaveError } = useStep2UiStore()
   ```

4. **Add aria-describedby** (15 min):
   ```typescript
   <Input
     aria-describedby={errors.field ? `${field.name}-error` : undefined}
   />
   <FormMessage id={`${field.name}-error`} />
   ```

**Estimated Time**: 2 hours

---

## 8. LONG-TERM RECOMMENDATIONS

1. **Directory Consolidation**:
   - Merge `step2-eligibility-insurance` into `step2-insurance`
   - Move all components to single location
   - Update imports across codebase

2. **Error Handling Standard**:
   - Create shared error mapper utility
   - Document error code mappings
   - Add to governance guidelines

3. **State Management Pattern**:
   - Document store-first approach
   - Create template for new steps
   - Add linting rules for useState

---

## 9. CONCLUSION

The Step 2 Insurance UI implementation is **functionally complete** but has **critical governance violations**:

1. **🔴 PII Risk**: Must fix error.message exposure immediately
2. **🟡 State Pattern**: Should migrate to store pattern
3. **🟡 Structure**: Should consolidate duplicate directories

**Recommendation**: Execute the critical micro-task BEFORE any new features.

---

## 10. AUDIT METADATA

**Auditor**: Claude Assistant
**Files Audited**:
- `src/modules/intake/ui/step2-insurance/intake-wizard-step2-insurance.tsx`
- `src/modules/intake/ui/step2-eligibility-insurance/` (structure only)
- `src/modules/intake/actions/step2/insurance.actions.ts` (reference)

**Tools Used**:
- Static code analysis
- Pattern matching
- Governance checklist validation

**Next Audit**: After remediation task completion

---

**CRITICAL ACTION REQUIRED**: Fix PII exposure (lines 71, 95, 159) before production deployment.