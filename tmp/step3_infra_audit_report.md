# Infrastructure Audit Report: Step 3 Diagnoses & Clinical Assessment

**Date:** 2025-09-29
**Scope:** Infrastructure layer alignment with Domain (diagnoses-clinical) and Application (ports) contracts
**Focus:** Repository implementation, security/RLS, DTO mappings, multitenant isolation

---

## Executive Summary

### Status: ⚠️ **PENDING IMPLEMENTATION**

The Step 3 Infrastructure layer is **architecturally correct but not yet implemented**. All repository methods return `NOT_IMPLEMENTED` placeholders. The contracts are properly aligned between Port ↔ Repository, security wrappers are in place, and multitenant isolation patterns are correct.

**Key Findings:**
- ✅ **Port-Repository Contract:** Perfect alignment (signatures match)
- ✅ **Security Architecture:** Proper server-side auth, organization_id resolution
- ⚠️ **Implementation Status:** All DB operations are TODO placeholders
- ⚠️ **Database Schema:** No migrations found for Step 3 tables
- ⚠️ **RLS Policies:** Not yet created (blocked by missing tables)

**Next Steps:** Database wiring (schema + migrations + RLS) before repository implementation

---

## 1. Infrastructure Inventory

### 1.1 Files Discovered

| Path | Purpose | Status | LOC |
|------|---------|--------|-----|
| `src/modules/intake/infrastructure/repositories/diagnoses.repository.ts` | Repository implementation | ⚠️ Placeholder | 115 |
| `src/modules/intake/infrastructure/factories/diagnoses.factory.ts` | DI factory | ✅ Complete | 26 |
| `src/modules/intake/infrastructure/wrappers/security-wrappers.ts` | Auth/Security guards | ✅ Complete | 359 |
| `src/modules/intake/actions/step3/diagnoses.actions.ts` | Server actions | ✅ Complete | 205 |
| `supabase/migrations/` | Database schema | ❌ Missing Step 3 | - |

### 1.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                           UI Layer                           │
│   (Step3DiagnosesClinical.tsx)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Actions Layer                           │
│   (diagnoses.actions.ts)                                    │
│   • loadStep3Action()                                       │
│   • upsertDiagnosesAction()                                 │
│   ✅ Auth guard: resolveUserAndOrg()                         │
│   ✅ Generic error messages (no PHI)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ composes DI
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│   (usecases.ts)                                             │
│   • loadStep3(repo, sessionId, orgId)                       │
│   • upsertDiagnoses(repo, input, sessionId, orgId)          │
│   ✅ Business logic                                          │
│   ✅ Validation with Zod                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ uses port
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│   (DiagnosesRepositoryImpl)                                 │
│   ⚠️  findBySession() → NOT_IMPLEMENTED                      │
│   ⚠️  save() → NOT_IMPLEMENTED                               │
│   ⚠️  exists() → NOT_IMPLEMENTED                             │
│   ⚠️  delete() → NOT_IMPLEMENTED                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ queries
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database (Supabase)                     │
│   ❌ Table: diagnoses_clinical (not created)                 │
│   ❌ RLS Policies (not created)                              │
│   ❌ Indexes (not created)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Port ↔ Repository Contract Matrix

### 2.1 Interface Comparison

| Method | Port Signature | Repository Signature | Match? |
|--------|---------------|---------------------|--------|
| `findBySession` | `(sessionId: string, organizationId: string) => Promise<RepositoryResponse<Step3OutputDTO>>` | ✅ Identical | ✅ |
| `save` | `(sessionId: string, organizationId: string, input: Step3InputDTO) => Promise<RepositoryResponse<{ sessionId: string }>>` | ✅ Identical | ✅ |
| `exists` | `(sessionId: string, organizationId: string) => Promise<RepositoryResponse<{ exists: boolean }>>` | ✅ Identical | ✅ |
| `delete?` | `(sessionId: string, organizationId: string) => Promise<RepositoryResponse<{ deleted: boolean }>>` | ✅ Identical | ✅ |

**Status:** ✅ **Perfect contract alignment**

