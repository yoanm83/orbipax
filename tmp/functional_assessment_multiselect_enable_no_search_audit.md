# AUDITORÍA: MULTISELECT OPCIONES DESHABILITADAS + ELIMINAR SEARCH

**Fecha:** 2025-09-26
**Objetivo:** Identificar causa de opciones deshabilitadas y proponer eliminación del search
**Estado:** ✅ CAUSA IDENTIFICADA + MICRO-FIX PROPUESTO

---

## 📋 RESUMEN EJECUTIVO

**Problema 1:** Las opciones del MultiSelect aparecen deshabilitadas visualmente debido a `opacity-50` aplicado a TODOS los checkboxes no seleccionados.

**Problema 2:** El search bar es innecesario para solo 5 opciones y añade complejidad.

**Solución:** Dos micro-cambios puntuales en el componente MultiSelect.

---

## 🔍 ANÁLISIS DE CAUSA RAÍZ - OPCIONES DESHABILITADAS

### Tabla Causa → Evidencia

| Aspecto | Archivo/Línea | Evidencia | Impacto |
|---------|---------------|-----------|---------|
| **Uso del MultiSelect** | `FunctionalAssessmentSection.tsx:143-153` | NO pasa `disabled` prop | ✅ No es la causa |
| **CommandItem base** | `Command/index.tsx:120` | `data-[disabled=true]:pointer-events-none` | ✅ Condicional, no activo |
| **MultiSelect CommandItem** | `MultiSelect/index.tsx:217` | `data-[disabled]:pointer-events-none` | ✅ Condicional, no activo |
| **Checkbox no seleccionado** | `MultiSelect/index.tsx:224` | `opacity-50` siempre aplicado | ❌ **CAUSA RAÍZ** |

### Código problemático (líneas 219-228)

```typescript
<div
  className={cn(
    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
    selected.includes(option.value)
      ? "bg-primary text-primary-foreground"
      : "opacity-50 [&_svg]:invisible",  // ← PROBLEMA: opacity-50 en TODAS las no seleccionadas
  )}
>
  <Check className="h-4 w-4" />
</div>
```

### Comparación con SelectItem (funcionando correctamente)

**Select/index.tsx:132** usa `data-[disabled]:opacity-50` - solo cuando REALMENTE está disabled.

**MultiSelect** aplica `opacity-50` a TODOS los checkboxes no seleccionados, haciéndolos parecer deshabilitados.

---

## 🔍 ANÁLISIS DEL SEARCH BAR

### Situación actual

| Archivo/Línea | Componente | Propósito |
|---------------|------------|-----------|
| `MultiSelect/index.tsx:194-200` | `<CommandInput>` | Barra de búsqueda |
| `MultiSelect/index.tsx:60` | `searchValue` state | Estado del search |
| `MultiSelect/index.tsx:187-192` | `filter` function | Lógica de filtrado |

### Análisis de necesidad

- **Total de opciones:** 5 (Social, Interpersonal, Behavioral, Vocational, Coping)
- **Altura del dropdown:** `max-h-[200px]` - todas visibles sin scroll
- **Conclusión:** Search innecesario para tan pocas opciones

### Props disponibles

**Revisado:** `MultiSelectProps` (líneas 32-44) - NO existe prop `showSearch` actualmente.

---

## 🔧 MICRO-FIX PROPUESTO #1: HABILITAR OPCIONES

### Archivo: `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\MultiSelect\index.tsx`
### Línea: 224

**CAMBIAR DE:**
```typescript
: "opacity-50 [&_svg]:invisible",
```

**CAMBIAR A:**
```typescript
: "border-gray-300 [&_svg]:invisible",
```

### Justificación
- Elimina el `opacity-50` que hace parecer todo deshabilitado
- Mantiene `[&_svg]:invisible` para ocultar el check cuando no está seleccionado
- Añade `border-gray-300` para diferenciar visualmente del estado seleccionado (border-primary)

---

## 🔧 MICRO-FIX PROPUESTO #2: ELIMINAR SEARCH BAR

### Opción A: Agregar prop `showSearch` (RECOMENDADA)

