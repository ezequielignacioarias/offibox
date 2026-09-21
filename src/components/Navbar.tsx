'use client'

import {
  Search,
  Command,
  PanelLeftOpen,
  Settings,
  LogOut,
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  FileText,
  Video,
  MessageSquare,
  Calculator,
  Briefcase,
  Wallet,
  Loader2,
} from 'lucide-react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTransition } from 'react'

import { logout } from '@/app/auth/actions'

interface NavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function Navbar({
  isSidebarOpen,
  onToggleSidebar,
}: NavbarProps) {
  const pathname = usePathname()

  const [isPending, startTransition] = useTransition()

  const navItems = [
    { name: 'Inicio', href: '/inicio', icon: LayoutDashboard },
    { name: 'Proyectos', href: '/proyectos', icon: FolderKanban },
    { name: 'Reuniones', href: '/reuniones', icon: Video },
    { name: 'Calendario', href: '/calendario', icon: Calendar },
    { name: 'Equipo', href: '/equipo', icon: Users },
    { name: 'Chat', href: '/chat', icon: MessageSquare },
    { name: 'Presupuestos', href: '/presupuestos', icon: Calculator },
    { name: 'Finanzas', href: '/finanzas', icon: Wallet },
    { name: 'CRM', href: '/crm', icon: Briefcase },
    { name: 'Archivador', href: '/archivador', icon: FileText },
  ]

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
    )
  }

  const handleLogout = () => {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between gap-3 transition-all duration-300 ${
        isSidebarOpen ? 'left-64' : 'left-0'
      }`}
    >
      {/* Izquierda */}
      <div className="flex items-center gap-3 shrink-0">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            type="button"
            title="Mostrar menú lateral"
            className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 hover:text-white transition cursor-pointer shadow-sm flex items-center gap-1.5 text-xs font-medium"
          >
            <PanelLeftOpen className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">
              Menú
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-blue-600/30 md:hidden">
            O
          </div>

          <span className="font-bold text-sm tracking-wide text-white md:hidden">
            Offibox
          </span>
        </div>
      </div>

      {/* Centro */}
      {!isSidebarOpen ? (
        <nav className="flex-1 min-w-0 flex items-center justify-center gap-1.5 overflow-x-auto py-1 scrollbar-none px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`px-3 py-2 rounded-xl transition shrink-0 flex items-center gap-2 text-xs font-semibold ${
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

                {isActive && (
                  <span className="inline">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      ) : (
        <div className="flex-1 max-w-sm mx-auto hidden sm:block" />
      )}

      {/* Derecha */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Buscador */}
        <button
          onClick={openCommandPalette}
          type="button"
          title="Buscar o comandos (Ctrl + K)"
          className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition text-xs cursor-pointer shadow-inner flex items-center gap-1.5"
        >
          <Search className="w-4 h-4 text-neutral-400" />

          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1 py-0.5 text-[10px] font-semibold text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-md">
            <Command className="w-3 h-3" />
            K
          </kbd>
        </button>

        {/* Configuración */}
        <Link
          href="/settings"
          title="Configuración de cuenta"
          className={`p-2 rounded-xl bg-neutral-950 border transition text-xs cursor-pointer ${
            pathname === '/settings'
              ? 'border-blue-500/50 text-blue-400 bg-blue-600/10'
              : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
          }`}
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Cerrar sesión */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          title="Cerrar sesión"
          className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  )
}