/**
 * Medical Providers Mappers for Step 4
 * OrbiPax Intake Module - Application Layer
 *
 * Maps between DTOs and domain models.
 * Handles data transformations without business logic.
 *
 * SoC: Application layer mapping - bridges DTOs and domain
 * Pattern: Pure mapping functions, no side effects
 * Note: Zod validation occurs in Domain layer
 */

import {
  type MedicalProvidersData,
  type MedicalProvidersDataPartial,
  type ProvidersSchema,
  type PsychiatristSchema
} from '@/modules/intake/domain/schemas/medical-providers'

import {
  type Step4InputDTO,
  type Step4OutputDTO,
  type ProvidersDTO,
  type PsychiatristDTO
} from './dtos'

// =================================================================
// PROVIDERS SECTION MAPPERS
// =================================================================

/**
 * Map providers DTO to domain model
 * No date conversions needed for PCP section
 */
function providersToDomain(dto: ProvidersDTO): ProvidersSchema {
  return {
    hasPCP: dto.hasPCP,
    pcpName: dto.pcpName,
    pcpPhone: dto.pcpPhone,
    pcpPractice: dto.pcpPractice,
    pcpAddress: dto.pcpAddress,
    authorizedToShare: dto.authorizedToShare
  }
}

/**
 * Map providers domain to DTO
 */
function providersToDTO(domain: ProvidersSchema): ProvidersDTO {
  return {
    hasPCP: domain.hasPCP,
    ...(domain.pcpName !== undefined && { pcpName: domain.pcpName }),
    ...(domain.pcpPhone !== undefined && { pcpPhone: domain.pcpPhone }),
    ...(domain.pcpPractice !== undefined && { pcpPractice: domain.pcpPractice }),
    ...(domain.pcpAddress !== undefined && { pcpAddress: domain.pcpAddress }),
    ...(domain.authorizedToShare !== undefined && { authorizedToShare: domain.authorizedToShare })
  }
}

// =================================================================
// PSYCHIATRIST SECTION MAPPERS
// =================================================================

/**
 * Map psychiatrist DTO to domain model
 * Converts ISO date string to Date object for evaluationDate
 */
function psychiatristToDomain(dto: PsychiatristDTO): PsychiatristSchema {
  return {
    hasBeenEvaluated: dto.hasBeenEvaluated,
    psychiatristName: dto.psychiatristName,
    evaluationDate: dto.evaluationDate ? new Date(dto.evaluationDate) : undefined,
    clinicName: dto.clinicName,
    notes: dto.notes,
    differentEvaluator: dto.differentEvaluator,
    evaluatorName: dto.evaluatorName,
    evaluatorClinic: dto.evaluatorClinic
  }
}

/**
 * Map psychiatrist domain to DTO
 * Converts Date object to ISO date string for evaluationDate
 */
function psychiatristToDTO(domain: PsychiatristSchema): PsychiatristDTO {
  return {
    hasBeenEvaluated: domain.hasBeenEvaluated,
    ...(domain.psychiatristName !== undefined && { psychiatristName: domain.psychiatristName }),
    ...(domain.evaluationDate !== undefined && {
      evaluationDate: domain.evaluationDate.toISOString()
    }),
    ...(domain.clinicName !== undefined && { clinicName: domain.clinicName }),
    ...(domain.notes !== undefined && { notes: domain.notes }),
    ...(domain.differentEvaluator !== undefined && { differentEvaluator: domain.differentEvaluator }),
    ...(domain.evaluatorName !== undefined && { evaluatorName: domain.evaluatorName }),
    ...(domain.evaluatorClinic !== undefined && { evaluatorClinic: domain.evaluatorClinic })
  }
}

// =================================================================
// COMPOSITE MAPPERS
// =================================================================

/**
 * Map Step4 input DTO to domain model (partial)
 * Used for validating partial data (drafts, autosave)
 * Zod validation occurs after this mapping in Domain layer
 */
export function toPartialDomain(dto: Step4InputDTO): MedicalProvidersDataPartial {
  return {
    providers: dto.providers ? providersToDomain(dto.providers) : undefined,
    psychiatrist: dto.psychiatrist ? psychiatristToDomain(dto.psychiatrist) : undefined,
    stepId: 'step4-medical-providers'
  }
}

/**
 * Map Step4 input DTO to domain model (complete)
 * Provides default values for missing sections
 * Zod validation occurs after this mapping in Domain layer
 */
export function toDomain(dto: Step4InputDTO): MedicalProvidersData {
  const providers: ProvidersDTO = dto.providers ?? {
    hasPCP: 'Unknown'
  }

  const psychiatrist: PsychiatristDTO = dto.psychiatrist ?? {
    hasBeenEvaluated: 'No'
  }

  return {
    providers: providersToDomain(providers),
    psychiatrist: psychiatristToDomain(psychiatrist),
    stepId: 'step4-medical-providers',
    isComplete: false
  }
}

/**
 * Map domain model to output DTO
 * Converts domain data to JSON-serializable format for UI/API
 */
export function toOutput(
  domain: MedicalProvidersData,
  sessionId: string,
  organizationId: string
): Step4OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      providers: providersToDTO(domain.providers),
      psychiatrist: psychiatristToDTO(domain.psychiatrist)
    },
    lastModified: new Date().toISOString()
  }
}

/**
 * Create empty output DTO
 * Returns minimal valid structure when no data exists
 * Used by loadStep4 when repository returns NOT_FOUND
 */
export function createEmptyOutput(
  sessionId: string,
  organizationId: string
): Step4OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      providers: {
        hasPCP: 'Unknown'
      },
      psychiatrist: {
        hasBeenEvaluated: 'No'
      }
    },
    lastModified: new Date().toISOString()
  }
}
