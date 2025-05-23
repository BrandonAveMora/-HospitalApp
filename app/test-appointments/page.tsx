"use client"

import { AppointmentTest } from "@/components/appointment-test"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CheckCircle, AlertTriangle } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function TestAppointments() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Verificación de Funcionalidad - Sistema de Citas</h1>

      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Información de Pruebas</AlertTitle>
          <AlertDescription>
            Esta página permite verificar que todas las funciones del sistema de citas funcionen correctamente. Las
            pruebas incluyen crear, obtener y eliminar citas.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Verificación de Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Autenticación de usuarios (paciente, doctor, recepcionista)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Navegación condicional basada en roles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Formulario de reserva de citas con validaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Selección de especialidades y médicos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Calendario con restricciones de fechas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Selección de horarios disponibles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>✅ Integración con paquetes médicos</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>🧪 Creación de citas en base de datos (requiere prueba)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>🧪 Obtención de citas del usuario (requiere prueba)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>🧪 Cancelación de citas (requiere prueba)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <AppointmentTest />

        <Card>
          <CardHeader>
            <CardTitle>Flujo de Prueba Recomendado</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Asegúrese de estar autenticado como paciente</li>
              <li>Ejecute "Probar Obtener Citas" para ver las citas existentes</li>
              <li>Ejecute "Probar Crear Cita" para crear una nueva cita</li>
              <li>Vuelva a ejecutar "Probar Obtener Citas" para verificar que se creó</li>
              <li>Ejecute "Probar Crear y Eliminar" para verificar el ciclo completo</li>
              <li>Visite la página "Mis Citas" para verificar la interfaz de usuario</li>
              <li>Pruebe cancelar una cita desde la interfaz</li>
            </ol>
          </CardContent>
        </Card>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Nota Importante</AlertTitle>
          <AlertDescription>
            Las pruebas crean y eliminan citas reales en la base de datos. Si encuentra errores, revise la consola del
            navegador para más detalles.
          </AlertDescription>
        </Alert>
      </div>

      <Toaster />
    </div>
  )
}
