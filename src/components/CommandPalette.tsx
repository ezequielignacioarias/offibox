'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Calendar, 
  FileText, 
  Video, 
  PlusCircle,
  Search
} from 'lucide-react'

export default function CommandPalette() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isOpen) return null

  const handleNavigate = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  const handleCreateProject = () => {
    sessionStorage.setItem('openNewProjectModal', 'true')
    router.push('/projects')
    window.dispatchEvent(new CustomEvent('open-new-project'))
    setIsOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Input de búsqueda */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Escribe una orden, busca o crea algo..." 
            className="w-full bg-transparent text-sm focus:outline-none text-white placeholder-neutral-500"
            autoFocus
          />
        </div>

        {/* Lista de opciones y acciones */}
        <div className="p-2 space-y-3 max-h-80 overflow-y-auto">
          
          <div>
            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Acciones rápidas
            </div>
            <button
              onClick={handleCreateProject}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-200 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>Crear nuevo proyecto</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 font-mono">Acción</span>
            </button>
          </div>

          <div>
            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Navegación del sistema
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleNavigate('/dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition cursor-pointer text-left"
              >
                <LayoutDashboard className="w-4 h-4 text-neutral-400" />
                <span>Ir a Recepción</span>
              </button>

              <button
                onClick={() => handleNavigate('/projects')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition cursor-pointer text-left"
              >
                <FolderKanban className="w-4 h-4 text-neutral-400" />
                <span>Ir a Proyectos</span>
              </button>

              <button
                onClick={() => handleNavigate('/reuniones')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition cursor-pointer text-left"
              >
                <Video className="w-4 h-4 text-neutral-400" />
                <span>Ir a Sala de Reuniones</span>
              </button>

              <button
                onClick={() => handleNavigate('/calendar')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition cursor-pointer text-left"
              >
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>Ir a Calendario y Hitos</span>
              </button>

              <button
                onClick={() => handleNavigate('/team')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition cursor-pointer text-left"
              >
                <Users className="w-4 h-4 text-neutral-400" />
                <span>Ir a Equipo Activo</span>
              </button>

              <button
                onClick={() => handleNavigate('/archive')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800/60 hover:text-white transition cursor-pointer text-left"
              >
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Ir a Archivador Digital</span>
              </button>
            </div>
          </div>

        </div>

        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex justify-between items-center text-[10px] text-neutral-500">
          <span>Selecciona con un clic o Enter</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="hover:text-white transition cursor-pointer"
          >
            Cerrar [ESC]
          </button>
        </div>
      </div>
    </div>
  )
}