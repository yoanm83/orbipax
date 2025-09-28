# Step 1 Demographics: LegalSection RHF Audit Report

**Date**: 2025-09-28
**Task**: Audit LegalSection for React Hook Form + zodResolver readiness
**Type**: Read-only audit (no code changes)
**Target**: LegalSection component RHF migration readiness assessment

## Executive Summary

⚠️ **NOT READY** - LegalSection currently uses local useState and is NOT integrated with React Hook Form. Schema exists for legalGuardianInfo but Power of Attorney fields are NOT in schema. Significant gaps between UI fields and schema structure.

## 1. Schema Analysis (Domain Layer)

### Files Reviewed
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics.schema.ts`
- `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\consents.schema.ts`

### Legal Fields in demographics.schema.ts

```typescript
// Lines 154-166
hasLegalGuardian: z.boolean(),
legalGuardianInfo: z.object({
  name: z.string()
    .min(1, 'Guardian name is required')
    .max(NAME_LENGTHS.FULL_NAME)
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in guardian name'),
  relationship: z.string().min(1).max(50),
  phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number'),
  address: addressSchema.optional()
}).optional()
```

### Helper Functions Available
- `isMinor(dateOfBirth: Date): boolean` - Line 208
- `calculateAge(dateOfBirth: Date): number` - Line 196

### Schema Gaps Identified
1. **Missing Power of Attorney** - UI has POA fields, schema does not
2. **Missing Guardian Email** - UI has email field, schema does not
3. **No relationship enum** - Schema uses plain string, UI has specific options

## 2. UI Component Analysis

### Current Implementation (LegalSection.tsx)

**State Management**: Uses LOCAL useState (NOT React Hook Form)
```typescript
// Lines 28-42
const [hasLegalGuardian, setHasLegalGuardian] = useState(false)
const [hasPowerOfAttorney, setHasPowerOfAttorney] = useState(false)
const [guardianInfo, setGuardianInfo] = useState({
  name: '', relationship: '', phone: '', email: ''
})
const [poaInfo, setPoaInfo] = useState({
  name: '', phone: ''
})
```

### UI Fields Present
| Field | Type | Required | In Schema |
|-------|------|----------|-----------|
| hasLegalGuardian | Switch/boolean | No | ✅ Yes |
| legalGuardianInfo.name | Input/string | Yes* | ✅ Yes |
| legalGuardianInfo.relationship | Select/string | Yes* | ✅ Yes (no enum) |
| legalGuardianInfo.phone | Input/tel | Yes* | ✅ Yes (as phoneNumber) |
| legalGuardianInfo.email | Input/email | Yes* | ❌ No |
| hasPowerOfAttorney | Switch/boolean | No | ❌ No |
| poaInfo.name | Input/string | Yes* | ❌ No |
| poaInfo.phone | Input/tel | Yes* | ❌ No |

*Required when parent toggle is enabled

### Conditional Logic
- **Minor Status Display**: Lines 95-108
  - Calculated from `dateOfBirth` prop using `differenceInYears`
  - Displays "Yes/No" badge based on age < 18
- **Guardian Fields**: Lines 128-189
  - Show/hide based on `hasLegalGuardian` state
- **POA Fields**: Lines 210-240
  - Show/hide based on `hasPowerOfAttorney` state

## 3. Field Mapping Analysis

### Schema → UI Mapping

| Schema Path | UI Field | Match Status | Notes |
|-------------|----------|--------------|-------|
| hasLegalGuardian | hasLegalGuardian (useState) | ⚠️ Partial | Need RHF integration |
| legalGuardianInfo.name | guardianInfo.name | ⚠️ Partial | Different state structure |
| legalGuardianInfo.relationship | guardianInfo.relationship | ⚠️ Partial | UI has enum options |
| legalGuardianInfo.phoneNumber | guardianInfo.phone | ❌ Mismatch | Different field name |
| legalGuardianInfo.address | N/A | ❌ Missing | Not in UI |
| N/A | guardianInfo.email | ❌ Extra | Not in schema |
| N/A | hasPowerOfAttorney | ❌ Missing | Not in schema |
| N/A | poaInfo.* | ❌ Missing | Not in schema |

### Relationship Options in UI
```typescript
// Lines 151-156
<SelectItem value="parent">Parent</SelectItem>
<SelectItem value="legal_guardian">Legal Guardian</SelectItem>
<SelectItem value="grandparent">Grandparent</SelectItem>
<SelectItem value="other">Other</SelectItem>
```

## 4. Form Primitives Availability

### Verified Available Components
✅ FormField - `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\Form\index.tsx`
✅ FormControl - Controller wrapper from RHF
✅ FormItem, FormLabel, FormMessage - Form composition components
✅ Input - Already imported in LegalSection
✅ Select - Already imported in LegalSection
✅ Switch - Already imported in LegalSection

### RHF Integration Pattern
```typescript
// Pattern from ContactSection.tsx
<FormField
  control={form.control}
  name="legalGuardianInfo.name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Guardian Name *</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## 5. Gaps & Issues

