'use server'

import { createClient } from '@/lib/supabase/server'
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

// 1. Crear Tarea
export async function createTaskAction(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const organizationId = await getCurrentOrganizationId(supabase, user.id)
  
  const { data, error } = await supabase.from('tasks').insert({
    organization_id: organizationId, // <--- Vinculamos al workspace actual
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status') || 'Pendiente',
    project_id: projectId
  }).select().single()

  if (error) {
    console.error('Error al crear tarea:', error.message)
    throw new Error(error.message)
  }

  revalidatePath(`/projects/${projectId}/tasks`)
  return data
}

// 2. Actualizar Tarea
export async function updateTaskAction(taskId: string, projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const { error } = await supabase.from('tasks').update({
    title: formData.get('title'),
    description: formData.get('description'),
    status: formData.get('status')
  })
  .eq('id', taskId)
  .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) {
    console.error('Error al actualizar tarea:', error.message)
    throw new Error(error.message)
  }

  revalidatePath(`/projects/${projectId}/tasks`)
}

// 3. Eliminar Tarea
export async function deleteTaskAction(taskId: string, projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const { error } = await supabase.from('tasks').delete()
  .eq('id', taskId)
  .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) {
    console.error('Error al eliminar tarea:', error.message)
    throw new Error(error.message)
  }

  revalidatePath(`/projects/${projectId}/tasks`)
}