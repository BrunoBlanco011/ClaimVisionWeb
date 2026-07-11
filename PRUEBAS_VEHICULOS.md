# Pruebas — Módulo de Vehículos (Aseguradora)

Fecha: 2026-07-11
Backend probado: `https://claimvision.actividades.icu/api/v1` (instancia real, EC2)
Tenant de prueba: "Seguros Demo" (`f6c46a9f-5b22-4aab-96f3-170866c84896`)
Usuario: `operador@segurosdemo.com` (rol `Operador_Aseguradora`)
Cliente de prueba: Ana Torres (`cdd0add8-b6bc-4da0-a078-4133e898ad2f`)

## Contexto

El backend ya expone el CRUD de vehículos (confirmado leyendo `GET /openapi.json` de la instancia real). Se actualizó el frontend para dejar de usar el stub en memoria y consumir los endpoints reales:

| Método | Ruta | Uso en frontend |
|---|---|---|
| `GET` | `/api/v1/aseguradora/crud/vehiculos?cliente_id=...` | `getByCliente()` — carga la pila de vehículos del cliente seleccionado |
| `POST` | `/api/v1/aseguradora/crud/vehiculos` | `create()` — modal "Agregar vehículo" |
| `GET` | `/api/v1/aseguradora/crud/vehiculos/{id}` | no usado aún por la UI (disponible) |
| `PUT` | `/api/v1/aseguradora/crud/vehiculos/{id}` | no usado aún por la UI (disponible) |
| `DELETE` | `/api/v1/aseguradora/crud/vehiculos/{id}` | no usado aún por la UI (disponible) |
| `GET` | `/api/v1/cliente/vehiculos` | fuera de alcance (rol cliente, app móvil) |

Archivos frontend actualizados para el contrato real:
- `src/api/aseguradora/vehiculos/vehiculos.schemas.ts`
- `src/api/aseguradora/vehiculos/vehiculos.routes.ts`
- `src/components/molecules/VehiculoForm/VehiculoForm.tsx` (se agregó campo opcional `color`, `vin` pasó a opcional)
- `src/components/molecules/VehiculoCard/VehiculoCard.tsx`
- `src/pages/aseguradora/GestionVehiculosPage.tsx`

## Verificación estática

| Prueba | Resultado |
|---|---|
| `tsc -b --noEmit` sobre el proyecto | ✅ Sin errores nuevos (el único error preexistente es en `ElaboracionPresupuestoPage.tsx`, no relacionado con este cambio) |
| `oxlint` sobre archivos nuevos/modificados | ✅ Sin warnings |

## Pruebas contra el backend real

Todas las llamadas usan el token JWT devuelto por `POST /auth/login` con el operador de la aseguradora demo, replicando exactamente lo que hace `src/api/client.ts` (header `Authorization: Bearer <token>`).

### Test 0 — Login

- **Llamada:** `POST /auth/login` con `operador@segurosdemo.com`
- **Esperado:** 200 + token con `rol: Operador_Aseguradora`
- **Resultado:** ✅ `200` — token emitido correctamente, `aseguradora_id` coincide con el tenant demo

### Test 1 — Listar vehículos de un cliente sin vehículos (baseline)

- **Llamada:** `GET /aseguradora/crud/vehiculos?cliente_id=cdd0add8-...`
- **Esperado:** lista vacía
- **Resultado:** ✅ `200` — `{"data":[],"total":0,...}`

### Test 2 — Crear vehículo con todos los campos

- **Llamada:** `POST /aseguradora/crud/vehiculos` con `marca, modelo, anio, placas, vin, color`
- **Esperado:** 201 + DTO completo con `id`, `version`, `created_at`
- **Resultado:** ✅ `201` — vehículo creado (Nissan Sentra 2022, placas ABC-1234)

### Test 3 — Listar vehículos tras crear uno

- **Llamada:** `GET /aseguradora/crud/vehiculos?cliente_id=cdd0add8-...`
- **Esperado:** el vehículo del Test 2 aparece en `data`
- **Resultado:** ✅ `200` — aparece con todos los campos correctos

### Test 4 — Obtener vehículo por id

