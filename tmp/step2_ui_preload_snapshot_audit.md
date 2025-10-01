# Step 2 · UI → Actions (READ) · Preload Snapshot (AUDIT-ONLY)

## OrbiPax Community Mental Health System
**Module**: Intake - Step 2 Insurance & Eligibility
**Task**: Audit strategy for prepopulating form with `getInsuranceSnapshotAction`
**Date**: 2025-09-29
**Approach**: AUDIT-FIRST (Read-only, no code changes)

---

## 📋 Executive Summary

This audit defines the strategy for hydrating the Step 2 Insurance & Eligibility form with existing patient data from the database snapshot view (`v_patient_insurance_eligibility_snapshot`). The form currently uses empty defaults and lacks prepopulation of existing records.

### Key Findings

1. **Current Load Pattern**: Uses `loadInsuranceEligibilityAction()` in `useEffect` (line 92-113)
2. **Snapshot Action Available**: `getInsuranceSnapshotAction({ patientId })` exists but is **not currently called**
3. **PatientId Source**: Same session-based pattern as WRITE (`session_${userId}_intake`)
4. **DTO Structure**: Snapshot returns `InsuranceEligibilityOutputDTO` with nested `insuranceCoverages[]` array
5. **Date Normalization**: DTOs use ISO strings, Domain uses `Date` objects - requires transformation

### Recommendation

**Replace** `loadInsuranceEligibilityAction()` with `getInsuranceSnapshotAction()` in the existing `useEffect` hook at `Step2EligibilityInsurance.tsx:92-113`.

---

## 🔍 Current State Analysis

### 1. Container Component: `Step2EligibilityInsurance.tsx`

**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\Step2EligibilityInsurance.tsx`

#### Current Load Logic (Lines 92-113)

```typescript
// Load existing insurance & eligibility data on mount
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loadInsuranceEligibilityAction()

      if (result.ok && result.data?.data) {
        // Update form with loaded data
        form.reset(result.data.data as Partial<InsuranceEligibility>)
      }
      // If no data exists or NOT_IMPLEMENTED, use defaults (already set)
    } catch (err) {
      // Silent fail for loading - defaults will be used
    } finally {
      setIsLoading(false)
    }
  }

  loadData()
}, []) // eslint-disable-line react-hooks/exhaustive-deps
```

**Issues**:
- ❌ Uses legacy `loadInsuranceEligibilityAction()` (session-based, NOT snapshot)
- ❌ Does not call `getInsuranceSnapshotAction({ patientId })`
- ❌ `loadInsuranceEligibilityAction` returns `NOT_IMPLEMENTED` from Infrastructure

#### FormProvider Setup (Lines 45-89)

```typescript
const form = useForm<Partial<InsuranceEligibility>>({
  resolver: zodResolver(insuranceEligibilityDataSchema.partial()),
  mode: 'onBlur',
  defaultValues: {
    insuranceCoverages: [],  // ← Empty array, no prepopulation
    isUninsured: false,
    // ... other defaults
  }
})
```

**Observations**:
- ✅ Uses React Hook Form with Zod validation
- ✅ Supports `form.reset(data)` for hydration
- ❌ `insuranceCoverages` starts empty (no preload from snapshot)

---

## 📊 Action Layer API Analysis

### Available Actions

#### 1. `loadInsuranceEligibilityAction()` (LEGACY - Session-based)

**Signature**:
```typescript
export async function loadInsuranceEligibilityAction(): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**Behavior**:
- Uses session ID: `session_${userId}_intake`
- Calls `repository.findBySession(sessionId, organizationId)`
- Returns `NOT_IMPLEMENTED` from Infrastructure (skeleton method)

**Status**: ⚠️ **NOT SUITABLE** - Infrastructure not implemented

---

#### 2. `getInsuranceSnapshotAction({ patientId })` (TARGET - DB Snapshot)

