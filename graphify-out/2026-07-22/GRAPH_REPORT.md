# Graph Report - .  (2026-07-11)

## Corpus Check
- 158 files · ~34,270 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 802 nodes · 1623 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 44 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `react` - 41 edges
2. `Plan de Conexión de Endpoints Faltantes — ClaimVision Web` - 34 edges
3. `StatusVariant` - 20 edges
4. `useToast()` - 20 edges
5. `src/services/admin.service.ts` - 20 edges
6. `compilerOptions` - 17 edges
7. `api` - 16 edges
8. `compilerOptions` - 15 edges
9. `Hallazgo crítico #1: falta prefijo /v1 en todas las llamadas del frontend` - 12 edges
10. `SearchInput()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Plan de Conexión de Endpoints Faltantes — ClaimVision Web` --references--> `Plan de Conexión del Módulo Administrador`  [EXTRACTED]
  PLAN_CONEXION_ENDPOINTS_FALTANTES.md → PLAN_CONEXION_ADMIN.md
- `Hallazgo crítico #2: CRUD de Aseguradora vive bajo /aseguradora/crud, no /aseguradora` --references--> `Endpoints.md`  [EXTRACTED]
  PLAN_CONEXION_ENDPOINTS_FALTANTES.md → PLAN_CONEXION_ADMIN.md
- `Roles Cliente y Ajustador fuera de alcance para el frontend web` --references--> `Endpoints.md`  [EXTRACTED]
  PLAN_CONEXION_ENDPOINTS_FALTANTES.md → PLAN_CONEXION_ADMIN.md
- `Plan de Conexión de Endpoints Faltantes — ClaimVision Web` --references--> `Endpoints.md`  [EXTRACTED]
  PLAN_CONEXION_ENDPOINTS_FALTANTES.md → PLAN_CONEXION_ADMIN.md
- `Ajustador` --references--> `StatusVariant`  [EXTRACTED]
  src/api/aseguradora/ajustadores/ajustadores.schemas.ts → src/api/shared/status.ts

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "App Bootstrap and Auth Routes"
Cohesion: 0.05
Nodes (46): react, delay(), getCurrentUser(), login(), LoginResult, ROLE_MAP, LoginRequest, LoginResponseDTO (+38 more)

### Community 1 - "Siniestros Claims Domain"
Cohesion: 0.06
Nodes (56): aprobarCotizacion(), assignAjustador(), assignTaller(), autorizarEntrega(), getById(), mockIncidentes, rechazarCotizacion(), siniestroDetalleBackendToFrontend() (+48 more)

### Community 2 - "Admin Dashboard and Perfil"
Cohesion: 0.07
Nodes (36): getResumen(), DashboardResumenDTO, EstatusCountDTO, SiniestrosPorMesDTO, getAll(), getById(), tallerAdminBackendToFrontend(), TallerAdmin (+28 more)

### Community 3 - "Branding and Sidebar Components"
Cohesion: 0.07
Nodes (17): logout(), iconSizes, Logo(), LogoProps, LogoSize, LogoVariant, BrandPanel(), BrandPanelProps (+9 more)

### Community 4 - "Form Input Atoms"
Cohesion: 0.09
Nodes (23): ErrorMessage(), ErrorMessageProps, Input(), InputProps, Label(), LabelProps, AjustadorForm(), AjustadorFormData (+15 more)

### Community 5 - "Aseguradoras Admin API"
Cohesion: 0.08
Nodes (33): aseguradoraAdminBackendToFrontend(), aseguradoraAdminToCreateDTO(), cambiarSuscripcion(), create(), delay(), getAll(), getById(), mockData (+25 more)

### Community 6 - "Project Dependencies (package.json)"
Cohesion: 0.05
Nodes (41): autoprefixer, oxlint, dependencies, react, react-dom, react-router-dom, recharts, @tailwindcss/vite (+33 more)

### Community 7 - "Talleres API (Aseguradora)"
Cohesion: 0.09
Nodes (29): create(), createOperador(), delay(), getAll(), mockData, remove(), tallerBackendToFrontend(), update() (+21 more)

### Community 8 - "DTOs and Conexion Plan Phases"
Cohesion: 0.09
Nodes (40): aseguradoraFormToCreateDTO(), AseguradoraRequestDTO, AseguradoraResponseDTO, aseguradoraResponseToFrontend(), AuditResponseDTO, auditResponseToFrontend(), DashboardResumenDTO, OperadorAseguradoraRequestDTO (+32 more)

### Community 9 - "Frontend Services and Backend Plan"
Cohesion: 0.10
Nodes (39): src/services/admin/aseguradoras.service.ts, src/services/admin/auditoria.service.ts, src/services/admin/usuarios.service.ts, components/molecules/AjustadorForm/AjustadorForm.tsx, src/services/ajustadores.service.ts, src/services/auth.service.ts, ClaimVisionBack src/modules/admin/presentation/schemas.py (clase PaginatedResponse, no usada), ClaimVisionBack admin_v1_routes.py (+31 more)