- **Llamada:** `GET /aseguradora/crud/vehiculos/{id}`
- **Esperado:** mismo objeto que el Test 2/3
- **Resultado:** ✅ `200` — coincide

### Test 5 — Crear vehículo sin campos opcionales (`vin`, `color`)

- **Llamada:** `POST /aseguradora/crud/vehiculos` solo con `cliente_id, marca, modelo, anio, placas`
- **Esperado:** 201, `vin: null`, `color: null`
- **Resultado:** ✅ `201` — el mapeo del frontend (`dto.vin ?? ''`) convierte esto correctamente a cadena vacía en la UI

### Test 6 — Actualizar vehículo (`PUT`)

- **Llamada:** `PUT /aseguradora/crud/vehiculos/{id}` con `{"color":"Rojo"}`
- **Esperado:** 200, `color` actualizado
- **Resultado:** ✅ `200` — `color` pasó a `"Rojo"` (nota: `version` no incrementó en la respuesta, posible detalle menor del backend; no afecta a la UI actual porque no se muestra ni usa `version`)

### Test 7 — Eliminar vehículo (`DELETE`)

- **Llamada:** `DELETE /aseguradora/crud/vehiculos/{id}`
- **Esperado:** 204 sin cuerpo
- **Resultado:** ✅ `204`

### Test 8 — Listar tras eliminar

- **Llamada:** `GET /aseguradora/crud/vehiculos?cliente_id=cdd0add8-...`
- **Esperado:** solo queda el vehículo del Test 2 (el del Test 5/6/7 ya no aparece)
- **Resultado:** ✅ `200` — lista correcta, borrado lógico funcionando

### Test 9 — Validación: falta campo requerido (`marca`)

- **Llamada:** `POST /aseguradora/crud/vehiculos` sin `marca`
- **Esperado:** 422 con detalle del campo faltante
- **Resultado:** ✅ `422` — `{"details":[{"loc":["body","marca"],"msg":"Field required"}]}`

### Test 10 — Filtrar por `cliente_id` inexistente

- **Llamada:** `GET /aseguradora/crud/vehiculos?cliente_id=00000000-0000-0000-0000-000000000000`
- **Esperado:** lista vacía, no error
- **Resultado:** ✅ `200` — `{"data":[],"total":0}`

### Test 11 — Sin autenticación

- **Llamada:** `GET /aseguradora/crud/vehiculos` sin header `Authorization`
- **Esperado:** 401
- **Resultado:** ✅ `401` — `{"error":"Not authenticated"}`

## Resumen

| # | Prueba | Estado |
|---|---|---|
| 0 | Login aseguradora | ✅ |
| 1 | Listar vehículos (vacío) | ✅ |
| 2 | Crear vehículo completo | ✅ |
| 3 | Listar tras crear | ✅ |
| 4 | Obtener por id | ✅ |
| 5 | Crear sin campos opcionales | ✅ |
| 6 | Actualizar (`PUT`) | ✅ |
| 7 | Eliminar (`DELETE`) | ✅ |
| 8 | Listar tras eliminar | ✅ |
| 9 | Validación campo requerido | ✅ |
| 10 | `cliente_id` inexistente | ✅ |
| 11 | Sin autenticación | ✅ |

**12/12 pruebas pasaron.** El contrato implementado en `vehiculos.routes.ts`/`vehiculos.schemas.ts` coincide con el OpenAPI real del backend.

## Nota

Quedó **un vehículo de prueba** en el tenant demo (Nissan Sentra, placas `ABC-1234`, cliente Ana Torres) del Test 2 — no se eliminó a propósito para que puedas verificarlo visualmente en `/aseguradora/vehiculos` en el navegador. El segundo (Toyota Corolla) sí se eliminó como parte del Test 7. Avísame si quieres que lo borre.

## Pendiente (no cubierto aquí)

No se hizo una prueba visual en navegador real (sin herramienta de automatización de navegador disponible en este entorno). El servidor de desarrollo está corriendo en `http://localhost:5173`; con las credenciales de `operador@segurosdemo.com` puedes entrar a **Vehículos** en el menú lateral y confirmar que la pila, el modal y el botón "Agregar vehículo" se comportan como se espera.
