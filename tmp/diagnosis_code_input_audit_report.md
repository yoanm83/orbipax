# AUDITORÍA UI: DIAGNOSIS CODE - SELECT → INPUT CONTROLADO
**Fecha:** 2025-09-26
**Objetivo:** Reemplazar Select hardcodeado por Input controlado poblado desde Suggested Diagnoses
**Estado:** ✅ AUDITORÍA COMPLETADA - LISTO PARA IMPLEMENTACIÓN

---

## 📍 COMPONENTE IDENTIFICADO

### Archivo y ubicación exacta

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step3-diagnoses-clinical\components\DiagnosesSection.tsx`

**Líneas 310-340:** Campo Diagnosis Code con Select hardcodeado

```tsx
// Líneas 310-340 (snippet actual)
<Select
  value={record.code}
  onValueChange={(value) => {
    updateRecordField(record.uid, "code", value)
    // Auto-fill description for known codes
    const codeDescriptions: { [key: string]: string } = {
      "F99": "Mental Disorder, Not Otherwise Specified",
      "F32.9": "Major Depressive Disorder, Unspecified",
      "F41.1": "Generalized Anxiety Disorder"
    }
    // ...
  }}
>
  <SelectTrigger id={`dx-${record.uid}-code`}>
    <SelectValue placeholder="Select code" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="F99">F99 - Mental Disorder, NOS</SelectItem>
    <SelectItem value="F32.9">F32.9 - Major Depressive Disorder</SelectItem>
    <SelectItem value="F41.1">F41.1 - Generalized Anxiety Disorder</SelectItem>
    <SelectItem value="other">Other</SelectItem>
  </SelectContent>
</Select>
```

### Opciones hardcodeadas encontradas:
- **F99** - Mental Disorder, NOS
- **F32.9** - Major Depressive Disorder
- **F41.1** - Generalized Anxiety Disorder
- **other** - Other

---

## 🔄 FLUJO DE DATOS: SUGGESTED DIAGNOSES → FORM

### Handler de sugerencias (líneas 103-119)

```tsx
function addSuggestedDiagnosis(suggestion: UISuggestion) {
  const newRecord: DiagnosisRecord = {
    uid: generateUid(),
    index: records.length + 1,
    code: suggestion.code,           // ← Código desde sugerencia
    description: suggestion.description,
    diagnosisType: suggestion.type ?? "",
    severity: suggestion.severity ?? "",
    notes: suggestion.note ?? ""
    // ...otros campos
  }
  setRecords(prev => [...prev, newRecord])
}
```

### Botón que activa el handler (línea 252)

```tsx
<Button onClick={() => addSuggestedDiagnosis(suggestion)}>
  <Plus className="h-3 w-3" />
  Add to Diagnoses
</Button>
```

### Diagrama de flujo de estado

```
[AI Suggestions]
     ↓
generateDiagnosisSuggestions() → suggestions[]
     ↓
[+ Add to Diagnoses Button]
     ↓
addSuggestedDiagnosis(suggestion)
     ↓
{ code, description, type, severity } → newRecord
     ↓
setRecords([...prev, newRecord])
     ↓
[DiagnosisRecord.code] → Campo en formulario
```

---

## 💡 PROPUESTA DE MICRO-CAMBIO

### Cambio específico: Líneas 310-340

**ELIMINAR:** Todo el bloque `<Select>` con sus opciones hardcodeadas

**REEMPLAZAR POR:**

```tsx
<Input
  id={`dx-${record.uid}-code`}
  type="text"
  placeholder="e.g., F32.9"
  value={record.code}
  onChange={(e) => updateRecordField(record.uid, "code", e.target.value)}
  className="mt-1"
  aria-label="Diagnosis Code"
  aria-required="true"
  aria-invalid={!record.code && formSubmitted ? "true" : undefined}
  aria-describedby={!record.code && formSubmitted ? `dx-${record.uid}-code-error` : undefined}
