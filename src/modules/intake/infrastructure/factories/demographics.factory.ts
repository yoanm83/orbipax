/**
 * Demographics Repository Factory - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Factory pattern for creating repository instances
 * Centralizes the instantiation of concrete implementations
 *
 * SoC: Instance creation only - NO business logic, NO validation
 */

import type { DemographicsRepository } from '@/modules/intake/application/step1/ports'

import { DemographicsRepositoryImpl } from '../repositories/demographics.repository'

/**
 * Creates an instance of the DemographicsRepository
 *
 * Factory pattern benefits:
 * - Centralized configuration
 * - Easier testing with different configs
 * - Potential for multiple implementation strategies
 * - Decouples instantiation from usage
 *
 * @returns DemographicsRepository instance configured for production use
 */
export function createDemographicsRepository(): DemographicsRepository {
  // Create the concrete implementation
  // In the future, this could include configuration options:
  // - Different database connections
  // - Caching strategies
  // - Retry policies
  // - Logging configuration
  return new DemographicsRepositoryImpl()
}

/**
 * Creates a test instance of the DemographicsRepository
 * Can be used for testing with different configurations
 *
 * @param options - Optional configuration for test scenarios
 * @returns DemographicsRepository instance configured for testing
 */
export function createTestDemographicsRepository(
  _options?: {
    mockData?: boolean
    throwErrors?: boolean
  }
): DemographicsRepository {
  // For now, returns the same implementation
  // In the future, could return a mock or test-specific implementation
  // based on the options provided
  return new DemographicsRepositoryImpl()
}

// Export a singleton instance for backward compatibility
// This can be removed once all consumers use the factory
export const demographicsRepositorySingleton = createDemographicsRepository()