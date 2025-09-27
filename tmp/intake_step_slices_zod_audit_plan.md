# AUDITORÍA Y PLAN: MIGRACIÓN A ZOD + STORE POR SLICES

**Fecha:** 2025-09-26
**Módulo:** Step 4 - Medical Providers (Intake)
**Estado:** 📋 AUDITORÍA COMPLETADA - PLAN DEFINIDO

---

## 📊 INVENTARIO ACTUAL DEL SISTEMA

### 1. ESTRUCTURA DE STATE EXISTENTE

#### Ubicación: `D:\ORBIPAX-PROJECT\src\modules\intake\state\`

**Slices Identificados:**

1. **wizardProgress.slice.ts**
   - **Patrón:** Zustand store con create()
   - **Shape:**
     ```typescript
     {
       currentStep: WizardStep
       transitionState: TransitionState
       isCurrentStepValid: boolean
       allowSkipAhead: boolean
       showProgress: boolean
       visitedSteps: WizardStep[]
       completedSteps: WizardStep[]
     }
     ```
   - **Acciones:** goToStep, nextStep, prevStep, markStepVisited, markStepCompleted, resetWizard
   - **Persistencia:** NO (estado UI temporal)
   - **Nota:** NO PHI - Solo navegación UI

2. **step1.ui.slice.ts**
   - **Patrón:** Zustand store UI-only
   - **Shape:**
     ```typescript
     {
       expandedSections: { personal, address, contact, legal }
       uiError: string | null
       isBusy: boolean
       isValid: boolean
       lastAction: string
       photoUpload: { isUploading, uploadError }
     }
     ```
   - **Acciones:** toggleSection, expandSection, collapseSection, setUiError, setBusy, setValid
   - **Persistencia:** NO
   - **Nota:** NO PHI - Solo flags UI

**Observaciones Clave:**
- ✅ Separación estricta UI vs Data (NO PHI en slices UI)
- ✅ Patrón consistente con Zustand
- ✅ No hay store raíz, cada slice es independiente
- ✅ Selectores en archivos separados para optimización

### 2. ESQUEMAS ZOD EXISTENTES

#### Ubicación: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\`

**Esquemas Domain Identificados:**
- `providers.schema.ts` - Esquema complejo con providerContactSchema, providerRelationshipSchema
- `clinical-history.schema.ts` - Para historial clínico
- `demographics.schema.ts` - Datos demográficos
- `insurance.schema.ts` - Información de seguro

**Patrones Observados:**
```typescript
// Patrón de validación
export const validateProvidersStep = (data: unknown) => {
  return providersDataSchema.safeParse(data)
}

// Mensajes genéricos
z.string().min(1, 'Provider first name is required')
z.string().max(50) // Sin mensaje = genérico automático

// Normalización teléfono
z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid phone number format')
```

---

## 🎯 SLICES PROPUESTOS PARA STEP 4

### 1. psychiatricEvaluation.ui.slice.ts

**Shape Propuesto:**
```typescript
interface PsychiatricEvaluationUIState {
  // Datos del formulario (NO PHI hasta submit)
  hasEvaluation: 'Yes' | 'No' | ''
  evaluationDate?: Date
  clinicianName?: string
  evaluationSummary?: string

  // UI State
  isExpanded: boolean
  validationErrors: {
    hasEvaluation?: string
    evaluationDate?: string
    clinicianName?: string
    evaluationSummary?: string
  }
}
```

**Acciones:**
- setHasEvaluation(value: 'Yes' | 'No')
- setEvaluationField(field: string, value: any)
- validateSection() → boolean
- resetSection()
- toggleExpanded()

### 2. functionalAssessment.ui.slice.ts

**Shape Propuesto:**
```typescript
interface FunctionalAssessmentUIState {
  // WHODAS 2.0 Domains
  affectedDomains: string[] // ['mobility', 'self-care', ...]

  // Independence Levels
  adlsIndependence: 'Yes' | 'No' | 'Partial' | 'Unknown' | ''
  iadlsIndependence: 'Yes' | 'No' | 'Partial' | 'Unknown' | ''
  cognitiveFunctioning: 'Intact' | 'Mild' | 'Moderate' | 'Severe' | 'Unknown' | ''

  // Additional
  safetyConcerns: boolean
  additionalNotes: string

  // UI State
  isExpanded: boolean
  validationErrors: Record<string, string>
}
```

**Acciones:**
- toggleDomain(domain: string)
- setIndependenceLevel(field: string, value: string)
- setSafetyConcerns(value: boolean)
- setNotes(notes: string)
- validateSection() → boolean
- resetSection()

### 3. providers.ui.slice.ts (PCP)

