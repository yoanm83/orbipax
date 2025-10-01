/**
 * Demographics Server Actions Tests
 * OrbiPax Community Mental Health System
 *
 * Tests server action behavior with mocked auth guards and factory
 * Verifies error mapping and security boundaries
 *
 * SoC: Tests Actions layer only - mocks auth, factory, and use cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadDemographicsAction,
  saveDemographicsAction
} from '@/modules/intake/actions/step1/demographics.actions'
import type {
  DemographicsInputDTO,
  DemographicsOutputDTO,
  LoadDemographicsResponse,
  SaveDemographicsResponse
} from '@/modules/intake/application/step1/dtos'
import type { DemographicsRepository } from '@/modules/intake/application/step1/ports'
import { ERROR_CODES } from '@/modules/intake/application/step1/usecases'

// Mock the auth guard module
vi.mock('@/shared/lib/current-user.server', () => ({
  resolveUserAndOrg: vi.fn()
}))

// Mock the factory module
vi.mock('@/modules/intake/infrastructure/factories/demographics.factory', () => ({
  createDemographicsRepository: vi.fn()
}))

// Mock the use cases module
vi.mock('@/modules/intake/application/step1', async () => {
  const actual = await vi.importActual<typeof import('@/modules/intake/application/step1')>('@/modules/intake/application/step1')
  return {
    ...actual,
    loadDemographics: vi.fn(),
    saveDemographics: vi.fn(),
    ERROR_CODES: {
      VALIDATION_FAILED: 'VALIDATION_FAILED',
      NOT_FOUND: 'NOT_FOUND',
      UNAUTHORIZED: 'UNAUTHORIZED',
      SESSION_EXPIRED: 'SESSION_EXPIRED',
      ORGANIZATION_MISMATCH: 'ORGANIZATION_MISMATCH',
      INTERNAL_ERROR: 'INTERNAL_ERROR'
    }
  }
})

// Import mocked functions
import { resolveUserAndOrg } from '@/shared/lib/current-user.server'
import { createDemographicsRepository } from '@/modules/intake/infrastructure/factories/demographics.factory'
import { loadDemographics, saveDemographics } from '@/modules/intake/application/step1'

describe('Demographics Server Actions', () => {
  const mockUserId = 'user_123'
  const mockOrganizationId = 'org_456'
  const mockSessionId = `session_${mockUserId}_intake`

  // Mock repository instance
  const mockRepository: DemographicsRepository = {
    findBySession: vi.fn(),
    save: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default factory mock to return repository
    vi.mocked(createDemographicsRepository).mockReturnValue(mockRepository)
  })

  describe('loadDemographicsAction', () => {
    it('should return UNAUTHORIZED when session is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockRejectedValue(new Error('No session'))

      // Act
      const result = await loadDemographicsAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.UNAUTHORIZED)
      expect(result.error?.message).toBe('Authentication required')
      expect(createDemographicsRepository).not.toHaveBeenCalled()
      expect(loadDemographics).not.toHaveBeenCalled()
    })

    it('should return ORGANIZATION_MISMATCH when organizationId is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: '' // Empty organization
      })

      // Act
      const result = await loadDemographicsAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.ORGANIZATION_MISMATCH)
      expect(result.error?.message).toBe('Invalid organization context')
      expect(createDemographicsRepository).not.toHaveBeenCalled()
      expect(loadDemographics).not.toHaveBeenCalled()
    })

    it('should use factory mock and return data with valid session', async () => {
      // Arrange
      const mockDemographicsData: DemographicsOutputDTO = {
        id: 'demo_123',
        sessionId: mockSessionId,
        organizationId: mockOrganizationId,
        data: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-15'
        },
        createdAt: '2025-09-28T10:00:00Z',
        updatedAt: '2025-09-28T10:00:00Z',
        completedAt: null,
        lastModifiedBy: mockUserId
      }

      const mockUseCaseResponse: LoadDemographicsResponse = {
        ok: true,
        data: mockDemographicsData
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadDemographics).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await loadDemographicsAction()

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toEqual(mockDemographicsData)
      expect(resolveUserAndOrg).toHaveBeenCalledTimes(1)
      expect(createDemographicsRepository).toHaveBeenCalledTimes(1)
      expect(loadDemographics).toHaveBeenCalledWith(
        mockRepository,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should map use case errors to action response without PII', async () => {
      // Arrange
      const mockUseCaseResponse: LoadDemographicsResponse = {
        ok: false,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Patient John Doe not found' // PII in use case error
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadDemographics).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await loadDemographicsAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.NOT_FOUND)
      expect(result.error?.message).toBe('Failed to load demographics') // Generic message, no PII
      expect(result.error?.message).not.toContain('John Doe')
    })

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadDemographics).mockRejectedValue(new Error('Unexpected error'))

      // Act
      const result = await loadDemographicsAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.INTERNAL_ERROR)
      expect(result.error?.message).toBe('An unexpected error occurred')
    })
  })

  describe('saveDemographicsAction', () => {
    const validInput: DemographicsInputDTO = {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1985-05-20'
    }

    it('should return UNAUTHORIZED when session is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockRejectedValue(new Error('No session'))

      // Act
      const result = await saveDemographicsAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.UNAUTHORIZED)
      expect(result.error?.message).toBe('Authentication required')
      expect(createDemographicsRepository).not.toHaveBeenCalled()
      expect(saveDemographics).not.toHaveBeenCalled()
    })

    it('should map VALIDATION_FAILED from use case to flat contract', async () => {
      // Arrange
      const mockUseCaseResponse: SaveDemographicsResponse = {
        ok: false,
        error: {
          code: ERROR_CODES.VALIDATION_FAILED,
          message: 'Field firstName is required' // Field-specific error
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveDemographics).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await saveDemographicsAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Failed to save demographics') // Generic message
      expect(result.error?.message).not.toContain('firstName')
      expect(createDemographicsRepository).toHaveBeenCalledTimes(1)
      expect(saveDemographics).toHaveBeenCalledWith(
        mockRepository,
        validInput,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should save demographics with valid session and organization', async () => {
      // Arrange
      const mockUseCaseResponse: SaveDemographicsResponse = {
        ok: true,
        data: { sessionId: mockSessionId }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveDemographics).mockResolvedValue(mockUseCaseResponse)

      // Act
      const result = await saveDemographicsAction(validInput)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(mockSessionId)
      expect(resolveUserAndOrg).toHaveBeenCalledTimes(1)
      expect(createDemographicsRepository).toHaveBeenCalledTimes(1)
      expect(saveDemographics).toHaveBeenCalledWith(
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
      const result = await saveDemographicsAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.ORGANIZATION_MISMATCH)
      expect(result.error?.message).toBe('Invalid organization context')
      expect(createDemographicsRepository).not.toHaveBeenCalled()
      expect(saveDemographics).not.toHaveBeenCalled()
    })

    it('should handle unexpected errors without exposing details', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveDemographics).mockRejectedValue(new Error('Database connection failed'))

      // Act
      const result = await saveDemographicsAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.INTERNAL_ERROR)
      expect(result.error?.message).toBe('An unexpected error occurred')
      expect(result.error?.message).not.toContain('Database')
    })
  })
})