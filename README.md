# DoumusAI Frontend

## Descripción
Frontend de la aplicación DoumusAI, una plataforma moderna construida con React y TypeScript que ofrece una interfaz de usuario intuitiva y responsiva.

## Tecnologías Utilizadas

### Frameworks y Librerías Principales
- React 19.1.0
- TypeScript 5.8.3
- Vite 6.3.5
- React Router DOM 7.6.2
- TailwindCSS 4.1.8

### Estado y Gestión de Datos
- Zustand 5.0.5 (Gestión de estado)
- React Query 5.80.6 (Manejo de datos del servidor)
- Supabase 2.50.0 (Backend as a Service)

### UI/UX
- Radix UI (Componentes accesibles)
  - Dialog
  - Checkbox
  - Label
  - Select
  - Slot
- Lucide React (Iconos)
- Tailwind Merge
- Class Variance Authority

### Formularios y Validación
- React Hook Form 7.57.0
- Zod 3.25.61
- Hookform Resolvers

### Herramientas de Desarrollo
- ESLint
- TypeScript
- PostCSS
- Autoprefixer

## Requisitos Previos
- Node.js (versión recomendada: 18.x o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd frontend
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:5173`

## Construcción

Para crear una versión de producción:
```bash
npm run build
# o
yarn build
```

## Estructura del Proyecto
```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas de la aplicación
│   ├── hooks/         # Custom hooks
│   ├── store/         # Estado global (Zustand)
│   ├── types/         # Definiciones de TypeScript
│   ├── utils/         # Utilidades y helpers
│   └── App.tsx        # Componente principal
├── public/            # Archivos estáticos
└── ...
```

## Características Principales
- Interfaz de usuario moderna y responsiva
- Gestión de estado eficiente con Zustand
- Validación de formularios robusta
- Integración con Supabase para backend
- Componentes accesibles con Radix UI
- Visualización de datos con Recharts

## Herramientas de IA Utilizadas en el Desarrollo
- Cursor: Para asistencia en el desarrollo y generación de código
- ChatGPT: Para resolución de problemas y optimización de código
- Gemini: Para análisis de código y sugerencias de mejora

