"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { DEFAULT_LEGAL_FORMS } from "./constants/default-legal-forms"
import { ClientTypeSection } from "./ClientTypeSection"
import { LegalFormCard } from "./LegalFormCard"
import { FormStatusAlert } from "./FormStatusAlert"

export function IntakeWizardStep7LegalFormsConsents() {
  const today = new Date()
  const { consentInfo, setFormData } = useIntakeFormStore()

  // Initialize legal forms if they don't exist
  useEffect(() => {
    if (!consentInfo.legalForms || consentInfo.legalForms.length === 0) {
      setFormData('consentInfo', {
        ...consentInfo,
        legalForms: DEFAULT_LEGAL_FORMS
      })
    }
  }, [])

  // Toggle form expansion
  const toggleFormExpansion = (id: string) => {
    const updatedForms = consentInfo.legalForms.map((form) => {
      if (form.id === id) {
        return { ...form, isExpanded: !form.isExpanded }
      }
      return form
    })
    setFormData('consentInfo', {
      ...consentInfo,
      legalForms: updatedForms
    })
  }

  // Mark form as read
  const markFormAsRead = (id: string, isRead: boolean) => {
    const updatedForms = consentInfo.legalForms.map((form) => {
      if (form.id === id) {
        return { ...form, isRead }
      }
      return form
    })
    setFormData('consentInfo', {
      ...consentInfo,
      legalForms: updatedForms
    })
  }

  // Update signature
  const updateSignature = (id: string, signature: string) => {
    const updatedForms = consentInfo.legalForms.map((form) => {
      if (form.id === id) {
        return {
          ...form,
          signature,
          isSigned: signature.trim() !== "",
          signatureDate: signature.trim() !== "" ? today : null,
        }
      }
      return form
    })
    setFormData('consentInfo', {
      ...consentInfo,
      legalForms: updatedForms
    })
  }

  // Update guardian signature
  const updateGuardianSignature = (id: string, guardianSignature: string) => {
    const updatedForms = consentInfo.legalForms.map((form) => {
      if (form.id === id) {
        return {
          ...form,
          guardianSignature,
          isSigned: consentInfo.isMinor ? guardianSignature.trim() !== "" && form.signature.trim() !== "" : form.isSigned,
        }
      }
      return form
    })
    setFormData('consentInfo', {
      ...consentInfo,
      legalForms: updatedForms
    })
  }

  // Check if all required forms are signed
  const areAllRequiredFormsSigned = () => {
    return consentInfo.legalForms.filter((form) => form.isRequired).every((form) => form.isSigned && form.isRead)
  }

  // Simulate loading a document
  const viewDocument = (formId: string) => {
    alert(`Opening ${formId} document for preview...`)
  }

  return (
    <div className="flex-1 w-full p-6">
      {/* Legal Forms Section */}
      <Card className="w-full rounded-2xl shadow-md mb-6">
        <div
          className="p-6 border-b flex justify-between items-center cursor-pointer"
          onClick={() => setFormData('consentInfo', { 
            ...consentInfo,
            isFormsExpanded: !consentInfo.isFormsExpanded 
          })}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Required Legal Forms</h2>
          </div>
          {consentInfo.isFormsExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>

        {consentInfo.isFormsExpanded && (
          <CardContent className="p-6">
            <div className="space-y-6">
              <ClientTypeSection />

              {/* Forms Checklist */}
              {(consentInfo?.legalForms ?? []).map((form) => (
                <LegalFormCard
                  key={form.id}
                  form={form}
                  isMinor={consentInfo.isMinor}
                  onToggleExpansion={() => toggleFormExpansion(form.id)}
                  onMarkAsRead={(isRead) => markFormAsRead(form.id, isRead)}
                  onSignatureChange={(signature) => updateSignature(form.id, signature)}
                  onGuardianSignatureChange={(signature) => updateGuardianSignature(form.id, signature)}
                  onViewDocument={() => viewDocument(form.id)}
                />
              ))}

              <FormStatusAlert
                isMinor={consentInfo.isMinor}
                areAllRequiredFormsSigned={areAllRequiredFormsSigned()}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