**Shape Propuesto:**
```typescript
interface ProvidersUIState {
  // Primary Care Provider
  hasPCP: 'Yes' | 'No' | 'Unknown' | ''
  pcpName: string
  pcpPractice: string
  pcpPhone: string // Stored normalized (digits only)
  pcpAddress: string
  authorizedToShare: boolean

  // UI State
  isExpanded: boolean
  phoneDisplayValue: string // Formatted for display
  validationErrors: Record<string, string>
}
```

**Acciones:**
- setHasPCP(value: string)
- setPCPField(field: string, value: any)
- setPhoneNumber(raw: string) // Normaliza y formatea
- toggleAuthorization()
- validateSection() → boolean
- resetConditionalFields() // Cuando hasPCP !== 'Yes'

### 4. psychiatrist.ui.slice.ts

**Shape Propuesto:**
```typescript
interface PsychiatristUIState {
  // Psychiatrist Evaluation
  hasBeenEvaluated: 'Yes' | 'No' | ''
  psychiatristName: string
  evaluationDate?: Date
  clinicName: string
  notes: string

  // Different Evaluator
  differentEvaluator: boolean
  evaluatorName: string
  evaluatorClinic: string

  // UI State
  isExpanded: boolean
  validationErrors: Record<string, string>
}
```

**Acciones:**
- setHasBeenEvaluated(value: string)
- setPsychiatristField(field: string, value: any)
- toggleDifferentEvaluator()
- setEvaluatorField(field: string, value: string)
- validateSection() → boolean
- resetConditionalFields()

---

## 📐 ESQUEMAS ZOD PROPUESTOS

### 1. psychiatricEvaluationSchema.ts

```typescript
const psychiatricEvaluationSchema = z.object({
  hasEvaluation: z.enum(['Yes', 'No']).refine(val => val !== '', {
    message: 'This field is required'
  }),

  // Conditional validation
  evaluationDate: z.date().optional().refine((date, ctx) => {
    const parent = ctx.parent as any
    if (parent.hasEvaluation === 'Yes') {
      return date !== undefined
    }
    return true
  }, 'Evaluation date is required'),

  clinicianName: z.string()
    .trim()
    .max(120, 'Maximum 120 characters allowed')
    .optional()
    .refine((name, ctx) => {
      const parent = ctx.parent as any
      if (parent.hasEvaluation === 'Yes') {
        return name && name.length > 0
      }
      return true
    }, 'Clinician name is required'),

  evaluationSummary: z.string()
    .trim()
    .max(300, 'Maximum 300 characters allowed')
    .optional()
})
```

### 2. functionalAssessmentSchema.ts

```typescript
const WHODAS_DOMAINS = [
  'mobility',
  'self-care',
  'getting-along',
  'life-activities',
  'participation'
] as const

const functionalAssessmentSchema = z.object({
  affectedDomains: z.array(z.enum(WHODAS_DOMAINS))
    .min(1, 'Please select at least one affected domain'),

  adlsIndependence: z.enum(['Yes', 'No', 'Partial', 'Unknown'])
    .refine(val => val !== '', 'This field is required'),

  iadlsIndependence: z.enum(['Yes', 'No', 'Partial', 'Unknown'])
    .refine(val => val !== '', 'This field is required'),

  cognitiveFunctioning: z.enum(['Intact', 'Mild Impairment', 'Moderate Impairment', 'Severe Impairment', 'Unknown'])
    .refine(val => val !== '', 'This field is required'),

  safetyConcerns: z.boolean(),

  additionalNotes: z.string()
    .trim()
    .max(300, 'Maximum 300 characters allowed')
    .optional()
})
```

### 3. providersSchema.ts (PCP)

```typescript
const phoneNumberSchema = z.string()
  .transform(val => val.replace(/\D/g, '')) // Strip non-digits
  .refine(val => val.length >= 10, 'Enter a valid phone number')

const providersSchema = z.object({
  hasPCP: z.enum(['Yes', 'No', 'Unknown'])
    .refine(val => val !== '', 'This field is required'),

  // Conditional fields
  pcpName: z.string()
    .trim()
    .max(120)
    .optional()
    .refine((name, ctx) => {
      const parent = ctx.parent as any
      return parent.hasPCP !== 'Yes' || (name && name.length > 0)
    }, 'Provider name is required'),

  pcpPhone: phoneNumberSchema
    .optional()
    .refine((phone, ctx) => {
      const parent = ctx.parent as any
      return parent.hasPCP !== 'Yes' || (phone && phone.length >= 10)
    }, 'Phone number is required'),

  pcpPractice: z.string().trim().max(120).optional(),
  pcpAddress: z.string().trim().max(200).optional(),
  authorizedToShare: z.boolean().optional()
})
```

### 4. psychiatristSchema.ts

