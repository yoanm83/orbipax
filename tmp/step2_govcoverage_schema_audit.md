# Step 2 GovernmentCoverageSection Schema Mapping Audit

**Date**: 2025-09-29
**Task**: Map UI fields to canonical schema paths
**Status**: ✅ AUDIT COMPLETE

---

## EXECUTIVE SUMMARY

Audited the 4 UI fields in GovernmentCoverageSection and identified their mapping to the canonical schema. Found that **Medicaid/Medicare IDs are GAPS** - these fields don't exist in the schema. The SSN field maps to insurance coverage subscriber info, and the effective date maps to insurance coverage dates.

---

## 1. UI FIELD → SCHEMA → DTO MAPPING TABLE

| # | UI Field Label | Current Path (Temporary) | Canonical Schema Path | DTO Path | Status |
|---|----------------|--------------------------|----------------------|----------|--------|
| 1 | **Medicaid ID** | `governmentCoverage.medicaidId` | **GAP - Not in schema** | **GAP - Not in DTO** | ❌ Missing |
| 2 | **Medicaid Effective Date** | `governmentCoverage.medicaidEffectiveDate` | `insuranceCoverages[x].effectiveDate` (where type='medicaid') | `insuranceCoverages[x].effectiveDate` | ⚠️ Partial |
| 3 | **Medicare ID** | `governmentCoverage.medicareId` | **GAP - Not in schema** | **GAP - Not in DTO** | ❌ Missing |
| 4 | **Social Security Number** | `governmentCoverage.ssn` | `insuranceCoverages[x].subscriberSSN` | `insuranceCoverages[x].subscriberSSN` | ✅ Exists |

---

## 2. DETAILED FIELD ANALYSIS

### Field 1: Medicaid ID
- **UI Location**: GovernmentCoverageSection.tsx:62-85
- **Current Mapping**: `governmentCoverage.medicaidId` (temporary)
- **Schema Search Result**: NOT FOUND
- **DTO Search Result**: NOT FOUND
- **Analysis**: The schema has `policyNumber` in `insuranceCoverages[]` but no specific Medicaid ID field
- **Recommendation**: Map to `insuranceCoverages[x].policyNumber` where `type='medicaid'`

### Field 2: Medicaid Effective Date
- **UI Location**: GovernmentCoverageSection.tsx:88-111
- **Current Mapping**: `governmentCoverage.medicaidEffectiveDate` (temporary)
- **Schema Location**: insurance-eligibility.schema.ts:48
- **Schema Path**: `insuranceCoverages[x].effectiveDate` (z.date())
- **DTO Location**: dtos.ts:30
- **DTO Path**: `insuranceCoverages[x].effectiveDate` (string - ISO date)
- **Analysis**: Exists but requires array lookup by insurance type

### Field 3: Medicare ID
- **UI Location**: GovernmentCoverageSection.tsx:114-138
- **Current Mapping**: `governmentCoverage.medicareId` (temporary)
- **Schema Search Result**: NOT FOUND
- **DTO Search Result**: NOT FOUND
- **Analysis**: Similar to Medicaid ID - should use `policyNumber` for Medicare coverage
- **Recommendation**: Map to `insuranceCoverages[x].policyNumber` where `type='medicare'`

### Field 4: Social Security Number
- **UI Location**: GovernmentCoverageSection.tsx:141-169
- **Current Mapping**: `governmentCoverage.ssn` (temporary)
- **Schema Location**: insurance-eligibility.schema.ts:42-44
- **Schema Path**: `insuranceCoverages[x].subscriberSSN` (optional string with regex validation)
- **DTO Location**: dtos.ts:27
- **DTO Path**: `insuranceCoverages[x].subscriberSSN` (optional string)
- **Analysis**: Exists but within insurance coverage array, not standalone

---

## 3. SCHEMA REFERENCE

### Available Government-Related Fields in Schema

```typescript
// In financialInformationSchema (lines 138-143)
receivesMedicaid: z.boolean()    // Boolean flag only
receivesMedicare: z.boolean()    // Boolean flag only
receivesSSI: z.boolean()
receivesSSDI: z.boolean()
receivesTANF: z.boolean()
receivesSNAP: z.boolean()

// In insuranceCoverageSchema (lines 22-67)
type: z.nativeEnum(InsuranceType)  // Includes 'medicare' | 'medicaid'
policyNumber: z.string()           // Could store Medicaid/Medicare IDs
subscriberSSN: z.string()          // SSN field exists here
effectiveDate: z.date()            // Coverage effective date
```

