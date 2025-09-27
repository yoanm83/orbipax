# PHONE FIELDS AUDIT - HOMOGENIZATION REPORT

**Fecha:** 2025-09-26
**Estado:** 🔍 AUDIT-ONLY
**Tipo:** Inventario exhaustivo de implementaciones de phone/tel
**Alcance:** Todo el repositorio OrbiPax

---

## 📋 RESUMEN EJECUTIVO

### Situación Actual
- **Utility compartida creada:** `@/shared/utils/phone.ts` ✅
- **Componentes con phone fields:** 15+ archivos identificados
- **Implementaciones heterogéneas:** Mix de regex inline, helpers locales, y utility nueva
- **Riesgo de inconsistencia:** ALTO - múltiples patrones de validación/formateo

### Key Findings
1. **Step 4 (Providers)** tiene su propia implementación duplicada de `normalizePhoneNumber`
2. **Step 1 (Demographics)** usa formateo local inline en múltiples componentes
3. **Step 5 (Pharmacy)** ya usa la utility compartida correctamente ✅
4. **Schemas Zod** usan regex directas inconsistentes
5. **Legacy** tiene implementaciones propias (fuera de scope)

---

## 🗂️ INVENTARIO POR MÓDULO

### ✅ STEP 5 - MEDICATIONS (Ya homogeneizado)
| Archivo | Línea | Implementación | Usa Utility | Gap |
|---------|-------|---------------|-------------|-----|
| `pharmacyInformation.schema.ts` | 10, 30 | `validatePhoneNumber` | ✅ Sí | Ninguno |
| `PharmacyInformationSection.tsx` | 11, 87, 91 | `formatPhoneInput`, `normalizePhoneNumber` | ✅ Sí | Ninguno |

**Estado:** COMPLIANT - Ya usa utility compartida correctamente

---

### ⚠️ STEP 4 - MEDICAL PROVIDERS (Duplicación)
| Archivo | Línea | Implementación | Usa Utility | Gap |
|---------|-------|---------------|-------------|-----|
| `providers.schema.ts` | 18-19 | `normalizePhoneNumber` LOCAL | ❌ No | Función duplicada |
| `providers.schema.ts` | 25-27 | `isValidPhoneNumber` LOCAL | ❌ No | Lógica duplicada |
| `providers.schema.ts` | 33-35 | `formatPhoneDisplay` LOCAL | ❌ No | Función duplicada |
| `providers.schema.ts` | 62 | `.transform(normalizePhoneNumber)` | ❌ No | Usa local |
| `ProvidersSection.tsx` | 24-26 | `normalizePhoneNumber` LOCAL | ❌ No | Función duplicada |
| `ProvidersSection.tsx` | 334 | Usa `normalizePhoneNumber` local | ❌ No | No usa utility |
| `providers.ui.slice.ts` | 11-12 | `normalizePhoneNumber` LOCAL | ❌ No | Función duplicada |
| `providers.ui.slice.ts` | 15-17 | `formatPhoneDisplay` LOCAL | ❌ No | Función duplicada |

**Estado:** HIGH RISK - Múltiples implementaciones locales duplicadas
**Impacto:** Validación y formateo inconsistente con resto del sistema

---

### ⚠️ STEP 1 - DEMOGRAPHICS (Formateo local)
| Archivo | Línea | Implementación | Usa Utility | Gap |
|---------|-------|---------------|-------------|-----|
| `ContactSection.tsx` | 39-51 | `formatPhoneNumber` LOCAL | ❌ No | Función local inline |
| `ContactSection.tsx` | 92, 109, 210 | Usa formateo local | ❌ No | No usa utility |
| `LegalSection.tsx` | 41-53 | `formatPhoneNumber` LOCAL | ❌ No | Función local inline |
| `LegalSection.tsx` | 165, 229 | Usa formateo local | ❌ No | No usa utility |

**Estado:** MEDIUM RISK - Formateo inconsistente
**Impacto:** UX inconsistente, formateo diferente entre secciones

---

