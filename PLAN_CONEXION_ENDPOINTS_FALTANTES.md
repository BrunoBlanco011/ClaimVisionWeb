# Plan de Conexión de Endpoints Faltantes — ClaimVision Web

> Este plan reemplaza/actualiza a `PLAN_CONEXION_FRONTEND.md` (raíz del repo) y `PLAN_CONEXION_ADMIN.md`.
> Ambos documentos se escribieron contra una versión anterior o supuesta del backend. Se releyó el
> backend real (`ClaimVisionBack/ClaimVision_Backend/src/modules/**/presentation`) y el frontend real
> (`claimvision/src/services/**`), y hay discrepancias importantes que invalidan varias rutas de esos
> planes. Este documento es la fuente de verdad actualizada.

## 0. Hallazgo crítico #1 — Falta el prefijo `/v1` en TODAS las llamadas

`src/main.py` monta `api_router` bajo `/api`, y `api_router` monta `v1_router` bajo `/v1`. **No existe
ningún router legacy sin versionar activo** (se revisó `core/routers.py` completo). Es decir, toda ruta
real vive bajo `/api/v1/...`.

Sin embargo, **cada llamada `api.get/post/put/delete` del frontend actual omite `/v1`**:

```
src/services/auth.service.ts:            /auth/login, /auth/me
src/services/talleres.service.ts:        /aseguradora/talleres...
src/services/ajustadores.service.ts:     /aseguradora/ajustadores...
src/services/siniestros.service.ts:      /siniestros...
src/services/expedientes.service.ts:     /taller/expedientes...
src/services/presupuestos.service.ts:    /taller/presupuestos...
src/services/peritajes.service.ts:       /peritajes...
src/services/trabajos.service.ts:        /trabajos
src/services/admin/aseguradoras.service.ts: /admin/aseguradoras...
src/services/admin/auditoria.service.ts:    /admin/auditoria/logs
src/services/admin/usuarios.service.ts:     /admin/usuarios/{id}/bloqueo-arco
```

**Ninguna de estas llamadas puede estar funcionando hoy contra el backend real** — todas devuelven 404
salvo que el backend tenga temporalmente algo que no se encontró en el código. Esto es independiente de
los demás problemas de ruta descritos abajo (que además del `/v1` faltante, tienen segmentos incorrectos).

**Fix recomendado:** no parchar cada `fetch`, sino corregir la base:

```
# claimvision/.env
VITE_API_URL=http://localhost:8000/api/v1
```

Y en cada servicio, quitar el `/v1` implícito quedaría así: las rutas ya no empiezan con `/api/v1`, sino
que se escriben relativas a `/api/v1` (p. ej. `/aseguradora/crud/talleres` en vez de
`/aseguradora/talleres`). Ver tablas por módulo abajo.

---

## 1. Hallazgo crítico #2 — El CRUD de Aseguradora vive bajo `/aseguradora/crud`, no `/aseguradora`

`src/core/v1_router.py`:
```python
v1_router.include_router(aseguradora_v1_router,      prefix="/aseguradora",      ...)  # siniestros/cotizaciones
v1_router.include_router(aseguradora_crud_v1_router,  prefix="/aseguradora/crud", ...)  # ajustadores/talleres/clientes/usuarios
```

Esto significa que **`endpoints.md` está desactualizado** en su sección "Aseguradora — CRUD": esas 16 rutas
en realidad cuelgan de `/api/v1/aseguradora/crud/...`, no de `/api/v1/aseguradora/...`. El plan de admin
(`PLAN_CONEXION_ADMIN.md`, Fase 0) tampoco lo detectó — asumió `/aseguradora/v1/aseguradora/talleres`, que
tampoco es correcto.

### Tabla de rutas reales (verificado en código, no en endpoints.md)

| Recurso | Ruta real completa |
|---|---|
| Talleres (CRUD tenant) | `/api/v1/aseguradora/crud/talleres` |
| Ajustadores (CRUD tenant) | `/api/v1/aseguradora/crud/ajustadores` |
| Clientes (CRUD tenant) | `/api/v1/aseguradora/crud/clientes` |
| Operador de taller | `/api/v1/aseguradora/crud/talleres/{id}/operadores` |
| Bloqueo/desbloqueo ARCO (tenant) | `/api/v1/aseguradora/crud/usuarios/{id}/bloqueo-arco` y `/desbloqueo-arco` |
| Siniestros (bandeja, detalle, editar) | `/api/v1/aseguradora/siniestros...` |
| Acciones de flujo (asignar-ajustador, enviar-taller, autorizar-entrega) | `/api/v1/aseguradora/siniestros/{id}/...` |
| Cotizaciones (aprobar/rechazar) | `/api/v1/aseguradora/cotizaciones/{id}/...` |

