'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProjectList from './ProjectList'
import EditProjectModal from './EditProjectModal'
import { Search, X } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

interface Project {
  id: string
  name: string
  description?: string
  category?: string
  status?: string
  [key: string]: any
}

interface ProjectListWrapperProps {
  projects: Project[]
  updateProjectAction: (id: string, formData: FormData) => Promise<void>
  deleteProjectAction: (id: string) => Promise<void>
}

export default function ProjectListWrapper({ 
  projects: initialProjects, 
  updateProjectAction, 
  deleteProjectAction 
}: ProjectListWrapperProps) {
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sincronizar si el servidor envía nuevos props iniciales
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  // Suscripción en tiempo real a Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('realtime-projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'projects',
        },
        (payload: any) => { // <--- Tipado explícito agregado
          console.log('Cambio en tiempo real recibido:', payload)
          
          if (payload.eventType === 'INSERT') {
            setProjects((prev) => [payload.new as Project, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setProjects((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Project) : p))
            )
          } else if (payload.eventType === 'DELETE') {
            setProjects((prev) => prev.filter((p) => p.id !== payload.old.id))
          }

          router.refresh()
        }
      )
      .subscribe((status: string) => { // <--- Tipado explícito agregado
        console.log('Estado de conexión Realtime:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router, supabase])

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase()
    const name = project.name?.toLowerCase() || ''
    const description = project.description?.toLowerCase() || ''
    const category = project.category?.toLowerCase() || ''
    
    return name.includes(query) || description.includes(query) || category.includes(query)
  })

  return (
    <div className="space-y-6">
      {/* --- Barra de Búsqueda Estilo Dashboard Responsive --- */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/50 border border-neutral-800/80 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar proyectos por nombre, categoría o descripción..."
            className="w-full pl-10 pr-10 py-2.5 bg-neutral-900/90 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Contador adaptativo */}
        <div className="text-xs text-neutral-400 font-medium px-2 text-left sm:text-right">
          Mostrando <span className="text-white font-bold">{filteredProjects.length}</span> de {projects.length} proyectos
        </div>
      </div>

      <ProjectList 
        projects={filteredProjects} 
        onEditClick={(project) => setEditingProject(project)} 
        deleteProjectAction={deleteProjectAction} 
      />

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          updateProjectAction={updateProjectAction}
          deleteProjectAction={deleteProjectAction}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  )
}