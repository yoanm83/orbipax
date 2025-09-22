# Auth Module

Authentication module following clean architecture principles.

## Structure

- **ui/**: React components for authentication interfaces
- **application/**: Hooks, actions, and use cases
- **domain/**: Business entities and type definitions
- **infrastructure/**: External services (Supabase, etc.)
- **tests/**: Module testing

## Dependencies

```
ui → application → domain
     ↓
infrastructure
```

## Phase 2 Implementation

- Wire UI components with OrbiPax primitives
- Implement form logic and validation
- Connect Supabase authentication
- Add accessibility compliance