# README_GUARDRAILS.md - OrbiPax Clinical Development Workflow

## Purpose

This document establishes development guardrails and workflow protocols for the OrbiPax Community Mental Health platform. These guardrails ensure HIPAA compliance, clinical safety, and architectural consistency throughout the development process.

## Development Workflow Overview

### Standard Clinical Development Flow
```
CLINICAL_REQUIREMENT → AUDIT → COMPLIANCE_REVIEW → APPLY → CLINICAL_VALIDATION → DEPLOYMENT
```

### Daily Development Protocol
1. **AGENT_HEADER**: Include clinical context in all development sessions
2. **AUDIT**: Complete comprehensive pre-development audit
3. **APPLY**: Implement changes following established clinical patterns
4. **VALIDATE**: Verify clinical workflow accuracy and compliance
5. **DOCUMENT**: Report all work in `/tmp` with clinical context

## Pre-Development Guardrails

### Mandatory AUDIT Phase
**Before any clinical development work:**
- [ ] Complete `SENTINEL_PRECHECKLIST.md` audit
- [ ] Search existing clinical modules and patterns
- [ ] Verify HIPAA compliance requirements
- [ ] Confirm organization boundary enforcement
- [ ] Validate clinical workflow accuracy needs
- [ ] Document audit findings in `/tmp`

### Clinical Context Validation
**Every development task must include:**
- [ ] Clinical workflow impact assessment
- [ ] Provider role and permission requirements
- [ ] Patient safety consideration evaluation
- [ ] HIPAA compliance verification
- [ ] Organization multi-tenancy validation
- [ ] Regulatory requirement confirmation

## Architecture Guardrails

### Layer Boundary Enforcement
```
UI Layer (Presentation Only)
├── No clinical business logic
├── No direct data fetching
├── Props and callbacks only
├── Semantic Tailwind v4 tokens
└── Healthcare accessibility compliance

Application Layer (Clinical Orchestration)
├── Clinical workflow coordination
├── Provider role validation
├── Organization boundary enforcement
├── Clinical data validation (Zod)
└── Audit trail generation

Domain Layer (Clinical Rules)
├── Clinical business rules
├── Patient safety requirements
├── Healthcare regulatory compliance
├── Clinical data models
└── Clinical workflow definitions

Infrastructure Layer (External Services)
├── Database and clinical data persistence
├── Healthcare system integrations
├── Audit logging and compliance reporting
├── PHI encryption and security
└── Regulatory reporting services
```

### Clinical Module Isolation
- **Prohibited**: Direct cross-module clinical data access
- **Required**: Clinical workflow integration through application services
- **Mandatory**: Organization boundary enforcement in all modules
- **Essential**: Clinical role validation for all healthcare functions

## Security and Compliance Guardrails

### HIPAA Compliance Requirements
```typescript
// Mandatory security wrapper order for clinical endpoints
withAuth → withSecurity → withRateLimit → withAudit → withIdempotency

// Required for all clinical data operations
const clinicalAction = withAudit(
  withAuth(
    withSecurity(
      withRateLimit(
        withIdempotency(async (clinicalData: ClinicalDataInput) => {
          // Clinical workflow implementation
          // Must include organization filtering
          // Must validate provider permissions
          // Must log clinical data access
        })
      )
    )
  )
);
```

### PHI Protection Guardrails
- **Prohibited**: PHI in logs, telemetry, console output, or error messages
- **Required**: PHI encryption at rest and in transit
- **Mandatory**: Clinical data access logging with provider identity
- **Essential**: Organization-based data filtering for all clinical queries

### Multi-Tenant Organization Guardrails
```sql
-- All clinical data queries must include organization filtering
SELECT * FROM patients
WHERE organization_id = current_setting('app.current_organization_id');

-- Row Level Security (RLS) policies required for all clinical tables
CREATE POLICY patient_organization_policy ON patients
    FOR ALL TO authenticated
    USING (organization_id = current_setting('app.current_organization_id'));
```

## Clinical Development Guardrails

### Clinical Workflow Validation
- **Pre-Implementation**: Clinical workflow accuracy review by healthcare staff
- **During Development**: Continuous clinical safety and compliance validation
- **Post-Implementation**: Clinical workflow testing with realistic scenarios
- **Production**: Clinical monitoring and compliance reporting

