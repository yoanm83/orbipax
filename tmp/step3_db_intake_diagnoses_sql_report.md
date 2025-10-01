# Step 3 Database SQL Script Report
## Table intake_diagnoses with RLS for Multi-tenant Clinical Data

**Date**: 2025-09-28
**Task**: Create SQL script for intake_diagnoses table with RLS policies
**Status**: ✅ READY FOR EXECUTION

---

## Executive Summary

Complete SQL script for Step 3 clinical assessment data persistence:
- ✅ **Table Structure**: intake_diagnoses with JSONB for complex data
- ✅ **Primary Key**: Composite (session_id, organization_id) for multi-tenancy
- ✅ **Indexes**: Organization and timestamp indexes for performance
- ✅ **RLS Policies**: 4 policies ensuring organization isolation
- ✅ **Rollback Script**: Safe DROP statements included
- ✅ **Supabase Ready**: Compatible with Supabase PostgreSQL 15+

---

## 1. COMPLETE SQL SCRIPT

```sql
-- ============================================================================
-- STEP 3: DIAGNOSES & CLINICAL EVALUATION TABLE
-- OrbiPax Intake Module - Multi-tenant Clinical Assessment Storage
--
-- Purpose: Store clinical diagnoses, psychiatric evaluations, and functional
--          assessments for patient intake workflow Step 3.
--
-- Security: Row-Level Security (RLS) enforced by organization_id
-- Pattern: Follows intake_demographics and intake_insurance structure
-- ============================================================================

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.intake_diagnoses (
    -- Primary key components (composite for multi-tenancy)
    session_id text NOT NULL,
    organization_id text NOT NULL,

    -- Clinical data stored as JSONB for flexibility
    -- Expected shape:
    -- {
    --   "diagnoses": {
    --     "primaryDiagnosis": "string",
    --     "secondaryDiagnoses": ["string"],
    --     "substanceUseDisorder": "yes|no|unknown",
    --     "mentalHealthHistory": "string",
    --     "diagnosisRecords": [
    --       {
    --         "code": "string (ICD-10/DSM-5)",
    --         "description": "string",
    --         "diagnosisType": "primary|secondary|ruled-out|provisional|differential",
    --         "severity": "mild|moderate|severe|unspecified",
    --         "diagnosisDate": "ISO date string",
    --         "onsetDate": "ISO date string",
    --         "verifiedBy": "string",
    --         "isBillable": boolean,
    --         "notes": "string"
    --       }
    --     ]
    --   },
    --   "psychiatricEvaluation": {
    --     "currentSymptoms": ["string"],
    --     "severityLevel": "mild|moderate|severe|critical|unknown",
    --     "suicidalIdeation": boolean,
    --     "homicidalIdeation": boolean,
    --     "psychoticSymptoms": boolean,
    --     "medicationCompliance": "good|fair|poor|non-compliant|not-applicable",
    --     "treatmentHistory": "string",
    --     "hasPsychEval": boolean,
    --     "evaluationDate": "ISO date string",
    --     "evaluatedBy": "string",
    --     "evaluationSummary": "string"
    --   },
    --   "functionalAssessment": {
    --     "affectedDomains": ["mobility|self-care|getting-along|life-activities|participation|cognition"],
    --     "adlsIndependence": "yes|no|partial|unknown",
    --     "iadlsIndependence": "yes|no|partial|unknown",
    --     "cognitiveFunctioning": "intact|mild-impairment|moderate-impairment|severe-impairment|unknown",
    --     "hasSafetyConcerns": boolean,
    --     "globalFunctioning": number (0-100 GAF score),
    --     "dailyLivingActivities": ["string"],
    --     "socialFunctioning": "good|fair|poor|very-poor|unknown",
    --     "occupationalFunctioning": "employed|unemployed|disabled|retired|student|other",
    --     "cognitiveStatus": "oriented|confused|disoriented|comatose",
    --     "adaptiveBehavior": "string",
    --     "additionalNotes": "string"
    --   }
    -- }
    diagnoses_data jsonb NOT NULL DEFAULT '{}'::jsonb,

    -- Audit timestamps
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),

    -- Optional completion timestamp (when step is finalized)
    completed_at timestamptz NULL,

    -- Add composite primary key constraint
    CONSTRAINT intake_diagnoses_pkey PRIMARY KEY (session_id, organization_id)
);

-- Add comment to table
COMMENT ON TABLE public.intake_diagnoses IS
'Stores Step 3 clinical assessment data for patient intake including diagnoses, psychiatric evaluation, and functional assessment. Multi-tenant with RLS by organization_id.';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on organization_id for RLS filtering and tenant queries
CREATE INDEX IF NOT EXISTS idx_intake_diagnoses_org
ON public.intake_diagnoses(organization_id);

-- Index on updated_at for recent records and audit queries
CREATE INDEX IF NOT EXISTS idx_intake_diagnoses_updated_at
ON public.intake_diagnoses(updated_at DESC);

-- Index on completed_at for workflow status queries
CREATE INDEX IF NOT EXISTS idx_intake_diagnoses_completed_at
ON public.intake_diagnoses(completed_at DESC)
WHERE completed_at IS NOT NULL;

-- Index on session_id for single session lookups
CREATE INDEX IF NOT EXISTS idx_intake_diagnoses_session
ON public.intake_diagnoses(session_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE public.intake_diagnoses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS intake_diagnoses_select_policy ON public.intake_diagnoses;
DROP POLICY IF EXISTS intake_diagnoses_insert_policy ON public.intake_diagnoses;
DROP POLICY IF EXISTS intake_diagnoses_update_policy ON public.intake_diagnoses;
DROP POLICY IF EXISTS intake_diagnoses_delete_policy ON public.intake_diagnoses;

-- Policy for SELECT: Users can only see records from their organization
CREATE POLICY intake_diagnoses_select_policy
ON public.intake_diagnoses
FOR SELECT
USING (
    organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'
);

-- Policy for INSERT: Users can only insert records for their organization
CREATE POLICY intake_diagnoses_insert_policy
ON public.intake_diagnoses
FOR INSERT
WITH CHECK (
    organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'
);

-- Policy for UPDATE: Users can only update records from their organization
CREATE POLICY intake_diagnoses_update_policy
ON public.intake_diagnoses
FOR UPDATE
USING (
    organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'
)
WITH CHECK (
    organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'
);

-- Policy for DELETE: Users can only delete records from their organization
CREATE POLICY intake_diagnoses_delete_policy
ON public.intake_diagnoses
FOR DELETE
USING (
    organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'
);

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_intake_diagnoses_updated_at ON public.intake_diagnoses;
CREATE TRIGGER update_intake_diagnoses_updated_at
BEFORE UPDATE ON public.intake_diagnoses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- GRANTS (Adjust based on your Supabase roles)
-- ============================================================================

-- Grant access to authenticated users (adjust as needed)
GRANT ALL ON public.intake_diagnoses TO authenticated;
GRANT ALL ON public.intake_diagnoses TO service_role;

-- Grant usage on any sequences (if needed in future)
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

---

## 2. ROLLBACK SCRIPT

```sql
-- ============================================================================
-- ROLLBACK SCRIPT - Use with caution in production
-- ============================================================================