### 2.2 Type Alignment Analysis

#### RepositoryResponse Contract

**Status:** ✅ **Correct shape `{ ok, error }` - aligned with Application pattern**

#### Step3OutputDTO Alignment

**Alignment Issues:**
- ⚠️ **Field Name Mismatch:** Domain uses `stepId`, Application DTO doesn't include it in Step3OutputDTO
- ✅ **Section Schemas:** All match (diagnoses, psychiatricEvaluation, functionalAssessment)
- ✅ **Optional Fields:** `lastModified` and `completedAt` are optional in DTO (correct for exactOptionalPropertyTypes)

---

## 3. Multitenant Security Audit

### 3.1 organization_id Resolution

**Source:** `resolveUserAndOrg()` called in `diagnoses.actions.ts`

**Status:** ✅ **Server-side resolution** - organization_id obtained from authenticated session, not client input

### 3.2 Security Wrappers Analysis

#### withAuth Wrapper

**Key Security Features:**
- ✅ **Priority 1:** Supabase `auth.getUser()` (server-side validation)
- ✅ **Organization from profile:** Queries `user_profiles` table for user's org
- ✅ **Organization verification:** Confirms org exists in `organizations` table
- ⚠️ **Fallback:** Assigns first available org if user has no profile (temporary solution)
- ✅ **Dev mode:** Uses `opx_uid` cookie with fallbacks (dev only)

**Security Concerns:**
- ⚠️ **Fallback Assignment (Line 60-83):** If user has no org, assigns first available org
  - **Risk:** User could be assigned to wrong org in edge cases
  - **Priority:** P1 - Should enforce proper org membership before prod

#### withSecurity Wrapper

**Status:** ⚠️ **Placeholder TODOs**

**Security Gaps:**
- ⚠️ **No role-based access control (RBAC)** - All authenticated users have access
- ⚠️ **No HIPAA compliance checks** - BAA signing not verified
- ⚠️ **No permission granularity** - Cannot restrict by role (clinician vs admin)

**Priority:** P2 - Acceptable for MVP, required before production

#### withRateLimit Wrapper

**Status:** ✅ **Implemented with in-memory store**

**Configuration:** 10 requests per minute per organization

**Key Behavior:**
- ✅ **Organization-scoped:** Uses `diagnoses:${organizationId}` as key
- ✅ **Window-based:** 60-second rolling window
- ⚠️ **In-memory store:** Not persistent across restarts (use Redis in production)

**Priority:** P3 - Works for MVP, upgrade to Redis for production scalability

### 3.3 RLS Policy Status

**Finding:** ❌ **No Step 3 migrations found**

**Status:** ❌ **Blocking implementation** - Cannot implement repository without table and RLS

---

## 4. Query and DTO Mapping Analysis

### 4.1 Current Implementation Status

**Repository Methods:** All return placeholder responses with `NOT_IMPLEMENTED` error code

**Status:** ⚠️ **No queries to audit** - Implementation pending

### 4.2 Expected Query Patterns (When Implemented)

**Key Patterns:**
- ✅ Explicit `eq('organization_id', organizationId)` filters
- ✅ RLS policy will double-check organization_id
- ✅ Use `.maybeSingle()` for safe null returns

### 4.3 DTO Mapping Concerns (Future)

**When implementing DB queries, watch for:**

- **exactOptionalPropertyTypes Compliance:** Use conditional spreading (same pattern as mappers.ts)
- **JSON Column Serialization:** Store sections as JSONB, ensure optional fields omitted (not null)

---

## 5. Findings Classification

### P0 - Critical (Blocking Production)

#### P0.1: Missing Database Schema
**Severity:** 🔴 **CRITICAL - Blocking**

**Issue:** No database table for Step 3 clinical assessment data

**Impact:**
- Repository cannot be implemented
- No data persistence possible
- Blocks entire Step 3 functionality

**Required:**
- Table: `diagnoses_clinical` with JSONB columns
- Primary key: `(session_id, organization_id)`
- Indexes: On `organization_id`, `session_id`, `last_modified`

---

