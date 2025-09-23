"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface PsychiatricEvaluationSectionProps {
  isExpanded: boolean
  onSectionToggle: () => void
  lastEditedStep: number
}

export function PsychiatricEvaluationSection({ isExpanded, onSectionToggle, lastEditedStep }: PsychiatricEvaluationSectionProps) {
  const { clinicalInfo, setFormData } = useIntakeFormStore()

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 3 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
      >
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Psychiatric Evaluation</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Has Completed Psych Eval */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Label>Has the client completed a psychiatric evaluation?</Label>
                <Select
                  value={clinicalInfo.psychiatricEvaluation.hasCompleted?.toString() || ""}
                  onValueChange={(value) => setFormData('clinicalInfo', {
                    ...clinicalInfo,
                    psychiatricEvaluation: {
                      ...clinicalInfo.psychiatricEvaluation,
                      hasCompleted: value === "true"
                    }
                  })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {clinicalInfo.psychiatricEvaluation.hasCompleted && (
              <>
                {/* Evaluation Date */}
                <div className="space-y-2">
                  <Label htmlFor="psychEvalDate">Evaluation Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !clinicalInfo.psychiatricEvaluation.evalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {clinicalInfo.psychiatricEvaluation.evalDate
                          ? format(clinicalInfo.psychiatricEvaluation.evalDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={clinicalInfo.psychiatricEvaluation.evalDate}
                        onSelect={(date) => setFormData('clinicalInfo', {
                          ...clinicalInfo,
                          psychiatricEvaluation: {
                            ...clinicalInfo.psychiatricEvaluation,
                            evalDate: date
                          }
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Evaluated By */}
                <div className="space-y-2">
                  <Label htmlFor="psychEvalBy">Evaluated By</Label>
                  <Input
                    id="psychEvalBy"
                    placeholder="Name of evaluating clinician"
                    value={clinicalInfo.psychiatricEvaluation.evaluatedBy}
                    onChange={(e) => setFormData('clinicalInfo', {
                      ...clinicalInfo,
                      psychiatricEvaluation: {
                        ...clinicalInfo.psychiatricEvaluation,
                        evaluatedBy: e.target.value
                      }
                    })}
                  />
                </div>

                {/* Evaluation Summary */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="psychEvalSummary">Evaluation Summary</Label>
                  <Textarea
                    id="psychEvalSummary"
                    placeholder="Summary of psychiatric evaluation findings..."
                    value={clinicalInfo.psychiatricEvaluation.summary}
                    onChange={(e) => setFormData('clinicalInfo', {
                      ...clinicalInfo,
                      psychiatricEvaluation: {
                        ...clinicalInfo.psychiatricEvaluation,
                        summary: e.target.value
                      }
                    })}
                    className="min-h-[100px]"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 