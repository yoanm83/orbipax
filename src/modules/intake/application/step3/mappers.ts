/**
 * Clinical Assessment Mappers for Step 3
 * OrbiPax Intake Module - Application Layer
 *
 * Maps between DTOs and domain models.
 * Handles data transformations without business logic.
 *
 * SoC: Application layer mapping - bridges DTOs and domain
 * Pattern: Pure mapping functions, no side effects
 */

import {
  type Step3Data,
  type Step3DataPartial,
  type DiagnosisRecord,
  type Diagnoses,
  type PsychiatricEvaluation,
  type FunctionalAssessment
} from '@/modules/intake/domain/schemas/diagnoses-clinical'

import {
  type Step3InputDTO,
  type Step3OutputDTO,
  type DiagnosisRecordDTO,
  type DiagnosesDTO,
  type PsychiatricEvaluationDTO,
  type FunctionalAssessmentDTO
} from './dtos'

// =================================================================
// DIAGNOSIS RECORD MAPPERS
// =================================================================

/**
 * Map diagnosis record DTO to domain model
 */
function diagnosisRecordToDomain(dto: DiagnosisRecordDTO): DiagnosisRecord {
  return {
    code: dto.code,
    description: dto.description,
    diagnosisType: dto.diagnosisType as DiagnosisRecord['diagnosisType'],
    severity: dto.severity as DiagnosisRecord['severity'],
    diagnosisDate: dto.diagnosisDate,
    onsetDate: dto.onsetDate,
    verifiedBy: dto.verifiedBy,
    isBillable: dto.isBillable ?? false,
    notes: dto.notes
  }
}

/**
 * Map diagnosis record domain to DTO
 */
function diagnosisRecordToDTO(domain: DiagnosisRecord): DiagnosisRecordDTO {
  return {
    code: domain.code,
    description: domain.description,
    diagnosisType: domain.diagnosisType,
    severity: domain.severity,
    diagnosisDate: domain.diagnosisDate,
    ...(domain.onsetDate !== undefined && { onsetDate: domain.onsetDate }),
    ...(domain.verifiedBy !== undefined && { verifiedBy: domain.verifiedBy }),
    ...(domain.isBillable !== undefined && { isBillable: domain.isBillable }),
    ...(domain.notes !== undefined && { notes: domain.notes })
  }
}

// =================================================================
// DIAGNOSES SECTION MAPPERS
// =================================================================

/**
 * Map diagnoses DTO to domain model
 */
function diagnosesToDomain(dto: DiagnosesDTO): Diagnoses {
  return {
    primaryDiagnosis: dto.primaryDiagnosis,
    secondaryDiagnoses: dto.secondaryDiagnoses || [],
    substanceUseDisorder: dto.substanceUseDisorder as Diagnoses['substanceUseDisorder'],
    mentalHealthHistory: dto.mentalHealthHistory,
    diagnosisRecords: dto.diagnosisRecords.map(diagnosisRecordToDomain)
  }
}

/**
 * Map diagnoses domain to DTO
 */
function diagnosesToDTO(domain: Diagnoses): DiagnosesDTO {
  return {
    ...(domain.primaryDiagnosis !== undefined && { primaryDiagnosis: domain.primaryDiagnosis }),
    secondaryDiagnoses: domain.secondaryDiagnoses,
    ...(domain.substanceUseDisorder !== undefined && { substanceUseDisorder: domain.substanceUseDisorder }),
    ...(domain.mentalHealthHistory !== undefined && { mentalHealthHistory: domain.mentalHealthHistory }),
    diagnosisRecords: domain.diagnosisRecords.map(diagnosisRecordToDTO)
  }
}

// =================================================================
// PSYCHIATRIC EVALUATION MAPPERS
// =================================================================

/**
 * Map psychiatric evaluation DTO to domain model
 */
function psychiatricEvaluationToDomain(dto: PsychiatricEvaluationDTO): PsychiatricEvaluation {
  return {
    currentSymptoms: dto.currentSymptoms || [],
    severityLevel: dto.severityLevel as PsychiatricEvaluation['severityLevel'],
    suicidalIdeation: dto.suicidalIdeation,
    homicidalIdeation: dto.homicidalIdeation,
    psychoticSymptoms: dto.psychoticSymptoms,
    medicationCompliance: dto.medicationCompliance as PsychiatricEvaluation['medicationCompliance'],
    treatmentHistory: dto.treatmentHistory,
    hasPsychEval: dto.hasPsychEval || false,
    evaluationDate: dto.evaluationDate,
    evaluatedBy: dto.evaluatedBy,
    evaluationSummary: dto.evaluationSummary
  }
}

/**
 * Map psychiatric evaluation domain to DTO
 */
function psychiatricEvaluationToDTO(domain: PsychiatricEvaluation): PsychiatricEvaluationDTO {
  return {
    currentSymptoms: domain.currentSymptoms,
    ...(domain.severityLevel !== undefined && { severityLevel: domain.severityLevel }),
    ...(domain.suicidalIdeation !== undefined && { suicidalIdeation: domain.suicidalIdeation }),
    ...(domain.homicidalIdeation !== undefined && { homicidalIdeation: domain.homicidalIdeation }),
    ...(domain.psychoticSymptoms !== undefined && { psychoticSymptoms: domain.psychoticSymptoms }),
    ...(domain.medicationCompliance !== undefined && { medicationCompliance: domain.medicationCompliance }),
    ...(domain.treatmentHistory !== undefined && { treatmentHistory: domain.treatmentHistory }),
    hasPsychEval: domain.hasPsychEval,
    ...(domain.evaluationDate !== undefined && { evaluationDate: domain.evaluationDate }),
    ...(domain.evaluatedBy !== undefined && { evaluatedBy: domain.evaluatedBy }),
    ...(domain.evaluationSummary !== undefined && { evaluationSummary: domain.evaluationSummary })
  }
}

