# Step 2 Database Audit - CHECK Constraints Report
**OrbiPax Community Mental Health System**
**Date**: 2025-09-29

---

## Objective

Obtain the exact definition of CHECK constraints on `orbipax_core.insurance_records` table,
specifically `insurance_records_carrier_check`, to ensure JSONB payloads comply with validation rules
for RLS test cases (Test 4 and Test 5).

---

## SQL Query for CHECK Constraints Audit

Execute this query in Supabase SQL Editor to retrieve all CHECK constraints:

```sql
-- CHECK constraints (includes carrier_check)
SELECT c.conname AS check_name,
       pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_class t  ON t.oid = c.conrelid
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'orbipax_core'
  AND t.relname = 'insurance_records'
  AND c.contype = 'c'
ORDER BY c.conname;
```

---

## Expected Output Format

| check_name | definition |
|------------|------------|
| insurance_records_carrier_check | CHECK (...) |
| insurance_records_other_check | CHECK (...) |

---

## Status

⏳ **Awaiting SQL Execution**: Query ready for execution in Supabase SQL Editor

### Next Steps
1. Execute the SQL query above in Supabase
2. Copy-paste the exact output (check_name and definition columns)
3. Update this report with actual constraint definitions
4. Generate compliant JSONB payloads for Test Case 4 and Test Case 5

---

## Placeholder for Actual Results

**NOTE**: This section will be updated once SQL query is executed.

```
-- Paste SQL output here

```

---

## Analysis (To Be Completed)

### Carrier Check Constraint
- **Constraint Name**: insurance_records_carrier_check
- **Definition**: [To be filled after SQL execution]
- **Allowed Values**: [To be extracted from definition]

### Other CHECK Constraints
[To be documented after SQL execution]

---

## Compliant JSONB Payload (To Be Generated)

Based on the CHECK constraints, the JSONB payload for Test Case 4 should be:

```sql
-- Example: Will be updated with actual constraint-compliant values
SELECT orbipax_core.upsert_insurance_with_primary_swap(
  'patient_a_uuid'::uuid,
  jsonb_build_object(
    'is_primary', false,
    'carrier_name', '<valid_carrier_from_check>',
    'policy_number', 'BCBS-12345',
    'plan_kind', '<valid_plan_kind>'
    -- Additional required fields based on NOT NULL constraints
  )
);
```

---

**Report Generated**: 2025-09-29
**Author**: Claude Code (Sonnet 4.5)
**Project**: OrbiPax - Step 2 DB Constraints Audit
**Classification**: Internal Database Schema Documentation
