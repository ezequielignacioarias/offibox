'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit2, X, Save, Loader2, Tag, Plus, GripVertical } from 'lucide-react'
import { Task } from '@/types/task'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskListWrapperProps {
  tasks: Task[]
  deleteAction: (taskId: string) => Promise<void>
  updateAction: (taskId: string, formData: FormData) => Promise<any>
  createAction: (formData: FormData) => Promise<any>
  projectId: string
}

function SortableTaskItem({ 
  task, 
  onDelete, 
  onStartEdit, 
  isEditing, 
  isUpdating, 
  isDeleting, 
  handleUpdate, 
  statusColors, 
  setEditingTaskId 
}: { 
  task: Task
  onDelete: (id: string) => void
  onStartEdit: (id: string) => void
  isEditing: boolean
  isUpdating: boolean
  isDeleting: boolean
  handleUpdate: (e: React.FormEvent<HTMLFormElement>) => void
  statusColors: { [key: string]: string }
  setEditingTaskId: (id: string | null) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: 0 } : null),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1
  }

  // Corregido para evitar el error de tipo undefined con el operador ??
  const statusClass = statusColors[task.status ?? 'Pendiente'] || statusColors['Pendiente']

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 rounded-2xl p-5 hover:border-blue-500/40 hover:bg-neutral-900/60 hover:-translate-y-0.5 transition-all duration-200 relative flex items-center gap-3"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing transition-colors shrink-0"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 w-full">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="flex flex-col md:flex-row items-center gap-3 w-full">
            <input 
              name="title" 
              defaultValue={task.title || task.name} 
              className="w-full md:flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-base font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none" 
              autoFocus 
            />
            <select 
              name="status" 
              defaultValue={task.status || 'Pendiente'} 
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-900 border border-neutral-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pendiente" className="bg-neutral-900 text-neutral-300">Pendiente</option>
              <option value="En Proceso" className="bg-neutral-900 text-blue-300">En Proceso</option>
              <option value="Completada" className="bg-neutral-900 text-emerald-300">Completada</option>
            </select>
            <input 
              name="description" 
              defaultValue={task.description || ''} 
              placeholder="Descripción..." 
              className="w-full md:flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-sm text-neutral-300 outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button type="submit" disabled={isUpdating} className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50 cursor-pointer">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
              <button type="button" onClick={() => setEditingTaskId(null)} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="flex flex-wrap items-center gap-4 flex-1">
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-blue-400/80 shrink-0" />
                <span className="text-base font-semibold text-white">
                  {task.title || task.name}
                </span>
              </div>

              <span className="text-sm text-neutral-400">
                {task.description || 'Sin descripción'}
              </span>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
                {task.status || 'Pendiente'}
              </span>

              <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onStartEdit(task.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-blue-950/40 transition cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(task.id)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TaskListWrapper({ tasks: initialTasks, deleteAction, updateAction, createAction, projectId }: TaskListWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleDelete = async (taskId: string) => {
    setDeletingTaskId(taskId)
    try {
      await deleteAction(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setDeletingTaskId(null)
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingTaskId) return

    const formData = new FormData(e.currentTarget)
    const newTitle = formData.get('title') as string
    const newStatus = formData.get('status') as string
    const newDescription = formData.get('description') as string

    setUpdatingTaskId(editingTaskId)
    try {
      await updateAction(editingTaskId, formData)
      
      setTasks(tasks.map(t => {
        if (t.id === editingTaskId) {
          return {
            ...t,
            title: newTitle,
            name: newTitle,
            status: newStatus,
            description: newDescription
          }
        }
        return t
      }))

      setEditingTaskId(null)
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const handleCreate = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const newTask = await createAction(formData)
      if (newTask) {
        setTasks((prevTasks) => [newTask, ...prevTasks])
      }
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const statusColors: { [key: string]: string } = {
    'Pendiente': 'bg-neutral-800 text-neutral-300 border-neutral-700',
    'En Proceso': 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    'Completada': 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-6">
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-neutral-700 hover:border-neutral-500 bg-neutral-900/30 hover:bg-neutral-900/60 text-neutral-300 hover:text-white font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Nueva Tarea
        </button>
      )}

      {isCreating && (
        <form action={handleCreate} className="bg-neutral-950/80 backdrop-blur-md border border-neutral-700 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-lg font-semibold text-white">Crear Nueva Tarea</h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-neutral-400 hover:text-white transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Título</label>
              <input name="title" required placeholder="Nombre de la tarea" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Estado</label>
              <select name="status" defaultValue="Pendiente" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Descripción</label>
            <textarea name="description" placeholder="Detalles opcionales..." rows={2} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition text-sm font-medium cursor-pointer">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition text-sm font-semibold disabled:opacity-50 cursor-pointer">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Guardar Tarea
            </button>
          </div>
        </form>
      )}

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={tasks.map(t => t.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {tasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStartEdit={(id) => setEditingTaskId(id)}
                isEditing={editingTaskId === task.id}
                isUpdating={updatingTaskId === task.id}
                isDeleting={deletingTaskId === task.id}
                handleUpdate={handleUpdate}
                statusColors={statusColors}
                setEditingTaskId={setEditingTaskId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}