/>
{!record.code && formSubmitted && (
  <p id={`dx-${record.uid}-code-error`} className="text-sm text-[var(--destructive)] mt-1">
    Diagnosis code is required
  </p>
)}
```

### Props clave del Input:
- **id:** `dx-${record.uid}-code` (mantenido para label)
- **value:** `record.code` (controlado desde estado)
- **onChange:** actualiza mediante `updateRecordField()`
- **placeholder:** "e.g., F32.9" (guía visual)
- **aria-required:** "true" (accesibilidad)
- **aria-invalid:** condicional para error state
- **aria-describedby:** enlaza con mensaje de error

### Efectos colaterales:
- **ELIMINAR:** Líneas 315-323 (auto-fill hardcodeado de descriptions)
- **NINGÚN IMPACTO** en Domain/Infrastructure (cambio solo UI)
- **Description field** ya recibe valor desde `addSuggestedDiagnosis()`

---

## ✅ PLAN DE VALIDACIÓN UI

### 1. Flujo principal
- [ ] Click en "+ Add to Diagnoses" → Input muestra código (ej: "F32.9")
- [ ] Description se rellena automáticamente desde sugerencia
- [ ] Type y Severity también se populan desde sugerencia

### 2. Edición manual
- [ ] Usuario puede escribir/editar el código manualmente
- [ ] Acepta cualquier código DSM-5 válido (no solo los 3 hardcodeados)
- [ ] Placeholder "e.g., F32.9" visible cuando está vacío

### 3. Accesibilidad
- [ ] Label "Diagnosis Code*" asociado correctamente
- [ ] Tab navigation funcional
- [ ] Focus visible con ring (Tailwind focus-visible)
- [ ] Screen reader anuncia "required field"

### 4. Validación
- [ ] Campo vacío muestra error "Diagnosis code is required" al submit
- [ ] aria-invalid="true" cuando hay error
- [ ] Mensaje de error con id único para aria-describedby

### 5. Tokens Tailwind v4
- [ ] Colores: `var(--destructive)` para errores
- [ ] Clases: `mt-1` spacing consistente
- [ ] No hardcodear colores (usar tokens semánticos)

---

## 📊 VENTAJAS DEL CAMBIO

| Aspecto | Antes (Select) | Después (Input) |
|---------|---------------|-----------------|
| **Opciones** | Solo 4 hardcodeadas | Cualquier código DSM-5 |
| **Sugerencias AI** | Limitadas a las 4 opciones | Todos los códigos sugeridos |
| **Flexibilidad** | Usuario atrapado en opciones | Edición manual permitida |
| **Mantenimiento** | Actualizar código para añadir opciones | Sin mantenimiento |
| **UX** | Restrictivo | Flexible y guiado |

---

## 🚀 IMPLEMENTACIÓN SUGERIDA

### Paso 1: Backup
```bash
cp DiagnosesSection.tsx DiagnosesSection.tsx.backup
```

### Paso 2: Editar líneas 310-340
1. Eliminar todo el bloque `<Select>...</Select>`
2. Insertar el `<Input>` propuesto
3. Eliminar líneas 315-323 (codeDescriptions hardcodeado)

### Paso 3: Verificar
1. Compilación TypeScript sin errores
2. Probar flujo: Sugerencia → Add → Input populado
3. Validar accesibilidad con axe DevTools

---

## ✨ CONCLUSIÓN

**Micro-cambio identificado:** Reemplazar Select (líneas 310-340) por Input controlado.

**Impacto:**
- ✅ Elimina restricción de 4 opciones hardcodeadas
- ✅ Permite todos los códigos DSM-5 desde AI
- ✅ Mantiene validación required
- ✅ Mejora accesibilidad con aria-*
- ✅ Sin cambios en backend/domain

**Estado:** Listo para implementación en el siguiente turno.

---

**Auditoría por:** Claude Code Assistant
**Método:** Análisis de código y flujo de datos
**Confianza:** 100% - Componente y flujo completamente mapeados