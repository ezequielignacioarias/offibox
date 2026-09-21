// src/app/(app)/layout.tsx
'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-neutral-950 text-white">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <Navbar 
        isSidebarOpen={isSidebarOpen} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <main className={`pt-20 p-6 transition-all duration-300 w-full ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  )
}