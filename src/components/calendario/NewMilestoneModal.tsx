'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react'

interface NewMilestoneModalProps {
  createMilestoneAction: (formData: FormData) => Promise<void>
}

export default function NewMilestoneModal({ createMilestoneAction }: NewMilestoneModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget // 1. Guardamos la referencia antes del await
    setLoading(true)
    const formData = new FormData(form)
    
    try {
      await createMilestoneAction(formData)
      setIsOpen(false)
      form.reset() // 2. Usamos la referencia guardada en lugar de e.currentTarget
    } catch (error) {
      console.error('Error al crear hito:', error)
    } finally {
      setLoading(false)
    }
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
              <h3 className="text-base font-bold text-white">Nuevo Hito o Evento</h3>
              <p className="text-xs text-neutral-400">Registra un nuevo compromiso en tu cronograma.</p>
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
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Título del Hito o Evento *</label>
            <input 
              type="text" 
              name="title" 
              required
              placeholder="Ej: Cierre de fase"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Categoría / Área</label>
              <input 
                type="text" 
                name="category" 
                placeholder="Ej: Operaciones"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Prioridad</label>
              <select 
                name="priority"
                defaultValue="Media"
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
                defaultValue="Pendiente"
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
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">Descripción / Notas (Opcional)</label>
            <textarea 
              name="description" 
              rows={3}
              placeholder="Notas breves..."
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
              {loading ? 'Guardando...' : 'Crear Hito'}
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
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition shadow-lg shadow-purple-900/20 cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Hito</span>
      </button>

      {modalContent}
    </>
  )
}