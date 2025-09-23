"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  Wallet,
  FileCheck,
  CreditCard,
  FileText,
  X,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { Textarea } from "@/components/ui/textarea"
import { GovernmentCoverageSection } from "./GovernmentCoverageSection"
import { EligibilityRecordsSection } from "./EligibilityRecordsSection"
import { InsuranceRecordsSection } from "./InsuranceRecordsSection"
import { AuthorizationsSection } from "./AuthorizationsSection"

interface InsuranceRecord {
  id: string
  carrier: string
  memberId: string
  groupNumber: string
  effectiveDate: Date | undefined
  expirationDate: Date | undefined
  planType: string
  planName: string
  subscriberName: string
  relationship: string
}

interface AuthorizationRecord {
  id: string
  procedureCode: string
  procedureDescription: string
  authorizationNumber: string
  providerName: string
  startDate: Date | undefined
  expirationDate: Date | undefined
  unitsApproved: string
  unitsUsed: string
  unitsRemaining: string
}

export function IntakeStep2EligibilityInsurance() {
  const router = useRouter()

  // Get form data and actions from store
  const {
    insuranceInfo,
    setFormData,
    currentStep,
    lastEditedStep,
  } = useIntakeFormStore()

  // Initialize sections on mount - only ensure first section is open
  useEffect(() => {
    if (!insuranceInfo?.expandedSections?.government) {
      setFormData('insuranceInfo', {
        ...insuranceInfo,
        expandedSections: {
          ...insuranceInfo?.expandedSections,
          government: true
        }
      })
    }
  }, [])

  // Toggle section expansion
  const toggleSection = (section: keyof typeof insuranceInfo.expandedSections) => {
    if (!insuranceInfo.expandedSections) {
      setFormData('insuranceInfo', {
        ...insuranceInfo,
        expandedSections: {
          government: section === 'government',
          eligibility: section === 'eligibility',
          insurance: section === 'insurance',
          authorizations: section === 'authorizations'
        }
      })
      return
    }

    setFormData('insuranceInfo', {
      ...insuranceInfo,
      expandedSections: {
        ...insuranceInfo.expandedSections,
        [section]: !insuranceInfo.expandedSections[section],
      }
    })
  }

  // Update form data
  const updateInsuranceInfo = (data: Partial<typeof insuranceInfo>) => {
    setFormData('insuranceInfo', {
      ...insuranceInfo,
      ...data
    })
  }

  // Add new insurance record
  const addInsuranceRecord = () => {
    const newRecord = {
      id: Date.now().toString(),
      carrier: "",
      memberId: "",
      groupNumber: "",
      effectiveDate: undefined,
      expirationDate: undefined,
      planType: "",
      planName: "",
      subscriberName: "",
      relationship: "",
    }
    
    updateInsuranceInfo({
      insuranceRecords: [...(insuranceInfo.insuranceRecords || []), newRecord]
    })
  }

  // Remove insurance record
  const removeInsuranceRecord = (id: string) => {
    updateInsuranceInfo({
      insuranceRecords: insuranceInfo.insuranceRecords.filter((record) => record.id !== id)
    })
  }

  // Update insurance record field
  const updateInsuranceRecord = (id: string, field: keyof typeof insuranceInfo.insuranceRecords[0], value: any) => {
    updateInsuranceInfo({
      insuranceRecords: insuranceInfo.insuranceRecords.map((record) => {
        if (record.id === id) {
          return { ...record, [field]: value }
        }
        return record
      })
    })
  }

  // Add new authorization record
  const addAuthorizationRecord = () => {
    const newRecord = {
      id: Date.now().toString(),
      type: "",
      authNumber: "",
      startDate: undefined,
      endDate: undefined,
      units: "",
      notes: "",
    }
    
    updateInsuranceInfo({
      authorizationRecords: [...(insuranceInfo.authorizationRecords || []), newRecord]
    })
  }

  // Remove authorization record
  const removeAuthorizationRecord = (id: string) => {
    updateInsuranceInfo({
      authorizationRecords: insuranceInfo.authorizationRecords.filter((record) => record.id !== id)
    })
  }

  // Update authorization record field
  const updateAuthorizationRecord = (id: string, field: keyof typeof insuranceInfo.authorizationRecords[0], value: any) => {
    updateInsuranceInfo({
      authorizationRecords: insuranceInfo.authorizationRecords.map((record) => {
        if (record.id === id) {
          return { ...record, [field]: value }
        }
        return record
      })
    })
  }

  return (
    <div className="flex-1 w-full p-6">
      {/* Government Coverage Section */}
      <GovernmentCoverageSection
        onToggle={() => toggleSection("government")}
        isExpanded={insuranceInfo?.expandedSections?.government}
        lastEditedStep={lastEditedStep}
        insuranceInfo={insuranceInfo}
        updateInsuranceInfo={updateInsuranceInfo}
      />

      {/* Eligibility Records Section */}
      <EligibilityRecordsSection
        onToggle={() => toggleSection("eligibility")}
        isExpanded={insuranceInfo?.expandedSections?.eligibility}
        lastEditedStep={lastEditedStep}
        insuranceInfo={insuranceInfo}
        updateInsuranceInfo={updateInsuranceInfo}
      />

      {/* Insurance Records Section */}
      <InsuranceRecordsSection
        onToggle={() => toggleSection("insurance")}
        isExpanded={insuranceInfo?.expandedSections?.insurance}
        lastEditedStep={lastEditedStep}
        insuranceInfo={insuranceInfo}
        updateInsuranceInfo={updateInsuranceInfo}
        onAddRecord={addInsuranceRecord}
        onRemoveRecord={removeInsuranceRecord}
        onUpdateRecord={updateInsuranceRecord}
      />

      {/* Authorizations Section */}
      <AuthorizationsSection
        onToggle={() => toggleSection("authorizations")}
        isExpanded={insuranceInfo?.expandedSections?.authorizations}
        lastEditedStep={lastEditedStep}
        insuranceInfo={insuranceInfo}
        updateInsuranceInfo={updateInsuranceInfo}
        onAddRecord={addAuthorizationRecord}
        onRemoveRecord={removeAuthorizationRecord}
        onUpdateRecord={updateAuthorizationRecord}
      />
    </div>
  )
}