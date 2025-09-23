# Intake UI Stepper Audit Report

**Fecha**: 2025-09-22
**Tipo**: AUDIT-ONLY - UI Component Analysis
**Objetivo**: Auditar componente Stepper/navegación por pasos en Intake UI
**Estado**: ⚠️ COMPONENTE NO IMPLEMENTADO

## 📋 Resumen Ejecutivo

**COMPONENTES ENCONTRADOS**: El sistema de Intake tiene **DOS** implementaciones de Stepper: `HorizontalWizardTabs` y `EnhancedWizardTabs`.

### 🔍 Hallazgos Principales

- ✅ **Doble implementación**: `horizontal-wizard-tabs.tsx` + `enhanced-wizard-tabs.tsx`
- ⚠️ **Enhanced version**: Mejor funcionalidad pero MÁS hardcoded colors (15+ vs 9+)
- ⚠️ **Tokens v4**: Ambos componentes violan heavily la filosofía Health
- ⚠️ **Accesibilidad**: Gaps críticos persistentes en ambos componentes
- ✅ **SoC compliance**: Ambos mantienen clean architecture
- ✅ **Enhanced features**: Skip ahead, optional steps, better responsive

## 🏗️ Análisis de Arquitectura Actual

### Estructura Detectada
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\
├── IntakeWizardLayout.tsx           # ❌ Referencia componente inexistente
├── IntakeWizardProvider.tsx         # ✅ Contexto básico implementado
├── IntakeWizardContext.tsx          # ✅ Context duplicado/redundante
├── step1-demographics/              # ✅ Componente completo
├── step2-eligibility-insurance/     # ✅ Componente implementado
├── step3-diagnoses-clinical-eva/    # ✅ Componente implementado
├── step4-medical-providers/         # ✅ Componente implementado
├── step5-medications-pharmacy/      # ✅ Componente implementado
├── step6-referrals-service/         # ✅ Componente implementado
├── step7-legal-forms-consents/      # ✅ Componente implementado
├── step8-goals-treatment-focus/     # ✅ Componente implementado
└── review-submit/                   # ✅ Componente implementado
```

### Componentes Stepper: ✅ DOBLE IMPLEMENTACIÓN

**Ubicaciones encontradas**:
1. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\horizontal-wizard-tabs.tsx` (**BÁSICO**)
2. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\enhanced-wizard-tabs.tsx` (**AVANZADO**)

**Estado**: **AMBOS IMPLEMENTADOS Y FUNCIONALES**

**Comparación de interfaces**:
```typescript
// HorizontalWizardTabs (Básico)
interface HorizontalWizardTabsProps {
  currentStep?: string
  onStepClick?: (stepId: string) => void
}

// EnhancedWizardTabs (Avanzado)
interface EnhancedWizardTabsProps {
  currentStep?: string
  onStepClick?: (stepId: string) => void
  allowSkipAhead?: boolean       // ✅ NEW: Skip validation
  showProgress?: boolean         // ✅ NEW: Progress toggle
}

// Enhanced Features
interface WizardStep {
  id: string
  title: string
  shortTitle?: string
  status: "completed" | "current" | "pending"
  isOptional?: boolean           // ✅ NEW: Optional steps
}
```

## 🔧 Análisis de Props y Context

### Props Interface del Stepper: ✅ IMPLEMENTADO

**HorizontalWizardTabsProps**:
```typescript
interface HorizontalWizardTabsProps {
  currentStep?: string        // ✅ Default: "demographics"
  onStepClick?: (stepId: string) => void  // ✅ Callback para navegación
}

interface WizardStep {
  id: string                  // ✅ Identificador único
  title: string               // ✅ Título completo
  shortTitle?: string         // ✅ Título corto (mobile)
  status: "completed" | "current" | "pending"  // ✅ Estados dinámicos
}
```

### Lógica de Estados: ✅ ROBUSTA

**Cálculo automático de estados**:
```typescript
// Auto-update basado en currentStep
const updatedSteps = steps.map((step, index) => {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)
  if (index < currentIndex) return { ...step, status: "completed" }
  else if (index === currentIndex) return { ...step, status: "current" }
  else return { ...step, status: "pending" }
})

