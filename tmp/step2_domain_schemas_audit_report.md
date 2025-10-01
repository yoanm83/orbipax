# Step 2 Insurance & Eligibility - Domain Schemas Audit Report

**Date**: 2025-09-29
**Task**: Audit insurance and eligibility domain schemas (AUDIT-ONLY)
**Status**: ✅ COMPLETE

---

## EXECUTIVE SUMMARY

The insurance and eligibility schemas are currently in a **single location** with no duplicates. The schema structure is well-organized with three sub-schemas composed into a main schema. However, the folder structure could be improved to match the Demographics pattern.

---

## 1. CURRENT STATE

### File Locations
| File | Path | Purpose |
|------|------|---------|
| **insurance.schema.ts** | `/domain/schemas/insurance.schema.ts` | Main schema file |
| **No eligibility.schema.ts** | - | Combined with insurance |
| **No duplicates** | - | Only one insurance schema file exists |

### Schema Structure
```typescript
// Current structure in insurance.schema.ts:
1. insuranceCoverageSchema - Insurance coverage details
2. eligibilityCriteriaSchema - Eligibility verification
3. financialInformationSchema - Financial/billing info
4. insuranceEligibilityDataSchema - Main composite schema
5. InsuranceEligibility type export
```

---

## 2. SCHEMA ANALYSIS

### insuranceCoverageSchema
**Purpose**: Primary and secondary insurance details
```typescript
{
  hasPrimaryInsurance: boolean
  primaryInsurance?: {
    carrierName: string
    planName?: string
    policyNumber: string
    groupNumber?: string
    subscriberInfo: { /* name, DOB, relationship */ }
    effectiveDate?: string (ISO)
    terminationDate?: string (ISO)
    copayAmount?: number
    deductible?: number
    outOfPocketMax?: number
  }
  hasSecondaryInsurance: boolean
  secondaryInsurance?: { /* same structure */ }
}
```

### eligibilityCriteriaSchema
**Purpose**: Government programs and income verification
```typescript
{
  medicaidStatus: 'eligible' | 'enrolled' | 'pending' | 'ineligible' | 'unknown'
  medicaidId?: string
  medicareStatus: 'eligible' | 'enrolled' | 'not_eligible' | 'unknown'
  medicareId?: string
  ssdiStatus: boolean
  ssiStatus: boolean
  veteranBenefits: boolean
  otherBenefits?: string[]

  annualIncome?: number
  householdSize?: number
  employmentStatus: 'employed' | 'unemployed' | 'disabled' | 'retired' | 'student'

  slidingFeeScale: boolean
  financialAssistanceRequested: boolean
}
```

### financialInformationSchema
**Purpose**: Billing and payment preferences
```typescript
{
  preferredPaymentMethod: 'insurance' | 'self_pay' | 'payment_plan' | 'financial_assistance'
  billingAddress?: Address
  sameAsPrimaryAddress: boolean

  responsibleParty?: {
    relationship: 'self' | 'parent' | 'spouse' | 'guardian' | 'other'
    name?: string
    phoneNumber?: string
    address?: Address
  }

  consentToTreatment: boolean
  financialAgreementSigned: boolean
  agreementDate?: string (ISO)
}
```

### Main Schema (insuranceEligibilityDataSchema)
```typescript
{
  insuranceCoverage: insuranceCoverageSchema
  eligibilityCriteria: eligibilityCriteriaSchema
  financialInformation: financialInformationSchema
}
```

---

## 3. USAGE ANALYSIS

### Import Locations
| Layer | File | Import Type |
|-------|------|------------|
| **Domain** | `/domain/schemas/index.ts` | Re-exports all from insurance.schema |
| **Domain** | `/domain/index.ts` | Re-exports from schemas/index |
| **Actions** | `/actions/step2/insurance.actions.ts` | Imports from application layer (DTOs) |
| **UI** | `/ui/step2-eligibility-insurance/` | NO direct imports (good SoC) |
| **Application** | None found | Missing application layer implementation |

