/**
 * Insurance Use Cases Tests - Application Layer
 * OrbiPax Intake Module Step 2
 *
 * Tests the use case orchestration with mocked repository
 * Verifies Domain validation and error mapping
 *
 * SoC: Tests Application logic only - mocks Infrastructure via ports
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadInsurance,
  saveInsurance,
  InsuranceErrorCodes
} from '@/modules/intake/application/step2'
import type {
  InsuranceRepository,
  RepositoryResponse
} from '@/modules/intake/application/step2/ports'
import type {
  InsuranceInputDTO,
  InsuranceOutputDTO
} from '@/modules/intake/application/step2/dtos'

describe('Insurance Use Cases', () => {
  // Mock repository implementation
  const createMockRepository = (): InsuranceRepository => ({
    findBySession: vi.fn(),
    save: vi.fn(),
    exists: vi.fn()
  })

  let mockRepository: InsuranceRepository

  beforeEach(() => {
    mockRepository = createMockRepository()
    vi.clearAllMocks()
  })

  describe('loadInsurance', () => {
    const sessionId = 'session_123'
    const organizationId = 'org_456'

    it('should return insurance data when repository returns OK', async () => {
      // Arrange
      const mockData: InsuranceOutputDTO = {
        sessionId,
        organizationId,
        data: {
          insuranceRecords: [
            {
              carrier: 'aetna',
              memberId: 'MEM123',
              groupNumber: 'GRP456',
              planType: 'ppo'
            }
          ],
          governmentCoverage: {
            hasMedicaid: true,
            medicaidId: 'MED789'
          }
        },
        lastModified: '2025-09-28T10:00:00Z'
      }

      const mockResponse: RepositoryResponse<InsuranceOutputDTO> = {
        ok: true,
        data: mockData
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadInsurance(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toEqual(mockData)
      expect(mockRepository.findBySession).toHaveBeenCalledWith(sessionId, organizationId)
      expect(mockRepository.findBySession).toHaveBeenCalledTimes(1)
    })

    it('should return empty data when repository returns NOT_FOUND', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<InsuranceOutputDTO> = {
        ok: false,
        error: { code: InsuranceErrorCodes.NOT_FOUND }
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadInsurance(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true) // Returns OK with empty data
      expect(result.data).toBeDefined()
      expect(result.data?.data.insuranceRecords).toEqual([])
      expect(result.data?.sessionId).toBe(sessionId)
      expect(result.data?.organizationId).toBe(organizationId)
    })

    it('should return validation error when sessionId is missing', async () => {
      // Act
      const result = await loadInsurance(mockRepository, '', organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.findBySession).not.toHaveBeenCalled()
    })

    it('should return validation error when organizationId is missing', async () => {
      // Act
      const result = await loadInsurance(mockRepository, sessionId, '')

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.findBySession).not.toHaveBeenCalled()
    })

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const mockResponse: RepositoryResponse<InsuranceOutputDTO> = {
        ok: false,
        error: {
          code: InsuranceErrorCodes.UNKNOWN,
          message: 'Database connection failed'
        }
      }

      vi.mocked(mockRepository.findBySession).mockResolvedValue(mockResponse)

      // Act
      const result = await loadInsurance(mockRepository, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('Database connection failed') // Repository error is passed through
    })
  })

  describe('saveInsurance', () => {
    const sessionId = 'session_123'
    const organizationId = 'org_456'

    it('should save valid insurance data successfully', async () => {
      // Arrange
      const validInput: InsuranceInputDTO = {
        insuranceRecords: [
          {
            carrier: 'bcbs',
            memberId: 'BLUE123',
            groupNumber: 'GROUP789',
            planType: 'ppo', // Add required fields
            planName: 'Blue PPO',
            effectiveDate: '2025-01-01',
            expirationDate: '2025-12-31',
            subscriberName: 'Test Subscriber',
            subscriberRelationship: 'self'
          }
        ],
        governmentCoverage: {
          hasMedicare: false,
          hasMedicaid: false
        }
      }

      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: true,
        data: { sessionId }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await saveInsurance(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(sessionId)
      expect(mockRepository.save).toHaveBeenCalledWith(sessionId, organizationId, validInput)
      expect(mockRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should return validation error for invalid insurance data', async () => {
      // Arrange
      const invalidInput: InsuranceInputDTO = {
        insuranceRecords: [
          {
            carrier: '', // Invalid: empty carrier
            memberId: 'MEM123'
          }
        ]
      } as any

      // Act
      const result = await saveInsurance(mockRepository, invalidInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toMatch(/Invalid insurance data:|Validation failed:/) // Matches the actual error format
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should return validation error when sessionId is missing', async () => {
      // Arrange
      const validInput: InsuranceInputDTO = {
        insuranceRecords: []
      }

      // Act
      const result = await saveInsurance(mockRepository, validInput, '', organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Session ID and Organization ID are required')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('should propagate repository save errors', async () => {
      // Arrange
      const validInput: InsuranceInputDTO = {
        insuranceRecords: []
      }

      const mockResponse: RepositoryResponse<any> = {
        ok: false,
        error: {
          code: InsuranceErrorCodes.CONFLICT,
          message: 'Record already exists'
        }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await saveInsurance(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.CONFLICT)
      expect(result.error?.message).toBe('Record already exists')
    })

    it('should handle government coverage with IDs correctly', async () => {
      // Arrange
      const inputWithGovCoverage: InsuranceInputDTO = {
        insuranceRecords: [],
        governmentCoverage: {
          hasMedicaid: true,
          medicaidId: 'MED12345',
          hasMedicare: true,
          medicareId: 'CARE67890'
        }
      }

      const mockResponse: RepositoryResponse<{ sessionId: string }> = {
        ok: true,
        data: { sessionId }
      }

      vi.mocked(mockRepository.save).mockResolvedValue(mockResponse)

      // Act
      const result = await saveInsurance(mockRepository, inputWithGovCoverage, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(true)
      expect(mockRepository.save).toHaveBeenCalledWith(sessionId, organizationId, inputWithGovCoverage)
    })

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const validInput: InsuranceInputDTO = {
        insuranceRecords: []
      }

      vi.mocked(mockRepository.save).mockRejectedValue(new Error('Network error'))

      // Act
      const result = await saveInsurance(mockRepository, validInput, sessionId, organizationId)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred while saving insurance data')
    })
  })
})