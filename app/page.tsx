"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Calendar, FileText, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { user } = useAuth()
  const isAuthenticated = !!user

  // Obtener el nombre del usuario de los metadatos
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuario"

  return (
    <main className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <div className="bg-blue-500 text-white p-6 rounded-full mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Hospital Ciudad General</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          {isAuthenticated
            ? `¡Bienvenido de nuevo, ${userName}! Reserve citas, administre su agenda y explore nuestros paquetes médicos.`
            : "Bienvenido a nuestro portal de pacientes. Inicie sesión para reservar citas, administrar su agenda y explorar nuestros paquetes médicos."}
        </p>
      </div>

      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Reservar Cita</h2>
              <p className="text-gray-600 mb-4 text-center">Programe una nueva cita con nuestros especialistas.</p>
              <Link href="/book-appointment" className="mt-auto">
                <Button className="w-full">
                  Reservar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Mis Citas</h2>
              <p className="text-gray-600 mb-4 text-center">Vea y administre sus próximas citas.</p>
              <Link href="/my-appointments" className="mt-auto">
                <Button className="w-full" variant="outline">
                  Ver Citas <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <FileText className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Historial Médico</h2>
              <p className="text-gray-600 mb-4 text-center">Acceda a su historial médico completo.</p>
              <Link href="/medical-history" className="mt-auto">
                <Button className="w-full" variant="outline">
                  Ver Historial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Paquetes Médicos</h2>
              <p className="text-gray-600 mb-4 text-center">Explore nuestros paquetes de salud integrales.</p>
              <Link href="/medical-packages" className="mt-auto">
                <Button className="w-full" variant="outline">
                  Explorar Paquetes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Proteja su Información de Salud</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cree una cuenta o inicie sesión para acceder a nuestra gama completa de servicios, incluida la reserva de
              citas, registros médicos y paquetes de salud personalizados.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" size="lg">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg">Registrarse Ahora</Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
