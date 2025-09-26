import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getDiagnosisSuggestionsFromAI } from '@/modules/intake/application/step3/diagnosisSuggestionService'

// Create mock for OpenAI
const mockCreate = vi.fn()

// Mock OpenAI module
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate
      }
    }
  }))
}))

describe('getDiagnosisSuggestionsFromAI', () => {
  beforeEach(() => {
    // Setup environment variable
    vi.stubEnv('OPENAI_API_KEY', 'test-api-key-mock')

    // Clear mock history
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('Success Cases', () => {
    it('should return single valid suggestion with all required fields', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder, Unspecified',
              type: 'Primary',
              severity: 'Moderate',
              confidence: 75,
              note: 'Based on reported symptoms'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Patient reports persistent sadness')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toHaveLength(1)
        expect(result.data[0]).toEqual({
          code: 'F32.9',
          description: 'Major Depressive Disorder, Unspecified',
          type: 'Primary',
          severity: 'Moderate',
          confidence: 75,
          note: 'Based on reported symptoms'
        })
      }
    })

    it('should return two valid suggestions', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              {
                code: 'F41.1',
                description: 'Generalized Anxiety Disorder',
                type: 'Primary',
                severity: 'Mild'
              },
              {
                code: 'F32.0',
                description: 'Major Depressive Disorder, Mild',
                type: 'Secondary',
                severity: 'Mild'
              }
            ])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Patient reports anxiety and low mood')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toHaveLength(2)
        expect(result.data[0].type).toBe('Primary')
        expect(result.data[1].type).toBe('Secondary')
      }
    })

    it('should return three suggestions (maximum allowed)', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              {
                code: 'F20.9',
                description: 'Schizophrenia, Unspecified',
                type: 'Primary',
                severity: 'Severe'
              },
              {
                code: 'F31.9',
                description: 'Bipolar Disorder, Unspecified',
                type: 'Rule-out',
                severity: 'Moderate'
              },
              {
                code: 'F29',
                description: 'Psychosis Not Otherwise Specified',
                type: 'Secondary',
                severity: 'Moderate'
              }
            ])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Complex presentation with psychotic features')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toHaveLength(3)
      }
    })

    it('should handle optional confidence field correctly', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F43.10',
              description: 'Post-Traumatic Stress Disorder',
              type: 'Primary',
              severity: 'Moderate'
              // No confidence field
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Trauma symptoms')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data[0].confidence).toBeUndefined()
      }
    })

    it('should handle optional note field correctly', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F90.0',
              description: 'ADHD, Combined Type',
              type: 'Primary',
              severity: 'Mild',
              confidence: 80
              // No note field
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Attention difficulties')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data[0].note).toBeUndefined()
      }
    })

    it('should handle response wrapped in suggestions object', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              suggestions: [{
                code: 'F40.10',
                description: 'Social Anxiety Disorder',
                type: 'Primary',
                severity: 'Moderate'
              }]
            })
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Social fears')

      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.data).toHaveLength(1)
        expect(result.data[0].code).toBe('F40.10')
      }
    })
  })

  describe('Invalid Schema Cases', () => {
    it('should reject response with extra fields (strict mode)', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate',
              extraField: 'should fail', // Extra field not allowed
              confidence: 75
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression symptoms')

      expect(result.ok).toBe(false)
      expect(result.error).toBeUndefined() // Generic error, no details
    })

    it('should reject invalid type enum', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Main', // Invalid - should be Primary/Secondary/Rule-out
              severity: 'Moderate'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject invalid severity enum', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'VeryMild' // Invalid - should be Mild/Moderate/Severe
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject confidence less than 0', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate',
              confidence: -1 // Invalid
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject confidence greater than 100', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate',
              confidence: 101 // Invalid
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject non-integer confidence', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate',
              confidence: 75.5 // Must be integer
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject empty array', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject array with more than 3 items', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([
              {
                code: 'F32.9',
                description: 'Depression',
                type: 'Primary',
                severity: 'Moderate'
              },
              {
                code: 'F41.1',
                description: 'Anxiety',
                type: 'Secondary',
                severity: 'Mild'
              },
              {
                code: 'F43.10',
                description: 'PTSD',
                type: 'Secondary',
                severity: 'Moderate'
              },
              {
                code: 'F90.0',
                description: 'ADHD',
                type: 'Rule-out',
                severity: 'Mild'
              }
            ])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Multiple symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject code that is too short', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F', // Too short (min 2)
              description: 'Some Disorder',
              type: 'Primary',
              severity: 'Moderate'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject code that is too long', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9999999', // Too long (max 10)
              description: 'Some Disorder',
              type: 'Primary',
              severity: 'Moderate'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject description that is too short', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32',
              description: 'MD', // Too short (min 3)
              type: 'Primary',
              severity: 'Moderate'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })

    it('should reject note that is too long', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate',
              note: 'x'.repeat(501) // Too long (max 500)
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })
  })

  describe('API Error Cases', () => {
    it('should return ok:false when OpenAI client throws error', async () => {
      mockCreate.mockRejectedValueOnce(new Error('OpenAI API Error'))

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
      expect(result.error).toBeUndefined() // No error details exposed
    })

    it('should return ok:false on network timeout', async () => {
      mockCreate.mockRejectedValueOnce(new Error('Request timeout'))

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
      expect(result.error).toBeUndefined()
    })

    it('should return ok:false on malformed JSON response', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'Not valid JSON {]'
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
      expect(result.error).toBeUndefined()
    })

    it('should return ok:false when API key is missing', async () => {
      vi.stubEnv('OPENAI_API_KEY', '')

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
      expect(result.error).toBeUndefined()
      expect(mockCreate).not.toHaveBeenCalled() // Should not call API
    })

    it('should return ok:false when response has no choices', async () => {
      const mockResponse = {
        choices: []
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })

    it('should return ok:false when response content is undefined', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: undefined
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
    })

    it('should never expose provider error details', async () => {
      const sensitiveError = new Error('Invalid API key: sk-1234...')
      mockCreate.mockRejectedValueOnce(sensitiveError)

      const result = await getDiagnosisSuggestionsFromAI('Symptoms')

      expect(result.ok).toBe(false)
      expect(result.error).toBeUndefined()
      // Ensure sensitive message is not in result
      expect(JSON.stringify(result)).not.toContain('sk-1234')
      expect(JSON.stringify(result)).not.toContain('Invalid API key')
    })
  })

  describe('Input Validation', () => {
    it('should handle minimum input (10 characters)', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F99',
              description: 'Mental Disorder NOS',
              type: 'Primary',
              severity: 'Mild'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Depression') // Exactly 10 chars

      expect(result.ok).toBe(true)
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: expect.stringContaining('Depression')
            })
          ])
        })
      )
    })

    it('should handle maximum input (2000 characters)', async () => {
      const longInput = 'x'.repeat(2000)
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F99',
              description: 'Mental Disorder NOS',
              type: 'Primary',
              severity: 'Mild'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI(longInput)

      expect(result.ok).toBe(true)
      expect(mockCreate).toHaveBeenCalled()
    })

    it('should handle special characters in input', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('Patient\'s symptoms: "anxiety" & <depression>')

      expect(result.ok).toBe(true)
    })

    it('should handle multi-language input', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F32.9',
              description: 'Major Depressive Disorder',
              type: 'Primary',
              severity: 'Moderate'
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse)

      const result = await getDiagnosisSuggestionsFromAI('El paciente presenta síntomas de 焦虑')

      expect(result.ok).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle all enum values correctly', async () => {
      // Test all valid type values
      const types = ['Primary', 'Secondary', 'Rule-out']
      const severities = ['Mild', 'Moderate', 'Severe']

      for (const type of types) {
        for (const severity of severities) {
          const mockResponse = {
            choices: [{
              message: {
                content: JSON.stringify([{
                  code: 'F99',
                  description: 'Test Disorder',
                  type,
                  severity
                }])
              }
            }]
          }
          mockCreate.mockResolvedValueOnce(mockResponse)

          const result = await getDiagnosisSuggestionsFromAI(`Test ${type} ${severity}`)

          expect(result.ok).toBe(true)
          if (result.ok) {
            expect(result.data[0].type).toBe(type)
            expect(result.data[0].severity).toBe(severity)
          }
        }
      }
    })

    it('should handle confidence boundary values', async () => {
      // Test confidence = 0
      const mockResponse1 = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F99',
              description: 'Test',
              type: 'Primary',
              severity: 'Mild',
              confidence: 0
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse1)

      const result1 = await getDiagnosisSuggestionsFromAI('Test')
      expect(result1.ok).toBe(true)
      if (result1.ok) {
        expect(result1.data[0].confidence).toBe(0)
      }

      // Test confidence = 100
      const mockResponse2 = {
        choices: [{
          message: {
            content: JSON.stringify([{
              code: 'F99',
              description: 'Test',
              type: 'Primary',
              severity: 'Mild',
              confidence: 100
            }])
          }
        }]
      }
      mockCreate.mockResolvedValueOnce(mockResponse2)

      const result2 = await getDiagnosisSuggestionsFromAI('Test')
      expect(result2.ok).toBe(true)
      if (result2.ok) {
        expect(result2.data[0].confidence).toBe(100)
      }
    })
  })
})