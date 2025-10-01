/**
 * Diagnoses Server Actions Tests - Step 3
 * OrbiPax Community Mental Health System
 *
 * Tests server action behavior with mocked auth guards and factory
 * Verifies error mapping and security boundaries for clinical assessment
 *
 * SoC: Tests Actions layer only - mocks auth, factory, and use cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadStep3Action,
  upsertDiagnosesAction
} from '@/modules/intake/actions/step3/diagnoses.actions'
import type {
  Step3InputDTO,
  Step3OutputDTO,
  LoadStep3Response,
  SaveStep3Response
} from '@/modules/intake/application/step3/dtos'
import type { DiagnosesRepository } from '@/modules/intake/application/step3/ports'
import { DiagnosesErrorCodes } from '@/modules/intake/application/step3/dtos'

// Mock the auth guard module
vi.mock('@/shared/lib/current-user.server', () => ({
  resolveUserAndOrg: vi.fn()
}))

// Mock the factory module
vi.mock('@/modules/intake/infrastructure/factories/diagnoses.factory', () => ({
  createDiagnosesRepository: vi.fn()
}))

// Mock the use cases module
vi.mock('@/modules/intake/application/step3', async () => {
  const actual = await vi.importActual<typeof import('@/modules/intake/application/step3')>('@/modules/intake/application/step3')
  return {
    ...actual,
    loadStep3: vi.fn(),
    upsertDiagnoses: vi.fn(),
    DiagnosesErrorCodes: {
      VALIDATION_FAILED: 'VALIDATION_FAILED',
      NOT_FOUND: 'NOT_FOUND',
      UNAUTHORIZED: 'UNAUTHORIZED',
      SAVE_FAILED: 'SAVE_FAILED',
      UNKNOWN: 'UNKNOWN'
    }
  }
})

// Import mocked functions
import { resolveUserAndOrg } from '@/shared/lib/current-user.server'
import { createDiagnosesRepository } from '@/modules/intake/infrastructure/factories/diagnoses.factory'
import { loadStep3, upsertDiagnoses } from '@/modules/intake/application/step3'

describe('Diagnoses Server Actions - Step 3', () => {
  const mockUserId = 'user_123'
  const mockOrganizationId = 'org_456'
  const mockSessionId = `session_${mockUserId}_intake`

  // Mock repository instance
  const mockRepository: DiagnosesRepository = {
    findBySession: vi.fn(),
    save: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default factory mock to return repository
    vi.mocked(createDiagnosesRepository).mockReturnValue(mockRepository)
  })

  describe('loadStep3Action', () => {
    it('should return UNAUTHORIZED when session is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockRejectedValue(new Error('No session'))

      // Act
      const result = await loadStep3Action()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNAUTHORIZED)
      expect(result.error?.message).toBe('Authentication required')
      expect(createDiagnosesRepository).not.toHaveBeenCalled()
      expect(loadStep3).not.toHaveBeenCalled()
    })

    it('should return ORGANIZATION_MISMATCH when organizationId is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: '' // Empty organization
      })

      // Act
      const result = await loadStep3Action()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe('ORGANIZATION_MISMATCH')
      expect(result.error?.message).toBe('Invalid organization context')
      expect(createDiagnosesRepository).not.toHaveBeenCalled()
      expect(loadStep3).not.toHaveBeenCalled()
    })

    it('should use factory mock and return clinical data with valid session', async () => {
      // Arrange
      const mockClinicalData: Step3OutputDTO = {
        id: 'step3_123',
        sessionId: mockSessionId,
        organizationId: mockOrganizationId,
        data: {
          diagnoses: {
            primaryDiagnosis: 'F41.1 Generalized Anxiety Disorder',
            secondaryDiagnoses: ['F32.0 Major Depressive Disorder, Single Episode, Mild'],
            substanceUseDisorder: 'no',
            mentalHealthHistory: 'Previous anxiety treatment 2 years ago',
            diagnosisRecords: []
          },
          psychiatricEvaluation: {
            currentSymptoms: ['anxiety', 'low mood', 'insomnia'],
            severityLevel: 'moderate',
            suicidalIdeation: false,
            homicidalIdeation: false,
            psychoticSymptoms: false,
            medicationCompliance: 'good',
            treatmentHistory: 'Previous SSRI treatment with good response',
            hasPsychEval: true,
            evaluationDate: '2025-09-28',
            evaluatedBy: 'Dr. Smith',
            evaluationSummary: 'Patient presents with moderate anxiety symptoms'
          },
          functionalAssessment: {
            affectedDomains: ['social', 'occupational'],
            adlsIndependence: 'independent',
            iadlsIndependence: 'needs-minimal-assistance',
            cognitiveFunctioning: 'intact',
            hasSafetyConcerns: false,
            globalFunctioning: 65,
            dailyLivingActivities: ['bathing', 'dressing', 'eating'],
            socialFunctioning: 'impaired',
            occupationalFunctioning: 'mildly-impaired',
            cognitiveStatus: 'intact',
            adaptiveBehavior: 'adequate'
          }
        },
        createdAt: '2025-09-28T10:00:00Z',
        updatedAt: '2025-09-28T10:00:00Z',
        completedAt: null,
        lastModifiedBy: mockUserId
      }

      const mockUseCaseResponse: LoadStep3Response = {
        ok: true,
        data: mockClinicalData
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadStep3).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await loadStep3Action()

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toEqual(mockClinicalData)
      expect(resolveUserAndOrg).toHaveBeenCalledTimes(1)
      expect(createDiagnosesRepository).toHaveBeenCalledTimes(1)
      expect(loadStep3).toHaveBeenCalledWith(
        mockRepository,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should map use case errors to action response without PHI', async () => {
      // Arrange
      const mockUseCaseResponse: LoadStep3Response = {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.NOT_FOUND,
          message: 'Assessment for patient John Doe not found' // PHI in use case error
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadStep3).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await loadStep3Action()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.NOT_FOUND)
      expect(result.error?.message).toBe('Failed to load clinical assessment data') // Generic message, no PHI
      expect(result.error?.message).not.toContain('John Doe')
    })

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadStep3).mockRejectedValue(new Error('Database connection failed'))

      // Act
      const result = await loadStep3Action()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred')
    })
  })

  describe('upsertDiagnosesAction', () => {
    const validInput: Step3InputDTO = {
      diagnoses: {
        primaryDiagnosis: 'F41.1 Generalized Anxiety Disorder',
        secondaryDiagnoses: [],
        substanceUseDisorder: 'no',
        mentalHealthHistory: '',
        diagnosisRecords: []
      },
      psychiatricEvaluation: {
        currentSymptoms: ['anxiety'],
        severityLevel: 'mild',
        suicidalIdeation: false,
        homicidalIdeation: false,
        psychoticSymptoms: false,
        medicationCompliance: 'good',
        treatmentHistory: '',
        hasPsychEval: false
      },
      functionalAssessment: {
        affectedDomains: [],
        adlsIndependence: 'independent',
        iadlsIndependence: 'independent',
        cognitiveFunctioning: 'intact',
        hasSafetyConcerns: false,
        globalFunctioning: 75,
        dailyLivingActivities: [],
        socialFunctioning: 'adequate',
        occupationalFunctioning: 'adequate',
        cognitiveStatus: 'intact',
        adaptiveBehavior: 'adequate'
      }
    }

    it('should return UNAUTHORIZED when session is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockRejectedValue(new Error('No session'))

      // Act
      const result = await upsertDiagnosesAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNAUTHORIZED)
      expect(result.error?.message).toBe('Authentication required')
      expect(createDiagnosesRepository).not.toHaveBeenCalled()
      expect(upsertDiagnoses).not.toHaveBeenCalled()
    })

    it('should map VALIDATION_FAILED from use case to flat contract', async () => {
      // Arrange
      const mockUseCaseResponse: SaveStep3Response = {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.VALIDATION_FAILED,
          message: 'Field primaryDiagnosis is invalid' // Field-specific error
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(upsertDiagnoses).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await upsertDiagnosesAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Invalid clinical assessment data provided') // Generic message
      expect(result.error?.message).not.toContain('primaryDiagnosis')
      expect(createDiagnosesRepository).toHaveBeenCalledTimes(1)
      expect(upsertDiagnoses).toHaveBeenCalledWith(
        mockRepository,
        validInput,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should save clinical assessment with valid session and organization', async () => {
      // Arrange
      const mockUseCaseResponse: SaveStep3Response = {
        ok: true,
        data: { sessionId: mockSessionId }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(upsertDiagnoses).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await upsertDiagnosesAction(validInput)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(mockSessionId)
      expect(resolveUserAndOrg).toHaveBeenCalledTimes(1)
      expect(createDiagnosesRepository).toHaveBeenCalledTimes(1)
      expect(upsertDiagnoses).toHaveBeenCalledWith(
        mockRepository,
        validInput,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should return ORGANIZATION_MISMATCH when organizationId is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: '' // Empty organization
      })

      // Act
      const result = await upsertDiagnosesAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe('ORGANIZATION_MISMATCH')
      expect(result.error?.message).toBe('Invalid organization context')
      expect(createDiagnosesRepository).not.toHaveBeenCalled()
      expect(upsertDiagnoses).not.toHaveBeenCalled()
    })

    it('should handle SAVE_FAILED error with specific message', async () => {
      // Arrange
      const mockUseCaseResponse: SaveStep3Response = {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.SAVE_FAILED,
          message: 'Database write failed'
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(upsertDiagnoses).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await upsertDiagnosesAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.SAVE_FAILED)
      expect(result.error?.message).toBe('Unable to save clinical assessment data')
      expect(result.error?.message).not.toContain('Database')
    })

    it('should handle unexpected errors without exposing details', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(upsertDiagnoses).mockRejectedValue(new Error('Network timeout'))

      // Act
      const result = await upsertDiagnosesAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(DiagnosesErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred')
      expect(result.error?.message).not.toContain('Network')
      expect(result.error?.message).not.toContain('timeout')
    })
  })
})