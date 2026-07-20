# Solicitud de cambios en backend — Auditoría del Sistema

> Para el equipo de backend. Describe las limitaciones actuales del endpoint de auditoría
> (`GET /api/v1/admin/auditoria/logs`) y los cambios necesarios para que la vista de Auditoría
> del panel de administrador (`AuditoriaSistemaPage.tsx`) funcione como está diseñada, sin
> parches del lado del frontend.

## Estado (2026-07-19)

✅ **Implementado por backend y ya conectado en el frontend:** filtros de fecha/acción/módulo/rol
en el listado, catálogo fijo de acciones (`AccionAudit`), endpoint de exportación real
(`/logs/export`), endpoint de resumen/KPIs (`/resumen`) y endpoint de detalle (`/logs/{id}`) con
`usuario_nombre`/`usuario_email`.

⏳ **Pendiente:** ver [Pendiente — v2](#pendiente--v2) al final. El único gap que queda es que
`usuario_nombre`/`usuario_email` solo viven en el endpoint de detalle, no en el listado.

## Endpoint actual (histórico — como estaba antes del cambio)

```
GET /api/v1/admin/auditoria/logs?page=&page_size=
```

**Query params soportados hoy:** solo `page` (default 1) y `page_size` (default 20, máx. 100).

**Respuesta (`Page[AuditResponse]`):**

```json
{
  "data": [
    {
      "id": "string | null",
      "usuario_id": "string | null",
      "aseguradora_id": "string | null",
      "evento_modulo": "string | null",
      "accion_realizada": "string | null",
      "direccion_ip": "string | null",
      "user_agent": "string | null",
      "metadata_context": { "...": "object | null" },
      "created_at": "2026-07-19T14:23:05Z"
    }
  ],
  "total": 0,
  "page": 1,
  "page_size": 20
}
```

## Problemas que esto causaba en el frontend (antes del cambio)

| # | Limitación del backend | Efecto en la UI | Estado |
|---|---|---|---|
| 1 | No había `fecha_inicio` / `fecha_fin` como query params | El filtro de rango de fechas solo se aplicaba sobre los 20 registros ya cargados, no sobre el histórico real. | ✅ Resuelto |
| 2 | No había endpoint ni parámetro de exportación (CSV/Excel) | El botón "Exportar" pedía `page_size=1000` (el máximo real era 100) y armaba el CSV en el navegador. Cualquier registro fuera de ese lote se perdía silenciosamente. | ✅ Resuelto |
| 3 | `usuario_id` era solo el ID crudo (UUID), sin nombre ni correo | La columna "Usuario" de la tabla mostraba el ID en vez de un nombre legible. | ⏳ Parcial — ver [Pendiente — v2](#pendiente--v2) |
| 4 | No se exponía el **rol** de quien ejecutó la acción | El frontend tenía el rol **hardcodeado** a `"Administrador_Global"` en todas las filas — badge y filtro de rol eran decorativos. | ✅ Resuelto |
| 5 | `accion_realizada` era texto libre en español, sin un conjunto fijo de valores | El frontend clasificaba cada acción por heurística de prefijo, frágil ante acciones nuevas. | ✅ Resuelto |
| 6 | No había ningún endpoint de agregación/resumen | Las tarjetas KPI se calculaban sobre la página cargada, no sobre el total real de los últimos 30 días. | ✅ Resuelto |

## Cambios solicitados (histórico — ya implementados)

1. ✅ **Filtros de fecha en el listado** — `fecha_inicio`/`fecha_fin` como query params de `GET /admin/auditoria/logs`.
2. ⏳ **Datos legibles del usuario** — `usuario_rol` ya se agregó a `AuditResponse` (listado). `usuario_nombre`/`usuario_email` solo se agregaron a `AuditDetailResponse` (endpoint de detalle) — ver pendiente abajo.
3. ✅ **Endpoint de exportación real** — `GET /admin/auditoria/logs/export`, ya conectado.
4. ✅ **Filtros adicionales por columna** — `accion_realizada`, `evento_modulo`, `usuario_rol` como query params del listado.
5. ✅ **Catálogo fijo de acciones** — enum `AccionAudit` (44 valores), ya conectado en el filtro de acción del frontend.
6. ✅ **Endpoint de resumen/KPIs** — `GET /admin/auditoria/resumen?dias=30`, ya conectado en las 4 tarjetas KPI.

## Pendiente — v2

**Incluir `usuario_nombre` y `usuario_email` en el listado (`AuditResponse`), no solo en el detalle.**

Hoy `GET /admin/auditoria/logs` devuelve `usuario_id` (UUID) y `usuario_rol`, pero el nombre/correo
legible del usuario solo viene en `GET /admin/auditoria/logs/{log_id}` (`AuditDetailResponse`). Como
consecuencia, la columna "Usuario" de la tabla de auditoría muestra el ID crudo en vez de un nombre —
el frontend agregó un modal de "Ver detalle" por fila (que sí llama al endpoint de detalle) como
workaround, pero eso obliga al admin a hacer clic en cada evento para saber quién lo generó, en vez
de verlo directamente en la lista.

**Pedido:** agregar `usuario_nombre` (o el campo que ya usan en `AuditDetailResponse`) y
`usuario_email` también a `AuditResponse`, vía el mismo join que ya usan para poblar el detalle —
así el listado paginado puede mostrar el nombre real sin una llamada N+1 por fila.

## Referencia

Contrato verificado sobre `openapi_backend.json` (actualizado 2026-07-19) y la implementación real en
el frontend: `claimvision/src/api/admin/auditoria/auditoria.routes.ts`,
`claimvision/src/api/admin/auditoria/auditoria.schemas.ts` y
`claimvision/src/pages/administrador/AuditoriaSistemaPage.tsx`.