### Provider Role and Permission Guardrails
```typescript
// Required provider role validation pattern
const validateProviderAccess = async (
  providerId: string,
  clinicalAction: ClinicalActionType,
  organizationId: string
): Promise<boolean> => {
  // Validate provider role for clinical action
  // Confirm organization membership
  // Check clinical credentials and scope
  // Log access attempt for audit trail
};
```

### Clinical Data Validation Guardrails
```typescript
// Mandatory Zod validation for all clinical inputs
const PatientDataSchema = z.object({
  // Patient demographics with HIPAA compliance
  firstName: z.string().min(1, "Patient first name required"),
  lastName: z.string().min(1, "Patient last name required"),
  dateOfBirth: z.date().max(new Date(), "Birth date cannot be in future"),
  // Organization boundary enforcement
  organizationId: z.string().uuid("Valid organization ID required"),
  // Clinical data with validation
  medicalRecordNumber: z.string().optional(),
  primaryProvider: z.string().uuid().optional(),
});
```

## Code Quality Guardrails

### TypeScript Strict Mode Requirements
- **No `any` types**: All clinical data must be properly typed
- **Explicit return types**: All clinical functions must specify return types
- **Exact optional properties**: Use `exactOptionalPropertyTypes: true`
- **Strict null checks**: Prevent clinical data corruption from undefined values

### Clinical UI/UX Guardrails
```css
/* Semantic Tailwind v4 tokens for clinical status */
@theme {
  --color-critical: oklch(0.62 0.22 25);     /* Medical emergencies */
  --color-warning: oklch(0.75 0.15 85);      /* Clinical caution */
  --color-normal: oklch(0.65 0.15 145);      /* Normal clinical status */
  --color-info: oklch(0.55 0.15 250);        /* Clinical information */
}

/* Healthcare accessibility requirements */
.clinical-interactive {
  min-height: 44px; /* Touch target minimum */
  min-width: 44px;
  @apply focus:ring-2 focus:ring-focus focus:ring-offset-2;
}
```

### Clinical Form Validation Guardrails
- **Required field indicators**: Clear visual indicators for mandatory clinical data
- **Clinical error messaging**: Healthcare-specific error messages and guidance
- **Auto-save capability**: Prevent clinical data loss during documentation
- **Clinical workflow validation**: Ensure forms support clinical processes
- **Provider efficiency optimization**: Minimize clinical documentation burden

## Testing and Validation Guardrails

### Clinical Testing Requirements
```typescript
// Clinical workflow testing template
describe('Clinical Workflow: Patient Appointment Scheduling', () => {
  beforeEach(async () => {
    // Set up clinical test environment with organization isolation
    await setupClinicalTestEnvironment();
    await createTestOrganization();
    await createTestProviders();
  });

  test('should validate provider permissions for appointment creation', async () => {
    // Test clinical role validation
    // Verify organization boundary enforcement
    // Confirm audit trail generation
  });

  test('should handle clinical workflow edge cases safely', async () => {
    // Test patient safety scenarios
    // Validate clinical error handling
    // Confirm provider notification requirements
  });
});
```

### Clinical Compliance Testing
- **HIPAA Compliance**: Automated PHI protection and audit trail testing
- **Organization Isolation**: Multi-tenant boundary enforcement validation
- **Clinical Role Validation**: Provider permission and access control testing
- **Patient Safety**: Clinical workflow safety and error prevention testing
- **Regulatory Compliance**: Healthcare regulation adherence verification

## Incident Response Guardrails

### Clinical Emergency Response Protocol
```
1. IMMEDIATE ASSESSMENT
   ├── Patient safety impact evaluation
   ├── Clinical workflow disruption assessment
   ├── Provider notification requirements
   └── PHI exposure risk evaluation

2. CONTAINMENT AND STABILIZATION
   ├── System isolation and access control
   ├── Clinical workflow backup activation
   ├── Provider communication and guidance
   └── Patient care continuity measures

3. INVESTIGATION AND REPORTING
   ├── Root cause analysis with clinical context
   ├── HIPAA breach assessment and reporting
   ├── Regulatory notification requirements
   └── Clinical quality impact evaluation

4. RECOVERY AND VALIDATION
   ├── System restoration with clinical verification
   ├── Clinical workflow accuracy confirmation
   ├── Provider training and communication
   └── Compliance monitoring and reporting
```

