/**
 * Step 1 Demographics - Application Layer Barrel Export
 * OrbiPax Community Mental Health System
 *
 * Exports all public APIs for Demographics application services
 */

// DTOs - Data Transfer Objects
export type {
  // Main DTOs
  DemographicsInputDTO,
  DemographicsOutputDTO,

  // Sub-DTOs
  AddressDTO,
  PhoneNumberDTO,
  EmergencyContactDTO,
  LegalGuardianDTO,
  PowerOfAttorneyDTO,

  // Response Contracts
  ApplicationResponse,
  LoadDemographicsResponse,
  SaveDemographicsResponse
} from './dtos'

// Mappers - DTO <-> Domain conversion
export {
  toDomain,
  toOutput
} from './mappers'

// Use Cases - Application orchestration
export {
  loadDemographics,
  saveDemographics,
  checkDemographicsCompletion,
  ERROR_CODES
} from './usecases'