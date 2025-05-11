import { getSupabaseBrowserClient } from "./supabase"

export interface AppointmentData {
  id?: string
  user_id: string
  patient_name: string
  patient_id: string
  specialty_id: string
  doctor_id?: string | null
  date: string
  time_slot_id: string
  package_id?: string | null
}

export async function getUserAppointments(userId: string) {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error al obtener citas:", error)
    return []
  }

  return data || []
}

export async function createAppointment(appointmentData: AppointmentData) {
  const supabase = getSupabaseBrowserClient()

  // Asegurarse de que los campos opcionales sean null si están vacíos
  const cleanedData = {
    ...appointmentData,
    doctor_id: appointmentData.doctor_id || null,
    package_id: appointmentData.package_id || null,
  }

  console.log("Sending appointment data to Supabase:", cleanedData)

  const { data, error } = await supabase.from("appointments").insert([cleanedData]).select()

  if (error) {
    console.error("Error al crear cita:", error)
    throw new Error(error.message)
  }

  return data?.[0]
}

export async function deleteAppointment(appointmentId: string) {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("appointments").delete().eq("id", appointmentId)

  if (error) {
    console.error("Error al eliminar cita:", error)
    throw new Error(error.message)
  }

  return true
}
