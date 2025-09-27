'use server'

import { z } from 'zod'
import { getTreatmentGoalSuggestions } from '../application/ai/suggestionService'
import {
  withAuth,
  withSecurity,
  withRateLimit,
  withAudit
} from '../infrastructure/wrappers/security-wrappers'

// Input validation schema
const GenerateGoalsSchema = z.object({
  clientConcerns: z.string().min(10, 'Please provide at least 10 characters').max(2000, 'Maximum 2000 characters allowed')
})

export type GenerateGoalsResult =
  | { ok: true; suggestion: string }
  | { ok: false; error: string }

/**
 * Core function: Generate treatment goal suggestions using OpenAI
 * This is the unwrapped implementation
 */
async function generateTreatmentGoalSuggestionsCore(
  input: z.infer<typeof GenerateGoalsSchema>
): Promise<GenerateGoalsResult> {
  try {
    // Validate input
    const validated = GenerateGoalsSchema.parse(input)

    // Call application service
    const result = await getTreatmentGoalSuggestions(validated.clientConcerns)

    if (!result.ok) {
      return { ok: false, error: 'Unable to generate suggestions. Please try again.' }
    }

    // Return the first suggestion (service returns array of 1)
    const suggestion = result.data[0]

    if (!suggestion) {
      return { ok: false, error: 'No suggestions generated. Please try again.' }
    }

    return {
      ok: true,
      suggestion
    }
  } catch (error) {
    // Log error server-side only
    if (error instanceof z.ZodError) {
      return { ok: false, error: 'Invalid input provided.' }
    }

    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

/**
 * Server Action: Generate treatment goal suggestions using OpenAI
 * Security: Server-only, API key never exposed to client
 * Wrappers: withAuth → withSecurity → withRateLimit → withAudit
 * Rate Limit: 10 requests per minute per organization (same as diagnosis)
 */
export const generateTreatmentGoalSuggestions = withAuth(
  withSecurity(
    withRateLimit(
      withAudit(
        generateTreatmentGoalSuggestionsCore,
        'generate_treatment_goal_suggestions'
      ),
      { maxRequests: 10, windowMs: 60000 } // 10 req/min per org
    )
  )
)