---

## 2. Hallazgo crítico #3 — Formato del envelope de paginación

Los endpoints reales usan la clase `Page` de `src/shared/presentation/pagination.py`:

```json
{ "data": [...], "total": 20, "page": 1, "page_size": 20 }
```

**No** el `PaginatedResponse` (`items` + `total_pages`) definido en `src/modules/admin/presentation/schemas.py`
— esa clase existe en el código del backend pero **no la usa ninguna ruta activa** (las rutas de
`admin_v1_routes.py` importan y usan `Page`, no `PaginatedResponse`).

Esto significa que el frontend actual tiene un bug ya en producción (código escrito, aunque no puede
haberse probado nunca contra el backend real por el problema del `/v1`):

- `src/types/admin-aseguradoras.ts` define `PaginatedResponse<T>` con `items`/`total_pages` → **incorrecto**.
- `src/services/admin/aseguradoras.service.ts` y `admin/auditoria.service.ts` leen `res.items` y
  `res.total_pages`, que **no existirán** en la respuesta real (vendrá `res.data`, sin `total_pages`).

**Fix:** cambiar `PaginatedResponse<T>` a `{ data: T[]; total: number; page: number; page_size: number }`
y calcular `total_pages` en el cliente con `Math.ceil(total / page_size)`. Los demás servicios
(`talleres`, `ajustadores`, `siniestros`, `expedientes`) ya leen `res.data` correctamente — sólo están
mal las rutas y falta el `/v1`.

---

## 3. Correcciones por servicio existente

### 3.1 `talleres.service.ts`

| Método | Actual (roto) | Correcto |
|---|---|---|
| `getAll` | `GET /aseguradora/talleres?offset=0&limit=200` | `GET /aseguradora/crud/talleres?page=1&page_size=100` |
| `create` | `POST /aseguradora/talleres` | `POST /aseguradora/crud/talleres` |
| `update` | `PUT /aseguradora/talleres/{id}` | `PUT /aseguradora/crud/talleres/{id}` |
| `remove` | `DELETE /aseguradora/talleres/{id}` | `DELETE /aseguradora/crud/talleres/{id}` |

Nota: el backend pagina por `page`/`page_size` (no `offset`/`limit`) — `Query(1, ge=1)` /
`Query(20, ge=1, le=100)`. Ajustar query params.

También falta el campo `rfc` en el formulario (`TallerForm.tsx` no lo pide; `talleres.service.ts` hoy
envía `rfc: ''` fijo, lo que hará fallar la creación si el backend valida unicidad/formato). Agregar el
campo al formulario y quitar `contacto`/`capacidad` (no existen en `TallerCreateDTO`/`TallerResponseDTO`).

### 3.2 `ajustadores.service.ts`

| Método | Actual (roto) | Correcto |
|---|---|---|
| `getAll` | `GET /aseguradora/ajustadores?offset=0&limit=200` | `GET /aseguradora/crud/ajustadores?page=1&page_size=100` |
| `create` | `POST /aseguradora/ajustadores` | `POST /aseguradora/crud/ajustadores` |
| `update` | `PUT /aseguradora/ajustadores/{id}` | `PUT /aseguradora/crud/ajustadores/{id}` |
| `remove` | `DELETE /aseguradora/ajustadores/{id}` | `DELETE /aseguradora/crud/ajustadores/{id}` |

`AjustadorForm.tsx` no tiene campo `password_temporal` (el service hoy manda un valor hardcodeado
`'temporal123'`). Agregar el campo al formulario (mínimo 8 caracteres, ver `AjustadorCreateDTO`).

### 3.3 `siniestros.service.ts`

| Método | Actual (roto) | Correcto |
|---|---|---|
| `getAll` | `GET /siniestros?offset=0&limit=200` | `GET /aseguradora/siniestros?page=1&page_size=100` (soporta también `estatus`, `ajustador_id`, `taller_id`, `q`) |
| `getById` | mock (`MOCK_DETAIL = true`) | **Ya existe en backend:** `GET /aseguradora/siniestros/{id}` → `SiniestroDetalleAseguradoraDTO` (siniestro + `imagenes[]` + `peritaje` + `cotizacion`). El plan viejo decía "no existe endpoint" — ya no es cierto, hay que conectarlo y reescribir el mapper (la forma actual `{ incidente, timeline }` no corresponde a la respuesta real, que no trae `timeline`). |
| `assignAjustador` | `POST /siniestros/{id}/asignar-ajustador` | `POST /aseguradora/siniestros/{id}/asignar-ajustador` |
| `assignTaller` | `POST /siniestros/{id}/asignar-taller` | `POST /aseguradora/siniestros/{id}/enviar-taller` (el nombre de la acción es `enviar-taller`, no `asignar-taller`) |

