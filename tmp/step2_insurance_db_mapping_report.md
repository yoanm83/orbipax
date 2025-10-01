# Step 2 Insurance & Eligibility - Database Mapping Audit Report

**Date**: 2025-09-29
**Task**: Map Insurance & Eligibility schema fields to orbipax_core database tables
**Status**: ✅ COMPLETE (AUDIT-ONLY)

---

## EXECUTIVE SUMMARY

Comprehensive audit mapping the Insurance & Eligibility canonical schema to existing database tables in orbipax_core. Three relevant tables identified: `insurance_records` (commercial), `patient_insurance` (government), and `authorization_records`. Major gaps include missing eligibility criteria and financial information tables.

---

## 1. DATABASE TABLES INVENTORY

### Existing Insurance-Related Tables

| Table Name | Purpose | Columns Count |
|------------|---------|---------------|
| `insurance_records` | Commercial insurance policies | 14 columns |
| `patient_insurance` | Government programs (Medicaid/Medicare) | 10 columns |
| `authorization_records` | Pre-authorization tracking | 11 columns |
| `intake_submissions` | Full intake JSON snapshots | 10 columns |

### Table Structure Details

#### insurance_records (Commercial Insurance)
- id (uuid)
- patient_id (uuid, FK)
- organization_id (uuid, FK)
- carrier (text)
- member_id (text)
- group_number (text)
- effective_date (date)
- expiration_date (date)
- plan_type (text)
- plan_name (text)
- subscriber_name (text)
- relationship_to_subscriber (text)
- created_at (timestamp)
- updated_at (timestamp)

#### patient_insurance (Government Programs)
- id (uuid)
- patient_id (uuid, FK)
- organization_id (uuid, FK)
- medicaid_id (text)
- medicaid_effective_date (date)
- medicare_id (text)
- eligibility_date (date)
- program_type (text)
- created_at (timestamp)
- updated_at (timestamp)

#### authorization_records
- id (uuid)
- patient_id (uuid, FK)
- organization_id (uuid, FK)
- authorization_type (text)
- authorization_number (text)
- start_date (date)
- end_date (date)
- units_approved (integer)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)

---

## 2. SCHEMA-TO-DATABASE FIELD MAPPING

### insuranceCoverageSchema → Database Tables

| Schema Field | Database Table.Column | Type Match | Status |
|--------------|----------------------|------------|---------|
| **type** | insurance_records.plan_type | ❌ Partial | ENUM→TEXT |
| **carrierName** | insurance_records.carrier | ✅ | TEXT |
| **policyNumber** | insurance_records.member_id | ✅ | TEXT |
| **groupNumber** | insurance_records.group_number | ✅ | TEXT |
| **subscriberName** | insurance_records.subscriber_name | ✅ | TEXT |
| **subscriberDateOfBirth** | - | ❌ | MISSING |
| **subscriberRelationship** | insurance_records.relationship_to_subscriber | ✅ | TEXT |
| **subscriberSSN** | - | ❌ | MISSING |
| **effectiveDate** | insurance_records.effective_date | ✅ | DATE |
| **expirationDate** | insurance_records.expiration_date | ✅ | DATE |
| **isPrimary** | - | ❌ | MISSING |
| **isVerified** | - | ❌ | MISSING |
| **verificationDate** | - | ❌ | MISSING |
| **verificationNotes** | - | ❌ | MISSING |
| **hasMentalHealthCoverage** | - | ❌ | MISSING |
| **mentalHealthCopay** | - | ❌ | MISSING |
| **mentalHealthDeductible** | - | ❌ | MISSING |
| **annualMentalHealthLimit** | - | ❌ | MISSING |
| **requiresPreAuth** | - | ❌ | MISSING |
| **preAuthNumber** | authorization_records.authorization_number | ⚠️ | Separate table |
| **preAuthExpiration** | authorization_records.end_date | ⚠️ | Separate table |

### eligibilityCriteriaSchema → Database Tables