```typescript
const psychiatristSchema = z.object({
  hasBeenEvaluated: z.enum(['Yes', 'No'])
    .refine(val => val !== '', 'This field is required'),

  // Required when Yes
  psychiatristName: z.string()
    .trim()
    .max(120)
    .optional()
    .refine((name, ctx) => {
      const parent = ctx.parent as any
      return parent.hasBeenEvaluated !== 'Yes' || (name && name.length > 0)
    }, 'Psychiatrist name is required'),

  evaluationDate: z.date()
    .optional()
    .refine((date, ctx) => {
      const parent = ctx.parent as any
      return parent.hasBeenEvaluated !== 'Yes' || date !== undefined
    }, 'Evaluation date is required'),

  // Optional fields
  clinicName: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(300).optional(),

  // Different evaluator (always optional)
  differentEvaluator: z.boolean().optional(),
  evaluatorName: z.string().trim().max(120).optional(),
  evaluatorClinic: z.string().trim().max(120).optional()
})
```

### 5. step4Schema.ts (Composición)

```typescript
const step4MedicalProvidersSchema = z.object({
  psychiatricEvaluation: psychiatricEvaluationSchema,
  functionalAssessment: functionalAssessmentSchema,
  providers: providersSchema,
  psychiatrist: psychiatristSchema
})

// Validación completa del step
export const validateStep4 = (data: unknown) => {
  return step4MedicalProvidersSchema.safeParse(data)
}
```

---

## 🔗 CONTRATO UI ↔ STORE ↔ ZOD

### Mapeo de FormFields

| Sección | FormField name | Store Action | Zod Key |
|---------|---------------|--------------|---------|
| **Psychiatric Evaluation** |
| Has Evaluation | `psychiatric.hasEvaluation` | `setHasEvaluation()` | `psychiatricEvaluation.hasEvaluation` |
| Date | `psychiatric.date` | `setEvaluationField('date')` | `psychiatricEvaluation.evaluationDate` |
| Clinician | `psychiatric.clinician` | `setEvaluationField('clinician')` | `psychiatricEvaluation.clinicianName` |
| **Functional Assessment** |
| Domains | `functional.domains` | `toggleDomain()` | `functionalAssessment.affectedDomains` |
| ADLs | `functional.adls` | `setIndependenceLevel('adls')` | `functionalAssessment.adlsIndependence` |
| IADLs | `functional.iadls` | `setIndependenceLevel('iadls')` | `functionalAssessment.iadlsIndependence` |
| **Providers (PCP)** |
| Has PCP | `providers.hasPCP` | `setHasPCP()` | `providers.hasPCP` |
| Name | `providers.pcpName` | `setPCPField('name')` | `providers.pcpName` |
| Phone | `providers.pcpPhone` | `setPhoneNumber()` | `providers.pcpPhone` |
| **Psychiatrist** |
| Evaluated | `psychiatrist.hasEval` | `setHasBeenEvaluated()` | `psychiatrist.hasBeenEvaluated` |
| Name | `psychiatrist.name` | `setPsychiatristField('name')` | `psychiatrist.psychiatristName` |
| Date | `psychiatrist.date` | `setPsychiatristField('date')` | `psychiatrist.evaluationDate` |

### Integración en Agregador

**Archivo:** `Step4MedicalProviders.tsx`

```typescript
// Import stores
import { usePsychiatricEvaluationStore } from '@/modules/intake/state/slices/psychiatricEvaluation.ui.slice'
import { useFunctionalAssessmentStore } from '@/modules/intake/state/slices/functionalAssessment.ui.slice'
import { useProvidersStore } from '@/modules/intake/state/slices/providers.ui.slice'
import { usePsychiatristStore } from '@/modules/intake/state/slices/psychiatrist.ui.slice'

// Import schema
import { validateStep4 } from '@/modules/intake/domain/schemas/step4.schema'

// En submit handler
const handleSubmit = () => {
  const data = {
    psychiatricEvaluation: psychiatricEvaluationStore.getState(),
    functionalAssessment: functionalAssessmentStore.getState(),
    providers: providersStore.getState(),
    psychiatrist: psychiatristStore.getState()
  }

  const result = validateStep4(data)
  if (!result.success) {
    // Distribuir errores a cada store
    distributeValidationErrors(result.error)
    return
  }

  // Proceder con submit
  submitToBackend(result.data)
}
```

---

## 💾 PERSISTENCIA Y REHIDRATACIÓN

### Estrategia de Persistencia

**NO PERSISTIR (Datos Sensibles):**
- Nombres de providers
- Números de teléfono
- Direcciones
- Notas clínicas

**SÍ PERSISTIR (UI State):**
- Estados de expansión
- Selecciones Yes/No
- Flags booleanos
- Preferencias UI

### Implementación con Zustand Persist

```typescript
import { persist } from 'zustand/middleware'

// Solo persistir UI state
const useProvidersStore = create(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'providers-ui-storage',
      partialize: (state) => ({
        hasPCP: state.hasPCP,
        isExpanded: state.isExpanded,
        authorizedToShare: state.authorizedToShare
        // NO incluir: pcpName, pcpPhone, pcpAddress
      })
    }
  )
)
```

