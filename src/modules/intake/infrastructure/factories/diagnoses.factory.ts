/**
 * Diagnoses Repository Factory - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Factory function for creating DiagnosesRepository instances
 * Used by Actions layer for dependency injection
 *
 * SoC: DI composition only - NO business logic
 */

import type { DiagnosesRepository } from '@/modules/intake/application/step3'

import { DiagnosesRepositoryImpl } from '../repositories/diagnoses.repository'

/**
 * Creates an instance of DiagnosesRepository
 * This factory is used by the Actions layer to inject the repository
 * into Application use cases
 *
 * @returns DiagnosesRepository instance with Supabase persistence
 */
export function createDiagnosesRepository(): DiagnosesRepository {
  // Return concrete implementation
  // Future: could add configuration, caching, or different implementations
  return new DiagnosesRepositoryImpl()
}