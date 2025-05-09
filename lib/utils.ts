import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Local storage helpers
export function saveAppointments(appointments: any[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("appointments", JSON.stringify(appointments))
  }
}

export function getAppointments(): any[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("appointments")
    return saved ? JSON.parse(saved) : []
  }
  return []
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Format date for display
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
