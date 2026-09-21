'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { normalizeProjectStatus } from '@/lib/status'

interface Project {
  id: string
  name: string
  description?: string
  category?: string
  status?: string
  [key: string]: any
}

interface EditProjectModalProps {
  project: Project
  updateProjectAction: (id: string, formData: FormData) => Promise<void>
  deleteProjectAction: (id: string) => Promise<void>
  onClose: () => void
}

export default function EditProjectModal({
  project,
  updateProjectAction,
  deleteProjectAction,
  onClose,
}: EditProjectModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700/80 rounded-2xl p-6 shadow-2xl relative text-white space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Editar Proyecto</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showDeleteConfirm ? (
          <div className="bg-neutral-950 border border-red-500/30 rounded-xl p-4 space-y-4 my-2 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">¿Eliminar este proyecto?</h3>
                <p className="text-xs text-neutral-400">
                  Esta acción no se puede deshacer y se perderán todos los datos asociados.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true)
                  try {
                    await deleteProjectAction(project.id)
                    onClose()
                    router.refresh()
                  } finally {
                    setDeleting(false)
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600 hover:bg-red-500 text-white transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        ) : (
          <form
            action={async (formData) => {
              setLoading(true)
              try {
                await updateProjectAction(project.id, formData)
                onClose()
                router.refresh()
              } finally {
                setLoading(false)
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                name="name"
                defaultValue={project.name}
                required
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Categoría
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={project.category || ''}
                  required
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Estado / Etapa
                </label>
                <select
                  name="status"
                  defaultValue={normalizeProjectStatus(project.status)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Idea">Idea</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Descripción
              </label>
              <textarea
                name="description"
                defaultValue={project.description || ''}
                rows={2}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer shadow-lg shadow-blue-900/40 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Guardar cambios
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}