### Community 10 - "CLAUDE.md Project Guidance"
Cohesion: 0.08
Nodes (37): App.tsx, Atomic Design Architecture, atoms/ Components, authStub, AuthLayout, Button, npm Scripts / Commands, ErrorMessage (+29 more)

### Community 11 - "Cotizaciones and Taller Perfil API"
Cohesion: 0.10
Nodes (23): MessageResponseDTO, create(), CreatePresupuestoData, delay(), CrearCotizacionRequest, EditarCotizacionRequest, Part, VehicleData (+15 more)

### Community 12 - "Auditoria API and Action Badges"
Cohesion: 0.12
Nodes (25): classifyAccion(), delay(), eventoAuditoriaBackendToFrontend(), getAll(), mockData, AuditResponse, EventoAuditoria, ActionBadge() (+17 more)

### Community 13 - "Clientes and Vehiculos API"
Cohesion: 0.14
Nodes (19): clienteBackendToFrontend(), create(), getAll(), getById(), Cliente, ClienteCreateDTO, ClienteResponseDTO, create() (+11 more)

### Community 14 - "Usuarios Admin API"
Cohesion: 0.13
Nodes (22): bloqueoArco(), create(), getAll(), ListarUsuariosFiltros, remove(), update(), usuarioBackendToFrontend(), CreateUsuarioRequestDTO (+14 more)

### Community 15 - "Estado Conexion Admin Doc"
Cohesion: 0.09
Nodes (24): Estado de Conexión — Módulo Administrador, AseguradoraResponseDTO, GET /api/admin/aseguradoras, POST /api/admin/aseguradoras, PUT /api/admin/aseguradoras/{id}/suscripcion, POST /api/admin/aseguradoras/{id}/verificar, AseguradorasPage, GET /api/admin/auditoria/logs (+16 more)

### Community 16 - "TypeScript App Config"
Cohesion: 0.09
Nodes (22): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib (+14 more)

### Community 17 - "Ajustadores API"
Cohesion: 0.17
Nodes (19): ajustadorBackendToFrontend(), create(), getAll(), remove(), update(), Ajustador, AjustadorCreateDTO, AjustadorResponseDTO (+11 more)

### Community 18 - "TypeScript Node Config"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 19 - "Endpoints.md API Reference"
Cohesion: 0.21
Nodes (17): ClaimVision API — Endpoints, Admin endpoint group (/api/v1/admin), Ajustador endpoint group (/api/v1/ajustador), Bloqueo/Desbloqueo ARCO (LFPDPPP rights) domain concept, Aseguradora — CRUD endpoint group (/api/v1/aseguradora), Aseguradora — Siniestros endpoint group (/api/v1/aseguradora), Auditoría de logs domain concept, Auth endpoint group (/api/v1/auth) (+9 more)

### Community 20 - "README Tooling Notes"
Cohesion: 0.21
Nodes (13): README.md (React + TypeScript + Vite), Oxc, Oxlint, Oxlint Rules Documentation, oxlint-tsgolint, .oxlintrc.json, React, React Compiler (+5 more)

### Community 21 - "Oxlint Configuration"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 22 - "Icon Sprite Sheet"
Cohesion: 0.29
Nodes (7): icons.svg (icon sprite sheet), Bluesky icon (butterfly logo), Discord icon (game controller/mask logo), Documentation icon (document with chat/edit arrows), GitHub icon (Octocat logo), Social icon (person with settings gear), X (Twitter) icon

## Ambiguous Edges - Review These
- `src/services/talleres.service.ts` → `GestionTalleresAdminPage.tsx`  [AMBIGUOUS]
  PLAN_CONEXION_ADMIN.md · relation: conceptually_related_to

## Knowledge Gaps
- **183 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+178 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `src/services/talleres.service.ts` and `GestionTalleresAdminPage.tsx`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `react` connect `App Bootstrap and Auth Routes` to `Siniestros Claims Domain`, `Admin Dashboard and Perfil`, `Branding and Sidebar Components`, `Form Input Atoms`, `Aseguradoras Admin API`, `Talleres API (Aseguradora)`, `Cotizaciones and Taller Perfil API`, `Auditoria API and Action Badges`, `Clientes and Vehiculos API`, `Usuarios Admin API`, `Ajustadores API`, `Oxlint Configuration`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Why does `src/services/presupuestos.service.ts` connect `DTOs and Conexion Plan Phases` to `Cotizaciones and Taller Perfil API`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `Fase 0: Correcciones a conexiones existentes` connect `DTOs and Conexion Plan Phases` to `Frontend Services and Backend Plan`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _183 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Bootstrap and Auth Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.0547945205479452 - nodes in this community are weakly interconnected._
- **Should `Siniestros Claims Domain` be split into smaller, more focused modules?**
  _Cohesion score 0.06377151799687011 - nodes in this community are weakly interconnected._