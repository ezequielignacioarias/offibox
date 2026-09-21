// src/utils/auth.ts
import { createClient } from '@/lib/supabase/server'

export async function getCurrentOrganizationId() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('No autorizado')
  }

  // Buscamos la relación en tu tabla de miembros/perfiles
  const { data: member, error: memberError } = await supabase
    .from('organization_members') // O la tabla que relacione usuarios con organizaciones
    .select('organization_id')
    .eq('user_id', user.id)
    .single()

  if (memberError || !member) {
    throw new Error('No se encontró una organización asociada al usuario.')
  }

  return member.organization_id
}