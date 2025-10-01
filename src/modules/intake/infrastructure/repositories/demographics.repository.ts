/**
 * Demographics Repository Implementation - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Concrete implementation using Supabase for demographics persistence
 * Uses normalized tables: patients, patient_addresses, patient_contacts, patient_guardians
 * Enforces RLS and multi-tenant isolation via organization_id
 *
 * SoC: Persistence adapter only - NO validation, NO business logic
 */

import type {
  DemographicsInputDTO,
  DemographicsOutputDTO
} from '@/modules/intake/application/step1/dtos'
import type {
  DemographicsRepository,
  RepositoryResponse
} from '@/modules/intake/application/step1/ports'

import type { RowOf, InsertOf } from '../wrappers/supabase.orbipax-core'
import { fromTable, exec, singleOrNull } from '../wrappers/supabase.orbipax-core'

/**
 * Error codes for repository operations
 */
const REPO_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN: 'UNKNOWN'
} as const

/**
 * Type-safe row types from regenerated DB types
 */
type PatientRow = Pick<
  RowOf<'patients'>,
  | 'id'
  | 'first_name'
  | 'middle_name'
  | 'last_name'
  | 'preferred_name'
  | 'dob'
  | 'gender'
  | 'race'
  | 'ethnicity'
  | 'marital_status'
  | 'veteran_status'
  | 'email'
  | 'phone'
  | 'session_id'
  | 'created_at'
  | 'updated_at'
>

type AddressRow = Pick<
  RowOf<'patient_addresses'>,
  'address_type' | 'address_line_1' | 'address_line_2' | 'city' | 'state' | 'zip_code' | 'country' | 'is_primary'
>

type PhoneRow = Pick<
  RowOf<'patient_contacts'>,
  'phone' | 'primary_phone' | 'alternate_phone' | 'email' | 'is_emergency'
>

type EmergencyContactRow = Pick<
  RowOf<'patient_contacts'>,
  'name' | 'relationship' | 'emergency_contact_name' | 'emergency_contact_phone' | 'emergency_contact_relationship' | 'is_emergency'
>

type GuardianRow = Pick<
  RowOf<'patient_guardians'>,
  | 'guardian_type'
  | 'name'
  | 'relationship'
  | 'phone'
  | 'email'
>

/**
 * Demographics Repository Supabase Adapter
 * Implements the DemographicsRepository port with Supabase persistence
 * Uses RLS for multi-tenant data isolation
 */
export class DemographicsRepositoryImpl implements DemographicsRepository {