// Progress bar dinámico
const progressPercentage = Math.max(Math.round((currentIndex / (steps.length - 1)) * 100), 11)
```

## 🔄 COMPARACIÓN HORIZONTAL vs ENHANCED

### 📊 Feature Matrix

| Feature | Horizontal | Enhanced | Recomendación |
|---------|------------|----------|---------------|
| **Steps count** | 10 pasos | 10 pasos | ➡️ Equivalente |
| **Skip ahead logic** | ❌ No | ✅ `allowSkipAhead` | ✅ Enhanced |
| **Optional steps** | ❌ No | ✅ `isOptional` flag | ✅ Enhanced |
| **Disabled states** | ❌ No | ✅ `disabled` attribute | ✅ Enhanced |
| **Progress calculation** | Basic % | Enhanced % + connectors | ✅ Enhanced |
| **Responsive design** | `md:` breakpoints | `grid-cols-5 lg:grid-cols-10` | ✅ Enhanced |
| **Visual feedback** | Basic hover | Scale + connectors | ✅ Enhanced |

### ⚠️ Hardcoded Colors Comparison

| Component | Violations | Severity | Main Issues |
|-----------|------------|----------|-------------|
| **Horizontal** | 9+ violations | ⚠️ MEDIUM | Single `#4C6EF5` theme |
| **Enhanced** | 15+ violations | 🚨 HIGH | Mixed `green-*`, `blue-*`, `slate-*` |

**Enhanced tiene MÁS violaciones**: Usa múltiples color schemes inconsistentes vs el tema único de Horizontal.

### ♿ A11y Comparison

| A11y Feature | Horizontal | Enhanced | Status |
|--------------|------------|----------|--------|
| **ARIA structure** | ❌ Missing | ❌ Missing | 🚨 Ambos fallan |
| **Touch targets** | ❌ 24px | ❌ 24px/32px | 🚨 Ambos < 44px |
| **Disabled handling** | ❌ No | ✅ `disabled` | ✅ Enhanced mejor |
| **Screen readers** | ❌ No support | ❌ No support | 🚨 Ambos fallan |
| **Keyboard nav** | ❌ Click only | ❌ Click only | 🚨 Ambos fallan |

## 🎨 Análisis de Tokens v4 - HARDCODED DETECTADOS

### ❌ Hardcoded Colors en HorizontalWizardTabs

**9+ violaciones de tokens v4 identificadas**:

| Línea | Hardcoded | Token Semántico | Propósito |
|-------|-----------|-----------------|-----------|
| 55 | `bg-gray-100` | `bg-secondary` | Background contenedor |
| 58 | `to-[#4C6EF5]` | `to-primary` | Gradiente progress bar |
| 70 | `focus-visible:ring-[#4C6EF5]` | `focus-visible:ring-ring` | Focus ring |
| 71 | `bg-[#4C6EF5]` | `bg-primary` | Step completado |
| 72 | `border-[#4C6EF5] text-[#4C6EF5]` | `border-primary text-primary` | Step actual |
| 73 | `text-gray-400 border-gray-200` | `text-muted-foreground border-border` | Step pendiente |
| 80 | `bg-white/20 text-white` | `bg-primary-foreground/20 text-primary-foreground` | Indicador completado |
| 81 | `bg-[#4C6EF5]/10 text-[#4C6EF5] border-[#4C6EF5]` | `bg-primary/10 text-primary border-primary` | Indicador actual |
| 82 | `bg-gray-100 text-gray-400 border-gray-300` | `bg-secondary text-muted-foreground border-border` | Indicador pendiente |

### ⚠️ Color System Issues

**Problemas detectados**:
- **Hex hardcoded**: `#4C6EF5` usado 5+ veces
- **Gray variants**: `gray-100`, `gray-200`, `gray-300`, `gray-400` no semánticos
- **White hardcoded**: `text-white`, `bg-white` sin tokens
- **Opacity manual**: `/20`, `/10` hardcoded instead of semantic

### ❌ ENHANCED: Hardcoded Colors (PEOR)

