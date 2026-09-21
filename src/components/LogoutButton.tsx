import { logout } from '@/app/auth/actions'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button 
        type="submit"
        className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 group"
      >
        <LogOut className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition" />
        Cerrar sesión
      </button>
    </form>
  )
}