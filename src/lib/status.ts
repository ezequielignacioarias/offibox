export const PROJECT_STATUSES = ['Idea', 'En progreso', 'Completado'] as const
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const TASK_STATUSES = ['Pendiente', 'En Proceso', 'Completada'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  Idea: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  'En progreso': 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  Completado: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
}

export const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
  Pendiente: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  'En Proceso': 'bg-blue-950/60 text-blue-300 border-blue-800/60',
  Completada: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
}

export function normalizeProjectStatus(status?: string | null): ProjectStatus {
  const value = status?.toLowerCase().trim() || 'idea'
  if (value.includes('progreso') || value.includes('proceso') || value.includes('desarrollo')) {
    return 'En progreso'
  }
  if (value.includes('completado') || value.includes('hecho')) {
    return 'Completado'
  }
  return 'Idea'
}

export function normalizeTaskStatus(status?: string | null): TaskStatus {
  const value = status?.toLowerCase().trim() || 'pendiente'
  if (value.includes('complet')) return 'Completada'
  if (value.includes('proceso') || value.includes('progreso')) return 'En Proceso'
  return 'Pendiente'
}

export function projectStatusClass(status?: string | null) {
  return PROJECT_STATUS_STYLES[normalizeProjectStatus(status)]
}

export function taskStatusClass(status?: string | null) {
  return TASK_STATUS_STYLES[normalizeTaskStatus(status)]
}
