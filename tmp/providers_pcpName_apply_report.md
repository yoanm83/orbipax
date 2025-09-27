# Provider pcpName Field Migration Report
**Date:** 2025-09-26
**Type:** APPLY - Field standardization
**Target:** `pcpName` field in providers.schema.ts

## Objective
Align `pcpName` field with the canonical name validation standard using shared utilities from `@/shared/utils/name` to ensure global consistency across the OrbiPax system.

## File Modified
`D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step4\providers.schema.ts`

## Changes Applied

### 1. Import Statement Added
**Line:** 11
```typescript
// BEFORE: (no name utilities imported)
import { z } from 'zod'
import { normalizePhoneNumber, validatePhoneNumber } from '@/shared/utils/phone'

// AFTER:
import { z } from 'zod'
import { normalizePhoneNumber, validatePhoneNumber } from '@/shared/utils/phone'
import { normalizeName, validateName, NAME_LENGTHS } from '@/shared/utils/name'
```

### 2. Field Validation Updated
**Lines:** 25-29
```typescript
// BEFORE:
pcpName: z.string()
  .max(120, 'Provider name must not exceed 120 characters')
  .optional(),

// AFTER:
pcpName: z.string()
  .max(NAME_LENGTHS.PROVIDER_NAME, 'Provider name must not exceed 120 characters')
  .transform(normalizeName)
  .refine(validateName, 'Invalid characters in provider name')
  .optional(),
```

## Validation Chain Details

The new validation chain for `pcpName` now follows this sequence:

1. **Length Check:** `max(NAME_LENGTHS.PROVIDER_NAME)`
   - Uses constant: 120 characters
   - Maintains existing error message

2. **Normalization:** `transform(normalizeName)`
   - Trims leading/trailing whitespace
   - Collapses multiple spaces to single space

3. **Character Validation:** `refine(validateName, 'Invalid characters in provider name')`
   - Validates against regex: `/^[a-zA-ZÀ-ÿĀ-žА-я\s\-'\.]+$/`
   - Supports international characters
   - Allows: letters, spaces, hyphens, apostrophes, periods

4. **Optional:** Field remains optional as per original schema

## Contract Preservation

✅ **Field name unchanged:** `pcpName`
✅ **Type unchanged:** `string | undefined`
✅ **Optional status unchanged:** Field remains optional
✅ **Conditional validation preserved:** Still required when `hasPCP === 'Yes'`
✅ **Error path unchanged:** Validation errors still appear on `pcpName`

## Verification Results

### TypeScript Compilation
```bash
npx tsc --noEmit --project tsconfig.json
```
**Status:** ✅ No new errors introduced
- Existing codebase errors unrelated to this change
- No type errors in providers.schema.ts

### Schema Validation Test
The schema maintains backward compatibility:
- ✅ Accepts valid provider names
- ✅ Rejects names with invalid characters
- ✅ Normalizes whitespace correctly
- ✅ Respects character limit

### Conditional Logic Verification
**Lines 46-50:** Conditional validation remains intact
```typescript
if (data.hasPCP === 'Yes') {
  if (!data.pcpName || data.pcpName.trim().length === 0) {
    return false
  }
  // ... rest of validation
}
```

## Benefits Achieved

### 1. Consistency
- **Uniform validation:** Same rules as all other provider name fields
- **Standard normalization:** Consistent whitespace handling
- **Shared constants:** Using `NAME_LENGTHS.PROVIDER_NAME`

### 2. Maintainability
- **Single source of truth:** Validation logic in shared utility
- **Easier updates:** Changes to name rules in one place
- **Type safety:** NAME_LENGTHS prevents magic numbers

### 3. User Experience
- **Consistent errors:** Same validation messages across all name fields
- **Better data quality:** Names normalized before storage
- **International support:** Unicode characters properly supported

### 4. Code Quality
- **DRY principle:** No duplicate validation logic
- **Clear intent:** Validation chain self-documenting
- **Testable:** Shared utilities have centralized tests

## Related Fields Status

| Field | File | Status |
|-------|------|--------|
| pcpName | providers.schema.ts | ✅ Fixed (this task) |
| pcpPractice | providers.schema.ts | 🟡 Pending (organization name) |
| psychiatristName | psychiatrist.schema.ts | ✅ Already compliant |
| evaluatorName | psychiatrist.schema.ts | ✅ Already compliant |
| clinicName | psychiatrist.schema.ts | ✅ Already compliant |

## Summary

Successfully migrated `pcpName` field to use shared name utilities:
- ✅ Import added: `normalizeName, validateName, NAME_LENGTHS`
- ✅ Validation chain: max → transform → refine → optional
- ✅ No regex/helpers locally defined for pcpName
- ✅ Contracts preserved (field name, type, optional status)
- ✅ Domain remains pure (no UI logic)
- ✅ TypeScript compilation successful
- ✅ No PHI exposed in report

**Migration Status:** ✅ COMPLETE

## Next Recommended Tasks

1. **pcpPractice field:** Apply same pattern with `NAME_LENGTHS.ORGANIZATION_NAME`
2. **evaluatorClinic field:** In psychiatrist.schema.ts, needs name utilities
3. **UI normalization:** Add real-time normalization to ProvidersSection.tsx

---
**Report Generated:** 2025-09-26
**No PHI included**
**Guardrails verified**