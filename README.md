# OrbiPax - Community Mental Health Management System

A modular monolith CMH application built with React 19, Next.js, and Tailwind CSS.
Follows clean architecture principles with strict separation of concerns.
HIPAA-compliant design with comprehensive audit trails and access controls.
Organized into vertical modules for patients, clinicians, scheduling, notes, billing, messaging, and administration.

## Quality Automation

OrbiPax enforces strict code quality standards through automated tooling and CI/CD pipelines.

### Local Development Commands

```bash
# Run all quality checks (recommended before pushing)
npm run quality

# Individual quality checks
npm run typecheck    # TypeScript strict type checking
npm run lint         # ESLint with architectural boundary enforcement
npm run lint:fix     # Auto-fix ESLint violations where possible
npm run format       # Auto-format code with Prettier
npm run format:check # Check if code is properly formatted

# Development workflow
npm run dev          # Start development server
npm run build        # Production build verification
npm run test         # Run test suite
```

### Automated Quality Gates

#### Pre-commit Hook
- Automatically runs on `git commit`
- Executes `lint-staged` to format and lint only staged files
- Formats TypeScript, JavaScript, JSON, Markdown, and CSS files
- Fixes ESLint violations automatically where possible

#### Pre-push Hook
- Automatically runs on `git push`
- Executes full quality check: `npm run quality`
- Runs TypeScript compilation and ESLint validation
- Prevents pushing code that violates architectural boundaries

#### CI/CD Pipeline
- Runs on all pushes to `main` branch and pull requests
- **Required checks that must pass:**
  - TypeScript strict compilation (`npm run typecheck`)
  - ESLint validation with zero violations (`npm run lint`)
  - Prettier formatting verification (`npm run format:check`)
  - Production build validation (`npm run build`)

### Quality Standards

- **Zero ESLint violations** - No warnings or errors allowed
- **TypeScript strict mode** - All type safety checks enabled
- **Consistent formatting** - Prettier enforced across all files
- **Architectural boundaries** - Import restrictions enforced via ESLint
- **HIPAA compliance** - No console.log statements that could leak PHI

### Troubleshooting Quality Issues

If quality checks fail, refer to the development guides:
- **ESLint errors:** See `docs/soc/READ_ME_FIRST.md` for common fixes
- **Architectural violations:** Review `docs/soc/ARCH_RULES.md` for import boundaries
- **TypeScript errors:** Enable strict mode compliance in your editor

## App Scaffold

OrbiPax uses a clean React Server Components architecture with Next.js 15 and clear separation between public and authenticated areas.

### Route Groups

#### Public Routes (`/(public)`)
- **Purpose:** Marketing pages, landing, authentication flows
- **Layout:** Simple container with global styles
- **Access:** Open to all visitors
- **Example:** Landing page at `/(public)/page.tsx`

#### App Routes (`/(app)`)
- **Purpose:** Authenticated application features
- **Layout:** Full app shell with header, main content, and footer
- **Access:** Will include auth gating (to be implemented)
- **Example:** Dashboard at `/(app)/page.tsx`

### React Server Components (RSC)

- **Default:** All components are Server Components by default
- **Client Components:** Only `providers.tsx`, `globals-bridge.tsx`, and `error.tsx`
- **Business Logic:** NO business logic in app layer - delegates to `src/modules/**/application`
- **Data Fetching:** NO data fetching here - pure UI orchestration

### Adding New Module Pages

To add a new CMH module page (e.g., patients):

1. **Create UI in module:** `src/modules/patients/ui/PatientListPage.tsx`
2. **Export from module:** `src/modules/patients/index.ts`
3. **Import in app route:** `src/app/(app)/patients/page.tsx`

```tsx
// src/app/(app)/patients/page.tsx
import { PatientListPage } from '@/modules/patients';

export default function PatientsRoute() {
  return <PatientListPage />;
}
```

### Security & Performance

- **Security Headers:** CSP, X-Frame-Options, and more via `next.config.ts`
- **React 19 Features:** React Compiler enabled for optimal performance
- **Server Actions:** 2MB body size limit for form submissions
- **Tailwind Integration:** Single `globals.css` entry point via `globals-bridge.tsx`

## Navigation & Breadcrumbs

OrbiPax includes a comprehensive navigation system for the authenticated app shell, featuring primary navigation and contextual breadcrumbs.

### Components

