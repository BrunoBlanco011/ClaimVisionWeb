# Graph Report - claimvision  (2026-07-22)

## Corpus Check
- 170 files · ~44,547 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 989 nodes · 1797 edges · 199 communities (46 shown, 153 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3e00dbf8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App Bootstrap and Auth Routes
- Siniestros Claims Domain
- Admin Dashboard and Perfil
- Branding and Sidebar Components
- Form Input Atoms
- Aseguradoras Admin API
- Project Dependencies (package.json)
- Talleres API (Aseguradora)
- DTOs and Conexion Plan Phases
- Frontend Services and Backend Plan
- CLAUDE.md Project Guidance
- Cotizaciones and Taller Perfil API
- Auditoria API and Action Badges
- Clientes and Vehiculos API
- Usuarios Admin API
- Estado Conexion Admin Doc
- TypeScript App Config
- Ajustadores API
- TypeScript Node Config
- Endpoints.md API Reference
- README Tooling Notes
- Oxlint Configuration
- Icon Sprite Sheet
- TypeScript Root Config
- Favicon Asset
- Hero Illustration Asset
- Vite Logo Asset
- router.tsx
- LoginForm.tsx
- Pruebas contra el backend real
- PanelGlobalPage.tsx
- siniestros.schemas.ts
- StatusVariant
- BandejaExpedientesPage.tsx
- Fix — Creación de usuarios con perfil vinculado (panel Super Admin)
- auth.routes.ts
- useAuth.ts
- Hallazgos
- index.ts
- Solicitud de cambios en backend — Auditoría del Sistema
- useAuth
- ordenes.routes.ts
- AppLayout.tsx
- ConfiguracionPage.tsx
- shadcn
- CLAUDE.md
- src/services/admin/aseguradoras.service.ts
- src/services/admin/auditoria.service.ts
- src/services/admin/usuarios.service.ts
- components/molecules/AjustadorForm/AjustadorForm.tsx
- src/services/ajustadores.service.ts
- AseguradoraRequestDTO
- AseguradoraResponseDTO
- AuditResponseDTO
- src/services/auth.service.ts
- ClaimVisionBack src/modules/admin/presentation/schemas.py (clase PaginatedResponse, no usada)
- ClaimVisionBack admin_v1_routes.py
- ClaimVisionBack core/routers.py
- ClaimVisionBack src/core/v1_router.py
- ClaimVisionBack src/main.py
- ClaimVisionBack src/shared/presentation/pagination.py (clase Page)
- ClaimVisionBack taller_v1_routes.py
- ClaimVisionBack taller_v1_schemas.py (CrearCotizacionRequest)
- claimvision/.env (VITE_API_URL)
- Atomic Design Architecture
- atoms/ Components
- authStub
- AuthLayout
- Button
- npm Scripts / Commands
- ErrorMessage
- FormField
- src/index.css
- Input
- Label
- LoginPage.tsx
- LoginForm
- Logo
- CLAUDE.md (guía de ruteo por rol)
- molecules/ Components
- organisms/ Components
- Oxlint
- .oxlintrc.json
- pages/ Directory
- pages/aseguradora/
- pages/shared/
- pages/taller/
- Project Layout
- React 19
- react-router-dom v7
- Role Routing
- router.tsx
- Technology Stack
- Tailwind CSS v4
- Tailwind CSS v4 Notes
- templates/ Components
- tsconfig.app.json
- tsconfig.node.json
- TypeScript ~6
- TypeScript Strictness Flags
- Vite 8
- Hallazgo crítico #2: CRUD de Aseguradora vive bajo /aseguradora/crud, no /aseguradora
- Gaps de backend confirmados (no de ruteo): endpoints de admin y de subida de PDF que no existen todavía
- Hallazgo crítico #3: envelope de paginación real es Page (data/total/page/page_size), no PaginatedResponse (items/total_pages)
- Roles Cliente y Ajustador fuera de alcance para el frontend web
- Hallazgo crítico #1: falta prefijo /v1 en todas las llamadas del frontend
- DashboardResumenDTO
- Bloqueo/Desbloqueo ARCO (LFPDPPP rights) domain concept
- Auditoría de logs domain concept
- Consentimiento LFPDPPP domain concept
- Cotización (repair quote) domain concept
- Endpoints.md
- Onboarding OCR domain concept
- Peritaje (damage assessment) domain concept
- Siniestro (claim) domain concept and lifecycle
- AseguradoraResponseDTO
- GET /api/admin/aseguradoras
- POST /api/admin/aseguradoras
- PUT /api/admin/aseguradoras/{id}/suscripcion
- POST /api/admin/aseguradoras/{id}/verificar
- AseguradorasPage
- GET /api/admin/auditoria/logs
- AuditoriaSistemaPage
- AuditResponse
- ConfiguracionPage
- GET /api/admin/dashboard/resumen
- GestionTalleresAdminPage
- GestionUsuariosPage
- InsurerCard
- PanelGlobalPage
- GET /api/admin/talleres
- GET /api/admin/talleres/{id}
- POST /api/admin/talleres
- POST /api/admin/usuarios/{id}/bloqueo-arco
- DELETE /api/admin/usuarios/{id}
- GET /api/admin/usuarios
- POST /api/admin/usuarios
- PUT /api/admin/usuarios/{id}
- src/services/expedientes.service.ts
- src/pages/administrador/GestionTalleresAdminPage.tsx
- src/pages/administrador/GestionUsuariosPage.tsx
- src/services/mappers.ts
- OperadorAseguradoraRequestDTO
- PaginatedResponse<T>
- src/pages/administrador/PanelGlobalPage.tsx
- src/services/peritajes.service.ts
- Fase 0: Correcciones a conexiones existentes
- PLAN_CONEXION_FRONTEND.md (plan anterior, raíz del repo)
- src/services/presupuestos.service.ts
- Oxc
- Oxlint
- Oxlint Rules Documentation
- oxlint-tsgolint
- .oxlintrc.json
- React
- React Compiler Installation Documentation
- SWC
- Vite
- @vitejs/plugin-react
- @vitejs/plugin-react-swc
- src/services/siniestros.service.ts
- AseguradorasPage.tsx
- AuditoriaSistemaPage.tsx
- GestionTalleresAdminPage.tsx
- GestionUsuariosPage.tsx
- PanelGlobalPage.tsx
- src/services/admin.service.ts
- src/services/ajustadores.service.ts
- src/services/api.ts
- src/services/expedientes.service.ts
- src/services/index.ts
- src/services/mappers.ts
- src/services/presupuestos.service.ts
- src/services/siniestros.service.ts
- src/services/talleres.service.ts
- src/types/admin-aseguradora.dto.ts
- src/types/admin-dashboard.dto.ts
- src/types/admin-talleres.dto.ts
- src/types/admin-usuarios.dto.ts
- src/types/paginated.ts
- components/molecules/TallerForm/TallerForm.tsx
- TallerAdminResponseDTO
- src/services/talleres.service.ts
- src/services/trabajos.service.ts
- src/types/admin-aseguradoras.ts (PaginatedResponse<T>)
- src/types/expedientes.ts (ExpedienteTecnicoResponseDTO / TallerExpedienteDTO)
- src/types/siniestro.ts (SiniestroDetalleAseguradoraDTO)
- src/types/talleres.ts (Taller)
- UpdateAseguradoraDTO
- UpdateSuscripcionDTO
- UsuarioRequestDTO
- UsuarioResponseDTO

## God Nodes (most connected - your core abstractions)
1. `react` - 51 edges
2. `getErrorMessage()` - 38 edges
3. `useLiveRefresh()` - 29 edges
4. `useToast()` - 28 edges
5. `StatusVariant` - 20 edges
6. `api` - 17 edges
7. `compilerOptions` - 17 edges
8. `useAuth()` - 15 edges
9. `compilerOptions` - 15 edges
10. `Label()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `buildPresupuestoPdf()` --references--> `jspdf`  [EXTRACTED]
  src/pages/taller/ElaboracionPresupuestoPage.tsx → package.json
- `ElaboracionPresupuestoPage()` --references--> `jspdf`  [EXTRACTED]
  src/pages/taller/ElaboracionPresupuestoPage.tsx → package.json
- `Presupuesto` --references--> `StatusVariant`  [EXTRACTED]
  src/api/taller/cotizaciones/cotizaciones.schemas.ts → src/api/shared/status.ts
- `PanelGlobalPage()` --calls--> `getResumen()`  [EXTRACTED]
  src/pages/administrador/PanelGlobalPage.tsx → src/api/admin/dashboard/dashboard.routes.ts
- `GestionUsuariosPage()` --calls--> `bloqueoArco()`  [EXTRACTED]
  src/pages/administrador/GestionUsuariosPage.tsx → src/api/admin/usuarios/usuarios.routes.ts

## Import Cycles
- None detected.

## Communities (199 total, 153 thin omitted)

### Community 0 - "App Bootstrap and Auth Routes"
Cohesion: 0.11
Nodes (23): react, App(), icons, styles, Toast(), ToastData, ToastType, liveStatusConfig (+15 more)

### Community 1 - "Siniestros Claims Domain"
Cohesion: 0.14
Nodes (21): aprobarCotizacion(), assignAjustador(), assignTaller(), autorizarEntrega(), getById(), mockIncidentes, rechazarCotizacion(), siniestroDetalleBackendToFrontend() (+13 more)

### Community 2 - "Admin Dashboard and Perfil"
Cohesion: 0.21
Nodes (13): getPerfil(), perfilBackendToFrontend(), updatePerfil(), PerfilAseguradora, PerfilAseguradoraDTO, PerfilAseguradoraUpdateDTO, Incidente, ConfiguracionPage() (+5 more)

### Community 3 - "Branding and Sidebar Components"
Cohesion: 0.10
Nodes (4): NavItem, navItems, Sidebar(), SidebarProps

### Community 4 - "Form Input Atoms"
Cohesion: 0.08
Nodes (33): changePassword(), getPerfil(), perfilBackendToFrontend(), updatePerfil(), TallerPerfil, TallerPerfilResponseDTO, TallerPerfilUpdateRequestDTO, Input() (+25 more)

### Community 5 - "Aseguradoras Admin API"
Cohesion: 0.08
Nodes (39): aseguradoraAdminBackendToFrontend(), aseguradoraAdminToCreateDTO(), cambiarSuscripcion(), crearOperador(), create(), delay(), getAll(), getById() (+31 more)

### Community 6 - "Project Dependencies (package.json)"
Cohesion: 0.05
Nodes (43): autoprefixer, motion, oxlint, dependencies, motion, react, react-dom, react-router-dom (+35 more)

### Community 7 - "Talleres API (Aseguradora)"
Cohesion: 0.18
Nodes (18): create(), createOperador(), delay(), getAll(), mockData, remove(), tallerBackendToFrontend(), update() (+10 more)

### Community 8 - "DTOs and Conexion Plan Phases"
Cohesion: 0.10
Nodes (20): 0.1 Talleres Service (`src/services/talleres.service.ts`) ✅, 0.2 Ajustadores Service (`src/services/ajustadores.service.ts`) ✅, 0.3 Siniestros Service (`src/services/siniestros.service.ts`) ✅, 0.4 Expedientes Service (`src/services/expedientes.service.ts`) ✅, 0.5 Presupuestos Service (`src/services/presupuestos.service.ts`) ✅, 1.1 Tipos DTO (`src/types/`), 1.2 Admin Service (`src/services/admin.service.ts`), 1.3 Mappers (`src/services/mappers.ts`) — Agregar: (+12 more)

### Community 9 - "Frontend Services and Backend Plan"
Cohesion: 0.09
Nodes (21): 0. Hallazgo crítico #1 — Falta el prefijo `/v1` en TODAS las llamadas, 1. Hallazgo crítico #2 — El CRUD de Aseguradora vive bajo `/aseguradora/crud`, no `/aseguradora`, 2. Hallazgo crítico #3 — Formato del envelope de paginación, 3.10 `auth.service.ts`, 3.1 `talleres.service.ts`, 3.2 `ajustadores.service.ts`, 3.3 `siniestros.service.ts`, 3.4 `expedientes.service.ts` (módulo Taller) (+13 more)

### Community 11 - "Cotizaciones and Taller Perfil API"
Cohesion: 0.26
Nodes (9): MessageResponseDTO, create(), CreatePresupuestoData, delay(), EditarCotizacionRequest, Part, Presupuesto, PresupuestoEnviado (+1 more)

### Community 12 - "Auditoria API and Action Badges"
Cohesion: 0.10
Nodes (35): ACCION_BUCKETS, classifyAccion(), eventoAuditoriaBackendToFrontend(), exportCsv(), filtrosToQuery(), getAll(), getDetalle(), getResumen() (+27 more)

### Community 13 - "Clientes and Vehiculos API"
Cohesion: 0.11
Nodes (28): clienteBackendToFrontend(), create(), getAll(), getById(), Cliente, ClienteCreateDTO, ClienteResponseDTO, create() (+20 more)

### Community 14 - "Usuarios Admin API"
Cohesion: 0.15
Nodes (20): bloqueoArco(), create(), getAll(), ListarUsuariosFiltros, remove(), update(), usuarioBackendToFrontend(), CreateUsuarioRequestDTO (+12 more)

### Community 15 - "Estado Conexion Admin Doc"
Cohesion: 0.18
Nodes (10): 1. Panel Global (`PanelGlobalPage`), 2. Gestión de Usuarios (`GestionUsuariosPage`), 3. Aseguradoras (`AseguradorasPage`), 4. Gestión de Talleres (Admin) (`GestionTalleresAdminPage`), 5. Auditoría del Sistema (`AuditoriaSistemaPage`), 6. Configuración (`ConfiguracionPage`), Estado de Conexión — Módulo Administrador, Leyenda (+2 more)

### Community 16 - "TypeScript App Config"
Cohesion: 0.09
Nodes (22): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib (+14 more)

### Community 17 - "Ajustadores API"
Cohesion: 0.16
Nodes (17): ajustadorBackendToFrontend(), create(), getAll(), remove(), update(), Ajustador, AjustadorCreateDTO, AjustadorResponseDTO (+9 more)

### Community 18 - "TypeScript Node Config"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 19 - "Endpoints.md API Reference"
Cohesion: 0.17
Nodes (11): Admin, Ajustador, Aseguradora — CRUD, Aseguradora — Siniestros, Auth, ClaimVision API — Endpoints, Cliente, Health (+3 more)

### Community 20 - "README Tooling Notes"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 21 - "Oxlint Configuration"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 22 - "Icon Sprite Sheet"
Cohesion: 0.29
Nodes (7): icons.svg (icon sprite sheet), Bluesky icon (butterfly logo), Discord icon (game controller/mask logo), Documentation icon (document with chat/edit arrows), GitHub icon (Octocat logo), Social icon (person with settings gear), X (Twitter) icon

### Community 29 - "router.tsx"
Cohesion: 0.09
Nodes (43): jspdf, jspdf, getAll(), getById(), tallerAdminBackendToFrontend(), TallerAdmin, TallerAdminResponseDTO, bloqueoArco() (+35 more)

### Community 30 - "LoginForm.tsx"
Cohesion: 0.06
Nodes (31): Button(), ButtonProps, ButtonSize, ButtonVariant, sizeClasses, variantClasses, ErrorMessage(), ErrorMessageProps (+23 more)

### Community 31 - "Pruebas contra el backend real"
Cohesion: 0.10
Nodes (19): Contexto, Nota, Pendiente (no cubierto aquí), Pruebas contra el backend real, Pruebas — Módulo de Vehículos (Aseguradora), Resumen, Test 0 — Login, Test 10 — Filtrar por `cliente_id` inexistente (+11 more)

### Community 32 - "PanelGlobalPage.tsx"
Cohesion: 0.19
Nodes (11): getResumen(), DashboardResumenDTO, EstatusCountDTO, SiniestrosPorMesDTO, CountUp(), CountUpProps, StatProgressItem, StatProgressList() (+3 more)

### Community 33 - "siniestros.schemas.ts"
Cohesion: 0.19
Nodes (14): CotizacionDetalle, DanoAjustadoResponseDTO, EnviarTallerDTO, EvidenciaFoto, ImagenSiniestroResponseDTO, Peritaje, PeritajeEstado, PeritajeResponseDTO (+6 more)

### Community 34 - "StatusVariant"
Cohesion: 0.22
Nodes (10): StatusVariant, labels, sizeClasses, StatusBadge(), StatusBadgeProps, StatusSize, variantClasses, DetalleHistoricoPage() (+2 more)

### Community 35 - "BandejaExpedientesPage.tsx"
Cohesion: 0.21
Nodes (8): Expediente, Column, DataTable(), DataTableProps, SortDir, columns, statusOptions, columns

### Community 36 - "Fix — Creación de usuarios con perfil vinculado (panel Super Admin)"
Cohesion: 0.17
Nodes (11): Cambios, Causa raíz, Fix — Creación de usuarios con perfil vinculado (panel Super Admin), Nota, Pendiente, Pruebas contra el backend real, Resumen, Test A — Crear operador de aseguradora por la ruta correcta (+3 more)

### Community 37 - "auth.routes.ts"
Cohesion: 0.27
Nodes (8): delay(), login(), ROLE_MAP, LoginRequest, LoginResponseDTO, LoginCredentials, LoginPage(), roleRedirect

### Community 38 - "useAuth.ts"
Cohesion: 0.31
Nodes (7): getCurrentUser(), LoginResult, AuthContext, AuthProvider(), loadUser(), AuthState, User

### Community 39 - "Hallazgos"
Cohesion: 0.20
Nodes (9): 1. `vehiculo_id` faltaba en todos los DTOs de siniestro — corregido ✅, 2. `peritaje_ia` faltaba en `SiniestroDetalleAseguradoraDTO` — corregido ✅, 3. Resto de campos — concuerdan sin cambios ✅, 4. Nota sin cambios — respuesta de `concluir-trabajo` sin contrato definido ⚠️, Hallazgos, Método, Resumen, Verificación de DTOs — Módulo de Siniestros vs `openapi.json` (+1 more)

### Community 40 - "index.ts"
Cohesion: 0.33
Nodes (4): AuthLayout(), AuthLayoutProps, AuthSplitLayout(), AuthSplitLayoutProps

### Community 41 - "Solicitud de cambios en backend — Auditoría del Sistema"
Cohesion: 0.25
Nodes (7): Cambios solicitados (histórico — ya implementados), Endpoint actual (histórico — como estaba antes del cambio), Estado (2026-07-19), Pendiente — v2, Problemas que esto causaba en el frontend (antes del cambio), Referencia, Solicitud de cambios en backend — Auditoría del Sistema

### Community 42 - "useAuth"
Cohesion: 0.50
Nodes (5): AuthGuard(), AuthGuardProps, GuestGuard(), UserRole, useAuth()

### Community 43 - "ordenes.routes.ts"
Cohesion: 0.48
Nodes (6): delay(), expedienteBackendToFrontend(), getAll(), getById(), getDetalleById(), mockData

### Community 44 - "AppLayout.tsx"
Cohesion: 0.60
Nodes (4): logout(), UserRole, AppLayout(), AppLayoutProps

### Community 45 - "ConfiguracionPage.tsx"
Cohesion: 0.50
Nodes (4): ConfiguracionPage(), defaultNotificaciones, loadNotificaciones(), NotificacionesConfig

## Knowledge Gaps
- **409 isolated node(s):** `npx`, `$schema`, `typescript`, `oxc`, `react/rules-of-hooks` (+404 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **153 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Bootstrap and Auth Routes` to `Siniestros Claims Domain`, `Admin Dashboard and Perfil`, `Branding and Sidebar Components`, `Form Input Atoms`, `Aseguradoras Admin API`, `Talleres API (Aseguradora)`, `Auditoria API and Action Badges`, `Clientes and Vehiculos API`, `Usuarios Admin API`, `Ajustadores API`, `Oxlint Configuration`, `router.tsx`, `LoginForm.tsx`, `PanelGlobalPage.tsx`, `StatusVariant`, `BandejaExpedientesPage.tsx`, `auth.routes.ts`, `useAuth.ts`, `index.ts`, `ConfiguracionPage.tsx`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `jspdf` connect `router.tsx` to `Project Dependencies (package.json)`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Project Dependencies (package.json)` to `router.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `npx`, `$schema`, `typescript` to the rest of the system?**
  _409 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Bootstrap and Auth Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.10668563300142248 - nodes in this community are weakly interconnected._
- **Should `Siniestros Claims Domain` be split into smaller, more focused modules?**
  _Cohesion score 0.13846153846153847 - nodes in this community are weakly interconnected._
- **Should `Branding and Sidebar Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09881422924901186 - nodes in this community are weakly interconnected._