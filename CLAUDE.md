# CLAUDE.md - Development Guidelines for OrbiPax

## Project Goal and Scope

**OrbiPax** is a modular monolith for Community Mental Health (CMH) practice management. The project provides a clean, scalable architecture for managing patients, appointments, clinical notes, billing, and provider workflows while maintaining HIPAA compliance and multi-tenant isolation.

### Core Objectives
- Build a maintainable healthcare platform with clear boundaries between clinical modules
- Support multi-tenant operations with organization-based isolation
- Enable gradual migration to microservices if needed
- Maintain high code quality, security, and regulatory compliance

## Architecture

### Modular Monolith + SoC + BFF Pattern
- **Modular Monolith**: Single deployable unit with module isolation
- **Separation of Concerns (SoC)**: Clear layer boundaries within each module
- **Backend for Frontend (BFF)**: API layer tailored for specific clinical workflows

### Architectural Principles
1. Each module is independent and can be extracted if needed
2. Domain logic never depends on infrastructure
3. Application layer orchestrates clinical operations
4. UI layer only handles presentation concerns
5. Multi-tenant with organization-based Row Level Security (RLS)

## SENTINEL v2: Reglas de Oro para Claude (NO NEGOCIABLES)

### Flujo Obligatorio: AUDIT-FIRST → APPLY
**UNA TAREA POR PROMPT** en español. **SIEMPRE** seguir este orden:
1. **AUDIT SUMMARY** completo (usar plantilla obligatoria)
2. **GATES validation** (todos deben pasar)
3. **APPLY** solo si Go/No-Go = Go

### GATES Obligatorios (si falla uno = NO APPLY)
- ✅ **AUDIT SUMMARY presente y completo**
- ✅ **Rutas y aliases confirmados** (sin suposiciones ni inventar)
- ✅ **Sin duplicados/colisiones** (o plan de consolidación)
- ✅ **Conformidad Health** (SoC, RLS/roles, UI tokens v4/a11y, Zod, wrappers BFF)
- ✅ **ALLOWED PATHS claros** y DO NOT TOUCH respetados

### Reason Codes de Rechazo
- **NO_AUDIT**: Falta AUDIT SUMMARY o incompleto
- **PATH_GUESS**: Rutas inventadas o no confirmadas
- **DUPLICATE_FOUND**: Funcionalidad duplicada sin plan de consolidación
- **SOC_VIOLATION**: Violación de capas (UI→Application→Domain→Infrastructure)
- **RLS_RISK**: Falta filtrado por organization_id o roles
- **UI_HARDCODE**: Hardcode de colores, spacing, o tokens en UI
- **A11Y_FAIL**: Falta accesibilidad (ARIA, targets <44px, contraste)
- **NO_ZOD_SCHEMA**: Validación sin Zod o schema faltante
- **WRAPPERS_MISSING**: Falta wrappers BFF obligatorios
- **PROMPT_FORMAT_ERROR**: Formato de prompt incorrecto

### Search and Discovery (MANDATORY)
- **Siempre buscar** código existente antes de crear archivos nuevos
- **Nunca duplicar** funcionalidad - reutilizar componentes compartidos
- **Reportar todo trabajo** en `/tmp` con resúmenes detallados
- **Auditar primero, aplicar segundo**: Siempre ejecutar discovery antes de proponer soluciones

### Code Standards
- **No hardcoding** of styles, colors, or design tokens
- **Respect layer boundaries**: ui → application → domain (never reverse)
- **Infrastructure isolation**: only called by application layer, never by domain
- **Validation**: Use Zod schemas for all input validation
- **TypeScript strict mode**: No `any` types, explicit return types
- **Logging**: No `console.*` statements, use telemetry service
- **Privacy**: Telemetry must never include PHI (Protected Health Information)

## Folder Structure

```
orbipax-project/
├── src/
│   ├── app/              # Next.js pages and layouts
│   ├── modules/          # Clinical modules
│   │   ├── patients/          # Patient demographics and records
│   │   ├── appointments/      # Scheduling and calendar management
│   │   ├── notes/            # Clinical documentation
│   │   ├── clinicians/       # Provider management
│   │   ├── billing/          # Claims and payments
│   │   ├── auth/             # Authentication/authorization
│   │   ├── admin/            # System administration
│   │   ├── dashboard/        # Aggregated views and metrics
│   │   └── [module]/
│   │       ├── domain/        # Entities, value objects, business rules
│   │       ├── application/   # Use cases, orchestration
│   │       ├── infrastructure/# External services, repositories
│   │       └── ui/           # Controllers, presenters, routes
│   ├── shared/           # Cross-cutting concerns
│   │   ├── auth/             # Session management
│   │   ├── ui/               # Design system components
│   │   ├── lib/              # Utilities and helpers
│   │   ├── schemas/          # Shared validation schemas
│   │   └── utils/            # Pure utility functions
│   └── infrastructure/   # External adapters
├── tests/                # Test suites per module
├── docs/                 # Architecture decisions and diagrams
└── tmp/                  # Work reports and temporary notes
```

