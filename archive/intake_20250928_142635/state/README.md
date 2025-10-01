# Intake State Management

## Alcance UI-Only

Este directorio maneja **únicamente estado de UI** para el módulo de intake:

- **Navegación del wizard**: paso actual, transiciones, flags de UI
- **Estados efímeros**: paneles abiertos, errores de presentación, toggles
- **Selecciones no sensibles**: IDs de opciones, banderas de configuración

## Prohibiciones Estrictas

### ❌ NO PHI (Protected Health Information)
- Sin datos demográficos del paciente
- Sin información clínica o diagnósticos
- Sin notas médicas o documentación sensible
- Sin valores de formularios con datos personales

### ❌ NO Persistencia en Cliente
- Sin localStorage ni sessionStorage para PHI
- Sin IndexedDB para datos clínicos
- Los borradores clínicos se manejan server-driven

### ❌ NO Lógica de Negocio
- Sin validaciones clínicas
- Sin cálculos médicos
- Sin fetch de datos
- Sin reglas de dominio

## Arquitectura

```
state/
├── slices/          # Slices por área funcional
│   ├── wizardProgress.slice.ts  # Navegación global del wizard
│   └── step1.ui.slice.ts        # Estado UI específico del Step1
├── selectors/       # Selectores puros de lectura
│   ├── wizard.selectors.ts      # Selectores de navegación
│   └── step1.selectors.ts       # Selectores UI del Step1
├── types.ts         # Tipos de estado UI
└── README.md        # Este archivo
```

## Step Slices - Patrón Modular

### ✅ Por Qué Step Slices
- **Evitar monolitos**: Mantener archivos pequeños (~150-200 LOC)
- **Reducir re-renders**: Componentes se suscriben solo a su slice
- **Escalabilidad modular**: Encaja con arquitectura de módulos OrbiPax

### ✅ Qué SÍ incluir en Step Slices
- **Flags UI**: toggles, panels abiertos, estados de presentación
- **Estados efímeros**: loading, errores visuales, transiciones locales
- **Preferencias UI**: modo compacto, tooltips, configuración visual

### ❌ Qué NO incluir en Step Slices
- **Valores de formulario**: Se manejan en React Hook Form
- **Datos PHI**: Cualquier información clínica/personal
- **Lógica de negocio**: Validaciones, cálculos, reglas de dominio
- **Persistencia**: Los drafts clínicos van al servidor

### 🎯 Límites No Negociables
- **Máximo 150-200 LOC** por slice
- **Solo selectores de lectura** (sin efectos)
- **Cero PHI** en cualquier slice de step
- **Sin persistencia** en localStorage/sessionStorage

### 📋 Cuándo Crear un Step Slice
Crear slice por step solo si ese step necesita **>2 flags UI recurrentes**:
- ✅ Múltiples secciones expandibles
- ✅ Estados de carga específicos
- ✅ Errores de presentación locales
- ❌ Solo valores de formulario → usar RHF
- ❌ Solo 1 toggle → usar useState local

### 🔗 Coordinación con Slice Global
- **wizardProgress.slice.ts**: Navegación entre steps, progreso general
- **step*.ui.slice.ts**: Estado visual específico de cada step
- **Sin dependencias cruzadas**: Los slices de steps son independientes

## Principios

1. **UI-Only**: Solo banderas, IDs y estado de navegación
2. **SoC Compliance**: UI → Application → Domain → Infrastructure
3. **No Side Effects**: Slices sin efectos ni fetch
4. **Server-Driven**: Borradores clínicos manejados en servidor
5. **Security First**: Cero PHI en cliente

## Futuro (NO implementar ahora)

Los borradores clínicos se implementarán como:
- Autosave en servidor con cifrado
- Sesión segura con RLS por organization_id
- Recuperación server-driven sin tocar cliente