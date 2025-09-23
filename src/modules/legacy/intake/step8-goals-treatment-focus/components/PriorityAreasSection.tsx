"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, ListTodo, X, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface PriorityAreasSectionProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

interface PriorityArea {
  id: string
  label: string
  selected: boolean
  rank: number | null
  isOther: boolean
  otherText?: string
}

export function PriorityAreasSection({ isExpanded, onToggleExpand }: PriorityAreasSectionProps) {
  const { treatmentInfo, setFormData } = useIntakeFormStore()
  const { priorityAreas, clinicalNotes } = treatmentInfo

  // Toggle priority area selection
  const togglePriorityArea = (id: string) => {
    setFormData('treatmentInfo', {
      priorityAreas: priorityAreas.map((area) => {
        if (area.id === id) {
          if (area.selected) {
            return { ...area, selected: false, rank: null }
          }
          const rankedAreas = priorityAreas.filter((a) => a.rank !== null)
          const newRank = rankedAreas.length < 3 ? rankedAreas.length + 1 : null
          return { ...area, selected: true, rank: newRank }
        }
        return area
      }),
    })
  }

  // Move priority area rank up/down
  const moveRank = (id: string, direction: 'up' | 'down') => {
    const area = priorityAreas.find((a) => a.id === id)
    if (!area?.rank) return

    const newRank = direction === 'up' ? area.rank - 1 : area.rank + 1
    if (newRank < 1 || newRank > 3) return

    setFormData('treatmentInfo', {
      priorityAreas: priorityAreas.map((a) => {
        if (a.id === id) return { ...a, rank: newRank }
        if (a.rank === newRank) return { ...a, rank: area.rank }
        return a
      }),
    })
  }

  // Get selected priority areas
  const getSelectedPriorityAreas = () => {
    return priorityAreas
      .filter((area) => area.selected)
      .sort((a, b) => {
        if (a.rank === null && b.rank === null) return 0
        if (a.rank === null) return 1
        if (b.rank === null) return -1
        return a.rank - b.rank
      })
  }

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Priority Areas of Concern</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select areas of concern (rank top 3 if applicable) *</Label>
              <div className="flex flex-wrap gap-2">
                {priorityAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => togglePriorityArea(area.id)}
                    className={cn(
                      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      area.selected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted'
                    )}
                  >
                    {area.label}
                    {area.rank && (
                      <Badge variant="secondary" className="ml-1">
                        {area.rank}
                      </Badge>
                    )}
                    {area.selected && <X className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Priority Areas */}
            {getSelectedPriorityAreas().length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Selected Priority Areas:</h3>
                <div className="space-y-2">
                  {getSelectedPriorityAreas().map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {area.rank && (
                          <Badge variant="default" className="h-6 w-6 rounded-full shrink-0">
                            {area.rank}
                          </Badge>
                        )}
                        <span>{area.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveRank(area.id, 'up')}
                          disabled={!area.rank || area.rank === 1}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveRank(area.id, 'down')}
                          disabled={!area.rank || area.rank === 3}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="clinicalNotes">Notes for clinical use</Label>
              <Textarea
                id="clinicalNotes"
                placeholder="Enter any additional notes for clinical use..."
                value={clinicalNotes}
                onChange={(e) => setFormData('treatmentInfo', { clinicalNotes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 