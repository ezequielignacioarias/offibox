'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Trash2, X, AlertTriangle } from 'lucide-react'

interface DeleteMilestoneModalProps {
  milestoneId: string
  milestoneTitle: string
  deleteMilestoneAction: (formData: FormData) => Promise<void>
}

export default function DeleteMilestoneModal({ 
  milestoneId, 
  milestoneTitle, 
  deleteMilestoneAction 
}: DeleteMilestoneModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await deleteMilestoneAction(formData)
      setIsOpen(false)
    } catch (error) {
      console.error('Error al eliminar hito:', error)
    } finally {
      setLoading(false)
    }
  }

  const modalContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Eliminar Hito</h3>
              <p className="text-xs text-neutral-400">Esta acción no se puede deshacer.</p>
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

        <div className="py-4">
          <p className="text-xs text-neutral-300 leading-relaxed">
            ¿Estás seguro de que deseas eliminar el hito <strong className="text-white">"{milestoneTitle}"</strong>?
          </p>
        </div>

        <form onSubmit={handleDelete}>
          <input type="hidden" name="milestoneId" value={milestoneId} />
          
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
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition shadow-lg shadow-red-900/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Eliminando...' : 'Sí, Eliminar'}
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
        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition cursor-pointer"
        title="Eliminar hito"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {modalContent}
    </>
  )
}