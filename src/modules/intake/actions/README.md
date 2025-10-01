# ACTIONS LAYER - Server Actions Only

## REBUILD FROM SCRATCH - SoC Rules

### ✅ BELONGS HERE
- Server actions with "use server" directive
- Direct database operations
- External API calls
- Authentication/authorization checks
- Audit logging
- Error handling with proper sanitization

### ❌ NEVER PUT HERE
- UI components
- Client-side state
- Business logic (goes to Application)
- Domain models (goes to Domain)
- Validation schemas (goes to Domain)

### File Naming Convention
- `{entity}.actions.ts` (e.g., demographics.actions.ts)
- One file per entity/step
- NO duplication across steps

### Security Requirements
- Always wrap with security wrappers
- Multi-tenant organization context
- Rate limiting per organization
- PHI handling with audit trail

## DO NOT ADD PHI IN CLIENT STATE. FOLLOW SoC 100%.