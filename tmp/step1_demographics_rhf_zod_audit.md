# Step 1 Demographics: RHF + Zod Audit Report

**Date**: 2025-09-27
**Task**: Audit React Hook Form + Zod integration
**Type**: AUDIT-ONLY (read-only inspection)
**Target**: Step 1 Demographics validation infrastructure

## Executive Summary

❌ **RHF+Zod NOT READY** - Schema exists in Domain but UI lacks React Hook Form integration entirely. Major gap requiring immediate remediation.

## 1. Schema Zod (Domain/Application)

### ✅ SCHEMA EXISTS - Comprehensive and USCDI v4 Compliant

**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics.schema.ts`

**Main Exports**:
- `demographicsDataSchema` - Core validation schema
- `demographicsSubmissionSchema` - Multitenant wrapper with metadata
- `validateDemographicsStep()` - Helper function for safeParse
- `validateDemographicsSubmission()` - Helper for submission validation

**Schema Shape Overview**:
```typescript
demographicsDataSchema = {
  // Identity (lines 75-96)
  firstName: string (required, max 50, normalized)
  middleName?: string (optional, max 50)
  lastName: string (required, max 50, normalized)
  preferredName?: string (optional, max 30)

  // Demographics (lines 99-114)
  dateOfBirth: Date (required, age 0-150, not future)
  genderIdentity: enum GenderIdentity
  sexAssignedAtBirth: enum SexAssignedAtBirth
  pronouns?: string (optional, max 20)
  race: array of Race enum (min 1)
  ethnicity: enum Ethnicity

  // Social (lines 116-123)
  maritalStatus: enum MaritalStatus
  veteranStatus: enum VeteranStatus
  primaryLanguage: enum Language
  needsInterpreter: boolean
  preferredCommunicationMethod: array of CommunicationMethod (min 1)

  // Contact (lines 126-135)
  email?: string (optional, email format, max 100)
  phoneNumbers: array of phoneNumberSchema (1-3, one primary)

  // Address (lines 137-140)
  address: addressSchema (required)
  sameAsMailingAddress: boolean
  mailingAddress?: addressSchema (optional)

  // Emergency (line 143)
  emergencyContact: emergencyContactSchema (required)

  // CMH Specific (lines 146-153)
  socialSecurityNumber?: string (SSN format, optional)
  driverLicenseNumber?: string (optional, max 20)
  driverLicenseState?: string (optional, max 2)

  // Legal Guardian (lines 155-165)
  hasLegalGuardian: boolean
  legalGuardianInfo?: object (optional, conditional)
}
```

**Validation Features**:
- Custom validators: `validatePhoneNumber`, `validateName`, `normalizeName`
- Transforms: Phone numbers cleaned, names normalized
- Refinements: Age validation, phone primary uniqueness
- Helper functions: `calculateAge()`, `isMinor()`
- Imports from: `@/shared/utils/phone`, `@/shared/utils/name`

## 2. UI Step 1 (RHF + zodResolver)

### ❌ NO RHF INTEGRATION FOUND

**Main Component**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\intake-wizard-step1-demographics.tsx`

**Current State Management**:
- ❌ No `useForm` hook
- ❌ No `zodResolver` import
- ❌ No `FormProvider` wrapper
- ✅ Using Zustand stores for UI state (`useStep1UIStore`, `useWizardProgressStore`)
- ⚠️ Local React `useState` in each section component

**Section Components Analyzed**:
1. **PersonalInfoSection.tsx**: Local state, no RHF
2. **AddressSection.tsx**: Local state, no RHF
3. **ContactSection.tsx**: Local state with TODOs for server-driven form
4. **LegalSection.tsx**: Local state, no validation

