import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FolderKanban } from 'lucide-react'
import NewProjectModal from '@/components/NewProjectModal'
import ProjectListWrapper from '@/components/ProjectListWrapper'
import { createProjectAction, updateProjectAction, deleteProjectAction } from './actions'

import PageContainer from '@/components/ui/PageContainer'

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login') // Corregido: apunta correctamente a /auth/login

  // 1. Buscamos la organización a la que pertenece el usuario actual
  const { data: member } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single()

  const organizationId = member?.organization_id

  // 2. Consultamos los proyectos filtrando estrictamente por su organization_id
  let projects = []
  if (organizationId) {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId) // <--- ¡Este es el filtro clave!
      .order('created_at', { ascending: false })
    
    projects = data || []
  }

  return (
    <PageContainer>
      {/* Cabecera limpia y adaptativa */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-6 mb-6">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Mis Proyectos</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Centro de control Offibox</p>
          </div>
        </div>

        {/* Contenedor del botón flexionado para ocupar 100% en mobile y auto en desktop */}
        <div className="w-full sm:w-auto flex sm:justify-end">
          <Suspense fallback={null}>
            <NewProjectModal createProjectAction={createProjectAction} />
          </Suspense>
        </div>
      </div>

      {/* Wrapper de proyectos */}
      <ProjectListWrapper 
        projects={projects} 
        updateProjectAction={updateProjectAction}
        deleteProjectAction={deleteProjectAction}
      />
    </PageContainer>
  )
}