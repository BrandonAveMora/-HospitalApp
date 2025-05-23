"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createAppointment, getUserAppointments, deleteAppointment } from "@/lib/appointment-service"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

export function AppointmentTest() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const addTestResult = (result: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const testCreateAppointment = async () => {
    if (!user) {
      addTestResult("❌ Error: Usuario no autenticado")
      return
    }

    try {
      setIsLoading(true)
      addTestResult("🧪 Iniciando prueba de creación de cita...")

      const testData = {
        user_id: user.id,
        patient_name: user.profile?.name || "Usuario de Prueba",
        patient_id: user.id,
        specialty_id: "gen-med",
        doctor_id: "dr-smith",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 días desde hoy
        time_slot_id: "9am",
        package_id: null,
      }

      const result = await createAppointment(testData)
      addTestResult(`✅ Cita creada exitosamente: ID ${result.id}`)

      toast({
        title: "Prueba Exitosa",
        description: "Cita de prueba creada correctamente",
      })

      return result.id
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconocido"
      addTestResult(`❌ Error creando cita: ${errorMsg}`)

      toast({
        title: "Error en Prueba",
        description: errorMsg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testGetAppointments = async () => {
    if (!user) {
      addTestResult("❌ Error: Usuario no autenticado")
      return
    }

    try {
      setIsLoading(true)
      addTestResult("🧪 Iniciando prueba de obtención de citas...")

      const appointments = await getUserAppointments(user.id)
      addTestResult(`✅ Citas obtenidas: ${appointments.length} citas encontradas`)

      appointments.forEach((apt, index) => {
        addTestResult(`   📅 Cita ${index + 1}: ${apt.date} - ${apt.patient_name}`)
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconocido"
      addTestResult(`❌ Error obteniendo citas: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testDeleteAppointment = async () => {
    if (!user) {
      addTestResult("❌ Error: Usuario no autenticado")
      return
    }

    try {
      setIsLoading(true)
      addTestResult("🧪 Iniciando prueba completa (crear y eliminar)...")

      // Primero crear una cita
      const testData = {
        user_id: user.id,
        patient_name: "Prueba Eliminación",
        patient_id: user.id,
        specialty_id: "gen-med",
        doctor_id: null,
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        time_slot_id: "10am",
        package_id: null,
      }

      const created = await createAppointment(testData)
      addTestResult(`✅ Cita de prueba creada: ID ${created.id}`)

      // Luego eliminarla
      await deleteAppointment(created.id)
      addTestResult(`✅ Cita eliminada exitosamente: ID ${created.id}`)

      toast({
        title: "Prueba Completa Exitosa",
        description: "Creación y eliminación funcionan correctamente",
      })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconocido"
      addTestResult(`❌ Error en prueba completa: ${errorMsg}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Debe iniciar sesión para ejecutar las pruebas de funcionalidad</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pruebas de Funcionalidad - Sistema de Citas</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Usuario: {user.profile?.name || user.email}</Badge>
          <Badge variant="outline">Rol: {user.role}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={testCreateAppointment} disabled={isLoading} variant="outline">
            🧪 Probar Crear Cita
          </Button>
          <Button onClick={testGetAppointments} disabled={isLoading} variant="outline">
            📋 Probar Obtener Citas
          </Button>
          <Button onClick={testDeleteAppointment} disabled={isLoading} variant="outline">
            🗑️ Probar Crear y Eliminar
          </Button>
          <Button onClick={clearResults} disabled={isLoading} variant="ghost">
            🧹 Limpiar Resultados
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto">
            <h4 className="font-medium mb-2">Resultados de Pruebas:</h4>
            <div className="space-y-1 text-sm font-mono">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={
                    result.includes("✅")
                      ? "text-green-600"
                      : result.includes("❌")
                        ? "text-red-600"
                        : result.includes("🧪")
                          ? "text-blue-600"
                          : "text-gray-600"
                  }
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2">Ejecutando prueba...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
