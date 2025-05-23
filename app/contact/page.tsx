import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock, Stethoscope, Users, Heart } from "lucide-react"

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contacto e Información</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Estamos aquí para ayudarle. Contáctenos para cualquier consulta, emergencia o para programar una cita.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Información de contacto */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-500" />
                Teléfonos de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-600">Emergencias 24/7</h4>
                <p className="text-lg font-bold">(555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold">Citas y Consultas</h4>
                <p>(555) 765-4321</p>
              </div>
              <div>
                <h4 className="font-semibold">Información General</h4>
                <p>(555) 987-6543</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                Correos Electrónicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <h4 className="font-semibold">Información General</h4>
                <p>info@hospitalciudadgeneral.com</p>
              </div>
              <div>
                <h4 className="font-semibold">Citas</h4>
                <p>citas@hospitalciudadgeneral.com</p>
              </div>
              <div>
                <h4 className="font-semibold">Emergencias</h4>
                <p>emergencias@hospitalciudadgeneral.com</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Ubicación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-semibold">Hospital Ciudad General</p>
                <p>Avenida Médica 123</p>
                <p>Ciudad Sanitaria, CS 12345</p>
                <p>País</p>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Ubicado en el centro de la ciudad, con fácil acceso por transporte público y amplio estacionamiento
                  disponible.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Formulario de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Envíanos un Mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" placeholder="Su nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Su apellido" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="su.correo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="Su número de teléfono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Asunto</Label>
                <Input id="subject" placeholder="Motivo de su consulta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea id="message" placeholder="Escriba su mensaje aquí..." rows={5} />
              </div>
              <Button className="w-full">Enviar Mensaje</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Horarios de atención */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Horarios de Atención
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Consultas Generales</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lunes - Viernes:</span>
                  <span>8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados:</span>
                  <span>8:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos:</span>
                  <span>Cerrado</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Emergencias</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Todos los días:</span>
                  <span className="font-bold text-red-600">24 horas</span>
                </div>
                <p className="text-gray-600 mt-2">
                  Nuestro servicio de emergencias está disponible las 24 horas del día, los 7 días de la semana.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Especialidades disponibles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="h-5 w-5 mr-2 text-blue-500" />
            Nuestras Especialidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Heart className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-semibold">Cardiología</h4>
              <p className="text-sm text-gray-600">Cuidado especializado del corazón</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-semibold">Medicina General</h4>
              <p className="text-sm text-gray-600">Atención médica integral</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-purple-500 mb-2" />
              <h4 className="font-semibold">Pediatría</h4>
              <p className="text-sm text-gray-600">Cuidado especializado para niños</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <Users className="h-8 w-8 text-yellow-500 mb-2" />
              <h4 className="font-semibold">Dermatología</h4>
              <p className="text-sm text-gray-600">Cuidado de la piel</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <Heart className="h-8 w-8 text-red-500 mb-2" />
              <h4 className="font-semibold">Ortopedia</h4>
              <p className="text-sm text-gray-600">Cuidado de huesos y articulaciones</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-indigo-500 mb-2" />
              <h4 className="font-semibold">Neurología</h4>
              <p className="text-sm text-gray-600">Cuidado del sistema nervioso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Cómo Llegar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">En Transporte Público</h4>
                <p className="text-sm text-gray-600">Líneas de autobús: 15, 23, 45. Parada: Hospital Ciudad General</p>
              </div>
              <div>
                <h4 className="font-semibold">En Automóvil</h4>
                <p className="text-sm text-gray-600">
                  Estacionamiento gratuito disponible. Entrada por Avenida Médica.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Servicios Adicionales</h4>
                <ul className="text-sm text-gray-600 list-disc pl-5">
                  <li>Farmacia 24 horas</li>
                  <li>Cafetería</li>
                  <li>Capilla</li>
                  <li>WiFi gratuito</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seguros Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Aceptamos los siguientes seguros médicos:</p>
              <ul className="text-sm space-y-1">
                <li>• Seguro Nacional de Salud</li>
                <li>• Seguros Médicos Privados</li>
                <li>• Seguros Internacionales</li>
                <li>• Planes Corporativos</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> Para verificar la cobertura de su seguro, contáctenos antes de su cita.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
