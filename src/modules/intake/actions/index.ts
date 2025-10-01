/**
 * Intake Actions Barrel Export
 * OrbiPax Community Mental Health System
 *
 * Central export point for all intake server actions
 * Organized by step for better modularity
 */

// Step 1 - Demographics and Basic Information
export * from './step1'

// Step 2 - Insurance and Eligibility
export * from './step2'

// Step 3 - Diagnoses and Clinical Evaluation
export * from './step3'

// TODO: Future step exports with folder structure
// export * from './step4' // Medical Providers
// export * from './step5' // Medications
// export * from './step6' // Referrals
// export * from './step7' // Legal Forms
// export * from './step8' // Goals
// export * from './step9' // Review