#### Paso 1: Agregar prop a la interfaz
**Archivo:** `MultiSelect/index.tsx`
**Línea:** 43 (después de `id?: string`)

```typescript
interface MultiSelectProps {
  // ... props existentes ...
  id?: string
  showSearch?: boolean  // ← AÑADIR ESTA LÍNEA
}
```

#### Paso 2: Recibir prop en el componente
**Línea:** 57 (en la desestructuración de props)

```typescript
export function MultiSelect({
  // ... props existentes ...
  id,
  showSearch = true,  // ← AÑADIR con default true
}: MultiSelectProps) {
```

#### Paso 3: Condicionar renderizado del CommandInput
**Líneas:** 194-200

**CAMBIAR DE:**
```typescript
<CommandInput
  placeholder="Search..."
  value={searchValue}
  onValueChange={setSearchValue}
  onKeyDown={handleKeyDown}
  className="h-9"
/>
```

**CAMBIAR A:**
```typescript
{showSearch && (
  <CommandInput
    placeholder="Search..."
    value={searchValue}
    onValueChange={setSearchValue}
    onKeyDown={handleKeyDown}
    className="h-9"
  />
)}
```

#### Paso 4: Usar en FunctionalAssessmentSection
**Archivo:** `FunctionalAssessmentSection.tsx`
**Línea:** 152 (después de `aria-label`)

```typescript
<MultiSelect
  // ... props existentes ...
  aria-label="Affected Domains"
  showSearch={false}  // ← AÑADIR ESTA LÍNEA
/>
```

### Opción B: Eliminar directamente (NO recomendada)
Simplemente eliminar líneas 194-200, pero esto afectaría a TODOS los MultiSelect del sistema.

---

## ✅ PLAN DE VERIFICACIÓN POST-FIX

### 1. Verificación Visual
- [ ] Opciones NO aparecen con opacity-50 cuando no están seleccionadas
- [ ] Checkbox no seleccionado: borde gris visible, sin check
- [ ] Checkbox seleccionado: fondo primary, check blanco visible
- [ ] Sin barra de búsqueda en "Affected Domains"
- [ ] Dropdown mantiene tokens (borde, fondo, sombra)

### 2. Verificación Funcional
- [ ] Click en opción la selecciona/deselecciona
- [ ] Enter en opción con foco la selecciona/deselecciona
- [ ] Pills se crean al seleccionar
- [ ] X en pill la elimina
- [ ] Backspace elimina última pill (sin search bar interferir)
- [ ] Navegación con flechas sigue funcionando

### 3. Verificación de Accesibilidad
- [ ] `role="option"` preservado
- [ ] `aria-selected` cambia correctamente
- [ ] `aria-multiselectable="true"` en listbox
- [ ] Sin `aria-disabled` activo
- [ ] Sin `tabIndex={-1}`
- [ ] Focus visible en opciones con teclado

### 4. Verificación de No Regresión
- [ ] Otros MultiSelect con search siguen funcionando
- [ ] ADLs/IADLs/Cognitive Select sin cambios
- [ ] Validación ≥1 dominio sigue funcionando
- [ ] Mensajes de error accesibles

---

## 📊 IMPACTO DE LOS CAMBIOS

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Apariencia opciones** | opacity-50 (parecen disabled) | Borde normal, clickeables |
| **Search bar** | Siempre visible | Controlado por prop |
| **Líneas modificadas** | 0 | ~4 líneas |
| **Breaking changes** | - | Ninguno (prop opcional) |
| **Otros MultiSelect** | - | Sin cambios |

---

## 📝 CONCLUSIÓN

**Causa raíz identificada:** `opacity-50` aplicado indiscriminadamente a checkboxes no seleccionados.

**Solución mínima:**
1. Remover `opacity-50`, mantener solo diferenciación por borde
2. Añadir prop opcional `showSearch` para controlar búsqueda

**Estado final esperado:** Opciones claramente seleccionables, sin search innecesario para 5 items.

---

**Auditado por:** Claude Code Assistant
**Método:** Comparación con componentes funcionales
**Archivos NO modificados, solo auditados**