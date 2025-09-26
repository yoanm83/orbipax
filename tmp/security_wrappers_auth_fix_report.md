# FIX CLIENTE AUTH + SCHEMA EN SECURITY-WRAPPERS
**Fecha:** 2025-09-26
**Objetivo:** Sustituir getServiceClient() por createServerClient() y forzar .schema('orbipax_core')
**Estado:** ✅ CAMBIOS APLICADOS

---

## 🎯 OBJETIVO

- Alinear el wrapper de seguridad al rol authenticated (JWT del usuario) usando createServerClient() con cookies
- Garantizar que las lecturas a organizations/user_profiles usen .schema('orbipax_core')
- Desbloquear el flujo para que withAuth resuelva organización correctamente

---

## 📝 ARCHIVO MODIFICADO

**Archivo:** `D:\ORBIPAX-PROJECT\src\modules\intake\infrastructure\wrappers\security-wrappers.ts`

### Cambios aplicados:

#### 1. Import actualizado (Línea 9)
```diff
- import { getServiceClient } from '@/shared/lib/supabase.server'
+ import { createServerClient } from '@/shared/lib/supabase.client'
```

#### 2. Cliente actualizado (4 instancias)
```diff
# Línea 36:
- const sb = getServiceClient()
+ const sb = await createServerClient()

# Línea 105:
- const sb = getServiceClient()
+ const sb = await createServerClient()

# Línea 125:
- const sb = getServiceClient()
+ const sb = await createServerClient()

# Línea 143:
- const sb = getServiceClient()
+ const sb = await createServerClient()
```

#### 3. Schema agregado a todas las consultas (7 instancias)
```diff
# Línea 40:
- .from('user_profiles')
+ .schema('orbipax_core').from('user_profiles')

# Línea 48:
- .from('organizations')
+ .schema('orbipax_core').from('organizations')

# Línea 64:
- .from('organizations')
+ .schema('orbipax_core').from('organizations')

# Línea 75:
- .from('user_profiles')
+ .schema('orbipax_core').from('user_profiles')

# Línea 107:
- .from('user_profiles')
+ .schema('orbipax_core').from('user_profiles')

# Línea 127:
- .from('organizations')
+ .schema('orbipax_core').from('organizations')

# Línea 145:
- .from('organizations')
+ .schema('orbipax_core').from('organizations')
```

---

## ✅ RESULTADOS VERIFICABLES

### 1. Cliente correcto con cookies
```typescript
// ANTES: Sin contexto de usuario
const sb = getServiceClient() // SERVICE_ROLE, no cookies

// DESPUÉS: Con contexto de usuario
const sb = await createServerClient() // AUTHENTICATED, con cookies
```

### 2. Schema explícito en todas las consultas
```typescript
// ANTES: Busca en public schema (no existe)
.from('user_profiles')

// DESPUÉS: Busca en orbipax_core schema (correcto)
.schema('orbipax_core').from('user_profiles')
```

### 3. Patrones incorrectos eliminados
- ✅ No hay más `getServiceClient()`
- ✅ No hay más `from('orbipax_core.tabla')`
- ✅ No hay más `from('tabla')` sin schema

### 4. Verificación con grep
```bash
# Sin getServiceClient
grep -n "getServiceClient" security-wrappers.ts
# Resultado: 0 coincidencias ✅

# Con schema correcto
grep -n "\.schema('orbipax_core')" security-wrappers.ts
# Resultado: 7 líneas (40, 48, 64, 75, 107, 127, 145) ✅

# Sin patrones incorrectos
grep -n "from('orbipax_core\." security-wrappers.ts
# Resultado: 0 coincidencias ✅
```

---

## 🔍 VALIDACIONES

### Build/TypeCheck
- El archivo compila sin errores de sintaxis
- Los tipos de Supabase client son compatibles

### Lógica preservada
- Mantiene retornos planos `{ ok, error }`
- Errores genéricos sin exponer detalles
- Flujo de autenticación intacto

### Dependencias
- `createServerClient` existe en `@/shared/lib/supabase.client`
- Schema `orbipax_core` debe estar expuesto en Supabase

---

## 🚧 ESTADO ACTUAL

### Lo que funciona:
- ✅ Cliente ahora usa cookies del request
- ✅ Consultas apuntan al schema correcto
- ✅ Código sintácticamente correcto

### Lo que falta (fuera del alcance):
- Las tablas en `orbipax_core` deben tener datos
- RLS policies deben permitir lectura con auth.uid()
- El schema `orbipax_core` debe estar expuesto en Supabase API

---

## 📋 PRÓXIMOS PASOS SUGERIDOS

1. **Verificar exposición del schema en Supabase:**
   - Dashboard → Settings → API → Exposed schemas
   - Agregar `orbipax_core` si no está

2. **Auditar otros archivos con problemas similares:**
   ```
   - D:\ORBIPAX-PROJECT\src\shared\lib\current-user.server.ts
   - D:\ORBIPAX-PROJECT\src\modules\organizations\application\*.ts
   - D:\ORBIPAX-PROJECT\src\modules\appointments\application\*.ts
   - D:\ORBIPAX-PROJECT\src\modules\notes\application\*.ts
   ```

3. **Test con usuario autenticado:**
   - Login via UI
   - Click "Generate Diagnosis Suggestions"
   - Verificar que no aparece "Organization context not available"

4. **Alternativa si schema no se puede exponer:**
   - Crear vistas en public schema:
   ```sql
   CREATE VIEW public.organizations AS
   SELECT * FROM orbipax_core.organizations;

   CREATE VIEW public.user_profiles AS
   SELECT * FROM orbipax_core.user_profiles;
   ```

---

## 💡 NOTAS TÉCNICAS

### Por qué createServerClient vs getServiceClient:
- `getServiceClient()`: Usa SERVICE_ROLE key, bypasses RLS, no tiene JWT del usuario
- `createServerClient()`: Usa ANON key + cookies, respeta RLS, propaga JWT del usuario

### Por qué .schema('orbipax_core'):
- Las tablas están físicamente en schema `orbipax_core`
- Sin `.schema()`, Supabase busca en `public` por defecto
- La notación `from('orbipax_core.tabla')` es interpretada como nombre literal

---

## ✨ RESUMEN

**Cambios aplicados:** 11 modificaciones en 1 archivo
- 1 import actualizado
- 4 clientes cambiados a createServerClient()
- 7 queries con schema explícito

**Impacto esperado:**
- withAuth ahora tiene contexto de usuario (auth.uid())
- Las queries buscan en el schema correcto
- Step 3 puede resolver organization_id si:
  - El schema está expuesto
  - Las tablas tienen datos
  - RLS permite la lectura

**Confianza:** 100% en los cambios aplicados, pero el éxito funcional depende de la configuración de Supabase.

---

**Fix por:** Claude Code Assistant
**Review:** Cambios mínimos, no breaking, aligned con arquitectura