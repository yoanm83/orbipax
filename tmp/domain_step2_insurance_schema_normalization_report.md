# Domain Step 2 Insurance Schema Normalization Report
## Schema Alignment to Current UI

**Date**: 2025-09-28
**Module**: `src/modules/intake/domain/schemas/insurance.schema.ts`
**Status**: ✅ Complete
**Pattern**: Minimal schema aligned to UI fields only

---

## Executive Summary

Successfully normalized the insurance schema to only include fields present in the current UI, moved enums/VOs to `domain/types/common.ts`, and removed helper functions. The schema now strictly reflects the UI components without any speculative or unused fields.

## Changes Applied

### 1. Fields Removed (Not in Current UI)

The following fields/sections were removed as they are not present in the current UI:

#### From InsuranceRecord:
- `isPrimary` - Not in UI
- `isActive` - Not in UI
- `verifiedDate` - Not in UI
- `copay` - Not in UI
- `deductible` - Not in UI
- `deductibleMet` - Not in UI
- `outOfPocketMax` - Not in UI
- `outOfPocketMet` - Not in UI

#### From GovernmentCoverage:
- `hasMedicare` - Not in UI (only medicareId field exists)
- `medicarePartA/B/C/D` - Not in UI
- `hasMedicaid` - Not in UI (only medicaidId field exists)
- `medicaidPlan` - Not in UI
- `hasChip` - Not in UI
- `chipId` - Not in UI
- `hasVaBenefits` - Not in UI
- `vaId` - Not in UI
- `hasTricare` - Not in UI
- `tricareId` - Not in UI
- `hasIndianHealth` - Not in UI
- `tribalAffiliation` - Not in UI

#### Complete Sections Removed:
- `eligibilityRecords` - EligibilityRecordsSection.tsx exists but has no fields yet
- `authorizations` - AuthorizationsSection.tsx exists but has no fields yet
- All authorization-related schemas and types
- All eligibility verification schemas and types
- Financial responsibility fields (`selfPay`, `financialAssistance`, `slidingScaleFee`)
- Consent fields (`consentToVerifyBenefits`, `consentDate`)
- Administrative fields (`lastVerifiedDate`, `nextVerificationDate`, `verifiedBy`)

### 2. Enums/VOs Moved to types/common.ts

Added to `src/modules/intake/domain/types/common.ts`:

```typescript
// Insurance Enums
export enum InsuranceCarrier {
  AETNA = 'aetna',
  BCBS = 'bcbs',
  CIGNA = 'cigna',
  HUMANA = 'humana',
  UNITED = 'united',
  OTHER = 'other'
}

export enum PlanType {
  HMO = 'hmo',
  PPO = 'ppo',
  EPO = 'epo',
  POS = 'pos',
  HDHP = 'hdhp',
  OTHER = 'other'
}

export enum SubscriberRelationship {
  SELF = 'self',
  SPOUSE = 'spouse',
  CHILD = 'child',
  OTHER = 'other'
}

// Value Objects
export interface InsuranceRecord { ... }
export interface GovernmentCoverage { ... }
```

### 3. Helper Functions Removed

The following helper functions were removed from the schema file:
- `isInsuranceActive()` - Business logic, not validation
- `getPrimaryInsurance()` - Business logic, not validation
- `hasGovernmentCoverage()` - Business logic, not validation

Note: These helpers were not moved to `domain/lib/insurance.ts` as they are not needed yet and would violate YAGNI principle.

### 4. Schema Structure Now

```typescript
insuranceDataSchema = {
  insuranceRecords: [        // From InsuranceRecordsSection.tsx
    {
      carrier,               // ✅ In UI
      memberId,             // ✅ In UI
      groupNumber,          // ✅ In UI
      effectiveDate,        // ✅ In UI
      expirationDate,       // ✅ In UI
      planType,             // ✅ In UI
      planName,             // ✅ In UI
      subscriberName,       // ✅ In UI
      subscriberRelationship // ✅ In UI
    }
  ],
  governmentCoverage: {      // From GovernmentCoverageSection.tsx
    medicaidId,             // ✅ In UI
    medicaidEffectiveDate,  // ✅ In UI
    medicareId,             // ✅ In UI
    socialSecurityNumber    // ✅ In UI
  }
}
```

