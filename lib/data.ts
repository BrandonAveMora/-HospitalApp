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

// Helper functions
export function getDoctorsBySpecialty(specialtyId: string): Doctor[] {
  return doctors.filter((doctor) => doctor.specialtyId === specialtyId)
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
