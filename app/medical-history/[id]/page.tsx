"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, FileText, User, Stethoscope, ArrowLeft, Download, Printer } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSpecialtyById, getDoctorById } from "@/lib/data"
import { getMedicalRecordDetails } from "@/lib/medical-record-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { MedicalRecord } from "@/lib/data"

export default function MedicalRecordDetails() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [record, setRecord] = useState<MedicalRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMedicalRecord() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const recordId = params.id as string
        const recordDetails = await getMedicalRecordDetails(recordId)

        if (!recordDetails) {
          toast({
            title: "Error",
            description: "No se encontró el registro médico solicitado.",
            variant: "destructive",
          })
          router.push("/medical-history")
          return
        }

        setRecord(recordDetails)
      } catch (error) {
        console.error("Error al cargar detalles del registro médico:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles del registro médico. Por favor, inténtelo de nuevo.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadMedicalRecord()
  }, [user, params.id, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completado</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pendiente</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "consultation":
        return (
          <Badge variant="outline" className="flex items-center bg-blue-50">
            <Stethoscope className="h-4 w-4 mr-1" /> Consulta
          </Badge>
        )
      case "test":
        return (
          <Badge variant="outline" className="flex items-center bg-purple-50">
            <FileText className="h-4 w-4 mr-1" /> Examen
          </Badge>
        )
      case "procedure":
        return (
          <Badge variant="outline" className="flex items-center bg-green-50">
            <User className="h-4 w-4 mr-1" /> Procedimiento
          </Badge>
        )
      case "hospitalization":
        return (
          <Badge variant="outline" className="flex items-center bg-red-50">
            <Calendar className="h-4 w-4 mr-1" /> Hospitalización
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center">
            <FileText className="h-4 w-4 mr-1" /> Otro
          </Badge>
        )
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <h3 className="text-xl font-medium mb-2">Autenticación Requerida</h3>
              <p className="text-gray-500 mb-6">Por favor, inicie sesión para ver su historial médico.</p>
              <Button onClick={() => router.push("/login")}>Iniciar Sesión</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Registro No Encontrado</h3>
              <p className="text-gray-500 mb-6">El registro médico solicitado no existe o no tiene acceso a él.</p>
              <Button onClick={() => router.push("/medical-history")}>Volver al Historial</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const specialty = getSpecialtyById(record.specialtyId)
  const doctor = getDoctorById(record.doctorId)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.push("/medical-history")} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
        <h1 className="text-2xl font-bold">Detalles del Registro Médico</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {specialty?.name} {getStatusBadge(record.status)}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" /> {formatDate(record.date)}
                  </CardDescription>
                </div>
                <div>{getTypeBadge(record.type)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Diagnóstico</h3>
                <p className="text-gray-700">{record.diagnosis}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">Tratamiento</h3>
                <p className="text-gray-700">{record.treatment}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-2">Notas</h3>
                <p className="text-gray-700">{record.notes}</p>
              </div>

              {record.followUp && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Seguimiento</h3>
                    <div className="flex items-center text-blue-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(record.followUp)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" /> Imprimir
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" /> Descargar PDF
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Médico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">{doctor?.name || "No especificado"}</h3>
                  <p className="text-sm text-gray-500">{specialty?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {record.type === "test" && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Resultados de Exámenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-md text-sm">
                  <p className="font-medium mb-2">Valores de Referencia:</p>
                  <ul className="space-y-1 list-disc pl-5">
                    <li>Hemoglobina: 12.0 - 16.0 g/dL</li>
                    <li>Glucosa: 70 - 100 mg/dL</li>
                    <li>Colesterol total: &lt; 200 mg/dL</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-gray-50">
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="h-4 w-4 mr-1" /> Ver Resultados Completos
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" /> Solicitar Cita de Seguimiento
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" /> Solicitar Copia de Registros
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
