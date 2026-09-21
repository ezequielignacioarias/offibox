'use client'

import { logout } from '@/app/auth/actions'
import { LogOut, Loader2 } from 'lucide-react'
import { useTransition } from 'react'

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await logout()
        })
      }}
      disabled={isPending}
      className="p-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center justify-center"
      title="Cerrar sesión"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
    </button>
  )
}