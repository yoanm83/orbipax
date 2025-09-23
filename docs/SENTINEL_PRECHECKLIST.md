# SENTINEL_PRECHECKLIST.md - OrbiPax Clinical Development

## Purpose

This checklist ensures comprehensive auditing before any clinical development work. All developers and AI assistants must complete this pre-development audit to maintain HIPAA compliance, clinical safety, and architectural consistency.

## MANDATORY: "SEARCH BEFORE CREATE" Protocol

### Phase 1: Clinical Module Discovery
```bash
# Search for existing clinical modules and components
find "D:\ORBIPAX-PROJECT\src\modules" -type f -name "*.ts" -o -name "*.tsx" | head -20
find "D:\ORBIPAX-PROJECT\src\shared" -type f -name "*.ts" -o -name "*.tsx" | head -15
```

**Clinical Module Audit:**
- [ ] Patients module: Patient demographics, medical history, care coordination
- [ ] Appointments module: Scheduling, provider availability, calendar management
- [ ] Notes module: Clinical documentation, progress notes, assessments
- [ ] Clinicians module: Provider management, credentials, roles
- [ ] Billing module: Claims processing, insurance verification, payments
- [ ] Auth module: Authentication, authorization, session management
- [ ] Admin module: System administration, user management
- [ ] Dashboard module: Aggregated clinical metrics and workflows

**Documentation Review:**
- [ ] `/docs/README.md` - Clinical documentation standards
- [ ] `/docs/ARCHITECTURE_CONTRACT.md` - Healthcare architecture rules
- [ ] `/CLAUDE.md` - Clinical development guidelines
- [ ] `/src/modules/README.md` - Module structure documentation

### Phase 2: Clinical Data and Schema Discovery
```bash
# Search for existing Zod schemas and validation
grep -r "z\." "D:\ORBIPAX-PROJECT\src" --include="*.ts" | head -10
find "D:\ORBIPAX-PROJECT\src" -name "*schema*" -type f
find "D:\ORBIPAX-PROJECT\src" -name "*validation*" -type f
```

**Clinical Schema Audit:**
- [ ] Patient data validation schemas
- [ ] Appointment and scheduling schemas
- [ ] Clinical note and documentation schemas
- [ ] Provider and clinician schemas
- [ ] Billing and insurance schemas
- [ ] Authentication and authorization schemas
- [ ] Multi-tenant organization schemas

**HIPAA Compliance Check:**
- [ ] PHI (Protected Health Information) handling patterns
- [ ] Organization boundary enforcement schemas
- [ ] Audit trail and logging schemas
- [ ] Role-based access control definitions
- [ ] Data encryption and security schemas

### Phase 3: Clinical UI Components and Patterns
```bash
# Search for existing UI components and patterns
find "D:\ORBIPAX-PROJECT\src\shared\ui" -type f -name "*.tsx" | head -15
grep -r "className.*text-" "D:\ORBIPAX-PROJECT\src" --include="*.tsx" | head -5
```

**Clinical UI Component Audit:**
- [ ] Patient form components and validation
- [ ] Appointment scheduling interfaces
- [ ] Clinical documentation templates
- [ ] Provider dashboard components
- [ ] Billing and insurance forms
- [ ] Clinical data display components
- [ ] Healthcare-specific navigation patterns

**Design System Compliance:**
- [ ] Semantic Tailwind v4 token usage
- [ ] Clinical status color patterns (critical, warning, normal, info)
- [ ] Healthcare accessibility requirements (WCAG 2.1 AA)
- [ ] Clinical form validation and error handling
- [ ] Provider-optimized touch targets and navigation

### Phase 4: Clinical Workflow and Integration Discovery
```bash
# Search for existing clinical workflows and integrations
grep -r "organization" "D:\ORBIPAX-PROJECT\src" --include="*.ts" | head -10
grep -r "patient" "D:\ORBIPAX-PROJECT\src" --include="*.ts" | head -10
grep -r "appointment" "D:\ORBIPAX-PROJECT\src" --include="*.ts" | head -10
```

**Clinical Workflow Audit:**
- [ ] Patient intake and registration workflows
- [ ] Appointment scheduling and management processes
- [ ] Clinical documentation and note-taking workflows
- [ ] Provider authentication and role management
- [ ] Billing and insurance claim processing
- [ ] Cross-module clinical data integration
- [ ] Clinical reporting and compliance workflows

