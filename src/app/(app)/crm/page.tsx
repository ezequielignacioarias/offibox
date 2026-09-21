'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, 
  ArrowLeft, 
  Plus, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Search,
  Mail,
  Phone,
  X,
  Loader2
} from 'lucide-react'

// Cliente de Supabase para el navegador
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

// Importamos la Server Action de creación
import { createContact } from './actions'

// Componentes UI unificados
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'

interface Contact {
  id: string
  name: string
  contact_person: string
  email: string
  phone: string
  stage: string
  value: string
  type: string
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  // 1. SEGURIDAD ADICIONAL: Verificar sesión y escuchar cambios de auth en tiempo real
  useEffect(() => {
    async function checkUserSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login' // Forzar recarga limpia al login si no hay sesión
      }
    }

    checkUserSession()

    // Escuchar si la sesión se cerró en otra pestaña o mediante el botón de atrás
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/auth/login'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Cargar contactos reales desde Supabase al montar el componente
  useEffect(() => {
    async function fetchContacts() {
      try {
        const { data, error } = await supabase
          .from('crm_contacts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error al cargar contactos:', error.message)
        } else if (data) {
          setContacts(data)
        }
      } catch (err) {
        console.error('Error de conexión:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchContacts()
  }, [supabase])

  // Manejar la creación usando la Server Action multi-tenant
  const handleSubmitAction = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createContact(formData)
        
        const { data } = await supabase
          .from('crm_contacts')
          .select('*')
          .order('created_at', { ascending: false })

        if (data) setContacts(data)
        
        setIsModalOpen(false)
      } catch (err: any) {
        alert('Ocurrió un error al guardar: ' + err.message)
      }
    })
  }

  const filteredContacts = contacts.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.stage?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getBadgeStyle = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'cerrado':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'negociación':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  return (
    <PageContainer>
      <PageHeader 
        icon={Briefcase}
        title="CRM y Ventas"
        description="Gestión de prospectos, cartera de clientes y seguimiento comercial"
        iconTheme="text-blue-400 bg-blue-500/10 border-blue-500/20"
        actions={
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition cursor-pointer text-sm font-semibold shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Contacto</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Total Prospectos / Leads</p>
              <h3 className="text-2xl font-bold text-white">{contacts.length} Activos</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Base de Datos</p>
              <h3 className="text-2xl font-bold text-white">Sincronizada</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-neutral-400 mb-1">Estado del Sistema</p>
              <h3 className="text-2xl font-bold text-emerald-400">Operativo</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-neutral-900/80 border border-neutral-800/80 p-4 rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, empresa, correo o estado..."
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
            />
          </div>
          <div className="text-xs text-neutral-400 font-medium px-2 text-right">
            Mostrando <span className="text-white font-bold">{filteredContacts.length}</span> contactos
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-12 text-center space-y-4 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-sm text-neutral-400">Cargando contactos desde la base de datos...</p>
            </div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                className="bg-neutral-900/80 border border-neutral-800/80 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 shadow-xl backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{contact.name}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(contact.stage)}`}>
                      {contact.stage}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-400" /> {contact.contact_person || 'Sin contacto'}</span>
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-neutral-400" /> {contact.email || 'Sin correo'}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-neutral-400" /> {contact.phone || 'Sin teléfono'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-800">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-neutral-400">Valor Estimado</p>
                    <p className="text-lg font-black text-white">{contact.value || '$0'}</p>
                  </div>
                  <button 
                    onClick={() => alert(`Abriendo perfil comercial de ${contact.name}`)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition cursor-pointer border border-neutral-700 shadow-sm"
                  >
                    Ver Ficha
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-12 text-center space-y-4 backdrop-blur-xl shadow-xl">
              <Briefcase className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No se encontraron contactos</h3>
              <p className="text-sm text-neutral-400">Prueba con otra búsqueda o añade un nuevo prospecto haciendo clic arriba.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Añadir Nuevo Contacto</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleSubmitAction} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Nombre de la Empresa / Cliente *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Ej: Estudio V&A"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Persona de Contacto</label>
                  <input 
                    type="text" 
                    name="contactPerson" 
                    placeholder="Ej: Valeria Alonso"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="valeria@arqva.com"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Teléfono</label>
                  <input 
                    type="text" 
                    name="phone" 
                    placeholder="+54 9 341..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Valor Estimado</label>
                  <input 
                    type="text" 
                    name="value" 
                    placeholder="$2,500,000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Etapa Comercial</label>
                  <select name="stage" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                    <option value="Prospecto">Prospecto</option>
                    <option value="Negociación">Negociación</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Tipo de Cliente</label>
                  <select name="type" className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500">
                    <option value="Cliente Empresa">Cliente Empresa</option>
                    <option value="Empresa Pyme">Empresa Pyme</option>
                    <option value="Independiente">Independiente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isPending ? 'Guardando...' : 'Guardar Contacto'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  )
}