# IMPLEMENTATION_GUIDE (OrbiPax CMH)

## 1) Arquitectura y filosofía clínica

**Modular Monolith para Healthcare** con límites estrictos entre módulos clínicos; SoC y BFF como patrones base. Módulos extraíbles a futuro, pero un único despliegue hoy con compliance HIPAA.

**Flujo de capas (inmutable)**: UI → Application → Domain y la Infrastructure solo es invocada por Application. La UI no contiene lógica clínica ni acceso a PHI.

**Principios clínicos**: el dominio nunca depende de infraestructura; cada módulo clínico es independiente; la orquestación vive en Application; patient safety es prioridad.

### Estructura base clínica
```
src/
  app/                # Next.js App Router (portales clínicos/admin/login)
  modules/
    patients/         # Demografía, historial médico, coordinación de cuidados
      domain/         # Entidades de paciente, reglas clínicas
      application/    # Casos de uso clínicos, validación PHI
      infrastructure/ # Repos de pacientes, integraciones externas
      ui/             # Formularios, listas, dashboards de pacientes
    appointments/     # Programación, disponibilidad de proveedores
    notes/            # Documentación clínica, notas de progreso
    clinicians/       # Gestión de proveedores, credenciales
    billing/          # Procesamiento de reclamos, seguros
    auth/             # Autenticación, autorización, sesiones
    admin/            # Administración del sistema, gestión de usuarios
    dashboard/        # Métricas clínicas agregadas, flujos de trabajo
  shared/
    auth/ ui/ lib/ schemas/ utils/
  infrastructure/     # Adaptadores de BD, servicios externos
```

## 2) Reglas de capa clínicas (obligatorias)

**UI no accede a PHI directamente**. Ejemplo correcto/incorrecto:
```typescript
// ❌ Wrong: UI calling patient data directly
export async function PatientPage() {
  const patient = await database.patients.find(...);  // Never! PHI exposure
}

// ✅ Correct: UI → Application → Infrastructure
export async function PatientPage() {
  const patient = await getPatientSummary();  // Application use case, PHI protected
}
```

**Aislamiento de módulos clínicos**: nunca modificar otros `src/modules/**` directamente; comunicación por puertos/servicios de aplicación clínica, no imports cruzados entre pacientes/citas/notas.

## 3) Seguridad HIPAA y multi-tenant sanitario

### Orden de wrappers (obligatorio en endpoints clínicos)
```typescript
withAuth → withSecurity → withRateLimit → withAudit → (withIdempotency en mutaciones PHI)
```
Con validación Zod antes de procesar datos clínicos.

**Multi-tenant healthcare**: RLS y filtros por `organization_id` en toda query clínica. **NUNCA PHI en logs**.

**Políticas de seguridad clínica**: rate limiting, audit trail clínico, idempotency para datos de pacientes, CSRF, HIPAA compliance y RLS estricto.

### Validación de roles clínicos
```typescript
// Validación obligatoria por rol de proveedor
const validateClinicalAccess = async (providerId: string, patientId: string, organizationId: string) => {
  // Verificar credenciales del proveedor
  // Confirmar acceso al paciente dentro de la organización
  // Registrar acceso para audit trail
};
```

## 4) Convenciones de código clínico

**TypeScript estricto para PHI**: sin `any`, tipos explícitos para datos de pacientes, Zod como source of truth para validación clínica.

**Estilo/quality clínico**: ESLint, Prettier, EditorConfig; commits convencionales con contexto clínico.

**Workflow clínico**: documentar decisiones clínicas en `/docs`, reportes de trabajo en `/tmp` (sin PHI), tests clínicos primero y revisar límites de módulo antes de añadir dependencias de pacientes.

## 5) UI/UX clínico (tokens, accesibilidad healthcare)

### Tokens clínicos y estilos
No hardcodear colores clínicos/tipografías/espaciados; usar variables CSS/Tailwind optimizadas para healthcare.