### HIPAA Breach Response Guardrails
- **Immediate PHI Containment**: Stop PHI exposure and secure affected systems
- **Breach Impact Assessment**: Evaluate scope, severity, and patient impact
- **Regulatory Notification**: Follow HIPAA breach notification timeline requirements
- **Provider Communication**: Inform clinical staff of breach and response measures
- **Corrective Implementation**: Deploy preventive measures and monitoring

## Monitoring and Compliance Guardrails

### Clinical Monitoring Requirements
```typescript
// Clinical activity monitoring pattern
const logClinicalActivity = async (activity: ClinicalActivity) => {
  await auditLogger.log({
    activityType: activity.type,
    providerId: activity.providerId,
    patientId: activity.patientId, // Encrypted
    organizationId: activity.organizationId,
    timestamp: new Date(),
    clinicalContext: activity.context,
    complianceFlags: activity.complianceValidation
  });
};
```

### Compliance Monitoring Guardrails
- **Continuous HIPAA Monitoring**: Automated PHI protection and access control validation
- **Clinical Quality Metrics**: Provider workflow efficiency and clinical outcome tracking
- **Regulatory Compliance Reporting**: Automated compliance report generation
- **Audit Trail Integrity**: Continuous audit log validation and tamper detection
- **Provider Activity Monitoring**: Clinical staff access and workflow pattern analysis

## Development Environment Guardrails

### Local Development Requirements
- **Organization Isolation Testing**: Multi-tenant development environment setup
- **PHI Protection**: No real patient data in development environments
- **Clinical Workflow Simulation**: Realistic clinical scenario testing
- **Provider Role Testing**: Clinical role and permission validation
- **Compliance Validation**: Local HIPAA compliance checking tools

### Production Deployment Guardrails
- **Clinical Safety Verification**: Pre-deployment clinical workflow validation
- **HIPAA Compliance Confirmation**: Comprehensive compliance audit before release
- **Provider Training Preparation**: Clinical staff training materials and guidance
- **Regulatory Documentation**: Compliance documentation updates and submissions
- **Emergency Response Readiness**: Incident response and clinical continuity procedures

## Quality Assurance Checklist

### Pre-Deployment Clinical Validation
- [ ] Clinical workflow accuracy confirmed by healthcare professionals
- [ ] Provider role and permission validation tested thoroughly
- [ ] Patient safety considerations addressed and validated
- [ ] HIPAA compliance verified through comprehensive audit
- [ ] Organization boundary enforcement tested with multi-tenant scenarios
- [ ] Clinical documentation and audit trail generation verified
- [ ] Regulatory requirements confirmed and documented
- [ ] Provider training materials prepared and reviewed
- [ ] Emergency response procedures validated and tested
- [ ] Clinical monitoring and compliance reporting activated

### Post-Deployment Monitoring
- [ ] Clinical workflow performance and accuracy monitoring
- [ ] Provider feedback collection and analysis
- [ ] Patient safety incident tracking and response
- [ ] HIPAA compliance continuous monitoring
- [ ] Regulatory requirement adherence verification
- [ ] Clinical quality metrics tracking and reporting
- [ ] Audit trail integrity and completeness validation
- [ ] Organization isolation and security boundary verification
- [ ] Provider training effectiveness assessment
- [ ] Compliance documentation maintenance and updates

## Continuous Improvement Protocol

### Clinical Feedback Integration
- **Provider Workflow Optimization**: Regular clinical staff feedback collection
- **Patient Safety Enhancement**: Continuous safety improvement implementation
- **Regulatory Compliance Updates**: Healthcare regulation change adaptation
- **Clinical Quality Improvement**: Ongoing clinical outcome optimization
- **Provider Training Enhancement**: Continuous education and skill development

### Technical Improvement Guardrails
- **Architecture Evolution**: Gradual improvement while maintaining clinical safety
- **Performance Optimization**: Clinical workflow efficiency enhancement
- **Security Enhancement**: Continuous HIPAA compliance and PHI protection improvement
- **Scalability Planning**: Multi-tenant and organization growth accommodation
- **Integration Improvement**: Healthcare system interoperability enhancement