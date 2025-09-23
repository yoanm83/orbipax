# Dashboard Module

Community Mental Health dashboard module following clean architecture principles.

## Structure

```
src/modules/dashboard/
├── ui/                 # React components and UI logic
│   ├── components/     # Individual dashboard components
│   │   ├── StatusCard.tsx       # System status and metrics
│   │   ├── NextStepsCard.tsx    # Setup progress guidance
│   │   └── QuickActionsCard.tsx # Common action shortcuts
│   └── DashboardView.tsx        # Main dashboard layout
├── application/        # Use cases and application services
│   └── hooks/          # Dashboard-specific hooks
├── domain/            # Dashboard entities and business rules
│   └── types/         # Dashboard type definitions
└── tests/            # Unit and integration tests
```

## Import Boundaries

- **UI Layer:** Can import React, Next.js, shared UI components, type definitions
- **Application Layer:** Can import Domain entities, other module interfaces, shared utilities
- **Domain Layer:** Can import only dashboard domain entities and pure utilities

## Route Integration

The dashboard components are integrated into the app routing structure:

- `/(app)` → DashboardView with aggregated module data

## Cross-Module Dependencies

The dashboard aggregates data from multiple modules:

- **Patients module:** Active patient counts
- **Scheduling module:** Upcoming appointments
- **Notes module:** Pending documentation
- **Admin module:** System status and monitoring

## Future Application Layer Integration

When implementing business logic:

1. Create Application services in `application/` directory
2. Define Domain entities in `domain/` directory
3. Update UI components to call Application services for real data
4. Implement cross-module data aggregation patterns

## Testing

Component tests will be included in `tests/dashboard.ui.test.tsx`.
Requires Jest and React Testing Library setup for execution.

## Accessibility

All components follow WCAG 2.2 AA guidelines:
- Proper semantic landmarks and ARIA attributes
- Focus-visible rings using design tokens
- Screen reader support with role attributes
- Touch targets meeting 44px minimum requirements