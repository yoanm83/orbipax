# AUDITORÍA UI: SECCIÓN "PROVIDERS" (PRIMARY CARE PROVIDER - PCP)

**Fecha:** 2025-09-26
**Objetivo:** Planificar la implementación de la sección Providers en el formulario de Intake
**Estado:** ✅ AUDITORÍA COMPLETADA - LISTO PARA IMPLEMENTACIÓN

---

## 📋 RESUMEN EJECUTIVO

La sección "Providers" debe agregarse al Step 3 del Intake siguiendo el patrón establecido de cards colapsables. El componente `ProvidersSection.tsx` se creará en la misma carpeta que las otras secciones y se integrará al agregador existente.

**Patrón identificado:** Card colapsable con estado local, campos condicionales según respuesta inicial, validación contextual y tokens del sistema.

---

## 🗂️ ESTRUCTURA ACTUAL DEL INTAKE

### Archivo Agregador
**Ruta:** `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step3-diagnoses-clinical\Step3DiagnosesClinical.tsx`

**Características:**
- Componente contenedor que maneja el estado de expansión de secciones
- Estado local: `expandedSections` con booleanos para cada sección
- Función `toggleSection` para expandir/colapsar
- Renderiza secciones en orden vertical con props `isExpanded` y `onSectionToggle`

### Carpeta de Secciones
**Ruta:** `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step3-diagnoses-clinical\components\`

**Secciones existentes:**
1. `DiagnosesSection.tsx` - Diagnósticos DSM-5
2. `PsychiatricEvaluationSection.tsx` - Evaluación psiquiátrica
3. `FunctionalAssessmentSection.tsx` - Evaluación funcional (WHODAS 2.0)

**Nueva sección a crear:**
4. `ProvidersSection.tsx` - Primary Care Provider (PCP)

---

## 📚 REFERENCIA LEGACY (SOLO VISUAL)

### Archivo Legacy Consultado
**Ruta:** `D:\ORBIPAX-PROJECT\src\modules\legacy\intake\step4-medical-providers\components\PrimaryCareProviderSection.tsx`

### Campos Identificados en Legacy

| Campo | Label | Tipo | Requerido | Condicional |
|-------|-------|------|-----------|-------------|
| `hasPCP` | "Does the client have a Primary Care Provider?" | Select (Yes/No) | ✅ | - |
| `pcpName` | "PCP Full Name" | Input text | ✅* | Si hasPCP=Yes |
| `pcpClinic` | "Clinic / Facility Name" | Input text | ❌ | Si hasPCP=Yes |
| `pcpPhone` | "Phone Number" | Input tel | ✅* | Si hasPCP=Yes |
| `pcpAddress` | "Address" | Input text | ❌ | Si hasPCP=Yes |
| `authorizedToShare` | "Authorized to share medical information with PCP" | Checkbox | ❌ | Si hasPCP=Yes |

### Estructura Visual Legacy
- Card con header clickeable (ícono + título)
- Chevron para indicar estado expandido/colapsado
- Grid de 2 columnas en desktop (md:grid-cols-2)
- Campos condicionales ocultos cuando hasPCP=No

---

## 🧩 COMPONENTES UI COMPARTIDOS DISPONIBLES

### Primitivos Identificados
**Ruta base:** `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\`

| Componente | Uso | Import |
|------------|-----|--------|
| **Card/CardBody** | Contenedor principal | `@/shared/ui/primitives/Card` |
| **Label** | Etiquetas de campos | `@/shared/ui/primitives/label` |
| **Select** | Dropdown hasPCP | `@/shared/ui/primitives/Select` |
| **Input** | Campos de texto | `@/shared/ui/primitives/Input` |
| **Textarea** | Campos multilínea | `@/shared/ui/primitives/Textarea` |
| **Checkbox** | Autorización | `@/shared/ui/primitives/Checkbox` |
| **Switch** | Alternativa a checkbox | `@/shared/ui/primitives/Switch` |

### Iconos Disponibles
- `UserRound` o `User` de `lucide-react` para el header
- `ChevronUp/ChevronDown` para indicador de expansión

---

## 🎯 ALCANCE MÍNIMO PROPUESTO (UI-ONLY)

### Componente: ProvidersSection

#### Props Interface
```typescript
interface ProvidersSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}
```

#### Campos Mínimos v1

| Campo | Label UI | Tipo Control | Validación |
|-------|----------|--------------|------------|
| **hasPCP** | "Does the client have a Primary Care Provider?" | Select (Yes/No/Unknown) | Requerido |
| **pcpName** | "Provider Name*" | Input text | Requerido si hasPCP=Yes |
| **pcpPractice** | "Practice/Clinic Name" | Input text | Opcional |
| **pcpPhone** | "Phone Number*" | Input tel | Requerido si hasPCP=Yes |
| **pcpAddress** | "Address" | Textarea | Opcional |
| **notes** | "Additional Notes" | Textarea | Opcional |

#### Estado Local
```typescript
// Estados para campos
const [hasPCP, setHasPCP] = useState<string>("")
const [pcpName, setPcpName] = useState("")
const [pcpPractice, setPcpPractice] = useState("")
const [pcpPhone, setPcpPhone] = useState("")
const [pcpAddress, setPcpAddress] = useState("")
const [notes, setNotes] = useState("")

