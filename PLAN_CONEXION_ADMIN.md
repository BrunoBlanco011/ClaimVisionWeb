# Plan de Conexión del Módulo Administrador

## Objetivo
Conectar las 5 vistas del administrador en el frontend con los endpoints del backend, corrigiendo además las conexiones existentes (taller y aseguradora) que tienen errores de ruteo y formato.

---

## Fase 0: Correcciones a conexiones existentes ✅ (implementada)

> **Nota de arquitectura:** Todas las rutas del backend viven bajo el prefijo global `/api/v1`
> (ver `Endpoints.md`). Ese prefijo se centraliza en el base URL del cliente HTTP
> (`src/services/api.ts` → `http://localhost:8000/api/v1`), por lo que en cada servicio
> las rutas se escriben **relativas** (p. ej. `/aseguradora/talleres`). Las columnas
> "Ruta correcta" muestran el endpoint completo resultante.

### 0.1 Talleres Service (`src/services/talleres.service.ts`) ✅

Las rutas ya eran correctas; solo faltaba el prefijo de versión, ahora resuelto por el base URL.

| Método | Ruta en el servicio | Endpoint completo |
|--------|---------------------|-------------------|
| `getAll` | `GET /aseguradora/talleres?offset=0&limit=200` | `GET /api/v1/aseguradora/talleres` |
| `create` | `POST /aseguradora/talleres` | `POST /api/v1/aseguradora/talleres` |
| `update` | `PUT /aseguradora/talleres/{id}` | `PUT /api/v1/aseguradora/talleres/{id}` |
| `remove` | `DELETE /aseguradora/talleres/{id}` | `DELETE /api/v1/aseguradora/talleres/{id}` |

### 0.2 Ajustadores Service (`src/services/ajustadores.service.ts`) ✅

Las rutas ya eran correctas; solo faltaba el prefijo de versión, ahora resuelto por el base URL.

| Método | Ruta en el servicio | Endpoint completo |
|--------|---------------------|-------------------|
| `getAll` | `GET /aseguradora/ajustadores?offset=0&limit=200` | `GET /api/v1/aseguradora/ajustadores` |
| `create` | `POST /aseguradora/ajustadores` | `POST /api/v1/aseguradora/ajustadores` |
| `update` | `PUT /aseguradora/ajustadores/{id}` | `PUT /api/v1/aseguradora/ajustadores/{id}` |
| `remove` | `DELETE /aseguradora/ajustadores/{id}` | `DELETE /api/v1/aseguradora/ajustadores/{id}` |

### 0.3 Siniestros Service (`src/services/siniestros.service.ts`) ✅

**Correcciones aplicadas:**
- Los endpoints de listar/detalle/asignar son del **módulo aseguradora**, no del módulo siniestro.
- La acción `asignar-taller` se renombró a `enviar-taller` para coincidir con el backend.

| Método | Ruta anterior (ERRADA) | Ruta corregida | Endpoint completo |
|--------|------------------------|----------------|-------------------|
| `getAll` | `GET /siniestros` | `GET /aseguradora/siniestros?offset=0&limit=200` | `GET /api/v1/aseguradora/siniestros` |
| `getById` | `GET /siniestros/{id}` | `GET /aseguradora/siniestros/{id}` | `GET /api/v1/aseguradora/siniestros/{id}` |
| `assignAjustador` | `POST /siniestros/{id}/asignar-ajustador` | `POST /aseguradora/siniestros/{id}/asignar-ajustador` | `POST /api/v1/aseguradora/siniestros/{id}/asignar-ajustador` |
| `assignTaller` | `POST /siniestros/{id}/asignar-taller` | `POST /aseguradora/siniestros/{id}/enviar-taller` | `POST /api/v1/aseguradora/siniestros/{id}/enviar-taller` |

### 0.4 Expedientes Service (`src/services/expedientes.service.ts`) ✅

**Correcciones aplicadas:** en el módulo taller el listado es `ordenes` y el detalle es `siniestros/{id}`.

| Método | Ruta anterior (ERRADA) | Ruta corregida | Endpoint completo |
|--------|------------------------|----------------|-------------------|
| `getAll` | `GET /taller/expedientes` | `GET /taller/ordenes?offset=0&limit=200` | `GET /api/v1/taller/ordenes` |
| `getById` | `GET /taller/expedientes/{id}` | `GET /taller/siniestros/{id}` | `GET /api/v1/taller/siniestros/{id}` |

### 0.5 Presupuestos Service (`src/services/presupuestos.service.ts`) ✅

