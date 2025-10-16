# Guía de Despliegue en Railway

## Arquitectura del Proyecto

Este proyecto es un monorepo con dos servicios independientes que deben desplegarse por separado en Railway:

1. **Backend** (`/backend`) - API REST con Express.js
2. **Frontend** (`/frontend`) - Aplicación Next.js

## Pre-requisitos

- Cuenta en Railway (https://railway.app)
- Base de datos MySQL ya desplegada en Railway
- Repositorio en GitHub con el código

## Pasos para Desplegar

### 1. Crear Proyecto en Railway

1. Ve a https://railway.app/dashboard
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu cuenta de GitHub si no lo has hecho
5. Selecciona el repositorio `amairs-front`

### 2. Desplegar el Backend

1. Railway detectará el monorepo automáticamente
2. Click en "Add Service" → "GitHub Repo"
3. Selecciona el mismo repositorio
4. En la configuración del servicio:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

#### Variables de Entorno del Backend

Ve a la pestaña "Variables" del servicio backend y agrega:

```env
# Base de datos (obtén estos valores de tu servicio MySQL en Railway)
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=tu-password-mysql
DB_NAME=amaris_db
DB_PORT=3306

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-jwt-secret-super-seguro-aqui

# Email (configuración de Gmail)
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-gmail

# URLs (actualiza después del despliegue)
API_URL=${{RAILWAY_PUBLIC_DOMAIN}}
FRONTEND_URL=https://tu-frontend.railway.app

# Puerto (Railway lo asigna automáticamente)
PORT=${{PORT}}
```

**Importante sobre las URLs:**
- `API_URL`: Railway proporciona la variable `${{RAILWAY_PUBLIC_DOMAIN}}` que se resuelve automáticamente
- `FRONTEND_URL`: La actualizarás después de desplegar el frontend
- `PORT`: Railway asigna el puerto automáticamente, usa `${{PORT}}`

### 3. Desplegar el Frontend

1. Click en "Add Service" nuevamente
2. Selecciona el mismo repositorio
3. En la configuración del servicio:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

#### Variables de Entorno del Frontend

Ve a la pestaña "Variables" del servicio frontend y agrega:

```env
NEXT_PUBLIC_API_URL=https://tu-backend-url.railway.app
```

**Importante:**
- Obtén la URL del backend desde su servicio en Railway (en Settings → Domains)
- Debe ser la URL pública que Railway asigna (ej: `https://backend-production-xxxx.up.railway.app`)

### 4. Actualizar Variables de Entorno

Una vez que ambos servicios estén desplegados:

1. **Backend**: Actualiza la variable `FRONTEND_URL` con la URL pública del frontend
2. **Frontend**: Verifica que `NEXT_PUBLIC_API_URL` apunte a la URL correcta del backend
3. Redeploy ambos servicios si es necesario (Railway lo hace automáticamente al cambiar variables)

### 5. Configurar Dominios (Opcional)

Railway proporciona dominios gratuitos, pero puedes configurar dominios personalizados:

1. Ve a Settings → Domains en cada servicio
2. Click en "Generate Domain" para obtener un dominio `.railway.app`
3. O configura tu dominio personalizado

### 6. Conectar la Base de Datos

Si tu base de datos MySQL ya está en Railway:

1. Ve al servicio de la base de datos
2. En la pestaña "Connect", copia las credenciales
3. Úsalas en las variables de entorno del backend:
   - `DB_HOST`: El host proporcionado por Railway
   - `DB_USER`: Usualmente `root`
   - `DB_PASSWORD`: La contraseña generada
   - `DB_NAME`: `amaris_db` (o el nombre de tu base de datos)
   - `DB_PORT`: Usualmente `3306`

## Verificación del Despliegue

### Backend

1. Visita `https://tu-backend.railway.app` en el navegador
2. Deberías ver un mensaje de error 404 (normal, no hay ruta en `/`)
3. Prueba `https://tu-backend.railway.app/api/procedimientos` - debería devolver JSON

### Frontend

1. Visita `https://tu-frontend.railway.app`
2. Deberías ver la página principal de Amaris
3. Prueba el login y el registro
4. Verifica que puedas agendar citas

## Troubleshooting

### Error: "Cannot connect to database"

- Verifica que las credenciales de la base de datos sean correctas
- Asegúrate de que el servicio de MySQL esté en el mismo proyecto de Railway
- Railway permite conexiones internas entre servicios del mismo proyecto

### Error: "CORS policy"

- Verifica que `FRONTEND_URL` en el backend apunte a la URL correcta del frontend
- El backend ya tiene CORS configurado dinámicamente usando `FRONTEND_URL`

### Error: "Network request failed" en el frontend

- Verifica que `NEXT_PUBLIC_API_URL` apunte a la URL correcta del backend
- Asegúrate de que el backend esté corriendo y accesible

### El backend se reinicia constantemente

- Revisa los logs en Railway (pestaña "Logs" del servicio)
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que `PORT=${{PORT}}` esté configurado

### Los emails no se envían

- Verifica que `EMAIL_USER` y `EMAIL_PASS` sean correctos
- Si usas Gmail, necesitas una "Contraseña de aplicación" (no tu contraseña normal)
- Ve a https://myaccount.google.com/apppasswords para generar una

## Comandos Útiles

### Ver logs en tiempo real

En Railway, ve a la pestaña "Logs" de cada servicio.

### Redeploy manual

1. Ve al servicio en Railway
2. Click en el menú (tres puntos)
3. "Redeploy"

### Rollback a versión anterior

1. Ve a "Deployments" en el servicio
2. Encuentra el deployment anterior que funcionaba
3. Click en "Redeploy"

## Estructura de URLs Final

Ejemplo de configuración final:

- **Frontend**: `https://amaris.railway.app`
- **Backend**: `https://amaris-api.railway.app`
- **Base de datos**: Acceso interno a través de Railway

### Variables de entorno Backend:

```env
API_URL=https://amaris-api.railway.app
FRONTEND_URL=https://amaris.railway.app
```

### Variables de entorno Frontend:

```env
NEXT_PUBLIC_API_URL=https://amaris-api.railway.app
```

## Notas Importantes

1. **Dominios generados**: Railway genera dominios automáticamente, pueden tardar unos minutos en propagarse
2. **Build time**: El primer deploy puede tardar 5-10 minutos
3. **Auto-deploy**: Por defecto, Railway redeploy automáticamente cuando haces push a `main`
4. **Logs persistentes**: Railway mantiene logs históricos para debugging
5. **Monitoreo**: Railway proporciona métricas de uso (CPU, RAM, Network)

## Costos

Railway ofrece:
- **Plan Hobby**: $5/mes + $5 de crédito incluido
- **Uso adicional**: Se cobra por recursos consumidos (CPU, RAM, Network)
- **Base de datos**: Consumo incluido en el plan

Para este proyecto, el costo típico es de $5-15/mes dependiendo del tráfico.

## Soporte

Si tienes problemas:
1. Revisa los logs en Railway
2. Consulta la documentación oficial: https://docs.railway.app
3. Discord de Railway: https://discord.gg/railway