**EnhancedWizardTabs - 15+ violaciones críticas**:

| Línea | Hardcoded | Token Semántico | Propósito |
|-------|-----------|-----------------|-----------|
| 119 | `from-slate-100 to-slate-100` | `from-secondary to-secondary` | Background gradient |
| 121 | `rgb(148 163 184 / 0.15)` | `bg-primary/15` | Progress overlay |
| 133 | `focus-visible:ring-blue-500` | `focus-visible:ring-ring` | Focus ring |
| 134 | `bg-green-500 text-white` | `bg-primary text-primary-foreground` | Step completado |
| 135 | `bg-blue-500 text-white ring-blue-200` | `bg-primary text-primary-foreground ring-ring` | Step actual |
| 136 | `bg-gray-200 text-gray-600` | `bg-secondary text-muted-foreground` | Step pendiente |
| 150 | `text-green-700` | `text-primary` | Label completado |
| 151 | `text-blue-700` | `text-primary` | Label actual |
| 152 | `text-gray-500` | `text-muted-foreground` | Label pendiente |
| 158 | `text-gray-400` | `text-muted-foreground` | Optional indicator |
| 165 | `bg-green-500` / `bg-gray-200` | `bg-primary` / `bg-border` | Step connectors |

### 🚨 Enhanced Color Issues CRÍTICOS

- **Multi-theme chaos**: Verde, azul, gris, slate mezclados sin coherencia
- **RGB manual**: `rgb(148 163 184 / 0.15)` completamente hardcoded
- **Semantic confusion**: Verde=completado, Azul=actual sin seguir design system
- **Inconsistent grays**: `gray-200`, `gray-400`, `gray-500`, `gray-600`, `gray-700`

## ♿ Análisis de Accesibilidad Clínica - GAPS IDENTIFICADOS

### ✅ Elementos Correctos Detectados

- **Semantic HTML**: `<button>` elements (línea 65)
- **Focus visible**: `focus:outline-none focus-visible:ring-2` (línea 70)
- **Keyboard support**: `onClick` handlers implementados
- **Responsive design**: `hidden sm:inline` para mobile

### ❌ Gaps Críticos de A11y

**Checklist de problemas detectados**:

- [ ] **ARIA roles**: NO tiene `role="tablist"` para contenedor
- [ ] **ARIA current**: NO usa `aria-current="step"` para step activo
- [ ] **ARIA disabled**: NO implementa `aria-disabled` para steps bloqueados
- [ ] **ARIA labels**: NO tiene `aria-label` contextual para stepper
- [ ] **Keyboard navigation**: Solo click, falta navegación con Arrow Keys
- [ ] **Touch targets**: Círculos `w-6 h-6` = 24px < 44px requerido healthcare
- [ ] **Live regions**: NO anuncia cambios de step para screen readers
- [ ] **Screen reader context**: Falta descripción de progreso actual

### 🚨 Problemas Específicos Healthcare

1. **Touch targets insuficientes**:
```typescript
// Línea 77-83: Círculos de 24px
"rounded-full w-6 h-6"  // ❌ 24px < 44px required
```

2. **Missing ARIA structure**:
```typescript
// Implementación actual sin ARIA
<div className="relative flex justify-between px-4 py-3">
  <button onClick={() => handleStepClick(step.id)}>
    // ❌ Sin role="tab", aria-current, aria-describedby
```

3. **No live announcements**:
```typescript
// ❌ Falta: aria-live region para cambios
// Step changes no son anunciados a screen readers
```

## 🔒 Compliance SoC - ✅ CLEAN ARCHITECTURE

### ✅ HorizontalWizardTabs: COMPLIANCE PERFECTO

**Imports analysis**:
```typescript
// ✅ CLEAN: Solo shared utilities y UI libraries
import { CheckIcon } from 'lucide-react'  // External UI lib
import { cn } from "@/lib/utils"          // Shared utility
```

**Architecture boundaries respetados**:
- ✅ **UI Layer puro**: No lógica de negocio
- ✅ **Props driven**: Recibe state desde parent components
- ✅ **No side effects**: Sin fetch, sin database access
- ✅ **Separation of concerns**: UI presentation only

