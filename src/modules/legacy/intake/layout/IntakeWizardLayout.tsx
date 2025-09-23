"use client"

import { type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { IntakeWizardNavigation } from "./IntakeWizardNavigation"
import { IntakeWizardProvider } from "./IntakeWizardProvider"

interface IntakeWizardLayoutProps {
  children: ReactNode
}

export function IntakeWizardLayout({ children }: IntakeWizardLayoutProps) {
  const router = useRouter()

  return (
    <IntakeWizardProvider>
      <div className="flex w-full min-h-screen bg-[#F5F7FA]">
        <Sidebar />
        <div className="flex-1">
          {children}
          <IntakeWizardNavigation />
        </div>
      </div>
    </IntakeWizardProvider>
  )
} 