# Estado de Conexión — Módulo Administrador

## Leyenda

| Símbolo | Significado |
|:-------:|-------------|
| ✅ | Conectado (MOCK=false, endpoint listo) |
| ⚠️ | Parcial (algo funciona, algo falta) |
| ❌ | No conectado (usa datos mock, sin endpoint) |
| ➖ | No aplica / estático |

---

## 1. Panel Global (`PanelGlobalPage`)

| Elemento | Estado | Detalle |
|----------|:------:|---------|
| KPIs (4 tarjetas) | ❌ | No existe `GET /api/admin/dashboard/resumen`. Datos hardcodeados. |
| Gráfica siniestros/mes | ❌ | Valores `Math.random()` — sin endpoint. |
| StatProgressList (estatus) | ❌ | Datos mock. Requiere `siniestros_por_estatus` del dashboard. |
| Botón "Exportar" | ❌ | Sin implementación (placeholder). |
| Botón "+ Nueva aseguradora" | ➖ | Placeholder visual — debería navegar a `/administrador/aseguradoras`. |

**Requiere backend:** `GET /api/admin/dashboard/resumen`

---

## 2. Gestión de Usuarios (`GestionUsuariosPage`)

| Elemento | Estado | Detalle |
|----------|:------:|---------|
| Tabla de usuarios | ❌ | `MOCK_USUARIOS` hardcodeados. Falta `GET /api/admin/usuarios`. |
| Filtros (rol, estatus) | ❌ | Filtran en cliente sobre datos mock. Sin query params reales. |
| SearchInput | ❌ | Sin conectar (filtrado en cliente sobre mock). |
| Paginación | ❌ | Sin paginación real (todo en un array local). |
| Modal "Nuevo usuario" | ❌ | `handleSubmit()` no envía nada. Falta `POST /api/admin/usuarios`. |
| Botón "Dar de baja" | ✅ | Conectado a `POST /api/admin/usuarios/{id}/bloqueo-arco`. |

**Requiere backend:** `GET /api/admin/usuarios` (CRUD completo), `POST /api/admin/usuarios`, `PUT /api/admin/usuarios/{id}`, `DELETE /api/admin/usuarios/{id}`

---

## 3. Aseguradoras (`AseguradorasPage`)

| Elemento | Estado | Detalle |
|----------|:------:|---------|
| Listado de aseguradoras | ✅ | `GET /api/admin/aseguradoras` con paginación real. |
| Paginación | ✅ | Botones Anterior/Siguiente, page/totalPages desde API. |
| Estado loading/error | ✅ | UI de carga y error implementada. |
| Modal "Nueva aseguradora" | ✅ | `POST /api/admin/aseguradoras` funciona. |
| Counts en tarjetas (operadores, ajustadores, siniestros, talleres) | ⚠️ | Backend no devuelve estos agregados → el mapper pone `0`. |
| Botón "Administrar" en cada card | ❌ | `onAdminClick={() => {}}` — sin acción. |
| Botón "Exportar" | ❌ | Placeholder. |
| `cambiarSuscripcion` | ✅ | `PUT /api/admin/aseguradoras/{id}/suscripcion` — sin UI para invocarlo. |
| `verificar` (suspender/activar) | ✅ | `POST /api/admin/aseguradoras/{id}/verificar` — sin UI para invocarlo. |

**Nota:** Las 4 métricas de cada tarjeta (operadores, ajustadores, siniestros activos, talleres) se muestran como `0` porque el backend no las incluye en `AseguradoraResponseDTO`. Si se quieren mostrar valores reales, hay que agregar esos campos al endpoint.

---

## 4. Gestión de Talleres (Admin) (`GestionTalleresAdminPage`)

| Elemento | Estado | Detalle |
|----------|:------:|---------|
| Tabla de talleres | ❌ | `MOCK_TALLERES` hardcodeados. No existe `GET /api/admin/talleres`. |
| Filtros (estatus, aseguradora, ciudad) | ❌ | Sin conectar — selects con opciones mock. |
| SearchInput | ❌ | Sin conectar. |
| Modal "Registrar taller" | ❌ | `handleSubmit()` no envía nada. |
| Barra de capacidad ocupada | ❌ | Dato mock. |

