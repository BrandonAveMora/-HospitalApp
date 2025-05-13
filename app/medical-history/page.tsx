"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, User, Stethoscope, Search, Download, Filter } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { getSpecialtyById, getDoctorById } from "@/lib/data"
import { getUserMedicalRecords } from "@/lib/medical-record-service"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { MedicalRecord } from "@/lib/data"

export default function MedicalHistory() {
  const router = useRouter()
  const { user } = useAuth()
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all")

  useEffect(() => {
    async function loadMedicalRecords() {
      if (user?.id) {
        try {
          const userRecords = await getUserMedicalRecords(user.id)
          setRecords(userRecords)
          setFilteredRecords(userRecords)
        } catch (error) {
          console.error("Error al cargar historial médico:", error)
          toast({
            title: "Error",
            description: "No se pudo cargar su historial médico. Por favor, inténtelo de nuevo.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    loadMedicalRecords()
  }, [user])

  useEffect(() => {
    // Aplicar filtros cuando cambien
    let result = records

    // Filtrar por tipo
    if (filterType !== "all") {
      result = result.filter((record) => record.type === filterType)
    }

    // Filtrar por especialidad
    if (filterSpecialty !== "all") {
      result = result.filter((record) => record.specialtyId === filterSpecialty)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (record) =>
          record.diagnosis.toLowerCase().includes(term) ||
          record.treatment.toLowerCase().includes(term) ||
          record.notes.toLowerCase().includes(term) ||
          getSpecialtyById(record.specialtyId)?.name.toLowerCase().includes(term) ||
          getDoctorById(record.doctorId)?.name.toLowerCase().includes(term),
      )
    }

    setFilteredRecords(result)
  }, [records, searchTerm, filterType, filterSpecialty])

  const handleViewDetails = (recordId: string) => {
    router.push(`/medical-history/${recordId}`)
  }

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Stethoscope className="h-4 w-4 mr-1" />
      case "test":
        return <FileText className="h-4 w-4 mr-1" />
      case "procedure":
        return <User className="h-4 w-4 mr-1" />
      case "hospitalization":
        return <Calendar className="h-4 w-4 mr-1" />
      default:
        return <FileText className="h-4 w-4 mr-1" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "consultation":
        return (
          <Badge variant="outline" className="flex items-center bg-blue-50">
            {getTypeIcon(type)} Consulta
          </Badge>
        )
      case "test":
        return (
          <Badge variant="outline" className="flex items-center bg-purple-50">
            {getTypeIcon(type)} Examen
          </Badge>
        )
      case "procedure":
        return (
          <Badge variant="outline" className="flex items-center bg-green-50">
            {getTypeIcon(type)} Procedimiento
          </Badge>
        )
      case "hospitalization":
        return (
          <Badge variant="outline" className="flex items-center bg-red-50">
            {getTypeIcon(type)} Hospitalización
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center">
            {getTypeIcon(type)} Otro
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Mi Historial Médico</h1>
      <p className="text-gray-600 text-center mb-8">
        Consulte su historial médico completo, incluyendo consultas, exámenes y procedimientos
      </p>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar en historial médico..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="consultation">Consultas</SelectItem>
                <SelectItem value="test">Exámenes</SelectItem>
                <SelectItem value="procedure">Procedimientos</SelectItem>
                <SelectItem value="hospitalization">Hospitalizaciones</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-[180px]">
                <Stethoscope className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especialidades</SelectItem>
                <SelectItem value="gen-med">Medicina General</SelectItem>
                <SelectItem value="cardio">Cardiología</SelectItem>
                <SelectItem value="derm">Dermatología</SelectItem>
                <SelectItem value="ped">Pediatría</SelectItem>
                <SelectItem value="dent">Odontología</SelectItem>
                <SelectItem value="ortho">Ortopedia</SelectItem>
                <SelectItem value="neuro">Neurología</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Hay Registros</h3>
                  <p className="text-gray-500 mb-6">
                    No se encontraron registros médicos que coincidan con su búsqueda.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record) => {
              const specialty = getSpecialtyById(record.specialtyId)
              const doctor = getDoctorById(record.doctorId)

              return (
                <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {specialty?.name}
                          {getStatusBadge(record.status)}
                        </CardTitle>
                        <CardDescription>{formatDate(record.date)}</CardDescription>
                      </div>
                      <div>{getTypeBadge(record.type)}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium">Diagnóstico</h4>
                        <p className="text-gray-700">{record.diagnosis}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Médico</h4>
                        <p className="text-gray-700">{doctor?.name || "No especificado"}</p>
                      </div>
                      {record.followUp && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          Seguimiento: {formatDate(record.followUp)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(record.id)}>
                      Ver Detalles
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Download className="h-4 w-4 mr-1" /> PDF
                    </Button>
                  </CardFooter>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredRecords.filter((r) => r.status === "completed").length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Hay Registros Completados</h3>
                  <p className="text-gray-500 mb-6">No se encontraron registros médicos completados.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRecords
              .filter((r) => r.status === "completed")
              .map((record) => {
                const specialty = getSpecialtyById(record.specialtyId)
                const doctor = getDoctorById(record.doctorId)

                return (
                  <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {specialty?.name}
                            {getStatusBadge(record.status)}
                          </CardTitle>
                          <CardDescription>{formatDate(record.date)}</CardDescription>
                        </div>
                        <div>{getTypeBadge(record.type)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Diagnóstico</h4>
                          <p className="text-gray-700">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Médico</h4>
                          <p className="text-gray-700">{doctor?.name || "No especificado"}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(record.id)}>
                        Ver Detalles
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredRecords.filter((r) => r.status === "pending").length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Hay Registros Pendientes</h3>
                  <p className="text-gray-500 mb-6">No se encontraron registros médicos pendientes.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRecords
              .filter((r) => r.status === "pending")
              .map((record) => {
                const specialty = getSpecialtyById(record.specialtyId)
                const doctor = getDoctorById(record.doctorId)

                return (
                  <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {specialty?.name}
                            {getStatusBadge(record.status)}
                          </CardTitle>
                          <CardDescription>{formatDate(record.date)}</CardDescription>
                        </div>
                        <div>{getTypeBadge(record.type)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Diagnóstico</h4>
                          <p className="text-gray-700">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Médico</h4>
                          <p className="text-gray-700">{doctor?.name || "No especificado"}</p>
                        </div>
                        {record.followUp && (
                          <div className="flex items-center text-sm text-blue-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            Seguimiento: {formatDate(record.followUp)}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(record.id)}>
                        Ver Detalles
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Hay Registros Recientes</h3>
                  <p className="text-gray-500 mb-6">No se encontraron registros médicos recientes.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((record) => {
                const specialty = getSpecialtyById(record.specialtyId)
                const doctor = getDoctorById(record.doctorId)

                return (
                  <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {specialty?.name}
                            {getStatusBadge(record.status)}
                          </CardTitle>
                          <CardDescription>{formatDate(record.date)}</CardDescription>
                        </div>
                        <div>{getTypeBadge(record.type)}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium">Diagnóstico</h4>
                          <p className="text-gray-700">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Médico</h4>
                          <p className="text-gray-700">{doctor?.name || "No especificado"}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(record.id)}>
                        Ver Detalles
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
          )}
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}
