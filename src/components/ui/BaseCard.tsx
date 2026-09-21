import { ReactNode } from 'react'

interface BaseCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function BaseCard({ children, className = '', onClick }: BaseCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-neutral-900/80 border border-neutral-800/80 rounded-2xl p-5 hover:border-neutral-700 transition shadow-lg ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}