/**
 * Typed Supabase Wrapper for orbipax_core Schema
 * OrbiPax Community Mental Health System - Infrastructure Layer
 *
 * Provides strongly-typed access to orbipax_core schema with:
 * - Type-safe table access via TableName union
 * - Automatic schema specification (.schema('orbipax_core'))
 * - Helper utilities: fromTable, selectTyped, singleOrNull, maybeSingle, page
 * - Standardized error handling (no PHI exposure)
 *
 * SoC: Infrastructure adapter only - NO business logic
 * Security: RLS enforced at DB level via organization_id
 */

import "server-only"
import type { Database } from '@/shared/db'
import { getServiceClient } from '@/shared/lib/supabase.server'

/**
 * orbipax_core schema types
 */
export type OrbipaxCoreSchema = Database['orbipax_core']
export type TableName = keyof OrbipaxCoreSchema['Tables']
export type ViewName = keyof OrbipaxCoreSchema['Views']

/**
 * Row/Insert/Update type utilities for tables
 */
export type RowOf<T extends TableName> = OrbipaxCoreSchema['Tables'][T]['Row']
export type InsertOf<T extends TableName> = OrbipaxCoreSchema['Tables'][T]['Insert']
export type UpdateOf<T extends TableName> = OrbipaxCoreSchema['Tables'][T]['Update']

/**
 * Row type for views
 */
export type ViewRowOf<V extends ViewName> = OrbipaxCoreSchema['Views'][V]['Row']

/**
 * Typed Supabase client for orbipax_core schema
 * Pre-configured with schema specification
 */
export function createTypedClient() {
  const client = getServiceClient()
  return client.schema('orbipax_core')
}

/**
 * Type-safe table query builder
 *
 * @param name - Table name from orbipax_core schema
 * @returns Query builder with typed Row/Insert/Update
 *
 * @example
 * const query = fromTable('patients')
 * const { data } = await query.select('id, first_name').single()
 * // data is typed as Pick<RowOf<'patients'>, 'id' | 'first_name'>
 */
export function fromTable<T extends TableName>(name: T) {
  const client = createTypedClient()
  return client.from(name)
}

/**
 * Type-safe view query builder
 *
 * @param name - View name from orbipax_core schema
 * @returns Query builder with typed Row
 *
 * @example
 * const query = fromView('v_patient_providers_by_session')
 * const { data } = await query.select('*').eq('session_id', sessionId)
 */
export function fromView<V extends ViewName>(name: V) {
  const client = createTypedClient()
  return client.from(name)
}

/**
 * Execute query and return single row or null
 * Wraps .single() with proper error handling
 *
 * @param query - Supabase query builder
 * @returns { data: Row | null, error: Error | null }
 *
 * @example
 * const result = await singleOrNull(
 *   fromTable('patients').select('*').eq('id', patientId)
 * )
 */
export async function singleOrNull<T>(
  query: PromiseLike<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const result = await query
    if (result.error) {
      return {
        data: null,
        error: new Error('Query failed')
      }
    }
    return {
      data: result.data,
      error: null
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    }
  }
}

/**
 * Execute query and return single row or null (no error on 0 rows)
 * Wraps .maybeSingle() with proper error handling
 *
 * @param query - Supabase query builder
 * @returns { data: Row | null, error: Error | null }
 *
 * @example
 * const result = await maybeSingle(
 *   fromTable('patients').select('*').eq('email', email)
 * )
 */
export async function maybeSingle<T>(
  query: PromiseLike<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const result = await query
    if (result.error) {
      return {
        data: null,
        error: new Error('Query failed')
      }
    }
    return {
      data: result.data,
      error: null
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unknown error')
    }
  }
}

/**
 * Execute query and return array of rows
 * Wraps standard query execution with proper error handling
 *
 * @param query - Supabase query builder
 * @returns { data: Row[], error: Error | null }
 *
 * @example
 * const result = await exec(
 *   fromTable('patient_contacts').select('*').eq('patient_id', id)
 * )
 */
export async function exec<T>(
  query: PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<{ data: T[]; error: Error | null }> {
  try {
    const result = await query
    if (result.error) {
      return {
        data: [],
        error: new Error('Query failed')
      }
    }
    return {
      data: result.data ?? [],
      error: null
    }
  } catch (err) {
    return {
      data: [],
      error: err instanceof Error ? err : new Error('Unknown error')
    }
  }
}

/**
 * Pagination helper for list queries
 *
 * @param query - Supabase query builder
 * @param options - Pagination options { limit, offset }
 * @returns Query builder with pagination applied
 *
 * @example
 * const query = fromTable('patients').select('*')
 * const result = await exec(page(query, { limit: 20, offset: 0 }))
 */
export function page<T>(
  query: T,
  options: { limit: number; offset: number }
): T {
  // Type assertion needed because Supabase query builder types are complex
  const q = query as any
  return q.range(options.offset, options.offset + options.limit - 1) as T
}
