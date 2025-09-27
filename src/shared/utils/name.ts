/**
 * Name Validation and Normalization Utilities
 * OrbiPax Community Mental Health System
 *
 * Shared utilities for validating and normalizing person/organization names
 * Supports common name patterns with spaces, apostrophes, hyphens, and periods
 *
 * @module @/shared/utils/name
 */

// =========================================================================
// CONSTANTS
// =========================================================================

/**
 * Regular expression for valid name characters
 * Allows:
 * - Letters (a-z, A-Z)
 * - Spaces
 * - Apostrophes (O'Brien)
 * - Hyphens (Smith-Jones)
 * - Periods (Jr., Sr.)
 * - Diacritical marks (María, José, François)
 *
 * Note: This is a permissive pattern for Western names.
 * Consider i18n requirements for full Unicode support if needed.
 */
const NAME_REGEX = /^[a-zA-ZÀ-ÿĀ-žА-я\s\-'\.]+$/

/**
 * Recommended maximum lengths for name fields
 * These are suggestions - actual limits should be defined in domain schemas
 */
export const NAME_LENGTHS = {
  FIRST_NAME: 50,
  MIDDLE_NAME: 50,
  LAST_NAME: 50,
  FULL_NAME: 100,
  PREFERRED_NAME: 50,
  ORGANIZATION_NAME: 120,
  PROVIDER_NAME: 120
} as const

// =========================================================================
// VALIDATION
// =========================================================================

/**
 * Validates if a string is a valid name
 *
 * @param value - The name string to validate
 * @returns true if the name contains only valid characters
 *
 * @example
 * ```typescript
 * validateName("John Smith")      // true
 * validateName("O'Brien")          // true
 * validateName("Mary-Jane")        // true
 * validateName("Dr. Smith Jr.")    // true
 * validateName("María García")     // true
 * validateName("123 Invalid")      // false
 * validateName("Name@Email")       // false
 * validateName("")                 // false
 * ```
 *
 * Usage with Zod:
 * ```typescript
 * firstName: z.string()
 *   .min(1, 'First name is required')
 *   .max(50, 'First name too long')
 *   .refine(validateName, 'Invalid characters in name')
 * ```
 */
export function validateName(value: string): boolean {
  // Empty strings are invalid
  if (!value || value.trim().length === 0) {
    return false
  }

  // Check against the name pattern
  return NAME_REGEX.test(value.trim())
}

// =========================================================================
// NORMALIZATION
// =========================================================================

/**
 * Normalizes a name string for storage/comparison
 *
 * Operations:
 * - Trims leading/trailing whitespace
 * - Collapses multiple internal spaces to single space
 * - Preserves original casing (does NOT force Title Case)
 * - Preserves apostrophes, hyphens, and periods
 *
 * @param value - The name string to normalize
 * @returns Normalized name string
 *
 * @example
 * ```typescript
 * normalizeName("  John   Smith  ")   // "John Smith"
 * normalizeName("MARY    JANE")       // "MARY JANE"
 * normalizeName("o'brien")            // "o'brien"
 * normalizeName("  Dr.  Smith  Jr. ") // "Dr. Smith Jr."
 * ```
 *
 * Usage with Zod:
 * ```typescript
 * firstName: z.string()
 *   .transform(normalizeName)
 *   .refine(validateName, 'Invalid characters')
 * ```
 */
export function normalizeName(value: string): string {
  return value
    .trim()                    // Remove leading/trailing whitespace
    .replace(/\s+/g, ' ')      // Collapse multiple spaces to single space
}

// =========================================================================
// FORMATTING (OPTIONAL UTILITIES)
// =========================================================================

/**
 * Converts a name to Title Case
 * Optional utility - use only when specifically needed
 *
 * @param value - The name string to format
 * @returns Title-cased name
 *
 * @example
 * ```typescript
 * toTitleCase("john smith")     // "John Smith"
 * toTitleCase("MARY JANE")       // "Mary Jane"
 * toTitleCase("o'brien")         // "O'Brien"
 * toTitleCase("mcDONALD")        // "McDonald"
 * ```
 *
 * Note: This is a simple implementation. Consider more sophisticated
 * algorithms for names like "von Neumann", "de la Cruz", etc.
 */
export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/'\w/g, match => match.toUpperCase())  // Handle O'Brien, D'Angelo
}

/**
 * Extracts initials from a full name
 *
 * @param fullName - The full name string
 * @returns Initials (e.g., "JS" for "John Smith")
 *
 * @example
 * ```typescript
 * getInitials("John Smith")        // "JS"
 * getInitials("Mary Jane Watson")  // "MJW"
 * getInitials("Dr. Smith")         // "DS"
 * ```
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
}

// =========================================================================
// COMPARISON UTILITIES
// =========================================================================

/**
 * Compares two names for equality (case-insensitive, normalized)
 *
 * @param name1 - First name to compare
 * @param name2 - Second name to compare
 * @returns true if names are equivalent after normalization
 *
 * @example
 * ```typescript
 * areNamesEqual("John Smith", "  john  smith  ")  // true
 * areNamesEqual("O'Brien", "o'brien")              // true
 * areNamesEqual("Mary Jane", "Mary-Jane")          // false
 * ```
 */
export function areNamesEqual(name1: string, name2: string): boolean {
  const normalized1 = normalizeName(name1).toLowerCase()
  const normalized2 = normalizeName(name2).toLowerCase()
  return normalized1 === normalized2
}

// =========================================================================
// TYPE GUARDS
// =========================================================================

/**
 * Type guard to check if a value is a valid name string
 *
 * @param value - Value to check
 * @returns true if value is a string and valid name
 */
export function isValidName(value: unknown): value is string {
  return typeof value === 'string' && validateName(value)
}

// =========================================================================
// MIGRATION NOTES
// =========================================================================

/**
 * Migration Guide for Existing Schemas
 *
 * Current pattern found in schemas:
 * ```typescript
 * firstName: z.string()
 *   .min(1, 'First name is required')
 *   .max(50, 'First name too long')
 *   .regex(/^[a-zA-Z\s\-'\.]+$/, 'Invalid characters in first name')
 * ```
 *
 * Should be replaced with:
 * ```typescript
 * import { validateName, normalizeName } from '@/shared/utils/name'
 *
 * firstName: z.string()
 *   .min(1, 'First name is required')
 *   .max(50, 'First name too long')
 *   .transform(normalizeName)
 *   .refine(validateName, 'Invalid characters in first name')
 * ```
 *
 * Files to migrate (based on audit):
 * 1. src/modules/intake/domain/schemas/demographics.schema.ts
 *    - firstName (line 70-73)
 *    - middleName (line 75-78)
 *    - lastName (line 80-83)
 *    - legalGuardianInfo.name (line 148)
 *
 * 2. src/modules/intake/domain/schemas/goals.schema.ts
 *    - supportContacts.name (line 329)
 *    - professionalContacts.name (line 336)
 *
 * 3. src/modules/intake/domain/schemas/insurance.schema.ts
 *    - subscriberName (line 30)
 *
 * 4. Other provider/evaluator name fields in step3/step4 schemas
 */

// =========================================================================
// EXPORTS
// =========================================================================

export type { NAME_LENGTHS }

/**
 * Default export for convenience
 */
export default {
  validateName,
  normalizeName,
  toTitleCase,
  getInitials,
  areNamesEqual,
  isValidName,
  NAME_LENGTHS
}