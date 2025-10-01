/**
 * Insurance & Eligibility Application Layer - Public API
 * OrbiPax Community Mental Health System
 *
 * Central export point for the Application layer
 * Provides DTOs, Ports, Mappers, and Use Cases for Insurance & Eligibility
 *
 * SoC: Application orchestration - NO domain logic, NO infrastructure details
 */

// DTOs - Data Transfer Objects
export type {
  InsuranceCoverageDTO,
  EligibilityCriteriaDTO,
  FinancialInformationDTO,
  InsuranceEligibilityInputDTO,
  InsuranceEligibilityOutputDTO
} from './dtos'

// Ports - Repository Interfaces
export type {
  InsuranceEligibilityRepository,
  RepositoryResponse
} from './ports'

// Mappers - Domain/DTO transformations
export {
  toInsuranceEligibilityDomain,
  toInsuranceEligibilityDTO,
  extractInsuranceEligibilityData
} from './mappers'

// Use Cases - Business Operations
export {
  loadInsuranceEligibility,
  saveInsuranceEligibility,
  updateInsuranceEligibility,
  InsuranceEligibilityErrorCodes
} from './usecases'