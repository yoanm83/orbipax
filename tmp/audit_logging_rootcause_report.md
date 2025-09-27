# AUDITORÍA INTEGRAL DE TELEMETRÍA - ANÁLISIS DE CAUSA RAÍZ
**Fecha:** 2025-09-26
**Objetivo:** Identificar la fuente exacta de emisión de sample y PII en logs
**Estado:** ✅ CAUSA RAÍZ IDENTIFICADA

---

## 📋 RESUMEN EJECUTIVO

**Causa raíz identificada:** El campo `sample` con texto clínico (hasta 120 caracteres) sigue siendo incluido en desarrollo debido a una lógica dual en el flujo:

1. **diagnosisSuggestionService.ts (línea 129)** - SIEMPRE crea `sample` cuando `NODE_ENV !== 'production'`
2. **audit-log.ts (línea 30)** - Solo elimina `sample` cuando `NODE_ENV === 'production'`

**Resultado:** En desarrollo, el `sample` se crea Y se emite, exponiendo potencial PHI.

---

## 🔍 HALLAZGOS DETALLADOS

### 1. Construcción de responseSummary con sample

| Archivo | Línea | Tipo | Código |
|---------|-------|------|---------|
| **diagnosisSuggestionService.ts** | 122-134 | Construcción | `if (process.env.NODE_ENV !== 'production')` |
| | 129 | **GENERA SAMPLE** | `sample: responseContent.substring(0, 120)` |
| | 136 | Envío a auditLog | `auditLog('AI_RAW', { responseSummary: safeSummary })` |

**Evidencia - líneas 125-134:**
```typescript
// Create safe summary without exposing clinical content
const safeSummary = {
  length: responseContent.length,
  wordCount: responseContent.split(/\s+/).length,
  sample: responseContent.substring(0, 120).replace(/\n/g, ' '), // ❌ PROBLEMA: Incluye texto clínico
  hash: responseContent.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0
  }, 0).toString(16)
}
```

### 2. Sanitización en audit-log.ts

| Archivo | Línea | Tipo | Código |
|---------|-------|------|---------|
| **audit-log.ts** | 15-16 | Gates | `isDev = NODE_ENV !== 'production'`<br>`isProd = NODE_ENV === 'production'` |
| | 30-33 | Sanitización condicional | `if (event === 'AI_RAW' && isProd)` |
| | 31 | **ELIMINA SAMPLE** | `const { sample, ...safeResponseSummary }` |

**Evidencia - líneas 29-33:**
```typescript
// For AI_RAW events in production, remove the sample field
if (event === 'AI_RAW' && isProd && cleanedData['responseSummary']) {
  const { sample, ...safeResponseSummary } = cleanedData['responseSummary']
  cleanedData['responseSummary'] = safeResponseSummary
}
```

**Problema:** Solo elimina `sample` en producción (`isProd`), pero en desarrollo pasa directo.

### 3. Flujo de emisión completo

```
1. diagnosisSuggestionService.ts:
   └─ NODE_ENV !== 'production' → Crea safeSummary CON sample
      └─ auditLog('AI_RAW', { responseSummary: safeSummary })

2. audit-log.ts:
   └─ Recibe data con responseSummary.sample
      └─ NODE_ENV === 'production' → Elimina sample ✅
      └─ NODE_ENV !== 'production' → MANTIENE sample ❌
         └─ console.log('[AUDIT]', logData) → Sample visible en consola
```

---

## 🚨 RUTAS PARALELAS DE LOGGING

### Console.* directos en UI (fuera del flujo de diagnóstico)

| Archivo | Líneas | Impacto |
|---------|--------|---------|
| appointments/new/page.tsx | 61, 64 | Bajo - UI logs |
| appointments/[id]/start/page.tsx | 45, 53, 62 | Bajo - UI logs |
| notes/[id]/page.tsx | 35, 73, 132, 136, 140, 160, 164, 181, 189, 193, 203 | Bajo - UI logs |

**Análisis:** Estos console.* están en componentes UI, no en el flujo de diagnóstico. No emiten PHI del AI.

### Otros mecanismos de telemetría

| Archivo | Línea | Tipo | Estado |
|---------|-------|------|--------|
| ErrorBoundary/index.tsx | 21, 42, 53 | Comentarios sobre telemetría | ✅ Solo comentarios |
| wrappers/index.ts | 159 | Constante de error | ✅ Solo definición |

**Conclusión:** No hay loggers paralelos activos. Todo pasa por `auditLog()`.

---

