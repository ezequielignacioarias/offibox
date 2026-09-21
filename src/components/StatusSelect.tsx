'use client'

import { PROJECT_STATUSES, TASK_STATUSES, type ProjectStatus, type TaskStatus } from '@/lib/status'

const fieldClass =
  'w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-all cursor-pointer'

export function ProjectStatusSelect({
  defaultValue,
  className = fieldClass,
}: {
  defaultValue?: string
  className?: string
}) {
  return (
    <select name="status" defaultValue={defaultValue} className={className}>
      {PROJECT_STATUSES.map((status: ProjectStatus) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

export function TaskStatusSelect({
  defaultValue,
  className = fieldClass,
}: {
  defaultValue?: string
  className?: string
}) {
  return (
    <select name="status" defaultValue={defaultValue} className={className}>
      {TASK_STATUSES.map((status: TaskStatus) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}
