# Graph Report - .  (2026-07-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 630 nodes · 1348 edges · 26 communities (22 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e9be05d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Siniestros y Ordenes Domain
- Authentication and Routing
- Aseguradoras Admin Management
- Talleres Management Forms
- Project Dependencies (package.json)
- UI Design System Components
- Ajustadores and Clientes Management
- Toast Notifications and App Bootstrap
- Auditoria and Action Badges
- Admin Dashboard and API Client
- Data Table and Pagination UI
- Usuarios Admin Management
- TypeScript App Config
- Sidebar Navigation and Icons
- Cotizaciones and Presupuestos
- TypeScript Node Config
- Vehiculos Management
- Taller Profile Settings
- Oxlint Configuration
- Icon Sprite Sheet
- TypeScript Root Config
- Favicon Asset
- Hero Illustration Asset
- Vite Logo Asset

## God Nodes (most connected - your core abstractions)
1. `react` - 41 edges
2. `StatusVariant` - 20 edges
3. `useToast()` - 20 edges
4. `compilerOptions` - 17 edges
5. `api` - 16 edges
6. `compilerOptions` - 15 edges
7. `SearchInput()` - 11 edges
8. `useAuth()` - 11 edges
9. `Input()` - 10 edges
10. `Label()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Presupuesto` --references--> `StatusVariant`  [EXTRACTED]
  src/api/taller/cotizaciones/cotizaciones.schemas.ts → src/api/shared/status.ts
- `Ajustador` --references--> `StatusVariant`  [EXTRACTED]
  src/api/aseguradora/ajustadores/ajustadores.schemas.ts → src/api/shared/status.ts
- `Taller` --references--> `StatusVariant`  [EXTRACTED]
  src/api/aseguradora/talleres/talleres.schemas.ts → src/api/shared/status.ts
- `AseguradoraData` --references--> `PlanTier`  [EXTRACTED]
  src/pages/administrador/AseguradorasPage.tsx → src/components/organisms/InsurerCard/InsurerCard.tsx
- `GestionUsuariosPage()` --calls--> `useToast()`  [EXTRACTED]
  src/pages/administrador/GestionUsuariosPage.tsx → src/contexts/Toast/useToast.ts

## Import Cycles
- None detected.

## Communities (26 total, 4 thin omitted)

### Community 0 - "Siniestros y Ordenes Domain"
Cohesion: 0.06
Nodes (60): aprobarCotizacion(), assignAjustador(), assignTaller(), autorizarEntrega(), delay(), getAll(), getById(), mockIncidentes (+52 more)

### Community 1 - "Authentication and Routing"
Cohesion: 0.08
Nodes (30): delay(), getCurrentUser(), login(), LoginResult, logout(), ROLE_MAP, LoginRequest, LoginResponseDTO (+22 more)

### Community 2 - "Aseguradoras Admin Management"
Cohesion: 0.07
Nodes (35): aseguradoraAdminBackendToFrontend(), aseguradoraAdminToCreateDTO(), cambiarSuscripcion(), create(), delay(), getAll(), getById(), mockData (+27 more)

### Community 3 - "Talleres Management Forms"
Cohesion: 0.10
Nodes (30): create(), createOperador(), delay(), getAll(), mockData, remove(), tallerBackendToFrontend(), update() (+22 more)

### Community 4 - "Project Dependencies (package.json)"
Cohesion: 0.05
Nodes (41): autoprefixer, oxlint, dependencies, react, react-dom, react-router-dom, recharts, @tailwindcss/vite (+33 more)

### Community 5 - "UI Design System Components"
Cohesion: 0.09
Nodes (23): Button(), ButtonProps, ButtonSize, ButtonVariant, sizeClasses, variantClasses, ErrorMessage(), ErrorMessageProps (+15 more)

### Community 6 - "Ajustadores and Clientes Management"
Cohesion: 0.11
Nodes (28): ajustadorBackendToFrontend(), create(), getAll(), remove(), update(), Ajustador, AjustadorCreateDTO, AjustadorResponseDTO (+20 more)

### Community 7 - "Toast Notifications and App Bootstrap"
Cohesion: 0.12
Nodes (23): react, getPerfil(), perfilBackendToFrontend(), updatePerfil(), PerfilAseguradora, PerfilAseguradoraDTO, PerfilAseguradoraUpdateDTO, App() (+15 more)

