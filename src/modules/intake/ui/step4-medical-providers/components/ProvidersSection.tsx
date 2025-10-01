'use client'

import { useMemo, useCallback } from "react"
import { User, ChevronUp, ChevronDown } from "lucide-react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"
import { validateProviders } from "@/modules/intake/domain/schemas/medical-providers"
import { useStep4Store, step4Selectors } from "@/modules/intake/state/slices/step4.slice"
import { normalizePhoneNumber, formatPhoneInput } from "@/shared/utils/phone"

interface ProvidersSectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

// Export validation function type for parent components
export interface ProvidersValidation {
  validate: () => boolean
  getPayload: () => Record<string, unknown>
}

/**
 * Providers Section - Primary Care Provider (PCP)
 * Handles PCP information with conditional fields based on selection
 * Connected to Zustand store and validated with Zod schema
 * SoC: UI layer only - no business logic or API calls
 */

export function ProvidersSection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: ProvidersSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `pcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Connect to canonical store
  const store = useStep4Store()
  const providers = useStep4Store(step4Selectors.providers)
  const validationErrors = useStep4Store(step4Selectors.providersErrors)
  const storeIsExpanded = useStep4Store(step4Selectors.isProvidersExpanded)

  // Extract provider fields
  const {
    hasPCP,
    pcpName,
    pcpPractice,
    pcpPhone,
    pcpAddress,
    authorizedToShare,
    phoneDisplayValue
  } = providers

  // Use external isExpanded if provided, otherwise use store
  const isExpanded = externalIsExpanded ?? storeIsExpanded
  const handleToggle = onSectionToggle ?? (() => store.toggleSection('providers'))

  // Generate payload for submission
  const getPayload = useCallback(() => {
    const payload = {
      hasPCP: hasPCP ?? undefined,
      pcpName: hasPCP === 'Yes' ? pcpName?.trim() : undefined,
      pcpPhone: hasPCP === 'Yes' ? pcpPhone : undefined,
      pcpPractice: hasPCP === 'Yes' && pcpPractice?.trim() ? pcpPractice.trim() : undefined,
      pcpAddress: hasPCP === 'Yes' && pcpAddress?.trim() ? pcpAddress.trim() : undefined,
      authorizedToShare: hasPCP === 'Yes' ? authorizedToShare : undefined
    }

    // Remove undefined values for cleaner payload
    return Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    )
  }, [hasPCP, pcpName, pcpPhone, pcpPractice, pcpAddress, authorizedToShare])

  // Validate using Zod schema
  const validateFields = useCallback(() => {
    const payload = getPayload()
    const result = validateProviders(payload)

    if (!result.ok) {
      const errors: Record<string, string> = {}

      // Map Zod errors to field-specific messages
      result.issues.forEach((issue) => {
        const field = issue.path[0] as string

        if (field === 'hasPCP') {
          errors['hasPCP'] = 'This field is required'
        } else if (field === 'pcpName') {
          if (!pcpName?.trim()) {
            errors['pcpName'] = 'Provider name is required'
          } else if (pcpName.trim().length > 120) {
            errors['pcpName'] = 'Provider name must be 120 characters or less'
          } else {
            errors['pcpName'] = 'Provider name is required when you have a PCP'
          }
        } else if (field === 'pcpPhone') {
          if (!pcpPhone) {
            errors['pcpPhone'] = 'Phone number is required'
          } else {
            errors['pcpPhone'] = 'Enter a valid phone number (at least 10 digits)'
          }
        } else if (field === 'pcpPractice') {
          errors['pcpPractice'] = 'Practice name must be 120 characters or less'
        } else if (field === 'pcpAddress') {
          errors['pcpAddress'] = 'Address must be 200 characters or less'
        }
      })

      store.setValidationErrors('providers', errors)
      return false
    }

    // Clear all errors on successful validation
    store.setValidationErrors('providers', {})
    return true
  }, [store, getPayload, pcpName, pcpPhone])

  // Expose validation interface via ref or imperative handle
  // Parent can access these via a ref
  // Using a module-level variable to expose validation methods
  if (typeof window !== 'undefined') {
    (window as Window & { providersValidation?: ProvidersValidation }).providersValidation = {
      validate: validateFields,
      getPayload
    }
  }

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`${sectionUid}-header`}
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Primary Care Provider (PCP)
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Has PCP Selection */}
            <div className="space-y-2">
              <Label htmlFor="pcp-has" className="text-base">
                Does the client have a Primary Care Provider?<span className="text-[var(--destructive)]">*</span>
              </Label>
              <Select
                value={hasPCP ?? ''}
                onValueChange={(value) => {
                  store.setProvidersField('hasPCP', value as 'Yes' | 'No' | 'Unknown')
                  if (value) {
                    store.clearValidationError('providers', 'hasPCP')
                  }
                  // Clear conditional fields when not "Yes"
                  if (value !== 'Yes') {
                    store.resetConditionalFields('providers')
                  }
                }}
              >
                <SelectTrigger
                  id="pcp-has"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-label="Has Primary Care Provider"
                  aria-required="true"
                  aria-invalid={!!validationErrors['hasPCP'] ? "true" : undefined}
                  aria-describedby={validationErrors['hasPCP'] ? "pcp-has-error" : undefined}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors['hasPCP'] && (
                <p id="pcp-has-error" className="text-sm text-[var(--destructive)]" role="alert">
                  {validationErrors['hasPCP']}
                </p>
              )}
            </div>

            {/* Conditional Fields - Only show if hasPCP === "Yes" */}
            {hasPCP === "Yes" && (
              <>
                {/* Provider Name and Practice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Provider Name */}
                  <div className="space-y-2">
                    <Label htmlFor="pcp-name">
                      Provider Name<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      id="pcp-name"
                      type="text"
                      value={pcpName ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 120) {
                          store.setProvidersField('pcpName', value)
                          // Clear error if valid
                          if (value.trim()) {
                            store.clearValidationError('providers', 'pcpName')
                          }
                        }
                      }}
                      maxLength={120}
                      placeholder="Enter provider's full name"
                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                      aria-required="true"
                      aria-invalid={!!validationErrors['pcpName'] ? "true" : undefined}
                      aria-describedby={validationErrors['pcpName'] ? "pcp-name-error" : undefined}
                      aria-label="Provider Name"
                    />
                    {validationErrors['pcpName'] && (
                      <p id="pcp-name-error" className="text-sm text-[var(--destructive)]" role="alert">
                        {validationErrors['pcpName']}
                      </p>
                    )}
                  </div>

                  {/* Practice/Clinic Name */}
                  <div className="space-y-2">
                    <Label htmlFor="pcp-practice">
                      Practice/Clinic Name
                    </Label>
                    <Input
                      id="pcp-practice"
                      type="text"
                      value={pcpPractice ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 120) {
                          store.setProvidersField('pcpPractice', value)
                          store.clearValidationError('providers', 'pcpPractice')
                        }
                      }}
                      maxLength={120}
                      placeholder="Enter practice or clinic name"
                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                      aria-label="Practice or Clinic Name"
                      aria-invalid={!!validationErrors['pcpPractice'] ? "true" : undefined}
                      aria-describedby={validationErrors['pcpPractice'] ? "pcp-practice-error" : undefined}
                    />
                    {validationErrors['pcpPractice'] && (
                      <p id="pcp-practice-error" className="text-sm text-[var(--destructive)]" role="alert">
                        {validationErrors['pcpPractice']}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address and Phone Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="pcp-address">
                      Address
                    </Label>
                    <Input
                      id="pcp-address"
                      type="text"
                      value={pcpAddress ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 200) {
                          store.setProvidersField('pcpAddress', value)
                          store.clearValidationError('providers', 'pcpAddress')
                        }
                      }}
                      maxLength={200}
                      placeholder="123 Main St, Suite 100, Miami, FL 33139"
                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                      aria-label="Provider Address"
                      aria-invalid={!!validationErrors['pcpAddress'] ? "true" : undefined}
                      aria-describedby={validationErrors['pcpAddress'] ? "pcp-address-error" : undefined}
                    />
                    {validationErrors['pcpAddress'] && (
                      <p id="pcp-address-error" className="text-sm text-[var(--destructive)]" role="alert">
                        {validationErrors['pcpAddress']}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="pcp-phone">
                      Phone Number<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      id="pcp-phone"
                      type="tel"
                      value={phoneDisplayValue ?? ''}
                      onChange={(e) => {
                        const formatted = formatPhoneInput(e.target.value, phoneDisplayValue ?? '')
                        const normalized = normalizePhoneNumber(formatted)
                        store.setPhoneNumber(formatted, normalized)
                        // Clear error if valid (10+ digits)
                        if (normalized.length >= 10) {
                          store.clearValidationError('providers', 'pcpPhone')
                        }
                      }}
                      placeholder="(305) 555-0100"
                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                      aria-required="true"
                      aria-invalid={!!validationErrors['pcpPhone'] ? "true" : undefined}
                      aria-describedby={validationErrors['pcpPhone'] ? "pcp-phone-error" : undefined}
                      aria-label="Phone Number"
                    />
                    {validationErrors['pcpPhone'] && (
                      <p id="pcp-phone-error" className="text-sm text-[var(--destructive)]" role="alert">
                        {validationErrors['pcpPhone']}
                      </p>
                    )}
                  </div>
                </div>

                {/* Authorization Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pcp-share"
                    checked={authorizedToShare ?? false}
                    onCheckedChange={(checked) => {
                      store.setProvidersField('authorizedToShare', checked === true)
                    }}
                    aria-label="Authorized to share medical information with PCP"
                  />
                  <Label
                    htmlFor="pcp-share"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Authorized to share medical information with PCP
                  </Label>
                </div>
              </>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}