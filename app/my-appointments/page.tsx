"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Stethoscope, X } from "lucide-react"
import { getAppointments, saveAppointments, formatDate } from "@/lib/utils"
import { getSpecialtyById, getDoctorById, getTimeSlotById, type Appointment } from "@/lib/data"
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
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)

  useEffect(() => {
    // Load appointments from localStorage
    const savedAppointments = getAppointments()
    setAppointments(savedAppointments)
  }, [])

  const cancelAppointment = (id: string) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== id)
    saveAppointments(updatedAppointments)
    setAppointments(updatedAppointments)
    setAppointmentToCancel(null)

    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been successfully cancelled.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">My Appointments</h1>

      {appointments.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No Appointments</h3>
              <p className="text-gray-500 mb-6">You don't have any scheduled appointments yet.</p>
              <Button onClick={() => (window.location.href = "/book-appointment")}>Book an Appointment</Button>
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
                  <CardTitle className="text-lg">{specialty?.name} Appointment</CardTitle>
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
                        <span>{doctor ? doctor.name : "Any available doctor"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-gray-50 flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" onClick={() => setAppointmentToCancel(appointment.id)}>
                        <X className="h-4 w-4 mr-1" /> Cancel Appointment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this appointment? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                        <AlertDialogAction onClick={() => cancelAppointment(appointment.id)}>
                          Yes, Cancel
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
