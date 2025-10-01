# Step 2 InsuranceRecordsSection Plan Type / Plan Name Audit Report

**Date**: 2025-09-29
**Task**: Semantic origin audit for Plan Type and Plan Name fields (READ-ONLY)
**Status**: ✅ COMPLETE

---

## EXECUTIVE SUMMARY

After thorough inspection of UI, Domain (Zod), Application (DTOs), and Actions layers, **Plan Type** and **Plan Name** fields have **NO canonical schema paths** in the current architecture. These fields exist only in:
1. UI mock data for visual testing
2. UI components as display-only (unbound) controls

**DECISION**: Both fields should remain **DISPLAY-ONLY** with clear sentinel comments marking them as schema gaps. They should NOT be added to the canonical schema without explicit business requirements and database support.

---

## 1. FIELD LOCATION IN UI

### InsuranceRecordsSection.tsx

| Field | Location | Control Type | Current State | Line Reference |
|-------|----------|--------------|---------------|----------------|
| **Plan Type** | Grid Row 4, Col 1 | Select dropdown | Unbound (display-only) | Lines 310-333 |
| **Plan Name** | Grid Row 4, Col 2 | Input text | Unbound (display-only) | Lines 335-347 |

**Current Implementation**:
```typescript
// Line 310-333: Plan Type
<Label htmlFor={`ins-${field.id}-planType`}>Plan Type</Label>
{/* display-only (schema gap) - not bound to form */}
<Select>
  <SelectTrigger id={`ins-${field.id}-planType`}>
    <SelectValue placeholder="Select plan type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="hmo">HMO</SelectItem>
    <SelectItem value="ppo">PPO</SelectItem>
    <SelectItem value="epo">EPO</SelectItem>
    <SelectItem value="pos">POS</SelectItem>
    <SelectItem value="hdhp">HDHP</SelectItem>
    <SelectItem value="other">Other</SelectItem>
  </SelectContent>
</Select>

// Line 335-347: Plan Name
<Label htmlFor={`ins-${field.id}-planName`}>Plan Name</Label>
{/* display-only (schema gap) - not bound to form */}
<Input
  id={`ins-${field.id}-planName`}
  placeholder="Enter plan name"
/>
```

**Key Observations**:
- ✅ Both fields already have sentinel comments marking them as "display-only (schema gap)"
- ✅ Neither field uses `register()` or `Controller` for form binding
- ✅ No error handling or validation markup (aria-invalid, error messages)
- ⚠️ Controls are interactive but don't persist data to form state

---

## 2. CANONICAL SCHEMA MAPPING (UI → Zod → DTO → Action)

### Complete Path Analysis

| UI Field | Zod Schema Path | DTO Path | Action/Use Case | Status |
|----------|-----------------|----------|-----------------|--------|
| **Plan Type** | ❌ DOES NOT EXIST | ❌ DOES NOT EXIST | ❌ NOT SUPPORTED | **SCHEMA GAP** |
| **Plan Name** | ❌ DOES NOT EXIST | ❌ DOES NOT EXIST | ❌ NOT SUPPORTED | **SCHEMA GAP** |

### Detailed Layer Inspection

#### Layer 1: Domain Schema (Zod)
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\insurance-eligibility\insurance-eligibility.schema.ts`

**Finding**: `insuranceCoverageSchema` (lines 22-67) contains:
```typescript
export const insuranceCoverageSchema = z.object({
  type: z.nativeEnum(InsuranceType),           // Insurance TYPE (medicaid/medicare/private)
  carrierName: z.string()...,                   // Carrier NAME (Aetna, BCBS, etc.)
  policyNumber: z.string()...,
  groupNumber: z.string()...,
  subscriberName: z.string()...,
  subscriberDateOfBirth: z.date(),
  subscriberRelationship: z.enum([...]),
  subscriberSSN: z.string()...,
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),
  isPrimary: z.boolean(),
  isVerified: z.boolean()...,
  verificationDate: z.date().optional(),
  verificationNotes: z.string()...,
  hasMentalHealthCoverage: z.nativeEnum(BooleanResponse),
  mentalHealthCopay: z.number()...,
  mentalHealthDeductible: z.number()...,
  annualMentalHealthLimit: z.number()...,
  requiresPreAuth: z.nativeEnum(BooleanResponse),
  preAuthNumber: z.string()...,
  preAuthExpiration: z.date().optional()
})
```

**Conclusion**:
- ❌ **NO `planType` property**
- ❌ **NO `planName` property**
- Note: `type` field exists but refers to insurance TYPE (medicaid/medicare/private), NOT plan type (HMO/PPO/EPO)

#### Layer 2: Application DTOs
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step2\dtos.ts`

