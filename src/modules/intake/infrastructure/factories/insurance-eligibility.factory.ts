/**
 * Insurance & Eligibility Repository Factory - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Factory pattern for creating repository instances
 * Centralizes dependency injection and configuration
 *
 * SoC: Instance creation only - NO business logic
 */

import type { InsuranceEligibilityRepository } from '@/modules/intake/application/step2'

import { InsuranceEligibilityRepositoryImpl } from '../repositories/insurance-eligibility.repository'

/**
 * Create Insurance & Eligibility Repository Instance
 *
 * Factory function that returns the appropriate repository implementation
 * Currently returns skeleton implementation, will be updated to return
 * real Supabase implementation in future task
 *
 * @returns InsuranceEligibilityRepository implementation
 */
export function createInsuranceEligibilityRepository(): InsuranceEligibilityRepository {
  // TODO: Add configuration options (e.g., database connection)
  // TODO: Add environment-based selection (dev/test/prod)
  // For now, return the skeleton implementation
  return new InsuranceEligibilityRepositoryImpl()
}

/**
 * Create Test Insurance & Eligibility Repository Instance
 *
 * Factory function for testing purposes
 * Returns a mock or test-specific implementation
 *
 * @returns InsuranceEligibilityRepository test implementation
 */
export function createTestInsuranceEligibilityRepository(): InsuranceEligibilityRepository {
  // For now, return the same skeleton implementation
  // Will be replaced with proper mock/test implementation
  return new InsuranceEligibilityRepositoryImpl()
}