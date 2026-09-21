'use client'

import { useState } from 'react'
import { CalendarDays, Clock, Briefcase } from 'lucide-react'
import EditMilestoneModal from './EditMilestoneModal'
import DeleteMilestoneModal from './DeleteMilestoneModal'

interface Milestone {
  id: string
  title: string
  category: string
  priority: string
  status: string
  event_date: string
  description?: string
}

interface MilestoneTimelineProps {
  milestones?: Milestone[]
  deleteMilestoneAction: (formData: FormData) => Promise<void>
  updateMilestoneAction: (formData: FormData) => Promise<void>
}

export default function MilestoneTimeline({
  milestones = [],
  deleteMilestoneAction,
  updateMilestoneAction,
}: MilestoneTimelineProps) {
  const [filter, setFilter] = useState('todos')

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'en curso':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'pendiente':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'programado':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700'
    }
  }

  const safeMilestones = Array.isArray(milestones) ? milestones : []

  const filteredMilestones = safeMilestones.filter((m) => {
    if (filter === 'todos') return true
    return m.status?.toLowerCase() === filter.toLowerCase()
  })

  return (
    <div className="md:col-span-2 bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-400" />
            <span>Cronograma de Actividades</span>
          </h3>

          {/* Pestañas de Filtros */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs overflow-x-auto">
            {['todos', 'pendiente', 'en curso', 'programado'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer capitalize whitespace-nowrap ${
                  filter === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-neutral-400 font-medium px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800">
            {filteredMilestones.length} {filteredMilestones.length === 1 ? 'activo' : 'activos'}
          </span>
        </div>

        {filteredMilestones && filteredMilestones.length > 0 ? (
          <div className="space-y-3">
            {filteredMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-start justify-between bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{milestone.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                        {milestone.category}
                      </span>
                    </div>
                    {milestone.description && (
                      <p className="text-xs text-neutral-400 mt-1">{milestone.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1 text-neutral-300 font-medium">
                        📅 {new Date(milestone.event_date).toLocaleString()}
                      </span>
                      {milestone.priority && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> Prioridad: {milestone.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusBadge(
                      milestone.status
                    )}`}
                  >
                    {milestone.status}
                  </span>

                  <EditMilestoneModal
                    milestone={milestone}
                    updateMilestoneAction={updateMilestoneAction}
                  />

                  <DeleteMilestoneModal
                    milestoneId={milestone.id}
                    milestoneTitle={milestone.title}
                    deleteMilestoneAction={deleteMilestoneAction}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl">
            <CalendarDays className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-xs text-neutral-400">No hay hitos o eventos con este filtro.</p>
            <p className="text-[11px] text-neutral-600 mt-0.5">Cambia de pestaña o agrega un nuevo compromiso.</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
        <span>Sincronizado con Supabase Core</span>
        <span className="text-purple-400 font-medium">Gestión descentralizada</span>
      </div>
    </div>
  )
}