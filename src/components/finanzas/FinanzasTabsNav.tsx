'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

interface FinanzasTabsNavProps {
  activeTab: string
}

export default function FinanzasTabsNav({ activeTab }: FinanzasTabsNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleTabChange = (tab: string) => {
    // Actualiza la URL sin recargar la página completa y evita el desplazamiento vertical
    router.push(`${pathname}?tab=${tab}`, { scroll: false })
  }

  return (
    <div className="flex bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800/80 w-fit backdrop-blur-xl">
      <button
        onClick={() => handleTabChange('resumen')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
          activeTab === 'resumen' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Wallet className="w-4 h-4 text-blue-400" />
        <span>Resumen General</span>
      </button>

      <button
        onClick={() => handleTabChange('ingresos')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
          activeTab === 'ingresos' ? 'bg-neutral-800 text-emerald-400 shadow' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span>Ingresos y Cobros (ARCA)</span>
      </button>

      <button
        onClick={() => handleTabChange('egresos')}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
          activeTab === 'egresos' ? 'bg-neutral-800 text-amber-400 shadow' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <TrendingDown className="w-4 h-4 text-amber-400" />
        <span>Egresos / Gastos</span>
      </button>
    </div>
  )
}