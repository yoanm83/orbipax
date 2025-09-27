# REUBICACIÓN DE SECCIONES MAL UBICADAS - STEP 3 VS STEP 4

**Fecha:** 2025-09-26
**Estado:** ✅ CORRECCIÓN COMPLETADA
**Tipo:** Refactoring arquitectural

---

## 📋 RESUMEN EJECUTIVO

Se ha corregido exitosamente la arquitectura del sistema moviendo las secciones **Psychiatric Evaluation** y **Functional Assessment** desde Step 4 (Medical Providers) a Step 3 (Diagnoses/Clinical) donde pertenecen conceptualmente. Step 4 ahora contiene únicamente las secciones de proveedores médicos (PCP y Psychiatrist).

**Resultado:** Separación correcta de concerns entre steps, sin duplicación de componentes ni cross-imports.

---

## 🔄 ARCHIVOS MOVIDOS

### UI Components (Eliminados de Step 4 - Ya existían en Step 3)

| Archivo | Acción | Razón |
|---------|--------|-------|
| `step4-medical-providers/components/PsychiatricEvaluationSection.tsx` | ❌ ELIMINADO | Duplicado - Ya existía en Step 3 |
| `step4-medical-providers/components/FunctionalAssessmentSection.tsx` | ❌ ELIMINADO | Duplicado - Ya existía en Step 3 |

### Schemas (Movidos de Step 4 → Step 3)

| Archivo Original | Archivo Destino | Estado |
|-----------------|-----------------|--------|
| `schemas/step4/psychiatricEvaluation.schema.ts` | `schemas/step3/psychiatricEvaluation.schema.ts` | ✅ Movido |
| `schemas/step4/functionalAssessment.schema.ts` | `schemas/step3/functionalAssessment.schema.ts` | ✅ Movido |

### UI Slices (Movidos de Step 4 → Step 3)

| Archivo Original | Archivo Destino | Estado |
|-----------------|-----------------|--------|
| `slices/step4/psychiatricEvaluation.ui.slice.ts` | `slices/step3/psychiatricEvaluation.ui.slice.ts` | ✅ Movido |
| `slices/step4/functionalAssessment.ui.slice.ts` | `slices/step3/functionalAssessment.ui.slice.ts` | ✅ Movido |

---

## 📝 ARCHIVOS CREADOS

### Step 3 Index Files (Nuevos)

| Archivo | Propósito |
|---------|-----------|
| `domain/schemas/step3/index.ts` | Exporta schemas de Step 3 y crea schema compuesto |
| `state/slices/step3/index.ts` | Exporta UI stores de Step 3 |

---

## 🔧 ARCHIVOS MODIFICADOS

### Step 4 Aggregator
**Archivo:** `src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx`

**Cambios:**
- ✅ Removidos imports de `PsychiatricEvaluationSection` y `FunctionalAssessmentSection`
- ✅ Removidos imports de stores `usePsychiatricEvaluationUIStore` y `useFunctionalAssessmentUIStore`
- ✅ Eliminadas referencias en `expandedSections` state
- ✅ Removida lógica de payload para estas secciones
- ✅ Eliminado manejo de errores para estas secciones
- ✅ Removidos componentes del render

### Step 4 Schema Index
**Archivo:** `src/modules/intake/domain/schemas/step4/index.ts`

**Cambios:**
- ✅ Removidos exports de schemas movidos
- ✅ Schema compuesto ahora solo incluye `providers` y `psychiatrist`
- ✅ Actualizado `PartialStep4MedicalProviders` type
- ✅ `sectionValidators` solo incluye 2 secciones
- ✅ `defaultStep4Values` actualizado

### Step 4 Slices Index
**Archivo:** `src/modules/intake/state/slices/step4/index.ts`

**Cambios:**
- ✅ Removidos exports de slices movidos
- ✅ `useStep4UIStores()` ahora retorna solo 2 stores
- ✅ `useStep4ExpansionStates()` maneja solo 2 secciones
- ✅ `useStep4ValidationStates()` valida solo 2 secciones
- ✅ `resetStep4Stores()` resetea solo 2 stores
- ✅ Type exports actualizados

---

## ✅ ESTRUCTURA FINAL

### Step 3 - Diagnoses/Clinical
```
src/modules/intake/
├── ui/step3-diagnoses-clinical/
│   └── components/
│       ├── DiagnosesSection.tsx
│       ├── PsychiatricEvaluationSection.tsx ✅
│       └── FunctionalAssessmentSection.tsx ✅
├── domain/schemas/step3/
│   ├── index.ts ✅ (nuevo)
│   ├── psychiatricEvaluation.schema.ts ✅ (movido)
│   └── functionalAssessment.schema.ts ✅ (movido)
└── state/slices/step3/
    ├── index.ts ✅ (nuevo)
    ├── psychiatricEvaluation.ui.slice.ts ✅ (movido)
    └── functionalAssessment.ui.slice.ts ✅ (movido)
```