#### AppNavbar (`src/shared/ui/nav/AppNavbar.tsx`)
- **Purpose:** Primary navigation for main CMH sections
- **Location:** Header area of `/(app)` layout
- **Features:** Active link highlighting, keyboard accessible, UI-only component
- **Current Sections:** Dashboard, Patients, Scheduling, Notes, Billing

#### NavLink (`src/shared/ui/nav/NavLink.tsx`)
- **Purpose:** Individual navigation link with active state logic
- **Active Detection:** Matches exact path or startsWith pattern for subsections
- **Accessibility:** Uses `aria-current="page"` and focus-visible rings
- **Styling:** Uses design tokens for accent colors and hover states

#### Breadcrumbs (`src/shared/ui/breadcrumbs/Breadcrumbs.tsx`)
- **Purpose:** Shows current location and provides navigation up the hierarchy
- **Route Parsing:** Automatically strips route group markers like `/(app)`
- **Segment Handling:** Converts kebab-case to Title Case for display
- **Accessibility:** Full ARIA labels with `aria-current="page"` for current location

### How to Add New Navigation Sections

1. **Add NavLink to AppNavbar:**
```tsx
<NavLink href="/(app)/new-section">New Section</NavLink>
```

2. **Create corresponding page:**
```tsx
// src/app/(app)/new-section/page.tsx
export default function NewSectionPage() {
  return <div>New section content</div>;
}
```

3. **Breadcrumbs automatically work** for any route structure under `/(app)`

### Navigation Features

- **Responsive Design:** Adapts to different screen sizes using Tailwind breakpoints
- **Active States:** Clear visual indication of current section
- **Keyboard Navigation:** Full tab support with visible focus indicators
- **Screen Reader Support:** Proper ARIA labels and semantic HTML
- **Route Group Aware:** Handles Next.js route groups transparently

## Patients UI Scaffold

OrbiPax includes a complete UI scaffold for patient management, demonstrating the modular architecture patterns for CMH workflows.

### Patient Module Structure

```
src/modules/patients/
├── ui/                 # React components (IMPLEMENTED)
│   ├── PatientsList.tsx    # List with empty/loading/error states
│   ├── PatientForm.tsx     # Create/edit form with validation
│   ├── EmptyState.tsx      # Reusable empty state component
│   └── Toolbar.tsx         # Search and action toolbar
├── application/        # Use cases and services (TBD)
├── domain/            # Patient entities and rules (TBD)
├── infrastructure/    # Data persistence (TBD)
└── tests/            # Component and integration tests
```

### Patient Routes

- **`/(app)/patients`** - Patient list with search and "New Patient" action
- **`/(app)/patients/new`** - Create new patient form
- **`/(app)/patients/[id]/edit`** - Edit existing patient form

### UI Components Features

- **PatientsList:** Handles empty, loading, error, and ready states with accessible table structure
- **PatientForm:** React Hook Form + Zod validation with WCAG 2.2 AA compliance
- **Toolbar:** Search functionality and primary actions with keyboard support
- **EmptyState:** Reusable component for no-data scenarios

### Manual Testing

1. **Navigate to Patients:** Visit `/(app)/patients` → See empty state with "New Patient" link
2. **Create Patient:** Click "New Patient" → Fill form → See demo alert
3. **Edit Patient:** Manually navigate to `/(app)/patients/123/edit` → See edit form
4. **Breadcrumbs:** Verify breadcrumb navigation works: "Home / Patients / New"
5. **Accessibility:** Tab through all form elements, verify focus rings and screen reader labels

### Future Integration

The UI scaffold is ready for Application layer integration:
- Form submissions will call Application services instead of alerts
- PatientsList will receive data from patient query use cases
- Domain entities will replace placeholder types
- Infrastructure layer will handle data persistence

## Environment Setup

OrbiPax uses environment variables for configuration and external service integration.

### Setup Steps

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in required values:**
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
   - `SUPABASE_SERVICE_ROLE` - Your Supabase service role key (server-only)

3. **Verify security:**
   - Confirm `.env.local` is listed in `.gitignore`
   - Never commit secrets to version control
   - Never paste secrets into issues, commits, or reports

### Environment Variables

#### Public (Client-Safe)
- `NEXT_PUBLIC_APP_NAME` - Application name for branding
- `NEXT_PUBLIC_ENV` - Environment identifier (development/production)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

#### Server-Only (Private)
- `SUPABASE_SERVICE_ROLE` - Supabase service role key with elevated permissions
- `OPENAI_API_KEY` - OpenAI API key for AI-powered features
- `DATABASE_URL` - Optional direct PostgreSQL connection for scripts

