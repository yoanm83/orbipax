import { z } from 'zod'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'

/**
 * Legal Forms & Consents Schema
 * Domain layer validation for Step 7
 * Maps exactly to UI controls in Step7LegalConsents.tsx
 */

// Individual form consent schema
const legalFormSchema = z.object({
  isRead: z.boolean().refine(val => val === true, {
    message: 'Please confirm you have read and understood this form'
  }),
  signature: z.string()
    .min(1, 'Signature is required')
    .max(NAME_LENGTHS.MAX, `Signature must be ${NAME_LENGTHS.MAX} characters or less`)
    .transform(normalizeName)
    .refine(validateName, 'Please enter a valid signature (letters, spaces, hyphens, and apostrophes only)'),
  guardianSignature: z.string().optional(),
  signatureDate: z.date().optional()
})

// Schema for required forms (when not a minor)
const requiredFormSchema = legalFormSchema

// Schema for optional forms
const optionalFormSchema = z.object({
  isRead: z.boolean().optional(),
  signature: z.string().optional(),
  guardianSignature: z.string().optional(),
  signatureDate: z.date().optional()
})

// Main legal consents schema
export const legalConsentsSchema = z.object({
  // Client type flags
  isMinor: z.boolean().default(false),
  authorizedToShareWithPCP: z.boolean().default(false),

  // HIPAA Notice (required)
  hipaa: requiredFormSchema,

  // Consent for Treatment (required)
  consentTreatment: requiredFormSchema,

  // Financial Responsibility (required)
  financial: requiredFormSchema,

  // Telehealth Consent (required)
  telehealth: requiredFormSchema,

  // Release of Information (optional, but required if authorizedToShareWithPCP is true)
  roi: optionalFormSchema
}).superRefine((data, ctx) => {
  // If client is a minor, guardian signatures are required for all signed forms
  if (data.isMinor) {
    const requiredForms = ['hipaa', 'consentTreatment', 'financial', 'telehealth'] as const

    requiredForms.forEach(formKey => {
      const form = data[formKey]
      if (form.signature && (!form.guardianSignature || form.guardianSignature.trim() === '')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [formKey, 'guardianSignature'],
          message: 'Parent/Guardian signature is required for minors'
        })
      }

      // Validate guardian signature format if present
      if (form.guardianSignature && form.guardianSignature.trim() !== '') {
        const normalizedGuardian = normalizeName(form.guardianSignature)
        if (!validateName(normalizedGuardian)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [formKey, 'guardianSignature'],
            message: 'Please enter a valid guardian signature'
          })
        }
        if (normalizedGuardian.length > NAME_LENGTHS.MAX) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [formKey, 'guardianSignature'],
            message: `Guardian signature must be ${NAME_LENGTHS.MAX} characters or less`
          })
        }
      }
    })
  }

  // If authorized to share with PCP, ROI becomes required
  if (data.authorizedToShareWithPCP) {
    if (!data.roi.isRead) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['roi', 'isRead'],
        message: 'Release of Information must be read when sharing with PCP is authorized'
      })
    }
    if (!data.roi.signature || data.roi.signature.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['roi', 'signature'],
        message: 'Release of Information signature is required when sharing with PCP is authorized'
      })
    }

    // If minor and ROI is required, guardian signature is also required
    if (data.isMinor && data.roi.signature && (!data.roi.guardianSignature || data.roi.guardianSignature.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['roi', 'guardianSignature'],
        message: 'Parent/Guardian signature is required for Release of Information'
      })
    }
  }
})

// Export type for TypeScript
export type LegalConsents = z.infer<typeof legalConsentsSchema>