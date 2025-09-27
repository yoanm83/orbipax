/**
 * Phone Number Utilities
 * OrbiPax Community Mental Health System
 *
 * Shared utilities for phone number validation, formatting, and normalization
 * US phone number format support
 */

// =========================================================================
// CONSTANTS
// =========================================================================

/**
 * US Phone number regex
 * Accepts formats:
 * - (555) 123-4567
 * - 555-123-4567
 * - 555.123.4567
 * - 5551234567
 * - +1 555 123 4567
 * - 1-555-123-4567
 */
const US_PHONE_REGEX = /^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/

// =========================================================================
// VALIDATION
// =========================================================================

/**
 * Validates if a phone number matches US format
 * @param value - Phone number to validate
 * @returns true if valid US phone number format
 */
export function validatePhoneNumber(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false
  }

  // First check if it matches the regex
  if (!US_PHONE_REGEX.test(value.trim())) {
    return false
  }

  // Additionally check that we have exactly 10 digits (US)
  const digits = normalizePhoneNumber(value)
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
}

// =========================================================================
// NORMALIZATION
// =========================================================================

/**
 * Normalizes a phone number by removing all non-digit characters
 * @param value - Phone number to normalize
 * @returns String containing only digits
 */
export function normalizePhoneNumber(value: string): string {
  if (!value || typeof value !== 'string') {
    return ''
  }

  return value.replace(/\D/g, '')
}

// =========================================================================
// FORMATTING
// =========================================================================

/**
 * Formats a phone number to US standard format: (XXX) XXX-XXXX
 * @param value - Phone number to format
 * @returns Formatted phone number or original value if invalid
 */
export function formatPhoneNumber(value: string): string {
  if (!value || typeof value !== 'string') {
    return ''
  }

  // Normalize to get only digits
  const digits = normalizePhoneNumber(value)

  // Handle 11 digits (with country code 1)
  if (digits.length === 11 && digits.startsWith('1')) {
    const areaCode = digits.substring(1, 4)
    const exchange = digits.substring(4, 7)
    const number = digits.substring(7, 11)
    return `(${areaCode}) ${exchange}-${number}`
  }

  // Handle 10 digits (standard US)
  if (digits.length === 10) {
    const areaCode = digits.substring(0, 3)
    const exchange = digits.substring(3, 6)
    const number = digits.substring(6, 10)
    return `(${areaCode}) ${exchange}-${number}`
  }

  // Return original if can't format
  return value
}

// =========================================================================
// INPUT HELPERS
// =========================================================================

/**
 * Formats phone number as user types (for controlled inputs)
 * Provides real-time formatting while maintaining cursor position
 * @param value - Current input value
 * @param previousValue - Previous input value (for backspace detection)
 * @returns Formatted value for display
 */
export function formatPhoneInput(value: string, previousValue: string = ''): string {
  if (!value) return ''

  // Detect if user is deleting
  const isDeleting = value.length < previousValue.length

  // Get only digits
  const digits = normalizePhoneNumber(value)

  // Don't format if deleting
  if (isDeleting) {
    return value
  }

  // Format based on number of digits typed
  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  } else {
    // Limit to 10 digits for US numbers
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

// =========================================================================
// EXTRACTION
// =========================================================================

/**
 * Extracts area code from a phone number
 * @param value - Phone number
 * @returns Area code or empty string
 */
export function extractAreaCode(value: string): string {
  const digits = normalizePhoneNumber(value)

  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.substring(1, 4)
  }

  if (digits.length >= 10) {
    return digits.substring(0, 3)
  }

  return ''
}

// =========================================================================
// TESTS (Basic inline tests - TODO: Move to proper test file)
// =========================================================================

/**
 * Basic tests for phone utilities
 * TODO: Move to __tests__/phone.test.ts when test infrastructure is set up
 */
if (process.env.NODE_ENV === 'test') {
  // Validation tests
  console.assert(validatePhoneNumber('(555) 123-4567') === true)
  console.assert(validatePhoneNumber('555-123-4567') === true)
  console.assert(validatePhoneNumber('5551234567') === true)
  console.assert(validatePhoneNumber('+1 555 123 4567') === true)
  console.assert(validatePhoneNumber('123') === false)
  console.assert(validatePhoneNumber('abc-def-ghij') === false)

  // Normalization tests
  console.assert(normalizePhoneNumber('(555) 123-4567') === '5551234567')
  console.assert(normalizePhoneNumber('+1-555-123-4567') === '15551234567')

  // Formatting tests
  console.assert(formatPhoneNumber('5551234567') === '(555) 123-4567')
  console.assert(formatPhoneNumber('15551234567') === '(555) 123-4567')
  console.assert(formatPhoneNumber('123') === '123') // Returns as-is if invalid
}