Falta conectar por completo (no existen hoy en el frontend, aunque el backend ya los expone):

- `PUT /aseguradora/siniestros/{id}` — editar siniestro.
- `POST /aseguradora/siniestros/{id}/autorizar-entrega` — autorizar entrega del vehículo.
- `POST /aseguradora/cotizaciones/{id}/aprobar` — aprobar cotización del taller.
- `POST /aseguradora/cotizaciones/{id}/rechazar` (body: `{ motivo }`) — rechazar cotización.

Estas cuatro acciones son parte central del flujo de negocio de la aseguradora (aprobar/rechazar
presupuestos, autorizar entrega) y hoy no tienen ninguna UI ni llamada — vale la pena priorizarlas.

### 3.4 `expedientes.service.ts` (módulo Taller)

Este servicio apunta a rutas que **no existen en el backend**: `/taller/expedientes` no es un recurso;
el nombre real del módulo taller es "órdenes" (`taller_v1_routes.py`).

| Método | Actual (roto) | Correcto |
|---|---|---|
| `getAll` | `GET /taller/expedientes?offset=0&limit=200` | `GET /taller/ordenes?page=1&page_size=100&estatus=` → `Page[SiniestroResponseDTO]` |
| `getById` | `GET /taller/expedientes/{id}` | `GET /taller/siniestros/{id}` → `TallerExpedienteDTO` (siniestro + `peritaje` + `cotizacion`, sin envolver en `{siniestro: ...}` como asume el tipo actual `ExpedienteTecnicoResponseDTO`) |

El tipo `ExpedienteTecnicoResponseDTO` (`src/types/expedientes.ts`) asume `{ siniestro, peritaje_ajustador,
cotizacion }`; la respuesta real es `TallerExpedienteDTO` que **extiende** `SiniestroResponseDTO`
directamente (campos del siniestro al nivel raíz) y agrega `peritaje`/`cotizacion`. Hay que reescribir el
tipo y el mapper.

### 3.5 `presupuestos.service.ts` (cotización del taller)

Este servicio también apunta a una ruta inexistente (`/taller/presupuestos/guardar`) y no hay endpoint de
listado de presupuestos en el backend (ver §5).

| Método | Actual (roto) | Correcto |
|---|---|---|
| `create` | `POST /taller/presupuestos/guardar` | `POST /taller/siniestros/{id}/cotizacion` (requiere `id` del siniestro/expediente en la URL — la función debe aceptar `siniestroId` como parámetro, no sólo el payload) |

**Importante — dato nuevo respecto al plan viejo:** `CrearCotizacionRequest` (`taller_v1_schemas.py`)
exige `desglose_pdf_url: str` **obligatorio**. El plan anterior asumía que "el backend genera el PDF
automáticamente con ReportLab" — no es lo que hace el código actual del endpoint; el PDF debe subirse
antes (probablemente a Supabase Storage vía URL prefirmada, igual que el flujo de imágenes de cliente) y
su URL se manda en el body. Si no existe todavía un endpoint de subida de PDF para el taller, es un gap de
backend a resolver antes de conectar este flujo end-to-end (ver §5).

Faltan conectar además:
- `PATCH /taller/cotizaciones/{id}` — editar cotización mientras esté `Pendiente_Aprobacion`.
- `POST /taller/siniestros/{id}/concluir-trabajo` — marcar trabajo concluido.
- `POST /taller/siniestros/{id}/listo-entrega` — marcar listo para entrega.

### 3.6 `trabajos.service.ts`

No existe `/trabajos` en el backend. Tal como ya proponía `PLAN_CONEXION_FRONTEND.md` Fase 6c: eliminar
este servicio y unificar con `expedientes`/`ordenes`, filtrando por `estatus=Trabajo_Concluido` (para
histórico) usando `GET /taller/ordenes?estatus=Trabajo_Concluido`.

### 3.7 `peritajes.service.ts`

