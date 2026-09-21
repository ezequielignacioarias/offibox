import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowLeft, Plus, Download, Folder, Search, ShieldCheck } from 'lucide-react'

// Importamos los componentes de UI unificados
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'

export default async function ArchivePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <PageContainer>
      <PageHeader 
        icon={FileText}
        title="Archivador Digital"
        description="Repositorio seguro de planos, especificaciones y documentación"
        iconTheme="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        actions={
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link 
              href="/inicio"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <button 
              type="button"
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 shadow-lg shadow-cyan-900/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Subir Archivo</span>
            </button>
          </div>
        }
      />

      {/* --- Contenido Principal (Grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Lista de Archivos (Ocupa 2 columnas) */}
        <div className="md:col-span-2 bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-cyan-400" />
                <span>Documentos Recientes</span>
              </h3>
              
              {/* Buscador interno */}
              <div className="relative w-full sm:w-auto">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input 
                  type="text" 
                  placeholder="Filtrar archivos..." 
                  className="w-full sm:w-48 bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition shadow-inner"
                />
              </div>
            </div>

            {/* Lista de Archivos */}
            <div className="space-y-3">
              
              {/* Archivo 1 */}
              <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Plano_Esquina_VictoriaOcampo.dwg</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">CAD</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Distribución de lotes comerciales de 9.07m x 26.35m • 14.2 MB
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                  title="Descargar archivo"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Archivo 2 */}
              <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Esquema_Red_Cat6_PlantaAlta.pdf</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">PDF</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Topología de red, nodos mesh y distribución de 600 MB Claro • 4.8 MB
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                  title="Descargar archivo"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Archivo 3 */}
              <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800/80 rounded-xl p-4 transition hover:border-neutral-700">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Reglamento_Edificio_Y_Mantenimiento.pdf</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Legal</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Normas internas de seguridad y directrices para trabajos en altura • 2.1 MB
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                  title="Descargar archivo"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-xs text-neutral-500 flex items-center justify-between">
            <span>Almacenamiento seguro cifrado</span>
            <span className="text-cyan-400 font-medium">3 archivos indexados</span>
          </div>
        </div>

        {/* Columna Derecha: Estado de Seguridad y Almacenamiento */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Estado del Repositorio</h3>
            </div>
            <p className="text-xs text-neutral-400">
              Información sobre el uso de espacio y respaldos automáticos de la oficina.
            </p>

            {/* Indicador de capacidad */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Espacio utilizado</span>
                <span className="text-white font-medium">21.1 MB / 10 GB</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '2%' }} />
              </div>
              <p className="text-[11px] text-neutral-500">
                Capacidad óptima para planos y documentación técnica.
              </p>
            </div>

            {/* Nota de seguridad */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 space-y-1 shadow-inner">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                Backup Cloud Activo
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Todos los archivos subidos cuentan con copias de seguridad sincronizadas en la infraestructura de red.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-500 text-center">
            Offibox Core Security
          </div>
        </div>

      </div>
    </PageContainer>
  )
}