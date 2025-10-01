# APPLICATION LAYER - Business Logic & Orchestration

## REBUILD FROM SCRATCH - SoC Rules

### ✅ BELONGS HERE
- Business logic and use cases
- Service orchestration
- Data transformation between layers
- DTOs (Data Transfer Objects)
- Mappers (Domain ↔ DTO)
- Business validation rules
- AI/ML services integration

### ❌ NEVER PUT HERE
- Server actions (goes to Actions)
- UI components (goes to UI)
- Database queries (goes to Actions/Infrastructure)
- Domain schemas (goes to Domain)
- UI state management (goes to State)

### Folder Structure
```
application/
├── step1/
│   ├── demographics.service.ts
│   ├── demographics.dto.ts
│   └── demographics.mapper.ts
├── step2/
│   └── insurance.service.ts
└── ai/
    └── suggestionService.ts
```

### Key Principles
- One service per business capability
- Services are stateless
- Transform domain models to DTOs
- NO direct database access
- NO UI concerns

## DO NOT ADD PHI IN CLIENT STATE. FOLLOW SoC 100%.