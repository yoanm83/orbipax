/**
 * Pharmacy Information Schema - Step 5
 * OrbiPax Community Mental Health System
 *
 * Validation schema for pharmacy information section
 * Handles pharmacy name, phone number, and address
 */

import { z } from 'zod'
import { validatePhoneNumber, normalizePhoneNumber } from '@/shared/utils/phone'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'

// =========================================================================
// SCHEMA DEFINITION
// =========================================================================

/**
 * Pharmacy Information validation schema
 * Required: name and phone number
 * Optional: address
 */
export const pharmacyInformationSchema = z.object({
  // Pharmacy name (required)
  pharmacyName: z.string()
    .min(1, 'Pharmacy name is required')
    .max(NAME_LENGTHS.ORGANIZATION_NAME, 'Pharmacy name must be 120 characters or less')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in pharmacy name'),

  // Phone number (required) - using shared phone utility
  pharmacyPhone: z.string()
    .min(1, 'Phone number is required')
    .transform(normalizePhoneNumber)
    .refine(validatePhoneNumber, 'Please enter a valid phone number'),

  // Address (optional)
  pharmacyAddress: z.string()
    .max(200, 'Address must be 200 characters or less')
    .optional()
})

// =========================================================================
// TYPE EXPORTS
// =========================================================================

export type PharmacyInformationSchema = z.infer<typeof pharmacyInformationSchema>

// =========================================================================
// VALIDATION HELPERS
// =========================================================================

/**
 * Validates pharmacy information data
 */
export function validatePharmacyInformation(data: unknown) {
  return pharmacyInformationSchema.safeParse(data)
}

/**
 * Checks if pharmacy information section is complete
 */
export function isPharmacyInformationComplete(data: unknown): boolean {
  const result = validatePharmacyInformation(data)
  return result.success
}

// =========================================================================
// DEFAULT VALUES
// =========================================================================

export const defaultPharmacyInformationValues: Partial<PharmacyInformationSchema> = {
  pharmacyName: '',
  pharmacyPhone: '',
  pharmacyAddress: ''
}