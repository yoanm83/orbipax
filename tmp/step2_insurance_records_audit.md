# Step 2 InsuranceRecordsSection Audit Report

**Date**: 2025-09-29
**Task**: Audit InsuranceRecordsSection for canonical schema alignment
**Status**: ✅ AUDIT COMPLETE

---

## EXECUTIVE SUMMARY

InsuranceRecordsSection manages dynamic insurance records with add/remove functionality. Currently uses **local state** instead of form context. Found 9 UI fields per record, with 2 GAPS (Plan Type and Plan Name not in schema). The section needs integration with `useFormContext` and `useFieldArray` to properly manage the `insuranceCoverages[]` array.

---

## 1. FILE INVENTORY

### Primary Component
| File | Lines | Role | Current State |
|------|-------|------|---------------|
| `InsuranceRecordsSection.tsx` | 296 | UI Component | ❌ Not connected to form |

### Key Characteristics
- **Dynamic records**: Add/remove functionality with local state
- **Fields per record**: 9 fields
- **Current binding**: NONE - uses local state
- **Form integration**: Missing `useFormContext`

---

## 2. UI FIELDS INVENTORY

### Fields Found (Per Insurance Record)
| # | Field Label | Input Type | Required | Current ID Pattern |
|---|-------------|------------|----------|-------------------|
| 1 | **Insurance Carrier** | Select | Yes (*) | `ins-${uid}-carrier` |
| 2 | **Member ID** | Input | Yes (*) | `ins-${uid}-memberId` |
| 3 | **Group Number** | Input | No | `ins-${uid}-groupNumber` |
| 4 | **Effective Date** | DatePicker | Yes (*) | `ins-${uid}-effectiveDate` |
| 5 | **Expiration Date** | DatePicker | No | `ins-${uid}-expirationDate` |
| 6 | **Plan Type** | Select | No | `ins-${uid}-planType` |
| 7 | **Plan Name** | Input | No | `ins-${uid}-planName` |
| 8 | **Subscriber Name** | Input | No | `ins-${uid}-subscriberName` |
| 9 | **Relationship to Subscriber** | Select | No | `ins-${uid}-relationship` |

### Select Options
- **Insurance Carrier**: Aetna, BCBS, Cigna, Humana, United, Other
- **Plan Type**: HMO, PPO, EPO, POS, HDHP, Other
- **Relationship**: Self, Spouse, Child, Other

---

## 3. UI → SCHEMA → DTO MAPPING TABLE

| UI Field | Schema Path | Schema Location | DTO Path | Status |
|----------|------------|-----------------|----------|--------|
| **Insurance Carrier** | `insuranceCoverages[].carrierName` | Line 26-30 | `carrierName` | ✅ Exists |
| **Member ID** | `insuranceCoverages[].policyNumber` | Line 31 | `policyNumber` | ✅ Exists |
| **Group Number** | `insuranceCoverages[].groupNumber` | Line 32 | `groupNumber` | ✅ Exists |
| **Effective Date** | `insuranceCoverages[].effectiveDate` | Line 48 | `effectiveDate` | ✅ Exists |
| **Expiration Date** | `insuranceCoverages[].expirationDate` | Line 49 | `expirationDate` | ✅ Exists |
| **Plan Type** | **GAP - Not in schema** | - | - | ❌ Missing |
| **Plan Name** | **GAP - Not in schema** | - | - | ❌ Missing |
| **Subscriber Name** | `insuranceCoverages[].subscriberName` | Line 35-39 | `subscriberName` | ✅ Exists |
| **Relationship** | `insuranceCoverages[].subscriberRelationship` | Line 41 | `subscriberRelationship` | ✅ Exists |

### Missing Schema Fields (Not in UI)
The following fields exist in schema but are NOT in the UI:
- `type` (InsuranceType enum) - **CRITICAL**
- `subscriberDateOfBirth` - **REQUIRED in schema**
- `subscriberSSN` (optional)
- `isPrimary` (boolean) - **IMPORTANT**
- `isVerified`, `verificationDate`, `verificationNotes`
- `hasMentalHealthCoverage`, `mentalHealthCopay`, `mentalHealthDeductible`, `annualMentalHealthLimit`
- `requiresPreAuth`, `preAuthNumber`, `preAuthExpiration`

---

## 4. GAP ANALYSIS

### Gap 1: Plan Type Field
- **UI Has**: Select with HMO/PPO/EPO/POS/HDHP/Other
- **Schema Has**: Nothing
- **Impact**: Data loss on submit
- **Recommendation**: Either add to schema or remove from UI

### Gap 2: Plan Name Field
- **UI Has**: Free text input
- **Schema Has**: Nothing
- **Impact**: Data loss on submit
- **Recommendation**: Either add to schema or remove from UI

### Gap 3: Insurance Type (Critical)
- **UI Has**: Nothing
- **Schema Has**: Required enum field
- **Impact**: Validation will fail
- **Recommendation**: Add hidden field or derive from carrier

### Gap 4: Subscriber DOB
- **UI Has**: Nothing
- **Schema Has**: Required date field
- **Impact**: Validation will fail
- **Recommendation**: Add DatePicker field to UI

### Gap 5: Primary Insurance Flag
- **UI Has**: Nothing
- **Schema Has**: Required boolean
- **Impact**: Cannot determine primary coverage
- **Recommendation**: Add checkbox or radio button

