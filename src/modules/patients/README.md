# Patients Module

Community Mental Health patient management module following clean architecture principles.

## Structure

```
src/modules/patients/
├── ui/                 # React components and UI logic
│   ├── PatientsList.tsx    # Main list view with states
│   ├── PatientForm.tsx     # Create/edit form with validation
│   ├── EmptyState.tsx      # Reusable empty state component
│   └── Toolbar.tsx         # Search and action toolbar
├── application/        # Use cases and application services (TBD)
├── domain/            # Patient entities and business rules (TBD)
├── infrastructure/    # Data persistence and external services (TBD)
└── tests/            # Unit and integration tests
```

## Import Boundaries

- **UI Layer:** Can import React, Next.js, shared UI components, type definitions
- **Application Layer:** Can import Domain entities, Infrastructure interfaces, shared utilities
- **Domain Layer:** Can import only other domain entities and pure utilities
- **Infrastructure Layer:** Can import Domain entities, Application interfaces, external libraries

## Route Integration

The UI components are integrated into the app routing structure:

- `/(app)/patients` → PatientsList with Toolbar
- `/(app)/patients/new` → PatientForm (create mode)
- `/(app)/patients/[id]/edit` → PatientForm (edit mode)

## Future Application Layer Integration

When implementing business logic:

1. Create Application services in `application/` directory
2. Define Domain entities in `domain/` directory
3. Implement Infrastructure adapters in `infrastructure/` directory
4. Update UI components to call Application services instead of placeholder alerts

## Testing

Basic component tests are included in `tests/patients.ui.test.tsx`.
Requires Jest and React Testing Library setup for execution.

## Accessibility

All components follow WCAG 2.2 AA guidelines:
- Proper form labels and ARIA attributes
- Focus-visible rings using design tokens
- Screen reader support with role attributes
- Error announcements with `role="alert"`