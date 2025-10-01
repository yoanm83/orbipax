import OpenAI from 'openai'
import { z } from 'zod'

import { auditLog } from '@/shared/utils/telemetry/audit-log'

import { DIAGNOSIS_TYPE, DIAGNOSIS_SEVERITY, type DiagnosisType, type DiagnosisSeverity } from './diagnoses.enums'

// Re-export for backward compatibility
export type { DiagnosisType, DiagnosisSeverity }

// Strict schema for individual diagnosis suggestion
const DiagnosisSuggestionSchema = z.object({
  code: z.string().min(2, 'DSM-5 code too short').max(10, 'DSM-5 code too long'),
  description: z.string().min(3, 'Description too short').max(200, 'Description too long'),
  type: z.enum(DIAGNOSIS_TYPE),
  severity: z.enum(DIAGNOSIS_SEVERITY),
  confidence: z.number().int().min(0).max(100).optional(),
  note: z.string().max(500).optional()
}).strict() // Reject any extra fields

// Array schema for OpenAI response validation
const AIResponseSchema = z.array(DiagnosisSuggestionSchema).min(1).max(3)

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error?: string }

/**
 * Application Service: Generate diagnosis suggestions using OpenAI
 * Security: Server-side only, API key accessed via environment variable
 * Returns structured DSM-5 diagnosis suggestions based on presenting problem
 */
export async function getDiagnosisSuggestionsFromAI(
  presentingProblem: string
): Promise<ServiceResult<z.infer<typeof AIResponseSchema>>> {
  try {
    // Access API key from environment (server-only)
    const apiKey = process.env['OPENAI_API_KEY']

    if (!apiKey) {
      // Generic error - don't expose missing key details
      return { ok: false }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    })

    // Get current date for context
    const todayISO = new Date().toISOString().split('T')[0]

    // Create strict prompt with format requirements
    const systemPrompt = `You are a clinical assistant helping mental health professionals.

IMPORTANT INSTRUCTIONS:
1. Always respond in English regardless of input language.
2. Return ONLY a JSON array - no prose, no markdown, no explanations.
3. Include exactly 1-3 diagnosis suggestions based on relevance.
4. Each suggestion MUST have EXACTLY these fields:
   - code: DSM-5 code (e.g., "F32.9")
   - description: DSM-5 diagnosis name in English
   - type: Must be exactly "Primary", "Secondary", or "Rule-out"
   - severity: Must be exactly "Mild", "Moderate", or "Severe"
   - confidence: (optional) integer 0-100 based on symptom match
   - note: (optional) brief clinical rationale in English, max 100 words

5. Do NOT include any extra fields or properties.
6. Use only valid DSM-5 codes for mental health conditions.
7. Today's date is ${todayISO} for temporal context.

Output format:
[
  {
    "code": "F32.9",
    "description": "Major Depressive Disorder, Unspecified",
    "type": "Primary",
    "severity": "Moderate",
    "confidence": 75,
    "note": "Symptoms align with depression criteria"
  }
]

Remember: JSON array only, no additional text.`

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
          content: `Presenting problem: ${presentingProblem}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent clinical suggestions
      max_tokens: 500
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      return { ok: false }
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseContent)

    // Extract suggestions array (handle 3 cases: direct array, suggestions field, or single object)
    const suggestions = Array.isArray(parsed)
      ? parsed
      : parsed.suggestions && Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : (parsed && typeof parsed === 'object' && parsed.code && typeof parsed.code === 'string')
          ? [parsed] // Wrap single diagnosis object in array
          : []

    // DEV ONLY: Log AI response metadata (sanitized, no PHI/PII)
    if (process.env.NODE_ENV !== 'production') {
      const traceId = crypto.randomUUID()

      // Create safe summary without exposing clinical content
      const safeSummary = {
        length: responseContent.length,
        wordCount: responseContent.split(/\s+/).length,
        // Simple hash for tracking without crypto module (avoid Node.js dependency in edge runtime)
        hash: responseContent.split('').reduce((acc, char) => {
          return ((acc << 5) - acc + char.charCodeAt(0)) | 0
        }, 0).toString(16)
      }

      auditLog('AI_RAW', {
        action: 'generate_diagnosis_suggestions',
        traceId,
        responseSummary: safeSummary, // Safe metadata only
        parsedType: Array.isArray(parsed) ? 'array' : 'object',
        suggestionsLength: suggestions.length,
        suggestionsMetadata: suggestions.length > 0 ? {
          hasRequiredFields: suggestions[0] ?
            ['code', 'description', 'type', 'severity'].every(field => field in suggestions[0]) : false,
          codePrefix: suggestions[0]?.code ? suggestions[0].code.substring(0, 3) : null // Only prefix
        } : null,
        inputMetadata: {
          length: presentingProblem.length,
          wordCount: presentingProblem.split(/\s+/).length,
          languageDetected: /[áéíóúñ]/i.test(presentingProblem) ? 'spanish' : 'english'
        }
      })
    }

    // Validate against strict schema
    const parseResult = AIResponseSchema.safeParse(suggestions)

    if (!parseResult.success) {
      // Log validation error in development only
      if (process.env.NODE_ENV === 'development') {
        auditLog('ERROR', {
          action: 'getDiagnosisSuggestionsFromAI',
          error: 'ZodValidationError',
          details: 'Schema validation failed for AI response'
        })
      }
      // Return generic error - don't expose validation details
      return { ok: false }
    }

    const validated = parseResult.data

    return {
      ok: true,
      data: validated
    }
  } catch (error) {
    // Log error details server-side only
    if (process.env.NODE_ENV === 'development') {
      auditLog('ERROR', {
        action: 'getDiagnosisSuggestionsFromAI',
        error: error instanceof Error ? error.name : 'UnknownError',
        details: 'Failed to generate diagnosis suggestions'
      })
    }

    // Return generic failure (no error details to client)
    return { ok: false }
  }
}