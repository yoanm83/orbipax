# AUDITORÍA: AFFECTED DOMAINS - ALINEACIÓN CON WHODAS 2.0

**Fecha:** 2025-09-26
**Objetivo:** Alinear opciones de "Affected Domains" con estándar WHODAS 2.0 de la OMS
**Estado:** ✅ AUDITORÍA COMPLETADA + MICRO-FIX PROPUESTO

---

## 📋 RESUMEN EJECUTIVO

Las opciones actuales del multiselect "Affected Domains" no están alineadas con el estándar internacional WHODAS 2.0 (World Health Organization Disability Assessment Schedule).

**Hallazgos principales:**
- Faltan dominios críticos: **Mobility** y **Participation**
- Existe duplicación parcial con campos vecinos (Cognitive Functioning)
- Algunos items actuales no corresponden a dominios funcionales sino a síntomas/estrategias

**Recomendación:** Actualizar a los 5 dominios WHODAS relevantes (excluyendo Cognition que ya existe como campo separado).

---

## 🌐 ESTÁNDAR PROFESIONAL: WHODAS 2.0

### Fuente: Organización Mundial de la Salud (OMS/WHO)

El WHODAS 2.0 define **6 dominios universales de funcionamiento**:

1. **Cognition** - Understanding and communicating
2. **Mobility** - Moving and getting around
3. **Self-care** - Hygiene, dressing, eating, staying alone
4. **Getting along** - Interacting with other people
5. **Life activities** - Domestic responsibilities, leisure, work and school
6. **Participation** - Joining in community activities, participating in society

**Referencia:** WHO (2010). Measuring Health and Disability: Manual for WHO Disability Assessment Schedule (WHODAS 2.0). Geneva: World Health Organization.

### Contexto DSM-5-TR

El DSM-5-TR recomienda el uso del WHODAS 2.0 como medida de funcionamiento transversal, complementando la evaluación diagnóstica con una medida estandarizada del impacto funcional.

**Referencia:** American Psychiatric Association (2022). Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR). Section III: Emerging Measures and Models.

---

## 📊 MATRIZ DE MAPEO: ACTUAL VS. WHODAS 2.0

| Dominio WHODAS 2.0 | Opciones Actuales | Estado | Observaciones |
|-------------------|-------------------|--------|---------------|
| **1. Cognition** | - | ❌ Falta en multiselect | ✅ YA EXISTE como campo separado "Cognitive Functioning*" |
| **2. Mobility** | - | ❌ **FALTA** | Crítico para evaluación funcional |
| **3. Self-care** | - | ❌ Falta explícito | Parcialmente cubierto por "ADLs*" pero no en multiselect |
| **4. Getting along** | "Social" + "Interpersonal" | ⚠️ Duplicado | Dos opciones para un dominio |
| **5. Life activities** | "Vocational/Educational" | ⚠️ Parcial | Falta componente doméstico/leisure |
| **6. Participation** | - | ❌ **FALTA** | Crítico para inclusión social |
| - | "Behavioral Regulation" | ❓ No WHODAS | Síntoma/estrategia, no dominio funcional |
| - | "Coping Skills" | ❓ No WHODAS | Estrategia de afrontamiento, no dominio |

### Análisis de Campos Vecinos

| Campo | Cubre | Implicación |
|-------|-------|-------------|
| **"Cognitive Functioning*"** | WHODAS Domain 1 | No duplicar en multiselect |
| **"Is client independent in ADLs?*"** | Parte de Self-care | Evaluación binaria, no dominio específico |
| **"Is client independent in IADLs?*"** | Parte de Life activities | Evaluación binaria, no dominio específico |

---

## 🎯 GAPS IDENTIFICADOS

### Dominios Faltantes Críticos

1. **MOBILITY** - Absolutamente ausente
   - Esencial para evaluación funcional completa
   - Incluye: caminar, subir escaleras, moverse en casa/comunidad

2. **PARTICIPATION** - Completamente ausente
   - Crítico para salud mental comunitaria
   - Incluye: actividades comunitarias, recreación, participación cívica

3. **SELF-CARE** - Sin representación explícita
   - Aunque ADLs lo evalúa binariamente, el dominio específico falta
   - Importante para identificar áreas específicas de dificultad

### Problemas de Categorización

1. **Duplicación innecesaria:** "Social" e "Interpersonal" son redundantes
2. **Items no-dominios:** "Behavioral Regulation" y "Coping Skills" son síntomas/estrategias
3. **Cobertura parcial:** "Vocational/Educational" no cubre todo "Life activities"

---

## 💡 MICRO-FIX PROPUESTO

