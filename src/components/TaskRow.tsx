'use client'

import { updateTaskStatus, deleteTask } from '../app/(app)/proyectos/actions'

interface Task {
  id: string
  title: string
  status: string
}

export default function TaskRow({ task }: { task: Task }) {
  const statusStyles = {
    'Pendiente': 'bg-neutral-800 text-neutral-400 border-neutral-700',
    'En Proceso': 'bg-blue-950/50 text-blue-400 border-blue-800/50',
    'Completada': 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50',
  }

  const currentStatus = task.status || 'Pendiente'

  return (
    <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex justify-between items-center group transition-all hover:border-neutral-700">
      <div className="space-y-1">
        <p className="text-neutral-200 font-medium text-sm">{task.title}</p>
        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyles[currentStatus as keyof typeof statusStyles] || statusStyles['Pendiente']}`}>
          {currentStatus}
        </span>
      </div>
      
      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity items-center">
        <form action={updateTaskStatus.bind(null, task.id, currentStatus === 'Completada' ? 'Pendiente' : 'Completada')}>
          <button type="submit" className="text-xs text-neutral-400 hover:text-white underline cursor-pointer">
            {currentStatus === 'Completada' ? 'Marcar Pendiente' : 'Completar'}
          </button>
        </form>
        <form action={updateTaskStatus.bind(null, task.id, 'En Proceso')}>
          <button type="submit" className="text-xs text-neutral-400 hover:text-white underline cursor-pointer">En Proceso</button>
        </form>
        <form action={deleteTask.bind(null, task.id)}>
          <button type="submit" className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer">Eliminar</button>
        </form>
      </div>
    </div>
  )
}