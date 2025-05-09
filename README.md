# Hospital Ciudad General - Sistema de Citas

Este proyecto es una aplicación web para la gestión de citas médicas del Hospital Ciudad General. Permite a los pacientes registrarse, iniciar sesión, reservar citas con diferentes especialistas, ver sus citas programadas y explorar paquetes médicos.

## Características

- **Autenticación de usuarios**: Registro e inicio de sesión de pacientes
- **Reserva de citas**: Selección de especialidad, médico, fecha y hora
- **Gestión de citas**: Visualización y cancelación de citas programadas
- **Paquetes médicos**: Exploración de diferentes paquetes de servicios médicos
- **Diseño responsivo**: Interfaz adaptada a dispositivos móviles y de escritorio

## Tecnologías utilizadas

- **Next.js**: Framework de React para el desarrollo de aplicaciones web
- **React**: Biblioteca JavaScript para construir interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado estático
- **Tailwind CSS**: Framework CSS para diseño rápido y responsivo
- **Shadcn/UI**: Componentes de UI reutilizables
- **LocalStorage**: Para almacenamiento de datos en el navegador

## Instalación

1. Clona este repositorio:
   \`\`\`bash
   git clone https://github.com/tu-usuario/hospital-citas-app.git
   cd hospital-citas-app
   \`\`\`

2. Instala las dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Inicia el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del proyecto

\`\`\`
hospital-citas-app/
├── app/                    # Rutas y páginas de la aplicación
│   ├── book-appointment/   # Página de reserva de citas
│   ├── login/              # Página de inicio de sesión
│   ├── medical-packages/   # Página de paquetes médicos
│   ├── my-appointments/    # Página de citas del usuario
│   ├── register/           # Página de registro
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio
├── components/             # Componentes reutilizables
├── contexts/               # Contextos de React
├── lib/                    # Utilidades y datos
├── public/                 # Archivos estáticos
└── ...
\`\`\`

## Uso

1. Regístrate como nuevo usuario o inicia sesión
2. Explora las diferentes especialidades y paquetes médicos
3. Reserva una cita seleccionando especialidad, médico, fecha y hora
4. Gestiona tus citas desde la sección "Mis Citas"

## Desarrollo

Este proyecto utiliza:

- **TypeScript** para tipado estático
- **ESLint** para linting
- **Prettier** para formateo de código
- **Tailwind CSS** para estilos

## Despliegue

La aplicación puede ser desplegada en Vercel con un simple comando:

\`\`\`bash
npm run build
\`\`\`

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
\`\`\`

```gitignore file=".gitignore"
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
