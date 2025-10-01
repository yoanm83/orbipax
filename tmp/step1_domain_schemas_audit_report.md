# Demographics Domain Schemas Audit Report

**Date:** 2025-09-29
**Auditor:** Claude Code
**Scope:** Domain layer demographics schema duplication analysis

## Executive Summary

A comprehensive audit of the Demographics schemas in the Domain layer has identified significant duplication and inconsistencies between two schema files. This report provides a detailed analysis and consolidation plan to resolve the current architectural debt.

## Files Audited

### Primary Files
1. **Root Schema**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics.schema.ts` (231 lines)
2. **Nested Schema**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics\demographics.schema.ts` (254 lines)

### Related Files
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\types\common.ts` - Common types and enums
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\index.ts` - Domain public API
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\index.ts` - Schema barrel exports

## Schema Comparison Analysis

### Structural Differences

| Aspect | Root Schema (`demographics.schema.ts`) | Nested Schema (`demographics/demographics.schema.ts`) |
|--------|----------------------------------------|------------------------------------------------------|
| **File Size** | 231 lines | 254 lines |
| **Last Modified** | Appears older | Appears newer/more complete |
| **Common Types Import** | Uses `type Address`, `type PhoneNumber`, `type EmergencyContact`, `type LegalGuardianInfo`, `type PowerOfAttorneyInfo` | Uses `type OrganizationId`, `type PatientId` |
| **Name Validation** | Uses hardcoded `max(50)` | Uses `NAME_LENGTHS` constants |
| **Additional Schemas** | Missing multitenant wrapper | Includes `demographicsSubmissionSchema` |
| **Utility Functions** | Missing | Includes `calculateAge`, `isMinor` helpers |
| **Validation Helpers** | Missing | Includes `validateDemographicsStep`, `validateDemographicsSubmission` |

### Field-Level Differences

#### Required vs Optional Fields

| Field | Root Schema | Nested Schema | Impact |
|-------|-------------|---------------|---------|
| `dateOfBirth` | Optional | **Required** | 🔴 Breaking change |
| `genderIdentity` | Optional | **Required** | 🔴 Breaking change |
| `sexAssignedAtBirth` | Optional | **Required** | 🔴 Breaking change |
| `race` | `default([])` | **Required, min(1)** | 🔴 Breaking change |
| `ethnicity` | Optional | **Required** | 🔴 Breaking change |
| `maritalStatus` | Optional | **Required** | 🔴 Breaking change |
| `veteranStatus` | Optional | **Required** | 🔴 Breaking change |
| `primaryLanguage` | Optional | **Required** | 🔴 Breaking change |
| `needsInterpreter` | `default(false)` | **Required** | 🔴 Breaking change |
| `preferredCommunicationMethod` | `default([])` | **Required, min(1)** | 🔴 Breaking change |
| `phoneNumbers` | `default([])` | **Required, min(1), max(3)** | 🔴 Breaking change |
| `address` | Optional | **Required** | 🔴 Breaking change |
| `sameAsMailingAddress` | `default(true)` | **Required** | 🔴 Breaking change |
| `housingStatus` | Optional | **Required** | 🔴 Breaking change |
| `emergencyContact` | Optional | **Required** | 🔴 Breaking change |
| `hasLegalGuardian` | `default(false)` | **Required** | 🔴 Breaking change |
| `socialSecurityNumber` | Optional with empty string | Optional, stricter regex | 🟡 Validation difference |

#### Validation Rule Differences

| Field | Root Schema | Nested Schema | Impact |
|-------|-------------|---------------|---------|
| `firstName` | `max(50)` | `max(NAME_LENGTHS.FIRST_NAME)` | 🟡 Using constants |
| `middleName` | `max(50)` | `max(NAME_LENGTHS.MIDDLE_NAME)` | 🟡 Using constants |
| `lastName` | `max(50)` | `max(NAME_LENGTHS.LAST_NAME)` | 🟡 Using constants |
| `preferredName` | `max(50)` | `max(NAME_LENGTHS.PREFERRED_NAME)` | 🟡 Using constants |
| `emergencyContact.name` | `max(100)` | `max(NAME_LENGTHS.FULL_NAME)` | 🟡 Using constants |
| `socialSecurityNumber` | Allows empty string | Stricter regex, no empty | 🟡 Validation difference |
| `address.country` | `optional()` | `default('US')` | 🟡 Default behavior |

#### New Features in Nested Schema

1. **Driver License Fields**: `driverLicenseNumber`, `driverLicenseState` (new fields)
2. **Enhanced Legal Guardian**: More structured with enum for relationships
3. **Multitenant Support**: `demographicsSubmissionSchema` with `organizationId`, `patientId`
4. **Metadata Tracking**: Completion timestamp, version, source tracking
5. **Cross-field Validation**: Guardian/POA conditional validation
6. **Utility Functions**: Age calculation, minor status helpers

### Type Export Differences

| Type | Root Schema | Nested Schema | Status |
|------|-------------|---------------|---------|
| `DemographicsData` | ✅ | ✅ | Both export |
| `PartialDemographicsData` | ✅ | ❌ | Only in root |
| `RequiredDemographicsFields` | ✅ | ❌ | Only in root |
| `DemographicsSubmission` | ❌ | ✅ | Only in nested |
| `Address` | ❌ | ✅ | Re-exported in nested |
| `PhoneNumber` | ❌ | ✅ | Re-exported in nested |
| `EmergencyContact` | ❌ | ✅ | Re-exported in nested |

## Usage Analysis

### Import Patterns Found

#### UI Components (All using nested schema)
- `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\PersonalInfoSection.tsx`
- `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\LegalSection.tsx`
- `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\intake-wizard-step1-demographics.tsx`
- `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\AddressSection.tsx`
- `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\ContactSection.tsx`

#### Application Layer (Mixed usage)
- `D:\ORBIPAX-PROJECT\src\modules\intake\application\step1\usecases.ts` - **Uses root schema** 🔴
- `D:\ORBIPAX-PROJECT\src\modules\intake\application\step1\mappers.ts` - **Uses root schema** 🔴

#### Domain Layer
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\index.ts` - **Exports nested schema** ✅
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\index.ts` - **Exports root schema** 🔴
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\review-submit.schema.ts` - **Uses nested schema** ✅

