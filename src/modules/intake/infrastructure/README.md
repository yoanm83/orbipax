# INFRASTRUCTURE LAYER - External Integrations & Wrappers

## REBUILD FROM SCRATCH - SoC Rules

### ✅ BELONGS HERE
- Security wrappers (auth, rate limiting, audit)
- Database adapters
- External API clients
- File system operations
- Cache implementations
- Message queue integrations
- Monitoring/logging utilities

### ❌ NEVER PUT HERE
- Business logic (goes to Application)
- Domain models (goes to Domain)
- UI components (goes to UI)
- State management (goes to State)
- Direct server actions (goes to Actions)

### Folder Structure
```
infrastructure/
└── wrappers/
    └── security-wrappers.ts  # Auth, rate limit, audit chain
```

### Security Wrapper Chain
```typescript
withAuth → withSecurity → withRateLimit → withAudit
```

### Requirements
- Multi-tenant isolation
- Organization-scoped operations
- Rate limiting (10 req/min/org)
- Comprehensive audit logging
- Error sanitization
- Trace ID generation

## DO NOT ADD PHI IN CLIENT STATE. FOLLOW SoC 100%.