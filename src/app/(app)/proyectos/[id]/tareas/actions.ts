'use server'

import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { normalizeTaskStatus } from '@/lib/status'
import { revalidatePath } from 'next/cache'

// Función auxiliar para obtener la organización activa del usuario actual
async function getCurrentOrganizationId(supabase: any, userId: string) {
  const { data: member, error } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .single()

  if (error || !member) {
    throw new Error('No se encontró una organización activa para este usuario.')
  }

  return member.organization_id
}

function taskFields(formData: FormData) {
  return {
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || ''),
    status: normalizeTaskStatus(formData.get('status') as string),
  }
}

export async function createTaskAction(projectId: string, formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)
  const fields = taskFields(formData)

  if (!fields.title) {
    throw new Error('El título de la tarea es obligatorio')
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...fields,
      project_id: projectId,
      organization_id: organizationId, // <--- Vinculamos al workspace actual
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/proyectos')
  return data
}

export async function updateTaskAction(taskId: string, projectId: string, formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)
  const fields = taskFields(formData)

  if (!fields.title) {
    throw new Error('El título de la tarea es obligatorio')
  }

  const { error } = await supabase
    .from('tasks')
    .update(fields)
    .eq('id', taskId)
    .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) throw error
  
  revalidatePath('/proyectos')
}

export async function deleteTaskAction(taskId: string, projectId: string) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) throw error
  
  revalidatePath('/proyectos')
}