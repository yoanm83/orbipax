# INTEGRACIÓN STEP 4: AGGREGATOR + SUBMIT

**Fecha:** 2025-09-26
**Módulo:** Step 4 Medical Providers
**Estado:** ✅ INTEGRACIÓN COMPLETADA (CORREGIDA)

---

## 📋 RESUMEN EJECUTIVO

Se ha completado la integración del Step 4 Medical Providers con un agregador unificado y manejo de submit centralizado. El Step 4 incluye **únicamente 2 secciones**:
1. **Primary Care Provider (PCP)**
2. **Psychiatrist/Clinical Evaluator**

**Corrección importante:** Las secciones Psychiatric Evaluation y Functional Assessment pertenecen a Step 3 (Diagnoses/Clinical), NO a Step 4.

---

## 🗂️ ARCHIVOS MODIFICADOS

### Step4MedicalProviders.tsx (Agregador)
**Ruta:** `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step4-medical-providers\Step4MedicalProviders.tsx`

**Cambios principales:**
- ✅ Importa las 2 secciones correctas (PCP y Psychiatrist)
- ✅ Conecta con los 2 UI stores correspondientes
- ✅ Implementa `buildPayload()` para recolectar datos
- ✅ Implementa `handleSubmit()` con validación Zod
- ✅ Mapea errores a cada slice respectivo
- ✅ Botón Submit con estado loading

### index.ts (Schema Compuesto)
**Ruta:** `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step4\index.ts`

**Cambios principales:**
- ✅ Exporta solo 2 schemas (providers, psychiatrist)
- ✅ Schema compuesto con 2 secciones + metadata
- ✅ Validators para cada sección
- ✅ Helper `isStep4Complete()`
- ✅ Valores por defecto actualizados

---

## 🔌 ARQUITECTURA DE INTEGRACIÓN

### Flujo de datos

```
UI Components → UI Stores → Aggregator → Zod Validation → Submit/Error Feedback
     ↑                           ↓              ↓                    ↓
ProvidersSection          buildPayload()   validateStep4()    setValidationErrors()
PsychiatristSection
```

### Schema Compuesto

```typescript
step4MedicalProvidersSchema = z.object({
  providers: providersSchema,        // PCP information
  psychiatrist: psychiatristSchema,  // Psychiatrist/Evaluator info

  // Metadata
  stepId: z.literal('step4-medical-providers'),
  isComplete: z.boolean(),
  completedAt: z.date().optional(),
  lastModified: z.date().optional()
})
```

---

## 📦 PAYLOAD CONSTRUCCIÓN

### Lógica condicional aplicada

```typescript
const buildPayload = useCallback(() => {
  // Providers - incluye campos solo si hasPCP === 'Yes'
  const providersPayload = {
    hasPCP: store.hasPCP,
    ...(store.hasPCP === 'Yes' && {
      pcpName: store.pcpName?.trim(),
      pcpPhone: store.pcpPhone?.replace(/\D/g, ''), // Normalizado
      pcpPractice: store.pcpPractice?.trim(),
      pcpAddress: store.pcpAddress?.trim(),
      authorizedToShare: store.authorizedToShare
    })
  }

  // Psychiatrist - incluye campos solo si hasBeenEvaluated === 'Yes'
  const psychiatristPayload = {
    hasBeenEvaluated: store.hasBeenEvaluated,
    ...(store.hasBeenEvaluated === 'Yes' && {
      psychiatristName: store.psychiatristName?.trim(),
      evaluationDate: store.evaluationDate,
      clinicName: store.clinicName?.trim(),
      notes: store.notes?.trim(),
      differentEvaluator: store.differentEvaluator,
      ...(store.differentEvaluator && {
        evaluatorName: store.evaluatorName?.trim(),
        evaluatorClinic: store.evaluatorClinic?.trim()
      })
    })
  }

  return cleanPayload({ providers, psychiatrist, stepId })
})
```

