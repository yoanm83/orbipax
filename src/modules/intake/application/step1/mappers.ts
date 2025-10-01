/**
 * Demographics Mappers - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Maps between DTOs and Domain types
 * Handles serialization/deserialization and data shape transformation
 *
 * SoC: Pure mapping functions - NO validation, NO business logic
 */

import type { Demographics } from '@/modules/intake/domain/schemas/demographics/demographics.schema'
import type {
  DemographicsInputDTO,
  DemographicsOutputDTO,
  AddressDTO,
  PhoneNumberDTO,
  EmergencyContactDTO,
  LegalGuardianDTO,
  PowerOfAttorneyDTO
} from './dtos'
import type {
  Address,
  PhoneNumber,
  EmergencyContact,
  LegalGuardianInfo,
  PowerOfAttorneyInfo
} from '@/modules/intake/domain/types/common'

/**
 * Maps Address DTO to Domain type
 */
function mapAddressToDomain(dto: AddressDTO | undefined): Address | undefined {
  if (!dto) return undefined

  const result: Address = {
    street1: dto.street1,
    city: dto.city,
    state: dto.state,
    zipCode: dto.zipCode
  }

  if (dto.street2 !== undefined) result.street2 = dto.street2
  if (dto.country !== undefined) result.country = dto.country

  return result
}

/**
 * Maps Address Domain type to DTO
 */
function mapAddressToDTO(domain: Address | undefined): AddressDTO | undefined {
  if (!domain) return undefined

  const result: AddressDTO = {
    street1: domain.street1,
    city: domain.city,
    state: domain.state,
    zipCode: domain.zipCode
  }

  if (domain.street2 !== undefined) result.street2 = domain.street2
  if (domain.country !== undefined) result.country = domain.country

  return result
}

/**
 * Maps Phone Number DTO to Domain type
 */
function mapPhoneToDomain(dto: PhoneNumberDTO): PhoneNumber {
  return {
    number: dto.number,
    type: dto.type,
    isPrimary: dto.isPrimary
  }
}

/**
 * Maps Phone Number Domain type to DTO
 */
function mapPhoneToDTO(domain: PhoneNumber): PhoneNumberDTO {
  return {
    number: domain.number,
    type: domain.type,
    isPrimary: domain.isPrimary
  }
}

/**
 * Maps Emergency Contact DTO to Domain type
 */
function mapEmergencyContactToDomain(dto: EmergencyContactDTO | undefined): EmergencyContact | undefined {
  if (!dto) return undefined

  const result: EmergencyContact = {
    name: dto.name,
    relationship: dto.relationship,
    phoneNumber: dto.phoneNumber
  }

  if (dto.alternatePhone !== undefined) result.alternatePhone = dto.alternatePhone
  if (dto.address !== undefined) {
    const mappedAddress = mapAddressToDomain(dto.address)
    if (mappedAddress !== undefined) result.address = mappedAddress
  }

  return result
}

/**
 * Maps Emergency Contact Domain type to DTO
 */
function mapEmergencyContactToDTO(domain: EmergencyContact | undefined): EmergencyContactDTO | undefined {
  if (!domain) return undefined

  const result: EmergencyContactDTO = {
    name: domain.name,
    relationship: domain.relationship,
    phoneNumber: domain.phoneNumber
  }

  if (domain.alternatePhone !== undefined) result.alternatePhone = domain.alternatePhone
  if (domain.address !== undefined) {
    const mappedAddress = mapAddressToDTO(domain.address)
    if (mappedAddress !== undefined) result.address = mappedAddress
  }

  return result
}

/**
 * Maps Legal Guardian DTO to Domain type
 */
function mapLegalGuardianToDomain(dto: LegalGuardianDTO | undefined): LegalGuardianInfo | undefined {
  if (!dto) return undefined

  const result: LegalGuardianInfo = {
    name: dto.name,
    relationship: dto.relationship,
    phoneNumber: dto.phoneNumber
  }

  if (dto.address !== undefined) {
    const mappedAddress = mapAddressToDomain(dto.address)
    if (mappedAddress !== undefined) result.address = mappedAddress
  }

  return result
}

/**
 * Maps Legal Guardian Domain type to DTO
 */
function mapLegalGuardianToDTO(domain: LegalGuardianInfo | undefined): LegalGuardianDTO | undefined {
  if (!domain) return undefined

  const result: LegalGuardianDTO = {
    name: domain.name,
    relationship: domain.relationship,
    phoneNumber: domain.phoneNumber
  }

  if (domain.address !== undefined) {
    const mappedAddress = mapAddressToDTO(domain.address)
    if (mappedAddress !== undefined) result.address = mappedAddress
  }

  return result
}

