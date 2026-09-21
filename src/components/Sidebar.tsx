'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'

import { logout } from '@/app/auth/actions'

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  FileText,
  Video,
  LogOut,
  MessageSquare,
  Calculator,
  Briefcase,
  Wallet,
  Settings,
  PanelLeftClose,
  Loader2,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function Sidebar({
  isOpen,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname()

  const [isPending, startTransition] = useTransition()

  const navItems = [
    {
      name: 'Inicio',
      href: '/inicio',
      icon: LayoutDashboard,
    },
    {
      name: 'Proyectos',
      href: '/proyectos',
      icon: FolderKanban,
    },
    {
      name: 'Reuniones',
      href: '/reuniones',
      icon: Video,
    },
    {
      name: 'Calendario',
      href: '/calendario',
      icon: Calendar,
    },
    {
      name: 'Equipo',
      href: '/equipo',
      icon: Users,
    },
    {
      name: 'Chat Interno',
      href: '/chat',
      icon: MessageSquare,
    },
    {
      name: 'Presupuestos',
      href: '/presupuestos',
      icon: Calculator,
    },
    {
      name: 'Finanzas',
      href: '/finanzas',
      icon: Wallet,
    },
    {
      name: 'CRM y Ventas',
      href: '/crm',
      icon: Briefcase,
    },
    {
      name: 'Archivador',
      href: '/archivador',
      icon: FileText,
    },
  ]

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-neutral-900/90 border-r border-neutral-800 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen
          ? 'translate-x-0'
          : '-translate-x-full'
      }`}
    >
      {/* Cabecera */}
      <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">
            O
          </div>

          <div>
            <h2 className="font-bold text-sm tracking-wide text-white">
              Offibox
            </h2>

            <p className="text-[10px] text-neutral-400 font-medium">
              Virtual Workspace
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          type="button"
          title="Ocultar menú"
          className="p-1.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-neutral-500'
                }`}
              />

              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Pie */}
      <div className="p-4 border-t border-neutral-800/80 space-y-1">
        {/* Configuración */}
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
            pathname === '/settings'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent'
          }`}
        >
          <Settings
            className={`w-4 h-4 ${
              pathname === '/settings'
                ? 'text-blue-400'
                : 'text-neutral-500'
            }`}
          />

          <span>Configuración</span>
        </Link>

        {/* Cerrar sesión */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
          ) : (
            <LogOut className="w-4 h-4 text-neutral-500" />
          )}

          <span>
            {isPending
              ? 'Cerrando sesión...'
              : 'Cerrar sesión'}
          </span>
        </button>
      </div>
    </aside>
  )
}