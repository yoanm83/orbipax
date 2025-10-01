# 🏥 OrbiPax Intake Store - Auditoría Completa

**Fecha**: 2025-09-28
**Módulo**: `src/modules/intake/state`
**Objetivo**: Radiografía integral del store para Step 1 Demographics

## 📂 Sección 1 - Árbol y Descripción por Archivo

```
src/modules/intake/state/
├── index.ts                    # Barrel export - UI-only exports, no PHI
├── README.md                   # Documentación del store - principios UI-only
├── types.ts                    # Tipos base - WizardStep, TransitionState, flags
├── selectors/
│   ├── wizard.selectors.ts    # 15 selectores de navegación wizard (memoizados)
│   └── step1.selectors.ts     # 17 selectores UI Step1 (expansión, estado)
└── slices/
    ├── wizardProgress.slice.ts # Navegación global wizard (Zustand, 138 LOC)
    ├── step1.ui.slice.ts       # UI Step1 - secciones expandibles (Zustand, 195 LOC)
    ├── step3/                  # Diagnósticos (3 slices con devtools)
    │   ├── index.ts
    │   ├── diagnoses.ui.slice.ts
    │   ├── functionalAssessment.ui.slice.ts
    │   └── psychiatricEvaluation.ui.slice.ts
    ├── step4/                  # Proveedores médicos (2 slices)
    │   ├── index.ts
    │   ├── providers.ui.slice.ts
    │   └── psychiatrist.ui.slice.ts
    └── step5/                  # Medicaciones (2 slices)
        ├── index.ts
        ├── currentMedications.ui.slice.ts
        └── pharmacyInformation.ui.slice.ts
```

### Observaciones del Árbol:
- **Patrón dominante**: Zustand sin middleware de persistencia
- **Devtools**: Habilitado en step3/4/5 pero NO en step1/wizard
- **Consistencia parcial**: Step1 y wizard sin devtools, resto con devtools
- **No hay Step2**: Insurance no tiene slice propio

## 📊 Sección 2 - Mapa de Estado y Contratos

### Shape del Estado Raíz

```typescript
// Estado Global de Intake (distribuido en slices)
{
  // wizardProgress (global navigation)
  wizardProgress: {
    currentStep: WizardStep,          // 'demographics' | 'insurance' | ...
    transitionState: TransitionState,  // 'idle' | 'navigating' | 'validating'
    visitedSteps: WizardStep[],
    completedSteps: WizardStep[],
    isCurrentStepValid: boolean,
    allowSkipAhead: boolean,          // true by default
    showProgress: boolean,
    isTransitioning: boolean,
    showStepDescriptions: boolean,
    compactMode: boolean
  },

  // step1UI (demographics UI state)
  step1UI: {
    expandedSections: {
      personal: boolean,  // true by default
      address: boolean,
      contact: boolean,
      legal: boolean
    },
    uiError: string | null,
    isBusy: boolean,
    isValid: boolean,
    lastAction: 'expand' | 'collapse' | 'validate' | 'reset' | null,
    photoUpload: {
      isUploading: boolean,
      uploadError: string | null
    }
  },

  // step3 slices (diagnoses - WITH PHI!)
  diagnoses: {
    primaryDiagnosis: string,        // ⚠️ PHI DATA
    secondaryDiagnoses: string[],    // ⚠️ PHI DATA
    substanceUseDisorder: string,    // ⚠️ PHI DATA
    mentalHealthHistory: string,     // ⚠️ PHI DATA
    isExpanded: boolean,
    isDirty: boolean,
    validationErrors: Record<string, string>
  }
  // ... similar for functionalAssessment, psychiatricEvaluation, etc.
}
```

### Contratos Exportados (JSON-Serializable)

#### wizardProgress.slice.ts
```typescript
// Actions (inputs)
goToStep: (step: WizardStep) => void
nextStep: () => void
prevStep: () => void
markStepVisited: (step: WizardStep) => void
markStepCompleted: (step: WizardStep) => void
setWizardFlags: (flags: Partial<WizardFlags>) => void
setPreferences: (prefs: Partial<WizardPreferences>) => void
resetWizard: () => void

// Selectors (outputs)
useCurrentStep: () => WizardStep
useIsTransitioning: () => boolean
useCanAdvance: () => boolean
useProgressPercentage: () => number
```

