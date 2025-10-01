/**
 * Insurance & Eligibility Schema Exports
 * OrbiPax Community Mental Health (CMH) System
 *
 * Centralized exports for insurance and eligibility validation schemas
 */

export {
  // Schema exports
  insuranceCoverageSchema,
  eligibilityCriteriaSchema,
  financialInformationSchema,
  insuranceEligibilityDataSchema,
  insuranceSubmissionSchema,

  // Validation helper functions
  validateInsuranceEligibility,  // New canonical validation function
  validateInsuranceStep,
  validateInsuranceSubmission,
  calculateFPLPercentage,
  determineSlideScale,

  // Type exports
  type InsuranceCoverage,
  type EligibilityCriteria,
  type FinancialInformation,
  type InsuranceEligibilityData,
  type InsuranceEligibility,  // New canonical type export
  type InsuranceSubmission
} from './insurance-eligibility.schema'