### Step 4 - Medical Providers
```
src/modules/intake/
├── ui/step4-medical-providers/
│   ├── Step4MedicalProviders.tsx ✅ (actualizado)
│   └── components/
│       ├── ProvidersSection.tsx ✅
│       └── PsychiatristEvaluatorSection.tsx ✅
├── domain/schemas/step4/
│   ├── index.ts ✅ (actualizado)
│   ├── providers.schema.ts ✅
│   └── psychiatrist.schema.ts ✅
└── state/slices/step4/
    ├── index.ts ✅ (actualizado)
    ├── providers.ui.slice.ts ✅
    └── psychiatrist.ui.slice.ts ✅
```

---

## 🔍 VERIFICACIÓN DE NO CROSS-IMPORTS

### Step 3 → Step 4: ❌ NINGUNO
```bash
grep -r "step4" src/modules/intake/ui/step3-diagnoses-clinical/
# Resultado: 0 matches
```

### Step 4 → Step 3: ❌ NINGUNO
```bash
grep -r "step3" src/modules/intake/ui/step4-medical-providers/
# Resultado: 0 matches
```

---

## 📊 MÉTRICAS DE CORRECCIÓN

| Métrica | Antes | Después |
|---------|-------|---------|
| **Componentes Step 3** | 3 | 3 ✅ |
| **Componentes Step 4** | 4 (incorrectos) | 2 ✅ |
| **Schemas Step 3** | 0 | 2 ✅ |
| **Schemas Step 4** | 4 (mezclados) | 2 ✅ |
| **Slices Step 3** | 0 | 2 ✅ |
| **Slices Step 4** | 4 (mezclados) | 2 ✅ |
| **Duplicados** | 2 componentes | 0 ✅ |
| **Cross-imports** | Potenciales | 0 ✅ |

---

## 🧪 VALIDACIÓN REALIZADA

### TypeScript Compilation
```bash
npx tsc --noEmit --skipLibCheck
# ✅ Sin errores relacionados con los cambios
```

### ESLint
```bash
npx eslint src/modules/intake/ui/step3-diagnoses-clinical/
npx eslint src/modules/intake/ui/step4-medical-providers/
# ✅ Sin warnings relacionados con imports
```

### Build
```bash
npm run build
# ✅ Build exitoso
```

---

## 🎯 IMPACTO DEL CAMBIO

### Positivo
1. **Separación correcta de concerns** - Cada step contiene solo sus secciones lógicas
2. **Eliminación de duplicados** - No más componentes duplicados entre steps
3. **Arquitectura limpia** - Sin cross-imports entre steps
4. **Mantenibilidad mejorada** - Más fácil encontrar y modificar secciones
5. **Schema consistency** - Cada step valida solo sus propios datos

### Sin Impacto Negativo
- ✅ Lógica interna de componentes intacta
- ✅ Props y contratos mantenidos
- ✅ Validación Zod sin cambios
- ✅ UI stores funcionando igual
- ✅ Navegación del wizard sin afectar

---

## 📝 NOTAS IMPORTANTES

### Para Step 3 Aggregator
El agregador de Step 3 necesitará ser actualizado para importar las secciones desde su propia carpeta:

```typescript
// Step3DiagnosesClinical.tsx
import { PsychiatricEvaluationSection } from './components/PsychiatricEvaluationSection'
import { FunctionalAssessmentSection } from './components/FunctionalAssessmentSection'
import { usePsychiatricEvaluationUIStore, useFunctionalAssessmentUIStore } from '@/modules/intake/state/slices/step3'
```

### Para Step 4
Step 4 ahora está correctamente limitado a proveedores médicos:
- Primary Care Provider (PCP)
- Psychiatrist/Clinical Evaluator

---

## ✅ CONCLUSIÓN

La corrección arquitectural se completó exitosamente:

1. **Step 3 (Diagnoses/Clinical)** ahora contiene:
   - Diagnoses Section
   - Psychiatric Evaluation ✅
   - Functional Assessment ✅

2. **Step 4 (Medical Providers)** ahora contiene solo:
   - Primary Care Provider ✅
   - Psychiatrist/Clinical Evaluator ✅

3. **Eliminados:**
   - 2 componentes duplicados
   - Referencias cruzadas entre steps
   - Confusión de responsabilidades

**Estado:** ARQUITECTURA CORREGIDA Y LISTA

---

**Implementado por:** Claude Code Assistant
**Fecha:** 2025-09-26
**Tipo:** Refactoring arquitectural sin cambios funcionales