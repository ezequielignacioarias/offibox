import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar as CalendarIcon, ArrowLeft, AlertCircle } from 'lucide-react'

// Componentes de UI y Acciones
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'
import NewMilestoneModal from '@/components/calendario/NewMilestoneModal'
import MilestoneTimeline from '@/components/calendario/MilestoneTimeline'
import { deleteMilestoneAction, createMilestoneAction, updateMilestoneAction } from './actions'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login') // 👈 Corregido: apunta correctamente a /auth/login

  // Consultar hitos reales del usuario autenticado
  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('user_id', user.id)
    .order('event_date', { ascending: true })

  return (
    <PageContainer>
      <PageHeader 
        icon={CalendarIcon}
        title="Calendario"
        description="Cronograma general de entregas, proyectos y compromisos clave"
        iconTheme="text-purple-400 bg-purple-500/10 border-purple-500/20"
        actions={
          <div className="flex items-center gap-3">
            <Link 
              href="/inicio"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            
            {/* Modal dinámico para crear nuevos hitos o eventos */}
            <NewMilestoneModal createMilestoneAction={createMilestoneAction} />
          </div>
        }
      />

      {/* --- Contenido Principal (Grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Cronograma con Filtros y Edición Integrados */}
        <MilestoneTimeline 
          milestones={milestones || []}
          deleteMilestoneAction={deleteMilestoneAction}
          updateMilestoneAction={updateMilestoneAction}
        />

        {/* Columna Derecha: Notas de Agenda / Recordatorios */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Notas de Agenda</h3>
            </div>
            <p className="text-xs text-neutral-400">
              Avisos rápidos sobre entregas críticas, seguimientos o cierres.
            </p>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Prioridad Alta
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Revisar propuestas comerciales pendientes antes del cierre semanal.
              </p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Operativa
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Mantener actualizados los estados de los proyectos en curso para evitar cuellos de botella.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 text-center">
            Espacio de trabajo modular Offibox
          </div>
        </div>

      </div>
    </PageContainer>
  )
}