import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';

// Étendre l'interface Request pour inclure admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    // Récupérer le token depuis le header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Token manquant'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // Vérifier que l'admin existe et est actif
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.active) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé - Admin introuvable ou inactif'
      });
    }

    // Ajouter les infos admin à la requête
    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    console.error('Erreur auth middleware:', error);
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    });
  }
};

// Middleware pour vérifier le rôle super-admin
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.admin?.role !== 'super-admin') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - Super-admin requis'
    });
  }
  next();
};