#### step1.ui.slice.ts
```typescript
// Actions (inputs)
toggleSection: (section: 'personal'|'address'|'contact'|'legal') => void
expandAllSections: () => void
collapseAllSections: () => void
setUiError: (error: string | null) => void
setBusy: (busy: boolean) => void
setPhotoUploading: (uploading: boolean) => void
resetUIState: () => void

// Selectors (outputs)
useStep1ExpandedSections: () => ExpandedSections
useStep1HasUIIssues: () => boolean
useStep1UIStatus: () => UIStatus
```

### ⚠️ RIESGO: PHI en Step3/4/5 Slices

Los slices de step3/4/5 **ALMACENAN PHI DIRECTAMENTE**:
- `diagnoses.ui.slice.ts`: primaryDiagnosis, mentalHealthHistory
- `providers.ui.slice.ts`: providerName, providerPhone
- `currentMedications.ui.slice.ts`: medicationName, dosage

**Violación**: Contradice README.md que dice "NO PHI allowed"

## 🔄 Sección 3 - Acciones, Estados y Selectores

### Lifecycle States Identificados

```typescript
// Wizard navigation
'idle' | 'navigating' | 'validating'

// UI busy states (no standard)
isBusy: boolean      // step1
isUploading: boolean // step1 photo
isDirty: boolean     // step3+ slices
```

**GAP**: No hay lifecycle consistente. Cada slice usa su propia convención.

### Performance de Selectores

#### ✅ Buenos Patrones:
- Selectores granulares en step1 (17 selectores específicos)
- Selectores derivados con cálculo inline (no memoización necesaria)

#### ❌ Problemas Detectados:
1. **Duplicación de stepOrder** en wizard.selectors.ts (repetido 5 veces)
2. **No hay memoización** para selectores complejos como `useStep1UIStatus`
3. **Over-selecting**: `useStep1ExpandedSections` retorna objeto completo

### Effects y Side-Effects

```javascript
// wizardProgress.slice.ts línea 83-85
setTimeout(() => {
  set({ transitionState: 'idle', isTransitioning: false });
}, 200);
```

**PROBLEMA**: Side-effect (setTimeout) directamente en slice, debería estar en Application layer.

## 💾 Sección 4 - Persistencia, SSR y Multitenant

### Persistencia Actual
- **NO hay persist middleware** en ningún slice
- **NO hay localStorage/sessionStorage** usage
- **NO hay IndexedDB** implementation

✅ Cumple con política "no persistencia cliente"

### SSR/Hidratación
- Todos los slices usan `"use client"` directive
- **NO hay hidratación** desde servidor
- Initial state hardcodeado en cada slice

**GAP**: No hay estrategia de hidratación para SSR

### Multitenant Support
- **NO hay organization_id** en ningún slice
- **NO hay reset automático** al cambiar tenant
- `resetWizard()` y `resetUIState()` existen pero no se invocan automáticamente

**RIESGO CRÍTICO**: Datos podrían mezclarse entre tenants si no se resetea manualmente

### DevTools Configuration

```javascript
// step3+ slices
devtools((set) => ({...}), { name: 'DiagnosesUI' })

// step1 y wizard - NO tienen devtools
create<Store>((set) => ({...}))
```

**INCONSISTENCIA**: Mezlca de patrones, algunos con devtools otros sin.

## ❌ Sección 5 - Errores y Telemetría

### Manejo de Errores Actual

```typescript
// step1.ui.slice.ts
uiError: string | null
photoUpload.uploadError: string | null

// step3+ slices
validationErrors: Record<string, string>
```

**Problemas**:
1. **No hay estándar**: Algunos usan `uiError`, otros `validationErrors`
2. **Mensajes raw**: Errores no sanitizados (riesgo PII)
3. **No hay telemetría**: Sin tracking de errores

### Falta de Error Boundaries
- No hay async error handling en actions
- No hay retry logic
- No hay error recovery strategies

