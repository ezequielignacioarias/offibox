import type { ProjectStatus, TaskStatus } from '@/lib/status'

export type { ProjectStatus, TaskStatus }
export type TaskPriority = 'baja' | 'media' | 'alta'
export type NoteType = 'nota' | 'codigo' | 'documentacion'

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  category: string | null
  status: ProjectStatus | string
  start_date?: string | null
  target_date?: string | null
  created_at?: string
  updated_at?: string
}

export type ProjectInsert = {
  name: string
  description?: string | null
  category?: string | null
  status?: ProjectStatus
  start_date?: string | null
  target_date?: string | null
}

export type ProjectUpdate = Partial<ProjectInsert>

export interface Task {
  id: string
  project_id: string
  user_id?: string
  title: string
  name?: string
  description: string | null
  status: TaskStatus | string
  priority?: TaskPriority
  due_date?: string | null
  completed_at?: string | null
  position?: number
  created_at?: string
  updated_at?: string
}

export type TaskInsert = {
  project_id: string
  title: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  position?: number
}

export type TaskUpdate = Partial<TaskInsert> & {
  completed_at?: string | null
}

export interface Note {
  id: string
  user_id: string
  project_id: string | null
  title: string
  content: string | null
  note_type: NoteType
  tags: string[]
  created_at: string
  updated_at: string
}

export type NoteInsert = {
  project_id?: string | null
  title: string
  content?: string | null
  note_type?: NoteType
  tags?: string[]
}

export type NoteUpdate = Partial<NoteInsert>
