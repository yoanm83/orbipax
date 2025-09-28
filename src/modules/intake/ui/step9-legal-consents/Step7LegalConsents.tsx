'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Check, ChevronDown, ChevronUp, Eye, FileText } from "lucide-react"
import { useState } from "react"
import { useForm } from 'react-hook-form'

import { legalConsentsSchema, type LegalConsents } from "@/modules/intake/domain/schemas/step9-legal-consents/legalConsents.schema"
import { Alert, AlertDescription } from "@/shared/ui/primitives/Alert"
import { Badge } from "@/shared/ui/primitives/Badge"
import { Button } from "@/shared/ui/primitives/Button"
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"

// Mock data for legal forms (UI only - no business logic)
const LEGAL_FORMS_DATA = [
  {
    id: "hipaa",
    title: "HIPAA Notice of Privacy Practices",
    description: "This form explains how your medical information may be used and disclosed and how you can get access to this information.",
    isRequired: true,
  },
  {
    id: "consent-treatment",
    title: "Consent for Treatment",
    description: "This form provides your consent to receive mental health services from our agency and acknowledges the risks and benefits of treatment.",
    isRequired: true,
  },
  {
    id: "financial",
    title: "Financial Responsibility Agreement",
    description: "This form outlines your financial responsibilities for services provided, including insurance billing and payment policies.",
    isRequired: true,
  },
  {
    id: "telehealth",
    title: "Telehealth Consent",
    description: "This form provides your consent to receive services via telehealth and outlines the technology requirements and limitations.",
    isRequired: true,
  },
  {
    id: "roi",
    title: "Release of Information (ROI)",
    description: "This form authorizes our agency to share your protected health information with specified individuals or organizations.",
    isRequired: false,
  },
]

/**
 * Step 7: Legal Forms & Consents
 * Connected to domain schema with validation
 */
