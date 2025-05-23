"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { specialties, doctors, timeSlots, getDoctorsBySpecialty, medicalPackages } from "@/lib/data"
import { createAppointment } from "@/lib/appointment-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { addDays, isBefore, format } from "date-fns"
import { es } from "date-fns/locale"

export default function NewAppointmentReceptionist() {
  const router = useRouter()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    specialtyId: "",
    doctorId: "",
    date: new Date(),
    timeSlotId: "",
    packageId: "",
    notes: "",
  })

  const [availableDoctors, setAvailableDoctors] = useState(doctors)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular fechas mínimas para validación
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Para recepcionista, permitir citas desde mañana
  const minDate = addDays(today, 1)

  useEffect(() => {
    // Establecer fecha mínima por defecto
    setFormData((prev) => ({
      ...prev,
      date: minDate,
    }))
  }, [])

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialtyId: value,
      doctorId: "", // Reset doctor when specialty changes
    }))

    // Update available doctors based on specialty
    const filteredDoctors = getDoctorsBySpecialty(value)
    setAvailableDoctors(filteredDoctors)
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    setFormData({ ...formData, date, timeSlotId: "" }) // Reset time slot when date changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.patientName || !formData.specialtyId || !formData.timeSlotId) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Crear un ID temporal para el paciente (en una implementación real, buscarías o crearías el paciente)
      const tempPatientId = `temp-${Date.now()}`

      const appointmentData = {
        user_id: tempPatientId, // ID temporal del paciente
        patient_name: formData.patientName,
        patient_id: tempPatientId,
        specialty_id: formData.specialtyId,
        doctor_id: formData.doctorId || null,
        date: formData.date.toISOString().split("T")[0],
        time_slot_id: formData.timeSlotId,
        package_id: formData.packageId || null,
        status: "approved", // Las citas creadas por recepcionista se aprueban automáticamente
        notes: formData.notes,
        created_by: user?.id, // ID del recepcionista que creó la cita
      }

      console.log("Creating appointment as receptionist:", appointmentData)

      const result = await createAppointment(appointmentData)
      console.log("Appointment created successfully:", result)

      toast({
        title: "¡Cita Creada Exitosamente!",
        description: `Cita programada para ${formData.patientName} el ${format(formData.date, "PPP", { locale: es })} a las ${timeSlots.find((slot) => slot.id === formData.timeSlotId)?.time}.`,
      })

      // Reset form
      setFormData({
        patientName: "",
        patientPhone: "",
        patientEmail: "",
        specialtyId: "",
        doctorId: "",
        date: minDate,
        timeSlotId: "",
        packageId: "",
        notes: "",
      })

      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push("/receptionist/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Error creating appointment:", error)

      let errorMessage = "Ocurrió un error al crear la cita. Por favor, inténtelo de nuevo."
      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Error al Crear Cita",
        description: errorMessage,
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  if (!user || user.role !== "receptionist") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <h3 className="text-xl font-medium mb-2">Acceso Denegado</h3>
            <p className="text-gray-500">Esta página es solo para recepcionistas.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Nueva Cita Presencial</h1>

      <Card>
        <CardHeader>
          <CardTitle>Crear Cita para Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Cita Presencial</AlertTitle>
            <AlertDescription>
              Las citas creadas por recepcionista se aprueban automáticamente y pueden programarse desde mañana.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nombre Completo del Paciente *</Label>
                <Input
                  id="patientName"
                  placeholder="Nombre completo del paciente"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientPhone">Teléfono</Label>
                <Input
                  id="patientPhone"
                  placeholder="Número de teléfono"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientEmail">Correo Electrónico</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="package">Paquete Médico (Opcional)</Label>
                <Select
                  value={formData.packageId || "none"}
                  onValueChange={(value) => setFormData({ ...formData, packageId: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un paquete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {medicalPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id.toString()}>
                        {pkg.title} {pkg.price ? `- ${pkg.price.toFixed(2)}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Select value={formData.specialtyId} onValueChange={handleSpecialtyChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id.toString()}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Médico (Opcional)</Label>
                <Select
                  value={formData.doctorId || ""}
                  onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                  disabled={!formData.specialtyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un médico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquier médico disponible</SelectItem>
                    {availableDoctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id.toString()}>
                        {doctor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Seleccionar Fecha *</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
                    disabled={(date) => {
                      // Deshabilitar fechas pasadas y fines de semana
                      return (
                        isBefore(date, today) || // Fechas pasadas
                        date.getDay() === 0 || // Domingo
                        date.getDay() === 6 // Sábado
                      )
                    }}
                    className="rounded-md border"
                    locale={es}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Fecha seleccionada: {format(formData.date, "PPP", { locale: es })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Horarios Disponibles *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Input
                id="notes"
                placeholder="Notas sobre la cita..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <CardFooter className="px-0 pt-6 pb-0 flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/receptionist/dashboard")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando Cita..." : "Crear Cita"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