---

## 5. COMPLIANCE CHECKLIST

### SoC (Separation of Concerns)
| Requirement | Status | Evidence |
|-------------|--------|----------|
| No fetch/API calls | ✅ PASS | No imports of fetch/axios/supabase |
| No business logic | ✅ PASS | Only UI state management |
| Uses server actions | N/A | Component doesn't submit |
| No Zod in UI | ✅ PASS | No validation logic |
| Props/handlers pattern | ⚠️ PARTIAL | Has props but no form connection |

### Accessibility (A11y)
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Labels with htmlFor | ✅ PASS | All inputs have labels (Line 125, 150, etc) |
| aria-label on inputs | ✅ PASS | Present on all form controls |
| aria-required | ✅ PASS | On required fields (Line 133, 158) |
| aria-invalid for errors | ❌ FAIL | No error handling |
| role="alert" for errors | ❌ FAIL | No error messages |
| Focus management | ✅ PASS | Section header keyboard accessible |
| Target size ≥44px | ✅ PASS | `min-h-[44px]` on interactive elements |
| Keyboard navigation | ✅ PASS | Enter/Space handled (Line 71-75) |
| aria-expanded/controls | ✅ PASS | On collapsible section (Line 79-80) |
| Loading states | ❌ FAIL | No loading indicators |
| Empty states | ⚠️ PARTIAL | Always shows 1 record minimum |

### Tailwind Tokens
| Requirement | Status | Evidence |
|-------------|--------|----------|
| No hex colors | ✅ PASS | Uses CSS variables |
| Semantic tokens | ✅ PASS | `var(--primary)`, `var(--destructive)` |
| No arbitrary values | ✅ PASS | Standard Tailwind classes |
| Consistent spacing | ✅ PASS | Uses gap-4, space-y-6 |
| Responsive grid | ✅ PASS | `md:grid-cols-2` (Line 122) |

---

## 6. APPLY PLAN (Next Task)

### Step 1: Connect to Form Context
**File**: `InsuranceRecordsSection.tsx`

**Changes Required**:
1. Import `useFormContext` and `useFieldArray` from react-hook-form
2. Remove local `records` state
3. Replace with:
   ```typescript
   const { control, formState: { errors } } = useFormContext()
   const { fields, append, remove } = useFieldArray({
     control,
     name: 'insuranceCoverages'
   })
   ```

### Step 2: Update Field Bindings
Map each field to canonical path:
- Replace manual IDs with array indices
- Use `Controller` for DatePicker and Select components
- Use `register()` for Input components
- Add error handling with `errors?.insuranceCoverages?.[index]?.fieldName`

### Step 3: Handle Missing Required Fields
**Option A**: Add missing UI fields
- Add Insurance Type select (medicare/medicaid/private/etc)
- Add Subscriber DOB DatePicker
- Add Primary Insurance checkbox

**Option B**: Set defaults in append()
- Default `type` to 'private'
- Default `subscriberDateOfBirth` to today
- Default `isPrimary` based on array length

### Step 4: Remove Gap Fields
- Remove Plan Type select (not in schema)
- Remove Plan Name input (not in schema)
- OR propose schema extension

### Execution Order:
1. Add imports and hooks
2. Replace state management
3. Update all field bindings
4. Add error display
5. Handle required fields
6. Test add/remove functionality

---

## 7. ALLOWED PATHS FOR APPLY

### Read/Write:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\components\InsuranceRecordsSection.tsx
```

### Read-Only Reference:
```
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\insurance-eligibility\insurance-eligibility.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\application\step2\dtos.ts
D:\ORBIPAX-PROJECT\src\shared\ui\primitives\**
```

### Do NOT Touch:
```
- Schema files (don't add fields)
- DTO files (don't modify contracts)
- Actions/Infrastructure
- Other UI sections
- Global styles
```

---

## 8. RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing required fields | HIGH | Add defaults or UI fields |
| Gap fields data loss | MEDIUM | Remove or extend schema |
| Array index management | MEDIUM | Use stable field.id from useFieldArray |
| Validation failures | HIGH | Ensure all required fields have values |
| Performance with many records | LOW | React Hook Form handles efficiently |

---

## 9. RECOMMENDATIONS

### Immediate (APPLY Task)
1. **Priority 1**: Connect to form context with useFieldArray
2. **Priority 2**: Add missing required fields (type, subscriberDOB, isPrimary)
3. **Priority 3**: Remove or document gap fields (planType, planName)

### Future Considerations
1. Add mental health coverage fields
2. Add verification status fields
3. Add pre-authorization fields
4. Consider max 3 insurance limit (schema has this)
5. Add primary insurance validation (only 1 allowed)

---

## CONCLUSION

InsuranceRecordsSection is well-structured for UI but **completely disconnected** from the form context. Major work needed:
- Replace local state with useFieldArray
- Add 3 missing required fields
- Remove 2 gap fields or extend schema
- Proper error handling throughout

**Estimated APPLY effort**: 45-60 minutes for complete integration

**Critical Issues**:
- ❌ No form connection (100% local state)
- ❌ Missing required schema fields
- ❌ Gap fields will cause data loss
- ❌ No error display

The component needs significant refactoring to align with the canonical schema and integrate with React Hook Form.