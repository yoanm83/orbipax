/**
 * Step 1 Demographics - Barrel Exports
 * OrbiPax Community Mental Health (CMH) System
 *
 * Public API for demographics step components
 * Clean exports following SoC boundaries
 */

// =================================================================
// MAIN COMPONENT EXPORT
// =================================================================

export { IntakeWizardStep1Demographics } from './components/intake-wizard-step1-demographics'

// =================================================================
// SUB-COMPONENTS EXPORTS
// =================================================================

export { PersonalInfoSection } from './components/PersonalInfoSection'
export { AddressSection } from './components/AddressSection'
export { ContactSection } from './components/ContactSection'
export { LegalSection } from './components/LegalSection'

// =================================================================
// PAGE COMPONENT - REMOVED (Legacy from copied project)
// Pages belong in /app directory per Next.js 14 App Router
// =================================================================

// export { default as DemographicsPage } from './page'  // LEGACY REMOVED