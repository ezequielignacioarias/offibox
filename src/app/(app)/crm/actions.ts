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

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('No autorizado')

  // Obtenemos el workspace activo del usuario
  const organizationId = await getCurrentOrganizationId(supabase, user.id)

  const name = formData.get('name') as string
  const contactPerson = formData.get('contactPerson') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const stage = formData.get('stage') as string
  const value = formData.get('value') as string
  const type = formData.get('type') as string

  const { error } = await supabase.from('crm_contacts').insert({
    organization_id: organizationId, // <--- Reemplazamos user_id por organization_id
    name,
    contact_person: contactPerson,
    email,
    phone,
    stage,
    value,
    type
  })

  if (error) {
    throw new Error('Error al registrar el contacto: ' + error.message)
  }

  revalidatePath('/crm')
}