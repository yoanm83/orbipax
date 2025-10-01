# Step 2 Insurance & Eligibility - Server Actions Report

**Date**: 2025-09-29
**Task**: Create server actions for Insurance & Eligibility (Step 2)
**Status**: ✅ COMPLETE

---

## EXECUTIVE SUMMARY

Successfully updated the existing Insurance & Eligibility server actions to align with the new Application layer architecture. Actions now properly use dependency injection, enforce auth guards, and return generic error messages.

---

## 1. FILE UPDATED

### Location
`D:\ORBIPAX-PROJECT\src\modules\intake\actions\step2\insurance.actions.ts`

### Original State
- Used old naming: `loadInsuranceAction`, `saveInsuranceAction`
- Imported from non-existent modules
- Referenced old factory and use cases

### Updated State
- New naming: `loadInsuranceEligibilityAction`, `upsertInsuranceEligibilityAction`
- Proper imports from Application layer
- Uses correct factory and use cases

---

## 2. ACTIONS IMPLEMENTED

### loadInsuranceEligibilityAction
```typescript
export async function loadInsuranceEligibilityAction(): Promise<ActionResponse<InsuranceEligibilityOutputDTO>>
```

**Features:**
- No parameters (uses session context)
- Auth guard with `resolveUserAndOrg()`
- Organization validation
- Repository instantiation via factory
- Delegates to `loadInsuranceEligibility` use case
- Generic error messages

### upsertInsuranceEligibilityAction
```typescript
export async function upsertInsuranceEligibilityAction(
  input: unknown
): Promise<ActionResponse<{ sessionId: string }>>
```

**Features:**
- Takes `unknown` input for safety
- Auth guard enforcement
- Type casting to DTO (validation in Application)
- Repository instantiation via factory
- Delegates to `saveInsuranceEligibility` use case
- Generic error messages

---

## 3. DEPENDENCY INJECTION

### Factory Import
```typescript
import { createInsuranceEligibilityRepository } from '@/modules/intake/infrastructure/factories/insurance-eligibility.factory'
```

### Repository Creation
```typescript
const repository = createInsuranceEligibilityRepository()
```

### Use Case Delegation
```typescript
const result = await loadInsuranceEligibility(repository, sessionId, organizationId)
const result = await saveInsuranceEligibility(repository, typedInput, sessionId, organizationId)
```

---

## 4. AUTH GUARDS

### Authentication Check
```typescript
try {
  const auth = await resolveUserAndOrg()
  userId = auth.userId
  organizationId = auth.organizationId
} catch (error) {
  return {
    ok: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Request failed'
    }
  }
}
```

### Organization Validation
```typescript
if (!organizationId) {
  return {
    ok: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Request failed'
    }
  }
}
```

---

## 5. ERROR HANDLING

### Generic Error Messages
All errors return generic messages to prevent PHI/PII exposure:

| Scenario | Code | Message |
|----------|------|---------|
| Auth Failed | `UNAUTHORIZED` | "Request failed" |
| No Organization | `UNAUTHORIZED` | "Request failed" |
| Application Error | Original or `UNKNOWN` | "Request failed" |
| Unexpected Error | `UNKNOWN` | "Request failed" |

### Error Mapping
```typescript
if (!result.ok) {
  return {
    ok: false,
    error: {
      code: result.error?.code || 'UNKNOWN',
      message: 'Request failed'  // Always generic
    }
  }
}
```

---

## 6. RESPONSE STRUCTURE

### Success Response
```typescript
{
  ok: true,
  data: InsuranceEligibilityOutputDTO | { sessionId: string }
}
```

### Error Response
```typescript
{
  ok: false,
  error: {
    code: string,
    message: string  // Always generic
  }
}
```

---

## 7. SOC COMPLIANCE

### What Actions DO
- ✅ Handle authentication/authorization
- ✅ Resolve organization context
- ✅ Create repository instances via factory
- ✅ Delegate to Application use cases
- ✅ Map responses to generic messages

### What Actions DON'T DO
- ❌ No business logic
- ❌ No validation (delegated to Domain via Application)
- ❌ No direct database access
- ❌ No Zod imports
- ❌ No detailed error messages

---

## 8. SESSION HANDLING

### Current Implementation
```typescript
// TODO: Get actual session ID from context/params
// For now using a deterministic session ID based on user
const sessionId = `session_${userId}_intake`
```

### Future Enhancement
- Will integrate with proper session management
- Support multiple concurrent sessions
- Handle session expiration

---

## 9. COMPILATION VERIFICATION

### TypeScript Check
```bash
npm run typecheck
```
**Result**: ✅ Compiles without errors in the project context

### Imports Verified
- Application layer: ✅
- Infrastructure factory: ✅
- Auth utilities: ✅

---

## 10. INTEGRATION READINESS

### For UI Layer
```typescript
// In a React component
import { loadInsuranceEligibilityAction, upsertInsuranceEligibilityAction } from '@/modules/intake/actions/step2/insurance.actions'

// Load data
const loadResult = await loadInsuranceEligibilityAction()

// Save data
const saveResult = await upsertInsuranceEligibilityAction(formData)
```

### Current Status
- Actions return `NOT_IMPLEMENTED` from repository skeleton
- Ready for real implementation when repository is completed
- UI can integrate immediately for testing

---

## 11. NAMING CONVENTIONS

### Consistent Pattern
| Step | Load Action | Save Action |
|------|------------|-------------|
| Step 1 | `loadDemographicsAction` | `saveDemographicsAction` |
| Step 2 | `loadInsuranceEligibilityAction` | `upsertInsuranceEligibilityAction` |

### Upsert vs Save
- "Upsert" indicates create-or-update semantics
- Aligns with business requirement for insurance data
- Consistent with database operation patterns

---

## CONCLUSION

✅ **Server Actions Created** - Two actions with proper naming
✅ **Auth Guards Active** - All requests validated
✅ **DI Pattern** - Factory-based repository creation
✅ **Generic Errors** - No PHI/PII exposure
✅ **Integration Ready** - Can be used immediately by UI

The Insurance & Eligibility server actions are complete and ready for UI integration.