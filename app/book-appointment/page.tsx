"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { specialties, doctors, timeSlots, getDoctorsBySpecialty, getPackageById, medicalPackages } from "@/lib/data"
import { createAppointment } from "@/lib/appointment-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"
import { addDays, isBefore, format } from "date-fns"
import { es } from "date-fns/locale"

export default function BookAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    patientName: "",
    specialtyId: "",
    doctorId: "",
    date: new Date(),
    timeSlotId: "",
    packageId: "",
  })

  const [availableDoctors, setAvailableDoctors] = useState(doctors)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [validationErrors, setValidationErrors] = useState<{
    date?: string
    time?: string
  }>({})

  // Calcular fechas mínimas para validación
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Fecha mínima para citas (2 días a partir de hoy)
  const minDate = addDays(today, 2)

  // Pre-fill form if package is selected from URL
  useEffect(() => {
    if (packageId) {
      const pkgData = getPackageById(packageId)
      if (pkgData) {
        console.log("Package selected from URL:", pkgData)
        setSelectedPackage(pkgData)

        // Actualizar formData solo una vez, no en cada renderizado
        setFormData((prev) => ({
          ...prev,
          specialtyId: pkgData.specialtyId,
          packageId: packageId,
          date: minDate, // Establecer fecha mínima por defecto
        }))

        // Update available doctors based on specialty - solo una vez
        const filteredDoctors = getDoctorsBySpecialty(pkgData.specialtyId)
        setAvailableDoctors(filteredDoctors)
      }
    } else {
      // Si no hay paquete seleccionado, establecer fecha mínima por defecto
      setFormData((prev) => ({
        ...prev,
        date: minDate,
      }))
    }

    // Pre-fill patient name if user is logged in
    if (user?.profile?.name) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.profile.name,
      }))
    }
  }, [packageId, user?.profile?.name]) // Dependencias específicas

  const handleSpecialtyChange = (value: string) => {
    console.log("Specialty changed to:", value)

    // Evitar actualizar si es el mismo valor
    if (value === formData.specialtyId) return

    setFormData((prev) => ({
      ...prev,
      specialtyId: value,
      doctorId: "", // Reset doctor when specialty changes
    }))

    // Update available doctors based on specialty
    const filteredDoctors = getDoctorsBySpecialty(value)
    console.log("Available doctors:", filteredDoctors)
    setAvailableDoctors(filteredDoctors)
  }

  const handlePackageChange = (value: string) => {
    console.log("Package changed to:", value)

    // Evitar actualizar si es el mismo valor
    if (value === formData.packageId) return

    if (value === "none") {
      console.log("Clearing package selection")
      setSelectedPackage(null)
      setFormData((prev) => ({
        ...prev,
        packageId: "",
        // No cambiar la especialidad cuando se deselecciona el paquete
      }))
      return
    }

    const pkgData = getPackageById(value)
    if (pkgData) {
      console.log("Package data:", pkgData)
      setSelectedPackage(pkgData)

      // Update both packageId and specialtyId
      setFormData((prev) => ({
        ...prev,
        packageId: value,
        specialtyId: pkgData.specialtyId,
        doctorId: "", // Reset doctor when package changes
      }))

      // Update available doctors based on specialty
      const filteredDoctors = getDoctorsBySpecialty(pkgData.specialtyId)
      console.log("Available doctors for package:", filteredDoctors)
      setAvailableDoctors(filteredDoctors)
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return

    // Validar que la fecha no sea anterior a la fecha mínima
    if (isBefore(date, minDate)) {
      setValidationErrors((prev) => ({
        ...prev,
        date: `Las citas deben programarse con al menos 2 días de anticipación. La fecha más cercana disponible es ${format(minDate, "PPP", { locale: es })}.`,
      }))
    } else {
      // Limpiar error si la fecha es válida
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.date
        return newErrors
      })
    }

    setFormData({ ...formData, date, timeSlotId: "" }) // Reset time slot when date changes
  }

  const handleTimeSlotChange = (timeSlotId: string) => {
    // Aquí podríamos implementar validación adicional para horarios
    // Por ejemplo, si la fecha es hoy, validar que la hora no haya pasado ya

    setFormData({ ...formData, timeSlotId })

    // Limpiar error de tiempo si existiera
    setValidationErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors.time
      return newErrors
    })
  }

  const validateForm = () => {
    const errors: { date?: string; time?: string } = {}
    let isValid = true

    // Validar fecha
    if (isBefore(formData.date, minDate)) {
      errors.date = `Las citas deben programarse con al menos 2 días de anticipación. La fecha más cercana disponible es ${format(minDate, "PPP", { locale: es })}.`
      isValid = false
    }

    // Validar que se haya seleccionado un horario
    if (!formData.timeSlotId) {
      errors.time = "Por favor, seleccione un horario para su cita."
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      toast({
        title: "Error de Validación",
        description: "Por favor, corrija los errores en el formulario antes de continuar.",
        variant: "destructive",
      })
      return
    }

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
      const appointmentData = {
        user_id: user?.id || "",
        patient_name: formData.patientName,
        patient_id: user?.id || "",
        specialty_id: formData.specialtyId,
        doctor_id: formData.doctorId || null,
        date: formData.date.toISOString().split("T")[0],
        time_slot_id: formData.timeSlotId,
        package_id: formData.packageId || null,
      }

      console.log("Submitting appointment with data:", appointmentData)

      // Validar que todos los campos requeridos estén presentes
      if (!appointmentData.user_id) {
        throw new Error("ID de usuario requerido")
      }
      if (!appointmentData.patient_name) {
        throw new Error("Nombre del paciente requerido")
      }
      if (!appointmentData.specialty_id) {
        throw new Error("Especialidad requerida")
      }
      if (!appointmentData.date) {
        throw new Error("Fecha requerida")
      }
      if (!appointmentData.time_slot_id) {
        throw new Error("Horario requerido")
      }

      // Create new appointment
      const result = await createAppointment(appointmentData)
      console.log("Appointment created successfully:", result)

      // Show success message
      toast({
        title: "¡Cita Reservada Exitosamente!",
        description: `Su cita ha sido programada para el ${format(formData.date, "PPP", { locale: es })} a las ${timeSlots.find((slot) => slot.id === formData.timeSlotId)?.time}.`,
      })

      // Reset form
      setFormData({
        patientName: user?.profile?.name || "",
        specialtyId: "",
        doctorId: "",
        date: minDate,
        timeSlotId: "",
        packageId: "",
      })

      // Redirect to appointments page after a delay
      setTimeout(() => {
        router.push("/my-appointments")
      }, 2000)
    } catch (error) {
      console.error("Error al crear cita:", error)

      let errorMessage = "Ocurrió un error al reservar la cita. Por favor, inténtelo de nuevo."

      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "Error al Reservar Cita",
        description: errorMessage,
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  // Debug output
  console.log("Current form data:", formData)
  console.log("Selected package:", selectedPackage)
  console.log("Available doctors:", availableDoctors)

  // Verificar autenticación antes de renderizar el formulario
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
          {selectedPackage && (
            <>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Paquete: {selectedPackage.title}
                </Badge>
                {selectedPackage.price && <Badge variant="outline">Precio: ${selectedPackage.price.toFixed(2)}</Badge>}
              </div>
              <CardDescription className="mt-2">{selectedPackage.description}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Información importante</AlertTitle>
            <AlertDescription>
              Las citas deben programarse con al menos 2 días de anticipación para garantizar la disponibilidad del
              personal médico.
            </AlertDescription>
          </Alert>

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
                <Label htmlFor="package">Paquete Médico (Opcional)</Label>
                <Select
                  value={formData.packageId || "none"}
                  onValueChange={handlePackageChange}
                  disabled={!!packageId} // Deshabilitar si viene de la página de paquetes
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un paquete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {medicalPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.title} {pkg.price ? `- $${pkg.price.toFixed(2)}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Select
                  value={formData.specialtyId}
                  onValueChange={handleSpecialtyChange}
                  required
                  disabled={!!selectedPackage} // Deshabilitar si hay un paquete seleccionado
                >
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
                {formData.specialtyId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Especialidad seleccionada: {specialties.find((s) => s.id === formData.specialtyId)?.name}
                  </p>
                )}
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
                    {availableDoctors.length > 0 ? (
                      availableDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-doctors" disabled>
                        No hay médicos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formData.doctorId && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Médico seleccionado: {doctors.find((d) => d.id === formData.doctorId)?.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Seleccionar Fecha</Label>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
                    disabled={(date) => {
                      // Deshabilitar fechas pasadas, fines de semana y fechas antes de la fecha mínima
                      return (
                        isBefore(date, today) || // Fechas pasadas
                        date.getDay() === 0 || // Domingo
                        date.getDay() === 6 || // Sábado
                        isBefore(date, minDate) // Fechas antes de la fecha mínima (2 días a partir de hoy)
                      )
                    }}
                    className="rounded-md border"
                    locale={es}
                  />
                </div>
                {validationErrors.date && <p className="text-sm text-red-500 mt-1">{validationErrors.date}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Fecha seleccionada: {format(formData.date, "PPP", { locale: es })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Horarios Disponibles</Label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      type="button"
                      variant={formData.timeSlotId === slot.id ? "default" : "outline"}
                      onClick={() => handleTimeSlotChange(slot.id)}
                      className="justify-start"
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
                {validationErrors.time && <p className="text-sm text-red-500 mt-1">{validationErrors.time}</p>}
              </div>
            </div>

            <CardFooter className="px-0 pt-6 pb-0 flex justify-end">
              <Button
                type="submit"
                className="w-full md:w-auto"
                disabled={isSubmitting || Object.keys(validationErrors).length > 0}
              >
                {isSubmitting ? "Reservando..." : "Confirmar Cita"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
