/**
 * Demographics Use Cases Tests - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Tests the use case orchestration with mocked repository
 * Verifies Domain validation and error mapping
 *
 * SoC: Tests Application logic only - mocks Infrastructure via ports
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadDemographics,
  saveDemographics,
  ERROR_CODES
} from '@/modules/intake/application/step1/usecases'
import type {
  DemographicsRepository,
  RepositoryResponse
} from '@/modules/intake/application/step1/ports'
import type {
  DemographicsInputDTO,
  DemographicsOutputDTO
} from '@/modules/intake/application/step1/dtos'

describe('Demographics Use Cases', () => {
  // Mock repository implementation
  const createMockRepository = (): DemographicsRepository => ({
    findBySession: vi.fn(),
    save: vi.fn()
  })

  let mockRepository: DemographicsRepository

  beforeEach(() => {
    mockRepository = createMockRepository()
    vi.clearAllMocks()
  })

  describe('loadDemographics', () => {
    const sessionId = 'session_123'
    const organizationId = 'org_456'

    it('should return demographics data when repository returns OK', async () => {
      // Arrange
      const mockData: DemographicsOutputDTO = {
        id: 'demo_123',
        sessionId,
        organizationId,
        data: {
          firstName: 'John',
          lastName: 'Doe'
        },
        createdAt: '2025-09-28T10:00:00Z',
        updatedAt: '2025-09-28T10:00:00Z',
        completedAt: null,
        lastModifiedBy: 'user_123'
      }

      const mockResponse: RepositoryResponse<DemographicsOutputDTO> = {
        ok: true,
        data: mockData
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadDemographics(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toEqual(mockData)
      expect(mockRepository.findBySession).toHaveBeenCalledWith(sessionId, organizationId)
      expect(mockRepository.findBySession).toHaveBeenCalledTimes(1)
    })

    it('should return validation error when sessionId is missing', async () => {
      // Act
      const result = await loadDemographics(mockRepository, '', organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session and organization required')
      expect(mockRepository.findBySession).not.toHaveBeenCalled()
    })

    it('should return validation error when organizationId is missing', async () => {
      // Act
      const result = await loadDemographics(mockRepository, sessionId, '')

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session and organization required')
      expect(mockRepository.findBySession).not.toHaveBeenCalled()
    })

    it('should map NOT_FOUND error from repository', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<DemographicsOutputDTO> = {
        ok: false,
        error: { code: 'NOT_FOUND' }
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadDemographics(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.NOT_FOUND)
      expect(result.error?.message).toBe('Failed to load demographics')
    })

    it('should handle repository exceptions gracefully', async () => {
      // Arrange
      vi.mocked(mockRepository.findBySession).mockRejectedValue(new Error('Database connection failed'))

      // Act
      const result = await loadDemographics(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.INTERNAL_ERROR)
      expect(result.error?.message).toBe('Failed to load demographics')
    })
  })

  describe('saveDemographics', () => {
    const sessionId = 'session_123'
    const organizationId = 'org_456'

    const validInput: DemographicsInputDTO = {
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-01-15'
    }

    it('should save demographics when input is valid', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: true,
        data: { sessionId }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await saveDemographics(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(sessionId)
      expect(mockRepository.save).toHaveBeenCalledWith(sessionId, organizationId, validInput)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should return validation error for invalid date format', async () => {
      // Arrange
      const invalidInput: DemographicsInputDTO = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: 'invalid-date' // Invalid date format
      }

      // Act
      const result = await saveDemographics(mockRepository, invalidInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Demographics validation failed')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should return validation error when sessionId is missing', async () => {
      // Act
      const result = await saveDemographics(mockRepository, validInput, '', organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session and organization required')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should map CONFLICT error from repository to VALIDATION_FAILED', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: false,
        error: { code: 'CONFLICT' }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await saveDemographics(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.VALIDATION_FAILED) // CONFLICT maps to VALIDATION_FAILED
      expect(result.error?.message).toBe('Failed to save demographics')
    })

    it('should handle repository exceptions gracefully', async () => {
      // Arrange
      vi.mocked(mockRepository.save).mockRejectedValue(new Error('Network error'))

      // Act
      const result = await saveDemographics(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(ERROR_CODES.INTERNAL_ERROR)
      expect(result.error?.message).toBe('Failed to save demographics')
    })

    it('should accept partial data for draft saves', async () => {
      // Arrange
      const partialInput: DemographicsInputDTO = {
        firstName: 'John'
        // Missing lastName and other fields - valid for drafts
      }

      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: true,
        data: { sessionId }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await saveDemographics(mockRepository, partialInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(sessionId)
      expect(mockRepository.save).toHaveBeenCalledWith(sessionId, organizationId, partialInput)
    })
  })
})