**Requiere backend:** `GET /api/admin/talleres`, `GET /api/admin/talleres/{id}`, `POST /api/admin/talleres`

---

## 5. Auditoría del Sistema (`AuditoriaSistemaPage`)

| Elemento | Estado | Detalle |
|----------|:------:|---------|
| Tabla de eventos | ✅ | `GET /api/admin/auditoria/logs` con paginación real. |
| KPIs (4 tarjetas) | ⚠️ | Calculados en cliente sobre la página actual en vez de datos agregados reales. |
| Filtro por acción | ✅ | Filtrado en cliente (el backend no soporta `?accion=` aún). |
| Filtros (tabla, rol) | ❌ | Selects sin estado — no filtran nada. |
| SearchInput | ✅ | Filtrado en cliente por usuario/tabla/ID. |
| Botón "Rango de fechas" | ❌ | Placeholder. |
| Botón "Descargar CSV" | ❌ | Placeholder. |
| Datos de auditoría (usuario: nombre) | ⚠️ | El `AuditResponse` solo tiene `usuario_id`, no `nombre` ni `rol`. El mapper muestra el ID y asigna `Administrador_Global` por defecto. |

**Nota:** Para mostrar nombre y rol del usuario en la auditoría, el backend debe devolver esos datos (JOIN con tabla `usuarios`) o el frontend debe enriquecer con llamadas adicionales.

---

## 6. Configuración (`ConfiguracionPage`)

| Elemento | Estado | Detalle |
|----------|:------:|---------|
| Perfil (nombre, correo) | ➖ | Datos estáticos hardcodeados. Sin endpoint. |
| Notificaciones | ➖ | Sin backend — checkboxes sin efecto real. |
| Botón "Guardar Configuración" | ❌ | Sin handler. |

**Nota:** Página estática. Si se necesita persistencia, requiere backend nuevo.

---

## Resumen de cambios pendientes en backend

| Endpoint | Prioridad | Página |
|----------|:---------:|--------|
| `GET /api/admin/dashboard/resumen` | Alta | PanelGlobal |
| `GET /api/admin/usuarios` | Alta | GestionUsuarios |
| `POST /api/admin/usuarios` | Alta | GestionUsuarios |
| `PUT /api/admin/usuarios/{id}` | Alta | GestionUsuarios |
| `DELETE /api/admin/usuarios/{id}` | Alta | GestionUsuarios |
| `GET /api/admin/talleres` | Alta | GestionTalleresAdmin |
| `GET /api/admin/talleres/{id}` | Media | GestionTalleresAdmin |
| `POST /api/admin/talleres` | Media | GestionTalleresAdmin |
| Agregar `nombre_usuario`, `rol_usuario` a `AuditResponse` | Baja | AuditoriaSistema |
| Agregar counts agregados a `AseguradoraResponseDTO` | Baja | AseguradorasPage |

---

## Resumen de cambios pendientes en frontend

| Tarea | Archivo |
|-------|---------|
| Conectar PanelGlobalPage a dashboard API | `PanelGlobalPage.tsx` |
| Conectar GestionUsuariosPage a usuarios API (CRUD) | `GestionUsuariosPage.tsx` |
| Conectar GestionTalleresAdminPage a talleres API | `GestionTalleresAdminPage.tsx` |
| Hacer funcional botón "Administrar" en InsurerCard | `AseguradorasPage.tsx` |
| Agregar UI para cambiar suscripción y verificar | `AseguradorasPage.tsx` |
| Implementar descarga CSV de auditoría | `AuditoriaSistemaPage.tsx` |
| Implementar búsqueda y filtros por query params reales | Varias páginas |
| Conectar ConfiguracionPage a perfil API | `ConfiguracionPage.tsx` |