### OpenAI Key (Server-Only)

The OpenAI API key is used for AI-powered features in the CMH system and must be kept strictly on the server.

#### Setup Steps
1. **Copy environment template:** `cp .env.example .env.local`
2. **Fill OPENAI_API_KEY:** Replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key
3. **Never use NEXT_PUBLIC_:** This key must never be exposed to client bundles
4. **Server-only usage:** Import `getOpenAIKey()` only from Application layer or Server Actions

#### Usage Example
```typescript
// ✅ Correct: Server-side usage only
import { getOpenAIKey } from '@/shared/lib/env.server';

export async function generateClinicalSummary() {
  const apiKey = getOpenAIKey(); // Server-only
  // Use with OpenAI client...
}

// ❌ Never do this: Client component usage
"use client";
import { getOpenAIKey } from '@/shared/lib/env.server'; // Will throw error
```

### Important Notes

- **New Project Only:** We are using a new Supabase project with no legacy dependencies
- **Secret Management:** All sensitive values stay in `.env.local` and are never committed
- **Key Rotation:** Rotate keys immediately if they are ever exposed in commits or issues
- **Server-Only APIs:** OpenAI and service role keys must never reach client bundles

## Application Wiring (Server-Only Supabase)

OrbiPax now includes server-side Application layer integration with Supabase for patient management and appointment scheduling.

### Server-Only Architecture

#### Supabase Client Configuration
- **Service Role:** Uses `SUPABASE_SERVICE_ROLE` for server-side database operations
- **Security:** Service role key never exposed to client bundles
- **Authentication:** Supports both dev cookie (`opx_uid`) and production auth context

#### Available Actions
- **`listPatients()`** - Paginated patient list with name filtering
- **`createAppointment()`** - Schedule appointments with overlap validation

### Development Setup

#### Local Authentication Bridge
For local development, set a dev cookie to simulate user authentication:

1. **Open browser DevTools** → Application/Storage → Cookies
2. **Add cookie:** Name: `opx_uid`, Value: `123e4567-e89b-12d3-a456-426614174000` (or any UUID)
3. **Fallback:** If no cookie set, uses single-tenant mode (first organization)

#### Testing the Integration

**Patient List:** Visit `/(app)/patients`
- Should display actual patients from Supabase
- Search functionality filters by last name
- Shows "Jane Doe" and other seeded patients

**Create Appointment:** Visit `/(app)/scheduling/new`
- Fill all fields (patient UUID, clinician UUID, timestamps)
- Appointment creation validates time windows
- Overlapping appointments fail due to database constraints

### Security Implementation

#### Server-Side Only
```typescript
// ✅ Correct: Server Actions and API routes
import { getServiceClient } from '@/shared/lib/supabase.server';
const client = getServiceClient(); // Server-only

// ❌ Never do this: Client components
"use client";
import { getServiceClient } from '@/shared/lib/supabase.server'; // Will fail
```

#### No Client Exposure
- **Service Role:** Never imported in UI components
- **Import Restrictions:** `supabase.server.ts` marked with `"server-only"`
- **Actions Only:** UI components call Server Actions, never direct database access

### Implementation Notes

- **Row Level Security:** Uses organization_id for multi-tenant data isolation
- **Error Handling:** Generic error responses to avoid information leakage
- **Type Safety:** Full TypeScript types for all action inputs/outputs
- **Minimal Scope:** Only implements patient listing and appointment creation flows

## Patients CRUD (Application)

OrbiPax now includes complete patient management with create and update operations using proper Application layer patterns.

### Server Actions Implementation

#### Validation & Type Safety
- **Zod Schema:** Server-side validation for all patient data
- **Input Sanitization:** Safe parsing with generic error responses
- **Type Safety:** Full TypeScript coverage for inputs and outputs

#### Available Operations
- **`createPatient()`** - Create new patient with organization scoping
- **`updatePatient()`** - Update existing patient with RLS protection
- **Audit Logging:** Automatic audit trail for all patient operations

### Usage Pattern

#### Form Integration
```typescript
// UI components call Server Actions (never direct database)
const result = await createPatient({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
});

if (result.ok) {
  // Success: result.id contains patient ID
} else {
  // Error: result.error contains generic error code
}
```

#### Security Features
- **Organization Isolation:** All operations scoped to user's organization
- **Generic Errors:** No sensitive information exposed in error messages
- **Audit Trail:** Complete tracking of patient data changes
- **RLS Compliance:** Database-level access control enforcement