**Finding**: `InsuranceCoverageDTO` interface (lines 15-49) contains:
```typescript
export interface InsuranceCoverageDTO {
  type: string // 'medicare' | 'medicaid' | 'private' | 'tricare' | 'other'
  carrierName: string
  policyNumber: string
  groupNumber?: string
  subscriberName: string
  subscriberDateOfBirth: string // ISO date string
  subscriberRelationship: string
  subscriberSSN?: string
  effectiveDate: string
  expirationDate?: string
  isPrimary: boolean
  isVerified: boolean
  verificationDate?: string
  verificationNotes?: string
  hasMentalHealthCoverage: string
  mentalHealthCopay?: number
  mentalHealthDeductible?: number
  annualMentalHealthLimit?: number
  requiresPreAuth: string
  preAuthNumber?: string
  preAuthExpiration?: string
}
```

**Conclusion**:
- ❌ **NO `planType` property** in DTO
- ❌ **NO `planName` property** in DTO
- DTO mirrors Zod schema structure (expected in Hexagonal Architecture)

#### Layer 3: Actions Layer
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\actions\step2\insurance.actions.ts`

**Finding**: Actions use `InsuranceEligibilityInputDTO` and `InsuranceEligibilityOutputDTO` from Application layer:
```typescript
import {
  loadInsuranceEligibility,
  saveInsuranceEligibility,
  updateInsuranceEligibility,
  type InsuranceEligibilityInputDTO,
  type InsuranceEligibilityOutputDTO,
  InsuranceEligibilityErrorCodes
} from '@/modules/intake/application/step2'
```

**Conclusion**:
- ❌ Actions layer has NO support for planType/planName
- ✅ Follows Application layer contracts (expected)

---

## 3. MOCK DATA ANALYSIS

**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\_dev\mockDataStep2.ts`

**Finding**: Mock data includes `planType` and `planName` (lines 42-43, 54-55):
```typescript
insuranceRecords: [
  {
    id: '1',
    carrier: 'Blue Cross Blue Shield',
    memberId: 'BCB987654321',
    groupNumber: 'GRP001234',
    effectiveDate: new Date('2023-06-01'),
    expirationDate: new Date('2024-05-31'),
    planType: 'PPO',        // ⚠️ EXISTS IN MOCK ONLY
    planName: 'Premium Health Plan',  // ⚠️ EXISTS IN MOCK ONLY
    subscriberName: 'John Doe',
    relationship: 'Self',
  }
]
```

**Conclusion**:
- ⚠️ Mock data contains fields that DON'T exist in canonical schema
- This suggests these fields were **planned but never implemented** in backend
- Mock data is for visual testing only - does NOT reflect production schema

---

## 4. SCHEMA GAP ROOT CAUSE ANALYSIS

### Why These Fields Don't Exist

| Factor | Explanation |
|--------|-------------|
| **Business Decision** | Plan Type (HMO/PPO/EPO) and Plan Name may not be critical for CMH eligibility determination |
| **Data Complexity** | Plan details are carrier-specific and constantly changing - difficult to maintain |
| **Alternative Source** | Plan details can be derived from carrier API integrations or verification services |
| **Backend Removal** | User stated "del paso 4 en adelante no existe backend, todo se removio" - backend may have been intentionally stripped |
| **Incomplete Migration** | Fields exist in mock data but were never migrated to production schema |

### Current Field Coverage

**Fields that DO exist in schema**:
- ✅ `type`: Insurance category (medicaid/medicare/private/tricare/other)
- ✅ `carrierName`: Carrier/payer name (Aetna, BCBS, etc.)
- ✅ `policyNumber`: Member ID
- ✅ `groupNumber`: Group number
- ✅ `effectiveDate`: Coverage start date
- ✅ `expirationDate`: Coverage end date
- ✅ `isPrimary`: Primary insurance flag
- ✅ All subscriber fields
- ✅ Mental health coverage details
- ✅ Pre-authorization fields