### Community 8 - "Auditoria and Action Badges"
Cohesion: 0.12
Nodes (25): classifyAccion(), delay(), eventoAuditoriaBackendToFrontend(), getAll(), mockData, AuditResponse, EventoAuditoria, ActionBadge() (+17 more)

### Community 9 - "Admin Dashboard and API Client"
Cohesion: 0.12
Nodes (19): getResumen(), DashboardResumenDTO, EstatusCountDTO, SiniestrosPorMesDTO, getAll(), getById(), tallerAdminBackendToFrontend(), TallerAdmin (+11 more)

### Community 10 - "Data Table and Pagination UI"
Cohesion: 0.11
Nodes (16): Pagination(), PaginationProps, SearchInput(), SearchInputProps, Column, DataTable(), DataTableProps, SortDir (+8 more)

### Community 11 - "Usuarios Admin Management"
Cohesion: 0.15
Nodes (20): bloqueoArco(), create(), getAll(), ListarUsuariosFiltros, remove(), update(), usuarioBackendToFrontend(), CreateUsuarioRequestDTO (+12 more)

### Community 12 - "TypeScript App Config"
Cohesion: 0.09
Nodes (22): DOM, src, vite/client, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib (+14 more)

### Community 13 - "Sidebar Navigation and Icons"
Cohesion: 0.10
Nodes (4): NavItem, navItems, Sidebar(), SidebarProps

### Community 14 - "Cotizaciones and Presupuestos"
Cohesion: 0.16
Nodes (12): MessageResponseDTO, create(), CreatePresupuestoData, delay(), CrearCotizacionRequest, EditarCotizacionRequest, Part, Presupuesto (+4 more)

### Community 15 - "TypeScript Node Config"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 16 - "Vehiculos Management"
Cohesion: 0.19
Nodes (12): create(), getByCliente(), store, Vehiculo, VehiculoCreateInput, VehiculoCard(), VehiculoCardProps, VehiculoForm() (+4 more)

### Community 17 - "Taller Profile Settings"
Cohesion: 0.27
Nodes (11): getPerfil(), perfilBackendToFrontend(), updatePerfil(), TallerPerfil, TallerPerfilResponseDTO, TallerPerfilUpdateRequestDTO, ConfiguracionPage(), defaultConfig (+3 more)

### Community 18 - "Oxlint Configuration"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 19 - "Icon Sprite Sheet"
Cohesion: 0.29
Nodes (7): icons.svg (icon sprite sheet), Bluesky icon (butterfly logo), Discord icon (game controller/mask logo), Documentation icon (document with chat/edit arrows), GitHub icon (Octocat logo), Social icon (person with settings gear), X (Twitter) icon

## Knowledge Gaps
- **148 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Toast Notifications and App Bootstrap` to `Siniestros y Ordenes Domain`, `Authentication and Routing`, `Aseguradoras Admin Management`, `Talleres Management Forms`, `UI Design System Components`, `Ajustadores and Clientes Management`, `Auditoria and Action Badges`, `Admin Dashboard and API Client`, `Data Table and Pagination UI`, `Usuarios Admin Management`, `Sidebar Navigation and Icons`, `Cotizaciones and Presupuestos`, `Vehiculos Management`, `Taller Profile Settings`, `Oxlint Configuration`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `api` connect `Admin Dashboard and API Client` to `Siniestros y Ordenes Domain`, `Authentication and Routing`, `Aseguradoras Admin Management`, `Talleres Management Forms`, `Ajustadores and Clientes Management`, `Toast Notifications and App Bootstrap`, `Auditoria and Action Badges`, `Usuarios Admin Management`, `Cotizaciones and Presupuestos`, `Taller Profile Settings`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `plugins` connect `Oxlint Configuration` to `Toast Notifications and App Bootstrap`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Siniestros y Ordenes Domain` be split into smaller, more focused modules?**
  _Cohesion score 0.05719298245614035 - nodes in this community are weakly interconnected._
- **Should `Authentication and Routing` be split into smaller, more focused modules?**
  _Cohesion score 0.08326530612244898 - nodes in this community are weakly interconnected._
- **Should `Aseguradoras Admin Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07400555041628122 - nodes in this community are weakly interconnected._