-- Disable RLS first
ALTER TABLE IF EXISTS public.intake_diagnoses DISABLE ROW LEVEL SECURITY;

-- Drop policies
DROP POLICY IF EXISTS intake_diagnoses_select_policy ON public.intake_diagnoses;
DROP POLICY IF EXISTS intake_diagnoses_insert_policy ON public.intake_diagnoses;
DROP POLICY IF EXISTS intake_diagnoses_update_policy ON public.intake_diagnoses;
DROP POLICY IF EXISTS intake_diagnoses_delete_policy ON public.intake_diagnoses;

-- Drop trigger
DROP TRIGGER IF EXISTS update_intake_diagnoses_updated_at ON public.intake_diagnoses;

-- Drop indexes
DROP INDEX IF EXISTS idx_intake_diagnoses_org;
DROP INDEX IF EXISTS idx_intake_diagnoses_updated_at;
DROP INDEX IF EXISTS idx_intake_diagnoses_completed_at;
DROP INDEX IF EXISTS idx_intake_diagnoses_session;

-- Drop table (THIS WILL DELETE ALL DATA - USE WITH EXTREME CAUTION)
DROP TABLE IF EXISTS public.intake_diagnoses CASCADE;

-- Note: The update_updated_at_column() function is shared, don't drop it
-- unless you're sure no other tables use it
```

---

## 3. INDEX RATIONALE

### idx_intake_diagnoses_org
- **Purpose**: Speed up RLS filtering by organization_id
- **Usage**: Every query will filter by organization_id due to RLS
- **Impact**: Critical for multi-tenant performance

### idx_intake_diagnoses_updated_at
- **Purpose**: Support queries for recent changes
- **Usage**: Audit trails, sync operations, recent activity dashboards
- **Order**: DESC for typical "most recent first" queries

### idx_intake_diagnoses_completed_at
- **Purpose**: Find completed assessments efficiently
- **Usage**: Workflow status reports, completion metrics
- **Partial**: Only indexes non-NULL values to save space

### idx_intake_diagnoses_session
- **Purpose**: Fast single-session lookups
- **Usage**: Loading specific patient session data
- **Complement**: Works with composite PK for optimal access

---

## 4. RLS POLICY DETAILS

### Security Model
All policies use the same condition:
```sql
organization_id = current_setting('request.jwt.claims', true)::json->>'organization_id'
```

### JWT Claim Requirement
The JWT token must include:
```json
{
  "claims": {
    "organization_id": "org_uuid_here"
  }
}
```

### Testing RLS
```sql
-- Set the claim for testing (in Supabase SQL editor)
SET request.jwt.claims = '{"organization_id": "test-org-123"}';