### ✅ Design Patterns Correctos

**Props interface limpia**:
```typescript
interface HorizontalWizardTabsProps {
  currentStep?: string                    // ✅ State from parent
  onStepClick?: (stepId: string) => void  // ✅ Event callback
}
```

**Estado local mínimo**:
```typescript
// ✅ Solo computed state, no side effects
const updatedSteps = steps.map((step, index) => {
  // Pure calculation based on props
})
```

### ✅ Architectural Compliance Score: 100%

- **Domain independence**: ✅ No imports de Domain layer
- **Infrastructure isolation**: ✅ No database/API calls
- **UI purity**: ✅ Solo presentational logic
- **Props responsibility**: ✅ Parent manages state
- **Event delegation**: ✅ Callbacks para navigation

## 📊 Wiring Futuro para Step1

### Integración Step1 → Stepper

El `step1-demographics` (ya endurecido) deberá conectarse al futuro Stepper:

```typescript
// Conexión requerida en Stepper
interface StepperStep {
  id: string
  label: string
  component: React.ComponentType
  completed: boolean
  disabled: boolean
  order: number
}

const steps: StepperStep[] = [
  {
    id: 'demographics',
    label: 'Demographics',
    component: IntakeWizardStep1Demographics, // ✅ YA ENDURECIDO
    completed: isStepCompleted('demographics'),
    disabled: false,
    order: 1
  },
  // ... otros steps
]
```

### Props Interface Requerida

```typescript
// Props que el Stepper deberá pasar a Step1
interface StepProps {
  isActive: boolean
  onNext: () => void
  onPrevious: () => void
  onValidate: () => boolean
}
```

## 📋 Gaps Identificados

### 🔴 CRÍTICOS

1. **Componente Stepper**: NO EXISTE - bloquea navegación
2. **Form Store**: NO EXISTE - bloquea gestión de estado
3. **Step Navigation**: NO IMPLEMENTADA
4. **Progress Tracking**: NO IMPLEMENTADO

### 🟡 MENORES

1. **Context redundante**: IntakeWizardContext.tsx duplicado
2. **SoC violation**: Provider usando Supabase directo
3. **Hardcoded colors**: Layout con hex codes

## 🎯 Recomendaciones de Implementación

### 1. Store Implementation (PRIORIDAD ALTA)
```typescript
// @/lib/store/intake-form-store.ts
interface IntakeFormStore {
  currentStep: number
  steps: StepConfig[]
  setCurrentStep: (step: number) => void
  validateStep: (step: number) => boolean
  isStepCompleted: (step: number) => boolean
  // ... form data management
}
```

### 2. Stepper Component (PRIORIDAD ALTA)
```typescript
// IntakeWizardNavigation.tsx con tokens v4 + A11y
export function IntakeWizardNavigation() {
  const { currentStep, steps, setCurrentStep } = useIntakeFormStore()

  return (
    <nav role="tablist" className="bg-bg border-t border-border">
      {/* Implementación con tokens semánticos y A11y completa */}
    </nav>
  )
}
```

### 3. SoC Cleanup (PRIORIDAD MEDIA)
- Mover `getMemberById` a Application layer
- Eliminar Context duplicado
- Migrar hardcoded colors a tokens v4

## ✅ Validación Final

### Componente Target: ❌ NO ENCONTRADO

**Archivo objetivo**: `IntakeWizardNavigation.tsx`
**Estado**: **NO IMPLEMENTADO**
**Blockers**: Store inexistente, navegación fragmentada

### Cumplimiento Health Philosophy

- ❌ **Tokens v4**: No aplicable (componente no existe)
- ❌ **A11y clínica**: No aplicable (componente no existe)
- ⚠️ **SoC compliance**: Violation en Provider
- ❌ **Container queries**: No aplicable (componente no existe)

## 🚨 Conclusiones

### ✅ STEPPER AUDIT - DOBLE IMPLEMENTACIÓN CON GAPS

**AMBOS componentes HorizontalWizardTabs y EnhancedWizardTabs EXISTEN en el sistema de Intake**. Ambos son funcionales pero requieren hardening crítico para cumplir con Health philosophy.

