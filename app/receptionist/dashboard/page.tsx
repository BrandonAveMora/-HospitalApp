"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, User, Search, Plus, CheckCircle, AlertCircle, X, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSpecialtyById, getDoctorById, getTimeSlotById } from "@/lib/data"
import { getAllAppointments, updateAppointmentStatus } from "@/lib/appointment-service"
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
import { Label } from "@/components/ui/label"

export default function ReceptionistDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [actionNotes, setActionNotes] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadAllAppointments()
  }, [])

  const loadAllAppointments = async () => {
    try {
      setIsLoading(true)
      const allAppointments = await getAllAppointments()
      setAppointments(allAppointments)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las citas. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      setIsProcessing(true)
      await updateAppointmentStatus(appointmentId, "approved", actionNotes)

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "approved", notes: actionNotes } : apt)),
      )

      toast({
        title: "Cita Aprobada",
        description: "La cita ha sido aprobada exitosamente.",
      })

      setSelectedAppointment(null)
      setActionNotes("")
    } catch (error) {
      console.error("Error approving appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo aprobar la cita. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      setIsProcessing(true)
      await updateAppointmentStatus(appointmentId, "cancelled", actionNotes)

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "cancelled", notes: actionNotes } : apt)),
      )

      toast({
        title: "Cita Rechazada",
        description: "La cita ha sido rechazada.",
      })

      setSelectedAppointment(null)
      setActionNotes("")
    } catch (error) {
      console.error("Error rejecting appointment:", error)
      toast({
        title: "Error",
        description: "No se pudo rechazar la cita. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === selectedDate
    const matchesSearch =
      searchTerm === "" ||
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDoctorById(apt.doctor_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesDate && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "approved":
        return <Badge className="bg-green-500">Aprobada</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelada</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  const todayStats = {
    total: filteredAppointments.length,
    pending: filteredAppointments.filter((apt) => apt.status === "pending").length,
    approved: filteredAppointments.filter((apt) => apt.status === "approved").length,
    completed: filteredAppointments.filter((apt) => apt.status === "completed").length,
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel de Recepción</h1>
        <p className="text-gray-600">Bienvenida, {user.profile?.name} - Gestión de citas y pacientes</p>
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
                <p className="text-sm font-medium text-gray-500">Total Citas</p>
                <p className="text-2xl font-bold">{todayStats.total}</p>
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
                <p className="text-2xl font-bold">{todayStats.pending}</p>
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
                <p className="text-sm font-medium text-gray-500">Aprobadas</p>
                <p className="text-2xl font-bold">{todayStats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <p className="text-2xl font-bold">{todayStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles y filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestión de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div>
                <label className="text-sm font-medium">Fecha:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="ml-2 px-3 py-1 border rounded-md"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar paciente o doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button onClick={() => (window.location.href = "/receptionist/new-appointment")}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cita Presencial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de citas */}
      <Card>
        <CardHeader>
          <CardTitle>Citas del {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay citas programadas</h3>
              <p className="text-gray-500">No se encontraron citas para los criterios seleccionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => {
                const timeSlot = getTimeSlotById(appointment.time_slot_id)
                const doctor = getDoctorById(appointment.doctor_id)
                const specialty = getSpecialtyById(appointment.specialty_id)

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
                      <div className="text-sm text-gray-600">
                        {doctor?.name || "Sin asignar"} - {specialty?.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(appointment.status)}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Detalles de la Cita</DialogTitle>
                            <DialogDescription>Información completa y acciones disponibles</DialogDescription>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div>
                                <Label className="font-medium">Paciente:</Label>
                                <p>{selectedAppointment.patient_name}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Especialidad:</Label>
                                <p>{getSpecialtyById(selectedAppointment.specialty_id)?.name}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Doctor:</Label>
                                <p>{getDoctorById(selectedAppointment.doctor_id)?.name || "Sin asignar"}</p>
                              </div>
                              <div>
                                <Label className="font-medium">Fecha y Hora:</Label>
                                <p>
                                  {formatDate(selectedAppointment.date)} -{" "}
                                  {getTimeSlotById(selectedAppointment.time_slot_id)?.time}
                                </p>
                              </div>
                              <div>
                                <Label className="font-medium">Estado:</Label>
                                <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
                              </div>
                              {selectedAppointment.notes && (
                                <div>
                                  <Label className="font-medium">Notas:</Label>
                                  <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                                </div>
                              )}

                              {selectedAppointment.status === "pending" && (
                                <div className="space-y-3">
                                  <div>
                                    <Label htmlFor="actionNotes">Notas (opcional):</Label>
                                    <Textarea
                                      id="actionNotes"
                                      placeholder="Agregar notas sobre la decisión..."
                                      value={actionNotes}
                                      onChange={(e) => setActionNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {selectedAppointment?.status === "pending" && (
                            <DialogFooter className="flex gap-2">
                              <Button
                                variant="destructive"
                                onClick={() => handleRejectAppointment(selectedAppointment.id)}
                                disabled={isProcessing}
                              >
                                <X className="h-4 w-4 mr-1" />
                                {isProcessing ? "Procesando..." : "Rechazar"}
                              </Button>
                              <Button
                                onClick={() => handleApproveAppointment(selectedAppointment.id)}
                                disabled={isProcessing}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {isProcessing ? "Procesando..." : "Aprobar"}
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
