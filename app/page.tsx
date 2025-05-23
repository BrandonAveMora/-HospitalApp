"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Calendar, FileText, Package, Users, Stethoscope, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  const isAuthenticated = !!user

  useEffect(() => {
    // Evitar redirecciones innecesarias
    if (user && !window.location.pathname.includes(`/${user.role}`)) {
      switch (user.role) {
        case "doctor":
          router.push("/doctor/dashboard")
          break
        case "receptionist":
          router.push("/receptionist/dashboard")
          break
        case "patient":
          // Los pacientes pueden quedarse en la página principal
          break
      }
    }
  }, [user, router])

  // Obtener el nombre del usuario
  const userName = user?.profile?.name || user?.email?.split("@")[0] || "Usuario"

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
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
        <p className="text-xl text-gray-600 max-w-3xl">
          {isAuthenticated
            ? `¡Bienvenido de nuevo, ${userName}! Acceda a nuestros servicios médicos especializados.`
            : "Bienvenido a nuestro portal médico. Ofrecemos atención médica de calidad con tecnología avanzada y personal altamente capacitado."}
        </p>
      </div>

      {isAuthenticated && user?.role === "patient" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Agendar Cita</h2>
              <p className="text-gray-600 mb-4 text-center">Programe una nueva cita con nuestros especialistas.</p>
              <Link href="/book-appointment" className="mt-auto">
                <Button className="w-full">
                  Agendar Ahora <ArrowRight className="ml-2 h-4 w-4" />
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
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceda a Nuestros Servicios</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Inicie sesión para acceder a nuestros servicios médicos especializados. Tenemos diferentes portales para
              pacientes, doctores y personal administrativo.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Usuarios de Demostración:</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Paciente:</strong> patient@hospital.com
                </p>
                <p>
                  <strong>Doctor:</strong> doctor@hospital.com
                </p>
                <p>
                  <strong>Recepcionista:</strong> receptionist@hospital.com
                </p>
                <p className="text-gray-500 mt-2">Contraseña: cualquier texto de 6+ caracteres</p>
              </div>
            </div>
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
      ) : null}

      {/* Información institucional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Stethoscope className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Atención Especializada</h3>
            <p className="text-gray-600">
              Contamos con especialistas en todas las áreas médicas para brindarle la mejor atención.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personal Calificado</h3>
            <p className="text-gray-600">
              Nuestro equipo médico está altamente capacitado y comprometido con su bienestar.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4 w-16 h-16 mx-auto flex items-center justify-center">
              <Phone className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Atención 24/7</h3>
            <p className="text-gray-600">
              Estamos disponibles las 24 horas del día para atender sus emergencias médicas.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información de contacto */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">¿Necesita Ayuda?</h2>
        <p className="text-gray-600 mb-6">
          Nuestro equipo está disponible para asistirle con cualquier consulta o emergencia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Información de Contacto
            </Button>
          </Link>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Emergencias: (555) 123-4567
          </Button>
        </div>
      </div>
    </main>
  )
}
