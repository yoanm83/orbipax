/**
 * Compatibility layer for restored Step 2 and Step 3 components
 * This provides a minimal interface to keep the original components working
 * without complex refactoring to the new state management system
 */

import { create } from 'zustand'

interface InsuranceInfo {
  expandedSections?: {
    government?: boolean
    eligibility?: boolean
    insurance?: boolean
    authorizations?: boolean
  }
  insuranceRecords?: any[]
  authorizationRecords?: any[]
  [key: string]: any
}

interface ClinicalInfo {
  expandedSections: {
    diagnoses: boolean
    psychiatric: boolean
    functional: boolean
  }
  [key: string]: any
}

interface IntakeFormStore {
  insuranceInfo: InsuranceInfo
  clinicalInfo: ClinicalInfo
  currentStep: number
  lastEditedStep: number
  setFormData: (section: string, data: any) => void
}

export const useIntakeFormStore = create<IntakeFormStore>((set) => ({
  insuranceInfo: {
    expandedSections: {
      government: true,
      eligibility: false,
      insurance: false,
      authorizations: false
    },
    insuranceRecords: [],
    authorizationRecords: []
  },
  clinicalInfo: {
    expandedSections: {
      diagnoses: true,
      psychiatric: false,
      functional: false
    }
  },
  currentStep: 1,
  lastEditedStep: 0,
  setFormData: (section: string, data: any) =>
    set((state) => ({
      ...state,
      [section]: data
    }))
}))