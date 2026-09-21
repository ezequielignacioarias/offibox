'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuthState = {
  error?: string
  message?: string
}

// --- INICIO DE SESIÓN ---
export async function login(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect('/inicio')
}

// --- REGISTRO (Multi-Tenant Automático) ---
export async function signup(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string 
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        full_name: fullName, 
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Opcional por seguridad: asegurarnos de actualizar el nombre de la organización recién creada
  const user = data.user
  if (user && fullName) {
    const { data: member } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (member?.organization_id) {
      await supabase
        .from('organizations')
        .update({ name: fullName })
        .eq('id', member.organization_id)
    }
  }

  // Al no requerir confirmación por correo, la sesión ya está activa.
  // Redirigimos directo al sistema (entorno 100% limpio y vacío).
  redirect('/inicio')
}

// --- CIERRE DE SESIÓN ---
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Corregido: apunta correctamente a la carpeta auth
  redirect('/auth/login')
}