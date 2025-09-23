# Intake Wizard Architecture Audit

**Fecha**: 2025-09-22
**Tipo**: ARCHITECTURAL AUDIT - Legacy vs OrbiPax Patterns
**Objetivo**: Determinar si IntakeWizard components son válidos o legacy
**Estado**: ✅ COMPLETADO - VERDICT: LEGACY COMPONENTS

## 📋 Resumen Ejecutivo

**VERDICT: COMPONENTS SON LEGACY DEL PROYECTO COPIADO**

Los 3 componentes (`IntakeWizardLayout`, `IntakeWizardProvider`, `IntakeWizardContext`) **NO SIGUEN la arquitectura OrbiPax** y son rastros del proyecto base anterior. Deben ser **ELIMINADOS** o **REIMPLEMENTADOS** según patrones OrbiPax.

## 🔍 Evidencia de Legacy Architecture

### 🚨 VIOLATIONS CRÍTICAS DETECTADAS

**1. SoC Boundary Violations**:
```typescript
// ❌ WRONG: UI importando Infrastructure directamente
// IntakeWizardProvider.tsx:6
import { getMemberById } from '@/lib/supabase/queries'  // NO EXISTE
```

**2. Store Pattern Incorrecto**:
```typescript
// ❌ WRONG: Store inexistente usado en 28+ archivos
import { useIntakeFormStore } from '@/lib/store/intake-form-store'  // NO EXISTE
```

**3. Navigation Component Missing**:
```typescript
// ❌ WRONG: Referencia a componente inexistente
// IntakeWizardLayout.tsx:6
import { IntakeWizardNavigation } from "./IntakeWizardNavigation"  // NO EXISTE
```

## 🏗️ OrbiPax Architecture vs Legacy

### ✅ ORBIPAX PATTERN (Correcto)

**Estructura detectada en el proyecto**:
```
src/modules/intake/
├── application/               # ✅ Server Actions
│   └── review.actions.ts     # ✅ Usa getServiceClient()
├── domain/                   # ✅ Schemas y types
│   ├── schemas/             # ✅ Zod validation
│   └── types/               # ✅ Type definitions
└── ui/                      # ✅ UI components
```

**IMPLEMENTATION_GUIDE compliance**:
- ✅ **Application layer**: Server actions con `"use server"`
- ✅ **Domain layer**: Schemas Zod para validation
- ✅ **UI layer**: Componentes puros
- ✅ **Infrastructure**: Centralizada en `/shared/lib/supabase.server.ts`

### ❌ LEGACY PATTERN (Incorrecto)

**Lo que hacen los componentes legacy**:
```typescript
// IntakeWizardProvider.tsx - PATTERN INCORRECTO
export function IntakeWizardProvider() {
  // ❌ UI accediendo Infrastructure directamente
  const memberData = await getMemberById(memberId)  // SoC VIOLATION

  // ❌ Store pattern no-OrbiPax
  const { setFormData } = useIntakeFormStore()      // NO EXISTE

  // ❌ UI manejando estado de BD
  const [isLoading, setIsLoading] = useState(false) // DEBERÍA SER SERVER STATE
}
```

## 📊 Análisis por Componente

### 1. IntakeWizardLayout.tsx ❌ LEGACY

**Issues detectados**:
- ✅ **Props structure**: Correcta (children)
- ❌ **Navigation import**: Referencia inexistente
- ❌ **Hardcoded styles**: `bg-[#F5F7FA]`
- ❌ **Missing integration**: No usa `enhanced-wizard-tabs`

**Verdict**: **REPLACE** con layout OrbiPax-compliant

### 2. IntakeWizardProvider.tsx ❌ LEGACY

**Issues detectados**:
- ❌ **SoC violation**: UI → Infrastructure directa
- ❌ **Store dependency**: Usa store inexistente
- ❌ **Data fetching**: UI haciendo DB calls
- ❌ **State management**: Client state para server data

**Verdict**: **ELIMINATE** - Violates OrbiPax architecture

### 3. IntakeWizardContext.tsx ❌ LEGACY

**Issues detectados**:
- ❌ **Duplicated logic**: Mismo interface que Provider
- ❌ **No functionality**: Version básica sin propósito
- ❌ **Redundant**: Provider ya hace lo mismo

**Verdict**: **DELETE** - Completamente redundante

## 🎯 OrbiPax Correct Implementation

### ✅ CÓMO DEBERÍA SER según IMPLEMENTATION_GUIDE

