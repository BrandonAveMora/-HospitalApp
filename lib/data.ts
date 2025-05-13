export interface Specialty {
  id: string
  name: string
}

export interface Doctor {
  id: string
  name: string
  specialtyId: string
  image: string
}

export interface TimeSlot {
  id: string
  time: string
}

export interface Appointment {
  id: string
  patientName: string
  patientId: string
  specialtyId: string
  doctorId?: string
  date: string
  timeSlotId: string
  packageId?: string
}

export interface MedicalPackage {
  id: string
  title: string
  description: string
  price?: number
  specialtyId: string
  image: string
}

// Nueva interfaz para registros médicos
export interface MedicalRecord {
  id: string
  patientId: string
  date: string
  specialtyId: string
  doctorId: string
  type: "consultation" | "test" | "procedure" | "hospitalization"
  status: "completed" | "pending" | "cancelled"
  diagnosis: string
  treatment: string
  notes: string
  followUp?: string
}

export const specialties: Specialty[] = [
  { id: "gen-med", name: "Medicina General" },
  { id: "cardio", name: "Cardiología" },
  { id: "derm", name: "Dermatología" },
  { id: "ped", name: "Pediatría" },
  { id: "dent", name: "Odontología" },
  { id: "ortho", name: "Ortopedia" },
  { id: "neuro", name: "Neurología" },
]

