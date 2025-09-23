# AUDIT SUMMARY - Sentinel v1.1 Smoke Tests

## 📋 Contexto de la Tarea

**Objetivo**: Ejecutar pruebas de humo del Sentinel v1.1 para validar la detección de violaciones sintéticas en modos FAST y FULL.

**Alcance**: Crear archivos de prueba controlados que disparen los principales reason codes (PATH_GUESS, UI_HARDCODE, SOC_VIOLATION, RLS_RISK, NO_ZOD_SCHEMA, WRAPPERS_MISSING) sin modificar código de producto real.

**Deliverable**: Reporte de resultados con métricas de tiempo y precisión de detección.

## 🔍 Búsqueda por Directorios

Se creará estructura de pruebas en:
- `scripts/sentinel/_smoke/` - Directorio de archivos sintéticos
- `scripts/sentinel/_smoke/ui/components/` - Componentes UI con violaciones
- `scripts/sentinel/_smoke/api/actions/` - Endpoints API con violaciones
- `scripts/sentinel/_smoke/infrastructure/repositories/` - Repositorios con violaciones RLS

Los archivos de prueba están aislados del código de producto en src/ y modules/.

## 🏗️ Arquitectura & Capas

**Pruebas SOC_VIOLATION**: UI→Application→Domain→Infrastructure
- Componente UI importando directamente desde Domain e Infrastructure
- Validación de boundaries según manifiestos SoC v1.1

**Violaciones deliberadas**:
- UI importing from @/modules/*/domain
- UI importing from @/modules/*/infrastructure
- Domain layer violations si se crean

## 🔒 RLS/Multi-tenant

**Pruebas RLS_RISK**: organization_id filtering
- Queries a tablas clínicas (patients, appointments, notes) sin filtros
- JOINs sin organization_id matching
- Explicit RLS bypass (.rls(false))

**Entidades clínicas cubiertas**: patients, appointments, notes, assessments según RLS manifest.

## ✅ Validación Zod

**Pruebas NO_ZOD_SCHEMA**: validation schemas
- Formularios con useForm sin zodResolver
- API endpoints (POST, PUT, PATCH) sin .parse()
- Validación manual en lugar de schemas Zod

**Coverage**: Componentes UI y endpoints API sin validación apropiada.

## 🎨 UI & Accesibilidad

**Pruebas UI_HARDCODE**: semantic tokens y WCAG
- Colores hardcoded (bg-red-500, text-blue-600)
- Hex colors (#ff0000)
- RGB/HSL colors (rgb(), hsl())
- Touch targets < 44px (min-h-[20px])

**Allowlist validation**: Tokens no incluidos en tailwind-allowlist.json healthcare-specific.

## 🛡️ Wrappers BFF

**Pruebas WRAPPERS_MISSING**: security wrappers
- Endpoints sin wrappers (withAuth, withSecurity, withRateLimit, withAudit)
- Orden incorrecto de wrappers
- Endpoints clínicos sin protección

**Orden correcto**: withAuth → withSecurity → withRateLimit → withAudit

## 🚦 Go/No-Go Decision

**GO** - Proceder con las pruebas de humo

**Justificación**:
- Archivos sintéticos aislados en _smoke/ directory
- No modifican código de producto real
- Cobertura completa de reason codes objetivo
- Validación de modos FAST vs FULL
- Métricas de rendimiento < 5s para FAST mode

**Scope controlado**: Solo archivos de prueba, no impact en src/ o módulos de producto.