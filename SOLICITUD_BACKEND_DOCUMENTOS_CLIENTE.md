# Solicitud de cambios en backend — Documentos del cliente (vista de aseguradora)

> Para el equipo de backend. Describe un error 500 reproducido en vivo en el endpoint que debe
> devolver los documentos (identificación y póliza) que el cliente sube desde la app móvil, usado
> por la vista "Más info" de un cliente en el panel de la aseguradora
> (`GestionClientesPage.tsx`).

## Estado (2026-07-23)

🔴 **Bloqueado por backend.** El frontend está implementado y coincide exactamente con el contrato
publicado en `openapi_backend.json`, pero el endpoint devuelve `500 Internal Server Error` con
cualquier cliente probado.

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

## Reproducción (2026-07-23, backend en vivo)

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

## Contexto del frontend (ya implementado, no es la causa)

- `claimvision/src/pages/aseguradora/GestionClientesPage.tsx` — botón "Más info" → `openDetail()` → llama `getDocumentos(cliente.id)` y muestra el estado de carga/error con un toast (`getErrorMessage`).
- `claimvision/src/api/aseguradora/clientes/clientes.routes.ts` — `getDocumentos()`, llama exactamente la ruta de arriba.
- `claimvision/src/api/aseguradora/clientes/clientes.schemas.ts` — tipos `DocumentoItemDTO` / `DocumentosClienteResponseDTO`, calcados del schema real de `openapi_backend.json`.

No hay nada que ajustar del lado del frontend: la petición, el método, el path y el shape de respuesta esperado coinciden 100% con lo que el propio backend publica.

## Hipótesis

El error es genérico (`"Ocurrió un error interno en el servidor."`) — mismo patrón que otros dos bugs de backend ya detectados antes en este proyecto, ambos relacionados a documentos/Storage:

1. La subida del PDF de cotización del taller (`POST /taller/siniestros/{id}/cotizacion`) tronaba con 500 al procesar el archivo adjunto.
2. Las URLs firmadas de Storage para el PDF de cotización expiraban casi de inmediato (`InvalidJWT`, `"exp" claim timestamp check failed`) al abrirlas desde el frontend.

Sospecha más probable para este caso: al armar `DocumentosClienteResponseDTO`, el backend intenta generar la(s) URL(s) firmada(s) de Storage para los documentos del cliente (identificación/póliza subidos en su onboarding) y algo en ese paso truena — ya sea porque el cliente no tiene un documento cargado todavía y el código no maneja el caso `null` con gracia, o por el mismo problema de generación de URLs firmadas (`expires_in` / reloj del servidor) visto en el bug de cotizaciones.

## Pedido

1. Revisar el log del servidor para la petición de arriba (aseguradora `72a6f97f-...`, cliente `feaa5317-...`, 2026-07-23) y compartir el traceback real — el cliente HTTP no expone nada más que el mensaje genérico.
2. Confirmar si el cliente de prueba (`Cliente1@gmail.com`) efectivamente tiene documentos subidos en Storage; si no los tiene, el endpoint debería devolver `identificacion: null, poliza: null` en vez de un 500.
3. Si el cliente sí tiene documentos, revisar la generación de URLs firmadas de Storage en este endpoint — mismo área de código que el bug de cotizaciones (`expires_in` / reloj del servidor).

## Referencia

Contrato verificado sobre `openapi_backend.json` (raíz del repo `ClaimVisionWeb`). Repro completa hecha por `curl` contra `https://api.actividades.icu/api/v1`, mismo método usado en `PRUEBAS_FLUJO_COMPLETO.md` para las rondas de prueba anteriores.