**Correcciones aplicadas:**
- La ruta ahora apunta a la cotización del siniestro e incluye su ID en la URL.
- La función `create` recibe `expedienteId` (el ID del siniestro) y lo coloca en la URL;
  `ElaboracionPresupuestoPage.tsx` lo pasa desde `useParams`.

| Método | Ruta anterior (ERRADA) | Ruta corregida | Endpoint completo |
|--------|------------------------|----------------|-------------------|
| `create` | `POST /taller/presupuestos/guardar` | `POST /taller/siniestros/{expedienteId}/cotizacion` | `POST /api/v1/taller/siniestros/{id}/cotizacion` |

**Cambio estructural:** la función `create` acepta `expedienteId` como parámetro y lo coloca en la URL.

---

## Fase 1: Nuevo servicio admin (frontend)

### 1.1 Tipos DTO (`src/types/`)

**`paginated.ts`**
```typescript
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
```

**`admin-aseguradora.dto.ts`**
```typescript
export interface AseguradoraRequestDTO {
  nombre: string
  rfc: string
  dominio_correo: string
  plan_suscripcion: string
  contacto_legal_email: string
}

export interface AseguradoraResponseDTO {
  id: string
  nombre: string
  rfc: string
  dominio_correo: string
  plan_suscripcion: string
  limite_peritajes_mes: number
  peritajes_consumidos_mes: number
  estatus_comercial: string
  contacto_legal_email: string
  version: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface UpdateAseguradoraDTO {
  nombre?: string
  rfc?: string
  dominio_correo?: string
  contacto_legal_email?: string
}

export interface UpdateSuscripcionDTO {
  nuevo_plan: string
}

export interface OperadorAseguradoraRequestDTO {
  nombre: string
  email: string
  password: string
}
```

**`admin-usuarios.dto.ts`**
```typescript
export interface UsuarioResponseDTO {
  id: string
  email: string
  nombre: string
  rol: string
  aseguradora_id: string | null
  estado: string
  created_at: string
  deleted_at: string | null
}

export interface UsuarioRequestDTO {
  email: string
  nombre: string
  password: string
  rol: string
  aseguradora_id?: string
  telefono?: string
}
```

**`admin-talleres.dto.ts`**
```typescript
export interface TallerAdminResponseDTO {
  id: string
  nombre_comercial: string
  rfc: string
  direccion_tecnica: string
  telefono_contacto: string
  aseguradora_nombre?: string
  aseguradora_id?: string
  capacidad_ocupada?: number
  ordenes_activas?: number
  calificacion?: number | null
  estatus?: string
  created_at: string
  deleted_at: string | null
}
```

**`admin-dashboard.dto.ts`**
```typescript
export interface DashboardResumenDTO {
  total_siniestros: number
  siniestros_por_estatus: { estatus: string; count: number }[]
  siniestros_por_mes: { mes: string; count: number }[]
  usuarios_activos: number
  total_aseguradoras: number
  aseguradoras_activas: number
  total_talleres: number
  talleres_pendientes: number
}
```

### 1.2 Admin Service (`src/services/admin.service.ts`)

```typescript
import { api } from './api'
import type {
  PaginatedResponse,
  AseguradoraRequestDTO,
  AseguradoraResponseDTO,
  UpdateAseguradoraDTO,
  UpdateSuscripcionDTO,
  OperadorAseguradoraRequestDTO,
  UsuarioRequestDTO,
  UsuarioResponseDTO,
  TallerAdminResponseDTO,
  DashboardResumenDTO,
  AuditResponseDTO,
} from '../types'

// ── Aseguradoras ──
export const getAseguradoras = (page = 1, pageSize = 20, includeDeleted = false) =>
  api.get<PaginatedResponse<AseguradoraResponseDTO>>(
    `/admin/aseguradoras?page=${page}&page_size=${pageSize}&include_deleted=${includeDeleted}`
  )

export const getAseguradoraById = (id: string) =>
  api.get<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}`)

export const createAseguradora = (data: AseguradoraRequestDTO) =>
  api.post<AseguradoraResponseDTO>('/admin/aseguradoras', data)

export const updateAseguradora = (id: string, data: UpdateAseguradoraDTO) =>
  api.put<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}`, data)

export const deleteAseguradora = (id: string) =>
  api.delete<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}`)