**Fields that DON'T exist**:
- ❌ `planType`: Plan structure (HMO/PPO/EPO/POS/HDHP)
- ❌ `planName`: Specific plan name (e.g., "Premium Health Plan")

---

## 5. DECISION MATRIX

### Option A: Keep Display-Only (RECOMMENDED ✅)

| Criteria | Assessment |
|----------|------------|
| **Schema Gap** | No backend support - would require Domain, Application, Infrastructure changes |
| **Data Source** | No clear source - would need carrier integration or manual entry |
| **Business Value** | Low - not required for CMH eligibility or billing |
| **Maintenance Cost** | High - plan catalogs change frequently |
| **User Experience** | Acceptable - fields visible but not submitted |
| **Data Integrity** | Safe - no risk of invalid/stale data |
| **Alignment with Architecture** | ✅ Respects existing boundaries |

**Verdict**: ✅ **KEEP DISPLAY-ONLY**

### Option B: Add to Canonical Schema (NOT RECOMMENDED ❌)

| Criteria | Assessment |
|----------|------------|
| **Schema Gap** | Requires changes across 4+ layers (Domain, Application, Infrastructure, DB) |
| **Data Source** | Unclear - would need business requirements |
| **Business Value** | Unknown - needs stakeholder input |
| **Maintenance Cost** | Very high - requires ongoing catalog updates |
| **User Experience** | Improved - full form binding and validation |
| **Data Integrity** | Risk - could collect invalid/outdated plan info |
| **Alignment with Architecture** | ❌ Violates AUDIT-FIRST principle |

**Verdict**: ❌ **DO NOT ADD WITHOUT BUSINESS JUSTIFICATION**

---

## 6. RECOMMENDED TREATMENT

### DISPLAY-ONLY APPROACH (Current Implementation Enhanced)

**Status**: Already correctly implemented with sentinel comments

**Rationale**:
1. **Respects Architectural Boundaries**: No Domain/Application/Infrastructure changes needed
2. **Zero Risk**: No data persistence = no stale/invalid data
3. **User Transparency**: Fields visible but clearly not functional
4. **Future-Ready**: Easy to wire if business requirements emerge
5. **Audit Compliance**: Sentinel comments document gap

**Current Sentinel Comments** (Lines 315, 340):
```typescript
{/* display-only (schema gap) - not bound to form */}
```

**Enhancement Needed**:
- ✅ Sentinel comments already present
- ⚠️ Consider disabling controls to prevent user confusion

---

## 7. POTENTIAL DERIVATION STRATEGY (Future Consideration)

If Plan Type/Name need to be DISPLAYED (not persisted), they could be derived:

### Plan Type Derivation
```typescript
// Pseudo-logic (NOT IMPLEMENTED)
function derivePlanType(insurance: InsuranceCoverage): string | null {
  // Option 1: Query carrier API with policyNumber
  // Option 2: Lookup from carrier+groupNumber in external catalog
  // Option 3: User-provided during verification (not at intake)
  return null // Not available during intake
}
```

### Plan Name Derivation
```typescript
// Pseudo-logic (NOT IMPLEMENTED)
function derivePlanName(insurance: InsuranceCoverage): string | null {
  // Option 1: Query carrier API with policyNumber
  // Option 2: Extract from insurance card OCR (future feature)
  // Option 3: Verification service response
  return null // Not available during intake
}
```

**Conclusion**: Derivation requires external integrations NOT in scope for intake form.

---

## 8. RISKS & DEPENDENCIES

### Risk 1: User Confusion
- **Issue**: Interactive controls that don't save data may confuse users
- **Mitigation**: Consider disabling controls or adding helper text
- **Severity**: LOW (current sentinel comments help)

### Risk 2: Data Loss Expectation
- **Issue**: Users may expect entered data to be saved
- **Mitigation**: Disable controls or add warning message
- **Severity**: MEDIUM (if users manually enter data)

