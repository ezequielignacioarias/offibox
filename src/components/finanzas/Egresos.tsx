'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingDown, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Search, 
  X,
  Edit3,
  Trash2,
  Download,
  Calendar,
  Tag,
  Building2
} from 'lucide-react'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '@/context/OrganizationContext' // <--- Importamos el contexto global

const supabase = createBrowserSupabaseClient()

export default function EgresosTab() {
  const { orgId, loading: orgLoading } = useOrganization() // <--- Obtenemos el orgId

  const [egresos, setEgresos] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'Pendiente' | 'Pagado'>('todos')
  const [periodFilter, setPeriodFilter] = useState<'todos' | 'mes_actual' | 'mes_pasado'>('mes_actual')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [supplier, setSupplier] = useState('')
  const [cuit, setCuit] = useState('')
  const [concept, setConcept] = useState('')
  const [amountValue, setAmountValue] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [category, setCategory] = useState('Servicios y Red')
  const [status, setStatus] = useState('Pagado')
  const [dateText, setDateText] = useState('')

  useEffect(() => {
    if (orgLoading) return
    fetchData()
  }, [orgId, orgLoading])

  async function fetchData() {
    let query = supabase
      .from('egresos')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtrar de forma multi-tenant usando el contexto global de la organización
    if (orgId) {
      query = query.eq('organization_id', orgId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error al cargar egresos:', error)
    } else {
      setEgresos(data || [])
    }
    setIsLoaded(true)
  }

  const handleSaveEgreso = async (e: React.FormEvent) => {
    e.preventDefault()

    const numericAmount = parseFloat(amountValue) || 0
    const formattedAmountText = numericAmount.toLocaleString('es-AR') + ` ${currency}`

    const payload = {
      organization_id: orgId || null, // <--- Asignamos la organización al guardar
      supplier,
      cuit,
      concept,
      amount_value: numericAmount,
      amount_text: formattedAmountText,
      currency,
      category,
      status,
      date_text: dateText || new Date().toLocaleDateString('es-AR')
    }

    if (editingId) {
      const { error } = await supabase
        .from('egresos')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        console.error('Error al actualizar:', error)
        alert('No se pudo actualizar el egreso.')
      } else {
        setEgresos(egresos.map(e => e.id === editingId ? { ...e, ...payload } : e))
        closeModal()
      }
    } else {
      const { data, error } = await supabase
        .from('egresos')
        .insert([payload])
        .select()

      if (error) {
        console.error('Error al guardar egreso:', error)
        alert(`No se pudo guardar: ${error.message || 'Error desconocido'}`)
      } else if (data) {
        setEgresos([data[0], ...egresos])
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este egreso?')) {
      const { error } = await supabase.from('egresos').delete().eq('id', id)
      if (error) {
        alert('No se pudo eliminar el registro.')
      } else {
        setEgresos(egresos.filter(e => e.id !== id))
      }
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Pagado' ? 'Pendiente' : 'Pagado'
    const { error } = await supabase
      .from('egresos')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      setEgresos(egresos.map(e => e.id === id ? { ...e, status: newStatus } : e))
    }
  }

  const openEditModal = (item: any) => {
    setEditingId(item.id)
    setSupplier(item.supplier || '')
    setCuit(item.cuit || '')
    setConcept(item.concept || '')
    setAmountValue(item.amount_value || '')
    setCurrency(item.currency || 'ARS')
    setCategory(item.category || 'Servicios y Red')
    setStatus(item.status || 'Pagado')
    setDateText(item.date_text || '')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setSupplier('')
    setCuit('')
    setConcept('')
    setAmountValue('')
    setCurrency('ARS')
    setCategory('Servicios y Red')
    setStatus('Pagado')
    setDateText('')
  }

  const exportToCSV = () => {
    const headers = "Proveedor,CUIT,Concepto,Categoria,Monto,Moneda,Estado,Fecha\n"
    const rows = filteredEgresos.map(e => 
      `"${e.supplier || ''}","${e.cuit || ''}","${e.concept || ''}","${e.category || ''}",${e.amount_value || 0},"${e.currency || 'ARS'}","${e.status || ''}","${e.date_text || ''}"`
    ).join("\n")

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `egresos_offibox_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredEgresos = egresos.filter(item => {
    const matchesSearch = 
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cuit && item.cuit.includes(searchTerm)) ||
      (item.concept && item.concept.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTab = activeTab === 'todos' ? true : item.status === activeTab
    
    let matchesPeriod = true
    if (item.created_at) {
      const itemDate = new Date(item.created_at)
      const now = new Date()
      if (periodFilter === 'mes_actual') {
        matchesPeriod = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      } else if (periodFilter === 'mes_pasado') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        matchesPeriod = itemDate.getMonth() === lastMonth.getMonth() && itemDate.getFullYear() === lastMonth.getFullYear()
      }
    }

    return matchesSearch && matchesTab && matchesPeriod
  })

  const totalPagadoARS = egresos
    .filter(e => e.status === 'Pagado' && (!e.currency || e.currency === 'ARS'))
    .reduce((acc, curr) => acc + (Number(curr.amount_value) || 0), 0)

  const totalPendienteARS = egresos
    .filter(e => e.status === 'Pendiente' && (!e.currency || e.currency === 'ARS'))
    .reduce((acc, curr) => acc + (Number(curr.amount_value) || 0), 0)

  if (orgLoading) {
    return (
      <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
        <p className="text-neutral-400 text-sm">Cargando organización...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Control de Egresos</h2>
          <p className="text-xs text-neutral-400">Gastos operativos, servicios y pagos a proveedores</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-xl transition cursor-pointer text-xs font-medium"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>CSV</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition cursor-pointer text-xs font-semibold shadow-lg shadow-red-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Egreso</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1">Gastos Pagados (ARS)</p>
            <h3 className="text-2xl font-bold text-white">${totalPagadoARS.toLocaleString('es-AR')} ARS</h3>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1">Gastos Pendientes (ARS)</p>
            <h3 className="text-2xl font-bold text-amber-400">${totalPendienteARS.toLocaleString('es-AR')} ARS</h3>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-neutral-400 mb-1">Total Movimientos</p>
            <h3 className="text-2xl font-bold text-white">{egresos.length} Registros</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800/80 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('todos')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${activeTab === 'todos' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-400 hover:text-white'}`}
            >
              Todos ({egresos.length})
            </button>
            <button
              onClick={() => setActiveTab('Pendiente')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${activeTab === 'Pendiente' ? 'bg-neutral-800 text-amber-400 shadow' : 'text-neutral-400 hover:text-white'}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveTab('Pagado')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${activeTab === 'Pagado' ? 'bg-neutral-800 text-red-400 shadow' : 'text-neutral-400 hover:text-white'}`}
            >
              Pagados
            </button>
          </div>

          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setPeriodFilter('todos')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${periodFilter === 'todos' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              Histórico
            </button>
            <button
              onClick={() => setPeriodFilter('mes_actual')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${periodFilter === 'mes_actual' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-400 hover:text-white'}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Mes Actual</span>
            </button>
            <button
              onClick={() => setPeriodFilter('mes_pasado')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${periodFilter === 'mes_pasado' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-400 hover:text-white'}`}
            >
              <span>Mes Pasado</span>
            </button>
          </div>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por proveedor, concepto, categoría..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 focus:border-red-500/50 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="space-y-4">
        {!isLoaded ? (
          <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
            <p className="text-neutral-400 text-sm">Cargando egresos...</p>
          </div>
        ) : filteredEgresos.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
            <p className="text-neutral-400 text-sm">No se encontraron egresos con los filtros actuales.</p>
          </div>
        ) : (
          filteredEgresos.map((item) => {
            const badgeStyle = item.status === 'Pagado' 
              ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/25'

            return (
              <div 
                key={item.id}
                className="bg-neutral-900/80 border border-neutral-800/80 hover:border-red-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{item.supplier}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                      {item.status}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
                      {item.currency || 'ARS'}
                    </span>
                    {item.cuit && (
                      <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        CUIT: {item.cuit}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-400">{item.concept}</p>
                  <p className="text-xs text-neutral-500">{item.date_text}</p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-neutral-400">Monto</p>
                    <p className="text-lg font-black text-red-400">
                      -${Number(item.amount_value || 0).toLocaleString('es-AR')} {item.currency || 'ARS'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      title={item.status === 'Pagado' ? 'Marcar pendiente' : 'Marcar pagado'}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        item.status === 'Pagado' 
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20' 
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs transition cursor-pointer border border-neutral-700 shadow-sm"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs transition cursor-pointer border border-red-500/20 shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-24 pb-12 px-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Editar Egreso' : 'Registrar Nuevo Egreso'}</h3>
              <button 
                onClick={closeModal}
                className="text-neutral-400 hover:text-white transition p-1 rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEgreso} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Proveedor / Acreedor</label>
                  <input 
                    type="text" 
                    required
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="Ej. Proveedor de Internet"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">CUIT (Opcional)</label>
                  <input 
                    type="text" 
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    placeholder="Ej. 30712345678"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Concepto del Gasto</label>
                <input 
                  type="text" 
                  required
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder="Ej. Abono fibra óptica mensual"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Monto</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={amountValue}
                    onChange={(e) => setAmountValue(e.target.value)}
                    placeholder="45000"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Moneda</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="ARS">ARS ($ Pesos)</option>
                    <option value="USD">USD ($ Dólares)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Categoría</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Servicios y Red">Servicios y Red</option>
                    <option value="Infraestructura / Hardware">Infraestructura / Hardware</option>
                    <option value="Software / Licencias">Software / Licencias</option>
                    <option value="Impuestos y Tasas">Impuestos y Tasas</option>
                    <option value="Honorarios / Profesionales">Honorarios / Profesionales</option>
                    <option value="Otros Gastos">Otros Gastos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Estado</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Pagado">Pagado</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Fecha o Vencimiento (Texto)</label>
                <input 
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  placeholder="Ej. Pagado el 10 de Agosto"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-lg"
                >
                  {editingId ? 'Guardar Cambios' : 'Guardar Egreso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}