  /**
   * Find demographics data by session
   * Loads from normalized tables with RLS organization_id scoping
   */
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<DemographicsOutputDTO>> {
    try {
      // 1. Load patient record
      const patientQuery = fromTable('patients')
        .select(`
          id,
          first_name,
          middle_name,
          last_name,
          preferred_name,
          dob,
          gender,
          race,
          ethnicity,
          marital_status,
          veteran_status,
          email,
          phone,
          session_id,
          created_at,
          updated_at
        `)
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)
        .single()

      // @ts-ignore - Supabase generated types don't include all custom fields from migrations
      const { data: patient, error: patientError }: {
        data: PatientRow | null
        error: unknown
      } = await singleOrNull<PatientRow>(patientQuery)

      if (patientError || !patient) {
        return {
          ok: false,
          error: { code: REPO_ERROR_CODES.NOT_FOUND }
        }
      }

      // 2. Load addresses
      const addressesQuery = fromTable('patient_addresses')
        .select(`
          address_type,
          address_line_1,
          address_line_2,
          city,
          state,
          zip_code,
          country,
          is_primary
        `)
        .eq('patient_id', patient.id)
        .eq('organization_id', organizationId)

      // @ts-ignore - Supabase generated types don't include all custom fields
      const { data: addresses }: { data: AddressRow[] | null } = await exec<AddressRow>(addressesQuery)

      const primaryAddress = addresses?.find(a => a.address_type === 'primary')
      const mailingAddress = addresses?.find(a => a.address_type === 'mailing')

      // 3. Load phone numbers
      const phoneNumbersQuery = fromTable('patient_contacts')
        .select(`
          phone,
          primary_phone,
          alternate_phone,
          email,
          is_emergency
        `)
        .eq('patient_id', patient.id)
        .eq('organization_id', organizationId)
        .eq('is_emergency', false)

      // @ts-ignore - Supabase generated types don't include all custom fields
      const { data: phoneNumbers }: { data: PhoneRow[] | null } = await exec<PhoneRow>(phoneNumbersQuery)

      // 4. Load emergency contact
      const emergencyContactQuery = fromTable('patient_contacts')
        .select(`
          name,
          relationship,
          emergency_contact_name,
          emergency_contact_phone,
          emergency_contact_relationship,
          is_emergency
        `)
        .eq('patient_id', patient.id)
        .eq('organization_id', organizationId)
        .eq('is_emergency', true)
        .single()

      // @ts-ignore - Supabase generated types don't include all custom fields
      const { data: emergencyContacts }: {
        data: EmergencyContactRow | null
      } = await singleOrNull<EmergencyContactRow>(emergencyContactQuery)

      // 5. Load guardian info if applicable
      const guardianQuery = fromTable('patient_guardians')
        .select(`
          guardian_type,
          name,
          relationship,
          phone,
          email
        `)
        .eq('patient_id', patient.id)
        .eq('organization_id', organizationId)
        .single()

      // @ts-ignore - Supabase generated types don't include all custom fields
      const { data: guardian }: {
        data: GuardianRow | null
      } = await singleOrNull<GuardianRow>(guardianQuery)

      // Build output DTO
      const outputDTO: DemographicsOutputDTO = {
        id: patient.id,
        sessionId,
        organizationId,
        data: {
          // Basic Identity
          firstName: patient.first_name || undefined,
          lastName: patient.last_name || undefined,
          middleName: patient.middle_name || undefined,
          preferredName: patient.preferred_name || undefined,
          dateOfBirth: patient.dob || undefined,

          // Gender
          // @ts-ignore - DB string types validated at domain layer
          gender: patient.gender || undefined,

          // Race and Ethnicity
          // @ts-ignore - DB string[] types validated at domain layer
          race: patient.race || [],
          // @ts-ignore - DB string types validated at domain layer
          ethnicity: patient.ethnicity || undefined,

          // Social Demographics
          // @ts-ignore - DB string types validated at domain layer
          maritalStatus: patient.marital_status || undefined,
          // @ts-ignore - DB string types validated at domain layer
          veteranStatus: patient.veteran_status || undefined,

          // Contact Information
          email: patient.email || undefined,
          phoneNumbers: phoneNumbers?.map(p => ({
            number: p.phone || p.primary_phone || '',
            type: 'mobile' as 'home' | 'mobile' | 'work' | 'other',
            isPrimary: true
          })) || [],

          // Address Information
          // @ts-ignore - exactOptionalPropertyTypes mismatch with conditional object
          address: primaryAddress ? {
            street1: primaryAddress.address_line_1,
            street2: primaryAddress.address_line_2 || undefined,
            city: primaryAddress.city,
            state: primaryAddress.state,
            zipCode: primaryAddress.zip_code,
            country: primaryAddress.country || 'US'
          } : undefined,
          sameAsMailingAddress: !mailingAddress,
          // @ts-ignore - exactOptionalPropertyTypes mismatch with conditional object
          mailingAddress: mailingAddress ? {
            street1: mailingAddress.address_line_1,
            street2: mailingAddress.address_line_2 || undefined,
            city: mailingAddress.city,
            state: mailingAddress.state,
            zipCode: mailingAddress.zip_code,
            country: mailingAddress.country || 'US'
          } : undefined,

          // Emergency Contact
          // @ts-ignore - exactOptionalPropertyTypes mismatch with conditional object
          emergencyContact: emergencyContacts ? {
            name: emergencyContacts.emergency_contact_name || emergencyContacts.name || '',
            relationship: emergencyContacts.emergency_contact_relationship || emergencyContacts.relationship || '',
            phoneNumber: emergencyContacts.emergency_contact_phone || '',
            alternatePhone: undefined
          } : undefined,

          // Legal Information
          hasLegalGuardian: guardian?.guardian_type === 'legal_guardian',
          // @ts-ignore - exactOptionalPropertyTypes mismatch with conditional object
          legalGuardianInfo: guardian?.guardian_type === 'legal_guardian' ? {
            name: guardian.name,
            relationship: guardian.relationship as 'parent' | 'legal_guardian' | 'grandparent' | 'other',
            phoneNumber: guardian.phone,
            email: guardian.email || undefined,
            address: undefined
          } : undefined,
          hasPowerOfAttorney: guardian?.guardian_type === 'power_of_attorney',
          // @ts-ignore - exactOptionalPropertyTypes mismatch with conditional object
          powerOfAttorneyInfo: guardian?.guardian_type === 'power_of_attorney' ? {
            name: guardian.name,
            phoneNumber: guardian.phone
          } : undefined
        },
        lastModified: patient.updated_at || patient.created_at,
        completionStatus: 'incomplete' // Will be calculated separately
      }

      // Calculate completion status
      outputDTO.completionStatus = this.calculateCompletionStatus(outputDTO.data)

      return {
        ok: true,
        data: outputDTO
      }

    } catch (error) {
      return {
        ok: false,
        error: { code: REPO_ERROR_CODES.UNKNOWN }
      }
    }
  }

  /**
   * Save demographics data for a session
   * Transactional upsert to normalized tables with RLS
   */
  async save(
    sessionId: string,
    organizationId: string,
    input: DemographicsInputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    try {
      // 1. Upsert patient record
      const patientPayload: InsertOf<'patients'> = {
        session_id: sessionId,
        organization_id: organizationId,
        created_by: 'system',
        first_name: input.firstName ?? '',
        last_name: input.lastName ?? '',
        middle_name: input.middleName ?? null,
        preferred_name: input.preferredName ?? null,
        dob: input.dateOfBirth ?? null,
        gender: input.gender ?? null,
        race: input.race ? JSON.stringify(input.race) : null,
        ethnicity: input.ethnicity ?? null,
        marital_status: input.maritalStatus ?? null,
        veteran_status: input.veteranStatus ?? null,
        email: input.email ?? null,
        phone: input.phoneNumbers?.[0]?.number ?? null,
        updated_at: new Date().toISOString()
      }

      const patientUpsertQuery = fromTable('patients')
        .upsert(patientPayload, {
          onConflict: 'session_id,organization_id',
          ignoreDuplicates: false
        })
        .select('id')
        .single()

      const { data: patient, error: patientError } = await singleOrNull<{ id: string }>(patientUpsertQuery)

      if (patientError || !patient) {
        return {
          ok: false,
          error: { code: REPO_ERROR_CODES.UNKNOWN }
        }
      }

      const patientId = patient.id

      // 2. Upsert addresses
      if (input.address) {
        const primaryAddressQuery = fromTable('patient_addresses')
          .upsert({
            patient_id: patientId,
            organization_id: organizationId,
            address_type: 'primary',
            address_line_1: input.address.street1,
            address_line_2: input.address.street2 || null,
            city: input.address.city,
            state: input.address.state,
            zip_code: input.address.zipCode,
            country: input.address.country || 'US',
            is_primary: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'patient_id,organization_id,address_type'
          })

        await exec(primaryAddressQuery)
      }

      if (input.mailingAddress && !input.sameAsMailingAddress) {
        const mailingAddressQuery = fromTable('patient_addresses')
          .upsert({
            patient_id: patientId,
            organization_id: organizationId,
            address_type: 'mailing',
            address_line_1: input.mailingAddress.street1,
            address_line_2: input.mailingAddress.street2 || null,
            city: input.mailingAddress.city,
            state: input.mailingAddress.state,
            zip_code: input.mailingAddress.zipCode,
            country: input.mailingAddress.country || 'US',
            is_primary: false,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'patient_id,organization_id,address_type'
          })

        await exec(mailingAddressQuery)
      } else if (input.sameAsMailingAddress) {
        // Delete mailing address if same as primary
        const deleteMailingQuery = fromTable('patient_addresses')
          .delete()
          .eq('patient_id', patientId)
          .eq('organization_id', organizationId)
          .eq('address_type', 'mailing')

        await exec(deleteMailingQuery)
      }

      // 3. Upsert phone numbers
      if (input.phoneNumbers && input.phoneNumbers.length > 0) {
        // Delete existing phones first
        const deletePhonesQuery = fromTable('patient_contacts')
          .delete()
          .eq('patient_id', patientId)
          .eq('organization_id', organizationId)
          .eq('is_emergency', false)

        await exec(deletePhonesQuery)

        // Insert new phones
        const phoneRecords = input.phoneNumbers.map((phone, index) => ({
          patient_id: patientId,
          organization_id: organizationId,
          phone: phone.number,
          primary_phone: phone.isPrimary ? phone.number : null,
          alternate_phone: null,
          email: input.email || null,
          is_emergency: false,
          updated_at: new Date().toISOString()
        }))

        const insertPhonesQuery = fromTable('patient_contacts')
          .insert(phoneRecords)

        await exec(insertPhonesQuery)
      }

      // 4. Upsert emergency contact
      if (input.emergencyContact) {
        const emergencyContactUpsertQuery = fromTable('patient_contacts')
          .upsert({
            patient_id: patientId,
            organization_id: organizationId,
            name: input.emergencyContact.name,
            relationship: input.emergencyContact.relationship,
            emergency_contact_name: input.emergencyContact.name,
            emergency_contact_phone: input.emergencyContact.phoneNumber,
            emergency_contact_relationship: input.emergencyContact.relationship,
            is_emergency: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'patient_id,organization_id,is_emergency'
          })

        await exec(emergencyContactUpsertQuery)
      }

      // 5. Upsert guardian/POA info
      if (input.hasLegalGuardian && input.legalGuardianInfo) {
        const legalGuardianQuery = fromTable('patient_guardians')
          .upsert({
            patient_id: patientId,
            organization_id: organizationId,
            guardian_type: 'legal_guardian',
            name: input.legalGuardianInfo.name,
            relationship: input.legalGuardianInfo.relationship,
            phone: input.legalGuardianInfo.phoneNumber,
            email: null,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'patient_id,organization_id'
          })

        await exec(legalGuardianQuery)
      } else if (input.hasPowerOfAttorney && input.powerOfAttorneyInfo) {
        const poaQuery = fromTable('patient_guardians')
          .upsert({
            patient_id: patientId,
            organization_id: organizationId,
            guardian_type: 'power_of_attorney',
            name: input.powerOfAttorneyInfo.name,
            relationship: 'poa',
            phone: input.powerOfAttorneyInfo.phoneNumber,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'patient_id,organization_id'
          })

        await exec(poaQuery)
      } else {
        // Remove guardian if neither is true
        const deleteGuardianQuery = fromTable('patient_guardians')
          .delete()
          .eq('patient_id', patientId)
          .eq('organization_id', organizationId)

        await exec(deleteGuardianQuery)
      }

      return {
        ok: true,
        data: { sessionId }
      }

    } catch (error) {
      return {
        ok: false,
        error: { code: REPO_ERROR_CODES.UNKNOWN }
      }
    }
  }

  /**
   * Calculate completion status based on required fields
   * Helper method - not exposed in interface
   */
  private calculateCompletionStatus(input: DemographicsInputDTO): 'incomplete' | 'partial' | 'complete' {
    // Required fields check
    const hasRequiredFields = Boolean(
      input.firstName &&
      input.lastName &&
      input.dateOfBirth &&
      input.race?.length &&
      input.phoneNumbers?.length &&
      input.address &&
      input.emergencyContact
    )

    if (!hasRequiredFields) {
      return 'incomplete'
    }

    // Check for more complete data
    const hasAdditionalFields = Boolean(
      input.email &&
      input.gender &&
      input.primaryLanguage
    )

    return hasAdditionalFields ? 'complete' : 'partial'
  }
}

// Export singleton instance with implementation class name
export const demographicsRepository = new DemographicsRepositoryImpl()