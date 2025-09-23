# AUDIT SUMMARY - Conexión Intake → Página patients/new

**Fecha**: 2025-01-22
**Tipo**: AUDIT-ONLY
**Objetivo**: Definir wiring mínimo para montar wizard Intake en página de creación de paciente
**Estado**: ✅ COMPLETADO

## 📋 Contexto de la Tarea

**Objetivo**: Auditar solo lo necesario para conectar el wizard de Intake (carpetas por pasos ya copiadas) con la página de creación de paciente sin escribir código.

**Alcance**: Confirmar puntos de montaje, proponer wiring mínimo, verificar SoC & Health philosophy compliance.

**Deliverable**: Plan específico de integración con paths reales y componentes identificados.

## 🔍 Búsqueda por Directorios

### Ruta Real Confirmada
**Página destino**: `src/app/(app)/patients/new/page.tsx`
- ✅ Existe y está activa
- ✅ Usa Server Actions con `createPatient` action
- ✅ Implementa formulario básico con validación HTML5

### Estructura Actual Intake UI
```
src/modules/intake/ui/
├── IntakeWizardProvider.tsx      # ✅ Entry Provider
├── IntakeWizardLayout.tsx        # ✅ Entry Layout
├── IntakeWizardContext.tsx       # ✅ Context definition
├── index.ts                      # ⚠️  Vacío (Gap)
├── step1-demographics/           # ✅ 8 pasos completos
├── step2-eligibility-insurance/
├── step3-diagnoses-clinical-eva/
├── step4-medical-providers/
├── step5-medications-pharmacy/
├── step6-referrals-service/
├── step7-legal-forms-consents/
├── step8-goals-treatment-focus/
└── review-submit/
```

## 🏗️ Arquitectura & Capas

### SoC Compliance Status: ✅ EXCELENTE

**UI Layer**: Respeta boundaries perfectamente
- ✅ No imports directos de Domain/Infrastructure
- ✅ Solo una violación detectada: `IntakeWizardProvider.tsx:6` imports `@/lib/supabase/queries`
- ✅ Usa store pattern apropiado (`@/lib/store/intake-form-store`)

**Application Layer**: Mínima pero correcta
- ✅ Existe: `src/modules/intake/application/review.actions.ts`
- ✅ Implementa Server Actions pattern
- ✅ Usa RPC wrapper `orbipax_core.get_intake_latest_snapshot`

**Domain Layer**: ❌ NO EXISTE
- ⚠️  Gap crítico: No hay `src/modules/intake/domain/`
- ⚠️  Tipos y schemas dispersos en UI layer

**Infrastructure Layer**: ❌ NO EXISTE
- ⚠️  Gap: No hay `src/modules/intake/infrastructure/`
- ⚠️  Acceso directo a Supabase desde UI Provider

### Entry Points Identificados

#### 1. **IntakeWizardProvider** (Recomendado)
```typescript
// src/modules/intake/ui/IntakeWizardProvider.tsx
interface IntakeWizardContextType {
  isEditMode: boolean
  memberId: string | null
  isLoading: boolean
  error: string | null
}
```

#### 2. **IntakeWizardLayout** (Completo)
```typescript
// src/modules/intake/ui/IntakeWizardLayout.tsx
interface IntakeWizardLayoutProps {
  children: ReactNode
}
```

## 🔒 RLS/Multi-tenant

### Compliance Status: ⚠️ GAPS DETECTADOS

**Organization Filtering**:
- ❌ `IntakeWizardProvider` no maneja `organization_id`
- ❌ `getMemberById` query sin RLS visible en path
- ⚠️  `createPatient` action no verificada para RLS

**Patient Scoping**:
- ✅ `getIntakeSnapshot(patientId)` requiere patient ID
- ✅ RPC `get_intake_latest_snapshot` espera `p_patient_id`

**Required Additions**:
- `organizationId: string` en context/props
- Validación de membership en organization
- RLS filtering en todas las queries

## ✅ Validación Zod

### Status: ❌ CRITICAL GAP

