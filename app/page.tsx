"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { user } = useAuth()
  const isAuthenticated = !!user

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
            ? `¡Bienvenido de nuevo, ${user.name}! Reserve citas, administre su agenda y explore nuestros paquetes médicos.`
            : "Bienvenido a nuestro portal de pacientes. Inicie sesión para reservar citas, administrar su agenda y explorar nuestros paquetes médicos."}
        </p>
      </div>

      {isAuthenticated ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                  <path d="M8 14h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M16 18h.01" />
                </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
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
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-500"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" y2="12" x2="12" />
                </svg>
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
