import OpenAI from 'openai'
import { z } from 'zod'
import { auditLog } from '@/shared/utils/telemetry/audit-log'

// Generic suggestion schema - can be used for any type of clinical suggestion
const SuggestionSchema = z.object({
  text: z.string().min(10).max(500),
  confidence: z.number().int().min(0).max(100).optional(),
  rationale: z.string().max(200).optional()
})

export type Suggestion = z.infer<typeof SuggestionSchema>

export type SuggestionType = 'diagnosis' | 'treatment_goals' | 'interventions'

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error?: string }

/**
 * Shared Application Service: Generate clinical suggestions using OpenAI
 * Can be used for diagnoses, treatment goals, interventions, etc.
 * Security: Server-side only, API key accessed via environment variable
 */
export async function getAISuggestions(
  input: string,
  type: SuggestionType,
  maxSuggestions: number = 3
): Promise<ServiceResult<string[]>> {
  try {
    // Access API key from environment (server-only)
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return { ok: false }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey })

    // Get current date for context
    const todayISO = new Date().toISOString().split('T')[0]

    // Create type-specific prompts
    let systemPrompt = ''

    switch (type) {
      case 'treatment_goals':
        systemPrompt = `You are a clinical assistant helping mental health professionals create treatment goals.

IMPORTANT INSTRUCTIONS:
1. Always respond in English regardless of input language.
2. Return ONLY a JSON array of strings - no prose, no explanations.
3. Include exactly ${maxSuggestions} SMART treatment goals based on the presenting concerns.
4. Each goal should be:
   - Specific and measurable
   - Achievable within 3-6 months
   - Relevant to mental health treatment
   - Time-bound with clear outcomes
5. Use professional clinical language.
6. Today's date is ${todayISO} for temporal context.

Output format:
[
  "Client will identify and implement 3 coping strategies to manage depressive symptoms, resulting in a 30% reduction in reported low mood episodes within 3 months.",
  "Client will practice relaxation techniques daily and identify triggers for anxiety, achieving a measurable reduction in anxiety symptoms as measured by GAD-7 scores within 2 months."
]

Remember: JSON array of strings only, no additional text.`
        break

      case 'interventions':
        systemPrompt = `You are a clinical assistant helping mental health professionals identify interventions.

Return a JSON array of ${maxSuggestions} evidence-based intervention strategies.
Each should be a concise string describing a specific therapeutic intervention.
Today's date is ${todayISO}.`
        break

      default:
        return { ok: false }
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: input
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      return { ok: false }
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseContent)

    // Extract array (handle wrapped responses)
    const suggestions = Array.isArray(parsed)
      ? parsed
      : parsed.suggestions && Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : parsed.goals && Array.isArray(parsed.goals)
          ? parsed.goals
          : []

    // Validate we got strings
    if (!Array.isArray(suggestions) || suggestions.some(s => typeof s !== 'string')) {
      return { ok: false }
    }

    // Log in dev (sanitized)
    if (process.env.NODE_ENV !== 'production') {
      auditLog('AI_SUGGESTIONS', {
        action: `generate_${type}_suggestions`,
        suggestionsCount: suggestions.length,
        inputLength: input.length
      })
    }

    return {
      ok: true,
      data: suggestions.slice(0, maxSuggestions)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      auditLog('ERROR', {
        action: `getAISuggestions_${type}`,
        error: error instanceof Error ? error.name : 'UnknownError'
      })
    }
    return { ok: false }
  }
}

/**
 * Specialized function for treatment goals
 * Maintains backward compatibility with direct usage
 */
export async function getTreatmentGoalSuggestions(
  clientConcerns: string
): Promise<ServiceResult<string[]>> {
  return getAISuggestions(clientConcerns, 'treatment_goals', 1)
}