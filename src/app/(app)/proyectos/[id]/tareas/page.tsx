import { createClient } from '@/lib/supabase/server'
import TaskListWrapper from '@/components/TaskListWrapper'
import { createTaskAction, updateTaskAction, deleteTaskAction } from './actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckSquare } from 'lucide-react'

import PageContainer from '@/components/ui/PageContainer'

interface TasksPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TasksPage({ params }: TasksPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  if (tasksError) {
    console.error('Error al cargar tareas:', tasksError.message)
  }

  return (
    <PageContainer>
      <div className="space-y-10">
        <div className="border-b border-white/10 pb-8">
          {/* Ruta corregida a /proyectos para evitar 404 */}
          <Link 
            href="/proyectos" 
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver a proyectos
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-500/40">
              <CheckSquare className="w-7 h-7 text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">{project.name}</h1>
              <p className="text-sm text-neutral-400">Gestiona y organiza las tareas de tu proyecto.</p>
            </div>
          </div>
        </div>

        <TaskListWrapper 
          tasks={tasks || []} 
          projectId={id}
          deleteAction={async (taskId: string) => {
            'use server'
            await deleteTaskAction(taskId, id)
          }} 
          updateAction={async (taskId: string, formData: FormData) => {
            'use server'
            return await updateTaskAction(taskId, id, formData)
          }}
          createAction={async (formData: FormData) => {
            'use server'
            return await createTaskAction(id, formData)
          }}
        />
      </div>
    </PageContainer>
  )
}