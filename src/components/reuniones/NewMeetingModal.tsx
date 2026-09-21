'use client'

import { useState } from 'react'
import { Plus, X, Calendar } from 'lucide-react'

interface NewMeetingModalProps {
  createMeetingAction: (formData: FormData) => Promise<any>
}

export default function NewMeetingModal({ createMeetingAction }: NewMeetingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Agendar Reunión</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold">Agendar Nueva Reunión</h2>
              </div>
              <button 
                onClick={handleClose}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form action={async (formData) => {
              setLoading(true)
              try {
                await createMeetingAction(formData)
                handleClose()
              } finally {
                setLoading(false)
              }
            }} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Título de la Reunión</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder="Ej. Revisión con proveedor o cliente" 
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Fecha y Hora</label>
                <input 
                  type="datetime-local" 
                  name="meeting_date" 
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Enlace de Videollamada (Opcional)</label>
                <input 
                  type="url" 
                  name="meeting_url" 
                  placeholder="Dejar vacío para usar la Sala Virtual Fija" 
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}