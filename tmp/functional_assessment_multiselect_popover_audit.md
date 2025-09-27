# AUDITORÍA: POPOVER DEL MULTISELECT - ESTILOS Y TOKENS

**Fecha:** 2025-09-26
**Objetivo:** Encontrar causa raíz del dropdown sin estilos y proponer micro-fix
**Estado:** ✅ CAUSA IDENTIFICADA + MICRO-FIX PROPUESTO

---

## 📊 MATRIZ COMPARATIVA: SELECT BUENO VS MULTISELECT

| Aspecto | Select (ADLs/IADLs) | MultiSelect | Diferencia |
|---------|---------------------|-------------|------------|
| **Archivo** | `src/shared/ui/primitives/Select/index.tsx` | `src/shared/ui/primitives/MultiSelect/index.tsx` | - |
| **Import Popover** | N/A (usa SelectPrimitive.Portal) | `from "@/shared/ui/primitives/Popover"` ✅ | Correcto |
| **Portal** | `<SelectPrimitive.Portal>` | `<PopoverPrimitive.Portal>` (interno) ✅ | Ambos usan portal |
| **z-index** | `z-50` | `z-50` (heredado) ✅ | Correcto |
| **Ancho** | `w-[min(100vw,24rem)]` + trigger-width | `w-[var(--radix-popover-trigger-width)]` ✅ | Correcto |
| **Fondo** | `bg-[var(--popover)]` ❗ | **FALTANTE** ❌ | **PROBLEMA** |
| **Texto** | `text-[var(--popover-foreground)]` ❗ | **FALTANTE** ❌ | **PROBLEMA** |
| **Borde** | `border border-border` ❗ | **FALTANTE** ❌ | **PROBLEMA** |
| **Sombra** | `shadow-md` ❗ | **FALTANTE** ❌ | **PROBLEMA** |
| **Padding** | `p-1` (en Viewport) | `p-0` ✅ | Correcto |
| **Animaciones** | data-state animations | Heredadas del Popover base ✅ | Correcto |

---

## 🔍 ANÁLISIS DETALLADO

### SelectContent (BUENO)
**Líneas 76-106 en `Select/index.tsx`:**

```typescript
const SelectContent = React.forwardRef<...>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] w-[min(100vw,24rem)] overflow-hidden rounded-md",
          // TOKENS CRÍTICOS:
          "border border-border",           // ← Borde con token
          "bg-[var(--popover)]",            // ← Fondo con variable
          "text-[var(--popover-foreground)]", // ← Texto con variable
          "shadow-md",                      // ← Sombra
          // Animaciones...
        )}
      >
```

### PopoverContent (BASE COMPARTIDO)
**Líneas 12-28 en `Popover/index.tsx`:**

```typescript
const PopoverContent = React.forwardRef<...>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          "z-50 w-72 rounded-md",
          "border",                    // ← Tiene borde base
          "bg-popover",                // ← Tiene bg (sin var())
          "p-4",
          "text-popover-foreground",   // ← Tiene text (sin var())
          "shadow-md",                 // ← Tiene sombra
          // Animaciones...
          className
        )}
```

### MultiSelect (PROBLEMA)
**Líneas 179-185 en `MultiSelect/index.tsx`:**

```typescript
<PopoverContent
  className="w-[var(--radix-popover-trigger-width)] p-0"  // ← SOLO ancho y padding
  align="start"
  onOpenAutoFocus={(e) => {
    e.preventDefault()
  }}
>
```

**PROBLEMA IDENTIFICADO:**
El MultiSelect está **sobrescribiendo TODAS las clases** del PopoverContent base con solo `"w-[var(--radix-popover-trigger-width)] p-0"`, perdiendo:
- `border`
- `bg-popover`
- `text-popover-foreground`
- `shadow-md`
- `rounded-md`
- `z-50`

---

## 💡 CAUSA RAÍZ

**El `className` pasado al PopoverContent REEMPLAZA las clases base en lugar de EXTENDERLAS.**

El PopoverContent base tiene:
```typescript
className={cn(
  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md ...",
  className  // ← Este className SOBRESCRIBE TODO si no se preservan las clases
)}
```

Cuando MultiSelect pasa `className="w-[var(--radix-popover-trigger-width)] p-0"`, está eliminando TODOS los estilos de tema.

---

## 🔧 MICRO-FIX PROPUESTO

### Archivo: `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\MultiSelect\index.tsx`
### Línea: 179-185

**CAMBIAR DE:**
```typescript
<PopoverContent
  className="w-[var(--radix-popover-trigger-width)] p-0"
  align="start"
  onOpenAutoFocus={(e) => {
    e.preventDefault()
  }}
>
```

**CAMBIAR A:**
```typescript
<PopoverContent
  className="w-[var(--radix-popover-trigger-width)] min-w-[8rem] border border-border bg-[var(--popover)] text-[var(--popover-foreground)] shadow-md p-0"
  align="start"
  onOpenAutoFocus={(e) => {
    e.preventDefault()
  }}
>
```

### Clases añadidas:
1. `min-w-[8rem]` - Ancho mínimo como Select
2. `border border-border` - Borde con token del sistema
3. `bg-[var(--popover)]` - Fondo con variable CSS
4. `text-[var(--popover-foreground)]` - Color de texto con variable
5. `shadow-md` - Sombra consistente

**Nota:** No añadimos `rounded-md` ni `z-50` porque ya vienen del PopoverContent base y no se sobrescriben.

---

## ✅ VERIFICACIÓN POST-FIX

Después de aplicar el micro-fix, verificar:

1. **Visual:**
   - [ ] Borde visible con color `border-border`
   - [ ] Fondo con color de `--popover` (típicamente blanco/dark)
   - [ ] Texto con color `--popover-foreground`
   - [ ] Sombra visible (`shadow-md`)
   - [ ] Ancho = trigger width
   - [ ] Esquinas redondeadas preservadas

2. **Funcional:**
   - [ ] No empuja layout (portal funciona)
   - [ ] z-index correcto (sobre otros elementos)
   - [ ] Búsqueda sigue funcionando
   - [ ] Pills siguen siendo seleccionables

3. **Accesibilidad:**
   - [ ] Teclado intacto (arrows, enter, escape)
   - [ ] ARIA attributes preservados
   - [ ] Focus management correcto

---

## 📝 CONCLUSIÓN

**Causa raíz única:** El MultiSelect pasaba un `className` minimalista que sobrescribía TODAS las clases del PopoverContent base, perdiendo los tokens del sistema de diseño.

**Solución:** Añadir explícitamente los tokens de borde, fondo, texto y sombra al className del PopoverContent, preservando el ancho dinámico y padding 0.

**Impacto:** Mínimo - solo 1 línea modificada, sin cambios en lógica ni comportamiento.

---

**Auditado por:** Claude Code Assistant
**Método:** Comparación lado a lado de componentes
**Archivos no modificados, solo auditados**