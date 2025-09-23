"use client"

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useIntakeFormStore } from '@/lib/store/intake-form-store'
import { getMemberById } from '@/lib/supabase/queries'

// Define the shape of our context
interface IntakeWizardContextType {
  isEditMode: boolean
  memberId: string | null
  isLoading: boolean
  error: string | null
  // We'll add more properties as needed, without modifying existing functionality
}

// Create the context with a safe default state
const IntakeWizardContext = createContext<IntakeWizardContextType | null>(null)

// Provider component
export function IntakeWizardProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const memberId = searchParams.get('id')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get access to the existing form store
  const { setFormData } = useIntakeFormStore()

  // Load member data when in edit mode
  useEffect(() => {
    async function loadMemberData() {
      if (mode === 'edit' && memberId) {
        try {
          setIsLoading(true)
          setError(null)
          
          const memberData = await getMemberById(memberId)
          
          // Map the database fields to form fields
          // This ensures we maintain the form structure while loading DB data
          setFormData('personalInfo', {
            expandedSections: {
              personal: true,
              address: false,
              contact: false,
              legal: false
            },
            fullName: memberData.full_name || '',
            preferredName: '',
            dateOfBirth: memberData.dob ? new Date(memberData.dob) : undefined,
            genderIdentity: '',
            genderIdentityOther: '',
            sexAssignedAtBirth: '',
            races: [],
            ethnicity: '',
            primaryLanguage: '',
            preferredCommunicationMethod: '',
            preferredCommunicationOther: '',
            veteranStatus: '',
            maritalStatus: '',
            ssn: '',
            photo: null,
            photoPreview: null
          })

          if (memberData.contact_email) {
            setFormData('contactInfo', {
              primaryPhone: '',
              alternatePhone: '',
              email: memberData.contact_email,
              contactPreference: '',
              emergencyContact: {
                name: '',
                relationship: '',
                phone: ''
              }
            })
          }
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load member data')
          console.error('Error loading member data:', err)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadMemberData()
  }, [mode, memberId, setFormData])

  // Safe initial state that doesn't interfere with existing code
  const contextValue: IntakeWizardContextType = {
    isEditMode: mode === 'edit',
    memberId: memberId,
    isLoading: isLoading,
    error: error
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <IntakeWizardContext.Provider value={contextValue}>
      {children}
    </IntakeWizardContext.Provider>
  )
}

// Custom hook to use the context
export function useIntakeWizard() {
  const context = useContext(IntakeWizardContext)
  if (!context) {
    throw new Error('useIntakeWizard must be used within IntakeWizardProvider')
  }
  return context
} 