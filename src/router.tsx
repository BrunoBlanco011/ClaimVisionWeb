import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/shared/LoginPage'
import { LoginTallerPage } from './pages/taller/LoginTallerPage'
import { LoginAseguradoraPage } from './pages/aseguradora/LoginAseguradoraPage'
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
import { ConfiguracionPage as AseguradoraConfig } from './pages/aseguradora/ConfiguracionPage'

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
      {
        path: '/login/taller',
        element: <LoginTallerPage />,
      },
      {
        path: '/login/aseguradora',
        element: <LoginAseguradoraPage />,
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

          { path: 'historico', element: <HistoricoTrabajosPage /> },
          { path: 'historico/:id', element: <DetalleHistoricoPage /> },
          { path: 'configuracion', element: <TallerConfig /> },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFoundPage />,
  },
])
