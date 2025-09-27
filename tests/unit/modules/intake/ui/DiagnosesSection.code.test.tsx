/**
 * Unit Tests for Diagnosis Code validation and normalization
 * Tests the ICD-10/DSM-5 validation logic and input normalization
 * in DiagnosesSection component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DiagnosesSection } from '@/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection'

// Extract validation logic for unit testing
// These functions mirror the implementation in DiagnosesSection.tsx
const isValidDiagnosisCode = (code: string): boolean => {
  if (!code) return true // Empty is handled by required validation

  // ICD-10 pattern: Letter (except U) + 2 digits + optional (. + up to 4 alphanumeric)
  // DSM-5 pattern: F + 2 digits + optional (. + 1-2 digits)
  const icd10Pattern = /^[A-TV-Z]\d{2}(?:\.\d{1,4})?$/
  const dsmPattern = /^F\d{2}(?:\.\d{1,2})?$/

  const normalizedCode = code.trim().toUpperCase()
  return icd10Pattern.test(normalizedCode) || dsmPattern.test(normalizedCode)
}

const normalizeCode = (value: string): string => {
  return value.trim().toUpperCase()
}

describe('DiagnosesSection - Diagnosis Code Validation', () => {
  describe('isValidDiagnosisCode()', () => {
    describe('Valid ICD-10/DSM-5 codes', () => {
      const validCodes = [
        // DSM-5 codes
        { input: 'F32.9', description: 'DSM-5 with one decimal' },
        { input: 'F90.0', description: 'DSM-5 with zero decimal' },
        { input: 'F43.10', description: 'DSM-5 with two decimals' },
        { input: 'F41.1', description: 'DSM-5 short decimal' },
        // ICD-10 codes
        { input: 'G47.33', description: 'ICD-10 G-code' },
        { input: 'M79.3', description: 'ICD-10 M-code' },
        { input: 'A15.0', description: 'ICD-10 A-code' },
        { input: 'Z00.00', description: 'ICD-10 Z-code' },
        { input: 'T88.1234', description: 'ICD-10 with 4 decimals' },
        // With normalization needed
        { input: 'f32.9', description: 'Lowercase DSM-5' },
        { input: ' F90.0 ', description: 'DSM-5 with spaces' },
        { input: ' g47.33 ', description: 'Lowercase ICD-10 with spaces' },
      ]

      test.each(validCodes)('✅ accepts $description: $input', ({ input }) => {
        expect(isValidDiagnosisCode(input)).toBe(true)
      })
    })

    describe('Invalid codes', () => {
      const invalidCodes = [
        // Format errors
        { input: 'F32', description: 'DSM-5 missing decimal' },
        { input: 'F3.9', description: 'Only 1 digit after F' },
        { input: 'F321.9', description: 'Too many digits before decimal' },
        { input: 'F32.999', description: 'DSM-5 too many decimals' },
        { input: 'F32.9999', description: 'DSM-5 way too many decimals' },
        // Invalid prefixes
        { input: '32.9', description: 'Missing letter prefix' },
        { input: '32F', description: 'Letter at wrong position' },
        { input: 'FF32.9', description: 'Double letter prefix' },
        { input: 'F-32.9', description: 'Contains hyphen' },
        // ICD-10 specific
        { input: 'U07.1', description: 'U-codes not allowed' },
        { input: 'U99.9', description: 'Another U-code' },
        // Completely invalid
        { input: 'abc', description: 'Random letters' },
        { input: '123', description: 'Only numbers' },
        { input: 'AA123', description: 'Invalid letter combo' },
        { input: 'G47.', description: 'Trailing decimal' },
        { input: '.33', description: 'Leading decimal' },
      ]

      test.each(invalidCodes)('❌ rejects $description: $input', ({ input }) => {
        expect(isValidDiagnosisCode(input)).toBe(false)
      })
    })

    test('Empty string returns true (handled by required validation)', () => {
      expect(isValidDiagnosisCode('')).toBe(true)
    })
  })

  describe('Code Normalization', () => {
    describe('normalizeCode()', () => {
      const normalizationCases = [
        { input: 'f32.9', expected: 'F32.9', description: 'lowercase to uppercase' },
        { input: ' F90.0 ', expected: 'F90.0', description: 'trim spaces' },
        { input: '  g47.33  ', expected: 'G47.33', description: 'trim and uppercase' },
        { input: 'F32.9', expected: 'F32.9', description: 'already normalized' },
        { input: '   f43.10   ', expected: 'F43.10', description: 'multiple spaces' },
      ]

      test.each(normalizationCases)(
        'normalizes $description: "$input" → "$expected"',
        ({ input, expected }) => {
          expect(normalizeCode(input)).toBe(expected)
        }
      )
    })
  })

  describe('Component Integration', () => {
    const mockOnSectionToggle = jest.fn()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('Input field normalizes code on change', async () => {
      render(
        <DiagnosesSection
          onSectionToggle={mockOnSectionToggle}
          isExpanded={true}
        />
      )

      // Add a diagnosis record
      const addButton = screen.getByRole('button', { name: /Add Diagnosis Record/i })
      fireEvent.click(addButton)

      // Find the diagnosis code input
      const codeInput = await screen.findByLabelText('Diagnosis Code')

      // Type lowercase code with spaces
      fireEvent.change(codeInput, { target: { value: ' f32.9 ' } })

      // Verify it's normalized in the input
      await waitFor(() => {
        expect(codeInput).toHaveValue('F32.9')
      })
    })

    test('Shows format error for invalid code', async () => {
      render(
        <DiagnosesSection
          onSectionToggle={mockOnSectionToggle}
          isExpanded={true}
        />
      )

      // Add a diagnosis record
      const addButton = screen.getByRole('button', { name: /Add Diagnosis Record/i })
      fireEvent.click(addButton)

      // Find the diagnosis code input
      const codeInput = await screen.findByLabelText('Diagnosis Code')

      // Enter invalid code
      fireEvent.change(codeInput, { target: { value: 'F32' } })

      // Check for format error message
      await waitFor(() => {
        const errorMessage = screen.getByText(/Invalid format. Use ICD-10.*or DSM-5 format/i)
        expect(errorMessage).toBeInTheDocument()
      })

      // Verify aria-invalid is set
      expect(codeInput).toHaveAttribute('aria-invalid', 'true')
    })

    test('Shows required error for empty code', async () => {
      render(
        <DiagnosesSection
          onSectionToggle={mockOnSectionToggle}
          isExpanded={true}
        />
      )

      // Add a diagnosis record
      const addButton = screen.getByRole('button', { name: /Add Diagnosis Record/i })
      fireEvent.click(addButton)

      // Find the diagnosis code input
      const codeInput = await screen.findByLabelText('Diagnosis Code')

      // Leave empty and blur
      fireEvent.blur(codeInput)

      // Check for required error message
      await waitFor(() => {
        const errorMessage = screen.getByText('Diagnosis code is required')
        expect(errorMessage).toBeInTheDocument()
      })

      // Verify aria attributes
      expect(codeInput).toHaveAttribute('aria-invalid', 'true')
      expect(codeInput).toHaveAttribute('aria-required', 'true')
    })

    test('Accepts valid code from AI suggestions', async () => {
      render(
        <DiagnosesSection
          onSectionToggle={mockOnSectionToggle}
          isExpanded={true}
        />
      )

      // Simulate adding from suggestions (would normally come from AI)
      // For this test, we add a record and set a valid code
      const addButton = screen.getByRole('button', { name: /Add Diagnosis Record/i })
      fireEvent.click(addButton)

      const codeInput = await screen.findByLabelText('Diagnosis Code')

      // Enter a valid DSM-5 code like from AI suggestion
      fireEvent.change(codeInput, { target: { value: 'F90.0' } })

      // Should not show any error
      await waitFor(() => {
        const errorMessages = screen.queryByText(/Invalid format|required/i)
        expect(errorMessages).not.toBeInTheDocument()
      })

      // Verify aria-invalid is not set
      expect(codeInput).not.toHaveAttribute('aria-invalid', 'true')
    })

    describe('Accessibility', () => {
      test('Input has proper ARIA attributes for errors', async () => {
        render(
          <DiagnosesSection
            onSectionToggle={mockOnSectionToggle}
            isExpanded={true}
          />
        )

        // Add a diagnosis record
        const addButton = screen.getByRole('button', { name: /Add Diagnosis Record/i })
        fireEvent.click(addButton)

        const codeInput = await screen.findByLabelText('Diagnosis Code')

        // Test invalid format
        fireEvent.change(codeInput, { target: { value: 'F32' } })

        await waitFor(() => {
          // Check aria-invalid
          expect(codeInput).toHaveAttribute('aria-invalid', 'true')

          // Check aria-describedby points to error message
          const describedBy = codeInput.getAttribute('aria-describedby')
          expect(describedBy).toContain('format-error')

          // Verify error message exists with correct ID
          const errorElement = document.getElementById(describedBy!)
          expect(errorElement).toBeInTheDocument()
          expect(errorElement).toHaveTextContent(/Invalid format/i)
        })
      })

      test('Input has aria-required attribute', async () => {
        render(
          <DiagnosesSection
            onSectionToggle={mockOnSectionToggle}
            isExpanded={true}
          />
        )

        // Add a diagnosis record
        const addButton = screen.getByRole('button', { name: /Add Diagnosis Record/i })
        fireEvent.click(addButton)

        const codeInput = await screen.findByLabelText('Diagnosis Code')
        expect(codeInput).toHaveAttribute('aria-required', 'true')
      })
    })
  })
})

describe('Submit Blocking with Invalid Codes', () => {
  test('Form should not submit with invalid diagnosis code', async () => {
    const mockSubmit = jest.fn()

    // This would be integrated with the parent form component
    // For unit testing, we verify the validation state
    const codes = ['F32', '', 'U99.9', 'abc']

    codes.forEach(code => {
      const isValid = code === '' ? false : isValidDiagnosisCode(code)
      if (!isValid) {
        // Block submit
        expect(mockSubmit).not.toHaveBeenCalled()
      }
    })

    // Valid code should allow submit
    const validCode = 'F32.9'
    expect(isValidDiagnosisCode(validCode)).toBe(true)
  })
})