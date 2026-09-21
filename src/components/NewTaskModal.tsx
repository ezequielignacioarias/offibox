'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'

interface NewTaskModalProps {
  createTaskAction: (formData: FormData) => Promise<any>
}

export default function NewTaskModal({ createTaskAction }: NewTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-xl font-medium text-sm transition cursor-pointer shadow-lg shadow-white/10"
      >
        <Plus className="w-4 h-4" />
        Nueva Tarea
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-2xl p-6 shadow-2xl relative text-white space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Crear Nueva Tarea</h2>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form 
              action={async (formData) => {
                setLoading(true)
                try {
                  await createTaskAction(formData)
                  setIsOpen(false)
                } finally {
                  setLoading(false)
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Título</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder="Ej. Configurar router principal"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Descripción</label>
                <textarea 
                  name="description" 
                  rows={3}
                  placeholder="Añade detalles sobre la tarea..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Estado</label>
                <select 
                  name="status" 
                  defaultValue="Pendiente"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Idea">Idea</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer shadow-lg shadow-blue-900/40 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}