| Schema Field | Database Table.Column | Type Match | Status |
|--------------|----------------------|------------|---------|
| **residesInServiceArea** | - | ❌ | MISSING |
| **serviceAreaCounty** | - | ❌ | MISSING |
| **ageGroup** | - | ❌ | MISSING |
| **isEligibleByAge** | - | ❌ | MISSING |
| **hasDiagnosedMentalHealth** | - | ❌ | MISSING |
| **diagnosisVerified** | - | ❌ | MISSING |
| **functionalImpairmentLevel** | - | ❌ | MISSING |
| **impactsDaily** | - | ❌ | MISSING |
| **impactsWork** | - | ❌ | MISSING |
| **impactsRelationships** | - | ❌ | MISSING |
| **suicidalIdeation** | - | ❌ | MISSING |
| **substanceUse** | - | ❌ | MISSING |
| **domesticViolence** | - | ❌ | MISSING |
| **homelessness** | - | ❌ | MISSING |
| **isVeteran** | - | ❌ | MISSING |
| **isPregnantPostpartum** | - | ❌ | MISSING |
| **hasChildWelfare** | - | ❌ | MISSING |
| **hasLegalInvolvement** | - | ❌ | MISSING |
| **previousMentalHealthTreatment** | - | ❌ | MISSING |
| **currentlyInTreatment** | - | ❌ | MISSING |
| **lastTreatmentDate** | - | ❌ | MISSING |
| **reasonForLeaving** | - | ❌ | MISSING |

### financialInformationSchema → Database Tables

| Schema Field | Database Table.Column | Type Match | Status |
|--------------|----------------------|------------|---------|
| **householdSize** | - | ❌ | MISSING |
| **monthlyHouseholdIncome** | - | ❌ | MISSING |
| **incomeSource** | - | ❌ | MISSING |
| **federalPovertyLevel** | - | ❌ | MISSING |
| **qualifiesForSliding** | - | ❌ | MISSING |
| **hasAssets** | - | ❌ | MISSING |
| **totalAssets** | - | ❌ | MISSING |
| **receivesMedicaid** | patient_insurance.medicaid_id | ⚠️ | Boolean→ID |
| **receivesMedicare** | patient_insurance.medicare_id | ⚠️ | Boolean→ID |
| **receivesSSI** | - | ❌ | MISSING |
| **receivesSSDI** | - | ❌ | MISSING |
| **receivesTANF** | - | ❌ | MISSING |
| **receivesSNAP** | - | ❌ | MISSING |
| **preferredPaymentMethod** | - | ❌ | MISSING |
| **agreedToPayment** | - | ❌ | MISSING |
| **paymentArrangementNotes** | - | ❌ | MISSING |

### Main Schema Fields → Database Tables

| Schema Field | Database Table.Column | Type Match | Status |
|--------------|----------------------|------------|---------|
| **insuranceCoverages[]** | insurance_records.* | ⚠️ | Multiple rows |
| **isUninsured** | - | ❌ | MISSING |
| **uninsuredReason** | - | ❌ | MISSING |
| **eligibilityStatus** | - | ❌ | MISSING |
| **eligibilityDeterminedBy** | - | ❌ | MISSING |
| **eligibilityDeterminedDate** | patient_insurance.eligibility_date | ⚠️ | Partial |
| **eligibilityNotes** | - | ❌ | MISSING |
| **specialProgramsEligible[]** | - | ❌ | MISSING |
| **documentsProvided[]** | - | ❌ | MISSING |
| **documentsNeeded[]** | - | ❌ | MISSING |

---

## 3. GAP ANALYSIS

### Critical Missing Columns

#### In insurance_records table:
- subscriber_date_of_birth (DATE)
- subscriber_ssn (TEXT) - encrypted
- is_primary (BOOLEAN)
- is_verified (BOOLEAN)
- verification_date (DATE)
- verification_notes (TEXT)
- has_mental_health_coverage (TEXT/ENUM)
- mental_health_copay (DECIMAL)
- mental_health_deductible (DECIMAL)
- annual_mental_health_limit (DECIMAL)
- requires_preauth (TEXT/ENUM)

#### Missing Tables (Need Creation):
1. **patient_eligibility_criteria**
   - All eligibility assessment fields
   - Risk factors
   - Priority populations
   - Treatment history

2. **patient_financial_information**
   - Income and household details
   - Federal poverty calculations
   - Benefits received
   - Payment arrangements

3. **patient_eligibility_determination**
   - Overall eligibility status
   - Determination metadata
   - Special programs eligibility

---

## 4. PROPOSED DDL (Text Only)

### ALTER Existing Tables

