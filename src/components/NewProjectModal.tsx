'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'

interface NewProjectModalProps {
  createProjectAction: (formData: FormData) => Promise<any>
  deleteProjectAction?: () => Promise<any>
}

export default function NewProjectModal({ createProjectAction, deleteProjectAction }: NewProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const shouldOpen = sessionStorage.getItem('openNewProjectModal')
    if (shouldOpen === 'true') {
      sessionStorage.removeItem('openNewProjectModal')
      setIsOpen(true)
    }

    const handleOpenEvent = () => setIsOpen(true)
    window.addEventListener('open-new-project', handleOpenEvent)

    return () => {
      window.removeEventListener('open-new-project', handleOpenEvent)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      {/* Botón tradicional dentro de la página */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Proyecto</span>
      </button>

      {/* Modal Principal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {/* Contenedor del modal con altura máxima y scroll interno para pantallas chicas */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-5 sm:p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <h2 className="text-sm sm:text-base font-bold">Crear Nuevo Proyecto</h2>
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
                await createProjectAction(formData)
                handleClose()
              } finally {
                setLoading(false)
              }
            }} className="space-y-4">
              
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="Ej. Vyrsof Tech" 
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Grilla adaptativa: 1 columna en mobile, 2 en pantallas sm en adelante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Categoría</label>
                  <input 
                    type="text" 
                    name="category" 
                    placeholder="Ej. Empresas, Servicios..." 
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Estado del Proyecto</label>
                  <select 
                    name="status" 
                    defaultValue="idea"
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="idea">Idea</option>
                    <option value="en_progreso">En progreso</option>
                    <option value="completado">Completado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Descripción</label>
                <textarea 
                  name="description" 
                  rows={3}
                  placeholder="Breve descripción del proyecto..." 
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>

              {/* Botones inferiores adaptables a la pantalla */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 text-center"
                  >
                    {loading ? 'Guardando...' : 'Crear Proyecto'}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Sub-modal de Confirmación de Eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6 text-white shadow-2xl relative text-center space-y-4">
            <h3 className="text-base font-bold text-red-400">¿Estás seguro?</h3>
            <p className="text-xs text-neutral-400">
              Esta acción eliminará el registro actual de forma permanente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white transition cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteProjectAction) await deleteProjectAction()
                  handleClose()
                }}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}