export const doctors: Doctor[] = [
  {
    id: "dr-smith",
    name: "Dr. Juan Pérez",
    specialtyId: "gen-med",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-johnson",
    name: "Dra. María González",
    specialtyId: "cardio",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-patel",
    name: "Dr. Carlos Rodríguez",
    specialtyId: "derm",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-garcia",
    name: "Dra. Ana Martínez",
    specialtyId: "ped",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-chen",
    name: "Dr. Luis Sánchez",
    specialtyId: "dent",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-brown",
    name: "Dr. Javier López",
    specialtyId: "ortho",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-kim",
    name: "Dra. Sofía Ramírez",
    specialtyId: "neuro",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export const timeSlots: TimeSlot[] = [
  { id: "9am", time: "9:00 AM" },
  { id: "10am", time: "10:00 AM" },
  { id: "11am", time: "11:00 AM" },
  { id: "1pm", time: "1:00 PM" },
  { id: "2pm", time: "2:00 PM" },
  { id: "3pm", time: "3:00 PM" },
  { id: "4pm", time: "4:00 PM" },
]

export const medicalPackages: MedicalPackage[] = [
  {
    id: "basic-checkup",
    title: "Chequeo Básico de Salud",
    description: "Examen físico completo, análisis de sangre y consulta con un médico general.",
    price: 150,
    specialtyId: "gen-med",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "heart-health",
    title: "Paquete de Salud Cardíaca",
    description: "Evaluación cardíaca completa que incluye ECG, prueba de esfuerzo y consulta con un cardiólogo.",
    price: 350,
    specialtyId: "cardio",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "skin-care",
    title: "Paquete de Cuidado de la Piel",
    description: "Examen completo de la piel, pruebas de alergia y plan personalizado de cuidado de la piel.",
    price: 200,
    specialtyId: "derm",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "child-wellness",
    title: "Paquete de Bienestar Infantil",
    description: "Chequeo pediátrico completo, vacunas y evaluación del crecimiento.",
    price: 180,
    specialtyId: "ped",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dental-care",
    title: "Paquete de Cuidado Dental",
    description: "Limpieza dental, radiografías y evaluación completa de la salud bucal.",
    price: 220,
    specialtyId: "dent",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "joint-health",
    title: "Paquete de Salud Articular",
    description: "Evaluación de articulaciones, radiografías y consulta con un especialista en ortopedia.",
    price: 280,
    specialtyId: "ortho",
    image: "/placeholder.svg?height=200&width=300",
  },
]

// Datos de ejemplo para registros médicos
export const medicalRecords: MedicalRecord[] = [
  {
    id: "rec-001",
    patientId: "user-001", // Este ID debe coincidir con el ID del usuario autenticado
    date: "2023-05-15",
    specialtyId: "gen-med",
    doctorId: "dr-smith",
    type: "consultation",
    status: "completed",
    diagnosis: "Resfriado común",
    treatment: "Reposo, hidratación y paracetamol cada 8 horas",
    notes:
      "El paciente presenta síntomas leves de resfriado. Se recomienda seguimiento si los síntomas persisten más de 5 días.",
  },
  {
    id: "rec-002",
    patientId: "user-001",
    date: "2023-06-20",
    specialtyId: "cardio",
    doctorId: "dr-johnson",
    type: "test",
    status: "completed",
    diagnosis: "Evaluación cardíaca de rutina",
    treatment: "No requiere tratamiento específico",
    notes:
      "Electrocardiograma normal. Presión arterial ligeramente elevada (130/85). Se recomienda dieta baja en sodio y ejercicio regular.",
  },
  {
    id: "rec-003",
    patientId: "user-001",
    date: "2023-07-10",
    specialtyId: "derm",
    doctorId: "dr-patel",
    type: "consultation",
    status: "completed",
    diagnosis: "Dermatitis de contacto",
    treatment: "Crema de hidrocortisona al 1% dos veces al día durante 7 días",
    notes: "Erupción cutánea en antebrazo derecho. Posible reacción alérgica a detergente nuevo.",
    followUp: "2023-07-24",
  },
  {
    id: "rec-004",
    patientId: "user-001",
    date: "2023-08-05",
    specialtyId: "gen-med",
    doctorId: "dr-smith",
    type: "consultation",
    status: "completed",
    diagnosis: "Gastroenteritis",
    treatment: "Dieta blanda, hidratación y probióticos",
    notes: "Paciente con diarrea y dolor abdominal leve. No hay fiebre ni signos de deshidratación.",
  },
  {
    id: "rec-005",
    patientId: "user-001",
    date: "2023-09-15",
    specialtyId: "ortho",
    doctorId: "dr-brown",
    type: "procedure",
    status: "completed",
    diagnosis: "Esguince de tobillo grado I",
    treatment: "Reposo, hielo, compresión y elevación. Analgésicos según sea necesario.",
    notes: "Lesión ocurrida durante actividad deportiva. No se requiere inmovilización rígida.",
    followUp: "2023-09-29",
  },
  {
    id: "rec-006",
    patientId: "user-001",
    date: "2023-10-20",
    specialtyId: "dent",
    doctorId: "dr-chen",
    type: "procedure",
    status: "completed",
    diagnosis: "Caries dental",
    treatment: "Empaste dental en molar inferior derecho",
    notes: "Procedimiento realizado sin complicaciones. Se recomienda revisión en 6 meses.",
  },
  {
    id: "rec-007",
    patientId: "user-001",
    date: "2023-11-10",
    specialtyId: "gen-med",
    doctorId: "dr-smith",
    type: "test",
    status: "completed",
    diagnosis: "Análisis de sangre de rutina",
    treatment: "No requiere tratamiento específico",
    notes:
      "Resultados normales en general. Colesterol ligeramente elevado (210 mg/dL). Se recomienda dieta baja en grasas saturadas.",
  },
  {
    id: "rec-008",
    patientId: "user-001",
    date: "2023-12-05",
    specialtyId: "cardio",
    doctorId: "dr-johnson",
    type: "consultation",
    status: "completed",
    diagnosis: "Hipertensión leve",
    treatment: "Cambios en el estilo de vida. No medicación por ahora.",
    notes: "Presión arterial 140/90. Se recomienda reducir la ingesta de sal, ejercicio regular y monitoreo en casa.",
    followUp: "2024-03-05",
  },
  {
    id: "rec-009",
    patientId: "user-001",
    date: "2024-01-15",
    specialtyId: "neuro",
    doctorId: "dr-kim",
    type: "consultation",
    status: "completed",
    diagnosis: "Cefalea tensional",
    treatment: "Ibuprofeno según sea necesario. Técnicas de relajación.",
    notes: "Paciente refiere dolores de cabeza frecuentes relacionados con estrés laboral.",
  },
  {
    id: "rec-010",
    patientId: "user-001",
    date: "2024-02-20",
    specialtyId: "gen-med",
    doctorId: "dr-smith",
    type: "consultation",
    status: "completed",
    diagnosis: "Infección de vías respiratorias superiores",
    treatment: "Antibiótico (amoxicilina) durante 7 días",
    notes: "Paciente con tos productiva, dolor de garganta y fiebre leve. Se recomienda reposo.",
  },
  {
    id: "rec-011",
    patientId: "user-001",
    date: "2024-03-15",
    specialtyId: "derm",
    doctorId: "dr-patel",
    type: "procedure",
    status: "completed",
    diagnosis: "Extirpación de lunar",
    treatment: "Cuidado de la herida y protección solar",
    notes: "Procedimiento realizado sin complicaciones. Muestra enviada a patología.",
    followUp: "2024-03-29",
  },
  {
    id: "rec-012",
    patientId: "user-001",
    date: "2024-04-10",
    specialtyId: "cardio",
    doctorId: "dr-johnson",
    type: "test",
    status: "pending",
    diagnosis: "Evaluación cardíaca de seguimiento",
    treatment: "Pendiente según resultados",
    notes: "Programado electrocardiograma y prueba de esfuerzo.",
  },
  {
    id: "rec-013",
    patientId: "user-001",
    date: "2024-05-05",
    specialtyId: "gen-med",
    doctorId: "dr-smith",
    type: "consultation",
    status: "pending",
    diagnosis: "Chequeo general anual",
    treatment: "Pendiente según resultados",
    notes: "Programado análisis de sangre completo y evaluación general.",
  },
]

// Helper functions
export function getDoctorsBySpecialty(specialtyId: string): Doctor[] {
  if (!specialtyId) {
    console.warn("No specialty ID provided to getDoctorsBySpecialty")
    return []
  }

  const filteredDoctors = doctors.filter((doctor) => doctor.specialtyId === specialtyId)
  console.log(`Doctors for specialty ${specialtyId}:`, filteredDoctors)
  return filteredDoctors
}

export function getSpecialtyById(id: string): Specialty | undefined {
  return specialties.find((specialty) => specialty.id === id)
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((doctor) => doctor.id === id)
}

export function getTimeSlotById(id: string): TimeSlot | undefined {
  return timeSlots.find((slot) => slot.id === id)
}

export function getPackageById(id: string): MedicalPackage | undefined {
  return medicalPackages.find((pkg) => pkg.id === id)
}

// Nuevas funciones para registros médicos
export function getMedicalRecordsByPatientId(patientId: string): MedicalRecord[] {
  // En una implementación real, esto sería una consulta a la base de datos
  // Por ahora, filtramos los registros de ejemplo
  return medicalRecords.filter((record) => record.patientId === patientId)
}

export function getMedicalRecordById(recordId: string): MedicalRecord | undefined {
  // En una implementación real, esto sería una consulta a la base de datos
  // Por ahora, buscamos en los registros de ejemplo
  return medicalRecords.find((record) => record.id === recordId)
}
