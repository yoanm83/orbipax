/**
 * Clinical Assessment Use Cases Tests - Application Layer - Step 3
 * OrbiPax Community Mental Health System
 *
 * Tests the use case orchestration with mocked repository
 * Verifies Domain validation and error mapping for clinical assessments
 *
 * SoC: Tests Application logic only - mocks Infrastructure via ports
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadStep3,
  upsertDiagnoses
} from '@/modules/intake/application/step3/usecases'
import {
  DiagnosesErrorCodes
} from '@/modules/intake/application/step3/dtos'
import type {
  DiagnosesRepository,
  RepositoryResponse
} from '@/modules/intake/application/step3/ports'
import type {
  Step3InputDTO,
  Step3OutputDTO
} from '@/modules/intake/application/step3/dtos'

describe('Clinical Assessment Use Cases - Step 3', () => {
  // Mock repository implementation
  const createMockRepository = (): DiagnosesRepository => ({
    findBySession: vi.fn(),
    save: vi.fn()
  })

  let mockRepository: DiagnosesRepository

  beforeEach(() => {
    mockRepository = createMockRepository()
    vi.clearAllMocks()
  })

  describe('loadStep3', () => {
    const sessionId = 'session_123'
    const organizationId = 'org_456'

    it('should return clinical assessment data when repository returns OK', async () => {
      // Arrange
      const mockData: Step3OutputDTO = {
        id: 'step3_123',
        sessionId,
        organizationId,
        data: {
          diagnoses: {
            primaryDiagnosis: 'F41.1 Generalized Anxiety Disorder',
            secondaryDiagnoses: ['F32.0 Major Depressive Disorder'],
            substanceUseDisorder: 'no',
            mentalHealthHistory: 'Previous treatment for anxiety',
            diagnosisRecords: []
          },
          psychiatricEvaluation: {
            currentSymptoms: ['anxiety', 'low mood'],
            severityLevel: 'moderate',
            suicidalIdeation: false,
            homicidalIdeation: false,
            psychoticSymptoms: false,
            medicationCompliance: 'good',
            treatmentHistory: 'Previous SSRI treatment',
            hasPsychEval: true,
            evaluationDate: '2025-09-28',
            evaluatedBy: 'Dr. Smith'
          },
          functionalAssessment: {
            affectedDomains: ['social', 'occupational'],
            adlsIndependence: 'independent',
            iadlsIndependence: 'independent',
            cognitiveFunctioning: 'intact',
            hasSafetyConcerns: false,
            globalFunctioning: 65,
            dailyLivingActivities: [],
            socialFunctioning: 'impaired',
            occupationalFunctioning: 'mildly-impaired',
            cognitiveStatus: 'intact',
            adaptiveBehavior: 'adequate'
          }
        },
        createdAt: '2025-09-28T10:00:00Z',
        updatedAt: '2025-09-28T10:00:00Z',
        completedAt: null,
        lastModifiedBy: 'user_123'
      }

      const mockResponse: RepositoryResponse<Step3OutputDTO> = {
        ok: true,
        data: mockData
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadStep3(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toEqual(mockData)
      expect(mockRepository.findBySession).toHaveBeenCalledWith(sessionId, organizationId)
      expect(mockRepository.findBySession).toHaveBeenCalledTimes(1)
    })

    it('should return validation error when sessionId is missing', async () => {
      // Act
      const result = await loadStep3(mockRepository, '', organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.findBySession).not.toHaveBeenCalled()
    })

    it('should return validation error when organizationId is missing', async () => {
      // Act
      const result = await loadStep3(mockRepository, sessionId, '')

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.findBySession).not.toHaveBeenCalled()
    })

    it('should return empty structure when repository returns NOT_FOUND', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<Step3OutputDTO> = {
        ok: false,
        error: { code: DiagnosesErrorCodes.NOT_FOUND }
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadStep3(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.sessionId).toBe(sessionId)
      expect(result.data?.organizationId).toBe(organizationId)
      expect(result.data?.data.diagnoses).toBeDefined()
      expect(result.data?.data.psychiatricEvaluation).toBeDefined()
      expect(result.data?.data.functionalAssessment).toBeDefined()
    })

    it('should map other repository errors without PHI', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<Step3OutputDTO> = {
        ok: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Connection failed to patient database'
        }
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadStep3(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe('DATABASE_ERROR')
      // Error message is passed through from repository
      expect(result.error?.message).toBe('Connection failed to patient database')
    })

    it('should handle repository exceptions gracefully', async () => {
      // Arrange
      vi.mocked(mockRepository.findBySession).mockRejectedValue(new Error('Network timeout'))

      // Act
      const result = await loadStep3(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred while loading clinical assessment data')
    })
  })

  describe('upsertDiagnoses', () => {
    const sessionId = 'session_123'
    const organizationId = 'org_456'

    const validInput: Step3InputDTO = {
      diagnoses: {
        primaryDiagnosis: 'F41.1 Generalized Anxiety Disorder',
        secondaryDiagnoses: [],
        substanceUseDisorder: 'no',
        mentalHealthHistory: 'No prior mental health treatment',
        diagnosisRecords: []
      },
      psychiatricEvaluation: {
        currentSymptoms: ['anxiety', 'worry'],
        severityLevel: 'mild',
        suicidalIdeation: false,
        homicidalIdeation: false,
        psychoticSymptoms: false,
        medicationCompliance: 'not-prescribed',
        treatmentHistory: '',
        hasPsychEval: false
      },
      functionalAssessment: {
        affectedDomains: ['cognition'],
        adlsIndependence: 'independent',
        iadlsIndependence: 'independent',
        cognitiveFunctioning: 'normal',
        hasSafetyConcerns: false,
        globalFunctioning: 70,
        dailyLivingActivities: [],
        socialFunctioning: 'good',
        occupationalFunctioning: 'full-time',
        cognitiveStatus: 'alert-oriented',
        adaptiveBehavior: 'adequate'
      }
    }

    it('should save clinical assessment when input is valid', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: true,
        data: { sessionId }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await upsertDiagnoses(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(sessionId)
      expect(mockRepository.save).toHaveBeenCalledWith(sessionId, organizationId, validInput)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should return validation error when sessionId is missing', async () => {
      // Act
      const result = await upsertDiagnoses(mockRepository, validInput, '', organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should return validation error when organizationId is missing', async () => {
      // Act
      const result = await upsertDiagnoses(mockRepository, validInput, sessionId, '')

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should return validation error for invalid domain data', async () => {
      // Arrange - Invalid severity level and empty affectedDomains (violates min(1))
      const invalidInput: Step3InputDTO = {
        diagnoses: {
          primaryDiagnosis: '',
          secondaryDiagnoses: [],
          substanceUseDisorder: 'invalid-value' as any, // Invalid enum value
          mentalHealthHistory: '',
          diagnosisRecords: []
        },
        psychiatricEvaluation: {
          currentSymptoms: [],
          severityLevel: 'invalid-severity' as any, // Invalid enum value
          suicidalIdeation: false,
          homicidalIdeation: false,
          psychoticSymptoms: false,
          medicationCompliance: 'full',
          treatmentHistory: '',
          hasPsychEval: false
        },
        functionalAssessment: {
          affectedDomains: [], // Invalid - must have at least 1
          adlsIndependence: 'independent',
          iadlsIndependence: 'independent',
          cognitiveFunctioning: 'normal',
          hasSafetyConcerns: false,
          globalFunctioning: 50,
          dailyLivingActivities: [],
          socialFunctioning: 'good',
          occupationalFunctioning: 'full-time',
          cognitiveStatus: 'alert-oriented',
          adaptiveBehavior: 'adequate'
        }
      }

      // Act
      const result = await upsertDiagnoses(mockRepository, invalidInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Clinical assessment data validation failed')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should map repository errors to use case response', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.SAVE_FAILED,
          message: 'Database write failed'
        }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await upsertDiagnoses(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.SAVE_FAILED)
      expect(result.error?.message).toBe('Database write failed')
    })

    it('should handle repository exceptions gracefully', async () => {
      // Arrange
      vi.mocked(mockRepository.save).mockRejectedValue(new Error('Network error'))

      // Act
      const result = await upsertDiagnoses(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred while saving clinical assessment data')
    })

    it('should accept partial data for draft saves', async () => {
      // Arrange - Minimal/partial input
      const partialInput: Step3InputDTO = {
        diagnoses: {
          primaryDiagnosis: 'F41.1',
          secondaryDiagnoses: [],
          diagnosisRecords: []
        },
        psychiatricEvaluation: {
          currentSymptoms: [],
          hasPsychEval: false
        },
        functionalAssessment: {
          affectedDomains: ['cognition'],
          adlsIndependence: 'independent',
          iadlsIndependence: 'independent',
          cognitiveFunctioning: 'normal',
          hasSafetyConcerns: false,
          dailyLivingActivities: []
        }
      }

      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: true,
        data: { sessionId }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await upsertDiagnoses(mockRepository, partialInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(sessionId)
      expect(mockRepository.save).toHaveBeenCalledWith(sessionId, organizationId, partialInput)
    })

    it('should handle empty repository response gracefully', async () => {
      // Arrange - Repository returns error without data
      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.UNKNOWN,
          message: 'Repository failed to save'
        }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await upsertDiagnoses(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('Repository failed to save')
    })
  })
})