# Step 2 Multitenant Security - RLS Verification Report
**OrbiPax Community Mental Health System**
**Date**: 2025-09-29

---

## Executive Summary

**Status**: RLS Test Plan DOCUMENTED - Ready for SQL Execution
**Objective**: Verify Row Level Security (RLS) isolation for Step 2 Insurance & Eligibility
**Scope**: `v_patient_insurance_eligibility_snapshot` view + `upsert_insurance_with_primary_swap` RPC
**Security Model**: Multitenant with `organization_id` isolation via JWT claims

## Architecture Context

### Multitenant Security Model
- **Isolation Level**: Organization-based (tenant = organization_id)
- **Auth Provider**: Supabase with JWT claims
- **RLS Pattern**: WHERE organization_id = jwt_organization_id() on all patient data
- **SECURITY INVOKER**: Functions run with caller's permissions (RLS applied)
- **No Cross-Tenant Access**: Tenant A must NEVER see/modify Tenant B data

### Objects Under Test

#### 1. View: v_patient_insurance_eligibility_snapshot
- **Schema**: orbipax_core
- **Purpose**: READ snapshot of insurance + eligibility data for patient
- **Expected Behavior**:
  - SECURITY INVOKER flag ON
  - WHERE clause filters by organization_id = jwt_organization_id()
  - Returns 0 rows for patient_id from different organization

#### 2. RPC Function: upsert_insurance_with_primary_swap
- **Schema**: orbipax_core
- **Signature**: (p_patient_id UUID, p_record JSONB) RETURNS UUID
- **Purpose**: WRITE insurance coverage with atomic primary swap logic
- **Expected Behavior**:
  - SECURITY INVOKER flag ON
  - Respects RLS on patient_insurance table
  - Rejects cross-tenant writes with RLS error (42501)

## Test Scenarios

### Test Case 1: READ - Cross-Tenant View Access (NEGATIVE TEST)

**Scenario**: Tenant A attempts to query Patient B's insurance snapshot

**Setup JWT Context** (Tenant A):
```sql
SELECT set_config('request.jwt.claims', '{"organization_id":"tenant_a_uuid"}', false);
```

**Test Query**:
```sql
SELECT id, organization_id, completion_status
FROM orbipax_core.v_patient_insurance_eligibility_snapshot
WHERE patient_id = 'patient_b_uuid'::uuid;  -- Patient B belongs to Tenant B
```

**Expected Result**:
- **Row Count**: 0 (zero rows returned)
- **Reason**: RLS policy filters out records where organization_id != jwt_organization_id()
- **Error**: NONE (silent filter, not permission denied)

**PASS Criteria**: Query returns no rows, no error

**FAIL Criteria**: Query returns data from Patient B (RLS BREACH)

### Test Case 2: READ - Same-Tenant View Access (POSITIVE CONTROL)

**Scenario**: Tenant A queries its own Patient A's insurance snapshot

**Setup JWT Context** (Tenant A):
```sql
SELECT set_config('request.jwt.claims', '{"organization_id":"tenant_a_uuid"}', false);
```

**Test Query**:
```sql
SELECT id, organization_id, completion_status
FROM orbipax_core.v_patient_insurance_eligibility_snapshot
WHERE patient_id = 'patient_a_uuid'::uuid;  -- Patient A belongs to Tenant A
```

**Expected Result**:
- **Row Count**: 1 (one row returned)
- **organization_id**: tenant_a_uuid (matches JWT context)
- **Error**: NONE

**PASS Criteria**: Query returns expected row with correct data

**FAIL Criteria**: Query returns no rows or wrong organization_id

### Test Case 3: WRITE - Cross-Tenant RPC Call (NEGATIVE TEST)

**Scenario**: Tenant A attempts to write insurance record for Patient B via RPC

**Setup JWT Context** (Tenant A):
```sql
SELECT set_config('request.jwt.claims', '{"organization_id":"tenant_a_uuid"}', false);
```

**Test Query**:
```sql
SELECT orbipax_core.upsert_insurance_with_primary_swap(
  'patient_b_uuid'::uuid,  -- Patient B belongs to Tenant B
  jsonb_build_object(
    'is_primary', false,
    'carrier_name', 'Test Carrier',
    'policy_number', 'ATTACK-001'
  )
);
```