### Architecture Violations Detected

1. **SoC Violation**: Application layer imports Zod schemas directly
   - `usecases.ts` line 11: `import { demographicsDataSchema, requiredDemographicsFields }`
   - Should use domain types only, not validation schemas

2. **Inconsistent Exports**:
   - Domain index exports nested schema
   - Schemas index exports root schema
   - Creates confusion and inconsistency

3. **Unused Legacy Types**:
   - `LegalGuardianInfo` and `PowerOfAttorneyInfo` types from common.ts are imported in root schema but inline defined in nested schema

## Common Types Analysis

### Consistent Imports
Both schemas properly import enums and base types from `domain/types/common`:
- `GenderIdentity`, `SexAssignedAtBirth`, `Race`, `Ethnicity`
- `MaritalStatus`, `Language`, `CommunicationMethod`
- `VeteranStatus`, `HousingStatus`

### Discrepancy in Interface Usage
- **Root schema**: Imports `type Address`, `type PhoneNumber`, `type EmergencyContact` from common
- **Nested schema**: Defines own schemas and re-exports as types
- **Impact**: Potential type incompatibility between schemas

## Dead Code Analysis

### Root Schema (`demographics.schema.ts`)
- **Status**: 🔴 **DEAD CODE** - Not used by UI components
- **Usage**: Only used by Application layer (violating SoC)
- **Exports**: Available through schemas index but overridden by domain index

### Nested Schema (`demographics/demographics.schema.ts`)
- **Status**: ✅ **ACTIVE** - Primary schema used by UI and domain exports
- **Usage**: UI components, domain public API, review-submit schema