---

## 4. GAP ANALYSIS & PROPOSALS

### Gap 1: Medicaid ID Field
**Current State**: No dedicated field for Medicaid ID
**Proposed Solution**:
- Option A: Use `insuranceCoverages[]` array with `type='medicaid'` and store ID in `policyNumber`
- Option B: Add new fields to schema:
  ```typescript
  // In financialInformationSchema (proposed addition)
  medicaidId: z.string().max(50).optional()
  medicaidEffectiveDate: z.date().optional()
  ```

### Gap 2: Medicare ID Field
**Current State**: No dedicated field for Medicare ID
**Proposed Solution**:
- Option A: Use `insuranceCoverages[]` array with `type='medicare'` and store ID in `policyNumber`
- Option B: Add new fields to schema:
  ```typescript
  // In financialInformationSchema (proposed addition)
  medicareId: z.string().max(50).optional()
  medicareEffectiveDate: z.date().optional()
  ```

### Recommended Approach: **Option A**
Use the existing `insuranceCoverages[]` array structure:
1. Create/find Medicaid coverage entry (type='medicaid')
2. Create/find Medicare coverage entry (type='medicare')
3. Store IDs in `policyNumber` field
4. Store dates in `effectiveDate` field
5. Store SSN in `subscriberSSN` field

---

## 5. APPLY PLAN (Next Task)

### Step 1: Update GovernmentCoverageSection Field Mappings
**File**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\components\GovernmentCoverageSection.tsx`

**Changes Required**:
1. Import `useFieldArray` from `react-hook-form`
2. Access/manage `insuranceCoverages` array
3. Map fields to correct array indices:
   - Medicaid ID → `insuranceCoverages[medicaidIndex].policyNumber`
   - Medicaid Date → `insuranceCoverages[medicaidIndex].effectiveDate`
   - Medicare ID → `insuranceCoverages[medicareIndex].policyNumber`
   - SSN → `insuranceCoverages[medicaidIndex].subscriberSSN` (or medicare)

### Step 2: Helper Functions (Optional)
Create helper to find/create coverage by type:
```typescript
// Pseudo-code (not to implement in audit)
const getMedicaidCoverage = () => {
  return fields.find(f => f.type === 'medicaid') || createNewCoverage('medicaid')
}
```

### Execution Order:
1. Read current `insuranceCoverages` array state
2. Find or create Medicaid/Medicare entries
3. Bind UI fields to correct array paths
4. Handle array mutations properly
5. Test form submission

---

## 6. ALLOWED PATHS FOR APPLY TASK

### Read/Write:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\components\GovernmentCoverageSection.tsx
```

### Read-Only Reference:
```
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\insurance-eligibility\insurance-eligibility.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\application\step2\dtos.ts
D:\ORBIPAX-PROJECT\src\shared\ui\primitives\**
```

### Do NOT Touch:
```
- Schema files (don't add new fields)
- DTO files (don't modify contracts)
- Actions/Infrastructure files
- Other UI sections
```

---

## 7. VALIDATION CHECKLIST

### Current State:
- [x] All 4 UI fields identified
- [x] Schema paths searched and documented
- [x] DTO paths matched to schema
- [x] Gaps clearly identified
- [x] Proposals provided without code

### For Apply Task:
- [ ] Replace temporary paths with canonical paths
- [ ] Handle array-based insurance coverage properly
- [ ] Maintain all A11y attributes
- [ ] Keep error handling generic
- [ ] Test with form submission

---

## 8. RISK ASSESSMENT

| Risk | Impact | Mitigation |
|------|--------|------------|
| Array complexity | HIGH | Use `useFieldArray` hook properly |
| Data loss on array updates | MEDIUM | Preserve existing coverage data |
| Type mismatch (date vs string) | LOW | Handle date conversions |
| Missing coverage entries | MEDIUM | Create default entries if needed |

---

## CONCLUSION

The audit reveals that GovernmentCoverageSection's fields don't have direct 1:1 mappings in the canonical schema. The recommended approach is to use the existing `insuranceCoverages[]` array structure, treating Medicaid and Medicare as insurance coverage entries rather than standalone fields. This maintains schema integrity while supporting the UI requirements.

**Key Finding**: 2 of 4 fields are GAPS (Medicaid ID, Medicare ID) that need to be mapped to `policyNumber` within the insurance coverage array.

**Next Step**: Implement array-based field mapping using `useFieldArray` in the APPLY task.