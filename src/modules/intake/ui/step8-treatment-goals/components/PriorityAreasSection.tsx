'use client'

import { useState } from 'react'
import { ListTodo, ChevronDown, ChevronUp, ArrowUp, ArrowDown, X } from 'lucide-react'

import { Button } from '@/shared/ui/primitives/Button'
import { Badge } from '@/shared/ui/primitives/Badge'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/Textarea'
import { toast } from '@/shared/ui/primitives/Toast'

interface PriorityAreasSectionProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

// Available priority areas
const AVAILABLE_AREAS = [
  'Depression',
  'Anxiety',
  'Trauma/PTSD',
  'Relationship Issues',
  'Self-Esteem',
  'Grief/Loss',
  'Substance Use',
  'Anger Management',
  'Life Transitions',
  'Stress Management',
  'Family Conflict',
  'Work/Career Issues',
  'Identity/Self-Discovery',
  'Sleep Difficulties',
  'Chronic Pain',
  'Other'
] as const

type AreaName = typeof AVAILABLE_AREAS[number]

interface SelectedArea {
  name: AreaName
  rank: number // 1, 2, or 3
}

/**
 * Priority Areas of Concern Section
 * UI-only component with local state for selecting and ranking top 3 priority areas
 */
export function PriorityAreasSection({ isExpanded, onToggleExpand }: PriorityAreasSectionProps) {
  const [selectedAreas, setSelectedAreas] = useState<SelectedArea[]>([])
  const [clinicalNotes, setClinicalNotes] = useState('')

  // Check if an area is selected
  const isAreaSelected = (area: AreaName): boolean => {
    return selectedAreas.some(selected => selected.name === area)
  }

  // Add or remove an area from selection
  const toggleArea = (area: AreaName) => {
    if (isAreaSelected(area)) {
      // Remove the area
      setSelectedAreas(prev => {
        const filtered = prev.filter(selected => selected.name !== area)
        // Re-rank remaining areas
        return filtered.map((item, index) => ({
          ...item,
          rank: index + 1
        }))
      })
    } else {
      // Add the area if we haven't reached the limit
      if (selectedAreas.length >= 3) {
        toast.warning('You can only select up to 3 priority areas')
        return
      }
      setSelectedAreas(prev => [
        ...prev,
        { name: area, rank: prev.length + 1 }
      ])
    }
  }

  // Move an area up in the ranking
  const moveUp = (area: AreaName) => {
    setSelectedAreas(prev => {
      const index = prev.findIndex(item => item.name === area)
      if (index <= 0) return prev

      const newAreas = [...prev]
      // Swap with previous item
      const temp = newAreas[index - 1]
      newAreas[index - 1] = { ...newAreas[index], rank: index }
      newAreas[index] = { ...temp, rank: index + 1 }
      return newAreas
    })
  }

  // Move an area down in the ranking
  const moveDown = (area: AreaName) => {
    setSelectedAreas(prev => {
      const index = prev.findIndex(item => item.name === area)
      if (index === -1 || index >= prev.length - 1) return prev

      const newAreas = [...prev]
      // Swap with next item
      const temp = newAreas[index + 1]
      newAreas[index + 1] = { ...newAreas[index], rank: index + 2 }
      newAreas[index] = { ...temp, rank: index + 1 }
      return newAreas
    })
  }

  // Remove an area from selection
  const removeArea = (area: AreaName) => {
    setSelectedAreas(prev => {
      const filtered = prev.filter(selected => selected.name !== area)
      // Re-rank remaining areas
      return filtered.map((item, index) => ({
        ...item,
        rank: index + 1
      }))
    })
  }

  return (
    <>
      {/* Collapsible Header */}
      <div
        id="priority-areas-header"
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggleExpand()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls="priority-areas-panel"
      >
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">Priority Areas of Concern</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div id="priority-areas-panel" className="p-6 space-y-6">
          {/* Available Areas */}
          <div className="space-y-3">
            <Label>
              Select areas of concern (rank top 3 if applicable) <span className="text-[var(--destructive)]">*</span>
            </Label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Available priority areas">
              {AVAILABLE_AREAS.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  disabled={selectedAreas.length >= 3 && !isAreaSelected(area)}
                  className={`
                    inline-flex items-center justify-center
                    rounded-full px-3 py-0.5 min-h-[44px] text-sm font-normal leading-tight
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
                    ${isAreaSelected(area)
                      ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90'
                      : 'bg-[var(--muted)] text-[var(--foreground-muted)] hover:bg-[var(--muted)]/70 hover:text-[var(--foreground)]'
                    }
                  `}
                  aria-pressed={isAreaSelected(area)}
                  aria-label={`${isAreaSelected(area) ? 'Remove' : 'Add'} ${area} ${isAreaSelected(area) ? 'from' : 'to'} priority areas`}
                >
                  {area}
                </button>
              ))}
            </div>
            {selectedAreas.length === 3 && (
              <p className="text-sm text-[var(--warning)]" role="status" aria-live="polite">
                Maximum of 3 priority areas reached
              </p>
            )}
          </div>

          {/* Selected Priority Areas */}
          {selectedAreas.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Selected Priority Areas:</h3>
              <div className="space-y-2" role="list" aria-label="Selected priority areas with ranking">
                {selectedAreas.map((area) => (
                  <div
                    key={area.name}
                    className="flex items-center justify-between px-3 py-1.5 min-h-[44px] bg-[var(--muted)] rounded-lg"
                    role="listitem"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="default"
                        className="h-6 w-6 rounded-full flex items-center justify-center text-white"
                        aria-label={`Rank ${area.rank}`}
                      >
                        {area.rank}
                      </Badge>
                      <span className="text-sm font-normal text-[var(--foreground-muted)]">{area.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveUp(area.name)}
                        disabled={area.rank === 1}
                        className="h-8 w-8 min-h-0"
                        aria-label={`Move ${area.name} up`}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => moveDown(area.name)}
                        disabled={area.rank === selectedAreas.length}
                        className="h-8 w-8 min-h-0"
                        aria-label={`Move ${area.name} down`}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArea(area.name)}
                        className="h-8 w-8 min-h-0 hover:text-[var(--destructive)]"
                        aria-label={`Remove ${area.name} from priority areas`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Notes */}
          <div className="space-y-2">
            <Label htmlFor="priority-clinical-notes">
              Notes for clinical use
            </Label>
            <Textarea
              id="priority-clinical-notes"
              placeholder="Enter any additional notes about the priority areas..."
              className="min-h-[100px]"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              aria-describedby="clinical-notes-hint"
            />
            <p id="clinical-notes-hint" className="text-sm text-[var(--foreground-muted)]">
              Optional: Provide context or specific concerns related to the selected areas
            </p>
          </div>
        </div>
      )}
    </>
  )
}