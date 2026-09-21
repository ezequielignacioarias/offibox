'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import PreventBackCache from '@/components/auth/PreventBackCache' // 👈 1. Importar el componente
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  // Detecta si estamos en una ruta de autenticación (login, signup, etc.)
  const isAuthRoute = pathname?.startsWith('/auth')

  return (
    <html lang="es">
      <body className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-blue-600 selection:text-white">
        
        {/* 👈 2. Añadir el componente para limpiar el bfcache al volver atrás */}
        <PreventBackCache />

        {/* Renderiza el Sidebar y Navbar SOLO si NO es una ruta de auth */}
        {!isAuthRoute && (
          <>
            <Sidebar 
              isOpen={isSidebarOpen} 
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <Navbar 
              isSidebarOpen={isSidebarOpen} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          </>
        )}

        {/* Contenido principal: ancho completo para login, con márgenes para el workspace */}
        <main className={!isAuthRoute ? `pt-20 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}` : 'min-h-screen w-full flex items-center justify-center'}>
          {children}
        </main>

      </body>
    </html>
  )
}