/**
 * Maps Power of Attorney DTO to Domain type
 */
function mapPowerOfAttorneyToDomain(dto: PowerOfAttorneyDTO | undefined): PowerOfAttorneyInfo | undefined {
  if (!dto) return undefined

  const result: PowerOfAttorneyInfo = {
    name: dto.name,
    phoneNumber: dto.phoneNumber
  }

  if (dto.documentDate !== undefined) {
    result.documentDate = new Date(dto.documentDate)
  }

  return result
}

/**
 * Maps Power of Attorney Domain type to DTO
 */
function mapPowerOfAttorneyToDTO(domain: PowerOfAttorneyInfo | undefined): PowerOfAttorneyDTO | undefined {
  if (!domain) return undefined

  const result: PowerOfAttorneyDTO = {
    name: domain.name,
    phoneNumber: domain.phoneNumber
  }

  if (domain.documentDate !== undefined) {
    result.documentDate = domain.documentDate.toISOString()
  }

  return result
}

/**
 * Maps Demographics Input DTO to Domain type for validation
 * Prepares data for demographicsDataSchema.safeParse()
 */
export function toDomain(input: DemographicsInputDTO): Partial<Demographics> {
  const result: Partial<Demographics> = {}

  // Basic Identity
  if (input.firstName !== undefined) result.firstName = input.firstName
  if (input.middleName !== undefined) result.middleName = input.middleName
  if (input.lastName !== undefined) result.lastName = input.lastName
  if (input.preferredName !== undefined) result.preferredName = input.preferredName

  // Date of Birth conversion
  if (input.dateOfBirth !== undefined) {
    result.dateOfBirth = new Date(input.dateOfBirth)
  }

  // Gender - enums referenced from Domain
  if (input.gender !== undefined) result.gender = input.gender
  if (input.genderIdentity !== undefined) result.genderIdentity = input.genderIdentity
  if (input.pronouns !== undefined) result.pronouns = input.pronouns

  // Race and Ethnicity - enums referenced from Domain
  if (input.race !== undefined) result.race = input.race
  if (input.ethnicity !== undefined) result.ethnicity = input.ethnicity

  // Social Demographics - enums referenced from Domain
  if (input.maritalStatus !== undefined) result.maritalStatus = input.maritalStatus
  if (input.veteranStatus !== undefined) result.veteranStatus = input.veteranStatus

  // Language and Communication - enums referenced from Domain
  if (input.primaryLanguage !== undefined) result.primaryLanguage = input.primaryLanguage
  if (input.needsInterpreter !== undefined) result.needsInterpreter = input.needsInterpreter
  if (input.preferredCommunicationMethod !== undefined) {
    result.preferredCommunicationMethod = input.preferredCommunicationMethod
  }

  // Contact Information
  if (input.email !== undefined) result.email = input.email
  if (input.phoneNumbers !== undefined) {
    result.phoneNumbers = input.phoneNumbers.map(mapPhoneToDomain)
  }

  // Address Information
  if (input.address !== undefined) result.address = mapAddressToDomain(input.address)
  if (input.sameAsMailingAddress !== undefined) result.sameAsMailingAddress = input.sameAsMailingAddress
  if (input.mailingAddress !== undefined) result.mailingAddress = mapAddressToDomain(input.mailingAddress)
  if (input.housingStatus !== undefined) result.housingStatus = input.housingStatus

  // Emergency Contact
  if (input.emergencyContact !== undefined) {
    result.emergencyContact = mapEmergencyContactToDomain(input.emergencyContact)
  }

  // Sensitive Information
  if (input.socialSecurityNumber !== undefined) result.socialSecurityNumber = input.socialSecurityNumber

  // Legal Information
  if (input.hasLegalGuardian !== undefined) result.hasLegalGuardian = input.hasLegalGuardian
  if (input.legalGuardianInfo !== undefined) {
    result.legalGuardianInfo = mapLegalGuardianToDomain(input.legalGuardianInfo)
  }
  if (input.hasPowerOfAttorney !== undefined) result.hasPowerOfAttorney = input.hasPowerOfAttorney
  if (input.powerOfAttorneyInfo !== undefined) {
    result.powerOfAttorneyInfo = mapPowerOfAttorneyToDomain(input.powerOfAttorneyInfo)
  }

  return result
}

