'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FolderKanban, 
  FileText, 
  LogOut, 
  ArrowRight, 
  Building2, 
  Calendar, 
  Users, 
  Video,
  MessageSquare,
  Calculator,
  Briefcase,
  Wallet,
  Search,
  X
} from 'lucide-react'
import { logout } from '@/app/auth/actions'

// Cliente de Supabase para el navegador
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

// Importamos los componentes de UI unificados
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createBrowserSupabaseClient()

  // 👇 SEGURIDAD CONTRA CACHÉ: Verificar sesión y escuchar cierre de sesión global
  useEffect(() => {
    async function checkUserSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login' // Forzar recarga limpia al login si no hay sesión
      }
    }

    checkUserSession()

    // Escuchar si la sesión se cerró o se presionó el botón de atrás con tipado explícito
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/auth/login'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const modules = [
    {
      id: 'proyectos',
      title: 'Proyectos',
      description: 'Gestión de obras, desarrollos y control de etapas en tiempo real.',
      href: '/proyectos',
      category: 'Principal',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      hoverBorder: 'hover:border-blue-500/50',
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      textColor: 'text-blue-400',
      icon: FolderKanban,
    },
    {
      id: 'chat',
      title: 'Chat Interno',
      description: 'Comunícate con el equipo, gestiona canales en vivo y comparte archivos.',
      href: '/chat',
      category: 'Tiempo real',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      hoverBorder: 'hover:border-blue-500/50',
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      textColor: 'text-blue-400',
      icon: MessageSquare,
    },
    {
      id: 'crm',
      title: 'CRM y Ventas',
      description: 'Gestión de prospectos, cartera de clientes y seguimiento comercial.',
      href: '/crm',
      category: 'Comercial',
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      hoverBorder: 'hover:border-indigo-500/50',
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      textColor: 'text-indigo-400',
      icon: Briefcase,
    },
    {
      id: 'reuniones',
      title: 'Reuniones',
      description: 'Acceso directo a videollamadas con clientes o enlaces de equipo.',
      href: '/reuniones',
      category: 'En línea',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/50',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      textColor: 'text-emerald-400',
      icon: Video,
    },
    {
      id: 'calendario',
      title: 'Calendario',
      description: 'Visualización semanal de entregas, vencimientos y reuniones.',
      href: '/calendario',
      category: 'Módulo',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      hoverBorder: 'hover:border-purple-500/50',
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      textColor: 'text-purple-400',
      icon: Calendar,
    },
    {
      id: 'equipo',
      title: 'Equipo',
      description: 'Estado operativo de los miembros y canales rápidos.',
      href: '/equipo',
      category: 'Colaboración',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/50',
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      textColor: 'text-amber-400',
      icon: Users,
    },
    {
      id: 'archivador',
      title: 'Archivador',
      description: 'Repositorio centralizado de presupuestos, planos y contratos.',
      href: '/archivador',
      category: 'Documentos',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-500/50',
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      textColor: 'text-cyan-400',
      icon: FileText,
    },
    {
      id: 'presupuestos',
      title: 'Presupuestos',
      description: 'Control financiero, estimación de costos, desglose de gastos y cotizaciones centralizadas.',
      href: '/presupuestos',
      category: 'Finanzas',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/50',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      textColor: 'text-emerald-400',
      icon: Calculator,
    },
    {
      id: 'finanzas',
      title: 'Finanzas',
      description: 'Consolidado general de ingresos, egresos y balance del flujo de caja en tiempo real.',
      href: '/finanzas',
      category: 'Finanzas',
      badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      hoverBorder: 'hover:border-sky-500/50',
      iconColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      textColor: 'text-sky-400',
      icon: Wallet,
    },
  ]

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageContainer>
      {/* Cabecera unificada con el botón de salida inyectado en actions */}
      <PageHeader 
        icon={Building2}
        title="Offibox Workspace"
        description="Centro operativo y de gestión integral"
        actions={
          <form action={logout}>
            <button 
              type="submit" 
              title="Cerrar sesión"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition cursor-pointer text-sm font-medium shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </form>
        }
      />

      {/* --- Barra de Búsqueda Dinámica --- */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800/80 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sección o módulo (ej. Proyectos, Finanzas, CRM)..."
            className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Contador adaptativo */}
        <div className="text-xs text-neutral-400 font-medium px-2 text-left sm:text-right">
          Mostrando <span className="text-white font-bold">{filteredModules.length}</span> de {modules.length} módulos
        </div>
      </div>

      {/* --- Grid de Módulos --- */}
      {filteredModules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredModules.map((mod) => {
            const IconComponent = mod.icon
            return (
              <Link 
                key={mod.id}
                href={mod.href}
                className={`group relative bg-neutral-900/80 border border-neutral-800/80 ${mod.hoverBorder} rounded-2xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col justify-between cursor-pointer`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 shrink-0 ${mod.iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className={`font-bold text-white group-hover:${mod.textColor} transition-colors text-base`}>
                        {mod.title}
                      </h3>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${mod.badgeBg} shrink-0`}>
                      {mod.category}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-medium text-neutral-300 group-hover:text-white transition-colors">
                  <span className={mod.textColor}>Acceder al área</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${mod.textColor}`} />
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-12 text-center space-y-4 backdrop-blur-xl shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400 border border-neutral-700/50">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">No se encontraron resultados</h3>
            <p className="text-xs text-neutral-400">
              Ningún módulo coincide con &quot;<span className="text-white">{searchQuery}</span>&quot;.
            </p>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg shadow-blue-600/20"
          >
            Ver todos los módulos
          </button>
        </div>
      )}
    </PageContainer>
  )
}