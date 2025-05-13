"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AlertCircle } from "lucide-react"

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, asegúrese de que sus contraseñas coincidan.")
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor, asegúrese de que sus contraseñas coincidan.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      toast({
        title: "Contraseña demasiado corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { success, error } = await register(formData.name, formData.email, formData.password)

      if (!success) {
        setError(error || "Este correo electrónico ya está registrado. Por favor, use otro.")
        toast({
          title: "Error de Registro",
          description: error || "Este correo electrónico ya está registrado. Por favor, use otro.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Redirect to home page on successful registration
      toast({
        title: "Registro Exitoso",
        description: "Su cuenta ha sido creada exitosamente.",
      })

      setTimeout(() => {
        window.location.href = "/"
      }, 1000)
    } catch (error) {
      console.error("Registration error:", error)
      setError("Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.")
      toast({
        title: "Error de Registro",
        description: "Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear una Cuenta</CardTitle>
          <CardDescription className="text-center">Ingrese su información para crear una cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="su.correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando Cuenta..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm mt-2">
            ¿Ya tiene una cuenta?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-700 font-medium">
              Iniciar Sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
