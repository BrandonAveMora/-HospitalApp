"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Menu, LogOut, User, FileText, Calendar, Users, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const { user, logout } = useAuth()
  const isAuthenticated = !!user

  // Obtener el nombre del usuario
  const userName = user?.profile?.name || user?.email?.split("@")[0] || "Usuario"

  const handleSignOut = () => {
    logout()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-500"
      case "receptionist":
        return "bg-green-500"
      case "patient":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "doctor":
        return "Doctor"
      case "receptionist":
        return "Recepcionista"
      case "patient":
        return "Paciente"
      default:
        return "Usuario"
    }
  }

  const getNavigationItems = () => {
    if (!user) return []

    switch (user.role) {
      case "patient":
        return [
          { href: "/patient/profile", label: "Mi Perfil", icon: User },
          { href: "/book-appointment", label: "Agendar Cita", icon: Calendar },
          { href: "/my-appointments", label: "Mis Citas", icon: FileText },
          { href: "/medical-packages", label: "Paquetes Médicos", icon: Stethoscope },
          { href: "/medical-history", label: "Historial Médico", icon: FileText },
          { href: "/test-appointments", label: "Pruebas del Sistema", icon: FileText },
        ]
      case "doctor":
        return [
          { href: "/doctor/dashboard", label: "Panel de Citas", icon: Calendar },
          { href: "/doctor/patients", label: "Mis Pacientes", icon: Users },
          { href: "/doctor/schedule", label: "Mi Horario", icon: Calendar },
        ]
      case "receptionist":
        return [
          { href: "/receptionist/dashboard", label: "Panel Principal", icon: Calendar },
          { href: "/receptionist/appointments", label: "Gestionar Citas", icon: Calendar },
          { href: "/receptionist/patients", label: "Buscar Pacientes", icon: Users },
          { href: "/receptionist/schedule", label: "Programar Citas", icon: Calendar },
        ]
      default:
        return []
    }
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white p-1 rounded-md">
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
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="font-bold text-xl">Hospital Ciudad General</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">
            Inicio
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-500 transition-colors">
            Contacto
          </Link>
          {navigationItems.slice(0, 3).map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-700 hover:text-blue-500 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{userName}</span>
                    <Badge className={`text-xs ${getRoleColor(user.role)} text-white`}>{getRoleLabel(user.role)}</Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="font-medium">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {navigationItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center cursor-pointer">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrarse</Button>
              </Link>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">
                Inicio
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-500 transition-colors">
                Contacto
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 bg-gray-100 rounded-md">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <Badge className={`text-xs ${getRoleColor(user.role)} text-white mt-1`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-gray-700 hover:text-blue-500 transition-colors flex items-center"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-500 transition-colors">
                    Iniciar Sesión
                  </Link>
                  <Link href="/register" className="text-gray-700 hover:text-blue-500 transition-colors">
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
