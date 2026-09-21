import { ReactNode } from 'react'
import PageBackground from '@/components/PageBackground'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`flex-1 overflow-y-auto bg-[#030712] text-white px-4 md:px-8 pt-6 pb-8 relative flex flex-col justify-between ${className}`}>
      
      {/* Componente de fondo */}
      <PageBackground />

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto w-full space-y-6 relative z-10 flex-1">
        {children}
      </div>

      {/* Pie de página unificado */}
      <footer className="max-w-6xl mx-auto w-full text-center py-6 text-xs text-neutral-500 relative z-10 border-t border-neutral-800/80 mt-12">
        Offibox Virtual Workspace • Todos los derechos reservados
      </footer>
    </div>
  )
}