### Risk 3: Future Schema Addition
- **Issue**: Adding these fields later requires multi-layer refactoring
- **Mitigation**: Document schema gap clearly (this report)
- **Severity**: LOW (can be added if needed)

### Risk 4: Mock Data Mismatch
- **Issue**: Mock data has fields that don't exist in schema
- **Mitigation**: Update mock data to remove planType/planName
- **Severity**: LOW (dev-only data)

---

## 9. APPLY PLAN (MINIMAL - DISPLAY-ONLY CONFIRMATION)

### OBJECTIVE
Confirm Plan Type and Plan Name remain display-only with enhanced visual indicators.

### OPTION A: No Changes (RECOMMENDED)
**Rationale**: Current implementation is correct with sentinel comments.

**Actions**: NONE - existing code is compliant.

### OPTION B: Disable Controls (OPTIONAL ENHANCEMENT)
**Rationale**: Prevent user confusion by making non-functional state explicit.

**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\components\InsuranceRecordsSection.tsx`

**Changes** (Lines 310-347):

#### Change 1: Disable Plan Type Select
```typescript
// Line 310-333
<div>
  <Label htmlFor={`ins-${field.id}-planType`}>
    Plan Type
  </Label>
  {/* display-only (schema gap) - not bound to form */}
  <Select disabled> {/* ADD: disabled prop */}
    <SelectTrigger
      id={`ins-${field.id}-planType`}
      className="mt-1"
      aria-label="Plan Type"
    >
      <SelectValue placeholder="Not available during intake" /> {/* UPDATE: placeholder */}
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="hmo">HMO</SelectItem>
      <SelectItem value="ppo">PPO</SelectItem>
      <SelectItem value="epo">EPO</SelectItem>
      <SelectItem value="pos">POS</SelectItem>
      <SelectItem value="hdhp">HDHP</SelectItem>
      <SelectItem value="other">Other</SelectItem>
    </SelectContent>
  </Select>
</div>
```

#### Change 2: Disable Plan Name Input
```typescript
// Line 335-347
<div>
  <Label htmlFor={`ins-${field.id}-planName`}>
    Plan Name
  </Label>
  {/* display-only (schema gap) - not bound to form */}
  <Input
    id={`ins-${field.id}-planName`}
    placeholder="Not available during intake" {/* UPDATE: placeholder */}
    className="mt-1"
    aria-label="Plan Name"
    disabled {/* ADD: disabled prop */}
  />
