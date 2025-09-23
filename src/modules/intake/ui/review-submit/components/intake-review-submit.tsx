"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  FileText,
  ClipboardList,
  UserRound,
  Pill,
  Network,
  Target,
  Shield,
  CheckCircle,
  AlertTriangle,
  Download,
  Pencil,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { ReviewStatusSection } from "./ReviewStatusSection"
import { SubmissionSection } from "./SubmissionSection"

export function IntakeWizardReview() {
  const router = useRouter()
  const today = new Date()

  // Get form data from store
  const {
    personalInfo,
    addressInfo,
    contactInfo,
    legalInfo,
    insuranceInfo,
    medicalInfo,
    medicationInfo,
    clinicalInfo,
    treatmentInfo,
    referralInfo,
    consentInfo,
    medicalProvidersInfo,
    submitForm,
    setFormData
  } = useIntakeFormStore()

  // Add initialization effect
  useEffect(() => {
    if (!referralInfo) {
      setFormData('referralInfo', {
        expandedSections: {
          treatmentHistory: true,
          externalReferrals: true,
          internalServices: true,
        },
        treatmentHistory: {
          hasPreviousTreatment: false,
          previousProviders: "",
          wasHospitalized: false,
          hospitalizationDetails: "",
          pastDiagnoses: "",
        },
        externalReferrals: {
          hasExternalReferrals: false,
          referralTypes: [],
          otherReferral: "",
        },
        internalServices: {
          services: [],
          otherService: "",
          preferredDelivery: "",
          preferenceNotes: "",
        },
      })
    }
  }, [referralInfo, setFormData])

  // State for confirmation and signature
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [signature, setSignature] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Function to handle submission
  const handleSubmit = () => {
    if (isConfirmed && signature.trim() !== "") {
      setIsSubmitted(true)
      submitForm()
      // Navigate to summary after submission
      router.push("/members/new/intake/summary")
    }
  }

  // Function to handle edit navigation
  const handleEdit = (step: number) => {
    router.push(`/members/new/intake/step-${step}`)
  }

  // Check if submission is valid
  const isSubmissionValid = isConfirmed && signature.trim() !== ""

  return (
    <>
      <div className="flex-1 w-full">
        {isSubmitted ? (
          <Card className="w-full rounded-2xl shadow-md mb-6 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-green-700 mb-2">Intake Successfully Submitted</h2>
                <p className="text-green-700 mb-6">
                  Thank you for completing the intake process. Your information has been received.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <ReviewStatusSection />

            {/* Accordion Summary */}
            <Accordion type="multiple" className="w-full mb-6">
              {/* Step 1: Personal & Legal Info */}
              <AccordionItem value="step1" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 1: Personal & Legal Info</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(1)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Full Legal Name</p>
                        <p className="font-medium">{personalInfo.fullName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Preferred Name</p>
                        <p className="font-medium">{personalInfo.preferredName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
                        <p className="font-medium">
                          {personalInfo.dateOfBirth ? format(new Date(personalInfo.dateOfBirth), "PPP") : "Not provided"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Gender Identity</p>
                        <p className="font-medium">{personalInfo.genderIdentity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{addressInfo.homeAddress}</p>
                        <p className="font-medium">{addressInfo.city}, {addressInfo.state} {addressInfo.zipCode}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Contact Information</p>
                        <p className="font-medium">{contactInfo.primaryPhone}</p>
                        <p className="font-medium">{contactInfo.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2">Legal Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Legal Guardian</p>
                          <p className="font-medium">{legalInfo.hasGuardian ? "Yes" : "No"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Power of Attorney</p>
                          <p className="font-medium">{legalInfo.hasPOA ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 2: Eligibility & Insurance */}
              <AccordionItem value="step2" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 2: Eligibility & Insurance</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(2)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Medicaid ID</p>
                        <p className="font-medium">{insuranceInfo.medicaidId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Medicare ID</p>
                        <p className="font-medium">{insuranceInfo.medicareId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Medicaid Effective Date</p>
                        <p className="font-medium">
                          {insuranceInfo.medicaidEffectiveDate 
                            ? format(new Date(insuranceInfo.medicaidEffectiveDate), "PPP") 
                            : "Not provided"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Program Type</p>
                        <p className="font-medium">{insuranceInfo.programType}</p>
                      </div>
                    </div>

                    {insuranceInfo.insuranceRecords.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-2">Insurance Records</h4>
                        <div className="space-y-4">
                          {insuranceInfo.insuranceRecords.map((record, index) => (
                            <div key={record.id} className="p-3 border rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Insurance Carrier</p>
                                  <p className="font-medium">{record.carrier}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Member ID</p>
                                  <p className="font-medium">{record.memberId}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Group Number</p>
                                  <p className="font-medium">{record.groupNumber}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Plan Type</p>
                                  <p className="font-medium">{record.planType}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 3: Diagnoses & Clinical Evaluations */}
              <AccordionItem value="step3" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 3: Diagnoses & Clinical Evaluations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(3)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {clinicalInfo.diagnosisRecords.map((diagnosis) => (
                        <div key={diagnosis.id} className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">
                            {diagnosis.diagnosisType === "primary" ? "Primary Diagnosis" : "Secondary Diagnosis"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diagnosis Code</p>
                              <p className="font-medium">{diagnosis.code}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Description</p>
                              <p className="font-medium">{diagnosis.description}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Severity</p>
                              <p className="font-medium">{diagnosis.severity}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diagnosis Date</p>
                              <p className="font-medium">
                                {diagnosis.diagnosisDate 
                                  ? format(new Date(diagnosis.diagnosisDate), "PPP") 
                                  : "Not provided"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Functional Assessment</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Affected Domains</p>
                            <p className="font-medium">{clinicalInfo.functionalAssessment.affectedDomains.join(", ")}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">ADL Independence</p>
                            <p className="font-medium">{clinicalInfo.functionalAssessment.adlIndependent}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Cognitive Functioning</p>
                            <p className="font-medium">{clinicalInfo.functionalAssessment.cognitiveFunction}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Safety Concerns</p>
                            <p className="font-medium">
                              {clinicalInfo.functionalAssessment.hasSafetyConcerns ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {clinicalInfo.psychiatricEvaluation.hasCompleted && (
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">Psychiatric Evaluation</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Evaluated By</p>
                              <p className="font-medium">{clinicalInfo.psychiatricEvaluation.evaluatedBy}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Evaluation Date</p>
                              <p className="font-medium">
                                {clinicalInfo.psychiatricEvaluation.evalDate 
                                  ? format(new Date(clinicalInfo.psychiatricEvaluation.evalDate), "PPP") 
                                  : "Not provided"}
                              </p>
                            </div>
                            <div className="col-span-2 space-y-1">
                              <p className="text-sm text-muted-foreground">Summary</p>
                              <p className="font-medium">{clinicalInfo.psychiatricEvaluation.summary}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 4: Medical Providers */}
              <AccordionItem value="step4" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 4: Medical Providers</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(4)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Primary Care Provider</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">PCP Name</p>
                            <p className="font-medium">{medicalProvidersInfo.primaryCareProvider.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Clinic/Facility</p>
                            <p className="font-medium">{medicalProvidersInfo.primaryCareProvider.clinic}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium">{medicalProvidersInfo.primaryCareProvider.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Authorized to Share Info</p>
                            <p className="font-medium">
                              {medicalProvidersInfo.primaryCareProvider.authorizedToShare ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {medicalProvidersInfo.psychiatrist.hasBeenEvaluated && (
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">Psychiatrist</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Psychiatrist Name</p>
                              <p className="font-medium">{medicalProvidersInfo.psychiatrist.name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Evaluation Date</p>
                              <p className="font-medium">
                                {medicalProvidersInfo.psychiatrist.evalDate 
                                  ? format(new Date(medicalProvidersInfo.psychiatrist.evalDate), "PPP") 
                                  : "Not provided"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Clinic/Organization</p>
                              <p className="font-medium">{medicalProvidersInfo.psychiatrist.clinic}</p>
                            </div>
                            {medicalProvidersInfo.psychiatrist.hasDifferentEvaluator && (
                              <>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Different Evaluator Name</p>
                                  <p className="font-medium">{medicalProvidersInfo.psychiatrist.evaluator.name}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Different Evaluator Clinic</p>
                                  <p className="font-medium">{medicalProvidersInfo.psychiatrist.evaluator.clinic}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 5: Medications & Pharmacy */}
              <AccordionItem value="step5" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 5: Medications & Pharmacy</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(5)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Current Medications</h4>
                        <div className="space-y-3">
                          {medicationInfo.medications.map((medication) => (
                            <div key={medication.id} className="p-2 bg-muted/30 rounded">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Medication</p>
                                  <p className="font-medium">{medication.name}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Dosage</p>
                                  <p className="font-medium">{medication.dosage}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Frequency</p>
                                  <p className="font-medium">{medication.frequency}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Route</p>
                                  <p className="font-medium">{medication.route}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Prescribed By</p>
                                  <p className="font-medium">{medication.prescribedBy}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Start Date</p>
                                  <p className="font-medium">
                                    {medication.startDate 
                                      ? format(new Date(medication.startDate), "PPP") 
                                      : "Not provided"}
                                  </p>
                                </div>
                              </div>
                              {medication.notes && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm text-muted-foreground">Notes</p>
                                  <p className="font-medium">{medication.notes}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Allergies</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Has Allergies</p>
                            <p className="font-medium">{medicationInfo.hasAllergies ? "Yes" : "No"}</p>
                          </div>
                          {medicationInfo.hasAllergies && (
                            <>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Medication Allergies</p>
                                <p className="font-medium">{medicationInfo.allergiesList}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Reaction Description</p>
                                <p className="font-medium">{medicationInfo.allergiesReaction}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Pharmacy Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Pharmacy Name</p>
                            <p className="font-medium">{medicationInfo.pharmacyInfo.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                            <p className="font-medium">{medicationInfo.pharmacyInfo.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">{medicationInfo.pharmacyInfo.address}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Currently Used</p>
                            <p className="font-medium">
                              {medicationInfo.pharmacyInfo.isCurrentPharmacy ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 6: Referrals & Services */}
              <AccordionItem value="step6" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Network className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 6: Referrals & Services</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(6)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Treatment History</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Previous Treatment</p>
                            <p className="font-medium">
                              {referralInfo?.treatmentHistory?.hasPreviousTreatment ? "Yes" : "No"}
                            </p>
                          </div>
                          {referralInfo?.treatmentHistory?.hasPreviousTreatment && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Previous Providers</p>
                              <p className="font-medium">{referralInfo?.treatmentHistory?.previousProviders}</p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Hospitalization History</p>
                            <p className="font-medium">
                              {referralInfo?.treatmentHistory?.wasHospitalized ? "Yes" : "No"}
                            </p>
                          </div>
                          {referralInfo?.treatmentHistory?.wasHospitalized && (
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Hospitalization Details</p>
                              <p className="font-medium">{referralInfo?.treatmentHistory?.hospitalizationDetails}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">External Referrals</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">External Referrals Made</p>
                            <p className="font-medium">
                              {referralInfo?.externalReferrals?.hasExternalReferrals ? "Yes" : "No"}
                            </p>
                          </div>
                          {referralInfo?.externalReferrals?.hasExternalReferrals && (
                            <>
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Referral Types</p>
                                <p className="font-medium">
                                  {referralInfo?.externalReferrals?.referralTypes?.join(", ")}
                                  {referralInfo?.externalReferrals?.otherReferral && 
                                    `, ${referralInfo?.externalReferrals?.otherReferral}`}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Internal Service Referrals</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Services Referred To</p>
                            <p className="font-medium">
                              {referralInfo?.internalServices?.services?.join(", ")}
                              {referralInfo?.internalServices?.otherService && 
                                `, ${referralInfo?.internalServices?.otherService}`}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Preferred Service Delivery</p>
                            <p className="font-medium">{referralInfo?.internalServices?.preferredDelivery}</p>
                          </div>
                          {referralInfo?.internalServices?.preferenceNotes && (
                            <div className="col-span-2 space-y-1">
                              <p className="text-sm text-muted-foreground">Preference Notes</p>
                              <p className="font-medium">{referralInfo?.internalServices?.preferenceNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 7: Legal Forms & Consents */}
              <AccordionItem value="step7" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 7: Legal Forms & Consents</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(7)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Signed Forms</h4>
                        <div className="space-y-2">
                          {consentInfo.legalForms.map((form) => (
                            <div key={form.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>{form.title}</span>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {form.isSigned ? "Signed" : "Pending"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {consentInfo.isMinor && (
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">Minor Consent</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Parent/Guardian Consent</p>
                              <p className="font-medium">Required</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Step 8: Goals & Treatment Focus */}
              <AccordionItem value="step8" className="border rounded-xl mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Step 8: Goals & Treatment Focus</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="border-t pt-4">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(8)}
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Treatment Goals</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Client Goals</p>
                          <p className="font-medium">{treatmentInfo.treatmentGoals}</p>
                        </div>
                      </div>

                      <div className="p-3 border rounded-lg">
                        <h4 className="font-medium mb-2">Priority Areas of Concern</h4>
                        <div className="space-y-3">
                          {(treatmentInfo?.priorityAreas || [])
                            .filter((area) => area.selected)
                            .sort((a, b) => {
                              if (a.rank === null && b.rank === null) return 0
                              if (a.rank === null) return 1
                              if (b.rank === null) return -1
                              return a.rank - b.rank
                            })
                            .map((area, index) => (
                              <div key={area.id} className="flex items-center gap-2">
                                {area.rank ? (
                                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-sm font-medium">
                                    {area.rank}
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                                    •
                                  </span>
                                )}
                                <span className="font-medium">
                                  {area.isOther ? area.otherText : area.label}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {treatmentInfo.clinicalNotes && (
                        <div className="p-3 border rounded-lg">
                          <h4 className="font-medium mb-2">Clinical Notes</h4>
                          <p className="font-medium">{treatmentInfo.clinicalNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <SubmissionSection 
              isConfirmed={isConfirmed}
              signature={signature}
              isSubmissionValid={isSubmissionValid}
              onConfirmChange={setIsConfirmed}
              onSignatureChange={(value) => setSignature(value)}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
    </>
  )
} 