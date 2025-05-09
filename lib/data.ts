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
  { id: "gen-med", name: "General Medicine" },
  { id: "cardio", name: "Cardiology" },
  { id: "derm", name: "Dermatology" },
  { id: "ped", name: "Pediatrics" },
  { id: "dent", name: "Dentistry" },
  { id: "ortho", name: "Orthopedics" },
  { id: "neuro", name: "Neurology" },
]

export const doctors: Doctor[] = [
  {
    id: "dr-smith",
    name: "Dr. John Smith",
    specialtyId: "gen-med",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-johnson",
    name: "Dr. Emily Johnson",
    specialtyId: "cardio",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-patel",
    name: "Dr. Raj Patel",
    specialtyId: "derm",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-garcia",
    name: "Dr. Maria Garcia",
    specialtyId: "ped",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-chen",
    name: "Dr. Wei Chen",
    specialtyId: "dent",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-brown",
    name: "Dr. James Brown",
    specialtyId: "ortho",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "dr-kim",
    name: "Dr. Sarah Kim",
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
    title: "Basic Health Checkup",
    description: "Complete physical examination, blood tests, and consultation with a general physician.",
    price: 150,
    specialtyId: "gen-med",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "heart-health",
    title: "Heart Health Package",
    description: "Comprehensive cardiac evaluation including ECG, stress test, and consultation with a cardiologist.",
    price: 350,
    specialtyId: "cardio",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "skin-care",
    title: "Skin Care Package",
    description: "Full skin examination, allergy testing, and personalized skin care plan.",
    price: 200,
    specialtyId: "derm",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "child-wellness",
    title: "Child Wellness Package",
    description: "Complete pediatric checkup, vaccinations, and growth assessment.",
    price: 180,
    specialtyId: "ped",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dental-care",
    title: "Dental Care Package",
    description: "Dental cleaning, X-rays, and comprehensive oral health assessment.",
    price: 220,
    specialtyId: "dent",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "joint-health",
    title: "Joint Health Package",
    description: "Joint assessment, X-rays, and consultation with an orthopedic specialist.",
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