**Form Primitives Available**:
✅ Form primitives exist at `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\Form\index.tsx`:
- `Form` (FormProvider from react-hook-form)
- `FormField` (Controller wrapper)
- `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- `FormDescription`

**A11y Features in Primitives**:
✅ `aria-invalid={!!error}` (line 121)
✅ `aria-describedby` with formDescriptionId and formMessageId (lines 116-120)
❌ No `role="alert"` on FormMessage component

## 3. Server Actions/Services

### ⚠️ NO DEMOGRAPHICS-SPECIFIC ACTION FOUND

**Searched Locations**:
- `D:\ORBIPAX-PROJECT\src\modules\intake\application\` - No demographics actions
- Found only: `review.actions.ts` with `getIntakeSnapshot()` function

**Gap**: Missing server action for demographics submission like:
```typescript
// Expected but not found:
export async function submitDemographics(data: unknown) {
  const result = demographicsSubmissionSchema.safeParse(data)
  if (!result.success) return { ok: false, error: result.error }
  // ... save logic
  return { ok: true, data: saved }
}
```

## 4. Field Mapping: UI → Schema

### Current UI Fields vs Schema Coverage

| UI Field | Schema Field | Validation Rules | Status |
|----------|--------------|------------------|--------|
| **PersonalInfoSection** ||||
| firstName | ✅ firstName | required, max 50, normalized | ❌ No validation |
| lastName | ✅ lastName | required, max 50, normalized | ❌ No validation |
| preferredName | ✅ preferredName | optional, max 30 | ❌ No validation |
| dateOfBirth | ✅ dateOfBirth | Date, age 0-150 | ❌ No validation |
| genderIdentity | ✅ genderIdentity | enum GenderIdentity | ❌ No validation |
| race | ✅ race | array, min 1 | ❌ No validation |
| ethnicity | ✅ ethnicity | enum Ethnicity | ❌ No validation |
| primaryLanguage | ✅ primaryLanguage | enum Language | ❌ No validation |
| veteranStatus | ✅ veteranStatus | enum VeteranStatus | ❌ No validation |
| maritalStatus | ✅ maritalStatus | enum MaritalStatus | ❌ No validation |
| ssn | ✅ socialSecurityNumber | SSN format | ❌ No validation |
| **AddressSection** ||||
| homeAddress | ✅ address.street1 | required, max 100 | ❌ No validation |
| addressLine2 | ✅ address.street2 | optional, max 100 | ❌ No validation |
| city | ✅ address.city | required, max 50 | ❌ No validation |
| state | ✅ address.state | required, 2 chars | ❌ No validation |
| zipCode | ✅ address.zipCode | ZIP format | ❌ No validation |
| differentMailingAddress | ✅ sameAsMailingAddress | boolean (inverted) | ❌ No validation |
| mailingAddress | ✅ mailingAddress.street1 | conditional | ❌ No validation |
| **ContactSection** ||||
| primaryPhone | ⚠️ phoneNumbers[0] | array format mismatch | ❌ No validation |
| alternatePhone | ⚠️ phoneNumbers[1] | array format mismatch | ❌ No validation |
| email | ✅ email | email format | ❌ No validation |
| contactPreference | ⚠️ preferredCommunicationMethod | array vs single | ❌ No validation |
| emergencyContact.name | ✅ emergencyContact.name | required, max 100 | ❌ No validation |
| emergencyContact.phone | ✅ emergencyContact.phoneNumber | required, valid phone | ❌ No validation |
| emergencyContact.relationship | ✅ emergencyContact.relationship | required, max 50 | ❌ No validation |
| **LegalSection** ||||
| hasLegalGuardian | ✅ hasLegalGuardian | boolean | ❌ No validation |
| guardianInfo | ✅ legalGuardianInfo | conditional object | ❌ No validation |

### Schema Fields Missing in UI

| Schema Field | Description | Priority |
|--------------|-------------|----------|
| middleName | Middle name field | Low |
| sexAssignedAtBirth | Required by USCDI v4 | **HIGH** |
| pronouns | Gender pronouns | Medium |
| needsInterpreter | Accessibility requirement | **HIGH** |
| phoneNumbers as array | Schema expects array structure | **HIGH** |
| driverLicenseNumber | CMH specific | Low |
| driverLicenseState | CMH specific | Low |

### UI Fields Not in Schema

| UI Field | Location | Issue |
|----------|----------|-------|
| fullName | PersonalInfoSection | Computed, not stored |
| photoPreview | PersonalInfoSection | Not in schema |
| housingStatus | AddressSection | Missing from schema |
| secondaryEmail | ContactSection | Not in schema |
| hasPowerOfAttorney | LegalSection | Not in schema |

## 5. Gaps Analysis

### Critical Gaps (Must Fix)

1. **NO REACT HOOK FORM INTEGRATION**
   - Step 1 uses local React state instead of RHF
   - No form validation on submit
   - No real-time field validation
   - No error messages displayed

2. **NO ZOD RESOLVER WIRING**
   - Schema exists but unused
   - No `zodResolver(demographicsDataSchema)` in useForm
   - No runtime type safety

3. **MISSING SERVER ACTION**
   - No demographics submission action
   - No server-side validation
   - No data persistence mechanism

4. **FIELD MISALIGNMENTS**
   - Phone numbers: UI has individual fields, schema expects array
   - Communication preference: UI single select, schema expects array
   - Missing required USCDI v4 fields (sexAssignedAtBirth, needsInterpreter)

### Medium Priority Gaps

5. **A11Y INCOMPLETE**
   - FormMessage lacks `role="alert"`
   - No inline error messages shown
   - No validation feedback to screen readers

6. **DATA TRANSFORMATION NEEDED**
   - Phone formatting/cleaning not connected
   - Name normalization not applied
   - Date handling needs conversion

### Low Priority Gaps

7. **OPTIONAL FIELDS MISSING**
   - Driver's license info
   - Middle name
   - Multiple phone types

## 6. Proposed Next Micro-Task

### Recommendation: Wire RHF + zodResolver to Step 1

**Task**: Implement React Hook Form with zodResolver in Step 1 Demographics, connecting to existing Domain schema.

**Scope**:
1. Add RHF to main wrapper component
2. Wire zodResolver with demographicsDataSchema
3. Replace local state with RHF register/control
4. Connect Form primitives (FormField, FormControl, FormMessage)
5. Display validation errors inline
6. Transform data on submit to match schema structure

**Files to modify**:
- `intake-wizard-step1-demographics.tsx` - Add useForm, FormProvider
- Each section component - Replace useState with RHF fields
- Import schema from Domain (no new schemas)

**Deliverable**: Working form validation with error display, no server submission yet.

## 7. Validation Summary

| Requirement | Status | Details |
|-------------|--------|---------|
| Schema exists in Domain | ✅ | Comprehensive, USCDI v4 compliant |
| RHF integration in UI | ❌ | No useForm, no FormProvider |
| zodResolver wiring | ❌ | Schema unused |
| Form primitives used | ❌ | Available but not integrated |
| A11y compliance | ⚠️ | Partial in primitives, no role="alert" |
| Server action exists | ❌ | No demographics submission action |
| Field alignment | ⚠️ | ~70% aligned, structure mismatches |

## Conclusion

**Status**: ❌ **NOT READY** - Step 1 Demographics has a robust Zod schema but completely lacks React Hook Form integration.

**Critical Path**:
1. **Immediate**: Wire RHF + zodResolver (next micro-task)
2. **Next**: Create server action with validation
3. **Then**: Fix field misalignments (phone array structure)
4. **Finally**: Add missing USCDI v4 fields

The schema quality is excellent with proper validation rules, transforms, and refinements. The gap is entirely in the UI layer's lack of form library integration. This is a straightforward technical debt item that can be resolved systematically.

---

**Auditor**: Claude Assistant
**Date**: 2025-09-27
**Recommendation**: Proceed with RHF wiring as next task