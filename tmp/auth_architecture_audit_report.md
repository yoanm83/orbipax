# OrbiPax Auth Architecture Audit Report

**Date:** September 2025
**Scope:** Complete authentication system analysis for modular-monolith architecture
**Objective:** Propose production-ready auth structure following SoC principles

## 🔍 Current State Analysis

### App Router Structure (Next.js 15.5.3)
```
src/app/
├── layout.tsx                          # Root layout (minimal)
├── providers.tsx                       # AppProviders (placeholder)
├── (app)/                              # Authenticated routes group
│   ├── layout.tsx                      # AppShellLayout with AuthGate
│   └── onboarding/                     # Org management flows
│       ├── new-org/page.tsx            # Create organization
│       └── switch-org/page.tsx         # Switch organization
└── (public)/                           # Unauthenticated routes group
    ├── layout.tsx                      # PublicLayout (simple)
    ├── login/page.tsx                  # Demo login implementation
    └── logout/page.tsx                 # Demo logout implementation
```

### Current Auth Implementation
**Location:** `src/shared/auth/`
- ✅ **AuthGate component** (`auth-gate.client.tsx`) - Client-side route protection
- ✅ **Placeholder auth utilities** (`auth-placeholder.ts`) - Cookie-based demo auth
- ❌ **No middleware** - Missing Next.js middleware for server-side protection
- ❌ **No server components** - All auth logic is client-side
- ❌ **No session management** - Simple cookie "opx_auth=1"

### Module Architecture Pattern
**Detected SoC Pattern:**
```
src/modules/{domain}/
├── application/        # Use cases, actions, services
├── domain/            # Business logic, entities
├── infrastructure/    # External adapters, DB
├── tests/             # Domain tests
└── ui/                # Components (no business logic)
```

**Existing modules:** organizations, billing, clinicians, appointments, admin, patients

### Dependencies & Infrastructure
- ✅ **Supabase configured** (`.env.example` shows SUPABASE_URL + keys)
- ✅ **Tailwind v4** with semantic design tokens
- ✅ **React 19** with Server Components support
- ❌ **No auth middleware** integration
- ❌ **No RLS/multitenancy** patterns detected

### Route Groups Structure
- `(app)/*` - Protected routes with AuthGate + AppShell layout
- `(public)/*` - Public routes with minimal layout
- **Missing:** `(auth)/*` group for auth-specific flows

## 📋 Gaps Analysis

### Critical Missing Components
1. **Server-side protection** - No middleware for RSC/API routes
2. **Signup/Registration flow** - Only login exists
3. **Password reset flow** - No forgot/reset pages
4. **Email verification** - No verification flow
5. **Auth module** - No dedicated auth domain module
6. **Session management** - No proper session handling
7. **Error boundaries** - No auth-specific error handling

### Security Concerns
1. **Client-only auth** - Vulnerable to bypassing
2. **Simple cookie** - No JWT/session tokens
3. **No CSRF protection** - Missing token validation
4. **No rate limiting** - Auth endpoints unprotected
5. **No audit logging** - No security event tracking

## 🎯 Proposed Architecture

### Route Structure (Complete Auth Flows)
```
src/app/
├── (auth)/                             # Authentication flows group
│   ├── layout.tsx                      # AuthLayout (minimal, no navigation)
│   ├── login/page.tsx                  # Enhanced login page
│   ├── signup/page.tsx                 # User registration
│   ├── verify-email/page.tsx           # Email verification
│   ├── forgot-password/page.tsx        # Request password reset
│   ├── reset-password/page.tsx         # Password reset form
│   └── two-factor/page.tsx             # 2FA setup/verification (optional)
├── (app)/                              # Protected routes (existing)
└── (public)/                           # Public routes (existing)
```

