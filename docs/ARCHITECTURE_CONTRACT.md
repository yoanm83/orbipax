# ARCHITECTURE_CONTRACT.md — OrbiPax (2025-01-22)

**Clinical Context Summary:**
- Architecture: Modular Monolith by **clinical modules** (patients, appointments, notes, billing).
- Clinical Workflows: Patient-centric with provider accountability, appointment scheduling, clinical documentation, billing integration.
- UI **without business logic or data fetching**; only composition with `@/shared/ui/primitives/*` and props/callbacks.
- Multi-tenant: `organization_id` **server-side only** with Row Level Security (RLS) for healthcare data isolation.
- BFF Server Actions with wrappers (in order): `withAuth → withSecurity → withRateLimit → withAudit` (+ `withIdempotency` for clinical data mutations).
- Zod validation for **all** clinical inputs/outputs; TypeScript strict mode; HIPAA-compliant accessibility.
- Tailwind v4: **single** `src/styles/globals.css`. OKLCH semantic tokens in `@theme`; utilities in `@layer utilities`. No hardcoded clinical styling.

## 1) Folder Structure **MANDATORY**
```
src/
  modules/
    patients/           # Patient demographics, medical history, care coordination
      ui/               # Patient forms, lists, dashboards (no data fetching)
      application/      # Patient management use cases, validation
      domain/           # Patient entities, clinical rules, HIPAA compliance
      infrastructure/   # Patient data repository, external integrations
    appointments/       # Scheduling, calendar management, provider availability
      ui/               # Scheduling interfaces, calendar views
      application/      # Appointment booking logic, conflict resolution
      domain/           # Scheduling rules, provider constraints
      infrastructure/   # Calendar systems, notification services
    notes/              # Clinical documentation, progress notes, assessments
      ui/               # Note templates, documentation interfaces
      application/      # Clinical documentation workflows
      domain/           # Clinical note standards, signature requirements
      infrastructure/   # Document storage, compliance archiving
    clinicians/         # Provider management, credentials, roles
    billing/            # Claims processing, insurance, payments
    auth/               # Authentication, authorization, session management
    admin/              # System administration, user management
    dashboard/          # Aggregated clinical metrics and workflows
  shared/
    ui/primitives/      # Healthcare-compliant design system components
    auth/               # Session management, organization boundaries
    lib/                # HIPAA-compliant utilities
    schemas/            # Clinical data validation schemas
  app/
    (app)/              # Protected clinical application routes
    (public)/           # Public authentication pages
    globals.css         # Single source of design tokens
```
> **Prohibited:** Direct cross-module imports, PHI in client state, clinical logic in UI components.

## 2) Clinical Data Flow
UI (client) → **actions** (server, with wrappers) → Database (RLS by organization_id).
UI receives **clinical data** pre-hydrated from server components and callbacks to clinical actions.
Clinical calculations (billing rates, appointment conflicts, clinical scores) **server-side only**.

## 3) Healthcare-Specific Rules

### HIPAA Compliance (Non-Negotiable)
- No PHI (Protected Health Information) in client state, logs, or telemetry
- All clinical data access must be audited and logged
- Organization boundaries enforced at database level with RLS
- Clinical data encrypted at rest and in transit
- Role-based access control for clinical functions

### Multi-Tenant Clinical Isolation
- All patient data filtered by `organization_id`
- Clinical providers scoped to their organization
- No cross-organization data visibility
- Audit trails track organization-specific access

### Clinical Workflow Rules
- Patient-centric data model with provider accountability
- Appointment scheduling with conflict resolution and resource management
- Clinical documentation with digital signature requirements
- Billing integration linking clinical services to payment codes
- Provider role validation for clinical actions

## 4) Quality Gates
- `scripts/sentinel.ts` must pass for all clinical modules (HIPAA compliance check)
- `renames.json` required before moving clinical data structures
- All changes guided by **clinical audit** and compliance review in `D:\ORBIPAX-PROJECT\tmp\*` (no PHI)
- Clinical workflow changes require provider review and approval

## 5) Security and Compliance

### BFF Wrapper Order (Mandatory for Clinical Endpoints)
```typescript
withAuth → withSecurity → withRateLimit → withAudit → withIdempotency
```

### Clinical Data Validation
- Zod schemas for all patient data inputs/outputs
- Clinical role validation before data access
- Organization boundary enforcement
- PHI encryption and secure transmission

