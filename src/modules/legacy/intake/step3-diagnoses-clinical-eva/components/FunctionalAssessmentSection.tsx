"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, ActivitySquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface FunctionalAssessmentSectionProps {
  isExpanded: boolean
  onSectionToggle: () => void
  lastEditedStep: number
}

export function FunctionalAssessmentSection({ isExpanded, onSectionToggle, lastEditedStep }: FunctionalAssessmentSectionProps) {
  const { clinicalInfo, setFormData } = useIntakeFormStore()

  // Toggle affected domain
  const toggleAffectedDomain = (domain: string) => {
    const newDomains = clinicalInfo.functionalAssessment.affectedDomains.includes(domain)
      ? clinicalInfo.functionalAssessment.affectedDomains.filter((d) => d !== domain)
      : [...clinicalInfo.functionalAssessment.affectedDomains, domain]
    
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      functionalAssessment: {
        ...clinicalInfo.functionalAssessment,
        affectedDomains: newDomains
      }
    })
  }

  // Update ADL Independent
  const updateADLIndependent = (value: string) => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      functionalAssessment: {
        ...clinicalInfo.functionalAssessment,
        adlIndependent: value
      }
    })
  }

  // Update IADL Independent
  const updateIADLIndependent = (value: string) => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      functionalAssessment: {
        ...clinicalInfo.functionalAssessment,
        iadlIndependent: value
      }
    })
  }

  // Update Cognitive Function
  const updateCognitiveFunction = (value: string) => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      functionalAssessment: {
        ...clinicalInfo.functionalAssessment,
        cognitiveFunction: value
      }
    })
  }

  // Update Safety Concerns Notes
  const updateSafetyConcernsNotes = (value: string) => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      functionalAssessment: {
        ...clinicalInfo.functionalAssessment,
        safetyConcernsNotes: value
      }
    })
  }

  // Update Functional Notes
  const updateFunctionalNotes = (value: string) => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      functionalAssessment: {
        ...clinicalInfo.functionalAssessment,
        functionalNotes: value
      }
    })
  }

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
          <ActivitySquare className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Functional Assessment</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Affected Domains */}
            <div className="space-y-4 md:col-span-2">
              <Label>Affected Domains (select all that apply) *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="domain-social"
                    checked={clinicalInfo.functionalAssessment.affectedDomains.includes("social")}
                    onCheckedChange={() => toggleAffectedDomain("social")}
                  />
                  <Label htmlFor="domain-social" className="font-normal">
                    Social
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="domain-vocational"
                    checked={clinicalInfo.functionalAssessment.affectedDomains.includes("vocational")}
                    onCheckedChange={() => toggleAffectedDomain("vocational")}
                  />
                  <Label htmlFor="domain-vocational" className="font-normal">
                    Vocational/Educational
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="domain-interpersonal"
                    checked={clinicalInfo.functionalAssessment.affectedDomains.includes("interpersonal")}
                    onCheckedChange={() => toggleAffectedDomain("interpersonal")}
                  />
                  <Label htmlFor="domain-interpersonal" className="font-normal">
                    Interpersonal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="domain-coping"
                    checked={clinicalInfo.functionalAssessment.affectedDomains.includes("coping")}
                    onCheckedChange={() => toggleAffectedDomain("coping")}
                  />
                  <Label htmlFor="domain-coping" className="font-normal">
                    Coping Skills
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="domain-behavioral"
                    checked={clinicalInfo.functionalAssessment.affectedDomains.includes("behavioral")}
                    onCheckedChange={() => toggleAffectedDomain("behavioral")}
                  />
                  <Label htmlFor="domain-behavioral" className="font-normal">
                    Behavioral Regulation
                  </Label>
                </div>
              </div>
            </div>

            {/* ADL Independence */}
            <div className="space-y-2">
              <Label htmlFor="adlIndependent">Is client independent in ADLs? *</Label>
              <Select 
                value={clinicalInfo.functionalAssessment.adlIndependent} 
                onValueChange={updateADLIndependent}
              >
                <SelectTrigger id="adlIndependent">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IADL Independence */}
            <div className="space-y-2">
              <Label htmlFor="iadlIndependent">Is client independent in IADLs? *</Label>
              <Select 
                value={clinicalInfo.functionalAssessment.iadlIndependent} 
                onValueChange={updateIADLIndependent}
              >
                <SelectTrigger id="iadlIndependent">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cognitive Functioning */}
            <div className="space-y-2">
              <Label htmlFor="cognitiveFunction">Cognitive Functioning *</Label>
              <Select 
                value={clinicalInfo.functionalAssessment.cognitiveFunction} 
                onValueChange={updateCognitiveFunction}
              >
                <SelectTrigger id="cognitiveFunction">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intact">Intact</SelectItem>
                  <SelectItem value="mild">Mild Impairment</SelectItem>
                  <SelectItem value="moderate">Moderate Impairment</SelectItem>
                  <SelectItem value="severe">Severe Impairment</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Safety Concerns */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasSafetyConcerns">Safety Concerns?</Label>
                <Switch
                  id="hasSafetyConcerns"
                  checked={clinicalInfo.functionalAssessment.hasSafetyConcerns}
                  onCheckedChange={(checked) => setFormData('clinicalInfo', {
                    ...clinicalInfo,
                    functionalAssessment: {
                      ...clinicalInfo.functionalAssessment,
                      hasSafetyConcerns: checked
                    }
                  })}
                />
              </div>
            </div>

            {/* Safety Concerns Notes */}
            {clinicalInfo.functionalAssessment.hasSafetyConcerns && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="safetyConcernsNotes">Safety Concerns Details *</Label>
                <Textarea
                  id="safetyConcernsNotes"
                  placeholder="Describe safety concerns"
                  value={clinicalInfo.functionalAssessment.safetyConcernsNotes}
                  onChange={(e) => updateSafetyConcernsNotes(e.target.value)}
                />
              </div>
            )}

            {/* Additional Notes */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="functionalNotes">Additional Notes</Label>
              <Textarea
                id="functionalNotes"
                placeholder="Additional notes about functional assessment"
                value={clinicalInfo.functionalAssessment.functionalNotes}
                onChange={(e) => updateFunctionalNotes(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 