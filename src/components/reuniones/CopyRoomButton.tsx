'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'

interface CopyRoomButtonProps {
  roomUrl: string
}

export default function CopyRoomButton({ roomUrl }: CopyRoomButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roomUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-xl p-3 px-4 shadow-inner gap-3">
      <span className="text-sm text-blue-400 font-mono truncate">
        {roomUrl}
      </span>
      
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Copiar enlace al portapapeles"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>Copiar</span>
            </>
          )}
        </button>

        <a 
          href={roomUrl} 
          target="_blank" 
          rel="noreferrer"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-emerald-900/20"
        >
          <span>Abrir Sala</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}