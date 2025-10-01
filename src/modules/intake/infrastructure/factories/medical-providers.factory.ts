/**
 * Medical Providers Repository Factory - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Factory pattern for creating repository instances
 * Centralizes dependency injection and configuration
 *
 * SoC: Instance creation only - NO business logic
 */

import type { MedicalProvidersRepository } from '@/modules/intake/application/step4/ports'

import { MedicalProvidersRepositoryImpl } from '../repositories/medical-providers.repository'

/**
 * Create Medical Providers Repository Instance
 *
 * Factory function that returns the Supabase repository implementation
 * Injects server-side Supabase client via getServiceClient()
 *
 * Factory pattern benefits:
 * - Centralized configuration
 * - Easier testing with different configs
 * - Potential for multiple implementation strategies
 * - Decouples instantiation from usage
 *
 * @returns MedicalProvidersRepository implementation configured for production use
 */
export function createMedicalProvidersRepository(): MedicalProvidersRepository {
  // Create the concrete Supabase implementation
  // Client injection happens internally via getServiceClient()
  // In the future, this could include configuration options:
  // - Different database connections
  // - Caching strategies
  // - Retry policies
  // - Logging configuration
  return new MedicalProvidersRepositoryImpl()
}

/**
 * Create Test Medical Providers Repository Instance
 *
 * Factory function for testing purposes
 * Returns a mock or test-specific implementation
 *
 * @returns MedicalProvidersRepository test implementation
 */
export function createTestMedicalProvidersRepository(): MedicalProvidersRepository {
  // For now, returns the same implementation
  // In the future, could return a mock or test-specific implementation
  return new MedicalProvidersRepositoryImpl()
}

/**
 * Export a singleton instance for backward compatibility
 * This can be removed once all consumers use the factory
 */
export const medicalProvidersRepositorySingleton = createMedicalProvidersRepository()
