import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Logo } from '../../atoms/Logo'

export type UserRole = 'aseguradora' | 'taller' | 'administrador'

export interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

export interface SidebarProps {
  role: UserRole
}

const navItems: Record<UserRole, NavItem[]> = {
  aseguradora: [
    { label: 'Tablero General', path: '/aseguradora/dashboard', icon: <DashboardIcon /> },
    { label: 'Bandeja de Incidentes', path: '/aseguradora/incidentes', icon: <IncidentIcon /> },
    { label: 'Detalle y Asignación', path: '/aseguradora/incidentes/detalle', icon: <AssignIcon /> },
    { label: 'Gestión de Ajustadores', path: '/aseguradora/ajustadores', icon: <AdjusterIcon /> },
    { label: 'Gestión de Talleres', path: '/aseguradora/talleres', icon: <WorkshopIcon /> },
    { label: 'Configuración', path: '/aseguradora/configuracion', icon: <CogIcon /> },
  ],
  taller: [
    { label: 'Bandeja de Expedientes', path: '/taller/bandeja', icon: <TrayIcon /> },
    { label: 'Elaborar Presupuesto', path: '/taller/presupuesto', icon: <BudgetIcon /> },
    { label: 'Presupuesto Enviado', path: '/taller/presupuesto-enviado', icon: <SentIcon /> },
    { label: 'Histórico de Trabajos', path: '/taller/historico', icon: <HistoryIcon /> },
    { label: 'Configuración', path: '/taller/configuracion', icon: <CogIcon /> },
  ],
  administrador: [
    { label: 'Panel Global', path: '/administrador/dashboard', icon: <DashboardIcon /> },
    { label: 'Usuarios', path: '/administrador/usuarios', icon: <UsersIcon /> },
    { label: 'Aseguradoras', path: '/administrador/aseguradoras', icon: <ShieldIcon /> },
    { label: 'Talleres', path: '/administrador/talleres', icon: <WorkshopIcon /> },
    { label: 'Auditoría', path: '/administrador/auditoria', icon: <AuditIcon /> },
    { label: 'Configuración', path: '/administrador/configuracion', icon: <CogIcon /> },
  ],
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return <span className="w-5 h-5 shrink-0">{children}</span>
}

function DashboardIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </NavIcon>
  )
}

function IncidentIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </NavIcon>
  )
}

function AssignIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </NavIcon>
  )
}

function AdjusterIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </NavIcon>
  )
}

function WorkshopIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </NavIcon>
  )
}

function TrayIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </NavIcon>
  )
}

function BudgetIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 3-3" />
      </svg>
    </NavIcon>
  )
}

function SentIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    </NavIcon>
  )
}

function HistoryIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </NavIcon>
  )
}

function CogIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </NavIcon>
  )
}

function UsersIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </NavIcon>
  )
}

function ShieldIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    </NavIcon>
  )
}

function AuditIcon() {
  return (
    <NavIcon>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    </NavIcon>
  )
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

export function Sidebar({ role }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const items = navItems[role]
  const isAdmin = role === 'administrador'

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <Logo size="md" variant="full" className="[&_span]:text-white [&_span>span]:text-primary-300" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="lg:hidden p-1 text-neutral-400 hover:text-white transition-colors"
          aria-label="Cerrar menú"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex-1 flex flex-col px-3 py-2 gap-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? isAdmin
                    ? 'bg-admin-500/10 text-admin-500'
                    : 'bg-white/10 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5',
              ].join(' ')
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-[#000616] text-white rounded-lg shadow-lg"
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </button>

      <aside className="hidden lg:flex w-[256px] shrink-0 bg-[#000616] flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#000616] flex flex-col overflow-y-auto shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
