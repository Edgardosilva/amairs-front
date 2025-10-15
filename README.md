# Amaris - Monorepo

Sistema completo de gestión de citas para Amaris.

## 📁 Estructura del Proyecto

```
amaris-landing/
├── frontend/      # Next.js 15 - Landing page y sistema de reservas
├── backend/       # Node.js/Express - API REST
└── README.md
```

## 🚀 Despliegue en Railway

### Frontend (Next.js)
- Root Directory: `/frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Puerto: 3000

### Backend (Node.js/Express)
- Root Directory: `/backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Puerto: 5000 (o el que uses)

## 💻 Desarrollo Local

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 📦 Variables de Entorno

### Frontend
- (Agregar las que uses)

### Backend
- `DATABASE_URL`
- `JWT_SECRET`
- `EMAIL_HOST`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- (Agregar las que uses)

## 🔗 URLs

- Frontend: https://amairsweb.vercel.app
- Backend API: https://amaris-api-production.up.railway.app
