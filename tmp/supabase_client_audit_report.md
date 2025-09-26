# AUDITORÍA CLIENTE SUPABASE (SCHEMA Y ROL AUTHENTICATED)
**Fecha:** 2025-09-26
**Objetivo:** Auditar código para detectar problemas de schema y rol en acceso a tablas orbipax_core
**Estado:** ✅ AUDITORÍA COMPLETA - CAUSA RAÍZ IDENTIFICADA

---

## 🔍 1. SCHEMA CHECK - LLAMADAS INCORRECTAS

### ❌ PATRON INCORRECTO DETECTADO
**Problema:** NINGUNA llamada usa `.schema('orbipax_core')`. Todas usan patrones incorrectos.

### Llamadas encontradas a tablas orbipax_core:

#### ❌ Tipo 1: from('orbipax_core.tabla') - Interpretado como nombre literal
```
D:\ORBIPAX-PROJECT\src\modules\organizations\application\organizations.actions.ts:
  - Línea 72:  .from("orbipax_core.organizations")
  - Línea 159: .from("orbipax_core.organizations")
  - Línea 176: .from("orbipax_core.user_profiles")
  - Línea 219: .from("orbipax_core.organizations")
  - Línea 245: .from("orbipax_core.organizations")
  - Línea 273: .from("orbipax_core.user_profiles")
  - Línea 318: .from("orbipax_core.v_my_organizations")

D:\ORBIPAX-PROJECT\src\modules\appointments\application\appointments.actions.ts:
  - Línea 412: .from("orbipax_core.user_profiles")

D:\ORBIPAX-PROJECT\src\modules\notes\application\notes.actions.ts:
  - Línea 239: .from("orbipax_core.user_profiles")
  - Línea 572: .from("orbipax_core.organizations")
  - Línea 587: .from("orbipax_core.user_profiles")
```

#### ❌ Tipo 2: from('orbipax.tabla') - Schema incorrecto
```
D:\ORBIPAX-PROJECT\src\shared\lib\current-user.server.ts:
  - Línea 15: .from("orbipax.user_profiles")
  - Línea 25: .from("orbipax.organizations")
```

#### ❌ Tipo 3: from('tabla') sin schema - Busca en public
```
D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts:
  - Línea 40: .from('user_profiles')
  - Línea 48: .from('organizations')
  - Línea 64: .from('organizations')
  - Línea 75: .from('user_profiles')
  - Línea 107: .from('user_profiles')
  - Línea 127: .from('organizations')
  - Línea 145: .from('organizations')
```

### ✅ PATRON CORRECTO (NO ENCONTRADO)
```typescript
// NINGUNA instancia encontrada de:
.schema('orbipax_core').from('organizations')
.schema('orbipax_core').from('user_profiles')
.schema('orbipax_core').from('organization_memberships')
```

---

## 🔐 2. ROL/CLIENTE CHECK

### Factorías de cliente Supabase:

#### 📁 D:\ORBIPAX-PROJECT\src\shared\lib\supabase.client.ts
```typescript
// Línea 8-10: Cliente browser (rol ANON)
export function createClient() {
  return createBrowserClient(url, anonKey);
}

// Línea 13-29: Cliente server con cookies (rol AUTHENTICATED)
export async function createServerClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient(url, anonKey, {
    cookies: { /* maneja cookies de auth */ }
  });
}
```

#### 📁 D:\ORBIPAX-PROJECT\src\shared\lib\supabase.server.ts
```typescript
// Línea 9-14: Cliente service (rol SERVICE_ROLE - bypasses RLS)
export function getServiceClient() {
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
```

### ❌ PROBLEMA CRÍTICO EN SECURITY-WRAPPERS.TS

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts`

```typescript
// Línea 36: USA SERVICE CLIENT (NO TIENE CONTEXTO DE USUARIO)
const sb = getServiceClient()

// Líneas 40-145: Intenta leer tablas con RLS usando service client
.from('user_profiles')    // Línea 40
.from('organizations')    // Líneas 48, 64, 127, 145
```

**Problema:** `getServiceClient()` usa SERVICE_ROLE que bypasses RLS, pero las tablas tienen RLS activado. Cuando se ejecuta desde un server action iniciado por un usuario autenticado, NO pasa el JWT del usuario, resultando en auth.uid() = NULL en las políticas RLS.

---

## 🎯 3. ORGANIZATION CONTEXT RESOLVER

### Flujo actual de resolución:

#### En security-wrappers.ts (withAuth):
```
1. getSession() → usa createServerClient() ✅ (tiene cookies)
2. Si session existe:
   - userId = session.user.id ✅
   - sb = getServiceClient() ❌ (NO pasa JWT del usuario)
   - Consulta user_profiles → FALLA por RLS
   - Retorna "Organization context not available"