---

## 📋 PLAN DE MIGRACIÓN (APPLY)

### FASE 1: Preparación (1-2 horas)
1. **Crear estructura de schemas**
   ```
   src/modules/intake/domain/schemas/step4/
   ├── psychiatricEvaluation.schema.ts
   ├── functionalAssessment.schema.ts
   ├── providers.schema.ts
   ├── psychiatrist.schema.ts
   └── index.ts (step4Schema)
   ```

2. **Crear slices UI**
   ```
   src/modules/intake/state/slices/step4/
   ├── psychiatricEvaluation.ui.slice.ts
   ├── functionalAssessment.ui.slice.ts
   ├── providers.ui.slice.ts
   └── psychiatrist.ui.slice.ts
   ```

### FASE 2: Implementación (3-4 horas)

**Orden de migración (menor a mayor complejidad):**

1. **PsychiatricEvaluationSection** (más simple)
   - Conectar a slice
   - Integrar validación Zod
   - Mantener UI actual

2. **FunctionalAssessmentSection**
   - Migrar multiselect a store
   - Validación de dominios WHODAS
   - Mantener lógica condicional

3. **ProvidersSection** (PCP)
   - Normalización de teléfono en store
   - Validación condicional compleja
   - Formateo display vs storage

4. **PsychiatristEvaluatorSection**
   - Dos niveles de condicionales
   - Integración con DatePicker
   - Switch de evaluador diferente

### FASE 3: Integración (1-2 horas)

1. **Actualizar Step4MedicalProviders.tsx**
   - Importar todos los stores
   - Crear handleSubmit con validación
   - Distribuir errores a stores

2. **Conectar con wizardProgress.slice**
   - markStepCompleted al validar
   - Bloquear navegación si inválido

3. **Testing E2E Manual**
   - Flujo completo de validación
   - Mensajes de error accesibles
   - Persistencia UI (refrescar página)

### FASE 4: Verificación (1 hora)

**Checklist de Validación:**

- [ ] **Build/TypeScript**
  - `npx tsc --noEmit` sin errores
  - Tipos correctamente inferidos

- [ ] **Validación Zod**
  - Campos requeridos validan
  - Condicionales funcionan
  - Mensajes genéricos (sin PII)

- [ ] **Accesibilidad**
  - aria-invalid en errores
  - aria-describedby conectado
  - Focus management correcto

- [ ] **State Management**
  - No duplicación de estado
  - Sincronización UI ↔ Store
  - Reset limpia correctamente

- [ ] **Seguridad**
  - NO PHI en localStorage
  - NO console.* con datos
  - Mensajes sin información sensible

---

## ⚠️ RIESGOS Y MITIGACIONES

### Riesgo 1: Complejidad de Validación Condicional
**Problema:** Zod refine() con dependencias entre campos
**Mitigación:**
- Usar superRefine() para lógica compleja
- Validación en dos pasos: estructura + condicionales

### Riesgo 2: Performance con Re-renders
**Problema:** Muchos stores pueden causar re-renders excesivos
**Mitigación:**
- Usar selectores específicos
- Memoización con useShallow()
- Batch updates con set()

### Riesgo 3: Sincronización Form ↔ Store
**Problema:** Estado duplicado entre React Hook Form y Zustand
**Mitigación:**
- Store como single source of truth
- Controlled components con store values
- onChange directo a store actions

### Riesgo 4: Migración Incremental
**Problema:** Mezcla de patrones old/new durante migración
**Mitigación:**
- Feature flag para activar nuevo sistema
- Migrar sección por sección
- Mantener UI actual hasta completar

---

## ✅ BENEFICIOS ESPERADOS

1. **Validación Unificada**
   - Single source of truth con Zod
   - Mensajes consistentes
   - Validación server-ready

2. **State Management Escalable**
   - Slices independientes
   - Fácil testing unitario
   - DevTools integration

3. **Mejor DX**
   - Type safety end-to-end
   - Auto-complete en stores
   - Errores en compile time

4. **Mantenibilidad**
   - Separación clara de concerns
   - Lógica centralizada
   - Fácil agregar nuevos campos

---

## 📝 CONCLUSIÓN

La migración a Zod + Store por slices es viable y beneficiosa. El sistema actual ya usa patrones similares (Zustand, separación UI/Data), facilitando la adopción.

**Tiempo estimado total:** 6-9 horas
**Complejidad:** Media
**Prioridad:** Alta (base para futuros steps)

**Próximo paso:** Comenzar con FASE 1 creando schemas Zod.

---

**Auditado por:** Claude Code Assistant
**Fecha:** 2025-09-26
**Estado:** LISTO PARA IMPLEMENTACIÓN