No existe un endpoint genérico `/peritajes` ni `/peritajes/pendientes/count`. El módulo de peritajes sólo
se expone bajo el rol `Ajustador` (`/ajustador/asignaciones`, `/ajustador/siniestros/{id}/peritaje`, etc.),
que es un rol fuera del alcance de esta web (ver §6). **Mantener en mock** — no hay endpoint equivalente
para el rol Aseguradora/Taller. Si el dashboard necesita un conteo de peritajes pendientes, la única
fuente real disponible hoy es derivarlo del listado de siniestros por `estatus` (`Asignado_A_Ajustador`)
vía `GET /aseguradora/siniestros?estatus=Asignado_A_Ajustador`.

### 3.8 `admin/aseguradoras.service.ts` y `admin/auditoria.service.ts`

- Rutas: agregar `/v1` (quedan igual en lo demás, `/admin/aseguradoras...` y `/admin/auditoria/logs` sí
  son correctas más allá del prefijo).
- Corregir el envelope de paginación como se describe en §2 (`res.data` en vez de `res.items`, calcular
  `total_pages` en cliente).

### 3.9 `admin/usuarios.service.ts`

- Ruta: agregar `/v1`. `/admin/usuarios/{id}/bloqueo-arco` es correcta en lo demás.
- **No expandir a un CRUD completo todavía** — ver §5, el backend no tiene `GET/POST/PUT/DELETE
  /admin/usuarios`.

### 3.10 `auth.service.ts`

- Agregar `/v1`: `/auth/login` → correcto salvo el prefijo; `/auth/me` idem.

---

## 4. Formularios a actualizar

| Archivo | Cambio |
|---|---|
| `components/molecules/TallerForm/TallerForm.tsx` | Quitar `contacto`, `capacidad`; agregar `rfc` |
| `components/molecules/AjustadorForm/AjustadorForm.tsx` | Agregar `password_temporal` (string, mín. 8) |
| `types/talleres.ts` (`Taller`) | Alinear con `TallerResponseDTO` (quitar `contacto`/`capacidad`, agregar `rfc`) |

---

## 5. Endpoints que el backend NO tiene todavía (gap real, no de ruteo)

Confirmado leyendo `admin_v1_routes.py` completo — no hay nada más en ese archivo aparte de lo listado:

| Endpoint esperado por el frontend/plan de admin | Estado |
|---|---|
| `GET /admin/dashboard/resumen` | No existe. `PanelGlobalPage` debe seguir en mock hasta que se agregue en backend. |
| `GET/POST/PUT/DELETE /admin/usuarios` | No existe (sólo `POST /admin/usuarios/{id}/bloqueo-arco`). `GestionUsuariosPage` no puede conectarse a un listado real todavía. |
| `GET /admin/talleres`, `GET /admin/talleres/{id}` | No existe. Los talleres sólo existen con alcance de tenant bajo `/aseguradora/crud/talleres` (rol `Operador_Aseguradora`, filtra por `aseguradora_id` del usuario) — un admin global no tiene forma de listar talleres cross-tenant hoy. `GestionTalleresAdminPage` sigue en mock. |
| Endpoint de subida de PDF de cotización para taller | No se encontró (necesario para poblar `desglose_pdf_url` antes de `POST /taller/siniestros/{id}/cotizacion`). |
| Listado de presupuestos (`GET /taller/presupuestos`) | No existe; cada orden ya trae su `cotizacion` embebida vía `GET /taller/siniestros/{id}`, así que no hace falta un endpoint aparte — la página de presupuestos debería listar vía `GET /taller/ordenes` y leer `cotizacion` de cada una. |

**Recomendación:** estos 4 primeros puntos son trabajo de backend, no de frontend. Si se quiere avanzar
sin tocar el backend, dejar esas 3 páginas de admin en mock (documentado, no oculto) y priorizar todo lo
de §3 que sí tiene contraparte real hoy.

---

## 6. Fuera de alcance para este frontend web

`endpoints.md` incluye los módulos **Cliente** (8 endpoints) y **Ajustador** (7 endpoints). Según
`CLAUDE.md`, el ruteo por rol de esta web sólo contempla `aseguradora` y `taller` (más `administrador`, ya
implementado parcialmente). No existen páginas para rol Cliente ni Ajustador en `src/pages/`, lo que
sugiere que esos roles se sirven desde una app separada (móvil). No se incluyen en este plan salvo que se
confirme lo contrario.

---

## 7. Orden de implementación sugerido

