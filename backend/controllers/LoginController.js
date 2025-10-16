import bcrypt from 'bcryptjs';
import db from '../database.js'; 
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { nombre, apellido, email, contraseña, telefono } = req.body;

    try {
        // Validación básica
        if (!nombre || !apellido || !email || !contraseña || !telefono) 
            return res.status(400).json({ error: "Faltan datos obligatorios" });

        // Verificar si el usuario ya existe
        const [rows] = await db.query('SELECT id FROM usuarios_registrados WHERE email = ?', [email]);
        if (rows.length) return res.status(409).json({ error: "El usuario ya existe" });

        // Insertar usuario
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        await db.query(
            'INSERT INTO usuarios_registrados (nombre, apellido, email, contraseña, telefono) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, email, hashedPassword, telefono]
        );

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: "Error interno del servidor" });
  }
  
};


export const login = async (req, res) => {
    const { email, contraseña } = req.body;
    try {
        // Verificar si el usuario existe
        const [rows] = await db.query('SELECT * FROM usuarios_registrados WHERE email = ?', [email]);
        if (!rows.length) return res.status(401).json({ error: "Credenciales inválidas" });

     
        // Verificar la contraseña
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!passwordMatch) return res.status(401).json({ error: "Credenciales inválidas" });

        // Crear token
        const token = jwt.sign({ id: rows[0].id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
          res.cookie('access_token', token, {
            httpOnly: true,
            secure: true, // Cambia a 'true' si estás usando HTTPS en producción
            sameSite: 'None',  // Permite que la cookie se envíe en solicitudes cross-origin
            maxAge: 60 * 60 * 1000 // 1 hora
        });

        // Devolver información del usuario (sin contraseña)
        const userInfo = {
            id: user.id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono
        };

        res.status(200).json({ 
            message: 'Login exitoso',
            user: userInfo
        }); 
    } catch (error) {
        console.error("Error al hacer login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}



export const verificarToken = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del header

    if (!token) {
        return res.status(401).json({ authenticated: false, message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true, user: decoded });
    } catch (error) {
        res.status(403).json({ authenticated: false, message: 'Token invalid or expired' });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
      const token = req.cookies.access_token;
      if (!token) return res.status(401).json({ authenticated: false });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({
        authenticated: true,
        user: { id: decoded.id, email: decoded.email }
      });
    } catch (error) {
      res.status(401).json({ authenticated: false });
    }
  };


  export const logout = (req, res) => {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true, // true en producción con HTTPS
      sameSite: 'None',
    });
    res.status(200).json({ message: 'Sesión cerrada' });
  };
  


export default {
    login,
    register,
    verificarToken,
    logout,
    getCurrentUser
};
 