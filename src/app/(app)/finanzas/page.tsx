'use client'

import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { DollarSign, ArrowLeft } from 'lucide-react'
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'
import ResumenFinanciero from '@/components/finanzas/Resumen'
import Ingresos from '@/components/finanzas/Ingresos'
import Egresos from '@/components/finanzas/Egresos'
import FinanzasTabsNav from '@/components/finanzas/FinanzasTabsNav'

// Cliente de Supabase para el navegador
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

function FinanzasContent() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'resumen'
  
  const supabase = createBrowserSupabaseClient()

  // 🛡️ SEGURIDAD CONTRA CACHÉ: Verificar sesión en tiempo real al volver atrás
  useEffect(() => {
    async function checkUserSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login' // Forzar recarga limpia al login si no hay sesión
      }
    }

    checkUserSession()

    // Escuchar si la sesión se cerró con tipado explícito
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/auth/login'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <PageContainer>
      <PageHeader 
        icon={DollarSign}
        title="Módulo de Finanzas"
        description="Centro financiero, ingresos, facturación electrónica y control de caja"
        iconTheme="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        actions={
          <Link 
            href="/inicio"
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
        }
      />

      <div className="space-y-6">
        {/* Navegación por pestañas desacoplada (Componente Cliente) */}
        <FinanzasTabsNav activeTab={activeTab} />

        {/* Renderizado condicional basado en el estado de la URL */}
        {activeTab === 'resumen' && <ResumenFinanciero />}
        {activeTab === 'ingresos' && <Ingresos />}
        {activeTab === 'egresos' && <Egresos />}
      </div>
    </PageContainer>
  )
}

export default function FinanzasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400 text-sm">
        Cargando módulo de finanzas...
      </div>
    }>
      <FinanzasContent />
    </Suspense>
  )
}