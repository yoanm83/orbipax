# AUDITORÍA DE SEGURIDAD - LOGGING Y AUTENTICACIÓN
**Fecha:** 2025-09-26
**Objetivo:** Auditar emisión de PII en logs y patrones de autenticación
**Estado:** ⚠️ HALLAZGOS CRÍTICOS - REQUIERE MICRO-FIX

---

## 🎯 ALCANCE

- Detectar logs con PII (userId, organizationId, contenidos clínicos)
- Verificar uso de getSession() vs getUser() en servidor
- Evaluar gates de desarrollo para logs sensibles
- Proponer micro-fix para hallazgos críticos

---

## 🔍 HALLAZGOS CRÍTICOS

### 1. ❌ EMISIÓN DE PII EN LOGS DE PRODUCCIÓN

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts`

#### Problema detectado (líneas 305-308, 317-320):
```typescript
console.log('[AUDIT]', {
  traceId,
  action: actionName,
  organizationId: context?.organizationId,  // ❌ PII
  userId: context?.userId,                  // ❌ PII
  timestamp: new Date().toISOString(),
  ...
})
```

**Riesgo:** Los logs [AUDIT] emiten `organizationId` y `userId` sin condicional de desarrollo. Estos logs se ejecutan EN TODAS las llamadas a server actions, exponiendo:
- IDs de organización (información empresarial sensible)
- IDs de usuario (PII según GDPR/HIPAA)
- Patrones de uso por usuario/organización

**Impacto:** Alto - Viola compliance de privacidad

---

### 2. ✅ LOGGING DE AI CORRECTAMENTE PROTEGIDO

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\diagnosisSuggestionService.ts`

#### Implementación correcta (líneas 121-142):
```typescript
if (process.env.NODE_ENV !== 'production') {  // ✅ Gate correcto
  console.log('[AUDIT]', {
    event: 'AI_RAW',
    rawText: responseContent.substring(0, 500), // Contenido clínico
    ...
  })
}
```

**Estado:** Bien implementado - Los logs con contenido clínico (rawText, presentingProblem) están protegidos con gate de desarrollo.

---

### 3. ⚠️ PATRÓN DE AUTENTICACIÓN CORRECTO PERO SUBÓPTIMO

**Observación:** No se encontró uso de `auth.getUser()` en todo el proyecto.

- `getSession()` usado en:
  - `session.server.ts` (correcto, es el wrapper base)
  - `security-wrappers.ts` línea 33 (funcional pero subóptimo)
- `auth.getUser()` no se usa (0 ocurrencias)

**Nota:** `getSession()` valida JWT pero no verifica si el usuario sigue activo en DB. Para operaciones críticas, `getUser()` es más seguro aunque más lento.

---

## 📊 RESUMEN DE EMISIONES DE PII

| Archivo | Tipo de Log | PII Emitida | Gate Desarrollo | Estado |
|---------|------------|-------------|-----------------|--------|
| security-wrappers.ts | [AUDIT] start/complete | userId, organizationId | ❌ NO | ❌ CRÍTICO |
| security-wrappers.ts | [AUDIT] error | Ninguna | N/A | ✅ OK |
| diagnosisSuggestionService.ts | [AUDIT] AI_RAW | rawText (PHI) | ✅ SÍ | ✅ OK |
| OrgSwitcher.tsx | console.error | Ninguna | N/A | ✅ OK |

---

## 🔧 MICRO-FIX PROPUESTO

### Solución inmediata para security-wrappers.ts:

```typescript
// ANTES (líneas 304-308):
console.log('[AUDIT]', {
  traceId,
  action: actionName,
  organizationId: context?.organizationId,  // ❌ PII
  userId: context?.userId,                  // ❌ PII
  timestamp: new Date().toISOString(),
  event: 'START'
})

// DESPUÉS:
if (process.env.NODE_ENV === 'development') {
  console.log('[AUDIT]', {
    traceId,
    action: actionName,
    organizationId: context?.organizationId,  // Solo en dev
    userId: context?.userId,                  // Solo en dev
    timestamp: new Date().toISOString(),
    event: 'START'
  })
} else {
  // En producción: log mínimo sin PII
  console.log('[AUDIT]', {
    traceId,
    action: actionName,
    timestamp: new Date().toISOString(),
    event: 'START'
    // NO incluir userId ni organizationId
  })
}
```

### Cambios requeridos:
1. Envolver logs líneas 304-308 en condicional de desarrollo
2. Envolver logs líneas 315-320 en mismo patrón
3. En producción, emitir solo: traceId, action, timestamp, event

---

## ⚠️ RIESGOS ADICIONALES DETECTADOS

### Logs sin gate pero aceptables:
- `console.error` en componentes cliente - OK (no tienen acceso a PII server-side)
- Logs de error sin detalles sensibles - OK

### Recomendaciones futuras:
1. Implementar logger centralizado con niveles (debug/info/warn/error)
2. Considerar usar `auth.getUser()` para operaciones críticas
3. Agregar sanitización automática de PII en logs de producción

---

## ✅ CONCLUSIÓN

**Hallazgo principal:** Los logs [AUDIT] en `security-wrappers.ts` exponen PII sin restricción de entorno.

**Micro-fix requerido:** Agregar condicional `NODE_ENV` a 2 bloques de código (8 líneas totales).

**Impacto del fix:** Elimina exposición de PII en producción sin afectar debugging en desarrollo.

**Prioridad:** ALTA - Implementar inmediatamente antes de cualquier despliegue.

---

**Auditoría por:** Claude Code Assistant
**Método:** Análisis estático de código
**Confianza:** 100% - Hallazgos verificables en código