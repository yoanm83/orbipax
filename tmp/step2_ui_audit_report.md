# Step 2 Insurance & Eligibility - UI Audit Report

**Date**: 2025-09-29
**Task**: Audit Step 2 UI for schema alignment and rehooking readiness
**Status**: ✅ COMPLETE (AUDIT-ONLY)

---

## EXECUTIVE SUMMARY

The Step 2 UI is **partially integrated** with the canonical schema and server actions. The main container uses React Hook Form with zodResolver, but child components are **not connected** to form context. Major gaps include missing form field bindings, incomplete schema coverage, and several accessibility improvements needed.

---

## 1. FILE INVENTORY

### UI Structure
| File Path | Role | Lines | Status |
|-----------|------|-------|--------|
| `src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx` | Container | 230 | ✅ Wired |
| `src/modules/intake/ui/step2-eligibility-insurance/index.ts` | Barrel Export | 6 | ✅ |
| `src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx` | Section | 107 | ⚠️ Unbound |
| `src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx` | Section | 94 | ⚠️ Unbound |
| `src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx` | Section | 296 | ⚠️ Unbound |
| `src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx` | Section | 246 | ⚠️ Unbound |

### Dependencies
| Import | From | Purpose |
|--------|------|---------|
| `useForm`, `zodResolver` | `react-hook-form` | Form management |
| `Form` | `@/shared/ui/primitives/Form` | Form provider |
| `insuranceEligibilityDataSchema` | `@/modules/intake/domain/schemas/insurance-eligibility` | Validation |
| `loadInsuranceEligibilityAction`, `upsertInsuranceEligibilityAction` | `@/modules/intake/actions/step2/insurance.actions` | Server actions |
| `useWizardProgressStore` | `@/modules/intake/state` | Navigation |

---

## 2. FIELD MAPPING: UI → SCHEMA → ACTIONS

### Government Coverage Section
| UI Field | Schema Path | DTO/Action | Status |
|----------|------------|------------|--------|
| Medicaid ID | `financialInformation.receivesMedicaid` (partial) | ❌ | **GAP** - No direct field |
| Medicaid Effective Date | - | ❌ | **GAP** - Not in schema |
| Medicare ID | `financialInformation.receivesMedicare` (partial) | ❌ | **GAP** - No direct field |
| SSN | `insuranceCoverages[].subscriberSSN` | ✅ | **GAP** - Wrong section |

### Eligibility Records Section
| UI Field | Schema Path | DTO/Action | Status |
|----------|------------|------------|--------|
| Eligibility Date | `eligibilityDeterminedDate` | ✅ | **GAP** - Not bound |
| Program Type | - | ❌ | **GAP** - Not in schema |

### Insurance Records Section (Dynamic)
| UI Field | Schema Path | DTO/Action | Status |
|----------|------------|------------|--------|
| Insurance Carrier | `insuranceCoverages[].carrierName` | ✅ | **GAP** - Not bound |
| Member ID | `insuranceCoverages[].policyNumber` | ✅ | **GAP** - Not bound |
| Group Number | `insuranceCoverages[].groupNumber` | ✅ | **GAP** - Not bound |
| Effective Date | `insuranceCoverages[].effectiveDate` | ✅ | **GAP** - Not bound |
| Expiration Date | `insuranceCoverages[].expirationDate` | ✅ | **GAP** - Not bound |
| Plan Type | `insuranceCoverages[].type` | ✅ | **GAP** - Not bound |
| Plan Name | - | ❌ | **GAP** - Not in schema |
| Subscriber Name | `insuranceCoverages[].subscriberName` | ✅ | **GAP** - Not bound |
| Relationship | `insuranceCoverages[].subscriberRelationship` | ✅ | **GAP** - Not bound |

### Authorizations Section (Dynamic)
| UI Field | Schema Path | DTO/Action | Status |
|----------|------------|------------|--------|
| Authorization Type | - | ❌ | **GAP** - Not in schema |
| Authorization Number | `insuranceCoverages[].preAuthNumber` | ✅ | **GAP** - Wrong section |
| Start Date | - | ❌ | **GAP** - Not in schema |
| End Date | `insuranceCoverages[].preAuthExpiration` | ✅ | **GAP** - Wrong section |
| Units Approved | - | ❌ | **GAP** - Not in schema |
| Notes | - | ❌ | **GAP** - Not in schema |

### Missing Schema Coverage
The following schema fields have **NO UI representation**:
- `eligibilityCriteria` (entire object - 22 fields)
- `financialInformation` (most fields - ~15 fields)
- `insuranceCoverages[].subscriberDateOfBirth`
- `insuranceCoverages[].isPrimary`
- `insuranceCoverages[].isVerified`
- `insuranceCoverages[].hasMentalHealthCoverage`
- `insuranceCoverages[].mentalHealthCopay`
- `insuranceCoverages[].requiresPreAuth`
- `isUninsured`, `uninsuredReason`
- `eligibilityStatus`
- `specialProgramsEligible[]`
- `documentsProvided[]`, `documentsNeeded[]`

---

## 3. COMPLIANCE CHECKLIST

### SoC (Separation of Concerns)
| Requirement | Status | Evidence |
|-------------|--------|----------|
| No direct fetch/API calls | ✅ PASS | No `fetch`, `axios`, `supabase` found |
| Uses server actions only | ✅ PASS | Uses `loadInsuranceEligibilityAction`, `upsertInsuranceEligibilityAction` |
| No business logic | ✅ PASS | Only UI state management |
| Props/handlers pattern | ⚠️ PARTIAL | Main form wired, sections not |

