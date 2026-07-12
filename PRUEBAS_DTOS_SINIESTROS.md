# Verificación de DTOs — Módulo de Siniestros vs `openapi.json`

Fecha: 2026-07-12
Fuente: `openapi.json` (raíz de `ClaimVisionWeb/`, descargado de la instancia real)
Alcance: todos los DTOs de siniestros usados por el frontend web — `aseguradora/siniestros` y `taller/ordenes` + `taller/cotizaciones`. Los módulos `cliente/siniestros` y `ajustador/siniestros` no tienen páginas en este frontend (son solo de la app móvil), así que quedan fuera.

## Método

Se extrajeron del `openapi.json` los schemas `SiniestroResponseDTO`, `SiniestroDetalleAseguradoraDTO`, `SiniestroUpdateDTO`, `ImagenSiniestroResponseDTO`, `DanoAjustadoResponseDTO`, `PeritajeResponseDTO`, `CotizacionV1DTO`, `TallerExpedienteDTO`, `CrearCotizacionRequest`, `EditarCotizacionRequest`, `AsignarAjustadorDTO`, `EnviarTallerDTO`, `RechazarCotizacionRequest`, junto con el `requestBody`/`response` de cada endpoint de siniestros de `aseguradora` y `taller`, y se compararon campo por campo contra:

- `src/api/aseguradora/siniestros/siniestros.schemas.ts`
- `src/api/taller/ordenes/ordenes.schemas.ts`
- `src/api/taller/cotizaciones/cotizaciones.schemas.ts`

## Hallazgos

### 1. `vehiculo_id` faltaba en todos los DTOs de siniestro — corregido ✅

El backend agregó `vehiculo_id: string | null` a `SiniestroResponseDTO` (y por herencia a `SiniestroDetalleAseguradoraDTO` y `TallerExpedienteDTO`), casi seguro para enlazar el siniestro con el nuevo módulo de vehículos (`aseguradora/crud/vehiculos`) en vez de solo los campos sueltos `vehiculo_marca/modelo/anio/placas/vin`. El frontend no lo tenía declarado en ningún DTO.

**Fix aplicado:**
- `SiniestroResponseDTO.vehiculo_id: string | null` agregado.
- `SiniestroUpdateDTO.vehiculo_id?: string` agregado (el backend lo acepta como opcional en `PUT /aseguradora/siniestros/{id}`).
- `TallerExpedienteDTO` lo hereda automáticamente al extender `SiniestroResponseDTO`.

No se cambió ninguna lógica de mapeo (`siniestroBackendToFrontend`, etc.) porque hoy ninguna pantalla necesita mostrar/editar `vehiculo_id` directamente — solo se corrigió el tipo para que sea preciso. Si más adelante quieren enlazar el selector de vehículos (el que ya existe en `/aseguradora/vehiculos`) al formulario de edición de un siniestro, el campo ya está tipado y listo para usarse.

### 2. `peritaje_ia` faltaba en `SiniestroDetalleAseguradoraDTO` — corregido ✅

`GET /aseguradora/siniestros/{id}` ahora devuelve un campo `peritaje_ia` (objeto libre o `null`), aparentemente un peritaje preliminar generado por IA, separado del `peritaje` (formal, del ajustador humano). No estaba declarado en el frontend.

**Fix aplicado:** se agregó `peritaje_ia: Record<string, unknown> | null` a `SiniestroDetalleAseguradoraDTO`. No se consume en la UI todavía (no hay diseño para mostrarlo) — solo se tipó para que el DTO sea fiel al contrato real. Si quieren mostrarlo en `DetalleIncidentePage`, avísenme y lo conecto.

### 3. Resto de campos — concuerdan sin cambios ✅

| Schema | Resultado |
|---|---|
| `SiniestroResponseDTO` (resto de campos) | ✅ Coincide |
| `SiniestroUpdateDTO` (resto de campos) | ✅ Coincide, todos opcionales como en el backend |
| `ImagenSiniestroResponseDTO` | ✅ Coincide exacto |
| `DanoAjustadoResponseDTO` | ✅ Coincide (backend usa `enum` para `tipo`/`severidad`; frontend los tipa como `string` genérico — funcionalmente correcto, solo menos estricto) |
| `PeritajeResponseDTO` | ✅ Coincide exacto |
| `CotizacionV1DTO` | ✅ Coincide exacto |
| `TallerExpedienteDTO` | ✅ Coincide (una vez agregado `vehiculo_id` vía herencia) |
| `CrearCotizacionRequest` / `EditarCotizacionRequest` | ✅ Coinciden exacto |
| `AsignarAjustadorDTO` / `EnviarTallerDTO` / `RechazarCotizacionRequest` | ✅ Coinciden exacto |

### 4. Nota sin cambios — respuesta de `concluir-trabajo` sin contrato definido ⚠️

`POST /taller/siniestros/{id}/concluir-trabajo` tiene `response: {}` en el OpenAPI (schema vacío, FastAPI no declaró `response_model`). El frontend (`cotizaciones.routes.ts`) asume que devuelve `MessageResponseDTO` (`{ message: string }`), pero el OpenAPI no lo garantiza — podría ser cualquier JSON. No lo cambié porque no hay información suficiente para saber la forma real sin probarlo en vivo contra un siniestro en el estatus correcto (`Trabajo_Concluido`), lo cual tiene efectos secundarios en el flujo de estados. Si quieren que lo verifique en vivo, decactive un siniestro de prueba hasta ese estatus y lo confirmo.

## Verificación estática tras los cambios

| Prueba | Resultado |
|---|---|
| `tsc -b --noEmit` | ✅ Sin errores nuevos |
| `oxlint` sobre archivos de siniestros/ordenes/páginas que los consumen | ✅ Sin warnings |

## Resumen

| # | Hallazgo | Estado |
|---|---|---|
| 1 | `vehiculo_id` faltante en DTOs de siniestro | ✅ Corregido |
| 2 | `peritaje_ia` faltante en detalle de aseguradora | ✅ Corregido |
| 3 | Resto de campos de los 12 schemas comparados | ✅ Ya concordaban |
| 4 | Forma de respuesta de `concluir-trabajo` sin contrato | ⚠️ Pendiente de verificar en vivo (opcional) |

Cambios en: `src/api/aseguradora/siniestros/siniestros.schemas.ts` (los demás archivos del módulo no requirieron cambios).