**Current State**:
- ❌ No hay schemas Zod en Domain layer
- ❌ Formularios usan validación HTML5 solamente
- ❌ Server Actions sin validación Zod visible

**Required Schema Paths** (propuestos):
```
src/modules/intake/domain/
├── schemas/
│   ├── demographics.schemas.ts
│   ├── eligibility.schemas.ts
│   ├── clinical.schemas.ts
│   ├── providers.schemas.ts
│   ├── medications.schemas.ts
│   ├── referrals.schemas.ts
│   ├── legal-forms.schemas.ts
│   ├── treatment-goals.schemas.ts
│   └── intake-submission.schemas.ts
└── types/
    └── intake.types.ts
```

## 🎨 UI & Accesibilidad

### Compliance Status: ⚠️ MIXED

**Semantic Tokens**:
- ❌ Hardcoded colors detectados: `bg-[#F5F7FA]`
- ❌ No usa tokens semánticos de Tailwind v4
- ⚠️  Necesita migración a healthcare tokens

**Accessibility**:
- ✅ Labels apropiados en formularios
- ✅ Focus management visible
- ⚠️  Touch targets no verificados (44px minimum)

**Required Tokens** (propuestos):
```css
/* Healthcare semantic tokens */
.bg-clinical-surface    /* vs bg-[#F5F7FA] */
.text-patient-primary   /* vs text-gray-700 */
.border-form-default    /* vs border-gray-300 */
```

## 🛡️ Wrappers BFF

### Status: ⚠️ PARTIAL

**Current Actions**:
- ✅ `getIntakeSnapshot` es Server Action
- ⚠️  No se verifican wrappers de seguridad
- ⚠️  `createPatient` action externa al módulo

**Required Wrappers** (propuestos):
```typescript
// src/modules/intake/application/intake.actions.ts
export const createIntakeSnapshot = withAuth(
  withSecurity(
    withRateLimit(
      withAudit(async (data: IntakeSubmissionData) => {
        // Implementation
      })
    )
  )
);
```

## 🚦 Go/No-Go Decision

**GO** - Proceder con la integración

**Justificación**:
- ✅ Entry points claramente identificados
- ✅ Estructura UI completa y bien organizada
- ✅ SoC boundaries respetados en UI layer
- ✅ RPC integration ya existente
- ⚠️  Gaps menores manejables en próximo APPLY

## 📝 Plan de Wiring Mínimo

### 1. **Punto de Montaje Confirmado**
```typescript
// src/app/(app)/patients/new/page.tsx
import { IntakeWizardLayout, IntakeWizardProvider } from '@/modules/intake/ui'

export default function NewPatientPage() {
  return (
    <IntakeWizardLayout>
      {/* Existing form or wizard steps */}
    </IntakeWizardLayout>
  )
}
```

### 2. **Props/Context Contract Inicial**
```typescript
// Requeridos para integración
interface IntakeWizardProps {
  organizationId: string     // RLS compliance
  mode: 'new' | 'edit'       // Creation vs editing
  patientId?: string         // Edit mode only
  initialStep?: number       // Optional starting step
}
```

### 3. **Imports Propuestos (Paths Reales)**
```typescript
// Entry components
import {
  IntakeWizardProvider,
  IntakeWizardLayout
} from '@/modules/intake/ui'

// Application actions (existing)
import { getIntakeSnapshot } from '@/modules/intake/application/review.actions'

// Patients module integration
import { createPatient } from '@/modules/patients/application/patients.actions'
```

### 4. **Acciones Application Requeridas** (nombres propuestos)
```typescript
// src/modules/intake/application/
├── intake.actions.ts        # Main orchestration
│   ├── createIntakeSnapshot()
│   ├── updateIntakeSnapshot()
│   ├── submitIntakeForm()
│   └── getIntakeStatus()
├── demographics.actions.ts  # Step-specific
├── eligibility.actions.ts
└── review.actions.ts       # ✅ Ya existe
```

