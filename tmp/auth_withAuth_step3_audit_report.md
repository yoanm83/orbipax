# AUTHENTICATION AUDIT - STEP 3 DIAGNOSIS SUGGESTIONS
**Date:** 2025-09-25
**Issue:** "Authentication required. Please log in." error despite active session
**Status:** ⚠️ ROOT CAUSE IDENTIFIED

---

## 🔍 EXECUTIVE SUMMARY

The authentication failure in Step 3's "Generate Diagnosis Suggestions" occurs because the `withAuth` wrapper is looking for a non-existent cookie (`session_token`) instead of using the proper Supabase authentication mechanism. The system has two parallel auth approaches that are not integrated.

---

## 📊 FLOW DIAGRAM

```
USER CLICK "Generate Diagnosis Suggestions"
                    ↓
[1] DiagnosesSection.tsx (line 80)
    'use client' component
    Direct import: import { generateDiagnosisSuggestions }
    Call: await generateDiagnosisSuggestions({ presentingProblem })
                    ↓
[2] diagnoses.actions.ts (line 78-88)
    'use server' action
    Wrapped: withAuth → withSecurity → withRateLimit → withAudit
                    ↓
[3] security-wrappers.ts (line 18-52)
    withAuth implementation
    ❌ Checks: cookieStore.get('session_token')
    Cookie not found → Returns error
                    ↓
[4] UI receives error (line 93)
    Shows: "Authentication required. Please log in."
```

---

## 🔐 AUTHENTICATION MECHANISMS FOUND

### 1. Supabase Auth (WORKING - Used elsewhere)
**Location:** `src/shared/auth/session.server.ts`
```typescript
export async function getSession() {
  const supabase = getServiceClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}
```
- Uses Supabase client with proper cookie handling
- Cookies managed by `@supabase/ssr` package
- Cookie names: Dynamic, typically `sb-*` prefixed

### 2. Dev Mode Fallback (WORKING)
**Location:** `src/shared/lib/current-user.server.ts`
```typescript
const devUid = cookies().get("opx_uid")?.value;
```
- Development cookie for local testing
- Falls back to first organization if no user

### 3. Custom withAuth Wrapper (BROKEN)
**Location:** `src/modules/intake/infrastructure/wrappers/security-wrappers.ts`
```typescript
const sessionToken = cookieStore.get('session_token')  // ← WRONG COOKIE NAME

if (!sessionToken) {
  return {
    ok: false,
    error: 'Authentication required. Please log in.'  // ← THE ERROR WE SEE
  }
}
```
- Looking for `session_token` cookie that doesn't exist
- Has TODO comments acknowledging it's temporary
- Not integrated with Supabase or dev mode

---

## 🎯 ROOT CAUSE ANALYSIS

### Primary Issue
**The `withAuth` wrapper is checking for a cookie that is never set by the authentication system.**

### Evidence
1. **Cookie Mismatch:**
   - withAuth expects: `session_token`
   - Supabase sets: Dynamic cookies (e.g., `sb-access-token`, `sb-refresh-token`)
   - Dev mode sets: `opx_uid`

2. **Incomplete Implementation:**
   ```typescript
   // Line 31-32 in security-wrappers.ts
   // TODO: Validate session token with Supabase
   // For now, we'll pass through if token exists
   ```

3. **Hardcoded Placeholder Values:**
   ```typescript
   // Lines 36-39
   const context = {
     organizationId: 'temp_org_id', // TODO: Get from session
     userId: 'temp_user_id' // TODO: Get from session
   }
   ```

### Why Other Features Work
- Auth module (`auth.actions.ts`) doesn't use `withAuth` wrapper
- Other operations likely use Supabase RLS directly
- Dev mode operations use `current-user.server.ts` which properly checks `opx_uid`

---

## 🛠️ PROPOSED FIX

### Option 1: Integrate withAuth with Supabase (RECOMMENDED)
**Files to modify:**
- `src/modules/intake/infrastructure/wrappers/security-wrappers.ts`

