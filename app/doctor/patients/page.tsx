"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Search, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getDoctorAppointments, getMedicalNotes } from "@/lib/appointment-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DoctorPatients() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [patientHistory, setPatientHistory] = useState<any[]>([])

  useEffect(() => {
    if (user?.id) {
      loadDoctorData()
    }
  }, [user?.id])

  const loadDoctorData = async () => {
    try {
      setIsLoading(true)
      const doctorId = "dr-johnson" // Este debería venir del perfil del usuario
      const doctorAppointments = await getDoctorAppointments(doctorId)
      setAppointments(doctorAppointments)

      // Agrupar pacientes únicos
      const uniquePatients = doctorAppointments.reduce((acc: any[], appointment: any) => {
        const existingPatient = acc.find((p) => p.patient_id === appointment.patient_id)
        if (!existingPatient) {
          acc.push({
            patient_id: appointment.patient_id,
            patient_name: appointment.patient_name,
            lastVisit: appointment.date,
            totalVisits: 1,
            status: appointment.status,
          })
        } else {
          existingPatient.totalVisits += 1
          if (new Date(appointment.date) > new Date(existingPatient.lastVisit)) {
            existingPatient.lastVisit = appointment.date
            existingPatient.status = appointment.status
          }
        }
        return acc
      }, [])

      setPatients(uniquePatients.sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()))
    } catch (error) {
      console.error("Error loading doctor data:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadPatientHistory = async (patientId: string) => {
    try {
      const patientAppointments = appointments.filter((apt) => apt.patient_id === patientId)
      const historyWithNotes = await Promise.all(
        patientAppointments.map(async (appointment) => {
          const notes = await getMedicalNotes(appointment.id)
          return {
            ...appointment,
            medicalNotes: notes,
          }
        }),
      )
      setPatientHistory(historyWithNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error("Error loading patient history:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el historial del paciente.",
        variant: "destructive",
      })
    }
  }

  const filteredPatients = patients.filter((patient) =>
    patient.patient_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Pacientes</h1>
        <p className="text-gray-600">Gestione el historial médico de sus pacientes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Pacientes</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas Totales</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pacientes Activos</p>
                <p className="text-2xl font-bold">
                  {
                    patients.filter((p) => new Date(p.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar paciente por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay pacientes</h3>
              <p className="text-gray-500">No se encontraron pacientes que coincidan con su búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.patient_id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">{patient.patient_name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Última visita: {formatDate(patient.lastVisit)}</span>
                        <span>Total consultas: {patient.totalVisits}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={patient.status === "completed" ? "default" : "secondary"}
                      className={patient.status === "completed" ? "bg-green-500" : "bg-yellow-500"}
                    >
                      {patient.status === "completed" ? "Última consulta completada" : "Consulta pendiente"}
                    </Badge>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(patient)
                            loadPatientHistory(patient.patient_id)
                          }}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Ver Historial
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Historial Médico - {selectedPatient?.patient_name}</DialogTitle>
                          <DialogDescription>Historial completo de consultas y tratamientos</DialogDescription>
                        </DialogHeader>

                        {selectedPatient && (
                          <div className="space-y-6">
                            {/* Información del paciente */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Información del Paciente</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Nombre:</span> {selectedPatient.patient_name}
                                </div>
                                <div>
                                  <span className="font-medium">ID Paciente:</span> {selectedPatient.patient_id}
                                </div>
                                <div>
                                  <span className="font-medium">Total Consultas:</span> {selectedPatient.totalVisits}
                                </div>
                                <div>
                                  <span className="font-medium">Última Visita:</span>{" "}
                                  {formatDate(selectedPatient.lastVisit)}
                                </div>
                              </div>
                            </div>

                            {/* Historial de consultas */}
                            <div>
                              <h4 className="font-medium mb-3">Historial de Consultas</h4>
                              {patientHistory.length === 0 ? (
                                <p className="text-gray-500">Cargando historial...</p>
                              ) : (
                                <div className="space-y-4">
                                  {patientHistory.map((appointment) => (
                                    <div key={appointment.id} className="border p-4 rounded-lg">
                                      <div className="flex justify-between items-start mb-3">
                                        <div>
                                          <h5 className="font-medium">{formatDate(appointment.date)}</h5>
                                          <p className="text-sm text-gray-500">
                                            Estado: {appointment.status === "completed" ? "Completada" : "Pendiente"}
                                          </p>
                                        </div>
                                        <Badge
                                          variant={appointment.status === "completed" ? "default" : "secondary"}
                                          className={
                                            appointment.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                                          }
                                        >
                                          {appointment.status === "completed" ? "Completada" : "Pendiente"}
                                        </Badge>
                                      </div>

                                      {appointment.notes && (
                                        <div className="mb-3">
                                          <span className="font-medium">Notas de la cita:</span>
                                          <p className="text-sm text-gray-600">{appointment.notes}</p>
                                        </div>
                                      )}

                                      {appointment.medicalNotes && appointment.medicalNotes.length > 0 && (
                                        <div className="space-y-3">
                                          <h6 className="font-medium">Notas Médicas:</h6>
                                          {appointment.medicalNotes.map((note: any, index: number) => (
                                            <div key={note.id || index} className="bg-blue-50 p-3 rounded">
                                              <div className="space-y-2 text-sm">
                                                <div>
                                                  <strong>Diagnóstico:</strong> {note.diagnosis}
                                                </div>
                                                <div>
                                                  <strong>Tratamiento:</strong> {note.treatment}
                                                </div>
                                                {note.notes && (
                                                  <div>
                                                    <strong>Observaciones:</strong> {note.notes}
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
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
