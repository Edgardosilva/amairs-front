-- Agregar columna 'rol' a la tabla usuarios_registrados
-- Valores posibles: 'usuario' (default) o 'admin'

ALTER TABLE usuarios_registrados 
ADD COLUMN rol ENUM('usuario', 'admin') DEFAULT 'usuario' AFTER email;

-- Actualizar un usuario existente como admin (cambia el email por el tuyo)
-- UPDATE usuarios_registrados SET rol = 'admin' WHERE email = 'tu-email@example.com';