**1. Server State con TanStack Query**:
```typescript
// ✅ CORRECT: Application layer server action
"use server"
export async function getIntakeData(patientId: string) {
  const sb = getServiceClient()
  // RLS automático, audit trail, error handling
}

// ✅ CORRECT: UI con TanStack Query
export function IntakeWizardProvider({ children }) {
  const { data, isLoading } = useQuery({
    queryKey: ['intake', patientId],
    queryFn: () => getIntakeData(patientId)  // Application layer
  })
}
```

**2. UI State con Zustand (local only)**:
```typescript
// ✅ CORRECT: Solo UI state, no PHI
interface IntakeUIStore {
  currentStep: string          // UI navigation
  expandedSections: Record     // UI state
  isWizardVisible: boolean     // UI visibility
  // NO patient data, NO PHI
}
```

**3. Layout Integration**:
```typescript
// ✅ CORRECT: Usa enhanced-wizard-tabs
export function IntakeWizardLayout({ children }) {
  return (
    <div className="bg-bg">  {/* Tokens v4 */}
      <Sidebar />
      <main>
        {children}
        <EnhancedWizardTabs    {/* Nuestro componente hardened */}
          currentStep={currentStep}
          onStepClick={handleNavigation}
        />
      </main>
    </div>
  )
}
```

## 🚨 Recommendation Matrix

| Component | Status | Action | Justification |
|-----------|--------|--------|---------------|
| **IntakeWizardLayout** | ❌ Legacy | **REPLACE** | Fix imports + hardcoded + integration |
| **IntakeWizardProvider** | ❌ Legacy | **ELIMINATE** | SoC violations + wrong pattern |
| **IntakeWizardContext** | ❌ Legacy | **DELETE** | Completely redundant |
| **enhanced-wizard-tabs** | ✅ Valid | **KEEP** | Hardened + OrbiPax compliant |

## 📋 Migration Plan

### 🎯 PHASE 1: Cleanup Legacy

1. **DELETE** `IntakeWizardContext.tsx` (redundant)
2. **DELETE** `IntakeWizardProvider.tsx` (architecture violation)
3. **REPLACE** `IntakeWizardLayout.tsx` with OrbiPax pattern

### 🎯 PHASE 2: Implement OrbiPax Pattern

1. **CREATE** Application layer actions for intake data
2. **IMPLEMENT** TanStack Query for server state
3. **CREATE** Zustand store for UI state only
4. **INTEGRATE** `enhanced-wizard-tabs` in layout

### 🎯 PHASE 3: Update Dependencies

1. **FIX** 28+ components using `useIntakeFormStore`
2. **MIGRATE** to proper OrbiPax state management
3. **IMPLEMENT** proper Application → Infrastructure flow

## ✅ Validation Against IMPLEMENTATION_GUIDE

### 🏥 Healthcare Architecture Compliance

| Requirement | Legacy Status | OrbiPax Target |
|-------------|---------------|----------------|
| **UI → Application → Infrastructure** | ❌ UI → Infrastructure | ✅ Via server actions |
| **No PHI in UI state** | ❌ PHI en Provider | ✅ TanStack Query |
| **Module isolation** | ❌ Cross imports | ✅ Application boundary |
| **Server state management** | ❌ Client state | ✅ TanStack Query |
| **HIPAA compliance** | ❌ PHI exposure | ✅ Server-side only |
| **Audit trail** | ❌ No tracking | ✅ Application layer |

## 🚀 Conclusion

### ❌ LEGACY COMPONENTS - NO VÁLIDOS

**Los componentes IntakeWizard* son legacy del proyecto copiado y NO siguen la arquitectura OrbiPax**:

- **SoC violations**: UI accediendo Infrastructure
- **Wrong patterns**: Client state para server data
- **Missing dependencies**: Stores y queries inexistentes
- **Architecture mismatch**: No sigue IMPLEMENTATION_GUIDE

### ✅ CORRECT APPROACH

**En OrbiPax debemos usar**:
- **Application layer**: Server actions para data
- **TanStack Query**: Server state management
- **Zustand**: UI state only (no PHI)
- **Enhanced-wizard-tabs**: Navigation component (ya hardened)

### 🎯 Next Steps

1. **ELIMINATE** legacy components
2. **IMPLEMENT** OrbiPax architecture pattern
3. **MIGRATE** 28+ dependent components
4. **INTEGRATE** with hardened `enhanced-wizard-tabs`

---

**❌ INTAKE WIZARD LEGACY COMPONENTS - ELIMINATE**

*Architecture violations • Wrong patterns • OrbiPax non-compliant*

**Componentes legacy deben ser eliminados y reimplementados según arquitectura OrbiPax** 🏥⚠️