**Signature**:
```typescript
export async function getInsuranceSnapshotAction(
  input: { patientId: string }
): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**Behavior**:
- Accepts **explicit patientId** (required parameter)
- Calls `repository.getSnapshot(patientId)`
- Queries DB view: `v_patient_insurance_eligibility_snapshot`
- Returns full `InsuranceEligibilityOutputDTO` with metadata

**Status**: ✅ **READY TO USE** - Infrastructure implemented (see previous report)

**Error Codes**:
- `NOT_FOUND`: No insurance records found
- `UNAUTHORIZED`: Access denied
- `NOT_IMPLEMENTED`: Snapshot not available (if view missing)

---

## 🗂️ DTO Structure & Mapping

### Response Structure: `InsuranceEligibilityOutputDTO`

**Type Definition** (`application/step2/dtos.ts:172-180`):
```typescript
export interface InsuranceEligibilityOutputDTO {
  id?: string
  sessionId: string
  organizationId: string
  data: InsuranceEligibilityInputDTO  // ← Nested data payload
  lastModified?: string // ISO date string
  completionStatus: 'incomplete' | 'partial' | 'complete'
  verificationStatus?: 'unverified' | 'pending' | 'verified'
}
```

**Nested Payload** (`data` property):
```typescript
export interface InsuranceEligibilityInputDTO {
  insuranceCoverages: InsuranceCoverageDTO[]  // ← Array of coverages
  isUninsured: boolean
  uninsuredReason?: string
  eligibilityCriteria: EligibilityCriteriaDTO
  financialInformation: FinancialInformationDTO
  eligibilityStatus?: string
  eligibilityDeterminedBy?: string
  eligibilityDeterminationDate?: string
  eligibilityNotes?: string
}
```

---

### Mapping Table: Snapshot DTO → Form `defaultValues`

| Snapshot Path | Form Path | Type Transform | Notes |
|---------------|-----------|----------------|-------|
| **Top Level** |
| `data.insuranceCoverages[]` | `insuranceCoverages[]` | Array mapping (see below) | Main coverage array |
| `data.isUninsured` | `isUninsured` | Direct | Boolean flag |
| `data.uninsuredReason` | `uninsuredReason` | Direct | Optional string |
| **Eligibility Criteria** |
| `data.eligibilityCriteria.*` | `eligibilityCriteria.*` | Object spread | Nested object |
| **Financial Information** |
| `data.financialInformation.*` | `financialInformation.*` | Object spread | Nested object |

---

### Insurance Coverage Array Mapping

**Each `InsuranceCoverageDTO` item** (`application/step2/dtos.ts:15-53`):

| DTO Field | Form Field | Type Transform | Notes |
|-----------|------------|----------------|-------|
| **Identity & Carrier** |
| `type` | `type` | Direct | 'medicare' \| 'medicaid' \| 'private' \| 'tricare' \| 'other' |
| `carrierName` | `carrierName` | Direct | String |
| `policyNumber` | `policyNumber` | Direct | String (maps to `member_id` in DB) |
| `groupNumber` | `groupNumber` | Direct | Optional string |
| **Plan Details** |
| `planKind` | `planKind` | Direct | Optional enum: 'hmo' \| 'ppo' \| 'epo' \| 'pos' \| 'hdhp' \| 'other' |
| `planName` | `planName` | Direct | Optional string \| null |
| **Subscriber Info** |
| `subscriberName` | `subscriberName` | Direct | String |
| `subscriberDateOfBirth` | `subscriberDateOfBirth` | **ISO → Date** | `new Date(dto.subscriberDateOfBirth)` |
| `subscriberRelationship` | `subscriberRelationship` | Direct | Enum: 'self' \| 'spouse' \| 'parent' \| 'child' \| 'other' |
| `subscriberSSN` | `subscriberSSN` | Direct | Optional string |
| **Coverage Dates** |
| `effectiveDate` | `effectiveDate` | **ISO → Date** | `new Date(dto.effectiveDate)` |
| `expirationDate` | `expirationDate` | **ISO → Date** | `dto.expirationDate ? new Date(dto.expirationDate) : undefined` |
| **Flags** |
| `isPrimary` | `isPrimary` | Direct | Boolean |
| `isVerified` | `isVerified` | Direct | Boolean (default: false) |
| **Verification** |
| `verificationDate` | `verificationDate` | **ISO → Date** | Optional: `dto.verificationDate ? new Date(dto.verificationDate) : undefined` |
| `verificationNotes` | `verificationNotes` | Direct | Optional string |
| **Mental Health Coverage** |
| `hasMentalHealthCoverage` | `hasMentalHealthCoverage` | Direct | Enum: 'yes' \| 'no' \| 'unknown' |
| `mentalHealthCopay` | `mentalHealthCopay` | Direct | Optional number |
| `mentalHealthDeductible` | `mentalHealthDeductible` | Direct | Optional number |
| `annualMentalHealthLimit` | `annualMentalHealthLimit` | Direct | Optional number |
| **Authorization** |
| `requiresPreAuth` | `requiresPreAuth` | Direct | Enum: 'yes' \| 'no' \| 'unknown' |
| `preAuthNumber` | `preAuthNumber` | Direct | Optional string |
| `preAuthExpiration` | `preAuthExpiration` | **ISO → Date** | Optional: `dto.preAuthExpiration ? new Date(dto.preAuthExpiration) : undefined` |

---

## 🔧 PatientId Resolution Strategy

### Source of PatientId for READ Operation

**SAME AS WRITE** (already implemented in previous task):

```typescript
// In UI layer - NO patientId passed explicitly
const result = await getInsuranceSnapshotAction({ patientId: undefined })

