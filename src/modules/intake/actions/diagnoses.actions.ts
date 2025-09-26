'use server'

import { z } from 'zod'

import { getDiagnosisSuggestionsFromAI } from '../application/step3/diagnosisSuggestionService'
import { DIAGNOSIS_TYPE, DIAGNOSIS_SEVERITY } from '../application/step3/diagnoses.enums'
import {
  withAuth,
  withSecurity,
  withRateLimit,
  withAudit
} from '../infrastructure/wrappers/security-wrappers'

// Input validation schema
const GenerateSuggestionsSchema = z.object({
  presentingProblem: z.string().min(10, 'Please provide at least 10 characters').max(2000, 'Maximum 2000 characters allowed')
})

// Output schema for type safety (matches service validation)
const SuggestionSchema = z.object({
  code: z.string().min(2).max(10),
  description: z.string().min(3).max(200),
  type: z.enum(DIAGNOSIS_TYPE),
  severity: z.enum(DIAGNOSIS_SEVERITY),
  confidence: z.number().int().min(0).max(100).optional(),
  note: z.string().max(500).optional()
}).strict()

export type DiagnosisSuggestion = z.infer<typeof SuggestionSchema>

export type GenerateSuggestionsResult =
  | { ok: true; suggestions: DiagnosisSuggestion[] }
  | { ok: false; error: string }

/**
 * Core function: Generate diagnosis suggestions using OpenAI
 * This is the unwrapped implementation
 */
async function generateDiagnosisSuggestionsCore(
  input: z.infer<typeof GenerateSuggestionsSchema>
): Promise<GenerateSuggestionsResult> {
  try {
    // Validate input
    const validated = GenerateSuggestionsSchema.parse(input)

    // Call application service
    const result = await getDiagnosisSuggestionsFromAI(validated.presentingProblem)

    if (!result.ok) {
      // Return generic error message to client
      return { ok: false, error: 'Unable to generate suggestions. Please try again.' }
    }

    // Validate and return suggestions
    const suggestions = z.array(SuggestionSchema).parse(result.data)

    return {
      ok: true,
      suggestions: suggestions.slice(0, 5) // Limit to 5 suggestions max
    }
  } catch (error) {
    // Log error server-side only (not exposing to client)
    if (error instanceof z.ZodError) {
      return { ok: false, error: 'Invalid input provided.' }
    }

    // Generic error for any other failures
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Server Action: Generate diagnosis suggestions using OpenAI
 * Security: Server-only, API key never exposed to client
 * Wrappers: withAuth → withSecurity → withRateLimit → withAudit
 * Rate Limit: 10 requests per minute per organization
 */
export const generateDiagnosisSuggestions = withAuth(
  withSecurity(
    withRateLimit(
      withAudit(
        generateDiagnosisSuggestionsCore,
        'generate_diagnosis_suggestions'
      ),
      { maxRequests: 10, windowMs: 60000 } // 10 req/min per org
    )
  )
)