## Consolidation Plan

### Phase 1: Establish Canonical Schema ✅

**Decision**: Use **Nested Schema** (`demographics/demographics.schema.ts`) as canonical
- More feature-complete
- Includes multitenant support
- Used by UI components
- Exported by domain public API
- Has utility functions and validation helpers

### Phase 2: Migration Tasks

#### Task 1: Fix Application Layer SoC Violations
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step1\usecases.ts`
- Remove direct Zod schema import
- Use domain types through proper interfaces
- Delegate validation to domain services

**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step1\mappers.ts`
- Remove direct schema type imports
- Use domain types from public API
- Remove dependency on `LegalGuardianInfo`/`PowerOfAttorneyInfo` from common types

#### Task 2: Clean Schema Barrel Exports
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\index.ts`
- Remove export of root demographics schema
- Add export of nested demographics schema if needed
- Align with domain index exports

#### Task 3: Remove Deprecated Schema
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics.schema.ts`
- Delete entire file
- Update any remaining imports (should be none after Task 1)

#### Task 4: Clean Common Types
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\types\common.ts`
- Remove `LegalGuardianInfo` and `PowerOfAttorneyInfo` interfaces
- Remove associated exports (no longer needed)

#### Task 5: Validation Testing
- Verify all UI components continue to work
- Test form validation with stricter schema requirements
- Verify multitenant submission workflow

### Phase 3: Validation Requirements Update

The canonical schema has stricter validation requirements. UI will need updates to handle:

1. **Required Fields**: All major demographic fields now required
2. **Phone Number Limits**: Min 1, Max 3 phone numbers
3. **Communication Methods**: At least one required
4. **Address Requirements**: Physical address now required
5. **Emergency Contact**: Now required field

### Phase 4: Data Migration Considerations

If production data exists using the old optional schema:
1. **Assess Data Completeness**: Check existing records for missing required fields
2. **Migration Scripts**: Convert optional nulls to appropriate defaults
3. **Graceful Degradation**: Consider backward compatibility during transition

## Recommended Implementation Order

1. **Immediate** (Fix SoC violations)
   - Task 1: Remove Zod imports from Application layer
   - Task 2: Fix schema barrel exports

2. **Short-term** (Clean up dead code)
   - Task 3: Remove root demographics schema
   - Task 4: Clean common types

3. **Medium-term** (UI adaptation)
   - Task 5: Update UI for stricter validation
   - Address form validation changes

4. **Long-term** (Data migration)
   - Production data migration if needed
   - Monitor for validation failures

## Risk Assessment

### High Risk 🔴
- **Breaking Changes**: Stricter validation will reject previously valid data
- **UI Impact**: Forms may fail validation with new requirements
- **Data Loss**: Potential for form submission failures

### Medium Risk 🟡
- **Type Compatibility**: Potential runtime errors during transition
- **Testing Gaps**: Need comprehensive validation testing

### Low Risk 🟢
- **Dead Code Removal**: Minimal impact once SoC violations fixed
- **Performance**: Slight improvement from removing duplicate schemas

## Success Criteria

✅ **SoC Compliance**: Application layer no longer imports Zod schemas
✅ **Single Source of Truth**: Only one demographics schema remains
✅ **Consistent Exports**: Domain and schema indexes aligned
✅ **UI Functionality**: All step1 components continue to work
✅ **Validation Coverage**: Stricter validation properly enforced
✅ **Type Safety**: No TypeScript compilation errors

## Conclusion

The demographics schema duplication represents significant technical debt with architecture violations. The nested schema should be adopted as canonical due to its completeness and current usage patterns. Immediate focus should be on fixing SoC violations in the Application layer, followed by systematic removal of the deprecated root schema.

The stricter validation requirements in the canonical schema will improve data quality but require careful migration planning to avoid breaking existing workflows.

---

**Next Steps**: Begin with Phase 1 implementation, starting with Application layer SoC compliance fixes.