**Multi-Tenant Organization Review:**
- [ ] Organization-based data filtering patterns
- [ ] Row Level Security (RLS) implementation
- [ ] Provider role and permission structures
- [ ] Cross-organization boundary enforcement
- [ ] Organization-specific clinical workflows
- [ ] Multi-tenant audit trail patterns

### Phase 5: Security and Compliance Infrastructure
```bash
# Search for existing security and compliance implementations
grep -r "withAuth\|withSecurity\|withAudit" "D:\ORBIPAX-PROJECT\src" --include="*.ts"
find "D:\ORBIPAX-PROJECT\src" -name "*auth*" -type f
find "D:\ORBIPAX-PROJECT\src" -name "*audit*" -type f
```

**Security Infrastructure Audit:**
- [ ] Authentication and session management patterns
- [ ] Authorization and role-based access control
- [ ] BFF wrapper implementation (withAuth → withSecurity → withRateLimit → withAudit)
- [ ] Idempotency patterns for clinical data mutations
- [ ] PHI encryption and secure transmission
- [ ] Clinical data access logging and audit trails
- [ ] Incident response and breach notification procedures

**Compliance Framework Review:**
- [ ] HIPAA compliance implementation patterns
- [ ] Clinical data retention and archival policies
- [ ] Regulatory reporting and audit trail generation
- [ ] Provider training and compliance documentation
- [ ] Clinical quality assurance and monitoring
- [ ] Emergency access and incident response procedures

## Clinical Task-Specific Checklists

### Patient Data Management Tasks
**Before implementing patient-related features:**
- [ ] Review existing patient module structure and patterns
- [ ] Validate PHI handling and encryption requirements
- [ ] Confirm organization boundary enforcement for patient data
- [ ] Check provider role permissions for patient access
- [ ] Verify audit logging for patient data modifications
- [ ] Ensure clinical workflow compliance for patient care

### Appointment and Scheduling Tasks
**Before implementing scheduling features:**
- [ ] Review existing appointment module and calendar integration
- [ ] Validate provider availability and conflict resolution patterns
- [ ] Confirm resource allocation (rooms, equipment) management
- [ ] Check patient notification and reminder systems
- [ ] Verify clinical workflow integration with scheduling
- [ ] Ensure organization-specific scheduling rules and constraints

### Clinical Documentation Tasks
**Before implementing clinical notes or documentation:**
- [ ] Review existing clinical notes module and templates
- [ ] Validate digital signature and co-signature requirements
- [ ] Confirm clinical documentation standards compliance
- [ ] Check provider authorship and accountability patterns
- [ ] Verify clinical quality metrics and reporting integration
- [ ] Ensure regulatory compliance for clinical documentation

### Billing and Financial Tasks
**Before implementing billing or financial features:**
- [ ] Review existing billing module and payment processing
- [ ] Validate service coding standards (CPT, ICD-10) integration
- [ ] Confirm insurance verification and authorization workflows
- [ ] Check claims processing and payment tracking patterns
- [ ] Verify financial reporting and compliance requirements
- [ ] Ensure organization-specific billing rules and constraints

## Location Decision Matrix

