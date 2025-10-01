# DOMAIN LAYER - Core Business Models & Rules

## REBUILD FROM SCRATCH - SoC Rules

### ✅ BELONGS HERE
- Zod schemas for validation
- Domain types and interfaces
- Business entities
- Value objects
- Enums and constants
- USCDI v4 compliant definitions
- HIPAA-compliant data structures

### ❌ NEVER PUT HERE
- UI components
- Server actions
- Database operations
- Application services
- State management
- External API calls

### Folder Structure
```
domain/
├── schemas/       # Zod validation schemas
│   ├── demographics.schema.ts
│   ├── insurance.schema.ts
│   └── step{N}/
│       └── {entity}.schema.ts
└── types/         # TypeScript types & enums
    └── common.ts  # Shared types across steps
```

### Schema Rules
- Use Zod for ALL validations
- Export inferred TypeScript types
- One schema per business entity
- Compose schemas for complex objects
- USCDI v4 field compliance

### Type Rules
- Brand types for IDs (PatientId, OrganizationId)
- Enums for fixed value sets
- Interfaces for contracts
- NO implementation logic

## DO NOT ADD PHI IN CLIENT STATE. FOLLOW SoC 100%.