### Auth Module Structure (SoC Compliant)
```
src/modules/auth/
├── application/                        # Use cases & actions
│   ├── auth.actions.ts                 # Server Actions (login, signup, etc.)
│   ├── session.service.ts              # Session management
│   ├── email.service.ts                # Email verification
│   └── password.service.ts             # Password reset logic
├── domain/                             # Business logic
│   ├── entities/
│   │   ├── user.entity.ts              # User domain entity
│   │   ├── session.entity.ts           # Session domain entity
│   │   └── auth-event.entity.ts        # Security events
│   ├── repositories/
│   │   ├── user.repository.ts          # User data interface
│   │   └── session.repository.ts       # Session data interface
│   └── services/
│       ├── password.service.ts         # Password hashing/validation
│       ├── token.service.ts            # JWT/token management
│       └── audit.service.ts            # Security audit logging
├── infrastructure/                     # External adapters
│   ├── supabase/
│   │   ├── user.adapter.ts             # Supabase user operations
│   │   ├── session.adapter.ts          # Supabase session management
│   │   └── auth.adapter.ts             # Supabase Auth integration
│   ├── email/
│   │   └── email.adapter.ts            # Email provider integration
│   └── rate-limit/
│       └── rate-limit.adapter.ts       # Rate limiting implementation
├── tests/                              # Domain & integration tests
│   ├── auth.actions.test.ts
│   ├── password.service.test.ts
│   └── session.service.test.ts
└── ui/                                 # Auth-specific components
    ├── components/
    │   ├── LoginForm.tsx               # Login form component
    │   ├── SignupForm.tsx              # Registration form
    │   ├── PasswordResetForm.tsx       # Password reset form
    │   ├── EmailVerificationForm.tsx   # Email verification
    │   ├── TwoFactorForm.tsx           # 2FA components (optional)
    │   └── AuthErrorBoundary.tsx       # Auth error handling
    ├── providers/
    │   ├── SessionProvider.tsx         # Session context
    │   └── AuthProvider.tsx            # Auth state management
    └── hooks/
        ├── useAuth.ts                  # Auth state hook
        ├── useSession.ts               # Session hook
        └── useAuthRedirect.ts          # Redirect handling
```

### Enhanced Shared Auth (Server-side)
```
src/shared/auth/
├── middleware.ts                       # Next.js middleware (route protection)
├── session.server.ts                  # Server-side session utilities
├── auth.server.ts                     # Server-side auth helpers
├── guards/
│   ├── auth.guard.ts                   # Route protection logic
│   ├── role.guard.ts                   # Role-based access control
│   └── org.guard.ts                    # Organization access control
└── types/
    ├── auth.types.ts                   # Auth type definitions
    ├── session.types.ts                # Session type definitions
    └── user.types.ts                   # User type definitions
```

## 📁 Exact File Paths for Creation

### 1. Route Pages (Authentication Flows)
```
D:\ORBIPAX-PROJECT\src\app\(auth)\layout.tsx
D:\ORBIPAX-PROJECT\src\app\(auth)\login\page.tsx
D:\ORBIPAX-PROJECT\src\app\(auth)\signup\page.tsx
D:\ORBIPAX-PROJECT\src\app\(auth)\verify-email\page.tsx
D:\ORBIPAX-PROJECT\src\app\(auth)\forgot-password\page.tsx
D:\ORBIPAX-PROJECT\src\app\(auth)\reset-password\page.tsx
D:\ORBIPAX-PROJECT\src\app\(auth)\two-factor\page.tsx
```

### 2. Auth Module Structure
```
D:\ORBIPAX-PROJECT\src\modules\auth\README.md
D:\ORBIPAX-PROJECT\src\modules\auth\application\auth.actions.ts
D:\ORBIPAX-PROJECT\src\modules\auth\application\session.service.ts
D:\ORBIPAX-PROJECT\src\modules\auth\application\email.service.ts
D:\ORBIPAX-PROJECT\src\modules\auth\application\password.service.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\entities\user.entity.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\entities\session.entity.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\entities\auth-event.entity.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\repositories\user.repository.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\repositories\session.repository.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\services\password.service.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\services\token.service.ts
D:\ORBIPAX-PROJECT\src\modules\auth\domain\services\audit.service.ts
D:\ORBIPAX-PROJECT\src\modules\auth\infrastructure\supabase\user.adapter.ts
D:\ORBIPAX-PROJECT\src\modules\auth\infrastructure\supabase\session.adapter.ts
D:\ORBIPAX-PROJECT\src\modules\auth\infrastructure\supabase\auth.adapter.ts
D:\ORBIPAX-PROJECT\src\modules\auth\infrastructure\email\email.adapter.ts
D:\ORBIPAX-PROJECT\src\modules\auth\infrastructure\rate-limit\rate-limit.adapter.ts
D:\ORBIPAX-PROJECT\src\modules\auth\ui\components\LoginForm.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\components\SignupForm.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\components\PasswordResetForm.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\components\EmailVerificationForm.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\components\TwoFactorForm.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\components\AuthErrorBoundary.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\providers\SessionProvider.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\providers\AuthProvider.tsx
D:\ORBIPAX-PROJECT\src\modules\auth\ui\hooks\useAuth.ts
D:\ORBIPAX-PROJECT\src\modules\auth\ui\hooks\useSession.ts
D:\ORBIPAX-PROJECT\src\modules\auth\ui\hooks\useAuthRedirect.ts
```

