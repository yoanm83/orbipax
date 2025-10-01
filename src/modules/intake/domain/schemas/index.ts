/**
 * Domain Schemas Barrel Export
 * OrbiPax Community Mental Health System
 *
 * Central export point for all domain schemas
 * SoC: Validation only - NO business logic
 */

// Demographics - Canonical nested location
export * from './demographics/demographics.schema'

// Insurance & Eligibility - Canonical nested location
export * from './insurance-eligibility'

// Diagnoses & Clinical Assessment - Canonical nested location
export * from './diagnoses-clinical'

// Medical Providers - Canonical nested location
export * from './medical-providers'

// Other schemas remain as-is for now
export * from './insurance.schema'

// NOTE: The root demographics.schema.ts is deprecated and should not be exported
// It will be removed in a future migration task