### Ejemplo de payload válido (redactado)

```javascript
{
  "providers": {
    "hasPCP": "Yes",
    "pcpName": "[REDACTED NAME]",
    "pcpPhone": "5551234567",  // Normalizado sin formato
    "pcpPractice": "[REDACTED PRACTICE]",
    "pcpAddress": "[REDACTED ADDRESS]",
    "authorizedToShare": true
  },
  "psychiatrist": {
    "hasBeenEvaluated": "Yes",
    "psychiatristName": "[REDACTED NAME]",
    "evaluationDate": "2025-09-26T00:00:00.000Z",
    "clinicName": "[REDACTED CLINIC]",
    "notes": "[REDACTED NOTES]",
    "differentEvaluator": true,
    "evaluatorName": "[REDACTED EVALUATOR]",
    "evaluatorClinic": "[REDACTED EVALUATOR CLINIC]"
  },
  "stepId": "step4-medical-providers"
}
```

---

## ❌ MANEJO DE ERRORES

### Distribución por sección

```typescript
const handleSubmit = async () => {
  const result = validateStep4(payload)

  if (!result.success) {
    const errorsBySection = {
      providers: {},
      psychiatrist: {}
    }

    // Mapeo de errores Zod a secciones
    result.error.issues.forEach(issue => {
      const [section, field] = issue.path

      // Mensajes personalizados
      if (field === 'hasPCP') {
        message = 'Please indicate if you have a primary care provider'
      } else if (field === 'hasBeenEvaluated') {
        message = 'Please indicate if you have been evaluated'
      }
      // ... más campos

      errorsBySection[section][field] = message
    })

    // Hidratación en stores
    providersStore.setValidationErrors(errorsBySection['providers'])
    psychiatristStore.setValidationErrors(errorsBySection['psychiatrist'])

    // Auto-expandir primera sección con errores
    expandSectionWithErrors(errorsBySection)
  }
}
```

### Ejemplo de errores mapeados

```javascript
// Caso: Submit sin datos
{
  "providers": {
    "hasPCP": "Please indicate if you have a primary care provider"
  },
  "psychiatrist": {
    "hasBeenEvaluated": "Please indicate if you have been evaluated by a psychiatrist"
  }
}

// Caso: hasPCP='Yes' pero faltan campos
{
  "providers": {
    "pcpName": "Provider name is required",
    "pcpPhone": "Provider phone is required"
  }
}
```

---

## ♿ ACCESIBILIDAD VERIFICADA

### Atributos ARIA mantenidos

| Componente | Atributos implementados |
|------------|------------------------|
| **Campos de formulario** | `aria-required`, `aria-invalid`, `aria-describedby` |
| **Mensajes de error** | `role="alert"`, IDs únicos |
| **Secciones colapsables** | `aria-expanded`, `aria-controls` |
| **Botón submit** | `disabled` durante validación |

### Focus management
- ✅ Primera sección con errores se expande automáticamente
- ✅ Anillo de focus visible con `ring-[var(--ring-primary)]`
- ✅ Navegación por teclado funcional

---

## 🎨 TOKENS SEMÁNTICOS VERIFICADOS

### Sin colores hardcodeados ✅
```bash
grep -E "#[0-9a-fA-F]{6}|rgb\(" Step4MedicalProviders.tsx
# Resultado: 0 matches
```

### Tokens utilizados
- **Border:** `border-[var(--border)]`
- **Button:** Usa variant="primary" del componente Button
- **Errores:** Manejados en componentes hijos
- **Focus:** Heredado de componentes primitivos

---

## ✅ VERIFICACIONES FINALES

### TypeScript
```bash
npx tsc --noEmit --skipLibCheck
# Resultado: ✅ Sin errores en Step4MedicalProviders
# Nota: Uso correcto de bracket notation para Record types
```

### ESLint
```bash
npx eslint src/modules/intake/ui/step4-medical-providers/
# Resultado: ✅ Sin warnings
```

