import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { medicalPackages, getSpecialtyById } from "@/lib/data"

export default function MedicalPackages() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Paquetes Médicos</h1>
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        Elija entre nuestra amplia gama de paquetes médicos diseñados para brindarle los mejores servicios de atención
        médica.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicalPackages.map((pkg) => {
          const specialty = getSpecialtyById(pkg.specialtyId)

          return (
            <Card key={pkg.id} className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image src={pkg.image || "/placeholder.svg"} alt={pkg.title} fill style={{ objectFit: "cover" }} />
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{pkg.title}</CardTitle>
                <div className="text-sm text-blue-600">{specialty?.name}</div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{pkg.description}</p>
                {pkg.price && <p className="mt-4 text-lg font-semibold">${pkg.price.toFixed(2)}</p>}
              </CardContent>
              <CardFooter>
                <Link href={`/book-appointment?package=${pkg.id}`} className="w-full">
                  <Button className="w-full">Reservar este Paquete</Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
