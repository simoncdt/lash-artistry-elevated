import { Request, Response } from "express";
import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";

// ============================================
// Créer une réservation
// ============================================
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { 
      serviceId,    // On reçoit toujours "serviceId" du frontend (qui est en fait le slug)
      firstName, 
      lastName, 
      email, 
      phone, 
      startTime, 
      endTime,
      notes 
    } = req.body;

    // Validation des champs requis
    if (!serviceId || !firstName || !lastName || !email || !phone || !startTime || !endTime) {
      return res.status(400).json({ 
        success: false, 
        message: "Tous les champs requis sont manquants.",
        required: ["serviceId", "firstName", "lastName", "email", "phone", "startTime", "endTime"]
      });
    }

    // ✅ Vérifier que le service existe (par slug)
    const service = await Service.findOne({ 
      slug: serviceId,
      active: true 
    });

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: "Service introuvable ou inactif",
        serviceId 
      });
    }

    // Convertir les dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Validation des dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: "Format de date invalide" 
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ 
        success: false, 
        message: "La date de fin doit être après la date de début" 
      });
    }

    // Vérifier qu'il n'y a pas de conflit avec d'autres réservations
    const conflictingBooking = await Booking.findOne({
      startTime: { $lt: endDate },
      endTime: { $gt: startDate },
      status: { $in: ["pending", "confirmed"] }
    });

    if (conflictingBooking) {
      return res.status(409).json({ 
        success: false, 
        message: "Ce créneau n'est plus disponible",
        conflict: {
          startTime: conflictingBooking.startTime,
          endTime: conflictingBooking.endTime
        }
      });
    }

    // ✅ Créer la réservation avec le nouveau schéma
    const booking = await Booking.create({
      serviceSlug: service.slug,      // ← Utiliser serviceSlug
      serviceName: service.name,       // ← Ajouter le nom du service
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      notes: notes?.trim() || "",
      startTime: startDate,
      endTime: endDate,
      status: "pending",
    });

    res.status(201).json({ 
      success: true, 
      message: "Réservation créée avec succès",
      booking: {
        id: booking._id,
        service: {
          slug: booking.serviceSlug,
          name: booking.serviceName
        },
        customer: {
          firstName: booking.firstName,
          lastName: booking.lastName,
          email: booking.email,
          phone: booking.phone
        },
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status
      }
    });

  } catch (err) {
    console.error("Erreur createBooking:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur",
      error: err instanceof Error ? err.message : "Erreur inconnue"
    });
  }
};

// ============================================
// Obtenir toutes les réservations (pour admin)
// ============================================
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      date, 
      serviceSlug,
      page = 1, 
      limit = 20 
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

    res.json({
      success: true,
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (err) {
    console.error("Erreur getAllBookings:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// ============================================
// Obtenir une réservation par ID
// ============================================
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Réservation introuvable" 
      });
    }

    res.json({ 
      success: true, 
      booking 
    });

  } catch (err) {
    console.error("Erreur getBookingById:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// ============================================
// Mettre à jour le statut d'une réservation
// ============================================
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation du statut
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Statut invalide",
        validStatuses 
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Réservation introuvable" 
      });
    }

    res.json({ 
      success: true, 
      message: "Statut mis à jour avec succès",
      booking 
    });

  } catch (err) {
    console.error("Erreur updateBookingStatus:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// ============================================
// Annuler une réservation
// ============================================
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Réservation introuvable" 
      });
    }

    // Vérifier si la réservation peut être annulée (au moins 24h avant)
    const now = new Date();
    const hoursDiff = (booking.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24 && booking.status !== "cancelled") {
      return res.status(400).json({ 
        success: false, 
        message: "Impossible d'annuler une réservation moins de 24h avant" 
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ 
      success: true, 
      message: "Réservation annulée avec succès",
      booking 
    });

  } catch (err) {
    console.error("Erreur cancelBooking:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// ============================================
// Supprimer une réservation (admin)
// ============================================
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Réservation introuvable" 
      });
    }

    res.json({ 
      success: true, 
      message: "Réservation supprimée avec succès" 
    });

  } catch (err) {
    console.error("Erreur deleteBooking:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

export const submitBookingWithProof = async (req: Request, res: Response) => {
  try {
    const {
      serviceId,          // slug du service
      startTime,          // ISO UTC
      firstName,
      lastName,
      email,
      phone,
      notes,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Preuve de paiement requise" });
    }

    // Vérifier le service existe
    const service = await Service.findOne({ slug: serviceId, active: true });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service introuvable" });
    }

    // Calcul dates + prix
    const start = new Date(startTime);
    const durationMin = service.duration || 150;
    const end = new Date(start.getTime() + durationMin * 60 * 1000);
    const price = service.price || 60;
    const deposit = 25;

    // Créer la réservation
    const booking = await Booking.create({
      serviceSlug: service.slug,
      serviceName: service.name,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      notes: notes?.trim() || "",
      startTime: start,
      endTime: end,
      status: "payment_proof_submitted",
      paymentProof: `/uploads/proofs/${req.file.filename}`,
      paymentAmountReceived: deposit,
    });

    res.status(201).json({
      success: true,
      message: "Réservation créée et acompte reçu. Validation en cours.",
      bookingId: booking._id,
      depositAmount: deposit,
    });
  } catch (err: any) {
    console.error("Erreur submitBookingWithProof:", err);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la réservation",
      error: err.message,
    });
  }
};