## 🎯 CAUSA RAÍZ ÚNICA

**El problema ocurre en DOS puntos que deben alinearse:**

1. **ORIGEN:** `diagnosisSuggestionService.ts` línea 129 - Crea `sample` en desarrollo
2. **EMISIÓN:** `audit-log.ts` línea 30 - No elimina `sample` en desarrollo

**Escenario actual en desarrollo (NODE_ENV !== 'production'):**
- diagnosisSuggestionService CREA sample con 120 chars de texto clínico
- audit-log NO ELIMINA sample porque solo sanitiza en producción
- **Resultado:** Sample con PHI se emite en logs de desarrollo

---

## 💡 MICRO-FIX PROPUESTO

### Opción A: Eliminar sample en el origen (RECOMENDADO)

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\diagnosisSuggestionService.ts`
**Línea:** 129

**Cambio:**
```typescript
// ANTES (línea 129):
sample: responseContent.substring(0, 120).replace(/\n/g, ' '), // Max 120 chars, no newlines

// DESPUÉS (eliminar línea 129 completamente)
// sample removido - solo metadatos neutros
```

**Resultado:** safeSummary solo contendría `{ length, wordCount, hash }` sin sample.

### Opción B: Sanitizar siempre en audit-log

**Archivo:** `D:\ORBIPAX-PROJECT\src\shared\utils\telemetry\audit-log.ts`
**Línea:** 30

**Cambio:**
```typescript
// ANTES (línea 30):
if (event === 'AI_RAW' && isProd && cleanedData['responseSummary']) {

// DESPUÉS (línea 30):
if (event === 'AI_RAW' && cleanedData['responseSummary']) {
  // Eliminar sample SIEMPRE, no solo en producción
```

**Resultado:** Sample nunca se emitiría, ni en dev ni en prod.

### Opción C: Gate explícito con variable de entorno DEBUG

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\diagnosisSuggestionService.ts`
**Línea:** 126-134

**Cambio:**
```typescript
const safeSummary = {
  length: responseContent.length,
  wordCount: responseContent.split(/\s+/).length,
  // Solo incluir sample si DEBUG_AI_RESPONSES está explícitamente activado
  ...(process.env.DEBUG_AI_RESPONSES === 'true' && {
    sample: responseContent.substring(0, 120).replace(/\n/g, ' ')
  }),
  hash: responseContent.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0
  }, 0).toString(16)
}
```

---

## ✅ PLAN DE VERIFICACIÓN

### 1. Desarrollo (NODE_ENV !== 'production'):
```bash
# Ejecutar "Generate Diagnosis Suggestions"
# Esperado con fix:
[AUDIT] {
  event: 'AI_RAW',
  timestamp: '2025-09-26T...',
  responseSummary: {
    length: 487,
    wordCount: 62,
    hash: '-1a2b3c4d'
    # ✅ SIN sample
  }
}
```

### 2. Producción (NODE_ENV=production):
```bash
# Misma verificación
# Esperado: Idéntico (sin sample)
```

### 3. Criterios de aceptación:
- ✅ No hay campo `sample` en logs AI_RAW
- ✅ Metadatos útiles preservados (length, wordCount, hash)
- ✅ Sin regresión en funcionalidad de diagnóstico
- ✅ Sin PII/PHI en ningún entorno

---

## 📊 MATRIZ DE DECISIÓN

| Opción | Complejidad | Impacto | Riesgo | Recomendación |
|--------|-------------|---------|--------|---------------|
| **A: Eliminar en origen** | Baja (1 línea) | Alto | Mínimo | ✅ **RECOMENDADA** |
| B: Sanitizar siempre | Baja (1 condición) | Alto | Mínimo | ✅ Alternativa válida |
| C: Gate DEBUG explícito | Media (condicional) | Alto | Bajo | ⚠️ Para casos especiales |

---

## ✨ CONCLUSIÓN

**Causa raíz confirmada:**
- `diagnosisSuggestionService.ts` línea 129 crea `sample` con texto clínico
- `audit-log.ts` línea 30 solo lo elimina en producción, no en desarrollo

**Micro-fix recomendado:**
- **Eliminar línea 129** en diagnosisSuggestionService.ts
- Simple, efectivo, sin efectos secundarios
- Cumple política "sin PHI en logs" completamente

**Estado:** Listo para implementación con 1 línea de cambio.

---

**Auditoría por:** Claude Code Assistant
**Método:** Análisis exhaustivo de flujo de datos
**Confianza:** 100% - Causa raíz identificada con precisión