'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calculator, 
  ArrowLeft, 
  Plus, 
  DollarSign, 
  Building, 
  TrendingUp, 
  Search,
  Loader2,
  X
} from 'lucide-react'

// Componentes UI unificados
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

export default function PresupuestosPage() {
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Estados para el modal de creación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [totalCostValue, setTotalCostValue] = useState('')
  const [progress, setProgress] = useState('0%')
  const [status, setStatus] = useState('Pendiente')
  const [submitting, setSubmitting] = useState(false)

  const supabase = createBrowserSupabaseClient()

  // 🛡️ SEGURIDAD CONTRA CACHÉ: Verificar sesión en tiempo real
  useEffect(() => {
    async function checkUserSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
      }
    }

    checkUserSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/auth/login'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('presupuestos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (error) {
      console.error('Error al cargar presupuestos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !category) return

    try {
      setSubmitting(true)
      const numericCost = parseFloat(totalCostValue) || 0
      const formattedCostText = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
      }).format(numericCost)

      const { error } = await supabase
        .from('presupuestos')
        .insert([{
          title,
          category,
          description,
          total_cost_value: numericCost,
          total_cost_text: formattedCostText,
          progress,
          status
        }])

      if (error) throw error

      // Limpiar formulario y cerrar modal
      setTitle('')
      setCategory('')
      setDescription('')
      setTotalCostValue('')
      setProgress('0%')
      setStatus('Pendiente')
      setIsModalOpen(false)
      
      // Recargar lista
      fetchBudgets()
    } catch (error) {
      console.error('Error al crear presupuesto:', error)
      alert('Hubo un error al guardar el presupuesto')
    } finally {
      setSubmitting(false)
    }
  }

  // Cálculo dinámico de la inversión total sumando los valores numéricos
  const totalInvestment = budgets.reduce((acc, curr) => acc + (Number(curr.total_cost_value) || 0), 0)
  const formattedTotalInvestment = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(totalInvestment)

  const filteredBudgets = budgets.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageContainer>
      {/* Cabecera unificada */}
      <PageHeader 
        icon={Calculator}
        title="Presupuestos y Costos"
        description="Control financiero de obras, estimación de materiales y cotizaciones"
        iconTheme="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        actions={
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition cursor-pointer text-sm font-semibold shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Presupuesto</span>
            </button>
            <Link 
              href="/inicio"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        }
      />

      <div className="space-y-8">
        {/* Tarjetas de Resumen Financiero dinámicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Inversión Total Estimada</p>
              <h3 className="text-2xl font-bold text-white">
                {loading ? '...' : formattedTotalInvestment}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Proyectos en Curso</p>
              <h3 className="text-2xl font-bold text-white">
                {loading ? '...' : `${budgets.length} Obras`}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Building className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Desviación Presupuestaria</p>
              <h3 className="text-2xl font-bold text-emerald-400">-2.4%</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800/80 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre de obra, categoría o descripción..."
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
            />
          </div>
          <div className="text-xs text-neutral-400 font-medium px-2 text-right">
            Mostrando <span className="text-white font-bold">{filteredBudgets.length}</span> presupuestos
          </div>
        </div>

        {/* Listado de Presupuestos */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 backdrop-blur-xl shadow-xl">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-sm text-neutral-400">Cargando presupuestos desde la base de datos...</p>
            </div>
          ) : filteredBudgets.length > 0 ? (
            filteredBudgets.map((item) => {
              const catLower = item.category?.toLowerCase() || ''
              let badgeBg = 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              if (catLower.includes('infraestructura')) badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              if (catLower.includes('terminaciones')) badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20'

              return (
                <div 
                  key={item.id}
                  className="bg-neutral-900/80 border border-neutral-800/80 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-neutral-400">Costo Total</p>
                      <p className="text-lg font-black text-white">
                        {item.total_cost_text || `$${Number(item.total_cost_value || 0).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs text-neutral-400">Avance</p>
                      <p className="text-sm font-bold text-emerald-400">{item.progress}</p>
                    </div>
                    <button 
                      onClick={() => alert(`Abriendo detalles de ${item.title}`)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition cursor-pointer border border-neutral-700 shadow-sm"
                    >
                      Ver Desglose
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-12 text-center space-y-4 backdrop-blur-xl shadow-xl">
              <Calculator className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No se encontraron presupuestos</h3>
              <p className="text-sm text-neutral-400">Intenta con otra búsqueda o crea uno nuevo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Nuevo Presupuesto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">Crear Nuevo Presupuesto</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Título de la Obra / Proyecto</label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Construcción de locales..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Categoría</label>
                  <input 
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ej: Obra Civil, Infraestructura..."
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Costo Total ($)</label>
                  <input 
                    type="number"
                    required
                    value={totalCostValue}
                    onChange={(e) => setTotalCostValue(e.target.value)}
                    placeholder="Ej: 14500000"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Avance (%)</label>
                  <input 
                    type="text"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    placeholder="Ej: 35%"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white focus:outline-none transition"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En ejecución">En ejecución</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Descripción</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalle de los trabajos o materiales..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-emerald-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Guardar Presupuesto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  )
}