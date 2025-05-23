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
  // Status is optional since it might not exist in the database yet
  status?: "pending" | "approved" | "completed" | "cancelled"
  notes?: string
  created_by?: string // ID del usuario que creó la cita (paciente o recepcionista)
}

export interface MedicalNote {
  id?: string
  appointment_id: string
  doctor_id: string
  diagnosis: string
  treatment: string
  notes: string
  follow_up_date?: string
  created_at?: string
}

// Obtener citas del usuario
export async function getUserAppointments(userId: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    if (!userId) {
      throw new Error("ID de usuario es requerido")
    }

    console.log("Fetching appointments for user:", userId)

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching user appointments:", error)
      throw new Error(`Error al obtener citas: ${error.message}`)
    }

    console.log("Fetched appointments:", data)
    return data || []
  } catch (error) {
    console.error("Error in getUserAppointments:", error)
    throw error
  }
}

// Obtener todas las citas (para recepcionista)
export async function getAllAppointments() {
  const supabase = getSupabaseBrowserClient()

  try {
    console.log("Fetching all appointments")

    const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: true })

    if (error) {
      console.error("Error fetching all appointments:", error)
      throw new Error(`Error al obtener todas las citas: ${error.message}`)
    }

    console.log("Fetched all appointments:", data)
    return data || []
  } catch (error) {
    console.error("Error in getAllAppointments:", error)
    throw error
  }
}

// Obtener citas del doctor - Modificado para no filtrar por status
export async function getDoctorAppointments(doctorId: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    if (!doctorId) {
      throw new Error("ID de doctor es requerido")
    }

    console.log("Fetching appointments for doctor:", doctorId)

    // Modificado para no filtrar por status ya que puede no existir la columna
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctor_id", doctorId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching doctor appointments:", error)
      throw new Error(`Error al obtener citas del doctor: ${error.message}`)
    }

    console.log("Fetched doctor appointments:", data)
    return data || []
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error)
    throw error
  }
}

