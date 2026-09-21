'use client'

import { useState, useEffect } from 'react'
import { User, Lock, Mail, CheckCircle2, AlertCircle, Save } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

const supabase = createBrowserSupabaseClient()

export default function PerfilSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        setFullName(user.user_metadata?.full_name || '')
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al actualizar el perfil.' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' })
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' })
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error al actualizar la contraseña.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
        <p className="text-neutral-400 text-xs">Cargando información del perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-800/80">
        <h2 className="text-lg font-bold text-white">Configuración de la Cuenta</h2>
        <p className="text-xs text-neutral-400">Administra tus datos personales, credenciales y seguridad de acceso.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Datos Personales */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Datos Personales</h3>
              <p className="text-[11px] text-neutral-400">Actualiza tu nombre visible</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="text-neutral-400 mb-1 block">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  type="email" 
                  disabled 
                  value={email} 
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-500 cursor-not-allowed" 
                />
              </div>
              <span className="text-[10px] text-neutral-500 mt-1 block">El correo está vinculado a tu autenticación y no puede modificarse directamente.</span>
            </div>

            <div>
              <label className="text-neutral-400 mb-1 block">Nombre completo o alias</label>
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Tu nombre"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-blue-500" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-lg shadow-blue-600/20"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Seguridad / Contraseña */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Seguridad</h3>
              <p className="text-[11px] text-neutral-400">Modifica tu contraseña de acceso</p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
            <div>
              <label className="text-neutral-400 mb-1 block">Nueva contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500" 
              />
            </div>

            <div>
              <label className="text-neutral-400 mb-1 block">Confirmar nueva contraseña</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Repite la contraseña"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-500" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold transition cursor-pointer border border-neutral-700"
              >
                <Lock className="w-4 h-4" />
                <span>{saving ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}