### Opción A: WHODAS Completo Sin Cognition (RECOMENDADA)

Reemplazar `AFFECTED_DOMAINS` con estos 5 dominios (excluyendo Cognition ya evaluado aparte):

```typescript
const AFFECTED_DOMAINS: Option[] = [
  { value: 'mobility', label: 'Mobility (moving & getting around)' },
  { value: 'self-care', label: 'Self-care (hygiene, dressing, eating)' },
  { value: 'getting-along', label: 'Getting along (interpersonal interactions)' },
  { value: 'life-activities', label: 'Life activities (domestic, work & school)' },
  { value: 'participation', label: 'Participation (community & social activities)' }
]
```

### Opción B: WHODAS Completo (6 dominios)

Si se prefiere completitud sobre evitar duplicación:

```typescript
const AFFECTED_DOMAINS: Option[] = [
  { value: 'cognition', label: 'Cognition (understanding & communicating)' },
  { value: 'mobility', label: 'Mobility (moving & getting around)' },
  { value: 'self-care', label: 'Self-care (hygiene, dressing, eating)' },
  { value: 'getting-along', label: 'Getting along (interpersonal interactions)' },
  { value: 'life-activities', label: 'Life activities (domestic, work & school)' },
  { value: 'participation', label: 'Participation (community & social activities)' }
]
```

### Justificación de la Opción A

1. **Evita duplicación:** Cognition ya se evalúa en campo dedicado
2. **Consistencia:** Mantiene separación clara entre dominios y evaluaciones específicas
3. **Eficiencia:** Reduce carga cognitiva del usuario
4. **Estándar completo:** Cubre todos los dominios WHODAS no evaluados elsewhere

---

## ✅ VENTAJAS DE LA ALINEACIÓN WHODAS

1. **Estándar internacional:** Reconocido por OMS y usado globalmente
2. **Compatibilidad DSM-5-TR:** Recomendado para evaluación funcional
3. **Comprehensivo:** Cubre todas las áreas de funcionamiento humano
4. **Evidence-based:** Validado en múltiples poblaciones y culturas
5. **Interoperabilidad:** Facilita comunicación con otros sistemas de salud
6. **Reembolso:** Muchos pagadores reconocen WHODAS para justificar servicios

---

## 📝 CHECKLIST PARA IMPLEMENTACIÓN

### Cambios Requeridos

- [ ] Actualizar constante `AFFECTED_DOMAINS` en `FunctionalAssessmentSection.tsx`
- [ ] Usar Opción A (5 dominios sin Cognition)
- [ ] Mantener validación ≥1 seleccionado (sin cambios)
- [ ] Preservar multiselect UI/UX actual (sin cambios)
- [ ] No modificar campos ADLs/IADLs/Cognitive (siguen independientes)

### Testing Post-Cambio

- [ ] Verificar que las 5 nuevas opciones aparecen correctamente
- [ ] Confirmar que los labels descriptivos son legibles
- [ ] Validar que la selección múltiple funciona
- [ ] Asegurar que validación ≥1 sigue activa
- [ ] Verificar que no hay conflicto con Cognitive Functioning field

### Documentación

- [ ] Actualizar documentación clínica mencionando uso de WHODAS 2.0
- [ ] Entrenar staff en interpretación de dominios WHODAS
- [ ] Considerar agregar tooltip/help text explicando cada dominio

---

## 🚀 IMPACTO ESPERADO

### Beneficios Clínicos
- Evaluación funcional más completa y estandarizada
- Mejor identificación de áreas de intervención
- Facilita tracking de progreso usando framework reconocido
- Mejora comunicación interprofesional

### Beneficios de Compliance
- Alineación con mejores prácticas internacionales
- Cumplimiento con recomendaciones DSM-5-TR
- Preparación para auditorías y acreditación
- Compatibilidad con sistemas de reporte estatal/federal

### Beneficios Técnicos
- Reducción de duplicación y ambigüedad
- Estructura de datos más clara
- Facilita futuras integraciones con otros sistemas
- Mejora calidad de datos para analytics

---

## 📌 CONCLUSIÓN

**Recomendación final:** Implementar **Opción A** - 5 dominios WHODAS excluyendo Cognition.

Esta actualización alinea el sistema con estándares internacionales de evaluación funcional mientras evita duplicación con campos existentes. El cambio es mínimo (solo actualizar una constante) pero el impacto en calidad clínica es significativo.

---

**Auditado por:** Claude Code Assistant
**Estándar de referencia:** WHODAS 2.0 (WHO, 2010)
**Archivo a modificar:** `FunctionalAssessmentSection.tsx` líneas 25-31