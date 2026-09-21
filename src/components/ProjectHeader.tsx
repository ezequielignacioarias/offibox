'use client'

import { useState } from 'react'
import { Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { deleteProjectAction } from '../app/(app)/proyectos/actions'

interface ProjectHeaderProps {
  project: {
    id: string
    name: string
    description?: string | null
  }
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return
    setIsDeleting(true)
    try {
      await deleteProjectAction(project.id) // <--- Corregido al nombre importado
    } catch (error) {
      console.error('Error deleting project:', error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
      <div className="flex items-center gap-4">
        <Link 
          href="/proyectos" // <--- Corregido a la ruta en español
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-neutral-400 mt-1">{project.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition text-sm font-medium disabled:opacity-50 cursor-pointer"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Eliminar Proyecto
        </button>
      </div>
    </div>
  )
}