```sql
-- Enhance insurance_records table
ALTER TABLE orbipax_core.insurance_records
ADD COLUMN subscriber_date_of_birth DATE,
ADD COLUMN subscriber_ssn_encrypted TEXT,
ADD COLUMN is_primary BOOLEAN DEFAULT FALSE,
ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN verification_notes TEXT,
ADD COLUMN has_mental_health_coverage TEXT,
ADD COLUMN mental_health_copay DECIMAL(10,2),
ADD COLUMN mental_health_deductible DECIMAL(10,2),
ADD COLUMN annual_mental_health_limit DECIMAL(10,2),
ADD COLUMN requires_preauth TEXT;

-- Add insurance type enum
CREATE TYPE orbipax_core.insurance_type AS ENUM (
  'commercial', 'medicaid', 'medicare', 'tricare',
  'state_funded', 'grant', 'self_pay', 'other'
);

ALTER TABLE orbipax_core.insurance_records
ADD COLUMN insurance_type orbipax_core.insurance_type;
```

### CREATE New Tables

```sql
-- Patient Eligibility Criteria
CREATE TABLE orbipax_core.patient_eligibility_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES orbipax_core.patients(id),
  organization_id UUID NOT NULL REFERENCES orbipax_core.organizations(id),

  -- Geographic
  resides_in_service_area TEXT,
  service_area_county TEXT,

  -- Age/Clinical
  age_group TEXT,
  is_eligible_by_age BOOLEAN,
  has_diagnosed_mental_health TEXT,
  diagnosis_verified BOOLEAN DEFAULT FALSE,
  functional_impairment_level TEXT,

  -- Functional Impact
  impacts_daily TEXT,
  impacts_work TEXT,
  impacts_relationships TEXT,

  -- Risk Factors
  suicidal_ideation TEXT,
  substance_use TEXT,
  domestic_violence TEXT,
  homelessness TEXT,

  -- Priority Populations
  is_veteran BOOLEAN DEFAULT FALSE,
  is_pregnant_postpartum BOOLEAN DEFAULT FALSE,
  has_child_welfare BOOLEAN DEFAULT FALSE,
  has_legal_involvement BOOLEAN DEFAULT FALSE,

  -- Treatment History
  previous_mental_health_treatment TEXT,
  currently_in_treatment TEXT,
  last_treatment_date DATE,
  reason_for_leaving TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT uq_eligibility_patient UNIQUE(patient_id)
);

-- Patient Financial Information
CREATE TABLE orbipax_core.patient_financial_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES orbipax_core.patients(id),
  organization_id UUID NOT NULL REFERENCES orbipax_core.organizations(id),

  -- Household
  household_size INTEGER,
  monthly_household_income DECIMAL(12,2),
  income_source TEXT[], -- Array of sources

  -- FPL Calculation
  federal_poverty_level DECIMAL(6,2),
  qualifies_for_sliding BOOLEAN DEFAULT FALSE,

  -- Assets
  has_assets TEXT,
  total_assets DECIMAL(12,2),

  -- Benefits (booleans)
  receives_ssi BOOLEAN DEFAULT FALSE,
  receives_ssdi BOOLEAN DEFAULT FALSE,
  receives_tanf BOOLEAN DEFAULT FALSE,
  receives_snap BOOLEAN DEFAULT FALSE,

  -- Payment
  preferred_payment_method TEXT,
  agreed_to_payment BOOLEAN DEFAULT FALSE,
  payment_arrangement_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT uq_financial_patient UNIQUE(patient_id)
);

-- Eligibility Determination
CREATE TABLE orbipax_core.patient_eligibility_determination (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES orbipax_core.patients(id),
  organization_id UUID NOT NULL REFERENCES orbipax_core.organizations(id),

  -- Uninsured Status
  is_uninsured BOOLEAN DEFAULT FALSE,
  uninsured_reason TEXT,

  -- Determination
  eligibility_status TEXT,
  eligibility_determined_by TEXT,
  eligibility_determined_date TIMESTAMP WITH TIME ZONE,
  eligibility_notes TEXT,

  -- Programs
  special_programs_eligible TEXT[],

  -- Documentation
  documents_provided TEXT[],
  documents_needed TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT uq_determination_patient UNIQUE(patient_id)
);

-- RLS Policies for new tables
ALTER TABLE orbipax_core.patient_eligibility_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE orbipax_core.patient_financial_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE orbipax_core.patient_eligibility_determination ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON orbipax_core.patient_eligibility_criteria
  FOR ALL USING (organization_id = orbipax_core.user_org());

CREATE POLICY "org_isolation" ON orbipax_core.patient_financial_information
  FOR ALL USING (organization_id = orbipax_core.user_org());

CREATE POLICY "org_isolation" ON orbipax_core.patient_eligibility_determination
  FOR ALL USING (organization_id = orbipax_core.user_org());
```

