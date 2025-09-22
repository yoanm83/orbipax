// =================================================================
// ORBIPAX SECURITY WRAPPERS - TYPE CONTRACTS ONLY
// =================================================================
// Sentinel: Wrapper order must be withAuth → withSecurity → withRateLimit → withAudit (+ withIdempotency on mutations)
// NOTE: These are TYPE-ONLY placeholders to document contracts; do not add implementation here.
// UI must not import wrappers directly; used by Application layer only.

// =================================================================
// CORE TYPE DEFINITIONS
// =================================================================

/**
 * Standard input type for all application actions
 * Must be JSON-serializable for Next.js Server Actions
 */
export type ActionInput = Record<string, unknown>;

/**
 * Standard result type for all application actions
 * Must be plain objects - no class instances or functions
 */
export type ActionResult = {
  ok: boolean;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    timestamp: string;
    traceId: string;
    [key: string]: unknown;
  };
};

/**
 * Base wrapper function type for composable middleware
 * All wrappers must follow this signature for proper composition
 */
export type WrapperFunction = <I extends ActionInput, O extends ActionResult>(
  action: (input: I) => Promise<O>
) => (input: I) => Promise<O>;

// =================================================================
// SECURITY WRAPPER TYPE DEFINITIONS
// =================================================================

/**
 * Authentication wrapper - validates user identity
 * Must be first in the composition chain
 * Enriches context with authenticated user information
 */
export type WithAuth = WrapperFunction;

/**
 * Security wrapper - enforces authorization and access control
 * Must run after authentication
 * Implements RBAC and resource-level permissions for HIPAA compliance
 */
export type WithSecurity = WrapperFunction;

/**
 * Rate limiting wrapper - prevents abuse and ensures system stability
 * Must run after security validation
 * Implements per-user, per-resource rate limits
 */
export type WithRateLimit = WrapperFunction;

/**
 * Audit wrapper - logs all actions for compliance and monitoring
 * Must run after rate limiting
 * Creates immutable audit trails for HIPAA compliance
 */
export type WithAudit = WrapperFunction;

/**
 * Idempotency wrapper - ensures mutations can be safely retried
 * Must be last in the composition chain for mutations
 * Prevents duplicate operations on critical healthcare data
 */
export type WithIdempotency = WrapperFunction;

// =================================================================
// COMPOSITION HELPER TYPES
// =================================================================

/**
 * Standard composition for read operations
 * Auth → Security → RateLimit → Audit
 */
export type ReadActionWrapper = WithAuth & WithSecurity & WithRateLimit & WithAudit;

/**
 * Standard composition for write operations
 * Auth → Security → RateLimit → Audit → Idempotency
 */
export type WriteActionWrapper = WithAuth & WithSecurity & WithRateLimit & WithAudit & WithIdempotency;

// =================================================================
// CONTEXT TYPES FOR WRAPPER CHAIN
// =================================================================

/**
 * Authentication context provided by withAuth
 */
export type AuthContext = {
  userId: string;
  role: string;
  permissions: string[];
  sessionId: string;
  organizationId?: string;
};

/**
 * Security context provided by withSecurity
 */
export type SecurityContext = {
  accessLevel: 'read' | 'write' | 'admin';
  resourceAccess: Record<string, boolean>;
  hipaaAuthorized: boolean;
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
};

/**
 * Audit context provided by withAudit
 */
export type AuditContext = {
  traceId: string;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
  action: string;
  resource: string;
};

// =================================================================
// ERROR TYPES FOR WRAPPER FAILURES
// =================================================================

export type AuthError = {
  code: 'UNAUTHENTICATED' | 'INVALID_TOKEN' | 'SESSION_EXPIRED';
  message: string;
};

export type SecurityError = {
  code: 'UNAUTHORIZED' | 'INSUFFICIENT_PERMISSIONS' | 'RESOURCE_FORBIDDEN';
  message: string;
  requiredPermissions?: string[];
};

export type RateLimitError = {
  code: 'RATE_LIMITED' | 'QUOTA_EXCEEDED';
  message: string;
  retryAfter?: number;
};

export type AuditError = {
  code: 'AUDIT_FAILURE' | 'LOGGING_UNAVAILABLE';
  message: string;
};

export type IdempotencyError = {
  code: 'DUPLICATE_OPERATION' | 'IDEMPOTENCY_CONFLICT';
  message: string;
  originalResult?: ActionResult;
};

// =================================================================
// WRAPPER IMPLEMENTATION CONTRACTS
// =================================================================

/**
 * Contract for wrapper implementations
 * All wrappers must follow these guidelines:
 *
 * 1. Must be pure functions (no side effects in wrapper logic)
 * 2. Must handle errors gracefully and return ActionResult format
 * 3. Must not modify input objects (immutable operations)
 * 4. Must pass context to next wrapper in chain
 * 5. Must implement proper cleanup on errors
 * 6. Must respect HIPAA logging requirements (no PHI in logs)
 */

// =================================================================
// USAGE DOCUMENTATION
// =================================================================

// Example composition (TYPE-ONLY - no implementation):
//
// const secureReadAction = withAuth(
//   withSecurity(
//     withRateLimit(
//       withAudit(
//         async (input: GetPatientInput): Promise<GetPatientResult> => {
//           // Application logic here
//           return { ok: true, data: patient };
//         }
//       )
//     )
//   )
// );
//
// const secureWriteAction = withAuth(
//   withSecurity(
//     withRateLimit(
//       withAudit(
//         withIdempotency(
//           async (input: UpdatePatientInput): Promise<UpdatePatientResult> => {
//             // Application logic here
//             return { ok: true, data: updatedPatient };
//           }
//         )
//       )
//     )
//   )
// );

// =================================================================
// ENFORCEMENT REMINDERS
// =================================================================
//
// - UI components must NEVER import these wrappers directly
// - Only Application layer should compose and use wrapper chains
// - Domain layer must remain pure (no wrapper dependencies)
// - Infrastructure layer provides wrapper implementations
// - All Server Actions must use appropriate wrapper composition
// - Mutation operations must include idempotency wrapper
// - PHI-related operations require full security wrapper chain