#### P0.2: Missing RLS Policies
**Severity:** 🔴 **CRITICAL - Security Risk**

**Issue:** No Row Level Security policies for Step 3 data

**Impact:**
- Data leakage between organizations
- Unauthorized access possible
- HIPAA violation risk

**Required:**
- SELECT/INSERT/UPDATE/DELETE policies filtering by organization_id

---

### P1 - High Priority (Pre-Production Required)

#### P1.1: Organization Assignment Fallback
**Severity:** 🟡 **HIGH - Security Concern**

**Location:** `security-wrappers.ts:60-83`

**Issue:** If user has no organization in profile, assigns first available organization

**Risk:** User could be assigned to wrong organization

**Recommendation:** Enforce proper user-organization membership setup, remove fallback

---

#### P1.2: No RBAC/Permission Checks
**Severity:** 🟡 **HIGH - Authorization Gap**

**Location:** `security-wrappers.ts:212-213`

**Issue:** All authenticated users have full access to Step 3

**Recommendation:** Implement role-based access control, restrict to authorized roles

---

#### P1.3: Missing HIPAA Compliance Checks
**Severity:** 🟡 **HIGH - Compliance Risk**

**Location:** `security-wrappers.ts:215-216`

**Issue:** No verification of BAA signing or HIPAA training

**Recommendation:** Add HIPAA compliance fields to user profiles, check in withSecurity

---

### P2 - Medium Priority (Production Nice-to-Have)

#### P2.1: In-Memory Rate Limiting
**Severity:** 🟢 **MEDIUM - Scalability**

**Issue:** Rate limiting uses in-memory Map, not persistent

**Recommendation:** Upgrade to Redis for distributed rate limiting

---

#### P2.2: Session ID Generation
**Severity:** 🟢 **MEDIUM - UX/Architecture**

**Issue:** Session ID hardcoded as `session_${userId}_intake`

**Recommendation:** Create proper session management with UUIDs

---

### P3 - Low Priority (Future Improvements)

#### P3.1: No Audit Logging in Repository
**Severity:** 🔵 **LOW - Compliance Enhancement**

**Recommendation:** Add audit logging to repository methods

---

#### P3.2: No Caching Strategy
**Severity:** 🔵 **LOW - Performance Optimization**

**Recommendation:** Implement Redis caching for reads

---

## 6. Proposed Micro-tasks (APPLY Phase)

### 6.1 P0.1: Create Database Schema Migration

**File to Create:** `supabase/migrations/002_create_diagnoses_clinical_table.sql`

**Includes:**
- Table creation with JSONB columns
- Composite primary key (session_id, organization_id)
- Indexes for performance
- Auto-update timestamp trigger

**Validation:**
- Run migration
- Verify table created
- Check indexes exist

---

### 6.2 P0.2: Create RLS Policies

**File to Create:** `supabase/migrations/003_create_diagnoses_clinical_rls.sql`

**Includes:**
- Enable RLS on table
- SELECT/INSERT/UPDATE/DELETE policies
- Organization membership checks
- Role-based delete restrictions

**Validation:**
- Test cross-org access (should be blocked)
- Test authenticated vs unauthenticated

---

### 6.3 P1.1: Remove Organization Fallback Assignment

**File:** `src/modules/intake/infrastructure/wrappers/security-wrappers.ts`

**Change:** Replace fallback logic with strict enforcement

**Validation:**
- User with no org should be rejected
- User with valid org should authenticate

---

### 6.4 P1.2: Implement RBAC in withSecurity

**File:** `src/modules/intake/infrastructure/wrappers/security-wrappers.ts`

**Change:** Add role-based permission checks

**Validation:**
- Clinician/Admin/Owner roles should have access
- Patient/Viewer roles should be denied

---

### 6.5 P1.3: Add HIPAA Compliance Checks

**File:** `src/modules/intake/infrastructure/wrappers/security-wrappers.ts`

**Change:** Verify BAA and training completion

**Prerequisite:** Add HIPAA columns to user_profiles table

**Validation:**
- Valid BAA + training should allow access
- Missing BAA/training should deny access

---

