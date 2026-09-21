'use client'

import { TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react'

interface FinanzasDashboardProps {
  totalIngresosPagados: number
  totalEgresosPagados: number
  balanceNeto: number
  onSelectModule: (module: 'ingresos' | 'egresos') => void
}

export default function FinanzasDashboard({
  totalIngresosPagados,
  totalEgresosPagados,
  balanceNeto,
  onSelectModule
}: FinanzasDashboardProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tarjetas de Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1">Total Ingresos Pagados</p>
            <h3 className="text-2xl font-bold text-emerald-400">${totalIngresosPagados.toLocaleString('es-AR')} ARS</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1">Total Egresos Pagados</p>
            <h3 className="text-2xl font-bold text-red-400">${totalEgresosPagados.toLocaleString('es-AR')} ARS</h3>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1">Balance Neto</p>
            <h3 className={`text-2xl font-bold ${balanceNeto >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
              ${balanceNeto.toLocaleString('es-AR')} ARS
            </h3>
          </div>
          <div className={`p-3 rounded-xl border ${balanceNeto >= 0 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tarjetas de Acceso Rápido a Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => onSelectModule('ingresos')}
          className="bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition">
              Abrir Módulo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Gestión de Ingresos y Cobros</h3>
            <p className="text-sm text-neutral-400">Administra los cobros a clientes, estados de pago y flujos de entrada.</p>
          </div>
        </div>

        <div 
          onClick={() => onSelectModule('egresos')}
          className="bg-neutral-900/80 border border-neutral-800 hover:border-red-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-red-400 group-hover:translate-x-1 transition">
              Abrir Módulo <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Gestión de Egresos y Gastos</h3>
            <p className="text-sm text-neutral-400">Controla proveedores, categorías de gastos, CUITs y pagos pendientes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}