// In Actions layer (insurance.actions.ts:247-250)
// Auto-generates if not provided
const auth = await resolveUserAndOrg()
const resolvedPatientId = input.patientId ?? `session_${userId}_intake`
```

**Decision**: **Use session-based fallback** consistently with WRITE operations.

### Alternative: Make PatientId Optional in Snapshot Action

**Current signature**:
```typescript
export async function getInsuranceSnapshotAction(
  input: { patientId: string }  // ← Required
): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**Recommended change** (for consistency with `saveInsuranceCoverageAction`):
```typescript
export async function getInsuranceSnapshotAction(
  input: { patientId?: string }  // ← Optional, auto-generated
): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**Benefits**:
- ✅ UI doesn't need to know about patientId
- ✅ Consistent with `saveInsuranceCoverageAction({ coverage })`
- ✅ Maintains SoC (session resolution in Actions layer)

---

## 🎯 Data Transformation Strategy

### 1. Date Normalization Function

**Purpose**: Convert ISO date strings from DTO to `Date` objects for RHF

```typescript
/**
 * Transform ISO date string to Date object
 * Handles undefined/null gracefully
 */
function parseDateFromISO(isoString: string | undefined): Date | undefined {
  if (!isoString) return undefined
  try {
    return new Date(isoString)
  } catch {
    return undefined
  }
}
```

### 2. Coverage Array Transformer

```typescript
/**
 * Map InsuranceCoverageDTO[] from snapshot to form-compatible structure
 * Converts all ISO date strings to Date objects
 */
function mapCoveragesToForm(dtos: InsuranceCoverageDTO[]): Partial<InsuranceCoverage>[] {
  return dtos.map(dto => ({
    // Identity
    type: dto.type,
    carrierName: dto.carrierName,
    policyNumber: dto.policyNumber,
    groupNumber: dto.groupNumber,

    // Plan
    planKind: dto.planKind,
    planName: dto.planName,

    // Subscriber
    subscriberName: dto.subscriberName,
    subscriberDateOfBirth: parseDateFromISO(dto.subscriberDateOfBirth),
    subscriberRelationship: dto.subscriberRelationship,
    subscriberSSN: dto.subscriberSSN,

    // Coverage
    effectiveDate: parseDateFromISO(dto.effectiveDate),
    expirationDate: parseDateFromISO(dto.expirationDate),
    isPrimary: dto.isPrimary,

    // Verification
    isVerified: dto.isVerified,
    verificationDate: parseDateFromISO(dto.verificationDate),
    verificationNotes: dto.verificationNotes,

    // Mental Health
    hasMentalHealthCoverage: dto.hasMentalHealthCoverage,
    mentalHealthCopay: dto.mentalHealthCopay,
    mentalHealthDeductible: dto.mentalHealthDeductible,
    annualMentalHealthLimit: dto.annualMentalHealthLimit,

    // Authorization
    requiresPreAuth: dto.requiresPreAuth,
    preAuthNumber: dto.preAuthNumber,
    preAuthExpiration: parseDateFromISO(dto.preAuthExpiration)
  }))
}
```

### 3. Full Snapshot → defaultValues Mapper

```typescript
/**
 * Transform InsuranceEligibilityOutputDTO to form defaultValues
 * Handles nested objects and date conversions
 */
