import GitHubLink from "./github-link"

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Hospital Ciudad General. Todos los derechos reservados.</p>
            <p className="mt-2">123 Avenida Médica, Ciudad Sanitaria, CS 12345</p>
            <p className="mt-1">Emergencias: (555) 123-4567 | Citas: (555) 765-4321</p>
          </div>
          <GitHubLink />
        </div>
      </div>
    </footer>
  )
}
