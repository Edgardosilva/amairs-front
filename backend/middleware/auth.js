import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  try {
    console.log('🔐 Verificando admin...');
    console.log('📦 Cookies recibidas:', req.cookies);
    console.log('📋 Headers:', req.headers.cookie);
    
    const token = req.cookies.access_token;

    if (!token) {
      console.log('❌ No hay token en cookies');
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded);
    
    if (decoded.rol !== 'admin') {
      console.log('❌ Usuario no es admin, rol:', decoded.rol);
      return res.status(403).json({ error: 'No tienes permisos de administrador' });
    }

    console.log('✅ Usuario admin verificado');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Error verificando token:', error.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
