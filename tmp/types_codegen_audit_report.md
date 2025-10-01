# Type Generation Audit Report

**Date**: 2025-09-29
**Task**: Audit type generation mechanism (DB→TS) in OrbiPax repository
**Status**: ✅ COMPLETE (AUDIT-ONLY)

---

## EXECUTIVE SUMMARY

OrbiPax currently **does not have database type generation configured**. The codebase uses untyped Supabase clients with manual type definitions. Supabase CLI is available via `npx` and can generate TypeScript types from the database schema.

---

## 1. CURRENT STATE ANALYSIS

### Type Generation Mechanism
- **Generator Detected**: Supabase CLI (v2.47.2 via npx)
- **Current Configuration**: NONE - No type generation setup found
- **Output Files**: NONE - No generated type files exist

### Package.json Scripts
```json
// No type generation scripts found
// Available scripts: dev, build, lint, typecheck, format, test
```

### Dependencies
- `@supabase/supabase-js`: ^2.57.4 (runtime client)
- `@supabase/ssr`: ^0.7.0 (SSR support)
- No dev dependencies for type generation

---

## 2. CURRENT TYPE USAGE

### Manual Type Definitions
Modules are defining their own database types manually:

```typescript
// Example from patients.actions.ts
export type PatientRow = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
};
```

### Untyped Supabase Clients
```typescript
// src/shared/lib/supabase.server.ts
import { createClient } from "@supabase/supabase-js";

export function getServiceClient() {
  return createClient(url, serviceKey, { auth: { persistSession: false } });
  // Returns untyped SupabaseClient
}
```

---

## 3. MODULES CONSUMING DATABASE TYPES

### Direct Database Access Modules
| Module | File | Usage |
|--------|------|-------|
| **auth** | `infrastructure/supabase/auth.adapter.ts` | Auth operations |
| **appointments** | `application/appointments.actions.ts` | CRUD operations |
| **encounters** | `application/encounters.actions.ts` | CRUD operations |
| **notes** | `application/notes.actions.ts` | CRUD operations |
| **patients** | `application/patients.actions.ts` | CRUD operations |
| **organizations** | `application/organizations.actions.ts` | Org queries |
| **intake** | `application/review.actions.ts` | Submission queries |

### Shared Infrastructure
- `src/shared/lib/supabase.server.ts` - Service client (untyped)
- `src/shared/lib/supabase.client.ts` - Browser/SSR client (untyped)

---

## 4. REQUIRED ENVIRONMENT VARIABLES

### For Runtime (Already Configured)
```bash
NEXT_PUBLIC_SUPABASE_URL    # Public Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public anonymous key
SUPABASE_SERVICE_ROLE       # Service role key (server-only)
```

### For Type Generation (Needed)
```bash
# Option 1: Remote generation
SUPABASE_PROJECT_ID         # Project ID from dashboard

# Option 2: Direct DB connection
DATABASE_URL                # postgresql://... connection string

# Option 3: Local development
# Requires supabase init and local setup
```

---

## 5. RECOMMENDED TYPE GENERATION SETUP

### Proposed Command
```bash
npx supabase gen types typescript \
  --project-id $SUPABASE_PROJECT_ID \
  --schema orbipax_core \
  --schema public \
  > src/lib/database.types.ts
```

### Alternative with DB URL
```bash
npx supabase gen types typescript \
  --db-url $DATABASE_URL \
  --schema orbipax_core \
  --schema public \
  > src/lib/database.types.ts
```

### Proposed Output Location
`src/lib/database.types.ts` - Central database types file

---

## 6. APPLY PLAN (Single Step)

### Command to Execute (DO NOT RUN YET)
```bash
# Step 1: Generate types
npx supabase gen types typescript \
  --project-id <PROJECT_ID_FROM_ENV> \
  --schema orbipax_core \
  --schema public \
  > src/lib/database.types.ts

# Step 2: Add to package.json scripts
"gen:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID --schema orbipax_core --schema public > src/lib/database.types.ts"
```

### Files to be Created/Modified

#### CREATE: `src/lib/database.types.ts`
- Generated TypeScript types for all database tables
- Type-safe table definitions
- Enums and custom types
- Row types for each table

