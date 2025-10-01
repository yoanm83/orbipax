# Step 1 Demographics - Domain Schema Gender Swap Report

**Date**: 2025-09-29
**Task**: Replace sexAssignedAtBirth with gender field in Domain schema
**Status**: ✅ COMPLETE (Domain-only)

---

## EXECUTIVE SUMMARY

Successfully replaced `sexAssignedAtBirth` with `gender: 'male' | 'female'` in the Demographics schema. Race and ethnicity fields remain unchanged as required.

---

## 1. FIELDS AUDIT - BEFORE

### Gender-Related Fields (Original)
```typescript
// Line 109: Using imported enum
sexAssignedAtBirth: z.nativeEnum(SexAssignedAtBirth),

// Line 108: Kept for identity expression
genderIdentity: z.nativeEnum(GenderIdentity),

// Line 110: Optional pronouns
pronouns: z.string().max(20).optional(),
```

### Race and Ethnicity (Unchanged)
```typescript
// Line 113-114: USCDI v4 compliant
race: z.array(z.nativeEnum(Race)).min(1, 'At least one race selection required'),
ethnicity: z.nativeEnum(Ethnicity),
```

---

## 2. CHANGES APPLIED

### File Modified
`D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics\demographics.schema.ts`

### Import Changes
```diff
- import {
-   GenderIdentity,
-   SexAssignedAtBirth,  // REMOVED
-   Race,
-   Ethnicity,
-   ...
- } from '../../types/common'

+ import {
+   GenderIdentity,
+   Race,                 // KEPT
+   Ethnicity,           // KEPT
+   ...
+ } from '../../types/common'
```

### Schema Field Changes
```diff
- // USCDI v4 Gender and Sex
- genderIdentity: z.nativeEnum(GenderIdentity),
- sexAssignedAtBirth: z.nativeEnum(SexAssignedAtBirth),
- pronouns: z.string().max(20).optional(),

+ // Gender
+ gender: z.enum(['male', 'female']),
+ genderIdentity: z.nativeEnum(GenderIdentity),
+ pronouns: z.string().max(20).optional(),
```

---

## 3. FIELDS AUDIT - AFTER

### Complete Field Inventory (Demographics Schema)

| Category | Field | Type | Status |
|----------|-------|------|--------|
| **Identity** | firstName | string (required) | ✅ Unchanged |
| | middleName | string (optional) | ✅ Unchanged |
| | lastName | string (required) | ✅ Unchanged |
| | preferredName | string (optional) | ✅ Unchanged |
| | dateOfBirth | Date (required) | ✅ Unchanged |
| **Gender** | gender | 'male' \| 'female' | ✅ NEW |
| | genderIdentity | GenderIdentity enum | ✅ Unchanged |
| | pronouns | string (optional) | ✅ Unchanged |
| | ~~sexAssignedAtBirth~~ | ~~SexAssignedAtBirth enum~~ | ❌ REMOVED |
| **Race/Ethnicity** | race | Race[] array | ✅ UNCHANGED |
| | ethnicity | Ethnicity enum | ✅ UNCHANGED |
| **Social** | maritalStatus | MaritalStatus enum | ✅ Unchanged |
| | veteranStatus | VeteranStatus enum | ✅ Unchanged |
| **Language** | primaryLanguage | Language enum | ✅ Unchanged |
| | needsInterpreter | boolean | ✅ Unchanged |
| | preferredCommunicationMethod | CommunicationMethod[] | ✅ Unchanged |
| **Contact** | email | string (optional) | ✅ Unchanged |
| | phoneNumbers | PhoneNumber[] | ✅ Unchanged |
| **Address** | address | Address object | ✅ Unchanged |
| | sameAsMailingAddress | boolean | ✅ Unchanged |
| | mailingAddress | Address (optional) | ✅ Unchanged |
| | housingStatus | HousingStatus enum | ✅ Unchanged |
| **Emergency** | emergencyContact | EmergencyContact object | ✅ Unchanged |
| **Legal** | socialSecurityNumber | string (optional) | ✅ Unchanged |
| | driverLicenseNumber | string (optional) | ✅ Unchanged |
| | driverLicenseState | string (optional) | ✅ Unchanged |
| | hasLegalGuardian | boolean | ✅ Unchanged |
| | legalGuardianInfo | object (optional) | ✅ Unchanged |
| | hasPowerOfAttorney | boolean | ✅ Unchanged |
| | powerOfAttorneyInfo | object (optional) | ✅ Unchanged |

---

## 4. EXPORTS VERIFICATION

### Canonical Exports (Lines 282-304)
```typescript
// ✅ Schema export maintained
export const demographicsSchema = demographicsDataSchema

// ✅ Type export maintained
export type Demographics = DemographicsData

// ✅ Validation function maintained
export const validateDemographics = (data: unknown) => {
  const result = demographicsDataSchema.safeParse(data)
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

## 5. COMPILATION STATUS

### TypeScript Check Results
```bash
npm run typecheck
```

**Domain Schema**: ✅ No errors in demographics.schema.ts

**Expected Downstream Errors** (NOT addressed in this task):
- `mappers.ts`: References to `sexAssignedAtBirth` (Application layer)
- `dtos.ts`: DTO field references (Application layer)
- `demographics.repository.ts`: DB mapping (Infrastructure layer)

**Note**: Per task requirements, only Domain was modified. Application/Infrastructure updates are separate tasks.

---

## 6. VALIDATION

| Check | Result | Notes |
|-------|--------|-------|
| gender field added | ✅ | `z.enum(['male', 'female'])` |
| sexAssignedAtBirth removed | ✅ | No longer in schema |
| race field unchanged | ✅ | Still `Race[]` array |
| ethnicity field unchanged | ✅ | Still `Ethnicity` enum |
| demographicsSchema export | ✅ | Canonical export intact |
| Demographics type export | ✅ | Type inference working |
| validateDemographics function | ✅ | JSON-safe return intact |

---

## 7. IMPACT ANALYSIS

### Layers Affected
- **Domain**: ✅ UPDATED (this task)
- **UI**: ⚠️ Will need update (future task)
- **Actions**: ⚠️ May need update (future task)
- **Application**: ⚠️ Will need update (future task)
- **Infrastructure**: ⚠️ Will need update (future task)

### Next Steps Required (separate tasks)
1. Update Application DTOs to use `gender` field
2. Update mappers to handle `gender` instead of `sexAssignedAtBirth`
3. Update UI forms to use new field
4. Update Infrastructure repository mappings
5. Database schema alignment (if needed)

---

## CONCLUSION

✅ **Objective Achieved**: Domain schema updated with `gender: 'male' | 'female'`
✅ **sexAssignedAtBirth**: Successfully removed from Domain
✅ **race/ethnicity**: Remain unchanged as required
✅ **Exports**: All canonical exports maintained
✅ **SoC**: Only Domain layer modified as required

The Demographics schema now uses a simplified gender field while maintaining all other fields including race and ethnicity intact.