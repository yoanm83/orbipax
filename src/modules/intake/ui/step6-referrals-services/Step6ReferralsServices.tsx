'use client'

import { useCallback, useState } from "react"
import { Button } from "@/shared/ui/primitives/Button"

import { TreatmentHistorySection } from "./components/TreatmentHistorySection"
import { ExternalReferralsSection } from "./components/ExternalReferralsSection"
import { InternalServiceReferralsSection } from "./components/InternalServiceReferralsSection"

/**
 * Step 6: Referrals & Services
 * Container for referrals and services information sections
 * SoC: UI layer only - no business logic or validation yet
 */
interface Step6ReferralsServicesProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onNext?: () => void
}

export function Step6ReferralsServices({
  onSubmit,
  onNext
}: Step6ReferralsServicesProps = {}) {
  // Local state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    treatmentHistory: true,
    externalReferrals: false,
    internalServiceReferrals: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  /**
   * Placeholder for future payload collection
   * Will integrate with stores when they're created
   */
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Placeholder - will collect from stores in future
      const payload = {
        treatmentHistory: {
          // Will be populated from store
        }
      }

      // Call the provided submit handler
      if (onSubmit) {
        await onSubmit(payload)
      }

      // Navigate to next step
      if (onNext) {
        onNext()
      }
    } catch (error) {
      // Error handled silently - no PHI in logs
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, onSubmit, onNext])

  return (
    <div className="flex-1 w-full">
      <div className="p-6 space-y-6">
        {/* Treatment History Section */}
        <TreatmentHistorySection
          onSectionToggle={() => toggleSection('treatmentHistory')}
          isExpanded={expandedSections.treatmentHistory}
        />

        {/* External Referrals Section */}
        <ExternalReferralsSection
          onSectionToggle={() => toggleSection('externalReferrals')}
          isExpanded={expandedSections.externalReferrals}
        />

        {/* Internal Service Referrals Section */}
        <InternalServiceReferralsSection
          onSectionToggle={() => toggleSection('internalServiceReferrals')}
          isExpanded={expandedSections.internalServiceReferrals}
        />

        {/* Submit Button - will be enhanced with validation later */}
        <div className="flex justify-end pt-6 border-t border-[var(--border)]">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}