/**
 * Step 1 Actions Barrel Export
 * OrbiPax Community Mental Health System
 *
 * All server actions for Step 1 of the intake wizard
 */

// Demographics actions
export {
  loadDemographicsAction,
  saveDemographicsAction
} from './demographics.actions'

// TODO: Future Step 1 sub-actions can be added here
// For example, if we split demographics into smaller sections:
// export * from './personal-info.actions'
// export * from './contact-info.actions'
// export * from './emergency-contact.actions'