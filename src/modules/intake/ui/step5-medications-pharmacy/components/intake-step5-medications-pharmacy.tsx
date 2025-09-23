"use client"

import { useEffect } from "react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { MedicationsSection } from "./MedicationsSection"
import { PharmacySection } from "./PharmacySection"

export function IntakeWizardStep5() {
  const {
    medicationInfo,
    setFormData
  } = useIntakeFormStore()

  // Initialize medication info if needed
  useEffect(() => {
    if (!medicationInfo?.expandedSections) {
      setFormData('medicationInfo', {
        ...medicationInfo,
        expandedSections: {
          medications: true,
          pharmacy: false
        }
      })
    }

    // Initialize medications array if it doesn't exist
    if (!medicationInfo?.medications) {
      setFormData('medicationInfo', {
        ...medicationInfo,
        medications: []
      })
    }

    // Initialize pharmacy info if it doesn't exist
    if (!medicationInfo?.pharmacyInfo) {
      setFormData('medicationInfo', {
        ...medicationInfo,
        pharmacyInfo: {
          name: "",
          address: "",
          phone: "",
          isCurrentPharmacy: false
        }
      })
    }

    // Initialize allergies info if it doesn't exist
    if (medicationInfo?.hasAllergies === undefined) {
      setFormData('medicationInfo', {
        ...medicationInfo,
        hasAllergies: false,
        allergiesList: "",
        allergiesReaction: ""
      })
    }
  }, [])

  // Check if step is complete
  const isStepComplete = () => {
    // Check if at least one medication is entered with required fields
    const hasMedication = medicationInfo?.medications?.some(
      (record) => record.name?.trim() !== "" && record.dosage?.trim() !== "" && record.frequency?.trim() !== "",
    )

    // Check if allergies section is properly filled
    const isAllergiesComplete = medicationInfo?.hasAllergies === false || 
      (medicationInfo?.hasAllergies === true && medicationInfo?.allergiesList?.trim() !== "")

    // Check if pharmacy information is entered
    const hasPharmacyInfo = medicationInfo?.pharmacyInfo?.name?.trim() !== "" && medicationInfo?.pharmacyInfo?.phone?.trim() !== ""

    return (hasMedication || hasPharmacyInfo) && isAllergiesComplete
  }

  return (
    <div className="flex-1 w-full p-6">
      <MedicationsSection />
      <PharmacySection />
    </div>
  )
}