/**
 * Maps Domain Demographics to Output DTO
 * Creates a serializable representation for UI consumption
 */
export function toOutput(
  domainData: Demographics,
  metadata: {
    id?: string
    sessionId: string
    organizationId: string
    lastModified?: Date
    completionStatus?: 'incomplete' | 'partial' | 'complete'
    validationErrors?: Record<string, string>
    requiredFieldsMissing?: string[]
  }
): DemographicsOutputDTO {
  const data: DemographicsInputDTO = {
    // Basic Identity - required fields
    firstName: domainData.firstName,
    lastName: domainData.lastName
  }

  // Optional fields
  if (domainData.middleName !== undefined) data.middleName = domainData.middleName
  if (domainData.preferredName !== undefined) data.preferredName = domainData.preferredName

  // Date of Birth serialization
  if (domainData.dateOfBirth !== undefined) {
    data.dateOfBirth = domainData.dateOfBirth.toISOString()
  }

  // Gender
  if (domainData.gender !== undefined) data.gender = domainData.gender
  if (domainData.genderIdentity !== undefined) data.genderIdentity = domainData.genderIdentity
  if (domainData.pronouns !== undefined) data.pronouns = domainData.pronouns

  // Race and Ethnicity
  data.race = domainData.race
  if (domainData.ethnicity !== undefined) data.ethnicity = domainData.ethnicity

  // Social Demographics
  if (domainData.maritalStatus !== undefined) data.maritalStatus = domainData.maritalStatus
  if (domainData.veteranStatus !== undefined) data.veteranStatus = domainData.veteranStatus

  // Language and Communication
  if (domainData.primaryLanguage !== undefined) data.primaryLanguage = domainData.primaryLanguage
  data.needsInterpreter = domainData.needsInterpreter
  data.preferredCommunicationMethod = domainData.preferredCommunicationMethod

  // Contact Information
  if (domainData.email !== undefined) data.email = domainData.email
  data.phoneNumbers = domainData.phoneNumbers.map(mapPhoneToDTO)

  // Address Information
  if (domainData.address !== undefined) {
    const mappedAddress = mapAddressToDTO(domainData.address)
    if (mappedAddress !== undefined) data.address = mappedAddress
  }
  data.sameAsMailingAddress = domainData.sameAsMailingAddress
  if (domainData.mailingAddress !== undefined) {
    const mappedMailingAddress = mapAddressToDTO(domainData.mailingAddress)
    if (mappedMailingAddress !== undefined) data.mailingAddress = mappedMailingAddress
  }
  if (domainData.housingStatus !== undefined) data.housingStatus = domainData.housingStatus

  // Emergency Contact
  if (domainData.emergencyContact !== undefined) {
    const mappedContact = mapEmergencyContactToDTO(domainData.emergencyContact)
    if (mappedContact !== undefined) data.emergencyContact = mappedContact
  }

  // Sensitive Information
  if (domainData.socialSecurityNumber !== undefined) {
    data.socialSecurityNumber = domainData.socialSecurityNumber
  }

  // Legal Information
  data.hasLegalGuardian = domainData.hasLegalGuardian
  if (domainData.legalGuardianInfo !== undefined) {
    const mappedGuardian = mapLegalGuardianToDTO(domainData.legalGuardianInfo)
    if (mappedGuardian !== undefined) data.legalGuardianInfo = mappedGuardian
  }
  data.hasPowerOfAttorney = domainData.hasPowerOfAttorney
  if (domainData.powerOfAttorneyInfo !== undefined) {
    const mappedPOA = mapPowerOfAttorneyToDTO(domainData.powerOfAttorneyInfo)
    if (mappedPOA !== undefined) data.powerOfAttorneyInfo = mappedPOA
  }

  const result: DemographicsOutputDTO = {
    sessionId: metadata.sessionId,
    organizationId: metadata.organizationId,
    data
  }

  if (metadata.id !== undefined) result.id = metadata.id
  if (metadata.lastModified !== undefined) {
    result.lastModified = metadata.lastModified.toISOString()
  }
  if (metadata.completionStatus !== undefined) result.completionStatus = metadata.completionStatus
  if (metadata.validationErrors !== undefined) result.validationErrors = metadata.validationErrors
  if (metadata.requiredFieldsMissing !== undefined) {
    result.requiredFieldsMissing = metadata.requiredFieldsMissing
  }

  return result
}