**Changes needed:**
```typescript
import { getSession } from '@/shared/auth/session.server'
import { resolveUserAndOrg } from '@/shared/lib/current-user.server'

export function withAuth<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      // Use existing Supabase session
      const session = await getSession()

      // Also check dev mode fallback
      if (!session) {
        const { userId, organizationId } = await resolveUserAndOrg()
        if (userId === 'DEV-NOAUTH') {
          // Dev mode without auth
          const context = { userId, organizationId }
          ;(global as any).__authContext = context
          return await fn(...args)
        }
      }

      if (!session) {
        return {
          ok: false,
          error: 'Authentication required. Please log in.'
        }
      }

      // Get organization from user profile
      const { userId, organizationId } = await resolveUserAndOrg()

      const context = { userId, organizationId }
      ;(global as any).__authContext = context

      return await fn(...args)
    } catch (error) {
      return {
        ok: false,
        error: 'Authentication failed. Please try again.'
      }
    }
  }) as T
}
```

### Option 2: Quick Dev Fix (TEMPORARY)
**Files to modify:**
- `src/modules/intake/infrastructure/wrappers/security-wrappers.ts`

**Changes needed:**
```typescript
// Line 22: Change cookie name
const sessionToken = cookieStore.get('opx_uid')  // Use dev cookie
```

This would make it work in dev mode but not production.

---

## 📝 VERIFICATION STEPS

### Current State Test
1. Set `opx_uid` cookie in browser
2. Click "Generate Diagnosis Suggestions"
3. Result: "Authentication required" error

### After Fix Test
1. Apply Option 1 changes
2. With Supabase session OR `opx_uid` cookie
3. Click "Generate Diagnosis Suggestions"
4. Expected: Successful generation

---

## ⚠️ SECURITY CONSIDERATIONS

### Current Vulnerabilities
1. **No actual session validation** - Just checks if cookie exists
2. **Hardcoded organization ID** - All users would share rate limit
3. **Global context storage** - Potential race conditions

### Fix Requirements
1. Properly validate Supabase session
2. Extract real userId and organizationId
3. Consider using AsyncLocalStorage instead of global

---

## 📋 NEXT MICRO-TASK

### Task: Fix withAuth to use Supabase session
**Estimated LOC:** ~30 lines changed
**Files to modify:**
1. `D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts`
   - Import `getSession` and `resolveUserAndOrg`
   - Replace cookie check with Supabase session
   - Properly extract userId and organizationId

**Validation:**
- Test with authenticated Supabase session
- Test with dev mode `opx_uid` cookie
- Verify rate limiting uses correct organization_id

---

## 🔄 COMPARISON WITH WORKING PATTERNS

### signIn Action (Works without withAuth)
```typescript
// src/modules/auth/application/auth.actions.ts
export async function signIn(input: SignInInput): Promise<SignInResult> {
  return await withSecurity(async () =>
    await withRateLimit(async () =>
      // ... No withAuth wrapper used
```
- Doesn't use withAuth because it's the login itself
- Uses placeholder wrappers that just pass through

### Dev Mode Pattern (Works)
```typescript
// src/shared/lib/current-user.server.ts
const devUid = cookies().get("opx_uid")?.value;
```
- Properly checks the dev cookie that actually exists
- Falls back to first organization for local dev

---

## 📊 SUMMARY

**Root Cause:** withAuth wrapper checks for non-existent `session_token` cookie instead of using Supabase auth or dev mode cookies.

**Impact:** All Step 3 OpenAI features fail with authentication error.

**Solution:** Integrate withAuth with existing Supabase session mechanism.

**Priority:** HIGH - Core feature completely broken for authenticated users.

---

**Audit by:** Claude Code Assistant
**Recommendation:** Implement Option 1 to properly integrate with Supabase auth
**Next Step:** Modify security-wrappers.ts to use getSession() and resolveUserAndOrg()