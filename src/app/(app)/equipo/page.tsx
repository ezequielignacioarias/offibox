import { createServerClient } from '@supabase/ssr' // o tu import habitual de createClient
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, ArrowLeft, Circle, MessageSquare, Send, Briefcase } from 'lucide-react'

// Importamos los componentes de UI unificados
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login') // 👈 Corregido: apunta correctamente a /auth/login

  return (
    <PageContainer>
      <PageHeader 
        icon={Users}
        title="Equipo y Presencia"
        description="Estado operativo de los colaboradores y canales de sincronización"
        iconTheme="text-amber-300 bg-amber-500/20 border-amber-500/40"
        actions={
          <div className="flex items-center gap-3">
            <Link 
              href="/inicio"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-medium text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>2 Colaboradores activos</span>
            </div>
          </div>
        }
      />

      {/* --- Contenido Principal (Grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Miembros del Equipo (Ocupa 2 columnas) */}
        <div className="md:col-span-2 bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Miembros de la Oficina</h3>
            <p className="text-sm text-neutral-400 mb-6">
              Monitorea el rol actual y la actividad en tiempo real de cada integrante.
            </p>

            {/* Lista de Miembros */}
            <div className="space-y-3">
              
              {/* Usuario 1 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border border-blue-400/30 flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0">
                    U1
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">Vos (Administrador)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium shrink-0">Principal</span>
                    </div>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3 h-3 text-neutral-500 shrink-0" /> 
                      <span className="truncate">Gestionando proyectos e infraestructura de red</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0 self-end sm:self-auto">
                  <Circle className="w-2 h-2 fill-current" />
                  <span>Conectado</span>
                </div>
              </div>

              {/* Usuario 2 */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full bg-purple-600 border border-purple-400/30 flex items-center justify-center font-bold text-sm text-white shadow-inner shrink-0">
                    U2
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">Carlos (Colaborador Técnico)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium shrink-0">Soporte</span>
                    </div>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <Briefcase className="w-3 h-3 text-neutral-500 shrink-0" /> 
                      <span className="truncate">Revisando planos y conexiones físicas</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0 self-end sm:self-auto">
                  <Circle className="w-2 h-2 fill-current" />
                  <span>Conectado</span>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
            <span>Sincronización en tiempo real vía Offibox Core</span>
            <span className="text-neutral-400">Seguridad activa</span>
          </div>
        </div>

        {/* Columna Derecha: Tablón de Anuncios / Chat Rápido */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Avisos del Día</h3>
            </div>
            <p className="text-xs text-neutral-400">
              Deja notas rápidas o directrices para el equipo sin salir del espacio de trabajo.
            </p>

            {/* Caja de mensaje simulada */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-semibold text-neutral-300">Vos</span>
                <span>Hace 10 min</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Recordar revisar los planos de obra antes de la reunión de la tarde.
              </p>
            </div>

            {/* Input para nuevo aviso */}
            <div className="relative pt-2">
              <input 
                type="text" 
                placeholder="Escribir aviso rápido..." 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition pr-10"
              />
              <button 
                type="button"
                className="absolute right-2.5 bottom-2.5 p-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition cursor-pointer"
                title="Enviar aviso"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 text-center">
            Canal interno cifrado
          </div>
        </div>

      </div>
    </PageContainer>
  )
}