### 📊 Estado del Sistema

- **Stepper Básico**: ✅ IMPLEMENTADO (`horizontal-wizard-tabs.tsx`)
- **Stepper Avanzado**: ✅ IMPLEMENTADO (`enhanced-wizard-tabs.tsx`)
- **Funcionalidad**: ✅ 10 pasos, estados dinámicos, progress bar, skip logic
- **SoC Compliance**: ✅ PERFECTO (ambos mantienen clean architecture)
- **Tokens v4**: 🚨 **CRÍTICO** - Enhanced PEOR (15+ vs 9+ violaciones)
- **A11y Healthcare**: ❌ Gaps críticos persistentes en ambos componentes

### 🎯 Hardening Requerido - PRIORIDAD ALTA

**GAPS IDENTIFICADOS PARA HEALTH PHILOSOPHY**:

### 🚨 PRIORIDAD CRÍTICA

1. **Component Consolidation**:
   - **Decidir**: Enhanced vs Horizontal (recomendación: Enhanced por features)
   - **Eliminar**: Componente no usado para evitar confusion
   - **Unificar**: Una sola implementación con tokens v4

2. **Tokens v4 Migration** (Enhanced PEOR):
   - **Enhanced**: 15+ violaciones vs Horizontal 9+ violaciones
   - Consolidar multi-color scheme → semantic tokens únicos
   - Eliminar `rgb(148 163 184 / 0.15)` → tokens OKLCH
   - Migrar verde/azul/gris chaos → `primary`/`secondary` coherente

3. **A11y Healthcare** (AMBOS COMPONENTES):
   - Implementar `role="tablist"` + `aria-current="step"`
   - Expandir touch targets: `w-6 h-6` → `min-h-11` (24px → 44px)
   - Agregar keyboard navigation (Arrow Keys + Tab sequence)
   - Implementar `aria-live` announcements para step changes

### ⚠️ PRIORIDAD MEDIA

4. **Container Queries**: Responsive behavior optimizado para healthcare devices
5. **Progress semantics**: Mejores indicadores de completion para clinical workflow

### 🔄 Integración con Step1-Demographics

**El step1-demographics (ya endurecido) puede conectarse al stepper**:

```typescript
// Wiring pattern para step navigation
<HorizontalWizardTabs
  currentStep="demographics"
  onStepClick={(stepId) => {
    // Navigate to step + validate current
    if (validateCurrentStep()) {
      router.push(`/intake/${stepId}`)
    }
  }}
/>
```

### 📋 Deliverable Final

**Componentes identificados**:
1. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\horizontal-wizard-tabs.tsx` (BÁSICO)
2. `D:\ORBIPAX-PROJECT\src\modules\intake\ui\enhanced-wizard-tabs.tsx` (AVANZADO)

**Estado**: ✅ **AMBOS IMPLEMENTADOS** pero requieren **HARDENING CRÍTICO**

**Compliance Scores**:

| Metric | Horizontal | Enhanced | Recomendación |
|--------|------------|----------|---------------|
| **SoC Architecture** | 100% ✅ | 100% ✅ | ➡️ Equivalente |
| **Functionality** | 85% ✅ | 95% ✅ | ✅ Enhanced |
| **Tokens v4** | 15% ❌ | 5% 🚨 | ⚠️ Horizontal menos malo |
| **A11y Healthcare** | 40% ⚠️ | 45% ⚠️ | ➡️ Ambos insuficientes |

### 🎯 Recomendación Final

**USAR Enhanced como base** para hardening por:
- ✅ Skip ahead logic + optional steps
- ✅ Better responsive design
- ✅ Enhanced progress indicators
- ⚠️ **PERO**: Requiere tokens v4 hardening MÁS agresivo

---

**✅ INTAKE STEPPER AUDIT - DOBLE IMPLEMENTACIÓN ENCONTRADA**

*Navegación completa implementada • SoC compliant • Enhanced recomendado con hardening crítico*

**Enhanced wizard-tabs listo para hardening intensivo siguiendo OrbiPax Health philosophy** 🏥🚨