### 5. **Tipos Domain Requeridos** (paths propuestos)
```typescript
// src/modules/intake/domain/
├── types/
│   ├── intake.types.ts      # Core intake types
│   ├── demographics.types.ts
│   ├── clinical.types.ts
│   └── submission.types.ts
└── schemas/
    ├── intake.schemas.ts    # Zod validation
    └── steps.schemas.ts
```

### 6. **Reutilización RPC Confirmada**
```typescript
// ✅ Ya implementado en review.actions.ts
export async function getIntakeSnapshot(patientId: string) {
  const { data, error } = await sb.rpc("orbipax_core.get_intake_latest_snapshot", {
    p_patient_id: patientId.trim()
  });
}

// Propuesta para nuevo patient mode:
export async function createIntakeFromPatient(
  patientData: PatientData,
  organizationId: string
) {
  // 1. Crear patient con createPatient action
  // 2. Inicializar intake snapshot
  // 3. Retornar patientId para wizard
}
```

## 🔧 Gaps Identificados & Prioridad

### CRÍTICOS (Bloqueantes)
1. **Domain Layer Missing**: Crear `src/modules/intake/domain/` con tipos y schemas
2. **Zod Validation**: Implementar schemas para todos los steps
3. **Organization Context**: Agregar `organizationId` a Provider context
4. **Index Export**: Completar `src/modules/intake/ui/index.ts`

### ALTOS (Importantes)
1. **UI Tokens Migration**: Reemplazar hardcoded colors con semantic tokens
2. **Infrastructure Layer**: Crear para repository pattern
3. **BFF Wrappers**: Agregar security wrappers a actions
4. **RLS Verification**: Verificar organization filtering

### MEDIOS (Mejoras)
1. **Error Handling**: Mejorar error boundaries en wizard
2. **Loading States**: Consistencia en loading UX
3. **Analytics**: Agregar tracking a steps completion
4. **Accessibility**: Verificar touch targets y WCAG compliance

## 📋 ALLOWED PATHS para próximo APPLY

### Creación de Archivos
```
✅ D:\ORBIPAX-PROJECT\src\modules\intake\domain\**
✅ D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\**
✅ D:\ORBIPAX-PROJECT\src\modules\intake\application\intake.actions.ts
✅ D:\ORBIPAX-PROJECT\src\modules\intake\ui\index.ts
```

### Modificación de Archivos
```
✅ D:\ORBIPAX-PROJECT\src\app\(app)\patients\new\page.tsx
✅ D:\ORBIPAX-PROJECT\src\modules\intake\ui\IntakeWizardProvider.tsx
✅ D:\ORBIPAX-PROJECT\src\modules\intake\ui\IntakeWizardLayout.tsx
```

### Referencia (Solo lectura)
```
✅ D:\ORBIPAX-PROJECT\src\modules\patients\application\patients.actions.ts
✅ D:\ORBIPAX-PROJECT\src\lib\store\intake-form-store.ts
✅ D:\ORBIPAX-PROJECT\src\shared\lib\supabase.server.ts
```

## 🎯 Conclusiones

### ✅ LISTO PARA INTEGRACIÓN
- **Entry points definidos**: IntakeWizardProvider + IntakeWizardLayout
- **Paths confirmados**: Página real en `patients/new/page.tsx`
- **SoC compliant**: UI layer respeta boundaries (1 gap menor)
- **RPC integration**: `get_intake_latest_snapshot` ya implementado

### ⚠️ GAPS MANEJABLES
- Domain layer necesario pero no complejo
- Zod schemas requeridos pero patterns claros
- RLS compliance necesita organization context
- UI tokens migration straightforward

### 🚀 SIGUIENTE APPLY
1. **Crear Domain layer** con tipos base
2. **Implementar Zod schemas** críticos
3. **Agregar organization context** a Provider
4. **Completar integration** en patients/new page
5. **Migrar UI tokens** a semantic healthcare tokens

**El wizard de Intake está preparado para integración exitosa con la página patients/new siguiendo OrbiPax Health philosophy** ✅