### 3. Enhanced Shared Auth
```
D:\ORBIPAX-PROJECT\src\shared\auth\middleware.ts
D:\ORBIPAX-PROJECT\src\shared\auth\session.server.ts
D:\ORBIPAX-PROJECT\src\shared\auth\auth.server.ts
D:\ORBIPAX-PROJECT\src\shared\auth\guards\auth.guard.ts
D:\ORBIPAX-PROJECT\src\shared\auth\guards\role.guard.ts
D:\ORBIPAX-PROJECT\src\shared\auth\guards\org.guard.ts
D:\ORBIPAX-PROJECT\src\shared\auth\types\auth.types.ts
D:\ORBIPAX-PROJECT\src\shared\auth\types\session.types.ts
D:\ORBIPAX-PROJECT\src\shared\auth\types\user.types.ts
```

### 4. Root Middleware
```
D:\ORBIPAX-PROJECT\middleware.ts
```

## 🔒 Security & Multitenancy Considerations

### Organization-based Security
- **RLS (Row Level Security)** - Supabase table policies by organization
- **Organization switching** - Secure context switching with session updates
- **Role-based access** - Per-organization role management
- **Audit trails** - Security events with organization context

### Session Management
- **HttpOnly cookies** - Secure session tokens
- **CSRF protection** - Request token validation
- **Session rotation** - Regular token refresh
- **Device tracking** - Multi-device session management

### Rate Limiting & Protection
- **Login attempts** - Per-IP and per-email limits
- **Password reset** - Time-based request limiting
- **Email verification** - Resend throttling
- **API protection** - Authenticated endpoint limits

## 📋 Implementation Checklist

### Phase 1: Foundation (APPLY Step)
- [ ] Create auth module directory structure
- [ ] Create auth route group `(auth)/`
- [ ] Add Next.js middleware file
- [ ] Create placeholder README.md files
- [ ] Basic TypeScript interfaces
- [ ] Update existing login to use new structure

### Phase 2: Core Auth (Future)
- [ ] Implement server actions for auth operations
- [ ] Add Supabase Auth integration
- [ ] Create session management system
- [ ] Add email verification flow
- [ ] Implement password reset flow

### Phase 3: Security (Future)
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add audit logging
- [ ] Security testing
- [ ] Production security review

### Phase 4: Enhancement (Future)
- [ ] Two-factor authentication
- [ ] Social login providers
- [ ] Advanced session features
- [ ] Mobile app integration

## 🎯 Allowed Paths for APPLY Step

### READ PERMISSIONS
- `D:\ORBIPAX-PROJECT\src\**` (full read access)
- `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\**` (UI components reference)

### WRITE PERMISSIONS (Placeholder Creation Only)
- `D:\ORBIPAX-PROJECT\src\app\(auth)\**` (new auth routes)
- `D:\ORBIPAX-PROJECT\src\modules\auth\**` (new auth module)
- `D:\ORBIPAX-PROJECT\src\shared\auth\**` (enhanced shared auth)
- `D:\ORBIPAX-PROJECT\middleware.ts` (root middleware)

### RESTRICTIONS
- ❌ No database/schema modifications
- ❌ No environment variable changes
- ❌ No build configuration changes
- ❌ No existing file modifications (except moving login)
- ❌ No mock data - only placeholders with TODO comments

## 🚨 Risk Assessment

### High Priority Risks
1. **Route conflicts** - New `(auth)` group may conflict with existing routes
2. **Session migration** - Moving from cookie to proper session system
3. **Organization context** - Ensuring auth integrates with org switching
4. **Middleware performance** - Avoiding request blocking

### Mitigation Strategies
1. **Gradual migration** - Keep existing auth working during transition
2. **Feature flags** - Enable new auth flows incrementally
3. **Backward compatibility** - Maintain existing API contracts
4. **Performance monitoring** - Track middleware impact

### Dependencies Validation
- ✅ **Supabase Auth** - Already configured in environment
- ✅ **React 19** - Server Components support available
- ✅ **Next.js 15** - App Router with route groups
- ✅ **Tailwind v4** - UI primitive compatibility
- ❌ **Database schema** - Auth tables need creation (future step)

## 📖 Next Steps Summary

1. **Create directory structure** with placeholder files
2. **Add README.md** to each new directory with purpose
3. **Define TypeScript interfaces** for auth types
4. **Create minimal route pages** with TODO placeholders
5. **Add basic middleware file** with placeholder logic
6. **Update route structure** to use new `(auth)` group
7. **Document integration points** for future implementation

This architecture provides a solid foundation for enterprise-grade authentication while maintaining the existing modular-monolith pattern and ensuring seamless integration with the current OrbiPax codebase.