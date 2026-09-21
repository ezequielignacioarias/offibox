import TaskItem from './TaskItem'
import { Task } from '@/types/task'

interface TaskListProps {
  tasks: Task[]
  deleteAction: (id: string) => Promise<void>
  updateAction: (id: string, formData: FormData) => Promise<void>
}

export default function TaskList({ 
  tasks, 
  deleteAction, 
  updateAction 
}: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16 border border-neutral-800 border-dashed rounded-2xl bg-neutral-900/20">
        <p className="text-neutral-500 text-sm">No hay tareas creadas en este proyecto.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          deleteAction={deleteAction} 
          updateAction={updateAction} 
        />
      ))}
    </div>
  )
}