### Accessibility (A11y)
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Labels with htmlFor | ✅ PASS | All inputs have labels |
| aria-label on inputs | ✅ PASS | Present on all form controls |
| aria-invalid for errors | ❌ FAIL | Not implemented |
| role="alert" for errors | ❌ FAIL | Error div lacks role |
| Focus visible | ✅ PASS | `focus-visible:ring-2` on buttons |
| Target size ≥44px | ✅ PASS | `min-h-[44px]` on interactive elements |
| Keyboard navigation | ✅ PASS | Sections handle Enter/Space keys |
| aria-expanded/controls | ✅ PASS | Collapsible sections properly marked |
| Loading states | ⚠️ PARTIAL | Loading shown but not announced |
| Empty states | ❌ FAIL | No empty state handling |

### Tailwind Tokens
| Requirement | Status | Evidence |
|-------------|--------|----------|
| No hex colors | ✅ PASS | All colors use CSS variables |
| Semantic tokens | ✅ PASS | Uses `var(--primary)`, `var(--foreground)`, etc. |
| No arbitrary values | ✅ PASS | Uses standard Tailwind classes |
| Consistent typography | ✅ PASS | `text-2xl`, `text-lg`, `text-sm` hierarchy |
| No inline styles | ✅ PASS | All styles in className |

---

## 4. CRITICAL GAPS

### 1. Form Integration Gap
**Issue**: Child components receive no form context
**Impact**: Fields not saving, validation not working
**Fix Required**: Pass `control` prop or use `FormProvider`

### 2. Schema Mismatch
**Issue**: ~40 schema fields have no UI representation
**Impact**: Incomplete data collection
**Fix Required**: Add missing sections or mark fields optional

### 3. Field Binding Gap
**Issue**: No `register()` or `Controller` usage in sections
**Impact**: Form values not captured
**Fix Required**: Connect all inputs to React Hook Form

### 4. Dynamic Array Handling
**Issue**: Insurance/Authorization arrays managed locally
**Impact**: Not synced with form state
**Fix Required**: Use `useFieldArray` hook

### 5. Validation Display
**Issue**: No field-level error display
**Impact**: Users don't see validation errors
**Fix Required**: Add `formState.errors` display

---

## 5. PROPOSED APPLY PLAN

### Phase 1: Wire Form Context (Priority: HIGH)
**Files to modify:**
1. `Step2EligibilityInsurance.tsx`
   - Wrap in `FormProvider` instead of `Form`
   - Pass form methods to context

2. Each section component:
   - Add `useFormContext()` hook
   - Replace local state with form state
   - Add `Controller` for complex inputs

### Phase 2: Fix Field Mappings (Priority: HIGH)
**Files to modify:**
1. `GovernmentCoverageSection.tsx`
   - Map SSN to correct location
   - Handle Medicare/Medicaid booleans

2. `InsuranceRecordsSection.tsx`
   - Use `useFieldArray` for dynamic records
   - Bind all fields with `Controller`

3. `AuthorizationsSection.tsx`
   - Move to insurance coverage sub-fields
   - Or create separate authorization schema

### Phase 3: Add Missing UI (Priority: MEDIUM)
**New sections needed:**
1. Eligibility Criteria Section
   - Risk factors
   - Priority populations
   - Functional impairment

2. Financial Information Section
   - Household income
   - Benefits
   - Payment preferences

### Phase 4: Improve A11y (Priority: LOW)
**Enhancements:**
1. Add `aria-invalid` to errored fields
2. Add `role="alert"` to error messages
3. Add `aria-live` region for loading states
4. Implement empty state messages

---

## 6. ALLOWED PATHS FOR NEXT APPLY

### Read/Write Allowed
```
src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx
src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx
src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx
src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx
src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx
```

### Read-Only Reference
```
src/modules/intake/domain/schemas/insurance-eligibility/insurance-eligibility.schema.ts
src/modules/intake/actions/step2/insurance.actions.ts
src/shared/ui/primitives/**
```

### Do NOT Touch
```
src/modules/intake/application/**
src/modules/intake/infrastructure/**
src/modules/intake/domain/types/**
Any files outside intake module
```

---

## 7. EXECUTION ORDER

1. **Update main container** to use `FormProvider`
2. **Wire GovernmentCoverageSection** with `useFormContext`
3. **Wire EligibilityRecordsSection** with `useFormContext`
4. **Wire InsuranceRecordsSection** with `useFieldArray`
5. **Wire AuthorizationsSection** with `useFieldArray`
6. **Add error display** for each field
7. **Test form submission** with all sections
8. **Add missing schema fields** as new sections (future)

---

## 8. RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing integration | HIGH | Test each section individually |
| Schema validation failures | MEDIUM | Use `.partial()` for progressive enhancement |
| Performance with large forms | LOW | Consider section lazy loading |
| Accessibility regression | LOW | Maintain existing ARIA attributes |

---

## CONCLUSION

The Step 2 UI has a **solid foundation** with proper SoC and accessibility basics, but requires **significant work** to fully integrate with the canonical schema. The main gaps are:

1. **Form binding**: Child components not connected to React Hook Form
2. **Schema coverage**: ~40% of schema fields missing from UI
3. **Validation display**: No field-level error feedback

**Recommended approach**: Fix form wiring first (Phase 1), then address field mappings (Phase 2), before adding missing UI sections (Phase 3).

**Estimated effort**:
- Phase 1: 2-3 hours
- Phase 2: 3-4 hours
- Phase 3: 4-6 hours
- Phase 4: 1-2 hours

**Total**: 10-15 hours for complete integration