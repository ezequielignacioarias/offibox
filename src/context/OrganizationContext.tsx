'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client' // <--- Ruta corregida

const supabase = createBrowserSupabaseClient()

interface OrgContextType {
  orgId: string | null;
  setOrgId: (id: string | null) => void;
  loading: boolean;
}

const OrganizationContext = createContext<OrgContextType>({
  orgId: null,
  setOrgId: () => {},
  loading: true,
})

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadUserOrganization() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Buscamos la organización asociada al usuario en Supabase
          const { data: memberData, error } = await supabase
            .from('organization_members')
            .select('organization_id')
            .eq('user_id', user.id)
            .limit(1)
            .single()

          if (!error && memberData) {
            setOrgId(memberData.organization_id)
          } else {
            // Fallback a la primera organización disponible si no hay relación directa
            const { data: orgData } = await supabase
              .from('organizations')
              .select('id')
              .limit(1)
              .single()
            
            if (orgData) {
              setOrgId(orgData.id)
            }
          }
        }
      } catch (err) {
        console.error('Error cargando organización:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserOrganization()
  }, [])

  return (
    <OrganizationContext.Provider value={{ orgId, setOrgId, loading }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  return useContext(OrganizationContext)
}