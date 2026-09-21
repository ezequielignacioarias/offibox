import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { CheckSquare, ArrowLeft } from 'lucide-react'
import { normalizeTaskStatus } from '@/lib/status'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Obtener Proyecto
  const { data: project } = await supabase.from('projects').select('*').eq('id', id).single()
  
  // 2. Obtener Tareas
  const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', id).order('created_at')

  // Server Action corregida para añadir tarea rápida sin campos inexistentes
  async function addTask(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '').trim()
    if (!title) return

    const supabase = await createClient()

    await supabase.from('tasks').insert({ 
      project_id: id, 
      title,
      status: normalizeTaskStatus('Pendiente')
    })
    
    revalidatePath(`/projects/${id}`)
  }

  if (!project) return <div className="p-8 text-neutral-400">Proyecto no encontrado</div>

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navegación de retorno */}
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver a proyectos
        </Link>
        
        <header className="flex justify-between items-start border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-neutral-400 mt-2">{project.description}</p>
          </div>

          {/* Enlace directo a la ruta dedicada de tareas */}
          <Link 
            href={`/projects/${id}/tasks`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-500/20"
          >
            <CheckSquare className="w-4 h-4" />
            Ver tareas en detalle
          </Link>
        </header>

        {/* Formulario rápido de Tarea */}
        <form action={addTask} className="flex gap-2">
          <input 
            name="title" 
            required 
            placeholder="Añadir tarea rápida..." 
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" 
          />
          <button className="bg-neutral-100 hover:bg-white text-neutral-950 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer">
            Añadir
          </button>
        </form>

        {/* Lista previa de Tareas */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-3">Tareas recientes</h3>
          {tasks?.length === 0 ? (
            <p className="text-sm text-neutral-500 italic">No hay tareas registradas todavía.</p>
          ) : (
            tasks?.map((task) => {
              const isCompleted = task.status?.toLowerCase().includes('completado') || task.status?.toLowerCase().includes('hecho')
              return (
                <div key={task.id} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 flex justify-between items-center">
                  <span className="text-sm">{task.title}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isCompleted ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-neutral-800 text-neutral-400'}`}>
                    {task.status || 'Pendiente'}
                  </span>
                </div>
              )
            })
          )}
        </div>

      </div>
    </main>
  )
}