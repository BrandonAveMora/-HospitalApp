"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { specialties, doctors, timeSlots, getDoctorsBySpecialty, getPackageById, type Appointment } from "@/lib/data"
import { saveAppointments, getAppointments, generateId } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function BookAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package")

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
  }, [packageId])

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
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create new appointment
    const newAppointment: Appointment = {
      id: generateId(),
      patientName: formData.patientName,
      patientId: formData.patientId,
      specialtyId: formData.specialtyId,
      doctorId: formData.doctorId || undefined,
      date: formData.date.toISOString().split("T")[0],
      timeSlotId: formData.timeSlotId,
      packageId: packageId || undefined,
    }

    // Save to localStorage
    const currentAppointments = getAppointments()
    saveAppointments([...currentAppointments, newAppointment])

    // Show success message
    toast({
      title: "Appointment Booked",
      description: "Your appointment has been successfully scheduled.",
    })

    // Redirect to appointments page
    setTimeout(() => {
      router.push("/my-appointments")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full Name</Label>
                <Input
                  id="patientName"
                  placeholder="Enter your full name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId">ID Number</Label>
                <Input
                  id="patientId"
                  placeholder="Enter your ID number"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={formData.specialtyId} onValueChange={handleSpecialtyChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
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
                <Label htmlFor="doctor">Doctor (Optional)</Label>
                <Select
                  value={formData.doctorId}
                  onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                  disabled={!formData.specialtyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
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
                <Label>Select Date</Label>
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
                <Label htmlFor="timeSlot">Available Time Slots</Label>
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
              {isSubmitting ? "Booking..." : "Confirm Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