**Expected Result**:
- **Error Code**: 42501 (insufficient_privilege - RLS policy violation)
- **Error Message**: Generic like "Access denied" or "new row violates row-level security policy"
- **Return Value**: NONE (exception thrown)

**PASS Criteria**: Query fails with RLS error (42501), no UUID returned

**FAIL Criteria**: Query succeeds and returns UUID (RLS BREACH - CRITICAL)

### Test Case 4: WRITE - Same-Tenant RPC Call (POSITIVE CONTROL)

**Scenario**: Tenant A writes insurance record for its own Patient A via RPC

**Setup JWT Context** (Tenant A):
```sql
SELECT set_config('request.jwt.claims', '{"organization_id":"tenant_a_uuid"}', false);
```

**Test Query**:
```sql
SELECT orbipax_core.upsert_insurance_with_primary_swap(
  'patient_a_uuid'::uuid,  -- Patient A belongs to Tenant A
  jsonb_build_object(
    'is_primary', false,
    'carrier_name', 'Blue Cross',
    'policy_number', 'BCBS-12345',
    'plan_kind', 'ppo'
  )
);
```

**Expected Result**:
- **Return Value**: UUID of inserted/updated insurance record
- **Error**: NONE

**PASS Criteria**: RPC returns UUID successfully

**FAIL Criteria**: RPC fails with error

### Test Case 5: WRITE - No JWT Context (NEGATIVE TEST)

**Scenario**: Attempt to call RPC without JWT context

**Setup JWT Context** (Clear JWT):
```sql
SELECT set_config('request.jwt.claims', NULL, false);
```

**Test Query**:
```sql
SELECT orbipax_core.upsert_insurance_with_primary_swap(
  'patient_a_uuid'::uuid,
  jsonb_build_object('carrier_name', 'Anon Attack')
);
```

**Expected Result**:
- **Error Code**: 42501 (insufficient_privilege) or permission denied
- **Reason**: RLS requires authenticated user with organization context

**PASS Criteria**: Query fails with permission error

**FAIL Criteria**: Query succeeds (authentication bypass - CRITICAL)

---

## Verification Checklist

### Execution Checklist
- [ ] Test Case 1 (READ cross-tenant) executed → PASS (0 rows)
- [ ] Test Case 2 (READ same-tenant) executed → PASS (1 row)
- [ ] Test Case 3 (WRITE cross-tenant) executed → PASS (42501 error)
- [ ] Test Case 4 (WRITE same-tenant) executed → PASS (UUID returned)
- [ ] Test Case 5 (WRITE no auth) executed → PASS (permission error)

---

## Expected Error Messages (Generic, PHI-Safe)

### RLS Violation Errors (PASS Scenarios)
- ✅ "new row violates row-level security policy for table insurance_records"
- ✅ "Access denied" (generic from mapPostgresError)
- ✅ "Session not found" (from repository layer)
- ✅ Postgres error code 42501 (insufficient_privilege)

### Breach Indicators (FAIL Scenarios)
- ❌ Query returns data from different organization_id
- ❌ RPC succeeds and returns UUID for cross-tenant patient
- ❌ Error messages expose PII (patient names, SSNs, etc.)

---

## Conclusion

### Summary
This report provides a comprehensive RLS test plan for Step 2 Insurance & Eligibility multitenant security. The test cases validate:
- ✅ READ isolation via v_patient_insurance_eligibility_snapshot view
- ✅ WRITE isolation via upsert_insurance_with_primary_swap RPC
- ✅ Generic error messages (no PII leakage)
- ✅ Authentication enforcement
- ✅ Cross-tenant access prevention

### Next Steps
1. **Execute SQL Tests**: Run all 5 test cases in Supabase SQL Editor
2. **Document Actual Results**: Update report with real query outputs
3. **Generate Verdict**: PASS (production-ready) or FAIL (requires fix)

### Final Status
⏳ **Awaiting SQL Execution**: Test plan documented, ready for validation

---

**Report Generated**: 2025-09-29
**Author**: Claude Code (Sonnet 4.5)
**Project**: OrbiPax Community Mental Health System - Step 2 RLS Audit
**Classification**: Internal Security Assessment