### 6.6 P2.1: Upgrade to Redis Rate Limiting

**Dependencies:** `ioredis`

**Change:** Replace in-memory Map with Redis

**Validation:**
- Rate limits persist across restarts
- Rate limits shared across instances

---

### 6.7 P2.2: Implement Proper Session Management

**Files:** Create session manager, update actions

**Change:** Generate UUIDs for session IDs

**Validation:**
- Each intake creates unique session
- Can support multiple concurrent sessions

---

### 6.8 P3.1: Add Audit Logging to Repository

**Change:** Add auditLog calls to all operations

**Validation:**
- All operations logged
- No PHI in logs

---

### 6.9 P3.2: Add Caching Layer

**Change:** Implement Redis caching for reads

**Validation:**
- Cache hit reduces DB load
- Cache invalidated on writes

---

## 7. Implementation Checklist

### Phase 1: Database Foundation (P0)
- [ ] Create `diagnoses_clinical` table migration (6.1)
- [ ] Create RLS policies (6.2)
- [ ] Verify RLS with multiple organizations
- [ ] Test authenticated vs unauthenticated access

### Phase 2: Repository Implementation (P0)
- [ ] Implement `findBySession()` with Supabase query
- [ ] Implement `save()` with upsert logic
- [ ] Implement `exists()` with count query
- [ ] Implement `delete()` with soft delete (optional)
- [ ] Add DTO mapping (DB rows → DTOs)
- [ ] Apply exactOptionalPropertyTypes pattern
- [ ] Verify TypeScript compilation passes
- [ ] Verify ESLint passes

### Phase 3: Security Hardening (P1)
- [ ] Remove organization fallback assignment (6.3)
- [ ] Implement RBAC in withSecurity (6.4)
- [ ] Add HIPAA compliance checks (6.5)
- [ ] Add HIPAA columns to user_profiles
- [ ] Verify only authorized roles have access
- [ ] Verify HIPAA compliance enforced

### Phase 4: Production Readiness (P2-P3)
- [ ] Upgrade to Redis rate limiting (6.6)
- [ ] Implement proper session management (6.7)
- [ ] Add audit logging to repository (6.8)
- [ ] Add Redis caching layer (6.9)
- [ ] Verify rate limits work across instances
- [ ] Verify sessions tracked independently
- [ ] Verify audit logs capture all operations

---

## 8. Risk Assessment

### High Risk Areas

1. **RLS Bypass Risk:** If policies not correctly configured
2. **Data Leakage Risk:** If organization_id not enforced
3. **PHI Exposure Risk:** If error messages contain clinical data

### Medium Risk Areas

1. **Cache Invalidation:** Stale data if cache not invalidated on writes
2. **Session Conflicts:** If session IDs not unique

---

## 9. Conclusion

### Summary

**Architecture:** ✅ **Excellent**
- Port-Repository contract perfectly aligned
- Proper separation of concerns
- Clean layer boundaries

**Security:** ⚠️ **Needs Hardening**
- ✅ Server-side auth
- ⚠️ RLS policies not yet created (blocking)
- ⚠️ Organization fallback needs fix (P1)
- ⚠️ No RBAC/HIPAA checks (P1)

**Implementation:** ❌ **Not Started**
- All repository methods are placeholders
- Blocked by missing database schema

**Contracts:** ✅ **Aligned**
- DTOs match between layers
- exactOptionalPropertyTypes patterns understood

### Recommended Path Forward

1. **Immediate (Week 1):** Database foundation
2. **Next (Week 2):** Repository implementation
3. **Then (Week 3):** Security hardening
4. **Finally (Week 4):** Production readiness

### Blockers

- ❌ **Database schema must be created first**
- ❌ **RLS policies must be tested**

### Ready to Proceed

Once database foundation is in place:
- ✅ Port contracts are ready
- ✅ Factory pattern is ready
- ✅ Actions layer is ready
- ✅ Security wrappers are ready (with P1 fixes)

---

**Report Generated:** 2025-09-29
**By:** Claude Code Assistant
**Status:** ✅ Audit Complete - Ready for APPLY phase