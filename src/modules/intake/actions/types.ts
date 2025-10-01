/**
 * Common Types for Intake Actions
 * OrbiPax Community Mental Health (CMH) System
 *
 * Shared type definitions used across all intake action handlers.
 * These types provide consistent contracts between UI → Actions → Application layers.
 *
 * SoC: Actions layer contracts - type-only, no runtime logic
 * Pattern: Type-only exports for clean imports across steps
 */

// =================================================================
// ACTION RESPONSE TYPE
// =================================================================

/**
 * Standard response type for Server Actions in intake module
 *
 * Generic discriminated union for type-safe error handling in Server Actions.
 * Used consistently across all intake steps (demographics, insurance, clinical, etc.)
 *
 * @template T - The type of data returned on success (defaults to void for mutations)
 *
 * @example
 * ```typescript
 * // Success response with data
 * const result: ActionResponse<DemographicsData> = {
 *   ok: true,
 *   data: { firstName: 'John', lastName: 'Doe', ... }
 * }
 *
 * // Error response
 * const result: ActionResponse = {
 *   ok: false,
 *   error: {
 *     code: 'VALIDATION_FAILED',
 *     message: 'Required fields are missing'
 *   }
 * }
 *
 * // Usage in action handler
 * async function saveData(): Promise<ActionResponse<{ id: string }>> {
 *   try {
 *     const result = await repository.save(data)
 *     if (!result.ok) {
 *       return { ok: false, error: { code: 'SAVE_FAILED' } }
 *     }
 *     return { ok: true, data: { id: result.data.id } }
 *   } catch (err) {
 *     return { ok: false, error: { code: 'UNKNOWN' } }
 *   }
 * }
 * ```
 */
export type ActionResponse<T = void> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: {
        code: string
        message?: string // Generic message only, no PHI/sensitive data
      }
    }

// =================================================================
// TYPE GUARDS
// =================================================================

/**
 * Type guard to check if action response is successful
 *
 * @example
 * ```typescript
 * const result = await loadDemographics()
 * if (isSuccessResponse(result)) {
 *   // TypeScript knows result.data exists
 *   console.log(result.data.firstName)
 * } else {
 *   // TypeScript knows result.error exists
 *   console.error(result.error.code)
 * }
 * ```
 */
export function isSuccessResponse<T>(
  response: ActionResponse<T>
): response is { ok: true; data: T } {
  return response.ok === true
}

/**
 * Type guard to check if action response is an error
 */
export function isErrorResponse<T>(
  response: ActionResponse<T>
): response is { ok: false; error: { code: string; message?: string } } {
  return response.ok === false
}
