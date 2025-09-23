"use client"

import { useEffect } from "react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { TreatmentHistorySection } from "./TreatmentHistorySection"
import { ExternalReferralsSection } from "./ExternalReferralsSection"
import { InternalServicesSection } from "./InternalServicesSection"

export function IntakeWizardStep6() {
  const { referralInfo, setFormData, toggleSection } = useIntakeFormStore()

  // Initialize sections on mount
  useEffect(() => {
    // Always set initial sections state on mount
    setFormData('referralInfo', {
      ...referralInfo,
      expandedSections: {
        treatmentHistory: true,
        externalReferrals: false,
        internalServices: false
      }
    })
  }, [])

  // Check if step is complete
  const isStepComplete = () => {
    // Check if treatment history section is complete
    const isTreatmentHistoryComplete =
      referralInfo?.treatmentHistory?.hasPreviousTreatment !== undefined &&
      (referralInfo?.treatmentHistory?.hasPreviousTreatment === false || 
       referralInfo?.treatmentHistory?.previousProviders?.trim() !== "") &&
      (referralInfo?.treatmentHistory?.hasPreviousTreatment === false || 
       referralInfo?.treatmentHistory?.wasHospitalized !== undefined)

    // Check if external referrals section is complete
    const isExternalReferralsComplete =
      referralInfo?.externalReferrals?.hasExternalReferrals !== undefined &&
      (referralInfo?.externalReferrals?.hasExternalReferrals === false || 
       referralInfo?.externalReferrals?.referralTypes?.length > 0) &&
      (referralInfo?.externalReferrals?.hasExternalReferrals === false ||
       !referralInfo?.externalReferrals?.referralTypes?.includes("other") ||
       referralInfo?.externalReferrals?.otherReferral?.trim() !== "")

    // Check if internal services section is complete
    const isInternalServicesComplete =
      referralInfo?.internalServices?.services?.length > 0 &&
      (!referralInfo?.internalServices?.services?.includes("other") ||
       referralInfo?.internalServices?.otherService?.trim() !== "") &&
      referralInfo?.internalServices?.preferredDelivery?.trim() !== ""

    return isTreatmentHistoryComplete && isExternalReferralsComplete && isInternalServicesComplete
  }

  return (
    <div className="flex-1 w-full p-6">
      <TreatmentHistorySection onToggle={() => toggleSection('referralInfo', 'treatmentHistory')} />
      <ExternalReferralsSection onToggle={() => toggleSection('referralInfo', 'externalReferrals')} />
      <InternalServicesSection onToggle={() => toggleSection('referralInfo', 'internalServices')} />
    </div>
  )
}
