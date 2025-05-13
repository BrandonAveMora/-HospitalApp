"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Menu, LogOut, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, logout } = useAuth()
  const isAuthenticated = !!user

  // Obtener el nombre del usuario de los metadatos
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuario"

  const handleSignOut = () => {
    logout()
  }

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
          {isAuthenticated && (
            <>
              <Link href="/book-appointment" className="text-gray-700 hover:text-blue-500 transition-colors">
                Reservar Cita
              </Link>
              <Link href="/my-appointments" className="text-gray-700 hover:text-blue-500 transition-colors">
                Mis Citas
              </Link>
              <Link href="/medical-history" className="text-gray-700 hover:text-blue-500 transition-colors">
                Historial Médico
              </Link>
              <Link href="/medical-packages" className="text-gray-700 hover:text-blue-500 transition-colors">
                Paquetes Médicos
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {userName}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="font-medium">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/medical-history" className="flex items-center cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Mi Historial Médico
                  </Link>
                </DropdownMenuItem>
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
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 bg-gray-100 rounded-md">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/book-appointment" className="text-gray-700 hover:text-blue-500 transition-colors">
                    Reservar Cita
                  </Link>
                  <Link href="/my-appointments" className="text-gray-700 hover:text-blue-500 transition-colors">
                    Mis Citas
                  </Link>
                  <Link href="/medical-history" className="text-gray-700 hover:text-blue-500 transition-colors">
                    Historial Médico
                  </Link>
                  <Link href="/medical-packages" className="text-gray-700 hover:text-blue-500 transition-colors">
                    Paquetes Médicos
                  </Link>
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
