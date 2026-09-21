'use client'

import { useState, useEffect } from 'react'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Activity,
  ShieldCheck
} from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '@/context/OrganizationContext' // <--- Importamos el contexto global

const supabase = createBrowserSupabaseClient()

export default function ResumenFinanciero() {
  const { orgId, loading: orgLoading } = useOrganization() // <--- Obtenemos el orgId y estado de carga
  const [cobros, setCobros] = useState<any[]>([])
  const [egresos, setEgresos] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (orgLoading) return // Esperar a que el contexto resuelva el ID
    fetchResumenData()
  }, [orgId, orgLoading])

  async function fetchResumenData() {
    let cobrosQuery = supabase.from('cobros').select('*').order('created_at', { ascending: false })
    let egresosQuery = supabase.from('egresos').select('*').order('created_at', { ascending: false })

    // Filtro multi-tenant dinámico con el ID de la organización activa
    if (orgId) {
      cobrosQuery = cobrosQuery.eq('organization_id', orgId)
      egresosQuery = egresosQuery.eq('organization_id', orgId)
    }

    const [cobrosRes, egresosRes] = await Promise.all([cobrosQuery, egresosQuery])

    if (!cobrosRes.error) setCobros(cobrosRes.data || [])
    if (!egresosRes.error) setEgresos(egresosRes.data || [])
    setIsLoaded(true)
  }

  // Cálculos reales
  const totalCobrado = cobros
    .filter(c => c.status === 'Cobrado' && (!c.currency || c.currency === 'ARS'))
    .reduce((acc, curr) => acc + (Number(curr.amount_value) || 0), 0)

  const totalPorCobrar = cobros
    .filter(c => c.status === 'Pendiente' && (!c.currency || c.currency === 'ARS'))
    .reduce((acc, curr) => acc + (Number(curr.amount_value) || 0), 0)

  const totalGastado = egresos
    .filter(e => e.status === 'Pagado' && (!e.currency || e.currency === 'ARS'))
    .reduce((acc, curr) => acc + (Number(curr.amount_value) || 0), 0)

  const totalPorPagar = egresos
    .filter(e => e.status === 'Pendiente' && (!e.currency || e.currency === 'ARS'))
    .reduce((acc, curr) => acc + (Number(curr.amount_value) || 0), 0)

  const balanceNeto = totalCobrado - totalGastado
  const balanceProyectado = (totalCobrado + totalPorCobrar) - (totalGastado + totalPorPagar)

  const ultimosMovimientos = [
    ...cobros.map(c => ({
      id: c.id,
      nombre: c.client,
      concepto: c.concept,
      tipo: 'ingreso',
      estado: c.status,
      monto: Number(c.amount_value) || 0,
      currency: c.currency || 'ARS',
      created_at: c.created_at || c.date_text
    })),
    ...egresos.map(e => ({
      id: e.id,
      nombre: e.supplier,
      concepto: e.concept,
      tipo: 'egreso',
      estado: e.status,
      monto: Number(e.amount_value) || 0,
      currency: e.currency || 'ARS',
      created_at: e.created_at || e.date_text
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)

  if (orgLoading) {
    return (
      <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
        <p className="text-neutral-400 text-sm">Cargando organización y datos financieros...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Balance Real (Caja)</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              ${balanceNeto.toLocaleString('es-AR')} <span className="text-xs font-normal text-neutral-400">ARS</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-medium">Ingresos cobrados</span> menos gastos pagados
            </p>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Balance Proyectado</span>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              ${balanceProyectado.toLocaleString('es-AR')} <span className="text-xs font-normal text-neutral-400">ARS</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1">
              Incluyendo cobros y gastos pendientes
            </p>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ingresos Totales</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-400">
              ${(totalCobrado + totalPorCobrar).toLocaleString('es-AR')} <span className="text-xs font-normal text-neutral-400">ARS</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <span className="text-amber-400 font-medium">${totalPorCobrar.toLocaleString('es-AR')}</span> pendiente de cobro
            </p>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Egresos Totales</span>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-rose-400">
              ${(totalGastado + totalPorPagar).toLocaleString('es-AR')} <span className="text-xs font-normal text-neutral-400">ARS</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
              <span className="text-neutral-300 font-medium">${totalPorPagar.toLocaleString('es-AR')}</span> por abonar
            </p>
          </div>
        </div>
      </div>

      {/* Sección Inferior: Estado de ARCA y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">Estado de Facturación ARCA</h4>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
              <span className="text-neutral-400">Facturado este mes</span>
              <span className="font-bold text-white">
                ${cobros.filter(c => c.facturado).reduce((acc, c) => acc + (Number(c.amount_value) || 0), 0).toLocaleString('es-AR')} ARS
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
              <span className="text-neutral-400">Comprobantes emitidos</span>
              <span className="font-bold text-white">{cobros.filter(c => c.facturado).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
              <span className="text-neutral-400">Sincronización API</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Conectado
              </span>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm">Últimos Movimientos Registrados</h4>
            <span className="text-xs text-neutral-400 font-medium">Consolidado</span>
          </div>

          <div className="space-y-2 pt-1">
            {!isLoaded ? (
              <p className="text-xs text-neutral-400 text-center py-4">Cargando movimientos...</p>
            ) : ultimosMovimientos.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-4">No hay movimientos registrados para esta organización.</p>
            ) : (
              ultimosMovimientos.map((mov) => {
                const isIngreso = mov.tipo === 'ingreso'
                return (
                  <div key={mov.id} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 transition">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${isIngreso ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {isIngreso ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{mov.nombre || 'Sin nombre'}</h5>
                        <p className="text-[10px] text-neutral-400">{mov.concepto} ({mov.estado})</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${isIngreso ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isIngreso ? '+' : '-'}${mov.monto.toLocaleString('es-AR')} {mov.currency}
                      </span>
                      <p className="text-[10px] text-neutral-500">{mov.estado}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}