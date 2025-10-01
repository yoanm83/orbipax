/**
 * Database Types Barrel Export
 * OrbiPax - Centralized DB type contracts
 *
 * Re-exports all database types from Supabase-generated types
 * Use this module for all type-only imports in Infrastructure/Application layers
 *
 * Pattern: type-only imports for clean layer separation
 */

// Main Database type
export type { Database, Json } from './database.types'

// Table Row/Insert/Update types (via helper)
export type { Tables, TablesInsert, TablesUpdate } from './database.types'

// Enums
export type { Enums } from './database.types'

// Constants (for runtime enum values)
export { Constants } from './database.types'

// Convenience type aliases for orbipax_core schema
export type OrbipaxTable<T extends keyof Database['orbipax_core']['Tables']> =
  Database['orbipax_core']['Tables'][T]

export type OrbipaxRow<T extends keyof Database['orbipax_core']['Tables']> =
  Database['orbipax_core']['Tables'][T]['Row']

export type OrbipaxInsert<T extends keyof Database['orbipax_core']['Tables']> =
  Database['orbipax_core']['Tables'][T]['Insert']

export type OrbipaxUpdate<T extends keyof Database['orbipax_core']['Tables']> =
  Database['orbipax_core']['Tables'][T]['Update']

export type OrbipaxEnum<T extends keyof Database['orbipax_core']['Enums']> =
  Database['orbipax_core']['Enums'][T]

export type OrbipaxView<T extends keyof Database['orbipax_core']['Views']> =
  Database['orbipax_core']['Views'][T]['Row']