**Colores clínicos (OKLCH)** — variables mínimas para healthcare:
```css
@theme {
  /* Estados clínicos */
  --color-critical: oklch(0.62 0.22 25);     /* Emergencias médicas, urgente */
  --color-warning: oklch(0.75 0.15 85);      /* Precaución clínica, requiere atención */
  --color-normal: oklch(0.65 0.15 145);      /* Rangos normales, estable */
  --color-info: oklch(0.55 0.15 250);        /* Información clínica, no crítica */

  /* Jerarquía clínica de texto */
  --color-patient-primary: oklch(0.21 0.02 257);    /* Nombres de pacientes, datos primarios */
  --color-clinical-secondary: oklch(0.45 0.02 257); /* Notas clínicas, info secundaria */
  --color-provider-accent: oklch(0.35 0.08 257);    /* Nombres de proveedores, autoría */

  /* Accesibilidad para healthcare */
  --color-focus: oklch(0.55 0.18 250);      /* Indicadores de foco para formularios clínicos */
  --color-border-clinical: oklch(0.85 0.02 257); /* Bordes de formularios, secciones de datos */
}
```

### Tipografía clínica y jerarquía
Usar la jerarquía `text-step-*` para títulos clínicos/labels/captions/bodys; nunca tamaños "a mano" para datos de pacientes.

### Espaciado healthcare (Material 3 + accesibilidad)
Basado en grid de 4px con targets táctiles ≥44px para dispositivos médicos; mapping: `space-xs` 8px, `space-sm` 12px, `space-md` 16px, `space-lg` 24px.

### Accesibilidad clínica (WCAG 2.1 AA healthcare)
Roles y ARIA para datos clínicos (`region`/`group`/`status`, `aria-*` required/invalid/expanded/controls, `live` polite/assertive); touch targets ≥44×44px para tabletas clínicas.

**Ejemplos clínicos específicos**:
```typescript
// Formulario de paciente accesible
<form role="form" aria-labelledby="patient-form-title">
  <fieldset role="group" aria-labelledby="demographics">
    <legend id="demographics">Demografía del Paciente</legend>
    <input
      aria-required="true"
      aria-invalid={errors.firstName ? 'true' : 'false'}
      aria-describedby={errors.firstName ? 'firstName-error' : undefined}
    />
  </fieldset>
</form>

// Alerta clínica accesible
<div role="alert" aria-live="assertive" className="bg-critical text-on-critical">
  Valor crítico: Presión arterial elevada requiere atención inmediata
</div>
```

### Container queries para dispositivos clínicos
Priorizar `@container` sobre media queries globales para adaptarse a tabletas clínicas y estaciones de trabajo.

## 6) Formularios clínicos y feedback

**Forms clínicos**: React Hook Form + zodResolver obligatorio para datos de pacientes; `inputMode` y `autoComplete` correctos para campos médicos; altura mínima 44px; errores claros para datos clínicos.

**Validación clínica**: un único esquema Zod por caso de uso clínico; inferencia de tipos desde el esquema para datos de pacientes.

```typescript
// Esquema de validación para datos de paciente
const PatientDemographicsSchema = z.object({
  firstName: z.string().min(1, "Nombre del paciente requerido"),
  lastName: z.string().min(1, "Apellido del paciente requerido"),
  dateOfBirth: z.date().max(new Date(), "Fecha de nacimiento no puede estar en el futuro"),
  medicalRecordNumber: z.string().optional(),
  organizationId: z.string().uuid("ID de organización válido requerido"),
});

type PatientDemographics = z.infer<typeof PatientDemographicsSchema>;
```

**Toasts clínicos**: prohibido `console.*` con PHI; usar `toast()` con variantes clínicas (success/destructive/warning/info) y anuncios ARIA para alertas médicas.

**Skeletons clínicos**: roles/ARIA (`role="status"`, `aria-busy="true"`, `aria-live="polite"`) para carga de datos de pacientes, props configurables.

## 7) Estado clínico, datos y errores

Server state clínico con TanStack Query; client/UI state con Zustand solo para UI local (nunca PHI).

**Errores clínicos**: Result pattern para lógica clínica, Error Boundaries/hooks para UI async; telemetría automática de errores sin PHI.

```typescript
// Pattern para manejo de errores clínicos
type ClinicalResult<T> =
  | { ok: true; data: T; auditId: string }
  | { ok: false; error: ClinicalError; auditId: string };

const handlePatientAccess = async (patientId: string): Promise<ClinicalResult<Patient>> => {
  try {
    // Validar acceso clínico
    // Registrar en audit trail
    // Retornar datos sin PHI en logs
  } catch (error) {
    // Log error sin PHI
    return { ok: false, error: 'PATIENT_ACCESS_DENIED', auditId: generateAuditId() };
  }
};
```

