/**
 * Medical Providers (Step 4) - Application Layer Barrel Export
 * OrbiPax Community Mental Health System
 *
 * Central export point for Step 4 application layer artifacts
 * Exports DTOs, Ports, Mappers, and Use Cases for medical providers
 *
 * SoC: Application orchestration - NO domain logic, NO infrastructure details
 * Security: All exports are PHI-safe contracts
 */

// =================================================================
// DTOs - Data Transfer Objects
// =================================================================

export type {
  // Main DTOs
  Step4InputDTO,
  Step4OutputDTO,

  // Sub-DTOs
  ProvidersDTO,
  PsychiatristDTO,

  // Response Contracts
  RepositoryResponse,
  LoadStep4Response,
  SaveStep4Response,
  ValidateStep4Response,

  // Error Code Type
  MedicalProvidersErrorCode
} from './dtos'

// Error codes constant (value export for runtime use)
export { MedicalProvidersErrorCodes } from './dtos'

// =================================================================
// Ports - Repository Interfaces
// =================================================================

export type {
  MedicalProvidersRepository
} from './ports'

// Mock repository for testing (value export)
export { MockMedicalProvidersRepository } from './ports'

// =================================================================
// Mappers - DTO <-> Domain Transformations
// =================================================================

export {
  toPartialDomain,
  toDomain,
  toOutput,
  createEmptyOutput
} from './mappers'

// =================================================================
// Use Cases - Application Orchestration
// =================================================================

export {
  loadStep4,
  upsertMedicalProviders,
  saveStep4
} from './usecases'