1. **`.env`**: `VITE_API_URL=http://localhost:8000/api/v1`.
2. **`types/admin-aseguradoras.ts`**: corregir `PaginatedResponse<T>` a `{ data, total, page, page_size }`.
3. **`admin/aseguradoras.service.ts`, `admin/auditoria.service.ts`, `admin/usuarios.service.ts`**: usar `res.data`, calcular `total_pages` en cliente.
4. **`talleres.service.ts`, `ajustadores.service.ts`**: rutas → `/aseguradora/crud/...`, paginación `page`/`page_size`.
5. **`TallerForm.tsx` + `types/talleres.ts`**: agregar `rfc`, quitar `contacto`/`capacidad`.
6. **`AjustadorForm.tsx`**: agregar `password_temporal`.
7. **`siniestros.service.ts`**: rutas → `/aseguradora/siniestros...`, fix `enviar-taller`, conectar `getById` real, agregar `editarSiniestro`, `autorizarEntrega`, `aprobarCotizacion`, `rechazarCotizacion`.
8. **`types/siniestro.ts`**: agregar `SiniestroDetalleAseguradoraDTO` (imagenes/peritaje/cotizacion), tipos de imágenes/peritaje/cotización.
9. **`expedientes.service.ts`**: reescribir a `/taller/ordenes` + `/taller/siniestros/{id}`, nuevo tipo `TallerExpedienteDTO`.
10. **`presupuestos.service.ts`**: reescribir a `/taller/siniestros/{id}/cotizacion` (create), agregar edición (`PATCH /taller/cotizaciones/{id}`), `concluir-trabajo`, `listo-entrega`. Bloqueado parcialmente por el gap de subida de PDF (§5) — coordinar con backend.
11. **`trabajos.service.ts`**: eliminar, unificar en `expedientes`/`ordenes` filtrando `estatus`.
12. Dejar **`peritajes.service.ts`** en mock (§3.7) y **`PanelGlobalPage`, `GestionUsuariosPage`, `GestionTalleresAdminPage`** en mock hasta que exista el backend correspondiente (§5).

---

## 8. Resumen de archivos a modificar

| # | Archivo | Acción |
|---|---|---|
| 1 | `claimvision/.env` | Cambiar `VITE_API_URL` a incluir `/v1` |
| 2 | `src/types/admin-aseguradoras.ts` | Corregir `PaginatedResponse<T>` |
| 3 | `src/services/admin/aseguradoras.service.ts` | Fix ruta + envelope |
| 4 | `src/services/admin/auditoria.service.ts` | Fix ruta + envelope |
| 5 | `src/services/admin/usuarios.service.ts` | Fix ruta |
| 6 | `src/services/talleres.service.ts` | Fix ruta `/aseguradora/crud/talleres`, paginación `page`/`page_size` |
| 7 | `src/services/ajustadores.service.ts` | Fix ruta `/aseguradora/crud/ajustadores`, paginación |
| 8 | `src/types/talleres.ts` | Alinear `Taller` con `TallerResponseDTO` (agregar `rfc`) |
| 9 | `src/components/molecules/TallerForm/TallerForm.tsx` | Agregar `rfc`, quitar `contacto`/`capacidad` |
| 10 | `src/components/molecules/AjustadorForm/AjustadorForm.tsx` | Agregar `password_temporal` |
| 11 | `src/services/siniestros.service.ts` | Fix rutas, conectar `getById`, agregar acciones nuevas |
| 12 | `src/types/siniestro.ts` | Agregar `SiniestroDetalleAseguradoraDTO` y tipos relacionados |
| 13 | `src/services/expedientes.service.ts` | Reescribir a `/taller/ordenes` + `/taller/siniestros/{id}` |
| 14 | `src/types/expedientes.ts` | Reescribir `TallerExpedienteDTO` |
| 15 | `src/services/presupuestos.service.ts` | Reescribir a `/taller/siniestros/{id}/cotizacion` + acciones nuevas |
| 16 | `src/services/trabajos.service.ts` | Eliminar, unificar en expedientes |
| 17 | `src/services/mappers.ts` | Actualizar mappers de siniestro/expediente/paginación |
| 18 | `src/services/peritajes.service.ts` | Sin cambios (queda mock, documentar por qué) |
| 19 | `src/pages/administrador/PanelGlobalPage.tsx` | Sin cambios (queda mock, backend pendiente) |
| 20 | `src/pages/administrador/GestionUsuariosPage.tsx` | Sin cambios (queda mock, backend pendiente) |
| 21 | `src/pages/administrador/GestionTalleresAdminPage.tsx` | Sin cambios (queda mock, backend pendiente) |