### Key Findings
- ✅ **UI Layer**: Properly isolated, no direct schema imports
- ✅ **Actions Layer**: References application DTOs (not domain schemas)
- ❌ **Application Layer**: No implementation found for Step 2
- ✅ **Domain Layer**: Clean exports through barrel files

---

## 4. COMPARISON WITH DEMOGRAPHICS

### Demographics Pattern (Current Best Practice)
```
/domain/schemas/
  /demographics/
    demographics.schema.ts    # Main schema
    demographics.enums.ts     # Enums only
    index.ts                  # Barrel export
```

### Insurance Pattern (Current)
```
/domain/schemas/
  insurance.schema.ts         # Everything in one file
```

---

## 5. PROPOSED CANONICAL STRUCTURE

### Recommendation: Create Nested Folder
```
/domain/schemas/
  /insurance-eligibility/     # Nested folder
    insurance.schema.ts       # Insurance coverage schema
    eligibility.schema.ts     # Eligibility criteria schema
    financial.schema.ts       # Financial information schema
    insurance-eligibility.schema.ts  # Main composite schema
    insurance-eligibility.enums.ts   # Extract enums
    index.ts                  # Barrel export
```

### Benefits
1. **Consistency**: Matches Demographics pattern
2. **Modularity**: Separate concerns into focused files
3. **Maintainability**: Easier to find specific schemas
4. **Extensibility**: Room to grow without file bloat

---

## 6. ENUM EXTRACTION CANDIDATES

Current inline enums that should be extracted:
```typescript
// Insurance enums
InsuranceRelationship: 'self' | 'spouse' | 'child' | 'parent' | 'other'

// Eligibility enums
MedicaidStatus: 'eligible' | 'enrolled' | 'pending' | 'ineligible' | 'unknown'
MedicareStatus: 'eligible' | 'enrolled' | 'not_eligible' | 'unknown'
EmploymentStatus: 'employed' | 'unemployed' | 'disabled' | 'retired' | 'student'

// Financial enums
PaymentMethod: 'insurance' | 'self_pay' | 'payment_plan' | 'financial_assistance'
ResponsiblePartyRelationship: 'self' | 'parent' | 'spouse' | 'guardian' | 'other'
```

---

## 7. MISSING COMPONENTS

### Application Layer (Not Found)
- No `/application/step2/` directory
- No DTOs defined
- No use cases implemented
- No ports/repositories defined

### Infrastructure Layer (Not Found)
- No `/infrastructure/repositories/insurance.repository.ts`
- Factory exists but likely stubs: `/infrastructure/factories/insurance.factory.ts`

---

## 8. VALIDATION PATTERNS

### Current Pattern
```typescript
// No validation function found in insurance.schema.ts
// Should add similar to Demographics:

export const validateInsuranceEligibility = (data: unknown) => {
  const result = insuranceEligibilityDataSchema.safeParse(data)
  if (result.success) {
    return { ok: true, data: result.data, error: null }
  }
  return {
    ok: false,
    data: null,
    error: result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  }
}
```

---

## 9. ACTION ITEMS (For Future Tasks)

### High Priority
1. **Create nested folder structure** for insurance-eligibility
2. **Extract enums** to separate file
3. **Add validation function** to match Demographics pattern
4. **Split schemas** into separate files

### Medium Priority
5. **Implement Application layer** with DTOs and use cases
6. **Create Infrastructure repository** for persistence

### Low Priority
7. **Add JSDoc comments** for better documentation
8. **Consider field additions** based on business requirements

---

## CONCLUSION

The Insurance & Eligibility schemas are **well-structured** but could benefit from:
- ✅ Moving to nested folder structure (like Demographics)
- ✅ Extracting enums to separate file
- ✅ Adding validation function
- ✅ Splitting into smaller, focused schema files

**No duplicates found** and **no legacy schemas** to clean up. The schema is properly isolated in the Domain layer with good SoC compliance.