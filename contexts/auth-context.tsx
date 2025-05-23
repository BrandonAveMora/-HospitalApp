"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

export type UserRole = "patient" | "doctor" | "receptionist"

export interface AppUser extends User {
  role: UserRole
  profile?: {
    name: string
    phone?: string
    address?: string
    specialtyId?: string // Solo para doctores
    doctorId?: string // ID del doctor en la tabla de doctores
  }
}

type AuthContextType = {
  user: AppUser | null
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Datos simulados de usuarios mejorados
const simulatedUsers: Record<string, AppUser> = {
  "patient@hospital.com": {
    id: "patient-1",
    email: "patient@hospital.com",
    role: "patient",
    profile: {
      name: "Juan Pérez",
      phone: "+1234567890",
      address: "Calle Principal 123, Ciudad",
    },
    user_metadata: { name: "Juan Pérez" },
  } as AppUser,
  "doctor@hospital.com": {
    id: "doctor-1",
    email: "doctor@hospital.com",
    role: "doctor",
    profile: {
      name: "Dr. María González",
      specialtyId: "cardio",
      doctorId: "dr-johnson", // Mapeo al ID en la tabla de doctores
    },
    user_metadata: { name: "Dr. María González" },
  } as AppUser,
  "receptionist@hospital.com": {
    id: "receptionist-1",
    email: "receptionist@hospital.com",
    role: "receptionist",
    profile: {
      name: "Ana Martínez",
    },
    user_metadata: { name: "Ana Martínez" },
  } as AppUser,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const checkSavedUser = () => {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setSession({ user: userData } as Session)
        } catch (error) {
          console.error("Error parsing saved user:", error)
          localStorage.removeItem("currentUser")
        }
      }
      setIsLoading(false)
    }

    // Solo ejecutar una vez al montar el componente
    checkSavedUser()
  }, []) // Sin dependencias para que solo se ejecute al montar

  const login = async (email: string, password: string) => {
    try {
      // Simulación de autenticación
      const userData = simulatedUsers[email.toLowerCase()]

      if (!userData) {
        return {
          success: false,
          error:
            "Usuario no encontrado. Usuarios de prueba: patient@hospital.com, doctor@hospital.com, receptionist@hospital.com",
        }
      }

      // En una implementación real, aquí verificarías la contraseña
      if (password.length < 6) {
        return {
          success: false,
          error: "Contraseña incorrecta. Use cualquier contraseña de 6+ caracteres para la demo.",
        }
      }

      setUser(userData)
      setSession({ user: userData } as Session)
      localStorage.setItem("currentUser", JSON.stringify(userData))

      return { success: true }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      return { success: false, error: "Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde." }
    }
  }

  const register = async (name: string, email: string, password: string, role: UserRole = "patient") => {
    try {
      // Verificar si el usuario ya existe
      if (simulatedUsers[email.toLowerCase()]) {
        return {
          success: false,
          error: "Este correo electrónico ya está registrado.",
        }
      }

      // Crear nuevo usuario
      const newUser: AppUser = {
        id: `${role}-${Date.now()}`,
        email: email.toLowerCase(),
        role,
        profile: {
          name,
          ...(role === "doctor" && { specialtyId: "gen-med", doctorId: `dr-${Date.now()}` }),
        },
        user_metadata: { name },
      } as AppUser

      // Guardar en la simulación
      simulatedUsers[email.toLowerCase()] = newUser

      setUser(newUser)
      setSession({ user: newUser } as Session)
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return { success: true }
    } catch (error) {
      console.error("Error de registro:", error)
      return { success: false, error: "Error al registrar usuario. Por favor, inténtelo de nuevo más tarde." }
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      setSession(null)
      localStorage.removeItem("currentUser")
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
