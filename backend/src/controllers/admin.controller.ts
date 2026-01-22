import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model.js';
import Booking from '../models/Booking.model.js';
import Service from '../models/Service.model.js';
import ContactMessage from '../models/ContactMessage.model.js';

// Générer un token JWT
const generateToken = (id: string, email: string, role: string) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

// Connexion admin
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Vérifier l'admin
    const admin = await Admin.findOne({ email, active: true });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await admin.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    // Générer le token
    const token = generateToken(admin._id.toString(), admin.email, admin.role);

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir le profil de l'admin connecté
export const getMe = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.admin?.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin introuvable'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      }
    });

  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Créer un nouvel admin (super-admin seulement)
export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis',
        required: ['email', 'password', 'name']
      });
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({ email });
    
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Un admin avec cet email existe déjà'
      });
    }

    // Créer l'admin
    const admin = await Admin.create({
      email,
      password,
      name,
      role: role || 'admin',
      active: true,
    });

    res.status(201).json({
      success: true,
      message: 'Admin créé avec succès',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      }
    });

  } catch (error) {
    console.error('Erreur createAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir tous les admins (super-admin seulement)
export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: admins.length,
      admins: admins.map(admin => ({
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        active: admin.active,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
      }))
    });

  } catch (error) {
    console.error('Erreur getAllAdmins:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Modifier un admin (super-admin seulement)
export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, active } = req.body;

    const admin = await Admin.findById(id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin introuvable'
      });
    }

    // Mise à jour des champs
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (active !== undefined) admin.active = active;

    await admin.save();

    res.json({
      success: true,
      message: 'Admin mis à jour avec succès',
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        active: admin.active,
      }
    });

  } catch (error) {
    console.error('Erreur updateAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Changer le mot de passe
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau requis'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
    }

    const admin = await Admin.findById(req.admin?.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin introuvable'
      });
    }

    // Vérifier le mot de passe actuel
    const isMatch = await admin.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    // Changer le mot de passe
    admin.password = newPassword;
    await admin.save();

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });

  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Supprimer un admin (super-admin seulement)
export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression de soi-même
    if (id === req.admin?.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const admin = await Admin.findByIdAndDelete(id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin introuvable'
      });
    }

    res.json({
      success: true,
      message: 'Admin supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur deleteAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

export const getAllBookingsAdmin = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      date, 
      serviceSlug,
      page = 1, 
      limit = 100 
    } = req.query;

    // Construction du filtre
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (serviceSlug) {
      filter.serviceSlug = serviceSlug;
    }

    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.startTime = { 
        $gte: startOfDay, 
        $lte: endOfDay 
      };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(filter)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    // Enrichir avec le prix du service
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const service = await Service.findOne({ slug: booking.serviceSlug });
        return {
          _id: booking._id,
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          phone: booking.phone,
          serviceName: booking.serviceName,
          servicePrice: service?.price || 0,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          notes: booking.notes,
          createdAt: booking.createdAt,
          paymentProof: booking.paymentProof,
          paymentAmountReceived: booking.paymentAmountReceived,
        };
      })
    );

    res.json({
      success: true,
      bookings: enrichedBookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (err) {
    console.error('Erreur getAllBookingsAdmin:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Obtenir une réservation par ID (admin)
export const getBookingByIdAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Réservation introuvable' 
      });
    }

    const service = await Service.findOne({ slug: booking.serviceSlug });

    res.json({ 
      success: true, 
      booking: {
        _id: booking._id,
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone,
        serviceName: booking.serviceName,
        serviceSlug: booking.serviceSlug,
        servicePrice: service?.price || 0,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt,
      }
    });

  } catch (err) {
    console.error('Erreur getBookingByIdAdmin:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// Mettre à jour le statut d'une réservation (admin)
export const updateBookingStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const validStatuses = ["pending", "payment_proof_submitted", "validated", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Statut invalide",
        validStatuses 
      });
    }

    const updateData: any = { status };

    // Optionnel : conserver la raison du rejet
    if (status === "cancelled" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
      updateData.cancelledAt = new Date();
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Réservation introuvable" });
    }

    // On peut éventuellement envoyer un email ici plus tard...

    res.json({ 
      success: true, 
      message: `Statut mis à jour : ${status}`,
      booking 
    });

  } catch (err) {
    console.error('updateBookingStatusAdmin:', err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// Supprimer une réservation (admin)
export const deleteBookingAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Réservation introuvable' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Réservation supprimée avec succès' 
    });

  } catch (err) {
    console.error('Erreur deleteBookingAdmin:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};
export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ContactMessage.countDocuments(filter);

    res.json({
      success: true,
      messages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// 3. Marquer message contact comme lu
export const markContactAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!message) return res.status(404).json({ success: false, message: "Message introuvable" });

    res.json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const createReplacementBooking = async (req: Request, res: Response) => {
  try {
    const {
      originalBookingId,     // pour lier ou logger
      serviceSlug,
      startTime,             // ISO string
      firstName, lastName, email, phone, notes,
    } = req.body;

    const service = await Service.findOne({ slug: serviceSlug, active: true });
    if (!service) return res.status(404).json({ success: false, message: "Service introuvable" });

    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.duration * 60000);

    // Vérification conflit (même logique que createBooking)
    const conflict = await Booking.findOne({
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $in: ["pending", "validated", "payment_proof_submitted"] },
    });

    if (conflict) {
      return res.status(409).json({ success: false, message: "Créneau non disponible" });
    }

    const newBooking = await Booking.create({
      serviceSlug: service.slug,
      serviceName: service.name,
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      phone,
      notes: notes ? `${notes}\n(Remplacement suite annulation ${originalBookingId})` : `Remplacement suite annulation ${originalBookingId}`,
      startTime: start,
      endTime: end,
      status: "validated",           // directement validée car admin
      // paymentProof: null,         // pas de nouvel acompte pour l'instant
    });

    // TODO : envoyer email au client ici (ou via queue)
    // Exemple pseudo-code :
    // await sendEmail({
    //   to: email,
    //   subject: "Votre nouveau rendez-vous – Dalee Lashes",
    //   html: emailTemplate(newBooking, service),
    // });

    res.status(201).json({
      success: true,
      message: "Nouveau rendez-vous créé avec succès",
      booking: newBooking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};