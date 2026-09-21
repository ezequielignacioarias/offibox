'use client'

import { useEffect } from 'react'

export default function PreventBackCache() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // Si la página vuelve desde BFCache,
      // forzamos una navegación real.
      if (event.persisted) {
        window.location.reload()
      }
    }

    const handlePageHide = () => {
      // No hacemos nada aquí.
      // La función pageshow se encarga de detectar
      // la restauración desde el historial.
    }

    window.addEventListener('pageshow', handlePageShow)
    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [])

  return null
}