export const verifyAseguradora = (id: string) =>
  api.post<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}/verificar`)

export const updateSuscripcion = (id: string, plan: string) =>
  api.put<AseguradoraResponseDTO>(`/admin/aseguradoras/${id}/suscripcion`, { nuevo_plan: plan })

export const createOperadorAseguradora = (id: string, data: OperadorAseguradoraRequestDTO) =>
  api.post(`/admin/aseguradoras/${id}/operadores`, data)

// ── Usuarios ──
export const getUsuarios = (page = 1, pageSize = 20, filters?: { rol?: string; estatus?: string }) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) })
  if (filters?.rol) params.set('rol', filters.rol)
  if (filters?.estatus) params.set('estatus', filters.estatus)
  return api.get<PaginatedResponse<UsuarioResponseDTO>>(`/admin/usuarios?${params}`)
}

export const getUsuarioById = (id: string) =>
  api.get<UsuarioResponseDTO>(`/admin/usuarios/${id}`)

export const createUsuario = (data: UsuarioRequestDTO) =>
  api.post<UsuarioResponseDTO>('/admin/usuarios', data)

export const updateUsuario = (id: string, data: Partial<UsuarioRequestDTO>) =>
  api.put<UsuarioResponseDTO>(`/admin/usuarios/${id}`, data)

export const deleteUsuario = (id: string) =>
  api.delete(`/admin/usuarios/${id}`)

export const bloquearArco = (usuarioId: string) =>
  api.post<{ message: string }>(`/admin/usuarios/${usuarioId}/bloqueo-arco`)

// ── Talleres (admin) ──
export const getTalleresAdmin = (page = 1, pageSize = 20) =>
  api.get<PaginatedResponse<TallerAdminResponseDTO>>(`/admin/talleres?page=${page}&page_size=${pageSize}`)

export const getTallerAdminById = (id: string) =>
  api.get<TallerAdminResponseDTO>(`/admin/talleres/${id}`)

// ── Dashboard ──
export const getDashboardResumen = () =>
  api.get<DashboardResumenDTO>('/admin/dashboard/resumen')

// ── Auditoría ──
export const getAuditoriaLogs = (page = 1, pageSize = 20) =>
  api.get<PaginatedResponse<AuditResponseDTO>>(`/admin/auditoria/logs?page=${page}&page_size=${pageSize}`)
```

### 1.3 Mappers (`src/services/mappers.ts`) — Agregar:

```typescript
export function aseguradoraResponseToFrontend(dto: AseguradoraResponseDTO): AseguradoraAdmin {
  return {
    id: dto.id,
    nombre: dto.nombre,
    rfc: dto.rfc,
    estatus: dto.estatus_comercial === 'ACTIVO' ? 'Activa' : 'Inactiva',
    operadores: 0,
    ajustadores: 0,
    siniestrosActivos: 0,
    talleres: 0,
    plan: dto.plan_suscripcion as PlanTier,
  }
}

export function aseguradoraFormToCreateDTO(form: AseguradoraFormData): AseguradoraRequestDTO {
  return {
    nombre: form.nombre,
    rfc: form.rfc,
    dominio_correo: form.dominioCorreo,
    plan_suscripcion: form.plan.toUpperCase(),
    contacto_legal_email: form.emailContactoLegal,
  }
}

export function usuarioResponseToFrontend(dto: UsuarioResponseDTO): UsuarioSistema {
  return {
    id: dto.id,
    nombre: dto.nombre,
    email: dto.email,
    rolUsuario: dto.rol as RoleVariant,
    aseguradoraOTaller: dto.aseguradora_id ?? undefined,
    estatus: dto.estado as EstatusUsuario,
    ultimoAcceso: '',
  }
}

export function tallerAdminResponseToFrontend(dto: TallerAdminResponseDTO): TallerAdmin {
  return {
    id: dto.id,
    nombre: dto.nombre_comercial,
    ciudadEstado: dto.direccion_tecnica.split(',').pop()?.trim() ?? '',
    aseguradoraVinculada: dto.aseguradora_nombre,
    capacidadOcupada: dto.capacidad_ocupada ?? 0,
    ordenesActivas: dto.ordenes_activas ?? 0,
    calificacion: dto.calificacion ?? null,
    estatus: dto.deleted_at ? 'Inactivo' as any : (dto.estatus as any) ?? 'Pendiente',
  }
}

export function auditResponseToFrontend(dto: AuditResponseDTO): EventoAuditoria {
  return {
    id: dto.id ?? '',
    fechaHora: new Date(dto.created_at).toLocaleString('es-MX'),
    usuario: dto.usuario_id ?? 'Sistema',
    rolUsuario: 'Administrador_Global' as RoleVariant,
    accion: (dto.accion_realizada ?? 'UPDATE') as ActionVariant,
    tablaAfectada: dto.evento_modulo ?? '',
    detalle: dto.metadata_context ? JSON.stringify(dto.metadata_context) : '',
    ip: dto.direccion_ip ?? undefined,
  }
}
```