#### MODIFY: `src/shared/lib/supabase.server.ts`
```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types"; // ADD THIS

export function getServiceClient() {
  return createClient<Database>(url, serviceKey, { // ADD <Database>
    auth: { persistSession: false }
  });
}
```

#### MODIFY: `src/shared/lib/supabase.client.ts`
```typescript
import type { Database } from "@/lib/database.types"; // ADD THIS

export function createClient() {
  return createBrowserClient<Database>(url, anonKey); // ADD <Database>
}

export async function createServerClient() {
  return createSupabaseServerClient<Database>(url, anonKey, { // ADD <Database>
    // ... existing config
  });
}
```

---

## 7. IMPACT ANALYSIS BY LAYER

### Application Layer
- **Ports**: Can use generated types for repository interfaces
- **DTOs**: Can derive from `Database['orbipax_core']['Tables']`
- **Actions**: Type-safe queries with autocomplete

### Infrastructure Layer
- **Repositories**: Direct use of generated row types
- **Adapters**: Type-safe Supabase client operations

### Domain Layer
- **No Impact**: Domain remains source of truth (Zod schemas)
- **Validation**: Domain validates, DB types for persistence

---

## 8. MIGRATION PATH

### Phase 1: Generate Types (Immediate)
1. Add PROJECT_ID to environment
2. Run type generation command
3. Commit generated types file

### Phase 2: Apply to Shared Libs (Week 1)
1. Update Supabase client factories with `<Database>` generic
2. Test existing functionality
3. Fix any type mismatches

### Phase 3: Migrate Modules (Week 2-3)
1. Replace manual `PatientRow` types with generated types
2. Update repository implementations
3. Add type safety to queries

### Phase 4: Full Type Coverage (Week 4)
1. All database operations type-safe
2. Remove manual type definitions
3. Add CI/CD type generation step

---

## 9. VERIFICATION CHECKLIST

### Post-Generation Verification
```bash
# 1. Type generation successful
ls -la src/lib/database.types.ts

# 2. TypeScript compilation
npm run typecheck

# 3. Linting passes
npm run lint

# 4. Build succeeds
npm run build
```

### Expected Generated Structure
```typescript
export type Database = {
  orbipax_core: {
    Tables: {
      patients: {
        Row: { /* column types */ }
        Insert: { /* insert types */ }
        Update: { /* update types */ }
      }
      insurance_records: { /* ... */ }
      authorization_records: { /* ... */ }
      // ... other tables
    }
    Views: { /* ... */ }
    Functions: { /* ... */ }
    Enums: { /* ... */ }
  }
  public: { /* ... */ }
}
```

---

## 10. ALLOWED PATHS FOR APPLY

### Read/Write Allowed
```
src/lib/database.types.ts         # CREATE - Generated types
src/shared/lib/supabase.server.ts # MODIFY - Add type generic
src/shared/lib/supabase.client.ts # MODIFY - Add type generic
package.json                       # MODIFY - Add gen:types script
```

### Read-Only Reference
```
src/modules/*/application/*.actions.ts
src/modules/*/infrastructure/repositories/*.ts
```

---

## 11. RISKS AND MITIGATION

### Risk 1: Type Mismatches
**Issue**: Generated types may not match manual definitions
**Mitigation**: Gradual migration, module by module

### Risk 2: Missing Tables/Columns
**Issue**: New schema changes not reflected
**Mitigation**: Regular type regeneration in CI/CD

### Risk 3: Breaking Changes
**Issue**: Type changes break existing code
**Mitigation**: Type generation in PR checks before merge

---

## 12. BENEFITS OF TYPE GENERATION

1. **Type Safety**: Compile-time checking of database queries
2. **Autocomplete**: IDE support for table/column names
3. **Refactoring**: Safe renaming and schema changes
4. **Documentation**: Types serve as schema documentation
5. **Error Prevention**: Catch typos and wrong column names
6. **DX Improvement**: Better developer experience

---

## CONCLUSION

**Current State**: No type generation configured, using untyped Supabase clients

**Recommendation**: Implement Supabase type generation immediately

**Next Action**:
1. Obtain SUPABASE_PROJECT_ID from environment
2. Run type generation command
3. Update Supabase client factories
4. Gradually migrate modules to use generated types

**Effort Estimate**:
- Initial setup: 30 minutes
- Full migration: 1-2 sprints

The repository is ready for type generation with minimal changes required to existing code.