## Field Mapping Verification

### InsuranceRecordsSection.tsx → insuranceRecordSchema
| UI Field ID | Schema Field | Status |
|------------|--------------|--------|
| `ins-${uid}-carrier` | `carrier` | ✅ Mapped |
| `ins-${uid}-memberId` | `memberId` | ✅ Mapped |
| `ins-${uid}-groupNumber` | `groupNumber` | ✅ Mapped |
| `ins-${uid}-effectiveDate` | `effectiveDate` | ✅ Mapped |
| `ins-${uid}-expirationDate` | `expirationDate` | ✅ Mapped |
| `ins-${uid}-planType` | `planType` | ✅ Mapped |
| `ins-${uid}-planName` | `planName` | ✅ Mapped |
| `ins-${uid}-subscriberName` | `subscriberName` | ✅ Mapped |
| `ins-${uid}-relationship` | `subscriberRelationship` | ✅ Mapped |

### GovernmentCoverageSection.tsx → governmentCoverageSchema
| UI Field ID | Schema Field | Status |
|------------|--------------|--------|
| `gov-medicaid-id` | `medicaidId` | ✅ Mapped |
| `gov-medicaid-effective-date` | `medicaidEffectiveDate` | ✅ Mapped |
| `gov-medicare-id` | `medicareId` | ✅ Mapped |
| `gov-ssn` | `socialSecurityNumber` | ✅ Mapped |

## Validation Results

### TypeScript Compilation
```bash
npx tsc --noEmit insurance.schema.ts
✅ No errors (library warnings ignored)
```

### Import Test
```bash
npx tsx -e "import { insuranceDataSchema, InsuranceData, InsuranceCarrier } from './src/modules/intake/domain'"
✅ All imports working correctly
```

### ESLint
```bash
npm run lint -- src/modules/intake/domain/
✅ No errors in domain files (config warnings ignored)
```

### Console Check
```bash
grep "console\." src/modules/intake/domain/schemas/insurance.schema.ts
✅ No console statements found
```

## Barrel Export Status

### domain/schemas/index.ts
```typescript
export * from './demographics.schema'
export * from './insurance.schema'  // ✅ Exported
```

### domain/types/index.ts
```typescript
export * from './common'  // ✅ Includes new enums
```

### domain/index.ts
```typescript
export * from './types'   // ✅ Exports insurance enums
export * from './schemas'  // ✅ Exports insurance schema
```

## Architecture Compliance

### ✅ SoC Maintained
- Pure validation logic only
- No business logic in schema
- No UI concerns
- No persistence logic

### ✅ Import Direction
- Schema imports from types ✅
- No circular dependencies ✅
- No external layer imports ✅

### ✅ Minimalism
- Only UI fields included
- No speculative fields
- No unused structures

## Compatibility Notes for Application Layer

When implementing Application/Step2, the following will be needed:

1. **DTOs**: Create insurance-specific DTOs in `application/step2/dtos.ts`
2. **Mappers**: Map between domain types and DTOs
3. **Use Cases**: Implement `loadInsurance` and `saveInsurance`
4. **Ports**: Define `InsuranceRepository` interface
5. **Business Logic**: If needed, add to `application/step2/usecases.ts` (not in schema)

## Files Modified

| File | Changes |
|------|---------|
| `insurance.schema.ts` | Reduced from 320 to 115 lines, removed unused fields |
| `common.ts` | Added InsuranceCarrier, PlanType, SubscriberRelationship enums |
| `schemas/index.ts` | Already exports insurance schema |
| `types/index.ts` | Already exports common types |

## Summary

The insurance schema has been successfully normalized to match the current UI implementation:

- ✅ Removed 50+ fields not present in UI
- ✅ Moved 3 enums to common types
- ✅ Removed 3 helper functions
- ✅ Maintained clean barrel exports
- ✅ TypeScript compilation successful
- ✅ No console statements
- ✅ SoC compliance maintained

The schema is now minimal, focused, and aligned with the actual UI components, ready for Application layer implementation in future tasks.

---

**Normalization by**: Claude Assistant
**Architecture**: Clean Domain with UI Alignment
**Principle**: YAGNI - Only what's needed now