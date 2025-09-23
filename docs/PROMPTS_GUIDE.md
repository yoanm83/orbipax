# PROMPTS_GUIDE.md - OrbiPax Clinical Development

## Purpose

This guide provides canonical prompt templates for AI-assisted development of the OrbiPax Community Mental Health platform. All prompts must include clinical context, HIPAA compliance considerations, and organization-based multi-tenancy requirements.

## Core Prompt Template

### Standard Clinical Development Prompt
```
Context: OrbiPax CMH platform - modular monolith with organization-based multi-tenancy for healthcare.

Architecture Rules:
- Always AUDIT existing code first before proposing changes
- Modular monolith: patients, appointments, notes, clinicians, billing, auth, admin, dashboard
- Layer boundaries: ui → application → domain (infrastructure only called by application)
- Multi-tenant: All data filtered by organization_id with RLS
- Security wrappers: withAuth → withSecurity → withRateLimit → withAudit (+ withIdempotency for mutations)

Healthcare Rules:
- HIPAA compliance: No PHI in logs, telemetry, or console output
- Patient safety priority: Validate clinical workflows before implementation
- Clinical roles: Validate provider permissions for clinical actions
- Audit trails: Log all clinical data access with provider identity
- Organization boundaries: Strict data isolation between healthcare organizations

Technical Rules:
- Zod validation for all clinical inputs/outputs
- TypeScript strict mode with exactOptionalPropertyTypes
- Tailwind v4 semantic tokens only (no hardcoded values)
- Report all work in /tmp with detailed clinical context

Task: [Specific clinical development task]
```

## Specialized Prompt Templates

### 1. Clinical Module Development
```
Context: OrbiPax CMH - Developing [MODULE] clinical module.

Clinical Requirements:
- Patient-centric data model with provider accountability
- [Specific clinical workflow requirements]
- Integration with [related clinical modules]
- HIPAA-compliant data handling

Architecture Requirements:
- Follow modular monolith pattern: domain → application → infrastructure → ui
- Organization-based RLS for multi-tenant isolation
- Clinical role validation for data access
- Audit logging for all clinical data operations

Validation Requirements:
- Zod schemas for clinical data validation
- Provider permission checks
- Patient safety validation
- Clinical workflow compliance

Task: [Specific clinical module development task]
```

### 2. HIPAA Compliance Review
```
Context: OrbiPax CMH - HIPAA compliance review for [FEATURE/MODULE].

Compliance Focus:
- PHI Protection: Identify and secure all Protected Health Information
- Access Controls: Validate role-based access for clinical data
- Audit Trails: Ensure comprehensive logging of clinical data access
- Data Encryption: Verify encryption at rest and in transit
- Organization Boundaries: Confirm multi-tenant isolation

Review Areas:
- Clinical data flow and storage
- Provider authentication and authorization
- Patient data access patterns
- Audit logging completeness
- Incident response procedures

Task: Conduct comprehensive HIPAA compliance review for [specific area]
```

### 3. Clinical Workflow Implementation
```
Context: OrbiPax CMH - Implementing [CLINICAL_WORKFLOW] workflow.

Clinical Context:
- Provider roles involved: [physician, nurse, admin, etc.]
- Patient care impact: [specific patient care considerations]
- Regulatory requirements: [relevant healthcare regulations]
- Clinical documentation needs: [required clinical documentation]

Workflow Requirements:
- Step-by-step clinical process validation
- Provider permission and role validation
- Patient safety checkpoints
- Clinical data integrity verification
- Audit trail generation

Integration Points:
- [Related clinical modules and dependencies]
- [External healthcare systems if applicable]
- [Clinical decision support requirements]

Task: Implement [specific clinical workflow] with full compliance validation
```

### 4. UI/UX Clinical Design
```
Context: OrbiPax CMH - Clinical UI/UX development for [CLINICAL_INTERFACE].

Clinical Design Requirements:
- Provider efficiency and workflow optimization
- Patient safety through clear information display
- WCAG 2.1 AA accessibility for healthcare applications
- Clinical data hierarchy and visual organization
- Error prevention and clear clinical alerts

Technical Requirements:
- Tailwind v4 semantic tokens for clinical status colors
- Healthcare-optimized touch targets (≥44px)
- Clinical form validation with clear error messaging
- Screen reader support for clinical documentation
- Keyboard navigation for provider efficiency

Clinical Context:
- Primary users: [clinical roles using this interface]
- Clinical scenarios: [typical use cases and workflows]
- Patient safety considerations: [safety-critical elements]
- Clinical data displayed: [types of clinical information]

Task: Design and implement [specific clinical interface] with healthcare UX best practices
```

### 5. Security and Audit Implementation
```
Context: OrbiPax CMH - Security and audit implementation for [FEATURE/MODULE].

Security Requirements:
- Organization-based RLS with automatic filtering
- Role-based access control for clinical functions
- PHI encryption and secure transmission
- Session management with clinical context
- Incident detection and response procedures

Audit Requirements:
- Clinical data access logging with provider identity
- Patient data modification tracking
- Compliance reporting for regulatory requirements
- Audit trail integrity and tamper detection
- Automated compliance monitoring

Multi-Tenant Requirements:
- Organization boundary enforcement
- Cross-organization data leak prevention
- Tenant-specific clinical role management
- Organization-scoped audit trails
- Compliance reporting per organization

Task: Implement comprehensive security and audit controls for [specific area]
```

## Workflow Templates

