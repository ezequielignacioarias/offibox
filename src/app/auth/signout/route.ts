import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

async function handleSignOut(request: NextRequest) {
  const cookieStore = await cookies()

  const response = new NextResponse(null, {
    status: 204,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },

        setAll(cookiesToSet) {
          for (const {
            name,
            value,
            options,
          } of cookiesToSet) {
            response.cookies.set(
              name,
              value,
              options
            )
          }
        },
      },
    }
  )

  console.log('🔴 SIGNOUT INICIADO')

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(
        '❌ ERROR SUPABASE SIGNOUT:',
        error
      )
    } else {
      console.log(
        '🟢 SUPABASE SIGNOUT COMPLETADO'
      )
    }
  } catch (error) {
    console.error(
      '❌ ERROR INTERNO SIGNOUT:',
      error
    )
  }

  // =========================================================
  // ELIMINACIÓN FORZOSA DE TODAS LAS COOKIES DE SUPABASE
  // =========================================================

  const existingCookies = cookieStore.getAll()

  console.log(
    '🍪 COOKIES ANTES DE ELIMINAR:',
    existingCookies.map((cookie) => cookie.name)
  )

  for (const cookie of existingCookies) {
    const name = cookie.name

    if (
      name.startsWith('sb-') ||
      name.toLowerCase().includes('supabase')
    ) {
      // Eliminación mediante Set-Cookie
      response.cookies.set({
        name,
        value: '',
        expires: new Date(0),
        maxAge: 0,
        path: '/',
      })

      // Eliminación explícita
      response.cookies.delete({
        name,
        path: '/',
      })

      console.log(
        '🗑️ COOKIE ELIMINADA:',
        name
      )
    }
  }

  // =========================================================
  // ANTI-CACHE
  // =========================================================

  response.headers.set(
    'Cache-Control',
    'private, no-store, no-cache, must-revalidate, proxy-revalidate'
  )

  response.headers.set(
    'Pragma',
    'no-cache'
  )

  response.headers.set(
    'Expires',
    '0'
  )

  console.log('🟢 SIGNOUT RESPONSE 204')

  return response
}

export async function POST(request: NextRequest) {
  return handleSignOut(request)
}

export async function GET(request: NextRequest) {
  return handleSignOut(request)
}