// Crear cita
export async function createAppointment(appointmentData: AppointmentData) {
  const supabase = getSupabaseBrowserClient()

  try {
    // Validar datos antes de enviar
    if (!appointmentData.user_id) {
      throw new Error("ID de usuario es requerido")
    }
    if (!appointmentData.patient_name) {
      throw new Error("Nombre del paciente es requerido")
    }
    if (!appointmentData.specialty_id) {
      throw new Error("Especialidad es requerida")
    }
    if (!appointmentData.date) {
      throw new Error("Fecha es requerida")
    }
    if (!appointmentData.time_slot_id) {
      throw new Error("Horario es requerido")
    }

    // Limpiar datos - asegurar que los campos opcionales sean null si están vacíos
    // Omitimos status y notes si no existen en la base de datos
    const cleanedData = {
      ...appointmentData,
      doctor_id: appointmentData.doctor_id || null,
      package_id: appointmentData.package_id || null,
    }

    // Solo agregamos estos campos si se proporcionan explícitamente
    if (appointmentData.status) {
      cleanedData.status = appointmentData.status
    }
    if (appointmentData.notes) {
      cleanedData.notes = appointmentData.notes
    }
    if (appointmentData.created_by) {
      cleanedData.created_by = appointmentData.created_by
    }

    console.log("Sending cleaned appointment data to Supabase:", cleanedData)

    // Verificar si ya existe una cita en la misma fecha y hora
    const { data: existingAppointments, error: checkError } = await supabase
      .from("appointments")
      .select("*")
      .eq("date", cleanedData.date)
      .eq("time_slot_id", cleanedData.time_slot_id)
      .eq("specialty_id", cleanedData.specialty_id)

    if (checkError) {
      console.error("Error checking existing appointments:", checkError)
      throw new Error("Error al verificar disponibilidad de horarios")
    }

    if (existingAppointments && existingAppointments.length > 0) {
      throw new Error("Este horario ya está ocupado. Por favor, seleccione otro horario.")
    }

    // Crear la cita
    const { data, error } = await supabase.from("appointments").insert([cleanedData]).select()

    if (error) {
      console.error("Error creating appointment in Supabase:", error)

      if (error.code === "23505") {
        throw new Error("Ya existe una cita con estos datos. Por favor, verifique la información.")
      }

      throw new Error(`Error de base de datos: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error("No se pudo crear la cita. Por favor, inténtelo de nuevo.")
    }

    console.log("Appointment created successfully:", data[0])
    return data[0]
  } catch (error) {
    console.error("Error in createAppointment:", error)
    throw error
  }
}

// Actualizar estado de cita (para recepcionista) - Verificamos si existe la columna status
export async function updateAppointmentStatus(appointmentId: string, status: string, notes?: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    if (!appointmentId) {
      throw new Error("ID de cita es requerido")
    }

    console.log("Updating appointment status:", appointmentId, status)

    // Primero verificamos si la columna status existe
    const { data: columnInfo, error: columnError } = await supabase.rpc("check_column_exists", {
      table_name: "appointments",
      column_name: "status",
    })

    if (columnError) {
      console.error("Error checking if status column exists:", columnError)
      // Si hay error, asumimos que la columna no existe y solo actualizamos las notas si se proporcionan
      if (notes) {
        const { data, error } = await supabase.from("appointments").update({ notes }).eq("id", appointmentId).select()

        if (error) {
          console.error("Error updating appointment notes:", error)
          throw new Error(`Error al actualizar notas de cita: ${error.message}`)
        }

        return data?.[0]
      }
      return null
    }

    // Si la columna existe, actualizamos status y notas
    if (columnInfo) {
      const updateData: any = { status }
      if (notes) {
        updateData.notes = notes
      }

      const { data, error } = await supabase.from("appointments").update(updateData).eq("id", appointmentId).select()

      if (error) {
        console.error("Error updating appointment status:", error)
        throw new Error(`Error al actualizar estado de cita: ${error.message}`)
      }

      console.log("Appointment status updated successfully")
      return data?.[0]
    } else {
      // Si la columna no existe, solo actualizamos las notas si se proporcionan
      if (notes) {
        const { data, error } = await supabase.from("appointments").update({ notes }).eq("id", appointmentId).select()

        if (error) {
          console.error("Error updating appointment notes:", error)
          throw new Error(`Error al actualizar notas de cita: ${error.message}`)
        }

        return data?.[0]
      }
      return null
    }
  } catch (error) {
    console.error("Error in updateAppointmentStatus:", error)
    throw error
  }
}

// Eliminar cita
export async function deleteAppointment(appointmentId: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    if (!appointmentId) {
      throw new Error("ID de cita es requerido")
    }

    console.log("Deleting appointment:", appointmentId)

    const { error } = await supabase.from("appointments").delete().eq("id", appointmentId)

    if (error) {
      console.error("Error deleting appointment:", error)
      throw new Error(`Error al eliminar cita: ${error.message}`)
    }

    console.log("Appointment deleted successfully")
    return true
  } catch (error) {
    console.error("Error in deleteAppointment:", error)
    throw error
  }
}

// Crear nota médica
export async function createMedicalNote(noteData: MedicalNote) {
  const supabase = getSupabaseBrowserClient()

  try {
    if (!noteData.appointment_id) {
      throw new Error("ID de cita es requerido")
    }
    if (!noteData.doctor_id) {
      throw new Error("ID de doctor es requerido")
    }
    if (!noteData.diagnosis) {
      throw new Error("Diagnóstico es requerido")
    }

    console.log("Creating medical note:", noteData)

    // Verificar si la tabla medical_notes existe
    const { data: tableExists, error: tableError } = await supabase.rpc("check_table_exists", {
      table_name: "medical_notes",
    })

    if (tableError || !tableExists) {
      console.error("Error: medical_notes table does not exist")
      throw new Error("La tabla de notas médicas no existe. Por favor, contacte al administrador.")
    }

    const { data, error } = await supabase.from("medical_notes").insert([noteData]).select()

    if (error) {
      console.error("Error creating medical note:", error)
      throw new Error(`Error al crear nota médica: ${error.message}`)
    }

    console.log("Medical note created successfully")
    return data?.[0]
  } catch (error) {
    console.error("Error in createMedicalNote:", error)
    throw error
  }
}

// Obtener notas médicas de una cita
export async function getMedicalNotes(appointmentId: string) {
  const supabase = getSupabaseBrowserClient()

  try {
    if (!appointmentId) {
      throw new Error("ID de cita es requerido")
    }

    console.log("Fetching medical notes for appointment:", appointmentId)

    // Verificar si la tabla medical_notes existe
    const { data: tableExists, error: tableError } = await supabase.rpc("check_table_exists", {
      table_name: "medical_notes",
    })

    if (tableError || !tableExists) {
      console.error("Error: medical_notes table does not exist")
      return [] // Retornamos array vacío si la tabla no existe
    }

    const { data, error } = await supabase
      .from("medical_notes")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching medical notes:", error)
      throw new Error(`Error al obtener notas médicas: ${error.message}`)
    }

    console.log("Fetched medical notes:", data)
    return data || []
  } catch (error) {
    console.error("Error in getMedicalNotes:", error)
    throw error
  }
}