// Estados para errores
const [showHasPCPError, setShowHasPCPError] = useState(false)
const [showNameError, setShowNameError] = useState(false)
const [showPhoneError, setShowPhoneError] = useState(false)
```

#### Validación Condicional
- Si `hasPCP === "No"` o `"Unknown"`: No se muestran campos adicionales
- Si `hasPCP === "Yes"`: Se muestran todos los campos, `pcpName` y `pcpPhone` requeridos
- Validación en submit local (función `validateFields`)

---

## 🔧 PLAN DE INTEGRACIÓN

### 1. Crear Componente
**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step3-diagnoses-clinical\components\ProvidersSection.tsx`

**Estructura:**
```
ProvidersSection.tsx
├── Imports (Card, Label, Select, Input, Textarea, iconos)
├── Interface Props
├── Componente funcional
│   ├── Estado local (campos y errores)
│   ├── Handlers (cambios y validación)
│   ├── Render
│   │   ├── Card container
│   │   ├── Header clickeable
│   │   ├── Body condicional (isExpanded)
│   │   │   ├── Select hasPCP
│   │   │   └── Campos condicionales (si Yes)
│   │   └── Mensajes de error
└── Export
```

### 2. Integrar al Agregador

**Archivo a modificar:** `Step3DiagnosesClinical.tsx`

**Cambios necesarios:**

1. **Import:**
```typescript
import { ProvidersSection } from "./components/ProvidersSection"
```

2. **Estado de expansión (línea ~16):**
```typescript
const [expandedSections, setExpandedSections] = useState({
  diagnoses: true,
  psychiatric: false,
  functional: false,
  providers: false  // Agregar
})
```

3. **Renderizado (después de FunctionalAssessmentSection, línea ~47):**
```typescript
{/* Providers Section */}
<ProvidersSection
  isExpanded={expandedSections.providers}
  onSectionToggle={() => toggleSection("providers")}
/>
```

### 3. Keys para Form/Store (Futura Integración)

**Prefijo sugerido:** `providers.`

**Estructura de datos:**
```typescript
providers: {
  hasPCP: "Yes" | "No" | "Unknown" | "",
  primaryCareProvider: {
    name: string,
    practice: string,
    phone: string,
    address: string,
    notes: string
  }
}
```

**Nota:** En esta primera iteración UI-only, no se conectará a store global.

---

## ✅ CHECKLIST DE VALIDACIÓN (PARA APPLY)

### Accesibilidad (A11Y)
- [ ] IDs únicos para cada campo (`pcp-has`, `pcp-name`, `pcp-phone`, etc.)
- [ ] Labels asociados correctamente con `htmlFor`
- [ ] `aria-required="true"` en campos requeridos
- [ ] `aria-invalid="true"` cuando hay error
- [ ] `aria-describedby` apuntando al mensaje de error
- [ ] `aria-expanded` y `aria-controls` en header colapsable
- [ ] Navegación por teclado (Enter/Space para expandir)
- [ ] Focus visible en todos los controles
- [ ] Roles ARIA apropiados (`role="button"` en header)
- [ ] `tabIndex={0}` en header para teclado

