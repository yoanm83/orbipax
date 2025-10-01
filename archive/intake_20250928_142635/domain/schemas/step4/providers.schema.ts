/**
 * Primary Care Provider (PCP) Schema - Step 4 Medical Providers
 * OrbiPax Community Mental Health System
 *
 * Validation schema for Primary Care Provider section
 * Includes phone normalization and conditional validation
 */

import { z } from 'zod'
import { normalizePhoneNumber, validatePhoneNumber } from '@/shared/utils/phone'
import { normalizeName, validateName, NAME_LENGTHS } from '@/shared/utils/name'


// =================================================================
// PROVIDERS SCHEMA
// =================================================================

/**
 * Primary Care Provider data schema with conditional validation
 * If hasPCP = 'Yes', pcpName and pcpPhone are required
 */
export const providersSchema = z.object({
  hasPCP: z.enum(['Yes', 'No', 'Unknown']).describe('Please indicate if you have a Primary Care Provider'),

  pcpName: z.string()
    .max(NAME_LENGTHS.PROVIDER_NAME, 'Provider name must not exceed 120 characters')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in provider name')
    .optional(),

  pcpPhone: z.string()
    .transform(normalizePhoneNumber)
    .refine(validatePhoneNumber, 'Invalid phone number')
    .optional(),

  pcpPractice: z.string()
    .max(120, 'Practice name must not exceed 120 characters')
    .optional(),

  pcpAddress: z.string()
    .max(200, 'Address must not exceed 200 characters')
    .optional(),

  authorizedToShare: z.boolean()
    .optional()
}).refine(
  (data) => {
    // If hasPCP is 'Yes', pcpName and pcpPhone are required
    if (data.hasPCP === 'Yes') {
      // Check name is not empty
      if (!data.pcpName || data.pcpName.trim().length === 0) {
        return false
      }

      // Check phone is valid
      if (!data.pcpPhone || !validatePhoneNumber(data.pcpPhone)) {
        return false
      }

      return true
    }
    return true
  },
  {
    message: 'Provider name and valid phone number are required when you have a PCP',
    path: ['pcpName'] // Shows error on first required field
  }
)

// =================================================================
// TYPE EXPORTS
// =================================================================

/**
 * Inferred TypeScript type from Zod schema
 */
export type ProvidersSchema = z.infer<typeof providersSchema>

/**
 * Partial type for UI state (allows incomplete data during editing)
 */
export type PartialProviders = Partial<ProvidersSchema>

/**
 * PCP status type
 */
export type PCPStatus = 'Yes' | 'No' | 'Unknown'

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates providers data using safeParse
 * Returns success/error with detailed validation messages
 */
export function validateProviders(data: unknown) {
  return providersSchema.safeParse(data)
}

/**
 * Type guard to check if provider info is complete
 */
export function isProviderInfoComplete(data: PartialProviders): boolean {
  const result = providersSchema.safeParse(data)
  return result.success
}


// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default initial values for providers form
 */
export const defaultProvidersValues: PartialProviders = {
  hasPCP: undefined,
  pcpName: '',
  pcpPhone: '',
  pcpPractice: '',
  pcpAddress: '',
  authorizedToShare: false
}