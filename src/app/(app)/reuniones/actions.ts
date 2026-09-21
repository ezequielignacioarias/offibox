'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMeetingAction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Usuario no autenticado')
  }

  const title = formData.get('title') as string
  const meeting_date = formData.get('meeting_date') as string
  const meeting_url = formData.get('meeting_url') as string

  const { error } = await supabase.from('meetings').insert({
    title,
    meeting_date,
    meeting_url: meeting_url && meeting_url.trim() !== '' ? meeting_url : null,
    user_id: user.id,
  })

  if (error) {
    console.error('Error detallado de Supabase:', error)
    throw new Error(error.message || 'Error al guardar la reunión en la base de datos')
  }

  revalidatePath('/reuniones')
}

// 👈 Nueva Server Action para eliminar
export async function deleteMeetingAction(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Usuario no autenticado')
  }

  const meetingId = formData.get('meetingId') as string
  if (!meetingId) return

  const { error } = await supabase
    .from('meetings')
    .delete()
    .eq('id', meetingId)
    .eq('user_id', user.id) // Garantiza seguridad a nivel de fila

  if (error) {
    console.error('Error al eliminar de Supabase:', error)
    throw new Error('No se pudo eliminar la reunión')
  }

  revalidatePath('/reuniones')
}