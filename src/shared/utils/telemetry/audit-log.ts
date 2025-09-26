/**
 * Centralized audit logging utility
 * Shared across all layers without violating SoC
 * Handles environment-specific logging with automatic PII protection
 */

export function auditLog(
  event: 'START' | 'COMPLETE' | 'ERROR' | 'AI_RAW',
  data: Record<string, any>,
  options?: {
    includeContext?: boolean
    context?: { organizationId?: string; userId?: string }
  }
) {
  const isDev = process.env.NODE_ENV !== 'production'
  const logData: Record<string, any> = {
    event,
    timestamp: new Date().toISOString(),
    ...data
  }

  // Add context only in dev when explicitly requested
  if (isDev && options?.includeContext && options?.context) {
    logData.organizationId = options.context.organizationId
    logData.userId = options.context.userId
  }

  // Use appropriate console method based on event type
  // Note: console is only used here, centralized in this function
  if (event === 'ERROR') {
    // eslint-disable-next-line no-console
    console.error('[AUDIT]', logData)
  } else {
    // eslint-disable-next-line no-console
    console.log('[AUDIT]', logData)
  }
}