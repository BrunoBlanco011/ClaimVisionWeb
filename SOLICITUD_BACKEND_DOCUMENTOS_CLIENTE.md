# Solicitud de cambios en backend — Documentos del cliente (vista de aseguradora)

> Para el equipo de backend. Describe los problemas encontrados en el endpoint que debe devolver
> los documentos (identificación y póliza) que el cliente sube desde la app móvil, usado por la
> vista "Más info" de un cliente en el panel de la aseguradora (`GestionClientesPage.tsx`).

## Estado (2026-07-23, actualizado el mismo día)

✅ **El 500 original ya no aparece** — ver [Problema 1 (resuelto)](#problema-1-resuelto--500-internal-server-error) abajo, se deja documentado como histórico.

🔴 **Nuevo bloqueador: las URLs de los documentos apuntan a un bucket de Supabase Storage que no existe** — ver [Problema 2 (abierto)](#problema-2-abierto--bucket-not-found-al-descargar) abajo. El endpoint ya responde `200` con datos, pero el archivo detrás de la URL no se puede descargar.

En ambos casos el frontend está implementado correctamente y coincide con el contrato publicado en `openapi_backend.json` — no hay nada que ajustar de este lado.

## Endpoint afectado

```
GET /api/v1/aseguradora/crud/clientes/{id}/documentos
```

Definido en `openapi_backend.json` (`obtener_documentos_cliente_api_v1_aseguradora_crud_clientes__id__documentos_get`), respuesta esperada `DocumentosClienteResponseDTO`:

```json
{
  "identificacion": { "url": "string", "tipo": "string", "subido_en": "2026-07-23T..." } | null,
  "poliza": { "url": "string", "tipo": "string", "subido_en": "2026-07-23T..." } | null
}
```

## Problema 1 (resuelto) — 500 Internal Server Error

Tenant de prueba: aseguradora `72a6f97f-1ab3-4e2e-8cc4-52dad3be5d87`, operador `OpAseguradora@gmail.com` (rol `Operador_Aseguradora`).

**1. Login:**
```
POST /api/v1/auth/login
{"email":"OpAseguradora@gmail.com","password":"..."}
→ 200, token válido
```

**2. Listar clientes de esa aseguradora (único cliente registrado):**
```
GET /api/v1/aseguradora/crud/clientes?page=1&page_size=20
→ 200
{
  "data": [{
    "id": "feaa5317-b206-4f4a-b4ef-0aa4fb8eb300",
    "nombre": "Cliente1",
    "email": "Cliente1@gmail.com",
    "numero_poliza": "160254836100",
    "consentimiento_aviso_privacidad": true,
    "consentimiento_biometria": true,
    ...
  }],
  "total": 1
}
```

**3. Pedir sus documentos (con el mismo token, dueño legítimo del tenant):**
```
GET /api/v1/aseguradora/crud/clientes/feaa5317-b206-4f4a-b4ef-0aa4fb8eb300/documentos
→ 500
{"error":"Ocurrió un error interno en el servidor."}
```

Mensaje genérico, sin detalle ni traceback expuesto — no da pista de la causa desde el cliente HTTP.

**Hipótesis que se manejaba en ese momento:** mismo patrón que otros bugs de Storage ya vistos en el proyecto (subida de PDF de cotización con 500, URLs firmadas con `InvalidJWT`). Ya no se puede confirmar la causa raíz porque el error dejó de reproducirse — pudo arreglarse junto con el problema 2, o ser un caso de null no manejado que ya no aplica porque ahora hay clientes con documentos reales. Se deja documentado por si reaparece.

## Problema 2 (abierto) — "Bucket not found" al descargar

Mismo tenant. Se creó un cliente nuevo (`cliente2@gmail.com`) que sí subió identificación y póliza desde la app móvil.

**1. Login + listar clientes:**
```
GET /api/v1/aseguradora/crud/clientes?page=1&page_size=20
→ 200, "cliente2" con id 68cf43b1-3495-4563-8dee-d0e82e7346a1
```

**2. Pedir sus documentos — ahora sí responde 200 con datos:**
```
GET /api/v1/aseguradora/crud/clientes/68cf43b1-3495-4563-8dee-d0e82e7346a1/documentos
→ 200
{
  "identificacion": {
    "url": "https://hiriefrywbfjjzncmpvn.supabase.co/storage/v1/object/public/cotizaciones/documentos/10c920db-7b55-4dc7-91e9-648eca45270c_ine.pdf",
    "tipo": "pdf",
    "subido_en": "2026-07-23T18:56:01.353081Z"
  },
  "poliza": {
    "url": "https://hiriefrywbfjjzncmpvn.supabase.co/storage/v1/object/public/cotizaciones/documentos/10c920db-7b55-4dc7-91e9-648eca45270c_poliza.pdf",
    "tipo": "pdf",
    "subido_en": "2026-07-23T18:56:01.353081Z"
  }
}
```

**3. Pero la URL en sí no sirve — probada directo contra Supabase, sin pasar por el frontend ni por este backend:**
```
GET https://hiriefrywbfjjzncmpvn.supabase.co/storage/v1/object/public/cotizaciones/documentos/10c920db-7b55-4dc7-91e9-648eca45270c_ine.pdf
→ 400
{"statusCode":"404","error":"Bucket not found","message":"Bucket not found"}
```

Es el mismo error que reportó el usuario al hacer clic en "Descargar" en la UI — el frontend (`DocumentoRow` en `GestionClientesPage.tsx`) solo hace `fetch(documento.url)` con la URL tal cual la manda el backend, sin transformarla.

## Contexto del frontend (ya implementado, no es la causa)

- `claimvision/src/pages/aseguradora/GestionClientesPage.tsx` — botón "Más info" → `openDetail()` → llama `getDocumentos(cliente.id)`; el componente `DocumentoRow` hace `fetch(documento.url)` para descargar y arma el nombre de archivo.
- `claimvision/src/api/aseguradora/clientes/clientes.routes.ts` — `getDocumentos()`, llama exactamente la ruta correcta.
- `claimvision/src/api/aseguradora/clientes/clientes.schemas.ts` — tipos calcados del schema real de `openapi_backend.json`.

No hay nada que ajustar del lado del frontend: la petición, el método, el path y el shape de respuesta coinciden con lo que el propio backend publica — el problema es que el **valor de `url` que arma el backend es inválido**, no cómo el frontend lo consume.

## Hipótesis

El path de la URL usa el bucket **`cotizaciones`** con el prefijo `documentos/` (`.../object/public/cotizaciones/documentos/{usuario_id}_{tipo}.pdf`) — el mismo bucket que ya usa la subida de PDFs de cotización del taller (ver bugs previos de Storage en este proyecto). Lo más probable:

1. Reutilizaron el bucket `cotizaciones` para guardar también los documentos de onboarding del cliente, pero ese bucket **no existe** en el proyecto de Supabase actual, o
2. El bucket correcto se llama distinto (p. ej. `documentos` o `onboarding`) y el backend está armando la URL con el nombre equivocado, o
3. El bucket existe pero no está marcado como público, y por eso el endpoint `.../object/public/...` no lo encuentra.

Este es ya el **tercer bug distinto** de esta categoría (Storage/documentos) en el proyecto — vale la pena que el equipo de backend revise de una vez la configuración completa de buckets de Supabase, no solo este caso puntual.

## Pedido

1. Confirmar en el dashboard de Supabase Storage si el bucket `cotizaciones` existe y está marcado como público.
2. Si el bucket real tiene otro nombre, corregir la construcción de la URL en el endpoint de documentos del cliente (y revisar si el mismo bug afecta otras URLs generadas con el mismo helper/función).
3. Si el bucket no existe, crearlo (público) y confirmar que los archivos ya subidos por `cliente2@gmail.com` (`10c920db-7b55-4dc7-91e9-648eca45270c_ine.pdf` / `..._poliza.pdf`) sigan existiendo en el bucket correcto — si se subieron al bucket equivocado, puede que haya que volver a subirlos.
4. Revisar si el Problema 1 (500 original) se resolvió como efecto secundario de un cambio relacionado, para no perder ese contexto.

## Referencia

Contrato verificado sobre `openapi_backend.json` (raíz del repo `ClaimVisionWeb`). Repro completa hecha por `curl` contra `https://api.actividades.icu/api/v1`, mismo método usado en `PRUEBAS_FLUJO_COMPLETO.md` para las rondas de prueba anteriores.