// =================================================================
// FUNCTIONAL ASSESSMENT MAPPERS
// =================================================================

/**
 * Map functional assessment DTO to domain model
 */
function functionalAssessmentToDomain(dto: FunctionalAssessmentDTO): FunctionalAssessment {
  return {
    affectedDomains: dto.affectedDomains as FunctionalAssessment['affectedDomains'],
    adlsIndependence: dto.adlsIndependence as FunctionalAssessment['adlsIndependence'],
    iadlsIndependence: dto.iadlsIndependence as FunctionalAssessment['iadlsIndependence'],
    cognitiveFunctioning: dto.cognitiveFunctioning as FunctionalAssessment['cognitiveFunctioning'],
    hasSafetyConcerns: dto.hasSafetyConcerns || false,
    globalFunctioning: dto.globalFunctioning,
    dailyLivingActivities: dto.dailyLivingActivities || [],
    socialFunctioning: dto.socialFunctioning as FunctionalAssessment['socialFunctioning'],
    occupationalFunctioning: dto.occupationalFunctioning as FunctionalAssessment['occupationalFunctioning'],
    cognitiveStatus: dto.cognitiveStatus as FunctionalAssessment['cognitiveStatus'],
    adaptiveBehavior: dto.adaptiveBehavior,
    additionalNotes: dto.additionalNotes
  }
}

/**
 * Map functional assessment domain to DTO
 */
function functionalAssessmentToDTO(domain: FunctionalAssessment): FunctionalAssessmentDTO {
  return {
    affectedDomains: domain.affectedDomains,
    adlsIndependence: domain.adlsIndependence,
    iadlsIndependence: domain.iadlsIndependence,
    cognitiveFunctioning: domain.cognitiveFunctioning,
    hasSafetyConcerns: domain.hasSafetyConcerns,
    ...(domain.globalFunctioning !== undefined && { globalFunctioning: domain.globalFunctioning }),
    dailyLivingActivities: domain.dailyLivingActivities,
    ...(domain.socialFunctioning !== undefined && { socialFunctioning: domain.socialFunctioning }),
    ...(domain.occupationalFunctioning !== undefined && { occupationalFunctioning: domain.occupationalFunctioning }),
    ...(domain.cognitiveStatus !== undefined && { cognitiveStatus: domain.cognitiveStatus }),
    ...(domain.adaptiveBehavior !== undefined && { adaptiveBehavior: domain.adaptiveBehavior }),
    ...(domain.additionalNotes !== undefined && { additionalNotes: domain.additionalNotes })
  }
}

// =================================================================
// COMPOSITE MAPPERS
// =================================================================

/**
 * Map Step3 input DTO to domain model (partial)
 */
export function toPartialDomain(dto: Step3InputDTO): Step3DataPartial {
  return {
    diagnoses: dto.diagnoses ? diagnosesToDomain(dto.diagnoses) : undefined,
    psychiatricEvaluation: dto.psychiatricEvaluation ?
      psychiatricEvaluationToDomain(dto.psychiatricEvaluation) : undefined,
    functionalAssessment: dto.functionalAssessment ?
      functionalAssessmentToDomain(dto.functionalAssessment) : undefined,
    stepId: 'step3-diagnoses-clinical'
  }
}

/**
 * Map Step3 input DTO to domain model (complete)
 */
export function toDomain(dto: Step3InputDTO): Step3Data {
  const diagnoses: DiagnosesDTO = dto.diagnoses ?? {
    secondaryDiagnoses: [],
    diagnosisRecords: []
  }

  const psychiatricEvaluation: PsychiatricEvaluationDTO = dto.psychiatricEvaluation ?? {
    currentSymptoms: [],
    hasPsychEval: false
  }

  const functionalAssessment: FunctionalAssessmentDTO = dto.functionalAssessment ?? {
    affectedDomains: [],
    adlsIndependence: 'unknown',
    iadlsIndependence: 'unknown',
    cognitiveFunctioning: 'unknown',
    hasSafetyConcerns: false,
    dailyLivingActivities: []
  }

  return {
    diagnoses: diagnosesToDomain(diagnoses),
    psychiatricEvaluation: psychiatricEvaluationToDomain(psychiatricEvaluation),
    functionalAssessment: functionalAssessmentToDomain(functionalAssessment),
    stepId: 'step3-diagnoses-clinical'
  }
}

/**
 * Map domain model to output DTO
 */
export function toOutput(
  domain: Step3Data,
  sessionId: string,
  organizationId: string
): Step3OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      diagnoses: diagnosesToDTO(domain.diagnoses),
      psychiatricEvaluation: psychiatricEvaluationToDTO(domain.psychiatricEvaluation),
      functionalAssessment: functionalAssessmentToDTO(domain.functionalAssessment)
    },
    lastModified: new Date().toISOString()
  }
}

/**
 * Create empty output DTO
 */
export function createEmptyOutput(
  sessionId: string,
  organizationId: string
): Step3OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      diagnoses: {
        secondaryDiagnoses: [],
        diagnosisRecords: []
      },
      psychiatricEvaluation: {
        currentSymptoms: [],
        hasPsychEval: false
      },
      functionalAssessment: {
        affectedDomains: [],
        adlsIndependence: 'unknown',
        iadlsIndependence: 'unknown',
        cognitiveFunctioning: 'unknown',
        hasSafetyConcerns: false,
        dailyLivingActivities: []
      }
    },
    lastModified: new Date().toISOString()
  }
}