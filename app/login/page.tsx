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

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { success, error } = await login(formData.email, formData.password)

      if (!success) {
        toast({
          title: "Error de Inicio de Sesión",
          description: error || "Correo electrónico o contraseña inválidos. Por favor, inténtelo de nuevo.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Redirect to home page on successful login
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "Ha iniciado sesión correctamente.",
      })

      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error de Inicio de Sesión",
        description: "Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">
            Ingrese su correo electrónico y contraseña para acceder a su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
                  ¿Olvidó su contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm mt-2">
            ¿No tiene una cuenta?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-700 font-medium">
              Registrarse
            </Link>
          </div>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}
