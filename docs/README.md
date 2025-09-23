# Documentation Directory - OrbiPax

## Purpose

This directory contains design notes, Architecture Decision Records (ADRs), technical diagrams, and important decisions that shape the OrbiPax Community Mental Health platform. All major changes should be documented here before implementation to ensure HIPAA compliance, clinical safety, and regulatory requirements.

## Structure

```
docs/
├── adrs/                 # Architecture Decision Records
├── diagrams/            # System and clinical workflow diagrams
├── guides/              # Developer and clinical user guides
├── decisions/           # Design decisions log
├── soc/                 # Separation of concerns documentation
├── compliance/          # HIPAA and regulatory compliance docs
├── architecture/        # System architecture documentation
├── ARCHITECTURE_CONTRACT.md    # Core architectural principles
├── PROMPTS_GUIDE.md            # AI development prompt templates
├── SENTINEL_PRECHECKLIST.md    # Pre-development audit checklist
└── README_GUARDRAILS.md        # Development guardrails and workflow
```

## Content Types

### Architecture Decision Records (ADRs)
Document significant architectural choices for healthcare platform:
- Clinical workflow decisions and rationale
- HIPAA compliance architectural choices
- Multi-tenant organization isolation decisions
- Security and audit trail implementations
- Integration patterns with healthcare systems

### Technical Diagrams
Visual representations of clinical and system design:
- Clinical module dependency graphs
- Patient data flow diagrams
- Appointment scheduling sequences
- Clinical documentation workflows
- Organization-based security boundaries

### Developer Guides
Healthcare-specific development documentation:
- HIPAA-compliant development practices
- Clinical module development patterns
- Multi-tenant development guidelines
- PHI (Protected Health Information) handling
- Audit logging requirements

### Clinical Workflow Documentation
Healthcare-specific process documentation:
- Patient intake and registration workflows
- Appointment scheduling and management
- Clinical documentation requirements
- Billing and insurance claim processes
- Provider credentialing and role management

## Documentation Standards

### ADR Template (Healthcare-Adapted)
```markdown
# ADR-001: [Clinical/Technical Decision Title]

## Status
Accepted | Proposed | Deprecated | Superseded

## Clinical Context
What clinical workflow or patient safety issue are we addressing?

## Decision
What have we decided to implement?

## HIPAA/Compliance Impact
How does this decision affect:
- Patient privacy protection
- Audit trail requirements
- Data encryption and security
- Role-based access controls

## Clinical Consequences
What are the positive and negative outcomes for:
- Patient care quality
- Provider workflow efficiency
- Regulatory compliance
- Data integrity

## Alternatives Considered
What other clinical/technical options were evaluated?

## Implementation Notes
- Multi-tenant considerations
- Organization boundary requirements
- Clinical role permissions
- Audit logging requirements

## Date
YYYY-MM-DD
```

## Key Clinical Decisions Log

### Modular Monolith for Healthcare
- **Date**: 2025-01-22
- **Rationale**: Balance clinical feature development speed with regulatory compliance
- **Impact**: All clinical modules must be independently auditable and HIPAA-compliant

### Organization-Based Multi-Tenancy
- **Date**: 2025-01-22
- **Rationale**: Healthcare organizations require strict data isolation
- **Impact**: All clinical data filtered by organization_id with RLS policies

### PHI Protection Standards
- **Date**: 2025-01-22
- **Rationale**: HIPAA compliance requires comprehensive PHI protection
- **Impact**: No PHI in logs, telemetry, or error messages

## Clinical Safety Notice

⚠️ **IMPORTANT**: All documentation changes that affect clinical workflows, patient data handling, or regulatory compliance must be reviewed by clinical staff and compliance officers before implementation.

## Quick Links

- [Project Overview](../README.md)
- [Development Guidelines](../CLAUDE.md)
- [Module Architecture](../src/modules/README.md)
- [Architecture Contract](./ARCHITECTURE_CONTRACT.md)
- [Development Prompts Guide](./PROMPTS_GUIDE.md)
- [Pre-Development Checklist](./SENTINEL_PRECHECKLIST.md)