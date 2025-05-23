"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Phone, MapPin, Mail, Edit, Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PatientProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.profile?.name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
  })

  const handleSave = () => {
    // En una implementación real, aquí guardarías los datos en la base de datos
    toast({
      title: "Perfil Actualizado",
      description: "Su información ha sido guardada exitosamente.",
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.profile?.name || "",
      email: user?.email || "",
      phone: user?.profile?.phone || "",
      address: user?.profile?.address || "",
    })
    setIsEditing(false)
  }

  if (!user || user.role !== "patient") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="text-center p-8">
          <CardContent>
            <h3 className="text-xl font-medium mb-2">Acceso Denegado</h3>
            <p className="text-gray-500">Esta página es solo para pacientes.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formData.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="flex items-center p-2 bg-gray-50 rounded-md">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
                <p className="text-xs text-gray-500">El correo electrónico no se puede modificar</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ingrese su número de teléfono"
                  />
                ) : (
                  <div className="flex items-center p-2 bg-gray-50 rounded-md">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{formData.phone || "No especificado"}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ingrese su dirección completa"
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start p-2 bg-gray-50 rounded-md">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                    <span>{formData.address || "No especificada"}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Cuenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Tipo de Usuario</Label>
                <div className="mt-1 p-2 bg-purple-50 text-purple-700 rounded-md text-sm">Paciente</div>
              </div>

              <div>
                <Label className="text-sm font-medium">ID de Paciente</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm font-mono">{user.id}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">Fecha de Registro</Label>
                <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm">{new Date().toLocaleDateString("es-ES")}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Cambiar Contraseña
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Preferencias de Notificación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
