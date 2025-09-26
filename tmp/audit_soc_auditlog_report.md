# AUDITORÍA SOC - USO DE AUDITLOG ENTRE CAPAS
**Fecha:** 2025-09-26
**Objetivo:** Verificar cumplimiento de separación de capas (SoC)
**Estado:** ❌ VIOLACIÓN DETECTADA - INVERSIÓN DE DEPENDENCIAS

---

## 🎯 OBJETIVO

- Verificar cumplimiento del flujo: UI → Application → Domain → Infrastructure
- Identificar importaciones cruzadas Application → Infrastructure
- Proponer micro-fix sin romper funcionalidad

---

## ❌ VIOLACIÓN DE ARQUITECTURA DETECTADA

### Dependencia prohibida encontrada:

```
Application Layer → Infrastructure Layer
↑ INVERSIÓN DE DEPENDENCIA ↑
```

**Archivo origen (Application):**
`D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\diagnosisSuggestionService.ts`

**Línea 5:**
```typescript
import { auditLog } from '@/modules/intake/infrastructure/wrappers/security-wrappers'
```

**Archivo destino (Infrastructure):**
`D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts`

**Línea 397:**
```typescript
export { auditLog }
```

---

## 📊 MAPA DE DEPENDENCIAS CRUZADAS

### Casos detectados:

| Capa Origen | Archivo | Línea | Importa desde | Capa Destino |
|-------------|---------|-------|---------------|--------------|
| **Application** | diagnosisSuggestionService.ts | 5 | security-wrappers | **Infrastructure** |
| **Application** | auth.actions.ts | 6 | auth.adapter | **Infrastructure** |

### Grafo de violación:

```
┌─────────────┐
│     UI      │
└──────┬──────┘
       ↓ OK
┌─────────────┐
│ Application │──X──→ Infrastructure (VIOLACIÓN)
└──────┬──────┘
       ↓ OK
┌─────────────┐
│   Domain    │
└──────┬──────┘
       ↓ OK
┌─────────────┐
│Infrastructure│
└─────────────┘
```

---

## 🔍 ANÁLISIS DE CAUSA RAÍZ

### Por qué viola SoC:

1. **Inversión de dependencia:** Application depende de Infrastructure
2. **Acoplamiento fuerte:** Cambios en security-wrappers afectan Application
3. **Rompe el flujo unidireccional:** El flujo debe ser descendente (UI→App→Dom→Infra)
4. **Dificulta testing:** Application no puede testearse sin Infrastructure
5. **Viola principio de capas limpias:** Capas superiores no deben conocer detalles de implementación de capas inferiores

### Arquitectura esperada:

```
Application debe:
- Depender solo de Domain y shared utilities
- No conocer detalles de Infrastructure
- Usar abstracciones/interfaces cuando necesite servicios externos
```

### Arquitectura actual (incorrecta):

```
Application está:
- Importando directamente desde Infrastructure
- Acoplada a implementación específica de wrappers
- Violando el boundary entre capas
```

---

## 💡 MICRO-FIX PROPUESTO

### Solución: Reubicar auditLog en capa compartida

**Nueva ubicación propuesta:**
`D:\ORBIPAX-PROJECT\src\shared\utils\telemetry\audit-log.ts`

### Contenido del nuevo archivo:
```typescript
/**
 * Centralized audit logging utility
 * Shared across all layers without violating SoC
 */
export function auditLog(
  event: 'START' | 'COMPLETE' | 'ERROR' | 'AI_RAW',
  data: Record<string, any>,
  options?: {
    includeContext?: boolean
    context?: { organizationId?: string; userId?: string }
  }
) {
  // ... misma implementación actual
}
```

### Archivos a actualizar:

| Archivo | Cambio requerido |
|---------|-----------------|
| `security-wrappers.ts` | - Eliminar export de auditLog<br>+ Importar desde shared/utils |
| `diagnosisSuggestionService.ts` | Cambiar import a shared/utils |

### Cambios específicos:

#### 1. security-wrappers.ts:
```typescript
// Eliminar línea 397:
- export { auditLog }

// Agregar en imports (línea 9):
+ import { auditLog } from '@/shared/utils/telemetry/audit-log'

// Eliminar función local auditLog (líneas 13-47)
```

#### 2. diagnosisSuggestionService.ts:
```typescript
// Línea 5 - cambiar:
- import { auditLog } from '@/modules/intake/infrastructure/wrappers/security-wrappers'
+ import { auditLog } from '@/shared/utils/telemetry/audit-log'
```

---

## ✅ BENEFICIOS DEL FIX

### Arquitectura corregida:
```
┌─────────────┐
│     UI      │
└──────┬──────┘
       ↓
┌─────────────┐      ┌────────────┐
│ Application │ ←────│   Shared   │
└──────┬──────┘      │   Utils    │
       ↓             │ (auditLog) │
┌─────────────┐      └────────────┘
│   Domain    │            ↑
└──────┬──────┘            │
       ↓                   │
┌─────────────┐            │
│Infrastructure│ ──────────┘
└─────────────┘
```

### Ventajas:
1. ✅ Elimina inversión de dependencias
2. ✅ Respeta flujo unidireccional
3. ✅ Shared es accesible desde todas las capas
4. ✅ Facilita testing y mocking
5. ✅ Reduce acoplamiento

---

## 📈 ANÁLISIS DE RIESGO

### Impacto: **BAJO**

| Aspecto | Riesgo | Mitigación |
|---------|--------|------------|
| Funcionalidad | Ninguno | Mismo código, diferente ubicación |
| Performance | Ninguno | Sin cambios en ejecución |
| Regresión | Bajo | Solo 2 archivos afectados |
| Testing | Positivo | Más fácil de mockear |
| Build | Mínimo | Solo paths de import |

### Esfuerzo estimado:
- Crear archivo: 5 min
- Actualizar imports: 2 min
- Verificar build: 3 min
- **Total: ~10 minutos**

---

## 🚀 PRÓXIMOS PASOS (NO EN ESTA TAREA)

1. **Crear** `src/shared/utils/telemetry/audit-log.ts`
2. **Mover** función auditLog al nuevo archivo
3. **Actualizar** imports en 2 archivos
4. **Verificar** build y tests
5. **Considerar** migrar otros console.* al mismo servicio

---

## ✨ CONCLUSIÓN

**Violación detectada:** Application importa directamente desde Infrastructure.

**Causa:** auditLog exportado desde security-wrappers.ts (Infrastructure).

**Solución:** Mover auditLog a shared/utils/telemetry para acceso universal sin violar SoC.

**Prioridad:** ALTA - Viola principios arquitectónicos fundamentales.

---

**Auditoría por:** Claude Code Assistant
**Método:** Análisis estático de dependencias
**Confianza:** 100% - Violación verificable en código