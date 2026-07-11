import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/shared/LoginPage'
import { NotFoundPage } from './pages/shared/NotFoundPage'
import { AppLayout } from './components/templates/AppLayout'
import { AuthGuard, GuestGuard } from './components/organisms/AuthGuard'
import { BandejaExpedientesPage } from './pages/taller/BandejaExpedientesPage'
import { ElaboracionPresupuestoPage } from './pages/taller/ElaboracionPresupuestoPage'

import { HistoricoTrabajosPage } from './pages/taller/HistoricoTrabajosPage'
import { DetalleHistoricoPage } from './pages/taller/DetalleHistoricoPage'
import { ConfiguracionPage as TallerConfig } from './pages/taller/ConfiguracionPage'
import { TableroGeneralPage } from './pages/aseguradora/TableroGeneralPage'
import { BandejaIncidentesPage } from './pages/aseguradora/BandejaIncidentesPage'
import { DetalleIncidentePage } from './pages/aseguradora/DetalleIncidentePage'
import { GestionAjustadoresPage } from './pages/aseguradora/GestionAjustadoresPage'
import { GestionTalleresPage } from './pages/aseguradora/GestionTalleresPage'
import { GestionClientesPage } from './pages/aseguradora/GestionClientesPage'
import { GestionVehiculosPage } from './pages/aseguradora/GestionVehiculosPage'
import { ConfiguracionPage as AseguradoraConfig } from './pages/aseguradora/ConfiguracionPage'
import { PanelGlobalPage } from './pages/administrador/PanelGlobalPage'
import { GestionUsuariosPage } from './pages/administrador/GestionUsuariosPage'
import { AseguradorasPage } from './pages/administrador/AseguradorasPage'
import { GestionTalleresAdminPage } from './pages/administrador/GestionTalleresAdminPage'
import { AuditoriaSistemaPage } from './pages/administrador/AuditoriaSistemaPage'
import { ConfiguracionPage as AdminConfig } from './pages/administrador/ConfiguracionPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  {
    element: <GuestGuard />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <AuthGuard requiredRole="aseguradora" />,
    children: [
      {
        path: '/aseguradora',
        element: <AppLayout role="aseguradora" />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <TableroGeneralPage /> },
          { path: 'incidentes', element: <BandejaIncidentesPage /> },
          { path: 'incidentes/detalle', element: <DetalleIncidentePage /> },
          { path: 'ajustadores', element: <GestionAjustadoresPage /> },
          { path: 'talleres', element: <GestionTalleresPage /> },
          { path: 'clientes', element: <GestionClientesPage /> },
          { path: 'vehiculos', element: <GestionVehiculosPage /> },
          { path: 'configuracion', element: <AseguradoraConfig /> },
        ],
      },
    ],
  },

  {
    element: <AuthGuard requiredRole="taller" />,
    children: [
      {
        path: '/taller',
        element: <AppLayout role="taller" />,
        children: [
          { index: true, element: <Navigate to="bandeja" replace /> },
          { path: 'bandeja', element: <BandejaExpedientesPage /> },
          { path: 'presupuesto', element: <ElaboracionPresupuestoPage /> },
          { path: 'presupuesto/:id', element: <ElaboracionPresupuestoPage /> },
          { path: 'presupuesto-enviado', element: <BandejaExpedientesPage /> },

          { path: 'historico', element: <HistoricoTrabajosPage /> },
          { path: 'historico/:id', element: <DetalleHistoricoPage /> },
          { path: 'configuracion', element: <TallerConfig /> },
        ],
      },
    ],
  },

  {
    element: <AuthGuard requiredRole="administrador" />,
    children: [
      {
        path: '/administrador',
        element: <AppLayout role="administrador" />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <PanelGlobalPage /> },
          { path: 'usuarios', element: <GestionUsuariosPage /> },
          { path: 'aseguradoras', element: <AseguradorasPage /> },
          { path: 'talleres', element: <GestionTalleresAdminPage /> },
          { path: 'auditoria', element: <AuditoriaSistemaPage /> },
          { path: 'configuracion', element: <AdminConfig /> },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])