## Coding Conventions

### TypeScript Configuration
- Strict mode enabled with all checks
- Path aliases for clean imports (`@/modules/`, `@/shared/`)
- Explicit function return types required
- No implicit any or unchecked indexed access
- `exactOptionalPropertyTypes: true` for precise type safety

### Code Quality Tools
- **ESLint**: Enforces code standards and best practices
- **Prettier**: Consistent code formatting (2 spaces, single quotes)
- **EditorConfig**: Cross-editor consistency

### Commit Discipline
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Keep commits atomic and focused
- Write clear, descriptive commit messages
- Reference issue numbers when applicable

### Testing Strategy
- Unit tests for domain logic and use cases
- Integration tests for infrastructure components
- End-to-end tests for critical clinical workflows
- Maintain test coverage above 80% for business logic

## Module Communication

### Allowed Patterns
- Modules communicate through application services
- Events for loose coupling between modules
- Shared kernel for common clinical concepts

### Forbidden Patterns
- Direct database access across modules
- Circular dependencies between modules
- Domain layer depending on any other layer
- UI components containing business logic

## Healthcare-Specific Rules

### HIPAA Compliance
- **PHI Protection**: No Protected Health Information in logs, telemetry, or console output
- **Audit Trails**: All clinical data access must be logged
- **Encryption**: PHI must be encrypted at rest and in transit
- **Access Controls**: Role-based access with organization boundaries

### Multi-Tenant Architecture
- **Organization Isolation**: All data filtered by `organization_id`
- **RLS Policies**: Database-level row security for data isolation
- **Role Management**: Clinical roles (physician, nurse, admin) per organization
- **Data Segregation**: No cross-organization data leakage

### Clinical Workflows
- **Patient-Centric**: All modules relate to patient care
- **Provider Identity**: Track clinical authorship and responsibility
- **Appointment Scheduling**: Conflict resolution and resource management
- **Documentation**: Clinical notes with digital signatures and co-signatures
- **Billing Integration**: Link clinical services to billing codes

## Development Workflow

1. **Document decisions** in `/docs` before implementation
2. **Create work reports** in `/tmp` for each task
3. **Search existing code** before creating new functionality
4. **Write tests** before implementing features
5. **Ensure layer separation** is properly maintained
6. **Review module boundaries** before adding dependencies

## UI/Style Guidelines

### Design System
- **Tailwind v4**: Semantic tokens only, no hardcoded values
- **OKLCH Colors**: Use semantic color tokens for accessibility
- **Design Tokens**: Reference CSS variables for consistency
- **Component Reuse**: Check `shared/ui` before creating new components

### Accessibility (WCAG 2.1 AA)
- **Semantic HTML**: Proper landmarks and heading hierarchy
- **ARIA Labels**: Descriptive labels for screen readers
- **Focus Management**: Visible focus indicators and logical tab order
- **Touch Targets**: Minimum 44px for interactive elements
- **Color Contrast**: Meet accessibility standards for text and backgrounds

## Security Wrappers (BFF)

### Mandatory Wrapper Order
All API endpoints must use security wrappers in this order:
```typescript
withAuth → withSecurity → withRateLimit → withAudit
```

### Additional Requirements
- **Idempotency**: Include `withIdempotency` for all write operations
- **Input Validation**: Use Zod schemas before processing any request
- **Organization Filtering**: Apply RLS and organization boundaries
- **PHI Handling**: Special care for Protected Health Information

## Operational Rules (Must Follow)

### Search and Create Discipline
- **Search before creating**: Always check if functionality exists before creating new files
- **Never duplicate**: Reuse existing components, schemas, and utilities
- **Request authorization**: If something is missing, ask for explicit path/file approval
- **Report all changes**: Document every modification in `/tmp` with detailed summaries

### Module Isolation
- **Do not touch other modules**: Never modify `src/modules/**` outside the current module scope
- **Respect boundaries**: Each module is independent - no cross-module file modifications
- **Use interfaces**: Cross-module communication only through defined ports/interfaces

### Schema Management
- **Use existing Zod schemas**: Always check for existing schemas before creating new ones
- **One schema per use case**: Create a specific Zod schema for each new clinical workflow
- **Zod as source of truth**: All validation must use Zod schemas, no custom validation
- **Share common schemas**: Place reusable clinical schemas in `shared/schemas`

### Clinical Data Handling
- **PHI Protection**: Never log, display, or transmit PHI without proper encryption
- **Audit Everything**: All clinical data access must be logged for compliance
- **Organization Boundaries**: All queries must filter by organization_id
- **Role Validation**: Verify clinical roles before allowing data access

## Example Clinical Modules

### Patients Module
- Demographics and contact information
- Medical history and allergies
- Insurance and billing information
- Care team assignments

### Appointments Module
- Scheduling with provider availability
- Conflict resolution and room booking
- Reminder notifications
- Check-in and check-out workflows

