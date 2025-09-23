import { IntakeWizardStep1Demographics } from "./components/intake-wizard-step1-demographics"
import { analytics } from "@/lib/analytics"
import { useEffect } from "react"

export default function DemographicsPage() {
  // Track page load
  useEffect(() => {
    analytics.trackFeatureUsage('intake_step1', {
      version: 'new',
      timestamp: new Date().toISOString()
    })
  }, [])

  return (
    <main className="min-h-screen bg-[#F5F7FA] p-4 md:p-8 flex">
      <IntakeWizardStep1Demographics />
    </main>
  )
} 