## 📏 Sección 6 - Consistencia y Riesgos

### Naming Conventions

✅ **Consistente**:
- camelCase en todo el código
- Prefijos `use` para hooks/selectors
- Sufijos `.slice.ts`, `.selectors.ts`

❌ **Inconsistente**:
- `step1.ui.slice.ts` vs `diagnoses.ui.slice.ts` (numbering)
- `wizardProgress` vs `step1UI` (naming pattern)

### Duplicación de Código

**CRÍTICO**: `stepOrder` array duplicado 5 veces en wizard.selectors.ts
```typescript
// Líneas 60-71, 82-93, 102-113, 122-133, 142-153
const stepOrder: WizardStep[] = [
  'welcome', 'demographics', 'insurance', ...
];
```

### Riesgos de Seguridad

1. **PHI en cliente** (step3/4/5 slices)
2. **No multitenant isolation**
3. **No sanitización de errores**
4. **DevTools en producción** (no hay gate por entorno)

## 📈 Conclusión

### Cobertura de Step1 por el Store

**15% cobertura real**:
- ✅ UI state (secciones expandibles): 100% en store
- ✅ Navigation state: 100% en store
- ❌ Form data: 0% en store (todo en React Hook Form)
- ❌ Validation: 0% en store (todo en Zod/RHF)

El store maneja solo presentación, no datos del formulario.

### GAPS Priorizados (con evidencia)

1. **🔴 CRÍTICO - PHI en Step3/4/5 slices**
   - Archivo: `src/modules/intake/state/slices/step3/diagnoses.ui.slice.ts:51-54`
   - Evidencia: `primaryDiagnosis: '', mentalHealthHistory: ''`
   - Impacto: Violación de seguridad, datos sensibles en memoria cliente

2. **🔴 CRÍTICO - No hay reset multitenant**
   - Archivo: `src/modules/intake/state/slices/wizardProgress.slice.ts`
   - Evidencia: No hay `organization_id` check ni auto-reset
   - Impacto: Mezcla de datos entre organizaciones

3. **🟡 ALTO - Duplicación stepOrder (5x)**
   - Archivo: `src/modules/intake/state/selectors/wizard.selectors.ts:60-153`
   - Evidencia: Array repetido 5 veces
   - Impacto: Mantenibilidad, prone a errores

4. **🟡 MEDIO - Inconsistencia devtools**
   - Step1/wizard sin devtools, step3/4/5 con devtools
   - Impacto: Debug experience inconsistente

5. **🟡 MEDIO - No hay lifecycle estándar**
   - Cada slice usa convención propia (isBusy, isDirty, etc)
   - Impacto: Confusión, falta de predictibilidad

### UNA Micro-tarea APPLY Recomendada

**TAREA PRIORITARIA**: Crear constante centralizada para stepOrder

```typescript
// src/modules/intake/state/constants.ts
export const INTAKE_STEP_ORDER: WizardStep[] = [
  'welcome', 'demographics', 'insurance', 'diagnoses',
  'medical-providers', 'medications', 'referrals',
  'legal-forms', 'goals', 'review'
] as const;
```

**Por qué esta primero**:
- Elimina duplicación inmediata (DRY)
- Zero riesgo de romper funcionalidad
- Mejora mantenibilidad instantánea
- Preparación para futuras mejoras

### Plan Mínimo (siguientes 2-3 tareas)

1. **Eliminar PHI de step3/4/5 slices** - Mover a RHF como step1
2. **Agregar reset multitenant** - Hook useEffect en wizard para detectar cambio org
3. **Estandarizar lifecycle states** - Crear tipo común `UIState<T>`

## ✅ Validación de Guardrails

- ✅ UI→Application→Domain: Cumple parcialmente (step1 sí, step3+ no)
- ❌ RLS/multitenant: NO cumple (falta isolation)
- ✅ A11y no afectada: Store no impacta A11y
- ❌ Sin PII en store: FALLA (step3/4/5 tienen PHI)
- ✅ JSON-serializable: Todos los contratos son serializables

**Estado General**: 60% compliance - Requiere intervención urgente en PHI y multitenant.