## 8) Telemetría clínica y observabilidad HIPAA

OpenTelemetry para healthcare: traces/metrics/logs con correlation IDs; **NUNCA PHI en telemetría**.

**Reglas de privacidad clínica**: sin datos de pacientes en telemetría; solo IDs encriptados y métricas agregadas.

```typescript
// Telemetría clínica sin PHI
const logClinicalActivity = (activity: {
  activityType: 'PATIENT_ACCESS' | 'APPOINTMENT_CREATED' | 'NOTE_SAVED';
  providerId: string;
  organizationId: string;
  patientIdHash: string; // Hash, no ID real
  duration: number;
}) => {
  // Telemetría sin datos identificables
};
```

## 9) Rendimiento clínico (React 19 + healthcare UX)

INP < 200ms para formularios clínicos con concurrent features; LCP < 2.5s para dashboards de pacientes; CLS < 0.1; lazy loading donde aplique sin afectar workflows clínicos.

Memoización selectiva basada en profiler para componentes clínicos; `startTransition` para updates no urgentes de datos de pacientes.

Nuevos hooks (`useActionState`, `useOptimistic`) para mejorar UX clínico cuando aporte valor.

## 10) Pruebas clínicas

**Cobertura clínica**: Dominio 90% (reglas clínicas), Aplicación 80% (workflows de pacientes), Infra con mocks (sin PHI real), E2E en flujos clínicos críticos.

**Organización**: `tests/<module>/{domain|application|e2e}` con datos sintéticos de pacientes.

```typescript
// Ejemplo de test clínico
describe('Patient Management', () => {
  beforeEach(() => {
    // Setup con datos sintéticos, sin PHI real
    setupTestPatientData();
  });

  test('should validate provider access to patient', async () => {
    // Test de acceso clínico con roles
    // Verificar audit trail
    // Confirmar boundaries de organización
  });
});
```

## 11) Disciplina de búsqueda/creación clínica (para Claude)

Buscar antes de crear componentes clínicos; no duplicar validaciones de pacientes; pedir aprobación de ruta si falta algo clínico; reportar todo en `/tmp` sin PHI.

### Guía rápida de prompts clínicos (pegar al inicio):
> Reglas clínicas: sin PHI en logs; sin llamadas directas a APIs desde UI clínica; usa @/shared/ui/primitives para componentes healthcare; "use client", forwardRef, displayName, className?; props tipadas para datos clínicos; roles/ARIA para accesibilidad healthcare; callbacks por props; sin estado global con PHI; carpeta + index.ts y reexport en @/shared/ui/index; textos clínicos por props; no console.* con PHI, usar toast(); Zod como fuente de verdad para validación clínica; organization_id en todas las queries.

## 12) Checklist clínico de production-readiness (22 puntos healthcare)

Antes de marcar done, valida todas estas áreas clínicas:

- [ ] Tipografía/jerarquía clínica ✔︎
- [ ] Accesibilidad healthcare (roles/ARIA/targets ≥44px) ✔︎
- [ ] Colores clínicos OKLCH vía variables ✔︎
- [ ] TS estricto (0 any) para datos de pacientes ✔︎
- [ ] Performance React19 para workflows clínicos ✔︎
- [ ] Container queries para dispositivos médicos ✔︎
- [ ] Spacing MD3 con targets táctiles ✔︎
- [ ] Forms clínicos (RHF + Zod) ✔︎
- [ ] Error boundaries clínicos y hooks ✔︎
- [ ] Telemetría sin PHI ✔︎
- [ ] Toast system clínico (no console.*) ✔︎
- [ ] Animaciones accesibles para healthcare ✔︎
- [ ] DatePicker clínico (no `<input type="date">`) ✔︎
- [ ] Validación clínica con Zod ✔︎
- [ ] Skeleton accesible para datos de pacientes ✔︎
- [ ] Security clínica (wrappers/idempotency/RLS/HIPAA) ✔︎
- [ ] SoC clínico y single responsibility ✔︎
- [ ] Audit trail para datos de pacientes ✔︎
- [ ] Organization boundaries enforcement ✔︎
- [ ] Provider role validation ✔︎
- [ ] PHI protection compliance ✔︎
- [ ] Clinical workflow accuracy ✔︎

