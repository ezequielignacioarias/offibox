'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Función auxiliar para obtener la organización del usuario actual
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

export async function createMilestoneAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  // Obtenemos el workspace activo del usuario
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const priority = formData.get('priority') as string
  const status = formData.get('status') as string
  const event_date = formData.get('event_date') as string
  const description = formData.get('description') as string

  const { error } = await supabase.from('milestones').insert({
    organization_id: organizationId, // <--- Reemplazamos user_id por organization_id
    title,
    category,
    priority,
    status,
    event_date,
    description,
  })

  if (error) {
    console.error('Error al insertar hito:', error)
    throw new Error(error.message)
  }

  revalidatePath('/calendario')
}

export async function updateMilestoneAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  // Obtenemos el workspace activo del usuario
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const priority = formData.get('priority') as string
  const status = formData.get('status') as string
  const event_date = formData.get('event_date') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('milestones')
    .update({
      title,
      category,
      priority,
      status,
      event_date,
      description,
    })
    .eq('id', id)
    .eq('organization_id', organizationId) // <--- Filtramos por la organización del workspace

  if (error) {
    console.error('Error al actualizar hito:', error)
    throw new Error(error.message)
  }

  revalidatePath('/calendario')
}

export async function deleteMilestoneAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  // Obtenemos el workspace activo del usuario
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const milestoneId = formData.get('milestoneId') as string

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', milestoneId)
    .eq('organization_id', organizationId) // <--- Aseguramos que solo borre los de su organización

  if (error) {
    console.error('Error al eliminar hito:', error)
    throw new Error(error.message)
  }

  revalidatePath('/calendario')
}