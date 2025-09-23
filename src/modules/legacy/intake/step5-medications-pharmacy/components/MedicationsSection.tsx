"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, Pill, Plus, Trash2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

export function MedicationsSection() {
  const {
    medicationInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

  // Add new medication record
  const addMedicationRecord = () => {
    setFormData('medicationInfo', {
      medications: [
        ...medicationInfo.medications,
        {
          id: Date.now().toString(),
          name: "",
          dosage: "",
          frequency: "",
          route: "",
          prescribedBy: "",
          startDate: undefined,
          notes: "",
        },
      ]
    })
  }

  // Remove medication record
  const removeMedicationRecord = (id: string) => {
    setFormData('medicationInfo', {
      medications: medicationInfo.medications.filter((record) => record.id !== id)
    })
  }

  // Update medication record field
  const updateMedicationField = (id: string, field: keyof (typeof medicationInfo.medications)[0], value: any) => {
    setFormData('medicationInfo', {
      medications: medicationInfo.medications.map((record) => {
        if (record.id === id) {
          return { ...record, [field]: value }
        }
        return record
      })
    })
  }

  const toggleSection = () => {
    setFormData('medicationInfo', {
      expandedSections: {
        ...medicationInfo.expandedSections,
        medications: !medicationInfo.expandedSections.medications,
      }
    })
  }

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 5 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Current Medications & Allergies</h2>
        </div>
        {medicationInfo.expandedSections.medications ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {medicationInfo.expandedSections.medications && (
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Medications</h3>

          {medicationInfo.medications.map((record, index) => (
            <div key={record.id} className="mb-8 pb-8 border-b last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-medium">Medication {index + 1}</h4>
                {medicationInfo.medications.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeMedicationRecord(record.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medication Name */}
                <div className="space-y-2">
                  <Label htmlFor={`medicationName-${record.id}`}>Medication Name *</Label>
                  <Input
                    id={`medicationName-${record.id}`}
                    placeholder="Enter medication name"
                    value={record.name}
                    onChange={(e) => updateMedicationField(record.id, "name", e.target.value)}
                    required
                  />
                </div>

                {/* Dosage */}
                <div className="space-y-2">
                  <Label htmlFor={`dosage-${record.id}`}>Dosage *</Label>
                  <Input
                    id={`dosage-${record.id}`}
                    placeholder="e.g., 10mg"
                    value={record.dosage}
                    onChange={(e) => updateMedicationField(record.id, "dosage", e.target.value)}
                    required
                  />
                </div>

                {/* Frequency */}
                <div className="space-y-2">
                  <Label htmlFor={`frequency-${record.id}`}>Frequency *</Label>
                  <Input
                    id={`frequency-${record.id}`}
                    placeholder="e.g., Twice daily"
                    value={record.frequency}
                    onChange={(e) => updateMedicationField(record.id, "frequency", e.target.value)}
                    required
                  />
                </div>

                {/* Route */}
                <div className="space-y-2">
                  <Label htmlFor={`route-${record.id}`}>Route</Label>
                  <Select
                    value={record.route}
                    onValueChange={(value) => updateMedicationField(record.id, "route", value)}
                  >
                    <SelectTrigger id={`route-${record.id}`}>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="topical">Topical</SelectItem>
                      <SelectItem value="sublingual">Sublingual</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prescribed By */}
                <div className="space-y-2">
                  <Label htmlFor={`prescribedBy-${record.id}`}>Prescribed By</Label>
                  <Input
                    id={`prescribedBy-${record.id}`}
                    placeholder="Enter prescriber's name"
                    value={record.prescribedBy}
                    onChange={(e) => updateMedicationField(record.id, "prescribedBy", e.target.value)}
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${record.id}`}>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.startDate ? format(record.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={record.startDate}
                        onSelect={(date) => updateMedicationField(record.id, "startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`notes-${record.id}`}>Notes</Label>
                  <Input
                    id={`notes-${record.id}`}
                    placeholder="Additional notes about this medication"
                    value={record.notes}
                    onChange={(e) => updateMedicationField(record.id, "notes", e.target.value)}
                  />
                </div>

                {/* Validation Alert */}
                {(record.name.trim() === "" || record.dosage.trim() === "" || record.frequency.trim() === "") && (
                  <div className="md:col-span-2">
                    <Alert className="border-amber-500 bg-amber-50 text-amber-900">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Medication name, dosage, and frequency are required.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Medication Button */}
          <Button
            variant="outline"
            className="mt-4"
            onClick={addMedicationRecord}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Another Medication
          </Button>
        </CardContent>
      )}
    </Card>
  )
} 