### Allowed Creation Paths
**Clinical Module Extensions:**
- `D:\ORBIPAX-PROJECT\src\modules\[existing-module]\` - Extend existing clinical modules
- `D:\ORBIPAX-PROJECT\src\shared\ui\` - Add healthcare-specific UI components
- `D:\ORBIPAX-PROJECT\src\shared\schemas\` - Add clinical validation schemas
- `D:\ORBIPAX-PROJECT\docs\` - Add clinical documentation and compliance guides
- `D:\ORBIPAX-PROJECT\tmp\` - Work reports and clinical development notes

**Prohibited Creation Areas:**
- Cross-module clinical data access or modification
- Direct database access outside of infrastructure layer
- PHI handling outside of secure, audited patterns
- Clinical logic in UI components or client-side code
- Organization boundary bypassing or cross-tenant access

### Clinical Feature Development Paths
1. **Existing Module Enhancement**: Extend current clinical modules with new features
2. **Shared Component Creation**: Add reusable clinical UI components
3. **Clinical Workflow Integration**: Connect existing modules for clinical workflows
4. **Compliance Enhancement**: Add HIPAA and regulatory compliance features
5. **Documentation Creation**: Add clinical guides and compliance documentation

## Duplication Detection

### Common Clinical Duplication Risks
- [ ] Patient form components across different modules
- [ ] Provider role validation logic in multiple places
- [ ] Clinical data validation schemas with similar patterns
- [ ] Organization boundary enforcement in various modules
- [ ] Audit logging patterns across clinical workflows
- [ ] Clinical status and alert display components

### Reuse Validation Checklist
- [ ] Search `shared/ui/primitives/` for similar clinical components
- [ ] Check `shared/schemas/` for existing clinical validation patterns
- [ ] Review `shared/auth/` for role and permission patterns
- [ ] Validate `shared/lib/` for clinical utility functions
- [ ] Confirm clinical workflow patterns in existing modules
- [ ] Verify organization and multi-tenant patterns

## Clinical Workflow Validation

### Provider Workflow Requirements
- [ ] Clinical role validation for all healthcare functions
- [ ] Provider efficiency and workflow optimization
- [ ] Clinical decision support integration points
- [ ] Provider accountability and audit trail generation
- [ ] Clinical documentation and note-taking efficiency
- [ ] Cross-provider collaboration and communication

### Patient Safety Requirements
- [ ] Patient data integrity and accuracy validation
- [ ] Clinical alert and notification systems
- [ ] Patient privacy and confidentiality protection
- [ ] Clinical error prevention and safety checks
- [ ] Emergency access and incident response procedures
- [ ] Patient care continuity and coordination

### Regulatory Compliance Requirements
- [ ] HIPAA privacy and security rule compliance
- [ ] Clinical documentation standards adherence
- [ ] Audit trail completeness and integrity
- [ ] Regulatory reporting and compliance monitoring
- [ ] Clinical quality assurance and metrics
- [ ] Incident response and breach notification procedures

## Final Approval Checklist

### Technical Validation
- [ ] Architecture boundaries respected (ui → application → domain)
- [ ] Organization multi-tenancy properly enforced
- [ ] Security wrappers applied in correct order
- [ ] Zod validation implemented for all clinical inputs
- [ ] TypeScript strict mode compliance maintained
- [ ] Clinical module isolation and independence verified

### Clinical Validation
- [ ] Clinical workflow accuracy confirmed by healthcare staff
- [ ] Provider role and permission requirements validated
- [ ] Patient safety considerations addressed and tested
- [ ] Clinical documentation standards compliance verified
- [ ] Healthcare regulatory requirements met
- [ ] Clinical quality metrics and reporting integration

### Compliance Validation
- [ ] HIPAA compliance verified through comprehensive review
- [ ] PHI protection measures implemented and tested
- [ ] Audit trail generation complete and accurate
- [ ] Organization boundary enforcement tested
- [ ] Regulatory reporting requirements addressed
- [ ] Incident response procedures validated

## Emergency Override Procedures

### Clinical Emergency Scenarios
In case of clinical emergencies affecting patient care:
1. **Patient Safety Priority**: Immediate patient safety assessment
2. **Provider Notification**: Alert clinical staff of system issues
3. **Clinical Continuity**: Ensure clinical workflow continuity
4. **Regulatory Reporting**: Prepare incident reports for regulatory bodies
5. **System Recovery**: Validate clinical data integrity during recovery

### HIPAA Breach Response
In case of potential PHI exposure or HIPAA violation:
1. **Immediate Containment**: Stop PHI exposure and secure affected systems
2. **Impact Assessment**: Evaluate scope and severity of PHI exposure
3. **Notification Procedures**: Follow HIPAA breach notification requirements
4. **Regulatory Reporting**: Report to appropriate regulatory authorities
5. **Corrective Actions**: Implement measures to prevent future incidents

## Pre-Development Certification

**Developer/AI Assistant Certification:**
- [ ] I have completed the full SENTINEL_PRECHECKLIST audit
- [ ] I have searched for existing clinical components and patterns
- [ ] I have verified HIPAA compliance requirements for this task
- [ ] I have confirmed organization boundary enforcement needs
- [ ] I have validated clinical workflow accuracy requirements
- [ ] I understand the patient safety implications of this work
- [ ] I will report all work in `/tmp` with clinical context and compliance notes

**Clinical Development Ready**: ✅ Proceed with clinical development task following established patterns and compliance requirements.