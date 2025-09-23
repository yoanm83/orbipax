"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Brain, CalendarIcon, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

export function PsychiatristSection() {
  const {
    medicalProvidersInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

  const toggleSection = () => {
    setFormData('medicalProvidersInfo', {
      expandedSections: {
        ...medicalProvidersInfo.expandedSections,
        psychiatrist: !medicalProvidersInfo.expandedSections.psychiatrist,
      }
    })
  }

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 4 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Psychiatrist / Clinical Evaluator</h2>
        </div>
        {medicalProvidersInfo.expandedSections.psychiatrist ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {medicalProvidersInfo.expandedSections.psychiatrist && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Has Psychiatrist */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hasPsychiatrist">Has the client been evaluated by a psychiatrist?</Label>
              <Select
                value={medicalProvidersInfo.psychiatrist.hasBeenEvaluated === undefined ? "" : medicalProvidersInfo.psychiatrist.hasBeenEvaluated ? "yes" : "no"}
                onValueChange={(value) => setFormData('medicalProvidersInfo', {
                  psychiatrist: {
                    ...medicalProvidersInfo.psychiatrist,
                    hasBeenEvaluated: value === "yes"
                  }
                })}
              >
                <SelectTrigger id="hasPsychiatrist">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {medicalProvidersInfo.psychiatrist.hasBeenEvaluated === true && (
              <>
                {/* Psychiatrist Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="psychiatristName">Psychiatrist Full Name *</Label>
                  <Input
                    id="psychiatristName"
                    placeholder="Enter psychiatrist's full name"
                    value={medicalProvidersInfo.psychiatrist.name}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      psychiatrist: {
                        ...medicalProvidersInfo.psychiatrist,
                        name: e.target.value
                      }
                    })}
                    required
                  />
                </div>

                {/* Evaluation Date */}
                <div className="space-y-2">
                  <Label htmlFor="psychiatristEvalDate">Evaluation Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !medicalProvidersInfo.psychiatrist.evalDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {medicalProvidersInfo.psychiatrist.evalDate ? format(medicalProvidersInfo.psychiatrist.evalDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={medicalProvidersInfo.psychiatrist.evalDate}
                        onSelect={(date) => setFormData('medicalProvidersInfo', {
                          psychiatrist: {
                            ...medicalProvidersInfo.psychiatrist,
                            evalDate: date
                          }
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Clinic / Facility Name */}
                <div className="space-y-2">
                  <Label htmlFor="psychiatristClinic">Clinic / Facility Name</Label>
                  <Input
                    id="psychiatristClinic"
                    placeholder="Enter clinic or facility name"
                    value={medicalProvidersInfo.psychiatrist.clinic}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      psychiatrist: {
                        ...medicalProvidersInfo.psychiatrist,
                        clinic: e.target.value
                      }
                    })}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="psychiatristNotes">Notes</Label>
                  <Textarea
                    id="psychiatristNotes"
                    placeholder="Additional notes about psychiatric evaluation"
                    value={medicalProvidersInfo.psychiatrist.notes}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      psychiatrist: {
                        ...medicalProvidersInfo.psychiatrist,
                        notes: e.target.value
                      }
                    })}
                  />
                </div>

                {/* Different Evaluator */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hasDifferentEvaluator">Different Clinical Evaluator?</Label>
                    <Switch
                      id="hasDifferentEvaluator"
                      checked={medicalProvidersInfo.psychiatrist.hasDifferentEvaluator}
                      onCheckedChange={(checked) => setFormData('medicalProvidersInfo', {
                        psychiatrist: {
                          ...medicalProvidersInfo.psychiatrist,
                          hasDifferentEvaluator: checked
                        }
                      })}
                    />
                  </div>
                </div>

                {medicalProvidersInfo.psychiatrist.hasDifferentEvaluator && (
                  <>
                    {/* Evaluator Name */}
                    <div className="space-y-2">
                      <Label htmlFor="evaluatorName">Evaluator Full Name</Label>
                      <Input
                        id="evaluatorName"
                        placeholder="Enter evaluator's full name"
                        value={medicalProvidersInfo.psychiatrist.evaluator.name}
                        onChange={(e) => setFormData('medicalProvidersInfo', {
                          psychiatrist: {
                            ...medicalProvidersInfo.psychiatrist,
                            evaluator: {
                              ...medicalProvidersInfo.psychiatrist.evaluator,
                              name: e.target.value
                            }
                          }
                        })}
                      />
                    </div>

                    {/* Evaluator Clinic */}
                    <div className="space-y-2">
                      <Label htmlFor="evaluatorClinic">Evaluator Clinic / Facility</Label>
                      <Input
                        id="evaluatorClinic"
                        placeholder="Enter clinic or facility name"
                        value={medicalProvidersInfo.psychiatrist.evaluator.clinic}
                        onChange={(e) => setFormData('medicalProvidersInfo', {
                          psychiatrist: {
                            ...medicalProvidersInfo.psychiatrist,
                            evaluator: {
                              ...medicalProvidersInfo.psychiatrist.evaluator,
                              clinic: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 