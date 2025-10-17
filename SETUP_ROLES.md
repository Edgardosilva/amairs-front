# Instrucciones para configurar el sistema de roles

## 1. Ejecutar migración en Railway (Base de datos)

Conéctate a tu base de datos MySQL en Railway y ejecuta:

```sql
-- Agregar columna 'rol' si no existe
ALTER TABLE usuarios_registrados 
ADD COLUMN IF NOT EXISTS rol ENUM('usuario', 'admin') DEFAULT 'usuario' AFTER email;

-- Convertir tu usuario en admin (reemplaza con tu email)
UPDATE usuarios_registrados 
SET rol = 'admin' 
WHERE email = 'TU_EMAIL_AQUI@gmail.com';

-- Verificar el cambio
SELECT id, nombre, email, rol FROM usuarios_registrados;
```

## 2. Cómo conectarte a la base de datos en Railway

### Opción A: Desde Railway Dashboard
1. Ve a tu proyecto en Railway
2. Click en el servicio de MySQL
3. Tab "Data"
4. Ejecuta el SQL directamente ahí

### Opción B: Desde tu terminal local
```bash
mysql -h switchyard.proxy.rlwy.net -P 28408 -u root -p railway
# Cuando pida password, usa: bUdIXBgDnusVljRwOomUSfBAQOTyHzZK
```

## 3. Probar el sistema de roles

### Como Usuario Normal:
- Login → Redirige a `/dashboard`
- Ver solo sus propias citas
- No puede acceder a `/admin`

### Como Admin:
- Login → Puede ir a `/admin`
- Ver TODAS las citas del sistema
- Dashboard con estadísticas
- Gestión completa

## 4. URLs importantes

- **Panel Usuario**: https://tu-app.railway.app/dashboard
- **Panel Admin**: https://tu-app.railway.app/admin
- **Login**: https://tu-app.railway.app/login

## 5. Características implementadas

✅ Campo `rol` en base de datos
✅ JWT incluye el rol del usuario
✅ Middleware de verificación de admin
✅ Rutas protegidas por rol
✅ Store de autenticación con Zustand
✅ Panel de admin con estadísticas
✅ Redirección automática según rol
✅ Dashboard separado por tipo de usuario

## 6. Próximos pasos opcionales

- [ ] Agregar calendario visual en admin
- [ ] Filtros por fecha/estado/procedimiento
- [ ] Exportar reportes
- [ ] Editar/cancelar citas desde admin
- [ ] Notificaciones para admin