-- Test SELECT
SELECT * FROM public.intake_diagnoses;
-- Should only see records where organization_id = 'test-org-123'

-- Test INSERT
INSERT INTO public.intake_diagnoses (session_id, organization_id, diagnoses_data)
VALUES ('test-session', 'test-org-123', '{}');
-- Should succeed

-- Try to INSERT for different org (should fail)
INSERT INTO public.intake_diagnoses (session_id, organization_id, diagnoses_data)
VALUES ('test-session', 'different-org', '{}');
-- Should fail with RLS violation
```

---

## 5. JSONB STRUCTURE NOTES

### Storage Efficiency
- JSONB compresses data and supports indexing
- Allows flexible schema evolution without migrations
- Supports partial updates via jsonb operators

### Query Examples
```sql
-- Get specific diagnosis code
SELECT diagnoses_data->'diagnoses'->'primaryDiagnosis'
FROM intake_diagnoses
WHERE session_id = 'xxx';

-- Check for safety concerns
SELECT * FROM intake_diagnoses
WHERE (diagnoses_data->'functionalAssessment'->>'hasSafetyConcerns')::boolean = true;

-- Update single field
UPDATE intake_diagnoses
SET diagnoses_data = jsonb_set(
    diagnoses_data,
    '{functionalAssessment,completedAt}',
    '"2025-09-28T10:00:00Z"'
)
WHERE session_id = 'xxx';
```

---

## 6. DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] Test script in development environment
- [ ] Verify JWT claims structure matches RLS expectations
- [ ] Confirm organization_id is available in auth context
- [ ] Review with DBA/DevOps team

### Deployment Steps
1. Run CREATE TABLE and INDEX statements
2. Enable RLS and create policies
3. Test with sample data
4. Verify RLS isolation between organizations
5. Monitor query performance

### Post-deployment
- [ ] Verify table exists: `SELECT * FROM intake_diagnoses LIMIT 0;`
- [ ] Check RLS enabled: `SELECT relrowsecurity FROM pg_class WHERE relname = 'intake_diagnoses';`
- [ ] Test insert/select with different organization_ids
- [ ] Monitor slow query logs

---

## 7. IMPORTANT SECURITY NOTES

### No PHI in Logs
- Never log diagnoses_data content
- Use generic error messages in application
- Mask sensitive fields in monitoring

### Audit Compliance
- updated_at tracks all modifications
- created_at provides audit trail
- Consider additional audit table for sensitive operations

### Backup Considerations
- JSONB data should be included in regular backups
- Test restore procedures include RLS policies
- Document retention policies per HIPAA requirements

---

## CONCLUSION

This SQL script provides:
- ✅ Complete table structure matching Step 1/2 patterns
- ✅ Comprehensive RLS policies for multi-tenant isolation
- ✅ Performance indexes for common query patterns
- ✅ Automatic timestamp updates via trigger
- ✅ Safe rollback procedures

**Ready for execution in Supabase SQL editor or migration system**

---

**Script Status**: COMPLETE
**Compatibility**: PostgreSQL 15+, Supabase
**Testing**: Required in staging before production
**Risk Level**: Low (follows established patterns)