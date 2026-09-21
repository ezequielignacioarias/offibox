'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react'
import { Task } from '@/types/task'

interface TaskItemProps {
  task: Task
  deleteAction: (id: string) => Promise<void>
  updateAction?: (id: string, formData: FormData) => Promise<void> // <--- Añadido aquí
}

export default function TaskItem({ 
  task, 
  deleteAction 
}: TaskItemProps) {
  if (!task) return null

  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <div className="relative flex items-center justify-between p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl hover:border-neutral-700 transition">
      <div className="space-y-1">
        <span className="text-sm font-semibold text-neutral-200">
          {task.title || task.name || 'Sin nombre'}
        </span>
        {task.description && (
          <p className="text-xs text-neutral-400">{task.description}</p>
        )}
      </div>

      <div className="relative">
        <button 
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {showConfirm && (
          <div className="absolute right-0 top-full mt-2 z-[999] w-64 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Confirmar</span>
              </div>
              <button 
                type="button"
                onClick={() => setShowConfirm(false)} 
                className="text-neutral-500 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <p className="text-xs text-neutral-400 mb-4">¿Estás seguro de eliminar esta tarea?</p>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-medium text-white transition cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={async () => {
                  setLoading(true)
                  try {
                    await deleteAction(task.id)
                    setShowConfirm(false)
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="flex-1 flex items-center justify-center px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium text-white transition cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Eliminar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}