</div>
```

**Checklist**:
- [ ] Add `disabled` prop to Plan Type Select (line ~316)
- [ ] Update Plan Type placeholder text (line ~322)
- [ ] Add `disabled` prop to Plan Name Input (line ~346)
- [ ] Update Plan Name placeholder text (line ~343)
- [ ] No form binding changes (fields remain unbound)
- [ ] No schema changes
- [ ] No DTO changes
- [ ] No Action changes

**Validation**:
- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] A11y: disabled controls have appropriate aria attributes
- [ ] Visual: grayed-out appearance indicates non-functional state

---

## 10. COMPLIANCE VERIFICATION

### SoC (Separation of Concerns)
| Requirement | Status | Evidence |
|-------------|--------|----------|
| No fetch/API in UI | ✅ PASS | No API calls for plan data |
| No business logic | ✅ PASS | Display-only fields have no logic |
| No validation in UI | ✅ PASS | No Zod validation for these fields |
| Respects Domain boundaries | ✅ PASS | No unauthorized schema additions |

### AUDIT-FIRST Methodology
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Read before write | ✅ PASS | Comprehensive layer inspection |
| Gap identification | ✅ PASS | Schema gaps clearly documented |
| Decision justification | ✅ PASS | Matrix-based recommendation |
| Minimal APPLY scope | ✅ PASS | Optional enhancement only |

### Architectural Alignment
| Requirement | Status | Evidence |
|-------------|--------|----------|
| Hexagonal/Onion layers | ✅ PASS | No cross-layer violations |
| Multi-tenant security | ✅ PASS | No data persistence = no RLS concerns |
| Generic error messages | ✅ PASS | No errors (display-only) |
| ALLOWED PATHS | ✅ PASS | Only InsuranceRecordsSection.tsx touched |

---

## 11. ALTERNATIVE APPROACHES (Future Consideration)

### Approach 1: External Plan Lookup Service
**Description**: Integrate with carrier API or benefit verification service.

**Pros**:
- ✅ Real-time, accurate plan data
- ✅ No manual entry required
- ✅ Automatically updated

**Cons**:
- ❌ Requires external service integration
- ❌ API costs
- ❌ Latency and reliability concerns
- ❌ Not in scope for intake form

### Approach 2: Manual Entry Post-Verification
**Description**: Collect plan details during insurance verification (after intake).

**Pros**:
- ✅ Separates intake from verification workflow
- ✅ More accurate (verified data)
- ✅ Doesn't block intake process

**Cons**:
- ❌ Two-step process
- ❌ Requires separate UI/schema for verification module

### Approach 3: Add to Canonical Schema
**Description**: Add `planType` and `planName` as optional fields in Domain schema.

**Pros**:
- ✅ Full form binding and validation
- ✅ Data persisted for future reference

**Cons**:
- ❌ Requires 4-layer refactoring (Domain → Application → Infrastructure → DB)
- ❌ No business requirement justification
- ❌ High maintenance cost (plan catalogs change)
- ❌ Risk of stale/invalid data

### Approach 4: Remove from UI
**Description**: Hide Plan Type and Plan Name fields entirely.

**Pros**:
- ✅ Eliminates user confusion
- ✅ Cleaner UI

**Cons**:
- ❌ May be useful for display/reference
- ❌ Harder to add back later if needed

---

## 12. RECOMMENDATION SUMMARY

### FINAL DECISION: Keep Display-Only (Current Implementation)

**Rationale**:
1. **No Canonical Schema Support**: planType and planName don't exist in Domain, Application, or Infrastructure layers
2. **No Business Requirements**: No clear use case for persisting this data during intake
3. **Mock Data Only**: Fields exist only in visual testing data, not production schema
4. **Architectural Compliance**: Adding these fields would violate AUDIT-FIRST principle
5. **Future-Ready**: Display-only approach allows easy wiring if requirements emerge

**APPLY Action**: **NONE** (current implementation is correct)

**Optional Enhancement**: Add `disabled` prop to controls to prevent user confusion (see Section 9, Option B)

---

## 13. NEXT STEPS

### Immediate (This Sprint)
1. ✅ **NO CODE CHANGES REQUIRED** - current implementation is correct
2. ⚠️ **OPTIONAL**: Disable Plan Type/Plan Name controls (see Section 9, Option B)
3. ✅ Document schema gap (this report)

### Short-Term (Next Sprint)
1. **Update Mock Data**: Remove planType/planName from `mockDataStep2.ts` to align with schema
2. **Consider UI Enhancement**: Add helper text explaining why fields are disabled

### Long-Term (Future)
1. **Business Requirements Gathering**: Determine if Plan Type/Plan Name are actually needed
2. **External Integration**: Evaluate carrier API or benefit verification services
3. **Schema Addition**: If justified, add fields to Domain → Application → Infrastructure → DB

---

## CONCLUSION

After comprehensive audit of UI, Domain (Zod), Application (DTOs), and Actions layers:

**FINDING**: Plan Type and Plan Name fields have **NO canonical schema paths**. They exist only in mock data for visual testing.

**DECISION**: Both fields should remain **DISPLAY-ONLY** with current sentinel comments marking schema gaps.

**APPLY PLAN**:
- **Option A (RECOMMENDED)**: NO CHANGES - current implementation is correct
- **Option B (OPTIONAL)**: Add `disabled` prop to controls for clarity (minimal change)

**COMPLIANCE**:
- ✅ SoC maintained
- ✅ AUDIT-FIRST respected
- ✅ Hexagonal Architecture boundaries intact
- ✅ Multi-tenant security unaffected

**ALLOWED PATHS**: Only `InsuranceRecordsSection.tsx` would be modified (if Option B chosen)

**RISKS**: LOW - display-only approach is safe and future-ready

---

**Report Generated**: 2025-09-29
**Author**: Claude Code (Audit Agent)
**Status**: ✅ READY FOR REVIEW
**Next Action**: User decision on Option A (no changes) vs Option B (disable controls)