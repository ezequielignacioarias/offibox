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

  const { error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        full_name: fullName, // Capturado por el Trigger SQL para nombrar el Workspace
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Si todo sale bien, redirigimos directamente a la app principal
  redirect('/inicio')
}

// --- CIERRE DE SESIÓN ---
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  // Corregido: ahora redirige correctamente a la ruta de login dentro de auth
  redirect('/auth/login')
}