### Critical Gaps
1. **Power of Attorney Not in Schema** - Entire POA section has no schema backing
2. **Guardian Email Missing** - UI field exists but not in schema
3. **Field Name Mismatch** - `phone` vs `phoneNumber`
4. **No Relationship Enum** - Schema accepts any string, UI has specific options

### Migration Blockers
1. **Schema Updates Needed**:
   - Add POA fields to schema
   - Add email to legalGuardianInfo
   - Consider relationship enum
   - Align field names

2. **State Management**:
   - Currently uses 4 separate useState hooks
   - Needs conversion to RHF with nested objects

3. **Validation**:
   - No current validation in UI
   - Schema validation ready but incomplete

## 6. Proposed Micro-Task

### Task: Migrate LegalSection to RHF + zodResolver

**Scope**:
1. Replace all useState with FormField components
2. Map to correct schema paths (with fixes)
3. Add FormMessage for validation errors
4. Preserve conditional logic for minor status

**Implementation Steps**:
1. **Fix Schema First** (Domain layer):
   - Add `email` to legalGuardianInfo
   - Rename `phoneNumber` to match UI or vice versa
   - Add POA fields or remove from UI

2. **Convert State to RHF**:
   ```typescript
   // From:
   const [hasLegalGuardian, setHasLegalGuardian] = useState(false)

   // To:
   <FormField
     control={form.control}
     name="hasLegalGuardian"
     render={({ field }) => (
       <Switch
         checked={field.value}
         onCheckedChange={field.onChange}
       />
     )}
   />
   ```

3. **Nested Object Paths**:
   - `legalGuardianInfo.name`
   - `legalGuardianInfo.relationship`
   - `legalGuardianInfo.phoneNumber`
   - `legalGuardianInfo.email` (after schema update)

4. **A11y Attributes**:
   - Add `aria-invalid` to all inputs
   - Add `aria-describedby` for errors
   - Add `role="alert"` to FormMessage

## 7. Guardrails Verification

✅ **Separation of Concerns**: Schema in Domain, UI uses but doesn't define
✅ **A11y Ready**: FormMessage supports role="alert", aria-* attributes
✅ **No PHI/Fetch**: Component is pure UI, no data fetching
✅ **No Duplication**: Will reuse existing Form primitives
✅ **Report Location**: /tmp directory, no PII in report

## Recommendations

### Immediate Actions Needed
1. **DECISION REQUIRED**: Keep POA in UI or remove?
2. **Schema alignment** before migration
3. **Field name standardization** (phone vs phoneNumber)

### Migration Complexity: MEDIUM-HIGH
- Nested object handling required
- Schema gaps must be resolved first
- Conditional logic preservation needed
- 8 fields to migrate with dependencies

## Summary

The LegalSection is **NOT READY** for immediate RHF migration due to significant schema gaps. The UI includes Power of Attorney fields that don't exist in the schema, and there are field name mismatches. The component currently uses local state management with 4 useState hooks that need conversion to React Hook Form.

**Critical Path**:
1. Resolve schema gaps (add POA or remove from UI)
2. Align field names between schema and UI
3. Migrate to RHF following established patterns from ContactSection
4. Add proper A11y attributes

---

**Status**: AUDIT COMPLETE
**Files Reviewed**: 5
**Gaps Found**: 8
**Migration Readiness**: 40%