### ⚠️ DOMAIN SCHEMAS (Regex directas)
| Archivo | Línea | Implementación | Usa Utility | Gap |
|---------|-------|---------------|-------------|-----|
| `demographics.schema.ts` | 149 | `.regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)` | ❌ No | Regex inline |
| `goals.schema.ts` | 331, 338 | `.regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)` | ❌ No | Regex inline |
| `consents.schema.ts` | 148, 156, 423 | `.regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)` | ❌ No | Regex inline |
| `providers.schema.ts` | 358, 359 | `.regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)` | ❌ No | Regex inline |

**Estado:** HIGH RISK - Regex diferente a utility (más estricta)
**Impacto:** Validación inconsistente entre schemas y UI

---

### ℹ️ LEGACY (Fuera de scope)
| Archivo | Cantidad | Nota |
|---------|----------|------|
| `legacy/intake/step1-demographics/ContactSection.tsx` | 3 funciones | Ignorar - legacy |
| `legacy/intake/step1-demographics/LegalSection.tsx` | 3 funciones | Ignorar - legacy |
| `legacy/intake/step4-medical-providers/*` | Multiple | Ignorar - legacy |

---

## 🔍 ANÁLISIS DE BRECHAS

### 1. Regex Patterns Comparison
| Fuente | Pattern | Acepta |
|--------|---------|--------|
| **Utility compartida** | `/^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/` | Flexible, múltiples formatos |
| **Domain schemas** | `/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/` | Estricto, solo dígitos, área 2-9 |
| **Step 4 local** | `.length >= 10` (solo cuenta dígitos) | Muy básico |

**PROBLEMA:** Schemas más estrictos que UI, puede causar falsos negativos

### 2. Funciones Duplicadas
```typescript
// Step 4 tiene 3 copias de:
normalizePhoneNumber() // providers.schema.ts, ProvidersSection.tsx, providers.ui.slice.ts
formatPhoneDisplay()   // providers.schema.ts, providers.ui.slice.ts
isValidPhoneNumber()   // providers.schema.ts

// Step 1 tiene 2 copias de:
formatPhoneNumber()    // ContactSection.tsx, LegalSection.tsx
```

### 3. Coverage de Utility
| Función Utility | Step 1 | Step 4 | Step 5 | Schemas |
|----------------|--------|--------|--------|---------|
| `validatePhoneNumber` | ❌ | ❌ | ✅ | ❌ |
| `normalizePhoneNumber` | ❌ | ❌* | ✅ | ❌ |
| `formatPhoneNumber` | ❌* | ❌* | ❌ | N/A |
| `formatPhoneInput` | ❌ | ❌ | ✅ | N/A |

*Tiene implementación local propia

---

## 📝 PLAN DE REMEDIACIÓN

### Fase 1: Schemas (ALTA PRIORIDAD)
**Riesgo:** Validación inconsistente puede bloquear submits válidos

#### Task 1.1: Update demographics.schema.ts
```typescript
// REPLACE línea 149:
phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)
// WITH:
import { validatePhoneNumber } from '@/shared/utils/phone'
phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number')
```

#### Task 1.2: Update goals.schema.ts
```typescript
// REPLACE líneas 331, 338:
phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)
// WITH:
import { validatePhoneNumber } from '@/shared/utils/phone'
phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number')
```

#### Task 1.3: Update consents.schema.ts
```typescript
// REPLACE líneas 148, 156, 423:
phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)
// WITH:
import { validatePhoneNumber } from '@/shared/utils/phone'
phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number')
```

#### Task 1.4: Update providers.schema.ts (domain level)
```typescript
// REPLACE líneas 358, 359:
phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/)
// WITH:
import { validatePhoneNumber } from '@/shared/utils/phone'
phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number')
```

---

### Fase 2: Step 4 Medical Providers (ALTA PRIORIDAD)
**Riesgo:** Triple duplicación de lógica

#### Task 2.1: Update step4/providers.schema.ts
```typescript
// REMOVE líneas 17-40 (funciones locales)
// REPLACE línea 62:
.transform(normalizePhoneNumber)
// WITH:
import { normalizePhoneNumber } from '@/shared/utils/phone'
.transform(normalizePhoneNumber)
```

