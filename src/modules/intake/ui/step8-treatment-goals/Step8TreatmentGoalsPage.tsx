'use client'

import { useState } from 'react'

import { Card } from '@/shared/ui/primitives/Card'
import { TreatmentGoalsSection } from './components/TreatmentGoalsSection'
import { PriorityAreasSection } from './components/PriorityAreasSection'

/**
 * Step 8: Treatment Goals
 * UI-only implementation with a single unified section
 * Contains textarea, example pills, and generate button all in one section
 */
export function Step8TreatmentGoalsPage() {
  // Local UI state for collapsibles (not part of form data)
  const [treatmentGoalsExpanded, setTreatmentGoalsExpanded] = useState(true)
  const [priorityAreasExpanded, setPriorityAreasExpanded] = useState(false)

  return (
    <div className="flex-1 w-full">
      <div className="p-6 space-y-4">
        {/* Treatment Goals Section */}
        <Card className="w-full rounded-3xl shadow-md">
          <TreatmentGoalsSection
            isExpanded={treatmentGoalsExpanded}
            onToggleExpand={() => setTreatmentGoalsExpanded(!treatmentGoalsExpanded)}
          />
        </Card>

        {/* Priority Areas Section */}
        <Card className="w-full rounded-3xl shadow-md">
          <PriorityAreasSection
            isExpanded={priorityAreasExpanded}
            onToggleExpand={() => setPriorityAreasExpanded(!priorityAreasExpanded)}
          />
        </Card>
      </div>
    </div>
  )
}