### Notes Module
- Clinical documentation templates
- Progress notes and assessments
- Digital signatures and co-signatures
- Compliance with clinical standards

### Billing Module
- Service coding (CPT, ICD-10)
- Insurance verification
- Claims processing
- Payment tracking

## Error Handling

### Clinical Context
- **Patient Safety**: Errors affecting patient care must be escalated
- **Data Integrity**: Validation errors must be clear and actionable
- **Audit Compliance**: All errors must be logged for regulatory review
- **User Experience**: Clinical staff need clear, context-aware error messages

### Technical Implementation
- **Result Pattern**: Use for business logic error handling
- **Error Boundaries**: Catch and display UI errors gracefully
- **Telemetry**: Automatic error reporting without PHI
- **Fallbacks**: Provide safe defaults for critical clinical workflows

## Development Checklist

Before marking any task complete:
- [ ] Searched existing code for similar functionality
- [ ] Documented work in `/tmp` with detailed report
- [ ] Validated layer boundaries (ui → application → domain)
- [ ] Applied proper security wrappers and organization filtering
- [ ] Used Zod schemas for all input/output validation
- [ ] Ensured HIPAA compliance (no PHI in logs)
- [ ] Tested accessibility features
- [ ] Verified multi-tenant isolation
- [ ] Added appropriate audit logging
- [ ] Followed semantic design token usage

## PLANTILLA AUDIT SUMMARY (OBLIGATORIA)

**Incluir SIEMPRE antes de cualquier APPLY:**

```markdown
## AUDIT SUMMARY

### 📋 Contexto de la Tarea
[Descripción breve de lo que se va a implementar]

### 🔍 Búsqueda por Directorios
| Directorio | Hallazgos | Rutas Exactas | Decisión |
|------------|-----------|---------------|----------|
| src/modules/[X] | [componentes encontrados] | [rutas completas] | Reutilizar/Crear |
| src/shared/ui | [primitives encontrados] | [rutas completas] | Reutilizar/Crear |
| src/shared/schemas | [schemas encontrados] | [rutas completas] | Reutilizar/Crear |

### 🏗️ Arquitectura & Capas
- **SoC Compliance**: UI→Application→Domain→Infrastructure ✅/❌
- **Rutas/Aliases confirmados**: [paths exactos sin suposiciones] ✅/❌
- **Límites de módulos**: [no cross-module modifications] ✅/❌

### 🔒 RLS/Multi-tenant
- **Organization ID**: [cómo se aplica organization_id en esta tarea]
- **Provider Roles**: [validaciones de roles clínicos requeridas]
- **PHI Protection**: [medidas de protección de datos de pacientes]

### ✅ Validación Zod
- **Schemas existentes**: [schemas a reutilizar]
- **Schemas nuevos**: [schemas a crear y ubicación]
- **Ubicación**: shared/schemas vs module-specific

### 🎨 UI & Accesibilidad
- **Tokens v4**: [uso de tokens semánticos, no hardcode] ✅/❌
- **Accesibilidad**: [ARIA labels, targets ≥44px, contraste] ✅/❌
- **Container Queries**: [responsive design considerations] ✅/❌

### 🛡️ Wrappers BFF
- **Orden requerido**: withAuth → withSecurity → withRateLimit → withAudit
- **Idempotency**: [añadir withIdempotency si es mutación] ✅/❌
- **PHI Handling**: [special care for clinical data] ✅/❌

### 📁 ALLOWED PATHS / DO NOT TOUCH
- **Permitidos**: [rutas específicas donde se puede escribir]
- **Prohibidos**: [rutas que no se deben tocar]
- **Riesgos**: [potential rollback scenarios]

### 🚦 Go/No-Go Decision
- **Status**: Go ✅ / No-Go ❌
- **Reason Codes**: [si No-Go, listar códigos aplicables]
```

## Conformidad Health (Referencias IMPLEMENTATION_GUIDE.md)

### Puntos No Negociables del Proyecto Health
- **[Sección 2] SoC Estricto**: UI no llama infraestructura (lines 26-41)
- **[Sección 3] RLS Multi-tenant**: organization_id en todas las queries (lines 44-53)
- **[Sección 5] UI Tokens v4**: OKLCH, no hardcode (lines 65-94)
- **[Sección 6] Forms Clínicos**: RHF + Zod obligatorio (lines 95-104)
- **[Sección 12] Production Checklist**: 22 puntos healthcare (lines 138-161)
- **[Sección 13] PR Checklist**: 15 validaciones clínicas (lines 162-173)

### Critical Reminders
- **AUDIT SUMMARY PRIMERO**: Usar plantilla antes de cada APPLY
- **PHI SAFETY**: No PHI en logs, console, o telemetría
- **ORGANIZATION BOUNDARIES**: Filtrar por organization_id siempre
- **LAYER RESPECT**: UI→Application→Domain→Infrastructure
- **REPORT EVERYTHING**: Documentar todo en `/tmp` sin PHI