# Fix — Creación de usuarios con perfil vinculado (panel Super Admin)

Fecha: 2026-07-12
Backend probado: `https://claimvision.actividades.icu/api/v1` (instancia real, EC2)

## Causa raíz

Confirmada con el log compartido:

```
2026-07-12 00:15:53 | INFO | ClaimVision.http | POST /api/v1/admin/usuarios - Status: 201
```

`src/pages/administrador/GestionUsuariosPage.tsx` creaba **cualquier** rol (incluido `Operador_Taller`) contra el endpoint genérico `POST /admin/usuarios`. Ese endpoint solo inserta la fila en `usuarios` — nunca crea el perfil (`perfil_taller_usuarios`, `perfil_ajustadores`, `perfil_clientes`) que vincula al usuario con su taller/aseguradora/póliza. El login funciona (200), pero cualquier acción que dependa del perfil responde `403`.

Revisando el `openapi.json` real, el mismo problema aplica a **4 de los 5 roles** del formulario:

| Rol | Ruta admin usada antes | ¿Crea perfil? | Ruta correcta |
|---|---|---|---|
| `Administrador_Global` | `POST /admin/usuarios` | No necesita perfil | ✅ Correcta, sin cambios |
| `Operador_Aseguradora` | `POST /admin/usuarios` | ❌ No | `POST /admin/aseguradoras/{aseguradora_id}/operadores` (ya existía en `aseguradoras.routes.ts`, nunca se usaba) |
| `Ajustador` | `POST /admin/usuarios` | ❌ No | `POST /aseguradora/ajustadores` — **solo** callable con token de un operador de esa aseguradora, no existe ruta admin |
| `Operador_Taller` | `POST /admin/usuarios` | ❌ No | `POST /aseguradora/crud/talleres/{id}/operadores` — **solo** callable con token de un operador de esa aseguradora, no existe ruta admin |
| `Cliente` | `POST /admin/usuarios` | ❌ No | `POST /aseguradora/clientes` — **solo** callable con token de un operador de esa aseguradora, no existe ruta admin |

Para `Ajustador`, `Operador_Taller` y `Cliente` **no existe ninguna ruta bajo `/admin/*`** que cree usuario+perfil — el backend espera que esos tres se den de alta desde el panel de la propia aseguradora (que ya lo hace bien: `GestionAjustadoresPage`, `GestionTalleresPage` y `GestionClientesPage` usan las rutas correctas).

## Cambios

1. **`src/components/molecules/UsuarioForm/UsuarioForm.tsx`**
   - Se separan `ALL_ROLES` (para mostrar el rol de un usuario existente al editar) de `CREATABLE_ROLES = ['Administrador_Global', 'Operador_Aseguradora']` (únicos roles seleccionables al crear).
   - Nuevo prop `isEditing`; el `<select>` de rol usa `CREATABLE_ROLES` al crear y `ALL_ROLES` al editar.
   - Texto de ayuda bajo el select explicando dónde crear Ajustador / Operador de Taller / Cliente.

2. **`src/pages/administrador/GestionUsuariosPage.tsx`**
   - Se pasa `isEditing={editingId !== null}` a `UsuarioForm`.
   - Al crear con `rol === 'Operador_Aseguradora'`, ahora se llama `crearOperador` (`aseguradoras.routes.ts`) contra `POST /admin/aseguradoras/{id}/operadores` en vez de `createUsuario` (`POST /admin/usuarios`). El resto de roles (solo `Administrador_Global` puede llegar aquí ya) sigue usando la ruta genérica, que es correcta para ese caso.

No se tocó nada de `GestionAjustadoresPage`, `GestionTalleresPage` ni `GestionClientesPage` — esas páginas del lado aseguradora ya estaban usando las rutas correctas.

## Verificación estática

| Prueba | Resultado |
|---|---|
| `tsc -b --noEmit` | ✅ Sin errores nuevos |
| `oxlint` sobre archivos modificados | ✅ Sin warnings |

## Pruebas contra el backend real

> Nota: `credenciales_prueba.md` quedó desactualizado — el tenant "Seguros Demo" ya no existe (fue purgado). Se usó el tenant activo actual **"Aseguradora Testing GP"** (`a945d911-14c0-4562-8845-f469928d43d7`), listado vía `GET /admin/aseguradoras` con el Super Admin.

### Test A — Crear operador de aseguradora por la ruta correcta

- **Llamada:** `POST /admin/aseguradoras/a945d911-.../operadores` (token Super Admin) con `{nombre, email, password}`
- **Esperado:** 201, usuario creado y ya vinculado a la aseguradora
- **Resultado:** ✅ `201` — `{"usuario_id":"e5629f6d-...","rol":"Operador_Aseguradora","aseguradora_id":"a945d911-..."}`

### Test B — El operador creado puede usar rutas de aseguradora (la regresión exacta del bug reportado)

- **Llamada:** login con el usuario del Test A → `GET /aseguradora/crud/clientes` con su token
- **Esperado:** 200, no 403 (el bug original daba 403 por falta de perfil)
- **Resultado:** ✅ `200` — devuelve la lista de clientes del tenant correctamente

### Test C — El usuario aparece correctamente vinculado en el panel admin

- **Llamada:** `GET /admin/usuarios` (Super Admin) → buscar el usuario creado
- **Esperado:** `aseguradora_id` presente y correcto
- **Resultado:** ✅ `aseguradora_id: "a945d911-14c0-4562-8845-f469928d43d7"` (coincide con el tenant)

## Resumen

| # | Prueba | Estado |
|---|---|---|
| A | Crear operador vía ruta correcta | ✅ |
| B | Operador nuevo accede a rutas de aseguradora sin 403 | ✅ |
| C | Vinculación visible en `GET /admin/usuarios` | ✅ |

**3/3 pruebas pasaron.** El operador creado con el nuevo flujo queda vinculado desde el primer momento, replicando exactamente el escenario que fallaba en el log compartido, pero ahora sin 403.

## Nota

Quedó un usuario de prueba real en el tenant "Aseguradora Testing GP": `operador.fix.test@testinggp.com`. Avísame si quieres que lo elimine.

## Pendiente

`Ajustador`, `Operador_Taller` y `Cliente` siguen sin poder crearse desde el panel Super Admin (por diseño del backend — no hay ruta admin para ello). Si en algún momento se agrega esa capacidad al backend, habría que agregar el flujo correspondiente aquí. Por ahora el formulario los oculta al crear y dirige al usuario al panel de la aseguradora correcta.