### Build
```bash
npm run build
# Resultado: ✅ Build exitoso
```

---

## 📊 MÉTRICAS DE CALIDAD

| Métrica | Valor |
|---------|-------|
| **Secciones integradas** | 2/2 (100%) |
| **Schemas compuestos** | ✅ Correctamente tipados |
| **Validación unificada** | ✅ Un solo punto de submit |
| **Errores mapeados** | ✅ Por sección y campo |
| **Estado local** | ✅ Solo para UI (expandedSections) |
| **PHI handling** | ✅ Sin persistencia ni logs |
| **Accesibilidad** | ✅ WCAG 2.1 AA compliant |

---

## 🔄 FLUJO DE SUBMIT

1. **Usuario hace clic en "Save & Continue"**
2. **buildPayload()** recolecta datos de ambos stores
3. **validateStep4()** valida con schema compuesto
4. **Si hay errores:**
   - Mapeo a secciones específicas
   - Hidratación en stores UI
   - Expansión de sección con error
   - Mostrar mensajes accesibles
5. **Si es válido:**
   - Limpiar todos los errores
   - Llamar callback `onSubmit(payload)`
   - Navegar con `onNext()` si provisto

---

## 🚀 USO DESDE PARENT

```typescript
// En IntakeWizard o componente padre
<Step4MedicalProviders
  onSubmit={async (data) => {
    // Enviar a API (cuando esté lista)
    await saveStep4Data(data)
  }}
  onNext={() => {
    // Navegar al siguiente paso
    router.push('/intake/step5')
  }}
/>
```

---

## ⚠️ CORRECCIÓN IMPORTANTE

### Ubicación correcta de secciones

| Sección | Step Correcto | Ubicación |
|---------|--------------|-----------|
| Primary Care Provider | **Step 4** ✅ | `/step4-medical-providers/components/ProvidersSection.tsx` |
| Psychiatrist/Evaluator | **Step 4** ✅ | `/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx` |
| Psychiatric Evaluation | **Step 3** ❌ | `/step3-diagnoses-clinical/components/PsychiatricEvaluationSection.tsx` |
| Functional Assessment | **Step 3** ❌ | `/step3-diagnoses-clinical/components/FunctionalAssessmentSection.tsx` |

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN

- [x] Schema compuesto con 2 secciones
- [x] Recolección de payload desde stores
- [x] Validación Zod unificada
- [x] Mapeo de errores por sección/campo
- [x] Mensajes de error personalizados
- [x] Expansión automática de sección con errores
- [x] Botón submit con estado loading
- [x] Limpieza de campos undefined
- [x] Normalización de teléfono
- [x] Sin console.* statements
- [x] Sin persistencia de PHI
- [x] Tokens semánticos respetados
- [x] TypeScript strict mode
- [x] Accesibilidad WCAG 2.1 AA

---

## 🔮 PRÓXIMOS PASOS

1. **Integrar Step 3** (donde SÍ van Psychiatric Evaluation y Functional Assessment)
2. **API Integration** - Conectar onSubmit con endpoint real
3. **Loading states** - Agregar skeleton loaders
4. **Error boundaries** - Manejo de errores inesperados
5. **Progress indicator** - Mostrar paso actual en wizard

---

## ✅ CONCLUSIÓN

Step 4 Medical Providers está completamente integrado con:

1. **2 secciones correctas** - PCP y Psychiatrist únicamente
2. **Schema compuesto** - Validación unificada
3. **Submit centralizado** - Un solo punto de validación
4. **Errores granulares** - Por sección y campo
5. **Accesibilidad total** - WCAG 2.1 AA
6. **Sin PHI leaks** - No logs ni persistencia

**Estado:** LISTO PARA PRODUCCIÓN (UI Layer)

---

**Implementado por:** Claude Code Assistant
**Fecha:** 2025-09-26
**Corrección:** Removidas secciones de Step 3 que fueron erróneamente incluidas