#### Task 2.2: Update ProvidersSection.tsx
```typescript
// REMOVE líneas 23-26 (normalizePhoneNumber local)
// ADD import:
import { normalizePhoneNumber, formatPhoneInput } from '@/shared/utils/phone'
// UPDATE línea 334 handler para usar formatPhoneInput
```

#### Task 2.3: Update providers.ui.slice.ts
```typescript
// REMOVE líneas 10-27 (funciones locales)
// ADD import:
import { normalizePhoneNumber, formatPhoneNumber } from '@/shared/utils/phone'
// UPDATE referencias a funciones locales
```

---

### Fase 3: Step 1 Demographics (MEDIA PRIORIDAD)
**Riesgo:** Formateo inconsistente en UI

#### Task 3.1: Update ContactSection.tsx
```typescript
// REMOVE líneas 38-53 (formatPhoneNumber local)
// ADD import:
import { formatPhoneInput } from '@/shared/utils/phone'
// REPLACE líneas 92, 109, 210:
const formatted = formatPhoneNumber(e.target.value)
// WITH:
const formatted = formatPhoneInput(e.target.value, currentValue)
```

#### Task 3.2: Update LegalSection.tsx
```typescript
// REMOVE líneas 40-55 (formatPhoneNumber local)
// ADD import:
import { formatPhoneInput } from '@/shared/utils/phone'
// REPLACE líneas 165, 229:
const formatted = formatPhoneNumber(e.target.value)
// WITH:
const formatted = formatPhoneInput(e.target.value, currentValue)
```

---

## 📊 MÉTRICAS DE IMPACTO

| Módulo | Archivos | Funciones Duplicadas | Líneas a Cambiar | Prioridad |
|--------|----------|---------------------|------------------|-----------|
| Domain Schemas | 4 | 0 | ~8 | ALTA |
| Step 4 | 3 | 6 | ~50 | ALTA |
| Step 1 | 2 | 2 | ~30 | MEDIA |
| **TOTAL** | **9** | **8** | **~88** | - |

---

## ✅ BENEFICIOS ESPERADOS

1. **Consistencia de Validación:** Un solo patrón regex en toda la app
2. **Mantenimiento Simplificado:** Una sola fuente de verdad
3. **UX Uniforme:** Mismo formateo en todos los inputs
4. **Reducción de Código:** -8 funciones duplicadas (~100 líneas)
5. **Testing Centralizado:** Solo testear utility, no cada implementación

---

## ⚠️ RIESGOS Y MITIGACIONES

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Regex más permisiva en utility | Schemas aceptarán más formatos | Beneficio: mejor UX, menos rechazos |
| Breaking changes en validación | Forms existentes podrían fallar | Test cada módulo por separado |
| Formateo diferente en UI | Usuarios notan cambio visual | Aplicar gradualmente por step |

---

## 🚀 RECOMENDACIONES

### Inmediato (Sprint actual)
1. **Homogeneizar schemas** - Task 1.1-1.4 (crítico para consistencia)
2. **Limpiar Step 4** - Task 2.1-2.3 (eliminar duplicación)

### Próximo Sprint
3. **Actualizar Step 1** - Task 3.1-3.2 (mejorar UX)
4. **Agregar tests** a utility compartida
5. **Documentar** patrones aceptados en utility

### Futuro
6. Considerar máscara de input más robusta (librería)
7. Soporte internacional (no solo US)
8. Validación por tipo de phone (mobile vs landline)

---

## ✅ CONFIRMACIÓN DE GUARDRAILS

- ✅ **Sin PHI:** Este reporte no contiene datos personales
- ✅ **Audit-only:** No se modificó ningún archivo fuera de /tmp
- ✅ **Arquitectura respetada:** Plan mantiene SoC y capas
- ✅ **A11y considerada:** Cambios no afectan accesibilidad
- ✅ **Tokens preservados:** Sin cambios a estilos/tokens

---

**Generado por:** Claude Code Assistant
**Fecha:** 2025-09-26
**Tipo:** AUDIT-ONLY - Sin cambios aplicados