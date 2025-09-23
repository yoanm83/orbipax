"use client"

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Define the shape of our context
interface IntakeWizardContextType {
  isEditMode: boolean
  memberId: string | null
  isLoading: boolean
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

  // Safe initial state that doesn't interfere with existing code
  const contextValue: IntakeWizardContextType = {
    isEditMode: mode === 'edit',
    memberId: memberId,
    isLoading: isLoading,
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