"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Verificar sesión actual
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("Error al obtener la sesión:", error)
      }

      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    }

    checkSession()

    // Configurar listener para cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Mensajes de error más específicos
        if (error.message.includes("Invalid login credentials")) {
          return {
            success: false,
            error: "Correo electrónico o contraseña incorrectos. Por favor, verifique sus datos.",
          }
        } else if (error.message.includes("Email not confirmed")) {
          return { success: false, error: "Por favor, confirme su correo electrónico antes de iniciar sesión." }
        }
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      return { success: false, error: "Error al iniciar sesión. Por favor, inténtelo de nuevo más tarde." }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        // Mensajes de error más específicos
        if (error.message.includes("already registered")) {
          return {
            success: false,
            error:
              "Este correo electrónico ya está registrado. Por favor, utilice otro o intente recuperar su contraseña.",
          }
        } else if (error.message.includes("password")) {
          return { success: false, error: "La contraseña debe tener al menos 6 caracteres." }
        }
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Error de registro:", error)
      return { success: false, error: "Error al registrar usuario. Por favor, inténtelo de nuevo más tarde." }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      // Forzar recarga para actualizar el estado
      window.location.href = "/"
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