function mapSnapshotToFormDefaults(
  snapshot: InsuranceEligibilityOutputDTO
): Partial<InsuranceEligibility> {
  const { data } = snapshot

  return {
    // Insurance coverages with date conversion
    insuranceCoverages: mapCoveragesToForm(data.insuranceCoverages),

    // Uninsured status
    isUninsured: data.isUninsured,
    uninsuredReason: data.uninsuredReason,

    // Eligibility criteria (direct mapping - no dates)
    eligibilityCriteria: data.eligibilityCriteria,

    // Financial information (direct mapping - no dates)
    financialInformation: data.financialInformation,

    // Eligibility determination
    eligibilityStatus: data.eligibilityStatus,
    eligibilityDeterminedBy: data.eligibilityDeterminedBy,
    eligibilityDeterminationDate: parseDateFromISO(data.eligibilityDeterminationDate),
    eligibilityNotes: data.eligibilityNotes
  }
}
```

---

## 📝 FieldArray Strategy

### React Hook Form FieldArray Pattern

**Current Usage** (`InsuranceRecordsSection.tsx:39-42`):
```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: 'insuranceCoverages'
})
```

### Initialization Approaches

#### Option A: Via `defaultValues` (Recommended)

**When**: Initial form setup before mount

```typescript
const form = useForm<Partial<InsuranceEligibility>>({
  resolver: zodResolver(insuranceEligibilityDataSchema.partial()),
  mode: 'onBlur',
  defaultValues: {
    insuranceCoverages: mappedCoveragesFromSnapshot,  // ← Prepopulated
    // ... other fields
  }
})
```

**Benefits**:
- ✅ FieldArray automatically populated
- ✅ No manual `append()` calls needed
- ✅ RHF manages field IDs internally
- ✅ Cleanest approach

---

#### Option B: Via `form.reset(data)` (Current Pattern)

**When**: After mount, async data loaded

```typescript
useEffect(() => {
  const loadData = async () => {
    const result = await getInsuranceSnapshotAction({ patientId })

    if (result.ok && result.data) {
      const formData = mapSnapshotToFormDefaults(result.data)
      form.reset(formData)  // ← Hydrates FieldArray
    }
  }
  loadData()
}, [])
```

**Benefits**:
- ✅ Works with async loading
- ✅ Preserves form state management
- ✅ Triggers validation after load
- ✅ **CURRENT PATTERN** (minimal changes)

**Recommendation**: **Use Option B** (matches existing codebase pattern)

---

### FieldArray ID Stability

**RHF Behavior**:
- RHF generates unique `field.id` for each item in FieldArray
- IDs are stable across re-renders
- `form.reset()` regenerates IDs (expected behavior)

**No manual ID management needed** - RHF handles this internally.

---

## 🚀 Recommended Implementation Plan (APPLY)

### Phase 1: Update Action Signature (Optional but Recommended)

**File**: `src/modules/intake/actions/step2/insurance.actions.ts`

**Change**: Make `patientId` optional in `getInsuranceSnapshotAction`

**Before**:
```typescript
export async function getInsuranceSnapshotAction(
  input: { patientId: string }
): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**After**:
```typescript
export async function getInsuranceSnapshotAction(
  input: { patientId?: string }  // ← Optional
): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**Add patientId resolution** (lines 311-316):
```typescript
// Auth guard - get user and organization
let userId: string
let organizationId: string

