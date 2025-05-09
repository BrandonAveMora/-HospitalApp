"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specialties, doctors, timeSlots, getDoctorsBySpecialty, getPackageById } from "@/lib/data"
import { generateId } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function BookAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    specialtyId: "",
    doctorId: "",
    date: new Date(),
    timeSlotId: "",
  })

  const [availableDoctors, setAvailableDoctors] = useState(doctors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])

  // Load appointments from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAppointments = localStorage.getItem("appointments")
      setAppointments(savedAppointments ? JSON.parse(savedAppointments) : [])
    }
  }, [])

  // Pre-fill form if package is selected
  useEffect(() => {
    if (packageId) {
      const selectedPackage = getPackageById(packageId)
      if (selectedPackage) {
        setFormData((prev) => ({
          ...prev,
          specialtyId: selectedPackage.specialtyId,
        }))

        // Update available doctors based on specialty
        setAvailableDoctors(getDoctorsBySpecialty(selectedPackage.specialtyId))
      }
    }

    // Pre-fill patient name if user is logged in
    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.name,
      }))
    }
  }, [packageId, user])

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialtyId: value,
      doctorId: "", // Reset doctor when specialty changes
    }))

    // Update available doctors based on specialty
    setAvailableDoctors(getDoctorsBySpecialty(value))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.patientName || !formData.patientId || !formData.specialtyId || !formData.timeSlotId) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create new appointment
    const newAppointment = {
      id: generateId(),
      userId: user?.id || "guest",
      patientName: formData.patientName,
      patientId: formData.patientId,
      specialtyId: formData.specialtyId,
      doctorId: formData.doctorId || undefined,
      date: formData.date.toISOString().split("T")[0],
      timeSlotId: formData.timeSlotId,
      packageId: packageId || undefined,
    }

    // Save to localStorage
    const updatedAppointments = [...appointments, newAppointment]
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

    // Show success message
    toast({
      title: "Cita Reservada",
      description: "Su cita ha sido programada exitosamente.",
    })

    // Redirect to appointments page
    setTimeout(() => {
      router.push("/my-appointments")
    }, 1500)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-medium mb-2">Autenticación Requerida</h3>
              <p className="text-gray-500 mb-6">Por favor, inicie sesión para reservar una cita.</p>
              <Button onClick={() => router.push("/login")}>Iniciar Sesión</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Reservar una Cita</h1>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Cita</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nombre Completo</Label>
                <Input
                  id="patientName"
                  placeholder="Ingrese su nombre completo"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">Número de Identificación</Label>
                <Input
                  id="patientId"
                  placeholder="Ingrese su número de identificación"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Select value={formData.specialtyId} onValueChange={handleSpecialtyChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Médico (Opcional)</Label>
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                  disabled={!formData.specialtyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Seleccionar Fecha</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    disabled={
                      (date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                        date.getDay() === 0 ||
                        date.getDay() === 6 // Disable weekends
                    }
                    className="rounded-md border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Horarios Disponibles</Label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={formData.timeSlotId === slot.id ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, timeSlotId: slot.id })}
                      className="justify-start"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Reservando..." : "Confirmar Cita"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
