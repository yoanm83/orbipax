'use client'

import { Building, ChevronUp, ChevronDown } from "lucide-react"
import { useMemo, useCallback } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import { Input } from "@/shared/ui/primitives/Input"

// Import phone utilities
import { formatPhoneInput, normalizePhoneNumber } from "@/shared/utils/phone"

// Import validation from schema
import { validatePharmacyInformation } from "@/modules/intake/domain/schemas/step5/pharmacyInformation.schema"
// Import store
import { usePharmacyInformationUIStore } from "@/modules/intake/state/slices/step5/pharmacyInformation.ui.slice"

interface PharmacyInformationSectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

/**
 * Pharmacy Information Section
 * Handles pharmacy name, phone number, and address
 * Connected to Zustand store and validated with Zod schema
 * SoC: UI layer only - no business logic or API calls
 */
export function PharmacyInformationSection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: PharmacyInformationSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `pharmacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Connect to store
  const store = usePharmacyInformationUIStore()
  const {
    pharmacyName,
    pharmacyPhone,
    pharmacyAddress,
    isExpanded: storeIsExpanded,
    validationErrors,
    setPharmacyName,
    setPharmacyPhone,
    setPharmacyAddress,
    toggleExpanded,
    setValidationErrors,
    clearValidationError
  } = store

  // Use external isExpanded if provided, otherwise use store
  const isExpanded = externalIsExpanded ?? storeIsExpanded
  const handleToggle = onSectionToggle ?? toggleExpanded

  // Generate payload for submission
  const getPayload = useCallback(() => {
    return {
      pharmacyName: pharmacyName.trim(),
      pharmacyPhone: pharmacyPhone.trim(),
      pharmacyAddress: pharmacyAddress.trim() || undefined
    }
  }, [pharmacyName, pharmacyPhone, pharmacyAddress])

  // Validate using Zod schema
  const validateFields = useCallback(() => {
    const payload = getPayload()
    const result = validatePharmacyInformation(payload)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      setValidationErrors(errors)
      return false
    }

    setValidationErrors({})
    return true
  }, [getPayload, setValidationErrors])

  // Handle phone input with formatting
  const handlePhoneChange = (value: string) => {
    // Format the phone number as user types
    const formatted = formatPhoneInput(value, pharmacyPhone)
    setPharmacyPhone(formatted)

    // Clear error if has enough digits
    const normalized = normalizePhoneNumber(formatted)
    if (normalized.length >= 10) {
      clearValidationError('pharmacyPhone')
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
          <Building className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Pharmacy Information
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pharmacy Name */}
              <div className="space-y-2">
                <Label htmlFor={`${sectionUid}-name`}>
                  Pharmacy Name<span className="text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id={`${sectionUid}-name`}
                  type="text"
                  value={pharmacyName}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 120) {
                      setPharmacyName(value)
                      if (value.trim()) {
                        clearValidationError('pharmacyName')
                      }
                    }
                  }}
                  maxLength={120}
                  placeholder="Enter pharmacy name"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-required="true"
                  aria-invalid={!!validationErrors['pharmacyName']}
                  aria-describedby={validationErrors['pharmacyName'] ? `${sectionUid}-name-error` : undefined}
                />
                {validationErrors['pharmacyName'] && (
                  <p id={`${sectionUid}-name-error`} className="text-sm text-[var(--destructive)]" role="alert">
                    {validationErrors['pharmacyName']}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor={`${sectionUid}-phone`}>
                  Phone Number<span className="text-[var(--destructive)]">*</span>
                </Label>
                <Input
                  id={`${sectionUid}-phone`}
                  type="tel"
                  value={pharmacyPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(XXX) XXX-XXXX"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-required="true"
                  aria-invalid={!!validationErrors['pharmacyPhone']}
                  aria-describedby={validationErrors['pharmacyPhone'] ? `${sectionUid}-phone-error` : undefined}
                />
                {validationErrors['pharmacyPhone'] && (
                  <p id={`${sectionUid}-phone-error`} className="text-sm text-[var(--destructive)]" role="alert">
                    {validationErrors['pharmacyPhone']}
                  </p>
                )}
              </div>

              {/* Address - Full width */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`${sectionUid}-address`}>
                  Address
                </Label>
                <Input
                  id={`${sectionUid}-address`}
                  type="text"
                  value={pharmacyAddress}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 200) {
                      setPharmacyAddress(value)
                      if (value.trim()) {
                        clearValidationError('pharmacyAddress')
                      }
                    }
                  }}
                  maxLength={200}
                  placeholder="Enter pharmacy address"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-invalid={!!validationErrors['pharmacyAddress']}
                  aria-describedby={validationErrors['pharmacyAddress'] ? `${sectionUid}-address-error` : undefined}
                />
                {validationErrors['pharmacyAddress'] && (
                  <p id={`${sectionUid}-address-error`} className="text-sm text-[var(--destructive)]" role="alert">
                    {validationErrors['pharmacyAddress']}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
}

// Export validation function type for parent components
export interface PharmacyInformationValidation {
  validate: () => boolean
  getPayload: () => Record<string, unknown>
}