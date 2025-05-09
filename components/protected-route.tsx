"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isRouteLoading, setIsRouteLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      setIsRouteLoading(false)
    }
  }, [user, isLoading, router])

  if (isRouteLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return <>{children}</>
}
