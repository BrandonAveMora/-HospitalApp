"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specialties, doctors, timeSlots, getDoctorsBySpecialty, getPackageById, medicalPackages } from "@/lib/data"
import { createAppointment } from "@/lib/appointment-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

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

  // Pre-fill form if package is selected from URL
  useEffect(() => {
    if (packageId) {
      const pkgData = getPackageById(packageId)
      if (pkgData) {
        console.log("Package selected from URL:", pkgData)
        setSelectedPackage(pkgData)
        setFormData((prev) => ({
          ...prev,
          specialtyId: pkgData.specialtyId,
          packageId: packageId,
        }))

        // Update available doctors based on specialty
        setAvailableDoctors(getDoctorsBySpecialty(pkgData.specialtyId))
      }
    }

    // Pre-fill patient name if user is logged in
    if (user?.user_metadata?.name) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.user_metadata.name,
      }))
    }
  }, [packageId, user])

  const handleSpecialtyChange = (value: string) => {
    console.log("Specialty changed to:", value)
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

    if (value === "none") {
      console.log("Clearing package selection")
      setSelectedPackage(null)
      setFormData((prev) => ({
        ...prev,
        packageId: "",
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
      }))

      // Update available doctors based on specialty
      const filteredDoctors = getDoctorsBySpecialty(pkgData.specialtyId)
      console.log("Available doctors for package:", filteredDoctors)
      setAvailableDoctors(filteredDoctors)
    }
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
      console.log("Submitting appointment with data:", {
        user_id: user?.id,
        patient_name: formData.patientName,
        patient_id: user?.id,
        specialty_id: formData.specialtyId,
        doctor_id: formData.doctorId || undefined,
        date: formData.date.toISOString().split("T")[0],
        time_slot_id: formData.timeSlotId,
        package_id: formData.packageId || undefined,
      })

      // Create new appointment in Supabase
      await createAppointment({
        user_id: user?.id || "",
        patient_name: formData.patientName,
        patient_id: user?.id || "", // Usar el ID del usuario como ID del paciente
        specialty_id: formData.specialtyId,
        doctor_id: formData.doctorId || undefined,
        date: formData.date.toISOString().split("T")[0],
        time_slot_id: formData.timeSlotId,
        package_id: formData.packageId || undefined,
      })

      // Show success message
      toast({
        title: "Cita Reservada",
        description: "Su cita ha sido programada exitosamente.",
      })

      // Redirect to appointments page
      setTimeout(() => {
        router.push("/my-appointments")
      }, 1500)
    } catch (error) {
      console.error("Error al crear cita:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al reservar la cita. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  // Debug output
  console.log("Current form data:", formData)
  console.log("Selected package:", selectedPackage)
  console.log("Available doctors:", availableDoctors)

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

            {/* Debug info - solo visible durante desarrollo */}
            {process.env.NODE_ENV === "development" && (
              <div className="p-4 bg-gray-100 rounded-md text-xs">
                <p>Debug - Form Data:</p>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            )}

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