export function Step7LegalConsents() {
  // React Hook Form with Zod validation
  const {
    register,
    watch,
    formState: { errors },
    setValue,
    trigger,
    getValues
  } = useForm<LegalConsents>({
    resolver: zodResolver(legalConsentsSchema),
    defaultValues: {
      isMinor: false,
      authorizedToShareWithPCP: false,
      hipaa: { isRead: false, signature: '', guardianSignature: '' },
      consentTreatment: { isRead: false, signature: '', guardianSignature: '' },
      financial: { isRead: false, signature: '', guardianSignature: '' },
      telehealth: { isRead: false, signature: '', guardianSignature: '' },
      roi: { isRead: false, signature: '', guardianSignature: '' }
    }
  })

  // Watch form values for conditional rendering
  const isMinor = watch('isMinor')
  const authorizedToShareWithPCP = watch('authorizedToShareWithPCP')
  const formValues = watch()

  // Local UI state for collapsibles (not part of form data)
  const [isMainExpanded, setIsMainExpanded] = useState(true)
  const [expandedForms, setExpandedForms] = useState<Record<string, boolean>>({})

  // Toggle individual form expansion
  const toggleFormExpansion = (formId: string) => {
    setExpandedForms(prev => ({
      ...prev,
      [formId]: !prev[formId]
    }))
  }

  // Map form IDs to typed keys
  const getFormKey = (formId: string): keyof LegalConsents => {
    const mapping: Record<string, keyof LegalConsents> = {
      'hipaa': 'hipaa',
      'consent-treatment': 'consentTreatment',
      'financial': 'financial',
      'telehealth': 'telehealth',
      'roi': 'roi'
    }
    return mapping[formId] as keyof LegalConsents
  }

  // Check if a form is signed (has signature)
  const isFormSigned = (formId: string) => {
    const formKey = getFormKey(formId)
    const form = formValues[formKey]
    return form && typeof form === 'object' && 'signature' in form && form.signature && form.signature.trim() !== ''
  }

  // Check if all required forms are signed
  const areAllRequiredFormsSigned = () => {
    const requiredForms = ['hipaa', 'consentTreatment', 'financial', 'telehealth']
    const roiRequired = authorizedToShareWithPCP

    const allRequired = requiredForms.every(formKey => {
      const form = formValues[formKey as keyof LegalConsents]
      return form && typeof form === 'object' &&
             'isRead' in form && form.isRead === true &&
             'signature' in form && form.signature && form.signature.trim() !== ''
    })

    if (roiRequired) {
      const roiForm = formValues.roi
      return allRequired && roiForm.isRead === true && roiForm.signature && roiForm.signature.trim() !== ''
    }

    return allRequired
  }

  return (
    <div className="flex-1 w-full">
      <div className="p-6">
        {/* Main Legal Forms Card */}
        <Card className="w-full rounded-3xl shadow-md">
          <button
            type="button"
            className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px] border-b border-[var(--border)] w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
            onClick={() => setIsMainExpanded(!isMainExpanded)}
            aria-expanded={isMainExpanded}
            aria-controls="legal-forms-panel"
            id="legal-forms-button"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                Required Legal Forms
              </h2>
            </div>
            {isMainExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {isMainExpanded && (
            <CardBody id="legal-forms-panel" className="p-6">
              <div className="space-y-6">
                {/* Client Type Section */}
                <div className="flex items-center space-x-4 mb-6 p-4 bg-[var(--muted)]/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isMinor"
                      checked={isMinor}
                      onCheckedChange={(checked) => {
                        setValue('isMinor', !!checked)
                        trigger()
                      }}
                    />
                    <Label htmlFor="isMinor" className="font-normal">
                      Client is a minor
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="authorizedToShareWithPCP"
                      checked={authorizedToShareWithPCP}
                      onCheckedChange={(checked) => {
                        setValue('authorizedToShareWithPCP', !!checked)
                        trigger()
                      }}
                    />
                    <Label htmlFor="authorizedToShareWithPCP" className="font-normal">
                      Authorized to share with PCP
                    </Label>
                  </div>
                </div>

                {/* Legal Forms List */}
                {LEGAL_FORMS_DATA.map((form) => {
                  const formKey = getFormKey(form.id)
                  const formData = formValues[formKey]
                  const formErrors = errors[formKey]
                  const isSigned = isFormSigned(form.id)

                  return (
                  <div
                    key={form.id}
                    className={`border rounded-lg overflow-hidden ${
                      isSigned
                        ? 'border-[var(--success)] bg-[var(--success)]/5'
                        : 'border-[var(--border)]'
                    } ${!form.isRequired && !authorizedToShareWithPCP ? 'opacity-70' : ''}`}
                  >
                    {/* Form Header */}
                    <button
                      type="button"
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[var(--muted)]/10 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 rounded-lg"
                      onClick={() => toggleFormExpansion(form.id)}
                      aria-expanded={expandedForms[form.id]}
                      aria-controls={`form-panel-${form.id}`}
                      id={`form-button-${form.id}`}
                    >
                      <div className="flex items-center gap-3">
                        {isSigned ? (
                          <div className="h-6 w-6 rounded-full bg-[var(--success)] flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-[var(--border)]" />
                        )}
                        <div>
                          <h3 className="font-medium text-[var(--foreground)]">
                            {form.title}
                            {form.isRequired && <span className="text-[var(--destructive)] ml-1">*</span>}
                          </h3>
                          <p className="text-sm text-[var(--muted-foreground)]">{form.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={isSigned ? "default" : "outline"}
                          className={`min-w-[70px] justify-center ${
                            isSigned
                              ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]'
                              : form.isRequired
                                ? 'border-[var(--warning)] text-[var(--warning)]'
                                : 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]'
                          }`}
                        >
                          {isSigned ? "Signed" : form.isRequired || (form.id === 'roi' && authorizedToShareWithPCP) ? "Required" : "Optional"}
                        </Badge>
                        {expandedForms[form.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </button>

                    {/* Form Expanded Content */}
                    {expandedForms[form.id] && (
                      <div id={`form-panel-${form.id}`} className="p-4 border-t border-[var(--border)]">
                        <div className="space-y-4">
                          {/* View Document Button and Read Checkbox */}
                          <div className="flex justify-between items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => {
                                // TODO: Implement document viewing functionality
                                // This will connect to document service in the future
                              }}
                            >
                              <Eye className="h-4 w-4" /> View Document
                            </Button>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`read-${form.id}`}
                                checked={formData && typeof formData === 'object' && 'isRead' in formData && formData.isRead || false}
                                onCheckedChange={(checked) => {
                                  if (formKey === 'hipaa') {
                                    setValue('hipaa.isRead', !!checked)
                                    trigger('hipaa.isRead')
                                  } else if (formKey === 'consentTreatment') {
                                    setValue('consentTreatment.isRead', !!checked)
                                    trigger('consentTreatment.isRead')
                                  } else if (formKey === 'financial') {
                                    setValue('financial.isRead', !!checked)
                                    trigger('financial.isRead')
                                  } else if (formKey === 'telehealth') {
                                    setValue('telehealth.isRead', !!checked)
                                    trigger('telehealth.isRead')
                                  } else if (formKey === 'roi') {
                                    setValue('roi.isRead', !!checked)
                                    trigger('roi.isRead')
                                  }
                                }}
                                aria-required={form.isRequired || (form.id === 'roi' && authorizedToShareWithPCP) ? "true" : "false"}
                                aria-invalid={formErrors && 'isRead' in formErrors ? "true" : "false"}
                                aria-describedby={formErrors && 'isRead' in formErrors ? `${form.id}-read-error` : undefined}
                              />
                              <Label htmlFor={`read-${form.id}`} className="font-normal text-sm">
                                I have read and understand this form
                                {(form.isRequired || (form.id === 'roi' && authorizedToShareWithPCP)) && <span className="text-[var(--destructive)]">*</span>}
                              </Label>
                            </div>
                            {formErrors && 'isRead' in formErrors && formErrors.isRead && (
                              <p id={`${form.id}-read-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                                {typeof formErrors.isRead === 'object' && 'message' in formErrors.isRead ? formErrors.isRead.message : ''}
                              </p>
                            )}
                          </div>

                          {/* Signature Section */}
                          <div className="space-y-4">
                            {/* Client Signature */}
                            <div className="space-y-2">
                              <Label htmlFor={`signature-${form.id}`}>
                                {isMinor ? "Minor's Signature (if applicable)" : "Client Signature"}
                                {!isMinor && <span className="text-[var(--destructive)]">*</span>}
                              </Label>
                              {formKey === 'hipaa' && (
                                <Input
                                  id={`signature-${form.id}`}
                                  type="text"
                                  placeholder="Type your full name as signature"
                                  {...register('hipaa.signature')}
                                  className="max-w-md"
                                  aria-required={!isMinor}
                                  aria-invalid={errors.hipaa?.signature ? "true" : "false"}
                                  aria-describedby={errors.hipaa?.signature ? `${form.id}-signature-error` : undefined}
                                />
                              )}
                              {formKey === 'consentTreatment' && (
                                <Input
                                  id={`signature-${form.id}`}
                                  type="text"
                                  placeholder="Type your full name as signature"
                                  {...register('consentTreatment.signature')}
                                  className="max-w-md"
                                  aria-required={!isMinor}
                                  aria-invalid={errors.consentTreatment?.signature ? "true" : "false"}
                                  aria-describedby={errors.consentTreatment?.signature ? `${form.id}-signature-error` : undefined}
                                />
                              )}
                              {formKey === 'financial' && (
                                <Input
                                  id={`signature-${form.id}`}
                                  type="text"
                                  placeholder="Type your full name as signature"
                                  {...register('financial.signature')}
                                  className="max-w-md"
                                  aria-required={!isMinor}
                                  aria-invalid={errors.financial?.signature ? "true" : "false"}
                                  aria-describedby={errors.financial?.signature ? `${form.id}-signature-error` : undefined}
                                />
                              )}
                              {formKey === 'telehealth' && (
                                <Input
                                  id={`signature-${form.id}`}
                                  type="text"
                                  placeholder="Type your full name as signature"
                                  {...register('telehealth.signature')}
                                  className="max-w-md"
                                  aria-required={!isMinor}
                                  aria-invalid={errors.telehealth?.signature ? "true" : "false"}
                                  aria-describedby={errors.telehealth?.signature ? `${form.id}-signature-error` : undefined}
                                />
                              )}
                              {formKey === 'roi' && (
                                <Input
                                  id={`signature-${form.id}`}
                                  type="text"
                                  placeholder="Type your full name as signature"
                                  {...register('roi.signature')}
                                  className="max-w-md"
                                  aria-required={form.id === 'roi' && authorizedToShareWithPCP}
                                  aria-invalid={errors.roi?.signature ? "true" : "false"}
                                  aria-describedby={errors.roi?.signature ? `${form.id}-signature-error` : undefined}
                                />
                              )}
                              <p className="text-sm text-[var(--muted-foreground)]">
                                By typing your name, you agree to the terms of this form
                              </p>
                              {formKey === 'hipaa' && errors.hipaa?.signature && (
                                <p id={`${form.id}-signature-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                  {errors.hipaa.signature.message}
                                </p>
                              )}
                              {formKey === 'consentTreatment' && errors.consentTreatment?.signature && (
                                <p id={`${form.id}-signature-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                  {errors.consentTreatment.signature.message}
                                </p>
                              )}
                              {formKey === 'financial' && errors.financial?.signature && (
                                <p id={`${form.id}-signature-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                  {errors.financial.signature.message}
                                </p>
                              )}
                              {formKey === 'telehealth' && errors.telehealth?.signature && (
                                <p id={`${form.id}-signature-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                  {errors.telehealth.signature.message}
                                </p>
                              )}
                              {formKey === 'roi' && errors.roi?.signature && (
                                <p id={`${form.id}-signature-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                  {errors.roi.signature.message}
                                </p>
                              )}
                            </div>

                            {/* Guardian Signature for minors */}
                            {isMinor && (
                              <div className="space-y-2">
                                <Label htmlFor={`guardian-signature-${form.id}`}>
                                  Parent/Guardian Signature<span className="text-[var(--destructive)]">*</span>
                                </Label>
                                {formKey === 'hipaa' && (
                                  <Input
                                    id={`guardian-signature-${form.id}`}
                                    type="text"
                                    placeholder="Type parent/guardian full name as signature"
                                    {...register('hipaa.guardianSignature')}
                                    className="max-w-md"
                                    aria-required="true"
                                    aria-invalid={errors.hipaa?.guardianSignature ? "true" : "false"}
                                    aria-describedby={errors.hipaa?.guardianSignature ? `${form.id}-guardian-error` : undefined}
                                  />
                                )}
                                {formKey === 'consentTreatment' && (
                                  <Input
                                    id={`guardian-signature-${form.id}`}
                                    type="text"
                                    placeholder="Type parent/guardian full name as signature"
                                    {...register('consentTreatment.guardianSignature')}
                                    className="max-w-md"
                                    aria-required="true"
                                    aria-invalid={errors.consentTreatment?.guardianSignature ? "true" : "false"}
                                    aria-describedby={errors.consentTreatment?.guardianSignature ? `${form.id}-guardian-error` : undefined}
                                  />
                                )}
                                {formKey === 'financial' && (
                                  <Input
                                    id={`guardian-signature-${form.id}`}
                                    type="text"
                                    placeholder="Type parent/guardian full name as signature"
                                    {...register('financial.guardianSignature')}
                                    className="max-w-md"
                                    aria-required="true"
                                    aria-invalid={errors.financial?.guardianSignature ? "true" : "false"}
                                    aria-describedby={errors.financial?.guardianSignature ? `${form.id}-guardian-error` : undefined}
                                  />
                                )}
                                {formKey === 'telehealth' && (
                                  <Input
                                    id={`guardian-signature-${form.id}`}
                                    type="text"
                                    placeholder="Type parent/guardian full name as signature"
                                    {...register('telehealth.guardianSignature')}
                                    className="max-w-md"
                                    aria-required="true"
                                    aria-invalid={errors.telehealth?.guardianSignature ? "true" : "false"}
                                    aria-describedby={errors.telehealth?.guardianSignature ? `${form.id}-guardian-error` : undefined}
                                  />
                                )}
                                {formKey === 'roi' && (
                                  <Input
                                    id={`guardian-signature-${form.id}`}
                                    type="text"
                                    placeholder="Type parent/guardian full name as signature"
                                    {...register('roi.guardianSignature')}
                                    className="max-w-md"
                                    aria-required={form.id === 'roi' && authorizedToShareWithPCP ? "true" : "false"}
                                    aria-invalid={errors.roi?.guardianSignature ? "true" : "false"}
                                    aria-describedby={errors.roi?.guardianSignature ? `${form.id}-guardian-error` : undefined}
                                  />
                                )}
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  By typing your name, you agree to the terms of this form on behalf of the minor
                                </p>
                                {formKey === 'hipaa' && errors.hipaa?.guardianSignature && (
                                  <p id={`${form.id}-guardian-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                    {errors.hipaa.guardianSignature.message}
                                  </p>
                                )}
                                {formKey === 'consentTreatment' && errors.consentTreatment?.guardianSignature && (
                                  <p id={`${form.id}-guardian-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                    {errors.consentTreatment.guardianSignature.message}
                                  </p>
                                )}
                                {formKey === 'financial' && errors.financial?.guardianSignature && (
                                  <p id={`${form.id}-guardian-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                    {errors.financial.guardianSignature.message}
                                  </p>
                                )}
                                {formKey === 'telehealth' && errors.telehealth?.guardianSignature && (
                                  <p id={`${form.id}-guardian-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                    {errors.telehealth.guardianSignature.message}
                                  </p>
                                )}
                                {formKey === 'roi' && errors.roi?.guardianSignature && (
                                  <p id={`${form.id}-guardian-error`} role="alert" className="text-sm text-[var(--destructive)]">
                                    {errors.roi.guardianSignature.message}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Date of signature */}
                            <div className="text-sm text-[var(--muted-foreground)]">
                              Date: {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )})}

                {/* Form Status Alert */}
                {!areAllRequiredFormsSigned() && (
                  <Alert className="border-[var(--warning)] bg-[var(--warning)]/10">
                    <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />
                    <AlertDescription className="text-[var(--foreground)]">
                      All required forms must be read and signed before proceeding to the next step.
                      {isMinor && " Each form must be signed by both the client and guardian."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  )
}