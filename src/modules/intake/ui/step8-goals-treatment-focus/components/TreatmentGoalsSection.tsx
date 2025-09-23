"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Target, LightbulbIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { EXAMPLE_GOALS } from "./constants/example-goals"

interface TreatmentGoalsSectionProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

export function TreatmentGoalsSection({ isExpanded, onToggleExpand }: TreatmentGoalsSectionProps) {
  const { treatmentInfo, setFormData } = useIntakeFormStore()
  const goalText = String(treatmentInfo.treatmentGoals || '')

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Treatment Goals</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">What would the client like to work on? *</Label>
              <Textarea
                id="goals"
                placeholder="Enter treatment goals..."
                className={cn(
                  'min-h-[120px]',
                  !goalText.trim() && 'border-amber-500'
                )}
                value={goalText}
                onChange={(e) => setFormData('treatmentInfo', { treatmentGoals: e.target.value })}
              />
              {!goalText.trim() && (
                <p className="text-sm text-amber-500">Please describe the treatment goals</p>
              )}
            </div>

            {/* Example Goals */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <LightbulbIcon className="h-4 w-4" />
                Example Goals
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {EXAMPLE_GOALS.map((goal) => (
                  <li key={goal} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 