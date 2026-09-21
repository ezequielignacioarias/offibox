'use client'

import Link from 'next/link'

interface Project {
  id: string
  name: string
  description?: string
  category?: string
  status?: string
  [key: string]: any
}

interface ProjectListProps {
  projects: Project[]
  onEditClick: (project: Project) => void
  deleteProjectAction: (id: string) => Promise<void>
}

export default function ProjectList({ 
  projects, 
  onEditClick, 
  deleteProjectAction 
}: ProjectListProps) {
  
  const getProjectStyles = (status?: string) => {
    if (!status) return {
      badge: 'text-neutral-400 border-neutral-500/30 bg-neutral-500/10',
      border: 'border-neutral-800 hover:border-neutral-600',
      shadow: 'hover:shadow-[0_0_40px_-15px_rgba(115,115,115,0.2)]',
      bgHover: 'hover:bg-neutral-900/40',
      linkText: 'text-neutral-400 hover:text-white'
    }
    
    const s = status.toLowerCase().trim()

    if (s.includes('idea')) {
      return {
        badge: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
        border: 'border-neutral-800 hover:border-purple-500/50',
        shadow: 'hover:shadow-[0_0_40px_-15px_rgba(168,85,247,0.3)]',
        bgHover: 'hover:bg-purple-950/20',
        linkText: 'text-purple-400 hover:text-purple-200'
      }
    }
    if (s.includes('progreso') || s.includes('proceso')) {
      return {
        badge: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        border: 'border-neutral-800 hover:border-amber-500/50',
        shadow: 'hover:shadow-[0_0_40px_-15px_rgba(245,158,11,0.3)]',
        bgHover: 'hover:bg-amber-950/20',
        linkText: 'text-amber-400 hover:text-amber-200'
      }
    }
    if (s.includes('completado') || s.includes('hecho')) {
      return {
        badge: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        border: 'border-neutral-800 hover:border-emerald-500/50',
        shadow: 'hover:shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]',
        bgHover: 'hover:bg-emerald-950/20',
        linkText: 'text-emerald-400 hover:text-emerald-200'
      }
    }
    
    return {
      badge: 'text-neutral-400 border-neutral-500/30 bg-neutral-500/10',
      border: 'border-neutral-800 hover:border-neutral-600',
      shadow: 'hover:shadow-[0_0_40px_-15px_rgba(115,115,115,0.2)]',
      bgHover: 'hover:bg-neutral-900/40',
      linkText: 'text-neutral-400 hover:text-white'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects && projects.length > 0 ? (
        projects.map((project, index) => {
          const styles = getProjectStyles(project.status)
          return (
            <div 
              key={`${project.id}-${index}`}
              className={`group bg-neutral-900/60 backdrop-blur-xl border ${styles.border} ${styles.bgHover} p-5 rounded-2xl flex flex-col justify-between 
                        transition-all duration-500 ease-out 
                        hover:-translate-y-1.5 ${styles.shadow}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-neutral-200">
                    {project.name}
                  </h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold tracking-wider uppercase flex items-center gap-1.5 ${styles.badge}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {project.status || 'Idea'}
                  </span>
                </div>
                
                <span className="inline-block text-xs px-2.5 py-0.5 rounded-lg border border-white/5 bg-white/5 text-neutral-300 font-medium">
                  {project.category || 'General'}
                </span>

                <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                  {project.description || 'Sin descripción'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/80">
                {/* Ruta actualizada a /tareas para coincidir con la carpeta */}
                <Link 
                  href={`/proyectos/${project.id}/tareas`}
                  className={`text-xs font-bold transition underline underline-offset-4 ${styles.linkText}`}
                >
                  Ver tareas →
                </Link>

                <button 
                  onClick={() => onEditClick(project)}
                  className="text-neutral-500 hover:text-white transition underline underline-offset-4 decoration-neutral-700 hover:decoration-white text-xs cursor-pointer"
                >
                  Editar
                </button>
              </div>
            </div>
          )
        })
      ) : (
        <div className="col-span-full text-center py-12 border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/30 backdrop-blur-sm">
          <p className="text-neutral-500 text-sm">No hay proyectos encontrados.</p>
        </div>
      )}
    </div>
  )
}