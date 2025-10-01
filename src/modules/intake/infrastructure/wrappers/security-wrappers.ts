/**
 * Security wrappers for intake module server actions
 * Implements authentication, security, rate limiting, and audit logging
 * Integrates with Supabase session and dev mode fallback
 */

import { cookies } from 'next/headers'

import { createServerClient } from '@/shared/lib/supabase.client'
import { auditLog } from '@/shared/utils/telemetry/audit-log'

// Rate limit storage (in-memory for development, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

/**
 * Authentication wrapper - validates user session via Supabase
 * Must be the first wrapper in the chain
 * Supports both Supabase auth and dev mode with opx_uid cookie
 */
export function withAuth<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      let userId: string | null = null
      let organizationId: string | null = null

      // Priority 1: Try Supabase auth.getUser() for server-side validation
      const sb = await createServerClient()
      const { data: { user }, error: authError } = await sb.auth.getUser()

      if (!authError && user) {
        // We have a valid authenticated user (verified server-side)
        userId = user.id

        // Get active organization from user's profile
        try {

          // First, check if user has a profile with organization
          const { data: profile, error: profileError } = await sb
            .schema('orbipax_core').from('user_profiles')
            .select('organization_id')
            .eq('user_id', userId)
            .maybeSingle()

          if (!profileError && profile?.organization_id) {
            // Verify the organization exists
            const { data: org, error: orgError } = await sb
              .schema('orbipax_core').from('organizations')
              .select('id')
              .eq('id', profile.organization_id)
              .maybeSingle()

            if (!orgError && org?.id) {
              organizationId = org.id
            }
          }

          // If no organization from profile, try to find ANY organization for this user
          // This handles cases where user exists but profile is incomplete
          if (!organizationId) {
            // Check if there's at least one organization in the system
            // In a real multi-tenant system, this would check user's memberships
            const { data: anyOrg, error: anyOrgError } = await sb
              .schema('orbipax_core').from('organizations')
              .select('id')
              .limit(1)
              .maybeSingle()

            if (!anyOrgError && anyOrg?.id) {
              // Assign user to first available org (temporary solution)
              organizationId = anyOrg.id

              // Optional: Update user profile with this org for next time
              await sb
                .schema('orbipax_core').from('user_profiles')
                .upsert({
                  user_id: userId,
                  organization_id: organizationId,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)
            }
          }
        } catch (error) {
          // Silent fail, continue to error handling below
        }

        // If still no organization found, this is a configuration issue
        if (!organizationId) {
          return {
            ok: false,
            error: 'Organization context not available. Please contact support.'
          }
        }
      } else {
        // Priority 2: Dev mode fallback with opx_uid cookie
        const cookieStore = await cookies()
        const opxUid = cookieStore.get('opx_uid')?.value

        if (opxUid) {
          userId = opxUid

          // Try to get organization for dev user from profile
          try {
            const sb = await createServerClient()
            const { data, error } = await sb
              .schema('orbipax_core').from('user_profiles')
              .select('organization_id')
              .eq('user_id', opxUid)
              .maybeSingle()

            if (!error && data?.organization_id) {
              organizationId = data.organization_id
            }
          } catch {
            // User profile lookup failed, continue to fallbacks
          }

          // If no organization from user profile, try dev fallbacks
          if (!organizationId) {
            // Check for dev organization ID in environment
            if (process.env['OPX_DEV_ORG_ID']) {
              // Verify the env org exists in DB
              try {
                const sb = await createServerClient()
                const { data: org } = await sb
                  .schema('orbipax_core').from('organizations')
                  .select('id')
                  .eq('id', process.env['OPX_DEV_ORG_ID'])
                  .maybeSingle()

                if (org?.id) {
                  organizationId = org.id
                }
              } catch {
                // Env org doesn't exist, continue to next fallback
              }
            }

            // If still no org, fall back to first organization in database
            if (!organizationId) {
              try {
                const sb = await createServerClient()
                const { data: org } = await sb
                  .schema('orbipax_core').from('organizations')
                  .select('id')
                  .limit(1)
                  .maybeSingle()

                if (org?.id) {
                  organizationId = org.id
                }
              } catch {
                // No organizations in database
              }
            }
          }
        }
      }

      // Validation: Must have userId (either from session or dev cookie)
      if (!userId) {
        return {
          ok: false,
          error: 'Authentication required. Please log in.'
        }
      }

      // Validation: Must have organizationId for proper functioning
      if (!organizationId) {
        return {
          ok: false,
          error: 'Organization context not available. Please contact support.'
        }
      }

      // Store context for downstream wrappers (withRateLimit, withAudit)
      const context = {
        organizationId,
        userId
      }
      ;(global as any).__authContext = context

      return await fn(...args)
    } catch (error) {
      return {
        ok: false,
        error: 'Authentication failed. Please try again.'
      }
    }
  }) as T
}

