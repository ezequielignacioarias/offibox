'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ==========================================
// ACCIONES PARA INGRESOS
// ==========================================

export async function registrarIngreso(formData: FormData) {
  const supabase = await createClient()

  const descripcion = formData.get('descripcion') as string
  const monto = parseFloat(formData.get('monto') as string)
  const categoria = formData.get('categoria') as string
  const fecha = formData.get('fecha') as string

  // Validación básica
  if (!descripcion || isNaN(monto) || !fecha) {
    return { error: 'Por favor, completa todos los campos obligatorios.' }
  }

  const { error } = await supabase.from('ingresos').insert([
    {
      descripcion,
      monto,
      categoria,
      fecha,
    },
  ])

  if (error) {
    console.error('Error al registrar ingreso:', error.message)
    return { error: 'Hubo un error al guardar el ingreso en la base de datos.' }
  }

  // Refrescar la ruta para que la interfaz se actualice con los nuevos datos
  revalidatePath('/finanzas')
  return { success: true }
}

export async function eliminarIngreso(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('ingresos').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar ingreso:', error.message)
    return { error: 'No se pudo eliminar el registro.' }
  }

  revalidatePath('/finanzas')
  return { success: true }
}

// ==========================================
// ACCIONES PARA EGRESOS
// ==========================================

export async function registrarEgreso(formData: FormData) {
  const supabase = await createClient()

  const descripcion = formData.get('descripcion') as string
  const monto = parseFloat(formData.get('monto') as string)
  const categoria = formData.get('categoria') as string
  const fecha = formData.get('fecha') as string

  if (!descripcion || isNaN(monto) || !fecha) {
    return { error: 'Por favor, completa todos los campos obligatorios.' }
  }

  const { error } = await supabase.from('egresos').insert([
    {
      descripcion,
      monto,
      categoria,
      fecha,
    },
  ])

  if (error) {
    console.error('Error al registrar egreso:', error.message)
    return { error: 'Hubo un error al guardar el egreso en la base de datos.' }
  }

  revalidatePath('/finanzas')
  return { success: true }
}

export async function eliminarEgreso(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('egresos').delete().eq('id', id)

  if (error) {
    console.error('Error al eliminar egreso:', error.message)
    return { error: 'No se pudo eliminar el registro.' }
  }

  revalidatePath('/finanzas')
  return { success: true }
}