/**
 * Insurance Server Actions Tests
 * OrbiPax Intake Module Step 2
 *
 * Tests server action behavior with mocked auth guards and factory
 * Verifies error mapping and security boundaries
 *
 * SoC: Tests Actions layer only - mocks auth, factory, and use cases
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadInsuranceAction,
  saveInsuranceAction
} from '@/modules/intake/actions/step2/insurance.actions'
import type {
  InsuranceInputDTO,
  InsuranceOutputDTO,
  LoadInsuranceResponse,
  SaveInsuranceResponse
} from '@/modules/intake/application/step2/dtos'
import type { InsuranceRepository } from '@/modules/intake/application/step2/ports'
import { InsuranceErrorCodes } from '@/modules/intake/application/step2/dtos'

// Mock the auth guard module
vi.mock('@/shared/lib/current-user.server', () => ({
  resolveUserAndOrg: vi.fn()
}))

// Mock the factory module
vi.mock('@/modules/intake/infrastructure/factories/insurance.factory', () => ({
  createInsuranceRepository: vi.fn()
}))

// Mock the use cases module
vi.mock('@/modules/intake/application/step2', async () => {
  const actual = await vi.importActual<typeof import('@/modules/intake/application/step2')>('@/modules/intake/application/step2')
  return {
    ...actual,
    loadInsurance: vi.fn(),
    saveInsurance: vi.fn(),
    InsuranceErrorCodes: {
      VALIDATION_FAILED: 'VALIDATION_FAILED',
      NOT_FOUND: 'NOT_FOUND',
      UNAUTHORIZED: 'UNAUTHORIZED',
      CONFLICT: 'CONFLICT',
      UNKNOWN: 'UNKNOWN'
    }
  }
})

// Import mocked functions
import { resolveUserAndOrg } from '@/shared/lib/current-user.server'
import { createInsuranceRepository } from '@/modules/intake/infrastructure/factories/insurance.factory'
import { loadInsurance, saveInsurance } from '@/modules/intake/application/step2'

describe('Insurance Server Actions', () => {
  const mockUserId = 'user_123'
  const mockOrganizationId = 'org_456'
  const mockSessionId = `session_${mockUserId}_intake`

  // Mock repository instance
  const mockRepository: InsuranceRepository = {
    findBySession: vi.fn(),
    save: vi.fn(),
    exists: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default factory mock to return repository
    vi.mocked(createInsuranceRepository).mockReturnValue(mockRepository)
  })

  describe('loadInsuranceAction', () => {
    it('should return UNAUTHORIZED when session is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockRejectedValue(new Error('No session'))

      // Act
      const result = await loadInsuranceAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.UNAUTHORIZED)
      expect(result.error?.message).toBe('Authentication required')
      expect(createInsuranceRepository).not.toHaveBeenCalled()
      expect(loadInsurance).not.toHaveBeenCalled()
    })

    it('should return ORGANIZATION_MISMATCH when organizationId is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: '' // Empty organization
      })

      // Act
      const result = await loadInsuranceAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe('ORGANIZATION_MISMATCH')
      expect(result.error?.message).toBe('Invalid organization context')
      expect(createInsuranceRepository).not.toHaveBeenCalled()
      expect(loadInsurance).not.toHaveBeenCalled()
    })

    it('should load insurance data successfully with valid session', async () => {
      // Arrange
      const mockInsuranceData: InsuranceOutputDTO = {
        sessionId: mockSessionId,
        organizationId: mockOrganizationId,
        data: {
          insuranceRecords: [
            {
              carrier: 'aetna',
              memberId: 'AETNA123',
              groupNumber: 'GRP001'
            }
          ],
          governmentCoverage: {
            hasMedicaid: true,
            medicaidId: 'MED456'
          }
        },
        lastModified: '2025-09-28T12:00:00Z'
      }

      const mockLoadResponse: LoadInsuranceResponse = {
        ok: true,
        data: mockInsuranceData
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadInsurance).mockResolvedValue(mockLoadResponse)

      // Act
      const result = await loadInsuranceAction()

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data).toEqual(mockInsuranceData)
      expect(resolveUserAndOrg).toHaveBeenCalledTimes(1)
      expect(createInsuranceRepository).toHaveBeenCalledTimes(1)
      expect(loadInsurance).toHaveBeenCalledWith(
        mockRepository,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should map application errors to generic messages', async () => {
      // Arrange
      const mockLoadResponse: LoadInsuranceResponse = {
        ok: false,
        error: {
          code: InsuranceErrorCodes.NOT_FOUND,
          message: 'Database record not found with sensitive info'
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadInsurance).mockResolvedValue(mockLoadResponse)

      // Act
      const result = await loadInsuranceAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.NOT_FOUND)
      expect(result.error?.message).toBe('Failed to load insurance data') // Generic message
      expect(result.error?.message).not.toContain('sensitive info')
    })

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(loadInsurance).mockRejectedValue(new Error('Unexpected error'))

      // Act
      const result = await loadInsuranceAction()

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred')
    })
  })

  describe('saveInsuranceAction', () => {
    const validInput: InsuranceInputDTO = {
      insuranceRecords: [
        {
          carrier: 'united',
          memberId: 'UHC789',
          groupNumber: 'GRP123'
        }
      ],
      governmentCoverage: {
        hasMedicare: true,
        medicareId: 'CARE999'
      }
    }

    it('should return UNAUTHORIZED when session is missing', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockRejectedValue(new Error('No session'))

      // Act
      const result = await saveInsuranceAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.UNAUTHORIZED)
      expect(result.error?.message).toBe('Authentication required')
      expect(createInsuranceRepository).not.toHaveBeenCalled()
      expect(saveInsurance).not.toHaveBeenCalled()
    })

    it('should save insurance data successfully with valid session', async () => {
      // Arrange
      const mockSaveResponse: SaveInsuranceResponse = {
        ok: true,
        data: { sessionId: mockSessionId }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveInsurance).mockResolvedValue(mockSaveResponse)

      // Act
      const result = await saveInsuranceAction(validInput)

      // Assert
      expect(result.ok).toBe(true)
      expect(result.data?.sessionId).toBe(mockSessionId)
      expect(resolveUserAndOrg).toHaveBeenCalledTimes(1)
      expect(createInsuranceRepository).toHaveBeenCalledTimes(1)
      expect(saveInsurance).toHaveBeenCalledWith(
        mockRepository,
        validInput,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should map VALIDATION_FAILED errors appropriately', async () => {
      // Arrange
      const mockSaveResponse: SaveInsuranceResponse = {
        ok: false,
        error: {
          code: InsuranceErrorCodes.VALIDATION_FAILED,
          message: 'Field xyz is invalid with patient data'
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveInsurance).mockResolvedValue(mockSaveResponse)

      // Act
      const result = await saveInsuranceAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.VALIDATION_FAILED)
      expect(result.error?.message).toBe('Invalid insurance data provided') // Generic message
      expect(result.error?.message).not.toContain('patient data')
    })

    it('should map CONFLICT errors appropriately', async () => {
      // Arrange
      const mockSaveResponse: SaveInsuranceResponse = {
        ok: false,
        error: {
          code: InsuranceErrorCodes.CONFLICT,
          message: 'Duplicate record for patient John Doe'
        }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveInsurance).mockResolvedValue(mockSaveResponse)

      // Act
      const result = await saveInsuranceAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.CONFLICT)
      expect(result.error?.message).toBe('Insurance data conflict detected') // Generic message
      expect(result.error?.message).not.toContain('John Doe')
    })

    it('should handle empty insurance records', async () => {
      // Arrange
      const emptyInput: InsuranceInputDTO = {
        insuranceRecords: [],
        governmentCoverage: undefined
      }

      const mockSaveResponse: SaveInsuranceResponse = {
        ok: true,
        data: { sessionId: mockSessionId }
      }

      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(saveInsurance).mockResolvedValue(mockSaveResponse)

      // Act
      const result = await saveInsuranceAction(emptyInput)

      // Assert
      expect(result.ok).toBe(true)
      expect(saveInsurance).toHaveBeenCalledWith(
        mockRepository,
        emptyInput,
        mockSessionId,
        mockOrganizationId
      )
    })

    it('should handle factory errors gracefully', async () => {
      // Arrange
      vi.mocked(resolveUserAndOrg).mockResolvedValue({
        userId: mockUserId,
        organizationId: mockOrganizationId
      })

      vi.mocked(createInsuranceRepository).mockImplementation(() => {
        throw new Error('Factory initialization failed')
      })

      // Act
      const result = await saveInsuranceAction(validInput)

      // Assert
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe(InsuranceErrorCodes.UNKNOWN)
      expect(result.error?.message).toBe('An unexpected error occurred')
      expect(saveInsurance).not.toHaveBeenCalled()
    })
  })
})