'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Pencil, X, Calendar as CalendarIcon } from 'lucide-react'

interface Milestone {
  id: string
  title: string
  category: string
  priority: string
  status: string
  event_date: string
  description?: string
}

interface EditMilestoneModalProps {
  milestone: Milestone
  updateMilestoneAction: (formData: FormData) => Promise<void>
}

export default function EditMilestoneModal({ milestone, updateMilestoneAction }: EditMilestoneModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateMilestoneAction(formData)
      setIsOpen(false)
    } catch (error) {
      console.error('Error al actualizar hito:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatLocalDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
    return adjustedDate.toISOString().slice(0, 16)
  }

  const modalContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Editar Hito o Evento</h3>
              <p className="text-xs text-neutral-400">Modifica los detalles del compromiso en tu cronograma.</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <input type="hidden" name="id" value={milestone.id} />
          
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Título del Hito o Evento *</label>
            <input 
              type="text" 
              name="title" 
              required
              defaultValue={milestone.title}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Categoría / Área</label>
              <input 
                type="text" 
                name="category" 
                defaultValue={milestone.category}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Prioridad</label>
              <select 
                name="priority"
                defaultValue={milestone.priority || 'Media'}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Estado</label>
              <select 
                name="status"
                defaultValue={milestone.status || 'Pendiente'}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En curso">En curso</option>
                <option value="Programado">Programado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Fecha y Hora *</label>
              <input 
                type="datetime-local" 
                name="event_date" 
                required
                defaultValue={formatLocalDate(milestone.event_date)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Descripción / Notas (Opcional)</label>
            <textarea 
              name="description" 
              rows={3}
              defaultValue={milestone.description || ''}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-lg shadow-purple-900/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Guardando...' : 'Actualizar Hito'}
            </button>
          </div>
        </form>

      </div>
    </div>,
    document.body
  ) : null

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded-lg transition cursor-pointer"
        title="Editar hito"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      {modalContent}
    </>
  )
}