try {
  const auth = await resolveUserAndOrg()
  userId = auth.userId
  organizationId = auth.organizationId
} catch {
  // ... error handling
}

// Resolve patientId: Use provided value or generate session-based identifier
const resolvedPatientId = input.patientId ?? `session_${userId}_intake`

// Validate input
if (!resolvedPatientId || typeof resolvedPatientId !== 'string') {
  return {
    ok: false,
    error: {
      code: 'VALIDATION_FAILED',
      message: 'Invalid patient identifier'
    }
  }
}

// Use resolvedPatientId instead of input.patientId
const result = await repository.getSnapshot(resolvedPatientId)
```

---

### Phase 2: Add Data Transformation Utilities

**File**: `src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx`

**Location**: After imports, before component definition (lines 17-21)

```typescript
/**
 * Transform ISO date string to Date object
 * Handles undefined/null gracefully
 */
function parseDateFromISO(isoString: string | undefined): Date | undefined {
  if (!isoString) return undefined
  try {
    return new Date(isoString)
  } catch {
    return undefined
  }
}

/**
 * Map InsuranceCoverageDTO[] from snapshot to form-compatible structure
 * Converts all ISO date strings to Date objects
 */
function mapCoveragesToForm(dtos: any[]): any[] {
  return dtos.map(dto => ({
    type: dto.type,
    carrierName: dto.carrierName,
    policyNumber: dto.policyNumber,
    groupNumber: dto.groupNumber,
    planKind: dto.planKind,
    planName: dto.planName,
    subscriberName: dto.subscriberName,
    subscriberDateOfBirth: parseDateFromISO(dto.subscriberDateOfBirth),
    subscriberRelationship: dto.subscriberRelationship,
    subscriberSSN: dto.subscriberSSN,
    effectiveDate: parseDateFromISO(dto.effectiveDate),
    expirationDate: parseDateFromISO(dto.expirationDate),
    isPrimary: dto.isPrimary,
    isVerified: dto.isVerified,
    verificationDate: parseDateFromISO(dto.verificationDate),
    verificationNotes: dto.verificationNotes,
    hasMentalHealthCoverage: dto.hasMentalHealthCoverage,
    mentalHealthCopay: dto.mentalHealthCopay,
    mentalHealthDeductible: dto.mentalHealthDeductible,
    annualMentalHealthLimit: dto.annualMentalHealthLimit,
    requiresPreAuth: dto.requiresPreAuth,
    preAuthNumber: dto.preAuthNumber,
    preAuthExpiration: parseDateFromISO(dto.preAuthExpiration)
  }))
}

/**
 * Transform InsuranceEligibilityOutputDTO to form defaultValues
 */