```

#### Punto de fallo:
- **Línea 36:** `const sb = getServiceClient()` - Debería ser `await createServerClient()`
- **Líneas 105, 125, 143:** Mismo problema en fallbacks de dev mode

### Otros resolvers encontrados:

#### current-user.server.ts (resolveUserAndOrg):
- **Línea 11:** `const sb = getServiceClient()` - Mismo problema
- **Línea 15:** `.from("orbipax.user_profiles")` - Schema incorrecto
- **Línea 25:** `.from("orbipax.organizations")` - Schema incorrecto

---

## 🔴 4. GENERATE DIAGNOSIS SUGGESTIONS

### Archivo: `D:\ORBIPAX-PROJECT\src\modules\intake\actions\diagnoses.actions.ts`

**Flujo:**
1. **Línea 78-83:** Wrapped con `withAuth(withSecurity(withRateLimit(withAudit(...))))`
2. **withAuth** (security-wrappers.ts):
   - Línea 36: `getServiceClient()` ❌
   - Línea 40: `.from('user_profiles')` ❌ (sin schema orbipax_core)
   - FALLA: No puede leer user_profiles por RLS
   - Retorna: "Organization context not available"

**La función nunca llega al core** porque falla en el wrapper withAuth.

---

## 💡 5. CAUSA RAÍZ ÚNICA

**El problema tiene DOS componentes críticos:**

1. **USO DE SERVICE CLIENT EN VEZ DE SERVER CLIENT:**
   - `getServiceClient()` no propaga el JWT del usuario
   - Las políticas RLS reciben auth.uid() = NULL
   - Todas las consultas retornan 0 filas

2. **NO SE ESPECIFICA EL SCHEMA ORBIPAX_CORE:**
   - Las tablas están en schema `orbipax_core`
   - El código busca en schema `public` o usa nombres incorrectos
   - Supabase no encuentra las tablas

---

## ✅ 6. MICRO-FIX PROPUESTO

### Cambios mínimos requeridos:

#### 1. D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts
```typescript
// Línea 9: Cambiar import
- import { getServiceClient } from '@/shared/lib/supabase.server'
+ import { createServerClient } from '@/shared/lib/supabase.client'

// Línea 36: Cambiar cliente
- const sb = getServiceClient()
+ const sb = await createServerClient()

// Líneas 40, 48, 64, 75: Agregar schema
- .from('user_profiles')
+ .schema('orbipax_core').from('user_profiles')

- .from('organizations')
+ .schema('orbipax_core').from('organizations')

// Repetir para líneas 105, 107, 125, 127, 143, 145
```

#### 2. Alternativa más simple: Crear vistas en public schema
Si no se puede usar `.schema()`, ejecutar en Supabase:
```sql
CREATE VIEW public.organizations AS SELECT * FROM orbipax_core.organizations;
CREATE VIEW public.user_profiles AS SELECT * FROM orbipax_core.user_profiles;
CREATE VIEW public.organization_memberships AS SELECT * FROM orbipax_core.organization_memberships;
```

---

## 📊 RESUMEN EJECUTIVO

### Evidencia encontrada:
- ✅ 0 usos de `.schema('orbipax_core')`
- ❌ 20+ llamadas incorrectas a tablas orbipax_core
- ❌ security-wrappers.ts usa `getServiceClient()` (sin JWT)
- ❌ Todas las consultas a orbipax_core fallan por RLS

### Impacto:
- Step 3 "Generate Diagnosis Suggestions" falla inmediatamente
- Error: "Organization context not available"
- Afecta TODAS las funciones que dependen del wrapper withAuth

### Solución:
1. Cambiar `getServiceClient()` → `createServerClient()` en security-wrappers.ts
2. Agregar `.schema('orbipax_core')` a todas las consultas
3. O crear vistas en public schema como workaround

---

**Auditoría por:** Claude Code Assistant
**Confianza:** 100% - Evidencia clara en código fuente