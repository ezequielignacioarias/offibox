import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  console.log('🔥 PROXY EJECUTADO:', path)

  // =========================================================
  // RESPUESTA BASE
  // =========================================================

  let supabaseResponse = NextResponse.next({
    request,
  })

  // =========================================================
  // CLIENTE SUPABASE
  // =========================================================

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              )
            }
          )
        },
      },
    }
  )

  // =========================================================
  // VERIFICAR SESIÓN REAL CON SUPABASE
  // =========================================================

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(
    '🔥 PROXY AUTH:',
    path,
    '| USER:',
    user?.id ?? 'NO USER'
  )

  // =========================================================
  // RUTAS DE AUTENTICACIÓN
  // =========================================================

  const isAuthRoute = path.startsWith('/auth')

  // =========================================================
  // RUTAS PÚBLICAS
  // =========================================================

  const isPublicRoute =
    path === '/' ||
    isAuthRoute

  // =========================================================
  // ANTI-CACHE
  // =========================================================
  // Las rutas privadas nunca deben quedar almacenadas
  // en caché del navegador/proxy.

  if (!isPublicRoute) {
    supabaseResponse.headers.set(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate, proxy-revalidate'
    )

    supabaseResponse.headers.set(
      'Pragma',
      'no-cache'
    )

    supabaseResponse.headers.set(
      'Expires',
      '0'
    )
  }

  // =========================================================
  // USUARIO NO AUTENTICADO → RUTA PRIVADA
  // =========================================================

  if (!user && !isPublicRoute) {
    console.log(
      '🚫 ACCESO DENEGADO:',
      path
    )

    const loginUrl = new URL(
      '/auth/login',
      request.url
    )

    return NextResponse.redirect(loginUrl)
  }

  // =========================================================
  // USUARIO AUTENTICADO → RUTA DE AUTENTICACIÓN
  // =========================================================

  if (user && isAuthRoute) {
    console.log(
      '➡️ USUARIO AUTENTICADO → INICIO'
    )

    const inicioUrl = new URL(
      '/inicio',
      request.url
    )

    return NextResponse.redirect(inicioUrl)
  }

  // =========================================================
  // CONTINUAR NORMALMENTE
  // =========================================================

  return supabaseResponse
}

// ===========================================================
// PROXY GLOBAL
// ===========================================================
//
// El proxy pasa por las rutas de la aplicación,
// excepto archivos estáticos y recursos internos de Next.js.
//
// Esto evita tener que agregar manualmente cada nueva ruta
// privada de Offibox.
//
// ===========================================================

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}