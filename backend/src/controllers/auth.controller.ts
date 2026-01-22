import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ton-secret-super-securise-ici'; // Mets une vraie clé longue dans .env !

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Recherche par email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    // Vérification du mot de passe
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name || 'Admin',
      },
    });
  } catch (err) {
    console.error('Erreur login admin:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};