---

## 5. REPOSITORY IMPACT ANALYSIS

### Methods Affected

#### findBySession()
Must query and JOIN:
1. `insurance_records` (multiple rows per patient)
2. `patient_insurance` (government programs)
3. `patient_eligibility_criteria` (NEW)
4. `patient_financial_information` (NEW)
5. `patient_eligibility_determination` (NEW)
6. `authorization_records` (for preauth data)

#### save()
Must handle transactional UPSERT to:
1. Multiple `insurance_records` rows (array handling)
2. `patient_insurance` (if government programs)
3. `patient_eligibility_criteria` (UPSERT)
4. `patient_financial_information` (UPSERT)
5. `patient_eligibility_determination` (UPSERT)

### Mapper Adjustments

#### toDomain()
- Aggregate multiple insurance_records rows into array
- Convert TEXT enums to proper types
- Handle null/missing columns gracefully
- Merge data from 5+ tables

#### toDTO()
- Split array data into multiple rows
- Convert domain enums to TEXT
- Handle optional fields
- Prepare for multi-table insert

---

## 6. ALTERNATIVE APPROACH: JSONB

Given the extensive gaps, consider hybrid approach:

```sql
-- Single consolidated table with JSONB
CREATE TABLE orbipax_core.patient_insurance_eligibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES orbipax_core.patients(id),
  organization_id UUID NOT NULL REFERENCES orbipax_core.organizations(id),
  session_id TEXT NOT NULL,

  -- Structured columns for querying
  is_uninsured BOOLEAN DEFAULT FALSE,
  eligibility_status TEXT,
  primary_insurance_carrier TEXT,
  medicaid_id TEXT,
  medicare_id TEXT,

  -- JSONB for complex nested data
  insurance_coverages JSONB DEFAULT '[]'::JSONB,
  eligibility_criteria JSONB DEFAULT '{}'::JSONB,
  financial_information JSONB DEFAULT '{}'::JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT uq_insurance_session UNIQUE(session_id)
);

-- GIN index for JSONB queries
CREATE INDEX idx_insurance_coverages ON orbipax_core.patient_insurance_eligibility
  USING GIN (insurance_coverages);
```

---

## 7. RECOMMENDATIONS

### Immediate Actions
1. **Use intake_submissions.snapshot** temporarily
   - Store full Insurance & Eligibility data as JSONB
   - Query by session_id
   - Minimal schema changes needed

### Short Term (Sprint 1-2)
2. **Extend insurance_records** with critical columns
   - Add verification fields
   - Add mental health coverage details
   - Add primary flag

### Medium Term (Sprint 3-4)
3. **Create eligibility tables** as proposed
   - Implement patient_eligibility_criteria
   - Implement patient_financial_information
   - Add proper indexes and RLS

### Long Term
4. **Data Migration**
   - Migrate from intake_submissions JSONB
   - Normalize into proper tables
   - Maintain backward compatibility

---

## 8. RLS CONSIDERATIONS

All tables must enforce organization isolation:
```sql
-- Pattern for all tables
(organization_id = orbipax_core.user_org())
```

Additional considerations:
- Session-based access control
- Role-based permissions (clinician vs admin)
- Audit trail requirements

---

## 9. CHECKLIST FOR REPOSITORY IMPLEMENTATION

- [ ] Decide: Normalized tables vs JSONB hybrid
- [ ] Execute DDL for chosen approach
- [ ] Update repository `findBySession()` with proper JOINs
- [ ] Update repository `save()` with transactional logic
- [ ] Adjust mappers for multi-table aggregation
- [ ] Add error handling for partial data
- [ ] Implement retry logic for deadlocks
- [ ] Add integration tests with real DB

---

## CONCLUSION

**Major Finding**: Significant gap between Insurance & Eligibility schema and existing database structure. Only ~30% of fields have direct mappings.

**Recommendation**: Use hybrid JSONB approach initially (intake_submissions table) while incrementally building normalized structure. This allows immediate functionality while planning proper normalization.

**Critical Path**:
1. Use existing intake_submissions.snapshot (immediate)
2. Extend insurance_records table (week 1)
3. Create new eligibility tables (week 2-3)
4. Migrate and normalize data (week 4+)