### Audit Requirements
- All clinical data access logged with provider identity
- Patient data modifications tracked with timestamps
- Compliance reporting for regulatory requirements
- Incident tracking and breach notification procedures

## 6) Clinical Module Standards

### Patients Module
- Demographics with HIPAA-compliant storage
- Medical history and allergy management
- Insurance and financial information handling
- Care team coordination and provider assignments

### Appointments Module
- Provider availability and scheduling constraints
- Resource allocation (rooms, equipment, staff)
- Conflict resolution and double-booking prevention
- Patient notification and reminder systems

### Clinical Notes Module
- Documentation templates following clinical standards
- Progress notes with provider accountability
- Digital signature and co-signature workflows
- Clinical quality metrics and compliance reporting

### Billing Module
- Service coding with CPT and ICD-10 standards
- Insurance verification and authorization
- Claims processing and payment tracking
- Financial reporting and compliance auditing

## 7) UI/UX Clinical Standards

### Semantic Design Tokens (Healthcare-Optimized)
```css
@theme {
  /* Clinical Status Colors (OKLCH) */
  --color-critical: oklch(0.62 0.22 25);     /* Medical alerts, urgent */
  --color-warning: oklch(0.75 0.15 85);      /* Caution, requires attention */
  --color-normal: oklch(0.65 0.15 145);      /* Normal ranges, stable */
  --color-info: oklch(0.55 0.15 250);        /* Information, non-critical */

  /* Clinical Text Hierarchy */
  --color-patient-primary: oklch(0.21 0.02 257);    /* Patient names, primary data */
  --color-clinical-secondary: oklch(0.45 0.02 257); /* Clinical notes, secondary info */
  --color-provider-accent: oklch(0.35 0.08 257);    /* Provider names, authorship */

  /* Accessibility-First Clinical Design */
  --color-focus: oklch(0.55 0.18 250);      /* Focus indicators for clinical forms */
  --color-border-clinical: oklch(0.85 0.02 257); /* Form borders, data sections */
}
```

### Clinical Accessibility Requirements
- WCAG 2.1 AA compliance for healthcare applications
- High contrast ratios for clinical data visibility
- Touch targets ≥44px for mobile clinical applications
- Screen reader support for clinical documentation
- Keyboard navigation for provider efficiency

### Clinical Form Standards
- Required field indicators for clinical data
- Clear error messaging for patient safety
- Auto-save for clinical documentation
- Validation for clinical data formats (dates, medical codes)
- Confirmation dialogs for critical clinical actions

## 8) Development Workflow (Clinical-Adapted)

### Clinical Feature Development
1. **Clinical Requirements Review**: Validate with clinical staff
2. **HIPAA Impact Assessment**: Evaluate PHI handling requirements
3. **Compliance Documentation**: Document in `/docs` with clinical context
4. **Security Review**: Ensure organization boundaries and audit trails
5. **Clinical Testing**: Test with realistic clinical scenarios
6. **Provider Training**: Document clinical workflow changes

### Code Review Standards
- Clinical data handling compliance check
- Organization boundary enforcement verification
- PHI protection validation
- Audit trail completeness review
- Clinical workflow accuracy confirmation

## 9) Compliance and Monitoring

### HIPAA Compliance Monitoring
- Regular PHI exposure audits
- Access control effectiveness reviews
- Audit trail completeness validation
- Incident response procedure testing
- Compliance reporting automation

### Clinical Quality Assurance
- Clinical workflow accuracy validation
- Provider feedback integration
- Patient safety impact assessment
- Regulatory requirement compliance
- Clinical documentation quality metrics

## 10) Emergency Procedures

### Clinical System Incidents
- Patient safety impact assessment protocols
- Clinical data breach response procedures
- Provider notification and communication plans
- Regulatory reporting requirements
- System recovery with clinical data integrity

### Business Continuity
- Clinical workflow backup procedures
- Provider access during system outages
- Patient care continuity protocols
- Data backup and recovery for clinical systems
- Emergency clinical documentation procedures

## 11) Approval and Exceptions

Clinical architectural changes require approval from:
- **Clinical Director**: Patient care and workflow impacts
- **Compliance Officer**: HIPAA and regulatory requirements
- **Technical Lead**: System architecture and security
- **Quality Assurance**: Clinical documentation and audit trails

All exceptions documented in `/docs/compliance/exceptions.md` with:
- Clinical justification and risk assessment
- Temporary mitigation measures
- Compliance review schedule
- Provider training requirements
- Patient safety impact evaluation