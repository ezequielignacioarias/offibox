'use client'

import { X } from 'lucide-react'

interface FinanzasModalProps {
  isOpen: boolean
  editingId: string | null
  activeModule: 'ingresos' | 'egresos' | 'dashboard'
  formData: {
    entityName: string
    cuit: string
    concept: string
    amountValue: string
    currency: string
    category: string
    status: string
    dateText: string
  }
  setFormData: (data: any) => void
  onClose: () => void
  onSave: (e: React.FormEvent) => void
}

export default function FinanzasModal({
  isOpen,
  editingId,
  activeModule,
  formData,
  setFormData,
  onClose,
  onSave
}: FinanzasModalProps) {
  if (!isOpen) return null

  const isIngreso = activeModule === 'ingresos'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              {editingId ? `Editar ${isIngreso ? 'Ingreso' : 'Egreso'}` : `Nuevo ${isIngreso ? 'Ingreso' : 'Egreso'}`}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Completa los datos del registro financiero
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              {isIngreso ? 'Cliente' : 'Proveedor'}
            </label>
            <input 
              type="text"
              required
              value={formData.entityName}
              onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
              placeholder={isIngreso ? 'Ej: Empresa Cliente S.A.' : 'Ej: Proveedor Servicios'}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
            />
          </div>

          {!isIngreso && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">CUIT (Opcional)</label>
              <input 
                type="text"
                value={formData.cuit}
                onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                placeholder="Ej: 20-12345678-9"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Concepto</label>
            <input 
              type="text"
              required
              value={formData.concept}
              onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              placeholder="Ej: Honorarios profesionales / Compra de insumos"
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
            />
          </div>

          {!isIngreso && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white focus:outline-none transition"
              >
                <option value="Servicios y Red">Servicios y Red</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Software y Licencias">Software y Licencias</option>
                <option value="Impuestos y Tasas">Impuestos y Tasas</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Monto (Valor numérico)</label>
              <input 
                type="number"
                step="any"
                required
                value={formData.amountValue}
                onChange={(e) => setFormData({ ...formData, amountValue: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Moneda</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white focus:outline-none transition"
              >
                <option value="ARS">ARS ($)</option>
                <option value="USD">USD (US$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white focus:outline-none transition"
              >
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Fecha (Texto o DD/MM/AAAA)</label>
              <input 
                type="text"
                value={formData.dateText}
                onChange={(e) => setFormData({ ...formData, dateText: e.target.value })}
                placeholder="Ej: 25/08/2026"
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-blue-500/50 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-blue-600/20"
            >
              {editingId ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}