## 13) PR Checklist clínico (copiar en cada PR healthcare)

- [ ] Capas respetadas (UI→App→Domain) sin PHI en UI ✔︎
- [ ] Esquema Zod clínico único y reutilizado ✔︎
- [ ] Sin duplicados clínicos (búsqueda previa) ✔︎
- [ ] Reporte en /tmp sin PHI ✔︎
- [ ] Sin console.* con datos de pacientes ✔︎
- [ ] Trazas en paths clínicos críticos ✔︎
- [ ] Tests clínicos de dominio/aplicación ✔︎
- [ ] Tokens clínicos (OKLCH/spacing/typo) — sin hardcode ✔︎
- [ ] Wrappers de seguridad HIPAA ✔︎
- [ ] RLS multi-tenant healthcare ✔︎
- [ ] Organization_id en todas las queries ✔︎
- [ ] Provider role validation implementada ✔︎
- [ ] Audit trail generado para datos clínicos ✔︎
- [ ] PHI encryption y secure transmission ✔︎
- [ ] Clinical workflow accuracy validada ✔︎

## 14) Flujos clínicos específicos

### Workflow de pacientes
```typescript
// Patrón estándar para workflows de pacientes
const PatientWorkflow = {
  // 1. Validar acceso del proveedor
  validateProviderAccess: async (providerId: string, organizationId: string) => {
    // Verificar credenciales y rol clínico
    // Confirmar membership en organización
  },

  // 2. Procesar datos de paciente
  processPatientData: async (patientData: PatientInput) => {
    // Validar con Zod schema
    // Aplicar organization_id filter
    // Generar audit trail
  },

  // 3. Notificar y documentar
  notifyAndDocument: async (activity: ClinicalActivity) => {
    // Notificar a providers relevantes
    // Documentar en clinical notes si aplica
    // Generar reportes de compliance
  }
};
```

### Workflow de citas
```typescript
// Patrón para scheduling y appointments
const AppointmentWorkflow = {
  // Verificar disponibilidad de proveedor
  checkProviderAvailability: async (providerId: string, timeSlot: TimeSlot) => {
    // Validar horarios de proveedor
    // Verificar conflictos existentes
    // Confirmar recursos disponibles
  },

  // Crear cita con validaciones
  createAppointment: async (appointmentData: AppointmentInput) => {
    // Validar patient-provider relationship
    // Verificar insurance authorization si aplica
    // Generar confirmaciones y recordatorios
  }
};
```

### Workflow de documentación clínica
```typescript
// Patrón para clinical notes y documentation
const ClinicalDocumentationWorkflow = {
  // Crear nota clínica
  createClinicalNote: async (noteData: ClinicalNoteInput) => {
    // Validar provider authorship
    // Aplicar clinical templates si aplica
    // Requerir digital signature
  },

  // Co-signature workflow para supervisión
  requestCoSignature: async (noteId: string, supervisorId: string) => {
    // Validar relationship supervisor-provider
    // Generar notification para co-signature
    // Track pending co-signatures
  }
};
```

## 15) Monitoreo y compliance continuo

### Health checks clínicos
```typescript
// Monitoreo específico para healthcare
const HealthcareMonitoring = {
  // PHI protection validation
  validatePHIProtection: async () => {
    // Verificar que no hay PHI en logs
    // Confirmar encryption en transmisión
    // Validar access controls
  },

  // Organization boundary validation
  validateOrganizationBoundaries: async () => {
    // Confirmar RLS policies activas
    // Verificar cross-organization data leakage
    // Validar provider role boundaries
  },

  // Clinical workflow monitoring
  monitorClinicalWorkflows: async () => {
    // Track provider efficiency metrics
    // Monitor patient safety indicators
    // Validate clinical documentation compliance
  }
};
```

Esta guía serve como referencia constante para mantener consistency en el desarrollo clínico, compliance HIPAA, y architectural integrity en OrbiPax.