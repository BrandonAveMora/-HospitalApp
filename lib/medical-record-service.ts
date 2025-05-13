import { getMedicalRecordsByPatientId as getRecordsByPatientId, getMedicalRecordById as getRecordById } from "./data"

export async function getUserMedicalRecords(userId: string) {
  // En una implementación real, esto sería una consulta a Supabase
  // Por ahora, usamos los datos de ejemplo
  try {
    // Simulamos que el ID de usuario de Supabase es el mismo que usamos en nuestros datos de ejemplo
    // En una implementación real, habría una tabla que relacione los IDs de usuario con los IDs de paciente
    const patientId = "user-001" // Usamos un ID fijo para demostración
    return getRecordsByPatientId(patientId)
  } catch (error) {
    console.error("Error al obtener registros médicos:", error)
    throw error
  }
}

export async function getMedicalRecordDetails(recordId: string) {
  // En una implementación real, esto sería una consulta a Supabase
  // Por ahora, usamos los datos de ejemplo
  try {
    return getRecordById(recordId)
  } catch (error) {
    console.error("Error al obtener detalles del registro médico:", error)
    throw error
  }
}