### Tokens del Sistema
- [ ] Bordes: `border-[var(--border)]` o `border-border`
- [ ] Fondos: `bg-[var(--background)]` o `bg-bg`
- [ ] Texto: `text-[var(--foreground)]` o `text-fg`
- [ ] Muted: `text-[var(--muted-foreground)]` o `text-on-muted`
- [ ] Destructive: `text-[var(--destructive)]` para errores
- [ ] Primary: `text-[var(--primary)]` para íconos
- [ ] Focus ring: `focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)]`
- [ ] Sin colores hardcodeados (#hex o rgb())

### Funcionalidad
- [ ] Card se expande/colapsa con click en header
- [ ] Estado `isExpanded` controla visibilidad del body
- [ ] Campos condicionales se ocultan cuando hasPCP !== "Yes"
- [ ] Validación solo activa para campos visibles
- [ ] Errores se limpian al corregir valor
- [ ] Sin `console.log` o `console.*`

### Layout Responsivo
- [ ] Grid de 2 columnas en desktop (md:grid-cols-2)
- [ ] 1 columna en mobile
- [ ] Espaciado consistente (space-y-2, gap-6)
- [ ] Card con `rounded-3xl shadow-md mb-6`

---

## 📊 PATRÓN DE IMPLEMENTACIÓN CONSISTENTE

### Header del Card
```typescript
<div
  id={`${sectionUid}-header`}
  className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
  onClick={onSectionToggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSectionToggle()
    }
  }}
  role="button"
  tabIndex={0}
  aria-expanded={isExpanded}
  aria-controls={`${sectionUid}-panel`}
>
  <div className="flex items-center gap-2">
    <User className="h-5 w-5 text-[var(--primary)]" />
    <h2 className="text-lg font-medium text-[var(--foreground)]">
      Primary Care Provider (PCP)
    </h2>
  </div>
  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
</div>
```

### Select con Validación
```typescript
<Select
  value={hasPCP}
  onValueChange={(value) => {
    setHasPCP(value)
    if (value) setShowHasPCPError(false)
  }}
>
  <SelectTrigger
    id="pcp-has"
    className="w-full"
    aria-label="Has Primary Care Provider"
    aria-required="true"
    aria-invalid={showHasPCPError ? "true" : undefined}
    aria-describedby={showHasPCPError ? "pcp-has-error" : undefined}
  >
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Yes">Yes</SelectItem>
    <SelectItem value="No">No</SelectItem>
    <SelectItem value="Unknown">Unknown</SelectItem>
  </SelectContent>
</Select>
```

---

## 🚀 PRÓXIMOS PASOS

### Fase 1: Implementación UI (Este Sprint)
1. Crear `ProvidersSection.tsx` con campos y validación local
2. Integrar al `Step3DiagnosesClinical.tsx`
3. Validar accesibilidad y tokens
4. Testing manual de flujos

### Fase 2: Integración con Store (Futuro)
1. Conectar con store global de intake
2. Persistencia de datos
3. Integración con backend/Supabase
4. Validación server-side con Zod

### Fase 3: Campos Adicionales (Opcional)
- Fecha de última visita
- Especialidad del provider
- Fax number
- Email
- Authorized to share (checkbox)

---

## 📝 NOTAS TÉCNICAS

### Reutilización de Patrones
- El componente seguirá exactamente el mismo patrón que `FunctionalAssessmentSection.tsx`
- Usará los mismos componentes primitivos y tokens
- Mantendrá consistencia visual y de comportamiento

### Separación de Concerns
- UI layer only - sin lógica de negocio
- Estado local para esta iteración
- Preparado para futura integración con store

### Performance
- Renderizado condicional del body (no se monta si está colapsado)
- Sin efectos secundarios innecesarios
- Estado local optimizado

---

**Auditado por:** Claude Code Assistant
**Fecha:** 2025-09-26
**Estado:** Listo para implementación