'use client'

import React, { createContext, useContext, useState } from 'react'

interface CommandContextType {
  open: boolean
  setOpen: (open: boolean) => void
  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
}

const CommandContext = createContext<CommandContextType | undefined>(undefined)

export function CommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <CommandContext.Provider value={{ open, setOpen, isCreateOpen, setIsCreateOpen }}>
      {children}
    </CommandContext.Provider>
  )
}

export function useCommand() {
  const context = useContext(CommandContext)
  if (!context) {
    throw new Error('useCommand debe usarse dentro de un CommandProvider')
  }
  return context
}