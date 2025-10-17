import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: 'No estás autenticado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos de administrador' });
    }

    req.user = decoded;
    next();
  } catch (error) {
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