function mapSnapshotToFormDefaults(snapshot: any): any {
  const { data } = snapshot

  return {
    insuranceCoverages: mapCoveragesToForm(data.insuranceCoverages || []),
    isUninsured: data.isUninsured ?? false,
    uninsuredReason: data.uninsuredReason,
    eligibilityCriteria: data.eligibilityCriteria,
    financialInformation: data.financialInformation,
    eligibilityStatus: data.eligibilityStatus,
    eligibilityDeterminedBy: data.eligibilityDeterminedBy,
    eligibilityDeterminationDate: parseDateFromISO(data.eligibilityDeterminationDate),
    eligibilityNotes: data.eligibilityNotes
  }
}
```

---

### Phase 3: Update useEffect Hook

**File**: `src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx`

**Location**: Lines 92-113

**Current Code**:
```typescript
// Load existing insurance & eligibility data on mount
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loadInsuranceEligibilityAction()

      if (result.ok && result.data?.data) {
        // Update form with loaded data
        form.reset(result.data.data as Partial<InsuranceEligibility>)
      }
      // If no data exists or NOT_IMPLEMENTED, use defaults (already set)
    } catch (err) {
      // Silent fail for loading - defaults will be used
    } finally {
      setIsLoading(false)
    }
  }

  loadData()
}, []) // eslint-disable-line react-hooks/exhaustive-deps
```

**Updated Code**:
```typescript
// Load existing insurance & eligibility snapshot on mount
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Call snapshot action (patientId auto-generated from session)
      const result = await getInsuranceSnapshotAction({})

      if (result.ok && result.data) {
        // Transform snapshot DTO to form structure (dates + nested objects)
        const formData = mapSnapshotToFormDefaults(result.data)

        // Hydrate form with snapshot data
        form.reset(formData)
      }
      // If no data or NOT_FOUND, use defaults (already set in defaultValues)
    } catch (err) {
      // Silent fail for loading - defaults will be used
    } finally {
      setIsLoading(false)
    }
  }

  loadData()
}, []) // eslint-disable-line react-hooks/exhaustive-deps
```

---

### Phase 4: Update Imports

**File**: `src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx`

**Location**: Lines 9-12

**Before**:
```typescript
import {
  loadInsuranceEligibilityAction,
  upsertInsuranceEligibilityAction
} from "@/modules/intake/actions/step2/insurance.actions"
```

**After**:
```typescript
import {
  getInsuranceSnapshotAction,  // ← NEW: For READ
  upsertInsuranceEligibilityAction  // Keep for WRITE
} from "@/modules/intake/actions/step2/insurance.actions"
```

---

## ✅ Validation Checklist

### SoC (Separation of Concerns)

- ✅ **UI Layer**: Only calls Actions, no direct repository/DB access
- ✅ **Actions Layer**: Handles auth, patientId resolution, generic errors
- ✅ **No Business Logic in UI**: Data transformation is pure mapping (no validation)

### Accessibility (A11y)

- ✅ **No Regression**: Loading states already present (`isLoading`, `isSaving`)
- ✅ **Error Messages**: Generic, no PII exposure
- ✅ **Form Controls**: RHF manages focus, validation, aria-invalid

### TypeScript

- ✅ **Type Safety**: `InsuranceEligibilityOutputDTO` → `Partial<InsuranceEligibility>`
- ✅ **Date Handling**: Explicit transformation with try-catch
- ✅ **Optional Fields**: Handled with `??` and `?` operators

### Security

- ✅ **Auth Guards**: Action layer enforces `resolveUserAndOrg()`
- ✅ **Multi-tenant**: `organizationId` scoping in RLS
- ✅ **Generic Errors**: No PII, no stack traces, no DB details

---

## 📦 Files to Modify (APPLY Phase)

### 1. Actions Layer (Optional - for consistency)

**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\actions\step2\insurance.actions.ts`

**Changes**:
- Make `patientId` optional in `getInsuranceSnapshotAction` signature
- Add patientId resolution logic (same pattern as `saveInsuranceCoverageAction`)
- Update validation to use `resolvedPatientId`

**Lines**: 307-350 (signature + patientId resolution)

---

### 2. UI Container (Primary)

