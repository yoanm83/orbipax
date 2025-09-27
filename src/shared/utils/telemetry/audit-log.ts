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
  const isProd = process.env.NODE_ENV === 'production'

  // Never include PII/PHI in logs (even in dev) for START/COMPLETE events
  // Clean the data to ensure no sensitive information is logged
  const cleanedData = { ...data }

  // Remove any PII/PHI fields that might have been passed
  delete cleanedData['organizationId']
  delete cleanedData['userId']
  delete cleanedData['email']
  delete cleanedData['name']
  delete cleanedData['phone']

  // For AI_RAW events in production, remove the sample field
  if (event === 'AI_RAW' && isProd && cleanedData['responseSummary']) {
    const { sample, ...safeResponseSummary } = cleanedData['responseSummary']
    cleanedData['responseSummary'] = safeResponseSummary
  }

  const logData: Record<string, any> = {
    event,
    timestamp: new Date().toISOString(),
    ...cleanedData
  }

  // NEVER add context (organizationId/userId) to logs
  // This ensures complete PII/PHI protection in all environments

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