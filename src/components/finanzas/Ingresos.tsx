'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Calendar, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  X, 
  Download 
} from 'lucide-react'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { useOrganization } from '@/context/OrganizationContext' // <--- Importamos el contexto global

const supabase = createBrowserSupabaseClient()

export default function IngresosModule() {
  const { orgId, loading: orgLoading } = useOrganization() // <--- Obtenemos el orgId

  const [cobros, setCobros] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusTab, setStatusTab] = useState<'todos' | 'Pendiente' | 'Cobrado'>('todos')
  const [periodFilter, setPeriodFilter] = useState<'todos' | 'mes_actual' | 'mes_pasado'>('todos')

  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false)
  const [fiscalCuit, setFiscalCuit] = useState('20333333332')
  const [puntoVenta, setPuntoVenta] = useState('1')
  const [isTestMode, setIsTestMode] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [client, setClient] = useState('')
  const [cuit, setCuit] = useState('')
  const [concept, setConcept] = useState('')
  const [amountValue, setAmountValue] = useState('')
  const [currency, setCurrency] = useState('ARS')
  const [method, setMethod] = useState('Transferencia Bancaria')
  const [status, setStatus] = useState('Pendiente')
  const [dateText, setDateText] = useState('')

  useEffect(() => {
    if (orgLoading) return
    fetchData()
  }, [orgId, orgLoading])

  async function fetchData() {
    let cobrosQuery = supabase.from('cobros').select('*').order('created_at', { ascending: false })
    let contactsQuery = supabase.from('crm_contacts').select('*')

    // Aplicar filtro multi-tenant con el ID real de la organización
    if (orgId) {
      cobrosQuery = cobrosQuery.eq('organization_id', orgId)
      contactsQuery = contactsQuery.eq('organization_id', orgId)
    }

    const [cobrosRes, contactsRes] = await Promise.all([cobrosQuery, contactsQuery])

    if (!cobrosRes.error) setCobros(cobrosRes.data || [])
    if (!contactsRes.error) setContacts(contactsRes.data || [])
    setIsLoaded(true)
  }

  const handleClientSelect = (selectedName: string) => {
    setClient(selectedName)
    const found = contacts.find(c => (c.name || c.client || '') === selectedName)
    if (found && found.cuit) setCuit(found.cuit)
  }

  const handleSaveCobro = async (e: React.FormEvent) => {
    e.preventDefault()

    const numericAmount = parseFloat(amountValue) || 0
    const formattedAmountText = numericAmount.toLocaleString('es-AR') + ` ${currency}`

    const payload = {
      organization_id: orgId || null, // <--- Inyectamos la organización actual al guardar
      client,
      cuit,
      concept,
      amount_value: numericAmount,
      amount_text: formattedAmountText,
      currency,
      method,
      status,
      date_text: dateText || new Date().toLocaleDateString('es-AR')
    }

    if (editingId) {
      const { error } = await supabase.from('cobros').update(payload).eq('id', editingId)
      if (!error) {
        setCobros(cobros.map(c => c.id === editingId ? { ...c, ...payload } : c))
        closeModal()
      }
    } else {
      const { data, error } = await supabase.from('cobros').insert([payload]).select()
      if (!error && data) {
        setCobros([data[0], ...cobros])
        closeModal()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este ingreso?')) {
      const { error } = await supabase.from('cobros').delete().eq('id', id)
      if (!error) setCobros(cobros.filter(c => c.id !== id))
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Cobrado' ? 'Pendiente' : 'Cobrado'
    const { error } = await supabase.from('cobros').update({ status: newStatus }).eq('id', id)
    if (!error) setCobros(cobros.map(c => c.id === id ? { ...c, status: newStatus } : c))
  }

  const handleWhatsAppReminder = (item: any) => {
    const text = encodeURIComponent(
      `Hola *${item.client}*, te escribo para recordarte el pago pendiente por concepto de *"${item.concept}"* por un total de *$${Number(item.amount_value || 0).toLocaleString('es-AR')} ${item.currency || 'ARS'}*.`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleFacturarARCA = async (item: any) => {
    if (!isTestMode) return alert('El Modo Pruebas está desactivado.')
    const mockCae = '74125' + Math.floor(1000000000 + Math.random() * 9000000000)
    const mockVoucher = `000${puntoVenta}-000000${item.id.slice(-2)}`

    const { error } = await supabase
      .from('cobros')
      .update({ facturado: true, cae: mockCae, voucher_number: mockVoucher })
      .eq('id', item.id)

    if (!error) {
      setCobros(cobros.map(c => c.id === item.id ? { ...c, facturado: true, cae: mockCae, voucher_number: mockVoucher } : c))
      alert(`¡Factura simulada autorizada! CAE: ${mockCae}`)
    }
  }

  const exportToCSV = () => {
    const headers = "Cliente,CUIT,Concepto,Monto,Moneda,Metodo,Estado,Facturado\n"
    const rows = cobros.map(c => 
      `"${c.client || ''}","${c.cuit || ''}","${c.concept || ''}",${c.amount_value || 0},"${c.currency || 'ARS'}","${c.method || ''}","${c.status || ''}",${c.facturado ? 'SI' : 'NO'}`
    ).join("\n")

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `ingresos_offibox.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filterByPeriod = (item: any) => {
    if (periodFilter === 'todos') return true
    if (!item.created_at) return false
    const itemDate = new Date(item.created_at)
    const now = new Date()

    if (periodFilter === 'mes_actual') {
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
    }
    if (periodFilter === 'mes_pasado') {
      const past = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return itemDate.getMonth() === past.getMonth() && itemDate.getFullYear() === past.getFullYear()
    }
    return true
  }

  const filteredCobros = cobros.filter(item => {
    const matchesSearch = 
      (item.client && item.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.cuit && item.cuit.includes(searchTerm)) ||
      (item.concept && item.concept.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesTab = statusTab === 'todos' ? true : item.status === statusTab
    return matchesSearch && matchesTab && filterByPeriod(item)
  })

  const openEditModal = (cobro: any) => {
    setEditingId(cobro.id)
    setClient(cobro.client || '')
    setCuit(cobro.cuit || '')
    setConcept(cobro.concept || '')
    setAmountValue(cobro.amount_value || '')
    setCurrency(cobro.currency || 'ARS')
    setMethod(cobro.method || 'Transferencia Bancaria')
    setStatus(cobro.status || 'Pendiente')
    setDateText(cobro.date_text || '')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setClient('')
    setCuit('')
    setConcept('')
    setAmountValue('')
    setCurrency('ARS')
    setMethod('Transferencia Bancaria')
    setStatus('Pendiente')
    setDateText('')
  }

  const totalCobrado = cobros.filter(c => c.status === 'Cobrado').reduce((a, b) => a + (Number(b.amount_value) || 0), 0)
  const totalPendiente = cobros.filter(c => c.status === 'Pendiente').reduce((a, b) => a + (Number(b.amount_value) || 0), 0)

  if (orgLoading) {
    return (
      <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
        <p className="text-neutral-400 text-sm">Cargando organización...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/80">
        <div>
          <h2 className="text-lg font-bold text-white">Módulo de Ingresos y Facturación</h2>
          <p className="text-xs text-neutral-400">Control de cobros, conexión ARCA y sincronización con CRM</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setIsFiscalModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-medium cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ARCA</span>
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl text-xs font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>CSV</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Ingreso</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 mb-1">Total Cobrado</p>
            <h3 className="text-xl font-bold text-emerald-400">${totalCobrado.toLocaleString('es-AR')} ARS</h3>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 mb-1">Total Pendiente</p>
            <h3 className="text-xl font-bold text-amber-400">${totalPendiente.toLocaleString('es-AR')} ARS</h3>
          </div>
          <Clock className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button onClick={() => setStatusTab('todos')} className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${statusTab === 'todos' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}>Todos</button>
            <button onClick={() => setStatusTab('Pendiente')} className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${statusTab === 'Pendiente' ? 'bg-neutral-800 text-amber-400' : 'text-neutral-400'}`}>Pendientes</button>
            <button onClick={() => setStatusTab('Cobrado')} className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer ${statusTab === 'Cobrado' ? 'bg-neutral-800 text-emerald-400' : 'text-neutral-400'}`}>Cobrados</button>
          </div>

          <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button onClick={() => setPeriodFilter('todos')} className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${periodFilter === 'todos' ? 'bg-neutral-800 text-white' : 'text-neutral-400'}`}>Histórico</button>
            <button onClick={() => setPeriodFilter('mes_actual')} className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${periodFilter === 'mes_actual' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-400'}`}>Mes Actual</button>
            <button onClick={() => setPeriodFilter('mes_pasado')} className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${periodFilter === 'mes_pasado' ? 'bg-neutral-800 text-blue-400' : 'text-neutral-400'}`}>Mes Pasado</button>
          </div>
        </div>

        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, CUIT o concepto..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {!isLoaded ? (
          <p className="text-center py-12 text-neutral-400">Cargando ingresos...</p>
        ) : filteredCobros.length === 0 ? (
          <p className="text-center py-12 text-neutral-400">No hay ingresos registrados.</p>
        ) : (
          filteredCobros.map((item) => (
            <div key={item.id} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-base font-bold text-white">{item.client}</h3>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${item.status === 'Cobrado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{item.concept}</p>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                <span className="text-lg font-bold text-emerald-400">+${Number(item.amount_value || 0).toLocaleString('es-AR')} {item.currency || 'ARS'}</span>
                <div className="flex items-center gap-2">
                  {item.status === 'Pendiente' && (
                    <button onClick={() => handleWhatsAppReminder(item)} className="p-2 bg-emerald-600/20 text-emerald-400 rounded-xl hover:bg-emerald-600/30 cursor-pointer" title="WhatsApp">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleToggleStatus(item.id, item.status)} className="p-2 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 cursor-pointer" title="Cambiar Estado">
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  {!item.facturado ? (
                    <button onClick={() => handleFacturarARCA(item)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-xl text-xs font-semibold cursor-pointer">
                      Facturar
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      Facturado
                    </span>
                  )}
                  <button onClick={() => openEditModal(item)} className="p-2 bg-neutral-800 text-neutral-300 rounded-xl hover:bg-neutral-700 cursor-pointer" title="Editar">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isFiscalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white">Configuración Fiscal ARCA</h3>
              <button onClick={() => setIsFiscalModalOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-neutral-950 border border-neutral-800 rounded-xl">
                <span>Modo Pruebas (Homologación)</span>
                <button type="button" onClick={() => setIsTestMode(!isTestMode)} className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isTestMode ? 'bg-emerald-600' : 'bg-neutral-800'}`}>
                  <div className={`bg-white w-3.5 h-3.5 rounded-full transform transition-transform ${isTestMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div>
                <label className="text-neutral-400 mb-1 block">CUIT Emisor</label>
                <input type="text" value={fiscalCuit} onChange={(e) => setFiscalCuit(e.target.value)} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setIsFiscalModalOpen(false)} className="px-3 py-2 bg-emerald-600 text-white rounded-xl cursor-pointer">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white">{editingId ? 'Editar Ingreso' : 'Registrar Ingreso'}</h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveCobro} className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 mb-1 block">Cliente / Contacto CRM</label>
                <select onChange={(e) => handleClientSelect(e.target.value)} value={client} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white mb-1.5 cursor-pointer">
                  <option value="">-- Seleccionar CRM --</option>
                  {contacts.map((c, idx) => <option key={idx} value={c.name || c.client}>{c.name || c.client}</option>)}
                </select>
                <input type="text" required value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nombre del cliente" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white" />
              </div>
              <div>
                <label className="text-neutral-400 mb-1 block">Concepto</label>
                <input type="text" required value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="Concepto del cobro" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-neutral-400 mb-1 block">Monto</label>
                  <input type="number" step="0.01" required value={amountValue} onChange={(e) => setAmountValue(e.target.value)} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white" />
                </div>
                <div>
                  <label className="text-neutral-400 mb-1 block">Moneda</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white cursor-pointer">
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button type="button" onClick={closeModal} className="px-3 py-2 bg-neutral-800 text-white rounded-xl cursor-pointer">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold cursor-pointer">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}