export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} City General Hospital. All rights reserved.</p>
          <p className="mt-2">123 Medical Drive, Healthcare City, HC 12345</p>
          <p className="mt-1">Emergency: (555) 123-4567 | Appointments: (555) 765-4321</p>
        </div>
      </div>
    </footer>
  )
}
