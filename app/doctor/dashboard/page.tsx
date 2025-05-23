"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, User, CheckCircle, AlertCircle, Users, Stethoscope } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSpecialtyById, getTimeSlotById } from "@/lib/data"
import {
  getDoctorAppointments,
  updateAppointmentStatus,
  createMedicalNote,
  getMedicalNotes,
} from "@/lib/appointment-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [medicalNoteData, setMedicalNoteData] = useState({
    diagnosis: "",
    treatment: "",
    notes: "",
    followUpDate: "",
  })
  const [existingNotes, setExistingNotes] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (user?.id) {
      loadDoctorAppointments()
    }
  }, [user?.id])

  const loadDoctorAppointments = async () => {
    try {
      setIsLoading(true)
      // En una implementación real, necesitarías mapear el user.id al doctor.id
      // Por ahora, usaremos un ID fijo para demostración
      const doctorId = "dr-johnson" // Este debería venir del perfil del usuario
      const doctorAppointments = await getDoctorAppointments(doctorId)
      setAppointments(doctorAppointments)
    } catch (error) {
      console.error("Error loading doctor appointments:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMedicalNotes = async (appointmentId: string) => {
    try {
      const notes = await getMedicalNotes(appointmentId)
      setExistingNotes(notes)
    } catch (error) {
      console.error("Error loading medical notes:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las notas médicas.",
        variant: "destructive",
      })
    }
  }

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return

    try {
      setIsProcessing(true)

      // Crear nota médica si hay datos
      if (medicalNoteData.diagnosis || medicalNoteData.treatment || medicalNoteData.notes) {
        await createMedicalNote({
          appointment_id: selectedAppointment.id,
          doctor_id: "dr-johnson", // Este debería venir del perfil del usuario
          diagnosis: medicalNoteData.diagnosis,
          treatment: medicalNoteData.treatment,
          notes: medicalNoteData.notes,
          follow_up_date: medicalNoteData.followUpDate || undefined,
        })
      }

      // Marcar cita como completada
      await updateAppointmentStatus(selectedAppointment.id, "completed")

      // Actualizar estado local
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, status: "completed" } : apt)),
      )

      toast({
        title: "Cita Completada",
        description: "La cita ha sido marcada como completada y se ha guardado el historial médico.",
      })

      // Limpiar formulario y cerrar modal
      setMedicalNoteData({
        diagnosis: "",
        treatment: "",
        notes: "",
        followUpDate: "",
      })
      setSelectedAppointment(null)
    } catch (error) {
      console.error("Error completing appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo completar la cita. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const todayAppointments = appointments.filter((apt) => apt.date === selectedDate)
  const completedToday = todayAppointments.filter((apt) => apt.status === "completed").length
  const pendingToday = todayAppointments.filter((apt) => apt.status === "approved").length

  if (!user || user.role !== "doctor") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <h3 className="text-xl font-medium mb-2">Acceso Denegado</h3>
            <p className="text-gray-500">Esta página es solo para doctores.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const specialty = getSpecialtyById(user.profile?.specialtyId || "")

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel del Doctor</h1>
        <p className="text-gray-600">
          Bienvenido, {user.profile?.name} - {specialty?.name}
        </p>
      </div>

      {/* Estadísticas del día */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Citas Hoy</p>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold">{pendingToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pacientes</p>
                <p className="text-2xl font-bold">{new Set(appointments.map((apt) => apt.patient_id)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selector de fecha */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Mis Citas</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border rounded-md"
            />
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Citas del día */}
      <Card>
        <CardHeader>
          <CardTitle>Citas del {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay citas programadas</h3>
              <p className="text-gray-500">No tiene citas programadas para esta fecha.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => {
                const timeSlot = getTimeSlotById(appointment.time_slot_id)

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{timeSlot?.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{appointment.patient_name}</span>
                      </div>
                      <Badge
                        variant={appointment.status === "completed" ? "default" : "secondary"}
                        className={appointment.status === "completed" ? "bg-green-500" : "bg-yellow-500"}
                      >
                        {appointment.status === "completed" ? "Completada" : "Pendiente"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{appointment.notes}</span>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              loadMedicalNotes(appointment.id)
                            }}
                          >
                            <Stethoscope className="h-4 w-4 mr-1" />
                            {appointment.status === "completed" ? "Ver Historial" : "Atender"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {appointment.status === "completed" ? "Historial Médico" : "Atender Paciente"}
                            </DialogTitle>
                            <DialogDescription>
                              Paciente: {appointment.patient_name} - {formatDate(appointment.date)} {timeSlot?.time}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedAppointment && (
                            <div className="space-y-6">
                              {/* Información de la cita */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">Información de la Cita</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Paciente:</span> {appointment.patient_name}
                                  </div>
                                  <div>
                                    <span className="font-medium">Fecha:</span> {formatDate(appointment.date)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Hora:</span> {timeSlot?.time}
                                  </div>
                                  <div>
                                    <span className="font-medium">Estado:</span>
                                    <Badge
                                      className={
                                        appointment.status === "completed" ? "bg-green-500 ml-2" : "bg-yellow-500 ml-2"
                                      }
                                    >
                                      {appointment.status === "completed" ? "Completada" : "Pendiente"}
                                    </Badge>
                                  </div>
                                </div>
                                {appointment.notes && (
                                  <div className="mt-2">
                                    <span className="font-medium">Notas:</span> {appointment.notes}
                                  </div>
                                )}
                              </div>

                              {/* Historial médico existente */}
                              {existingNotes.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Historial Médico Previo</h4>
                                  <div className="space-y-3">
                                    {existingNotes.map((note, index) => (
                                      <div key={note.id || index} className="border p-3 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-2">
                                          {new Date(note.created_at).toLocaleDateString("es-ES")}
                                        </div>
                                        <div className="space-y-2">
                                          <div>
                                            <strong>Diagnóstico:</strong> {note.diagnosis}
                                          </div>
                                          <div>
                                            <strong>Tratamiento:</strong> {note.treatment}
                                          </div>
                                          {note.notes && (
                                            <div>
                                              <strong>Notas:</strong> {note.notes}
                                            </div>
                                          )}
                                          {note.follow_up_date && (
                                            <div>
                                              <strong>Seguimiento:</strong> {formatDate(note.follow_up_date)}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Formulario para nueva nota médica */}
                              {appointment.status !== "completed" && (
                                <div>
                                  <h4 className="font-medium mb-3">Registrar Consulta</h4>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="diagnosis">Diagnóstico *</Label>
                                      <Input
                                        id="diagnosis"
                                        placeholder="Diagnóstico principal"
                                        value={medicalNoteData.diagnosis}
                                        onChange={(e) =>
                                          setMedicalNoteData((prev) => ({ ...prev, diagnosis: e.target.value }))
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="treatment">Tratamiento *</Label>
                                      <Textarea
                                        id="treatment"
                                        placeholder="Tratamiento prescrito, medicamentos, etc."
                                        value={medicalNoteData.treatment}
                                        onChange={(e) =>
                                          setMedicalNoteData((prev) => ({ ...prev, treatment: e.target.value }))
                                        }
                                        rows={3}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="notes">Notas Adicionales</Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Observaciones, recomendaciones, etc."
                                        value={medicalNoteData.notes}
                                        onChange={(e) =>
                                          setMedicalNoteData((prev) => ({ ...prev, notes: e.target.value }))
                                        }
                                        rows={3}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="followUpDate">Fecha de Seguimiento (Opcional)</Label>
                                      <Input
                                        id="followUpDate"
                                        type="date"
                                        value={medicalNoteData.followUpDate}
                                        onChange={(e) =>
                                          setMedicalNoteData((prev) => ({ ...prev, followUpDate: e.target.value }))
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {appointment.status !== "completed" && (
                            <DialogFooter>
                              <Button
                                onClick={handleCompleteAppointment}
                                disabled={isProcessing || !medicalNoteData.diagnosis || !medicalNoteData.treatment}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {isProcessing ? "Completando..." : "Completar Consulta"}
                              </Button>
                            </DialogFooter>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