/**
 * Security wrapper - enforces authorization and access control
 * Must run after authentication
 */
export function withSecurity<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      const context = (global as any).__authContext

      if (!context) {
        return {
          ok: false,
          error: 'Security validation failed.'
        }
      }

      // TODO: Check user permissions for diagnosis suggestions
      // For now, we'll assume all authenticated users can generate suggestions

      // Check HIPAA authorization
      // TODO: Verify user has signed BAA and completed HIPAA training

      return await fn(...args)
    } catch (error) {
      // Log error without exposing sensitive details
      auditLog('ERROR', {
        action: 'withSecurity',
        error: error instanceof Error ? error.name : 'SecurityError'
      })
      return {
        ok: false,
        error: 'Access denied.'
      }
    }
  }) as T
}

/**
 * Rate limiting wrapper - prevents abuse
 * Uses organization_id as the rate limit key
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limits = { maxRequests: 10, windowMs: 60000 } // 10 requests per minute
): T {
  return (async (...args: Parameters<T>) => {
    try {
      const context = (global as any).__authContext

      if (!context?.organizationId) {
        return {
          ok: false,
          error: 'Rate limiting error.'
        }
      }

      const key = `diagnoses:${context.organizationId}`
      const now = Date.now()

      // Get or create rate limit entry
      let entry = rateLimitStore.get(key)

      if (!entry || entry.resetAt < now) {
        // Create new window
        entry = {
          count: 0,
          resetAt: now + limits.windowMs
        }
        rateLimitStore.set(key, entry)
      }

      // Check if limit exceeded
      if (entry.count >= limits.maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        return {
          ok: false,
          error: `Too many requests. Please try again in ${retryAfter} seconds.`
        }
      }

      // Increment count
      entry.count++

      return await fn(...args)
    } catch (error) {
      // Log error without exposing sensitive details
      auditLog('ERROR', {
        action: 'withRateLimit',
        error: error instanceof Error ? error.name : 'RateLimitError'
      })
      return {
        ok: false,
        error: 'Rate limiting error. Please try again.'
      }
    }
  }) as T
}

/**
 * Audit wrapper - logs all actions for compliance
 * Must run after rate limiting
 */
export function withAudit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  actionName = 'unknown_action'
): T {
  return (async (...args: Parameters<T>) => {
    const startTime = Date.now()
    const traceId = crypto.randomUUID()

    try {
      const context = (global as any).__authContext

      // Log action start (PII only in dev)
      auditLog('START', {
        traceId,
        action: actionName
      }, {
        includeContext: true,
        context
      })

      const result = await fn(...args)

      // Log action complete (PII only in dev)
      auditLog('COMPLETE', {
        traceId,
        action: actionName,
        duration: Date.now() - startTime,
        success: result?.ok ?? false
      }, {
        includeContext: true,
        context
      })

      // Add trace ID to result metadata
      if (result && typeof result === 'object') {
        result.metadata = {
          ...result.metadata,
          traceId,
          timestamp: new Date().toISOString()
        }
      }

      return result
    } catch (error) {
      // Log action error (without sensitive details)
      auditLog('ERROR', {
        traceId,
        action: actionName,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.name : 'UnknownError'
      })

      return {
        ok: false,
        error: 'An error occurred. Please try again.'
      }
    } finally {
      // Clean up auth context
      delete (global as any).__authContext
    }
  }) as T
}