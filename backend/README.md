# Backend - Amaris API

API REST para el sistema de gestión de citas de Amaris.

## 🚀 Tecnologías

- Node.js + Express
- MySQL
- JWT para autenticación
- Nodemailer para envío de correos

## 📦 Instalación

```bash
npm install
```

## 🔧 Variables de Entorno

Crea un archivo `.env`:

```env
PORT=5000
JWT_SECRET=tu_secret_key_aqui
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=tu_password
DATABASE_NAME=amaris_db

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_o_app_password
```

## ▶️ Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📍 Endpoints Principales

### Autenticación
- `POST /login` - Iniciar sesión
- `POST /login/register` - Registrar usuario
- `GET /login/auth/me` - Verificar sesión

### Citas
- `GET /appointments` - Obtener todas las citas
- `POST /appointments` - Crear cita
- `GET /appointments/getUserAppointments` - Citas del usuario
- `GET /appointments/available` - Horarios disponibles
- `GET /appointments/confirmar-cita/:token/detalles` - Confirmar cita

### Procedimientos
- `GET /procedures` - Obtener procedimientos disponibles
