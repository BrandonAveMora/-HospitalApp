import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
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
          <span className="font-bold text-xl">City General Hospital</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">
            Home
          </Link>
          <Link href="/book-appointment" className="text-gray-700 hover:text-blue-500 transition-colors">
            Book Appointment
          </Link>
          <Link href="/my-appointments" className="text-gray-700 hover:text-blue-500 transition-colors">
            My Appointments
          </Link>
          <Link href="/medical-packages" className="text-gray-700 hover:text-blue-500 transition-colors">
            Medical Packages
          </Link>
        </nav>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">
                Home
              </Link>
              <Link href="/book-appointment" className="text-gray-700 hover:text-blue-500 transition-colors">
                Book Appointment
              </Link>
              <Link href="/my-appointments" className="text-gray-700 hover:text-blue-500 transition-colors">
                My Appointments
              </Link>
              <Link href="/medical-packages" className="text-gray-700 hover:text-blue-500 transition-colors">
                Medical Packages
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
