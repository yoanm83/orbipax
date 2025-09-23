"use client"

import { useEffect } from "react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { PrimaryCareProviderSection } from "./PrimaryCareProviderSection"
import { PsychiatristSection } from "./PsychiatristSection"

export function IntakeWizardStep4() {
  const {
    medicalProvidersInfo,
    setFormData
  } = useIntakeFormStore()

  // Initialize medical providers info if it doesn't exist
  useEffect(() => {
    // Always set initial sections state on mount
    setFormData('medicalProvidersInfo', {
      ...medicalProvidersInfo,
      expandedSections: {
        pcp: true,
        psychiatrist: false
      }
    })
    
    // Initialize PCP info if it doesn't exist
    if (!medicalProvidersInfo?.primaryCareProvider) {
      setFormData('medicalProvidersInfo', {
        ...medicalProvidersInfo,
        primaryCareProvider: {
          hasPCP: undefined,
          name: "",
          clinic: "",
          phone: "",
          address: "",
          authorizedToShare: false,
          roiRequired: false
        }
      })
    }

    // Initialize psychiatrist info if it doesn't exist
    if (!medicalProvidersInfo?.psychiatrist) {
      setFormData('medicalProvidersInfo', {
        ...medicalProvidersInfo,
        psychiatrist: {
          hasBeenEvaluated: undefined,
          name: "",
          evalDate: undefined,
          clinic: "",
          notes: "",
          hasDifferentEvaluator: false,
          evaluator: {
            name: "",
            clinic: ""
          }
        }
      })
    }
  }, [])

  // Update ROI required when authorization changes
  useEffect(() => {
    if (medicalProvidersInfo?.primaryCareProvider?.authorizedToShare) {
      setFormData('medicalProvidersInfo', {
        primaryCareProvider: {
          ...medicalProvidersInfo.primaryCareProvider,
          roiRequired: true
        }
      })
    }
  }, [medicalProvidersInfo?.primaryCareProvider?.authorizedToShare])

  // Check if step is complete
  const isStepComplete = () => {
    // Check if PCP section is complete
    const isPcpComplete = medicalProvidersInfo?.primaryCareProvider?.hasPCP === false || 
      (medicalProvidersInfo?.primaryCareProvider?.hasPCP === true && 
       medicalProvidersInfo?.primaryCareProvider?.name?.trim() !== "" && 
       medicalProvidersInfo?.primaryCareProvider?.phone?.trim() !== "")

    // Check if Psychiatrist section is complete
    const isPsychiatristComplete =
      medicalProvidersInfo?.psychiatrist?.hasBeenEvaluated === false ||
      (medicalProvidersInfo?.psychiatrist?.hasBeenEvaluated === true && 
       medicalProvidersInfo?.psychiatrist?.name?.trim() !== "" && 
       medicalProvidersInfo?.psychiatrist?.evalDate !== undefined)

    return isPcpComplete && isPsychiatristComplete
  }

  return (
    <div className="flex-1 w-full p-6">
      <PrimaryCareProviderSection />
      <PsychiatristSection />
    </div>
  )
}
