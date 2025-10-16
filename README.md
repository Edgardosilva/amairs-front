# Amaris - Centro de Kinesiología Estética

Sistema completo de gestión de citas para Amaris, desarrollado con Next.js 15 y Node.js/Express.

> 📖 **Para instrucciones detalladas de despliegue en Railway**, consulta [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)

## 📁 Estructura del Proyecto

```
amaris-landing/
├── frontend/              # Next.js 15.5.4 - App Router
│   ├── app/              # Rutas y páginas
│   │   ├── page.tsx                    # Página principal
│   │   ├── login/                      # Login
│   │   ├── register/                   # Registro
│   │   ├── servicios/                  # Catálogo de servicios
│   │   ├── dashboard/                  # Dashboard de usuario
│   │   ├── confirmar-cita/[token]/    # Confirmación de citas
│   │   └── agendar/                   # Flujo de reserva (4 pasos)
│   │       ├── paso-1/                # Datos personales
│   │       ├── paso-2/                # Selección de servicio
│   │       ├── paso-3/                # Fecha y hora
│   │       └── paso-4/                # Confirmación
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes shadcn/ui
│   │   ├── navigation.tsx
│   │   └── footer.tsx
│   ├── hooks/           # Custom hooks (Zustand store)
│   └── lib/             # Utilidades
│
├── backend/             # Node.js + Express + MySQL
│   ├── controllers/    # Lógica de negocio
│   ├── routes/         # Rutas de la API
│   ├── helpers/        # Servicios (email, validaciones)
│   └── database.js     # Configuración MySQL
│
└── README.md
```

## 🎨 Tecnologías

### Frontend
- **Framework**: Next.js 15.5.4 (App Router, Server Actions)
- **Styling**: Tailwind CSS v3.4 + shadcn/ui
- **State Management**: Zustand (con persist middleware)
- **Forms**: React Hook Form + Zod
- **UI Components**: Radix UI
- **Calendar**: react-day-picker + date-fns
- **Icons**: Lucide React
- **Notifications**: SweetAlert2, Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Railway)
- **Authentication**: JWT + HttpOnly Cookies
- **Email**: Nodemailer (Gmail)
- **Security**: bcryptjs, CORS

## 🎨 Colores de Marca
- **Primario**: `#52a2b2` (Azul Amaris)
- **Acento**: `#a6d230` (Verde)

## 💻 Desarrollo Local

### Requisitos Previos
- Node.js 18+ instalado
- MySQL disponible (local o remoto)
- Cuenta de Gmail con App Password para emails

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Edgardosilva/amairs-front.git
cd amaris-landing
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` con:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DB_HOST=your-db-host
DB_USER=root
DB_PASSWORD=your-db-password
DB_NAME=railway
DB_PORT=3306

# URLs para desarrollo local
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

Iniciar servidor:
```bash
npm run dev
```
Backend corriendo en: `http://localhost:3000`

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env.local` con:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Iniciar servidor:
```bash
npm run dev
```
Frontend corriendo en: `http://localhost:3001`

### 4. Iniciar Ambos Servicios (Opcional)

Desde la raíz del proyecto:
```bash
./dev.sh
```

## 🚀 Despliegue en Railway

### Opción 1: Dos Servicios Separados

#### Backend
1. Crear nuevo servicio en Railway
2. Conectar repositorio GitHub
3. Configurar:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Variables de Entorno**:
     ```
     PORT=3000
     JWT_SECRET=your-production-secret
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     DB_HOST=railway-db-host
     DB_USER=root
     DB_PASSWORD=railway-db-password
     DB_NAME=railway
     DB_PORT=3306
     API_URL=https://your-backend-url.railway.app
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

#### Frontend
1. Crear nuevo servicio en Railway (o Vercel)
2. Configurar:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Variables de Entorno**:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     ```

### Opción 2: Monorepo en Railway

Usar el archivo `railway.json` incluido en la raíz del proyecto.

## 📦 Estructura de la Base de Datos

### Tablas Principales
- `usuarios_registrados` - Usuarios del sistema
- `procedimientos_disponibles` - Catálogo de servicios
- `citas_agendadas` - Reservas y citas
- `horarios_disponibles` - Disponibilidad de horarios

## 🔐 Autenticación

El sistema usa JWT con HttpOnly cookies para seguridad:
1. Usuario se registra o hace login
2. Backend genera JWT y lo envía en header `Set-Cookie`
3. Frontend extrae el token y lo guarda
4. Las peticiones subsecuentes incluyen el token automáticamente

## � Sistema de Emails

- **Confirmación de Cita**: Email automático con link de confirmación
- **Procesamiento**: Asíncrono (no bloquea la respuesta del servidor)
- **Template**: HTML personalizado con colores de marca

## 🎯 Funcionalidades Principales

### Para Usuarios
- ✅ Registro e inicio de sesión
- ✅ Ver catálogo de servicios
- ✅ Agendar citas (flujo de 4 pasos)
- ✅ Confirmar citas por email
- ✅ Ver historial de citas en dashboard
- ✅ Responsive design (mobile-first)

### Sistema de Reservas
1. **Paso 1**: Ingreso de datos personales
2. **Paso 2**: Selección de servicio/procedimiento
3. **Paso 3**: Elección de fecha y hora disponible
4. **Paso 4**: Resumen y confirmación
5. **Email**: Confirmación automática con link
6. **Dashboard**: Visualización de citas agendadas

## 🔧 Scripts Disponibles

### Frontend
```bash
npm run dev          # Desarrollo (puerto 3001)
npm run build        # Build para producción
npm start           # Iniciar producción
npm run lint        # Linter
```

### Backend
```bash
npm run dev         # Desarrollo con nodemon (puerto 3000)
npm start          # Iniciar producción
```

## 📝 Notas Técnicas

### Estado Global (Zustand)
El estado se persiste en `localStorage` con la key `"amaris-form-storage"`:
- Datos del usuario autenticado
- Progreso del flujo de reserva
- Datos del formulario entre pasos

### Server Actions
Next.js 15 usa Server Actions para las peticiones al backend:
- `app/actions/auth.ts` - Login/Registro
- `app/actions/citas.ts` - Crear citas
- `app/actions/appointments.ts` - Obtener citas
- `app/actions/horarios.ts` - Disponibilidad

### Optimizaciones
- ✅ Emails asíncronos (no bloquean respuesta HTTP)
- ✅ Caché de Next.js configurado
- ✅ Componentes optimizados con React 19
- ✅ Imágenes optimizadas con Next/Image

## 🐛 Troubleshooting

### Frontend sin estilos
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Backend no conecta a DB
Verificar variables de entorno en `.env` y conexión a MySQL

### CORS Errors
Verificar que `FRONTEND_URL` en backend `.env` coincida con la URL del frontend

## 📄 Licencia

Proyecto privado - Amaris Centro de Kinesiología Estética

## 👥 Contacto

Para consultas sobre el proyecto: [contacto@amaris.cl](mailto:contacto@amaris.cl)
- `JWT_SECRET`
- `EMAIL_HOST`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- (Agregar las que uses)

## 🔗 URLs

- Frontend: https://amairsweb.vercel.app
- Backend API: https://amaris-api-production.up.railway.app
