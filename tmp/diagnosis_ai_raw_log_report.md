# DIAGNÓSTICO AI VACÍO EN STEP 3 - LOG DE PAYLOAD CRUDO
**Fecha:** 2025-09-26
**Objetivo:** Auditar e instrumentar logging para capturar payload crudo de la IA
**Estado:** ✅ CAUSA RAÍZ IDENTIFICADA - CATEGORÍA B

---

## 🎯 OBJETIVO

- Confirmar si el proveedor de IA devuelve contenido y si el mapper/normalizador lo vacía
- Capturar payload crudo, array suggestions, y clasificar causa
- Ejecutar 1 prueba y documentar resultado sin exponer datos sensibles

---

## 📝 ARCHIVO INSTRUMENTADO

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\diagnosisSuggestionService.ts`

### Instrumentación agregada (Líneas 114-136):
```typescript
// DEV ONLY: Log raw AI response for debugging
if (process.env.NODE_ENV !== 'production') {
  const traceId = crypto.randomUUID()
  console.log('[AUDIT]', {
    event: 'AI_RAW',
    action: 'generate_diagnosis_suggestions',
    traceId,
    timestamp,
    rawText: responseContent.substring(0, 500),
    parsedType: Array.isArray(parsed) ? 'array' : 'object',
    suggestionsLength: suggestions.length,
    suggestionsPreview: suggestions.length > 0 ? {...},
    inputSummary: { inputLength, wordCount, language }
  })
}
```

---

## 🔬 EVIDENCIA CAPTURADA

### Log AI_RAW (TraceId: 8e33e245-dd45-4938-83a7-6975205a890d)

```javascript
{
  event: 'AI_RAW',
  action: 'generate_diagnosis_suggestions',
  traceId: '8e33e245-dd45-4938-83a7-6975205a890d',
  timestamp: '2025-09-26T01:33:47.054Z',
  rawText: '{
    "code": "F32.1",
    "description": "Major Depressive Disorder, Single Episode, Moderate",
    "type": "Primary",
    "severity": "Moderate",
    "confidence": 80,
    "note": "Symptoms indicate a moderate episode of depression lasting over two weeks."
  }',
  parsedType: 'object',
  suggestionsLength: 0,          // ⚠️ CLAVE: Array vacío
  suggestionsPreview: null,
  inputSummary: {
    inputLength: 145,
    wordCount: 21,
    language: 'english'
  }
}
```

### Error de validación Zod:
```
[DiagnosisSuggestionService] Zod validation failed: Error [ZodError]: [
  {
    "origin": "array",
    "code": "too_small",
    "minimum": 1,
    "path": [],
    "message": "Too small: expected array to have >=1 items"
  }
]
```

---

## 🎯 CLASIFICACIÓN: CATEGORÍA B

### B) Mapper vacía la lista

**Evidencia:**
1. **OpenAI devuelve contenido válido:** Un objeto JSON con todos los campos requeridos
2. **El mapper extrae un array vacío:** `suggestionsLength: 0`
3. **Zod rechaza array vacío:** Requiere mínimo 1 elemento

### Análisis del problema:

```typescript
// Línea 112 - El problema está aquí:
const suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions ?? [])
```

**¿Qué sucede?**
- OpenAI retorna un **OBJETO ÚNICO** (no un array): `{ "code": "F32.1", ... }`
- El código espera un **ARRAY** o un objeto con campo `suggestions`
- Como `parsed` no es array Y no tiene campo `suggestions`, retorna `[]` (array vacío)

---

## ✅ MICRO-FIX PROPUESTO

### Opción 1: Ajustar el mapper para manejar objeto único
```typescript
// Línea 112 - CAMBIAR DE:
const suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions ?? [])

// A:
const suggestions = Array.isArray(parsed)
  ? parsed
  : (parsed.suggestions ?? (parsed.code ? [parsed] : []))
```

### Opción 2: Modificar el prompt para forzar array (RECOMENDADO)
```typescript
// Línea 97 - CAMBIAR response_format:
response_format: { type: 'json_object' },

// A:
response_format: undefined,  // Permitir respuesta libre pero controlada por prompt
```

Y ajustar el prompt en línea 56:
```typescript
// AGREGAR al systemPrompt:
"CRITICAL: You MUST return an ARRAY even for single diagnosis.
Never return a single object. Always wrap in [brackets]."
```

---

## 📊 RESUMEN DE HALLAZGOS

### Problema identificado:
- **Proveedor (OpenAI):** ✅ Devuelve datos válidos
- **Mapper (línea 112):** ❌ No maneja objeto único, lo convierte en array vacío
- **Validación (Zod):** ❌ Rechaza array vacío (min 1 elemento)

### Flujo actual vs esperado:

```
ACTUAL:
OpenAI → { "code": "F32.1", ... } → mapper → [] → Zod → FAIL

ESPERADO:
OpenAI → [{ "code": "F32.1", ... }] → mapper → [...] → Zod → OK
```

---

## 🔧 PRÓXIMOS PASOS

1. **Aplicar micro-fix recomendado:**
   - Modificar mapper para envolver objeto único en array
   - O ajustar prompt para garantizar respuesta en array

2. **Validar con múltiples casos:**
   - Input en español
   - Síntomas múltiples
   - Casos edge (sin síntomas claros)

3. **Considerar ajustes adicionales:**
   - Temperatura del modelo (actualmente 0.3)
   - Límite de tokens (actualmente 500)
   - Modelo usado (gpt-4o-mini)

---

## 🚀 CONCLUSIÓN

**Causa raíz:** El mapper no maneja correctamente cuando OpenAI retorna un objeto único en lugar de un array.

**Solución inmediata:** Ajustar línea 112 para detectar objeto con campo `code` y envolverlo en array.

**Impacto esperado:** Step 3 comenzará a mostrar sugerencias de diagnóstico correctamente.

---

**Instrumentación por:** Claude Code Assistant
**Test ejecutado:** 1 vez con input de depresión
**Clasificación:** B - Mapper vacía la lista
**Confianza:** 100% - Evidencia clara en logs