### 1.4 Barrel (`src/services/index.ts`) — Agregar exports:

```typescript
export {
  getAseguradoras,
  getAseguradoraById,
  createAseguradora,
  updateAseguradora,
  deleteAseguradora,
  verifyAseguradora,
  updateSuscripcion,
  createOperadorAseguradora,
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  bloquearArco,
  getTalleresAdmin,
  getTallerAdminById,
  getDashboardResumen,
  getAuditoriaLogs,
} from './admin.service'
```

---

## Fase 2: Conectar páginas del administrador

### 2.1 `AseguradorasPage.tsx`

| Elemento | Código mock actual | Conexión real |
|----------|-------------------|---------------|
| Lista | `MOCK_ASEGURADORAS` array | `getAseguradoras()` con paginación |
| Contador | `MOCK_ASEGURADORAS.filter(a => a.estatus === 'Activa').length` | Calcular desde `res.total` o filtrar por `estatus_comercial` |
| Modal crear | Submit con `setModalOpen(false)` | `createAseguradora(formToDTO)` |
| Botón verificar | `onAdminClick={() => {}}` | `verifyAseguradora(id)` |
| Actualizar plan | No existe | `updateSuscripcion(id, plan)` |
| Eliminar | No existe | `deleteAseguradora(id)` con ConfirmDialog |
| Editar | No existe | Modal de edición con `updateAseguradora(id, data)` |

### 2.2 `GestionUsuariosPage.tsx`

| Elemento | Código mock actual | Conexión real |
|----------|-------------------|---------------|
| Lista | `MOCK_USUARIOS` | `getUsuarios(page, pageSize, { rol, estatus })` |
| Filtros | Filtran el array local | Se envían como query params al backend |
| Modal crear | Submit dummy | `createUsuario(formToDTO)` |
| Botón de acciones | Abre ConfirmDialog de baja | `deleteUsuario(id)` o `bloquearArco(id)` |
| Select aseguradora | Opciones hardcodeadas | `getAseguradoras()` → opciones dinámicas |

### 2.3 `GestionTalleresAdminPage.tsx`

| Elemento | Código mock actual | Conexión real |
|----------|-------------------|---------------|
| Lista | `MOCK_TALLERES` | `getTalleresAdmin(page, pageSize)` |
| Filtros | `select` con opciones fijas | Query params: estatus, aseguradora, ciudad |
| Modal registrar | Submit dummy | `createTaller(data)` (del módulo aseguradora vía admin) o endpoint nuevo |
| Select aseguradora | Opciones hardcodeadas | `getAseguradoras()` → opciones dinámicas |

### 2.4 `PanelGlobalPage.tsx`

| Elemento | Código mock actual | Conexión real |
|----------|-------------------|---------------|
| KPIs | Valores fijos hardcodeados | `getDashboardResumen()` |
| Gráfico barras | `Math.random()` | `dashboard.siniestros_por_mes` |
| Lista estatus | `StatProgressList` con datos fijos | `dashboard.siniestros_por_estatus` |

### 2.5 `AuditoriaSistemaPage.tsx`

| Elemento | Código mock actual | Conexión real |
|----------|-------------------|---------------|
| KPIs | Valores fijos | Se pueden mantener como mock o calcular desde los logs |
| Tabla | `MOCK_EVENTOS` | `getAuditoriaLogs(page, pageSize)` |
| Filtros | `select` con opciones fijas | Filtran mediante query params al backend |
| Paginación | No existe | Agregar componente Pagination |

---

## Orden de implementación sugerido

1. **Fase 0.1–0.5** — Corregir servicios existentes (taller, aseguradora, siniestros, expedientes, presupuestos)
2. **Fase 1.1** — Crear tipos DTO
3. **Fase 1.2** — Crear `admin.service.ts`
4. **Fase 1.3** — Agregar mappers
5. **Fase 1.4** — Actualizar barrel
6. **Fase 2.1** — Conectar `AseguradorasPage.tsx`
7. **Fase 2.5** — Conectar `AuditoriaSistemaPage.tsx`
8. **Fase 2.2** — Conectar `GestionUsuariosPage.tsx`
9. **Fase 2.3** — Conectar `GestionTalleresAdminPage.tsx`
10. **Fase 2.4** — Conectar `PanelGlobalPage.tsx`