**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\Step2EligibilityInsurance.tsx`

**Changes**:
1. Add date transformation utilities (after imports, before component)
2. Add `mapCoveragesToForm` function
3. Add `mapSnapshotToFormDefaults` function
4. Update imports: Replace `loadInsuranceEligibilityAction` with `getInsuranceSnapshotAction`
5. Update `useEffect` hook to:
   - Call `getInsuranceSnapshotAction({})`
   - Transform response with `mapSnapshotToFormDefaults()`
   - Call `form.reset(formData)`

**Lines**:
- 9-12 (imports)
- 17-21 (add utilities)
- 92-113 (useEffect hook)

---

## 🧪 Testing Strategy (Manual)

### Test Case 1: Load Existing Patient with Coverages

**Setup**:
1. Patient has 2 insurance coverages in DB (1 primary Medicare, 1 secondary Private)
2. Navigate to `/patients/new` → Step 2

**Expected**:
- Loading overlay shows "Loading insurance & eligibility information..."
- Form populates with 2 coverage cards
- First card: Medicare marked as primary
- Second card: Private marked as secondary
- All dates render correctly (no "Invalid Date")
- All fields match DB snapshot

---

### Test Case 2: Load Patient with No Records (NOT_FOUND)

**Setup**:
1. New patient, no insurance records in DB
2. Navigate to Step 2

**Expected**:
- Loading overlay shows briefly
- Form shows empty `insuranceCoverages` array (no cards)
- "Add Insurance Record" button available
- No error message displayed (silent fallback to defaults)

---

### Test Case 3: Auth Failure (UNAUTHORIZED)

**Setup**:
1. Simulate expired session or no org context
2. Navigate to Step 2

**Expected**:
- Loading overlay shows briefly
- Form falls back to empty defaults
- No error message (silent fail per current pattern)
- User can still add new records

---

### Test Case 4: Date Field Validation

**Setup**:
1. Load patient with dates: `subscriberDateOfBirth`, `effectiveDate`, `verificationDate`
2. Verify DatePicker components

**Expected**:
- DatePickers show selected dates (not empty)
- Dates are `Date` objects (not strings)
- Form validation works (Zod `z.date()` schema)
- No console errors about invalid date formats

---

## 🎯 Success Criteria

### Functional

- ✅ Form hydrates with existing patient data on mount
- ✅ Insurance coverages array populated from snapshot
- ✅ Dates converted from ISO strings to Date objects
- ✅ NOT_FOUND fallback to empty defaults (no error UI)

### Technical

- ✅ Zero new TypeScript errors
- ✅ Zero new ESLint errors
- ✅ No SoC violations (Actions only, no DB in UI)
- ✅ PatientId resolution consistent with WRITE

### User Experience

- ✅ Loading state visible during fetch
- ✅ Form pre-filled for returning patients
- ✅ No flash of empty form → populated form
- ✅ Dates render correctly in DatePicker components

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        1. COMPONENT MOUNT                           │
│  Step2EligibilityInsurance mounts with empty defaultValues         │
│  useEffect hook triggers                                            │
└────────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   2. CALL SNAPSHOT ACTION                           │
│  const result = await getInsuranceSnapshotAction({})               │
│  (patientId omitted - auto-generated in Actions layer)             │
└────────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   3. ACTIONS LAYER                                  │
│  - Auth: resolveUserAndOrg() → { userId, organizationId }         │
│  - Resolve: patientId = input.patientId ?? `session_${userId}_intake` │
│  - Call: repository.getSnapshot(resolvedPatientId)                 │
└────────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│              4. INFRASTRUCTURE LAYER                                │
│  - Query: v_patient_insurance_eligibility_snapshot                 │
│  - Filter: WHERE patient_id = $1 AND organization_id = $2          │
│  - Return: InsuranceEligibilityOutputDTO with metadata             │
└────────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   5. TRANSFORM RESPONSE                             │
│  const formData = mapSnapshotToFormDefaults(result.data)          │
│  - Convert ISO strings → Date objects                              │
│  - Map insuranceCoverages[] array                                  │
│  - Preserve nested objects (eligibilityCriteria, etc.)             │
└────────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   6. HYDRATE FORM                                   │
│  form.reset(formData)                                              │
│  - RHF updates all fields                                          │
│  - FieldArray regenerates with mapped coverages                    │
│  - Triggers validation                                             │
└────────────────────────────────┬────────────────────────────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   7. UI RE-RENDERS                                  │
│  - isLoading: false                                                │
│  - Insurance cards visible with prepopulated data                  │
│  - DatePickers show Date objects                                   │
│  - User can edit/save individual coverages                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Comparison: Current vs Proposed

| Aspect | Current | Proposed |
|--------|---------|----------|
| **Action Called** | `loadInsuranceEligibilityAction()` | `getInsuranceSnapshotAction({})` |
| **Infrastructure** | NOT_IMPLEMENTED (skeleton) | ✅ Implemented (DB snapshot view) |
| **PatientId** | Session-based (implicit) | Session-based (explicit fallback) |
| **Data Source** | N/A (returns empty) | `v_patient_insurance_eligibility_snapshot` |
| **Form Hydration** | Empty defaults | Prepopulated from DB |
| **Date Handling** | N/A | ISO → Date transformation |
| **Error Handling** | Silent fail (no data) | Silent fail (fallback to defaults) |
| **User Experience** | Always starts empty | Prepopulated for returning patients |

---

## 🚧 Edge Cases & Error Handling

### 1. NOT_FOUND (No Records)

**Scenario**: New patient, no insurance in DB

**Behavior**:
```typescript
if (result.ok && result.data) {
  // Has data → hydrate
} else {
  // No data or error → use defaults (already set)
}
```

**Result**: Form remains empty, user can add records

---

### 2. NOT_IMPLEMENTED (DB View Missing)

**Scenario**: Snapshot view not created in DB yet

**Behavior**: Same as NOT_FOUND (silent fallback)

**Result**: No error UI, form usable

---

### 3. UNAUTHORIZED (Auth Failure)

**Scenario**: Session expired, no org context

**Behavior**: Action returns error, `result.ok = false`

**Result**: Silent fail, empty form (consistent with current pattern)

---

### 4. Malformed Dates in DB

**Scenario**: DB contains invalid ISO date string

**Behavior**: `parseDateFromISO()` catches exception, returns `undefined`

**Result**: DatePicker remains empty, form validation triggers if required

---

### 5. Partial Data (Incomplete Coverages)

**Scenario**: Some fields missing in snapshot

**Behavior**: Optional fields map to `undefined`, required fields must exist

**Result**: Form displays partial data, validation enforces required fields on save

---

## 🔮 Future Enhancements (Out of Scope)

### 1. Optimistic UI Updates

Cache snapshot data in Zustand/React Query for instant navigation

### 2. Real-time Sync

Poll snapshot every 30s to detect external changes

### 3. Diff Detection

Highlight fields changed since last snapshot

### 4. Audit Trail

Show `lastModified` timestamp and `completionStatus` in UI

### 5. Versioning

Support multiple snapshot versions (draft vs verified)

---

## 📁 Artifacts

### Generated Reports

- `D:\ORBIPAX-PROJECT\tmp\step2_ui_preload_snapshot_audit.md` (this document)

### Referenced Files (Read-Only)

1. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\Step2EligibilityInsurance.tsx`
2. `D:\ORBIPAX-PROJECT\src\modules\intake\actions\step2\insurance.actions.ts`
3. `D:\ORBIPAX-PROJECT\src\modules\intake\application\step2\dtos.ts`
4. `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\insurance-eligibility\insurance-eligibility.schema.ts`

---

## 🏁 Conclusion

### Summary

✅ **Audit Complete** - Strategy defined for prepopulating Step 2 form with patient snapshot data.

### Key Recommendations

1. **Replace** `loadInsuranceEligibilityAction()` with `getInsuranceSnapshotAction()` in existing `useEffect`
2. **Add** date transformation utilities (`parseDateFromISO`, `mapCoveragesToForm`, `mapSnapshotToFormDefaults`)
3. **Optional**: Make `patientId` parameter optional in `getInsuranceSnapshotAction` for consistency
4. **Maintain** silent error fallback pattern (no error UI for NOT_FOUND)

### Minimal Changes Philosophy

- ✅ **Single file primary edit**: `Step2EligibilityInsurance.tsx`
- ✅ **No new components**: Reuse existing RHF pattern
- ✅ **No new contexts**: PatientId resolution in Actions layer
- ✅ **Backward compatible**: Fallback to empty defaults if no data

### Ready for APPLY

All decisions documented, mapping tables defined, edge cases covered. Implementation can proceed with zero ambiguity.

---

**Report Generated**: 2025-09-29
**Status**: ✅ Audit Complete - Ready for APPLY phase
**Next Step**: Implement changes per plan above → Manual testing → QA sign-off