### AUDIT-ONLY Prompt
```
AUDIT REQUEST: OrbiPax CMH Platform

Scope: [Specific area to audit - module, workflow, compliance area]

Audit Focus:
□ Existing code and module structure
□ Clinical workflow compliance
□ HIPAA and PHI protection measures
□ Organization boundary enforcement
□ Audit trail completeness
□ Provider role validation
□ Patient safety considerations

Requirements:
- Search all relevant modules and shared components
- Document current implementation patterns
- Identify compliance gaps or risks
- Note clinical workflow deviations
- Report findings in /tmp with clinical context
- NO CODE CHANGES - audit only

Output: Comprehensive audit report with clinical compliance assessment
```

### APPLY-AFTER-AUDIT Prompt
```
APPLY REQUEST: OrbiPax CMH Platform
(Following completion of AUDIT phase)

Previous Audit Findings: [Reference to audit report in /tmp]

Implementation Requirements:
- Address identified compliance gaps
- Follow existing clinical module patterns
- Maintain organization boundary isolation
- Preserve audit trail integrity
- Validate provider permissions
- Ensure patient safety throughout

Clinical Validation:
- Confirm clinical workflow accuracy
- Validate provider role requirements
- Ensure patient data integrity
- Verify HIPAA compliance measures
- Test organization isolation

Task: [Specific implementation task based on audit findings]

Expected Deliverables:
- Working clinical implementation
- Updated compliance documentation
- Clinical workflow validation
- Comprehensive implementation report in /tmp
```

## Quality Assurance Prompts

### Clinical Testing Validation
```
Context: OrbiPax CMH - Clinical testing and validation for [FEATURE/MODULE].

Testing Focus:
- Clinical workflow accuracy and completeness
- Provider role and permission validation
- Patient data integrity and safety
- HIPAA compliance verification
- Organization boundary enforcement
- Audit trail generation and accuracy

Test Scenarios:
- Typical clinical use cases
- Edge cases and error conditions
- Cross-organization boundary testing
- Provider role escalation scenarios
- Patient safety validation scenarios
- Compliance audit simulation

Validation Criteria:
- Clinical workflow meets provider expectations
- Patient safety maintained throughout
- HIPAA compliance verified
- Audit trails complete and accurate
- Organization isolation confirmed
- Provider efficiency maintained

Task: Conduct comprehensive clinical testing and validation
```

### Compliance Documentation Review
```
Context: OrbiPax CMH - Compliance documentation review for [AREA].

Documentation Review Areas:
- Clinical workflow documentation accuracy
- HIPAA compliance procedure completeness
- Provider training material adequacy
- Incident response procedure clarity
- Audit trail documentation completeness
- Regulatory requirement coverage

Review Criteria:
- Clinical accuracy and provider usability
- Regulatory compliance completeness
- Patient safety consideration coverage
- Organization-specific customization needs
- Training and implementation guidance
- Maintenance and update procedures

Task: Review and validate compliance documentation for [specific area]
```

## Emergency Response Prompts

### Clinical Incident Response
```
URGENT: OrbiPax CMH - Clinical incident response for [INCIDENT_TYPE].

Incident Context:
- Clinical impact: [patient care, provider workflow, data access]
- HIPAA implications: [PHI exposure, access control breach, audit failure]
- Organization scope: [single organization, multi-tenant, system-wide]
- Regulatory requirements: [immediate reporting, containment, investigation]

Immediate Actions Required:
- Patient safety assessment and protection
- PHI exposure containment and assessment
- Provider notification and communication
- Regulatory reporting preparation
- System isolation and containment
- Evidence preservation for investigation

Clinical Priorities:
1. Patient safety and care continuity
2. PHI protection and containment
3. Provider communication and training
4. Regulatory compliance and reporting
5. System recovery and validation

Task: Execute immediate incident response with clinical safety priority
```

## Usage Guidelines

### Required Prompt Elements
Every prompt must include:
1. **Clinical Context**: Healthcare-specific requirements and considerations
2. **HIPAA Compliance**: PHI protection and audit requirements
3. **Multi-Tenant Scope**: Organization boundaries and isolation
4. **Provider Roles**: Clinical role validation and permissions
5. **Patient Safety**: Safety-critical considerations and validation

### Prompt Execution Rules
1. **Always start with AUDIT**: Never skip the discovery and audit phase
2. **Clinical Validation**: Include clinical workflow accuracy validation
3. **Compliance Verification**: Verify HIPAA and regulatory compliance
4. **Organization Boundaries**: Test multi-tenant isolation thoroughly
5. **Document Everything**: Report all work in `/tmp` with clinical context

### Clinical Safety Requirements
- **Patient Safety First**: Always prioritize patient care and safety
- **Provider Efficiency**: Optimize clinical workflows for provider productivity
- **Regulatory Compliance**: Maintain HIPAA and healthcare regulation compliance
- **Data Integrity**: Ensure clinical data accuracy and completeness
- **Audit Transparency**: Provide clear audit trails for regulatory review

## Quality Checklist

Before marking any clinical development task complete:
- [ ] Clinical workflow accuracy validated by healthcare staff
- [ ] HIPAA compliance verified through comprehensive review
- [ ] Organization boundaries tested with multi-tenant scenarios
- [ ] Provider roles and permissions validated
- [ ] Patient safety considerations addressed
- [ ] Audit trails complete and accurate
- [ ] Regulatory requirements documented and met
- [ ] Clinical documentation updated and reviewed
- [ ] Provider training materials prepared
- [ ] Incident response procedures validated