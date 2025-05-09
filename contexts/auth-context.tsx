"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulamos una pequeña demora para simular una petición
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Obtener usuarios del localStorage
    const usersJson = localStorage.getItem("users")
    const users = usersJson ? JSON.parse(usersJson) : []

    // Buscar usuario por email
    const foundUser = users.find((u: any) => u.email === email)

    // Verificar si existe y la contraseña coincide
    if (foundUser && foundUser.password === password) {
      // Crear objeto de usuario sin la contraseña
      const loggedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      }

      // Guardar en localStorage y estado
      localStorage.setItem("currentUser", JSON.stringify(loggedUser))
      setUser(loggedUser)
      return true
    }

    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulamos una pequeña demora para simular una petición
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Obtener usuarios existentes
    const usersJson = localStorage.getItem("users")
    const users = usersJson ? JSON.parse(usersJson) : []

    // Verificar si el email ya está registrado
    if (users.some((u: any) => u.email === email)) {
      return false
    }

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // En una app real, esto debería estar hasheado
    }

    // Guardar en localStorage
    const updatedUsers = [...users, newUser]
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Crear objeto de usuario sin la contraseña para el estado
    const registeredUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    // Guardar en localStorage y estado
    localStorage.setItem("currentUser", JSON.stringify(registeredUser))
    setUser(registeredUser)

    return true
  }

  const logout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
