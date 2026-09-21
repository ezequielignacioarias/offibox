import { ReactNode, ElementType } from 'react'

interface PageHeaderProps {
  icon?: ElementType
  title: string
  description?: string
  actions?: ReactNode
  iconTheme?: string 
}

export default function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  actions, 
  iconTheme = 'bg-blue-600/10 border-blue-500/20 text-blue-400' 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-inner shrink-0 ${iconTheme}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {description && <p className="text-xs text-neutral-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 w-full md:w-auto justify-end">{actions}</div>}
    </div>
  )
}