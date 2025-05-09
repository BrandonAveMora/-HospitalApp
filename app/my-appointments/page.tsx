"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Stethoscope, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSpecialtyById, getDoctorById, getTimeSlotById } from "@/lib/data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function MyAppointments() {
  const router = useRouter()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load appointments from localStorage
      const savedAppointments = localStorage.getItem("appointments")
      const allAppointments = savedAppointments ? JSON.parse(savedAppointments) : []

      // Filter appointments for the current user
      if (user?.id) {
        setAppointments(allAppointments.filter((appointment: any) => appointment.userId === user.id))
      } else {
        setAppointments([])
      }
    }
  }, [user])

  const cancelAppointment = (id: string) => {
    if (typeof window !== "undefined") {
      const savedAppointments = localStorage.getItem("appointments")
      const allAppointments = savedAppointments ? JSON.parse(savedAppointments) : []

      // Filter out the appointment to cancel
      const updatedAppointments = allAppointments.filter((appointment: any) => appointment.id !== id)
      localStorage.setItem("appointments", JSON.stringify(updatedAppointments))

      // Update the state
      setAppointments(appointments.filter((appointment) => appointment.id !== id))
      setAppointmentToCancel(null)

      toast({
        title: "Cita Cancelada",
        description: "Su cita ha sido cancelada exitosamente.",
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-medium mb-2">Autenticación Requerida</h3>
              <p className="text-gray-500 mb-6">Por favor, inicie sesión para ver sus citas.</p>
              <Button onClick={() => router.push("/login")}>Iniciar Sesión</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Mis Citas</h1>

      {appointments.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Hay Citas</h3>
              <p className="text-gray-500 mb-6">Aún no tiene citas programadas.</p>
              <Button onClick={() => router.push("/book-appointment")}>Reservar una Cita</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const specialty = getSpecialtyById(appointment.specialtyId)
            const doctor = appointment.doctorId ? getDoctorById(appointment.doctorId) : null
            const timeSlot = getTimeSlotById(appointment.timeSlotId)

            return (
              <Card key={appointment.id} className="overflow-hidden">
                <CardHeader className="bg-blue-50 pb-2">
                  <CardTitle className="text-lg">Cita de {specialty?.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{timeSlot?.time}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{appointment.patientName}</span>
                      </div>
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{doctor ? doctor.name : "Cualquier médico disponible"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setAppointmentToCancel(appointment.id)}>
                        <X className="h-4 w-4 mr-1" /> Cancelar Cita
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Cita</AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Está seguro de que desea cancelar esta cita? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Mantener Cita</AlertDialogCancel>
                        <AlertDialogAction onClick={() => cancelAppointment(appointment.id)}>
                          Sí, Cancelar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
      <Toaster />
    </div>
  )
}
