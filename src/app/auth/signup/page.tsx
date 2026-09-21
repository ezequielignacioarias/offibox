'use client'

import { useActionState, useState } from 'react'
import { signup as signUpAction } from '@/app/auth/actions'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const initialState = {
  error: '',
}

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo técnico con cuadrícula */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }} 
      />

      <div className="w-full max-w-md bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black tracking-tight mb-2">Crear cuenta en Offibox</h1>
          <p className="text-sm text-neutral-400">Configura tu espacio de trabajo multi-tenant</p>
        </div>

        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Nombre Completo o Empresa</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </span>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Tu Nombre o Nombre de tu Workspace"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </span>
              
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-12 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 transition text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? 'Creando espacio...' : 'Registrarse'}
            {!isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          ¿Ya tienes una cuenta?{' '}
          {/* Corregido de /login a /auth/login para evitar el error 404 */}
          <Link href="/auth/login" className="text-blue-400 hover:underline font-medium">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}