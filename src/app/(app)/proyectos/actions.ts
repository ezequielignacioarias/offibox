'use server'

import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { normalizeProjectStatus } from '@/lib/status'
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

function projectFields(formData: FormData) {
  return {
    name: String(formData.get('name') || '').trim(),
    description: String(formData.get('description') || ''),
    category: String(formData.get('category') || '').trim(),
    status: normalizeProjectStatus(formData.get('status') as string),
  }
}

export async function createProjectAction(formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)
  const fields = projectFields(formData)

  if (!fields.name) {
    throw new Error('El nombre del proyecto es obligatorio')
  }

  const { error } = await supabase.from('projects').insert({
    ...fields,
    organization_id: organizationId, // <--- Reemplazamos user_id por organization_id
  })

  if (error) throw error
  revalidatePath('/proyectos')
}

export async function updateProjectAction(id: string, formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)
  const fields = projectFields(formData)

  if (!fields.name) {
    throw new Error('El nombre del proyecto es obligatorio')
  }

  const { error } = await supabase
    .from('projects')
    .update(fields)
    .eq('id', id)
    .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) throw error
  revalidatePath('/proyectos')
}

export async function deleteProjectAction(id: string) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) throw error
  revalidatePath('/proyectos')
}

// ==========================================
// Acciones de Tareas (requeridas por TaskRow)
// ==========================================

export async function updateTaskStatus(id: string, status: string) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const { error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) throw error
  revalidatePath('/proyectos')
}

export async function deleteTask(id: string) {
  const { supabase, user } = await getAuthenticatedUser()
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('organization_id', organizationId) // <--- Seguridad multi-tenant

  if (error) throw error
  revalidatePath('/proyectos')
}