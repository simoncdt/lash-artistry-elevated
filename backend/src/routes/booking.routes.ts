import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

import { uploadProof } from '../middlewares/upload.middleware.js';
import { submitBookingWithProof } from '../controllers/booking.controller.js';
const router = express.Router();

// ============================================
// ROUTES PUBLIQUES (Frontend)
// ============================================

// Créer une nouvelle réservation
// POST /api/bookings
router.post("/", createBooking);
router.post('/submit-with-proof', uploadProof.single('proof'), submitBookingWithProof);

// Annuler une réservation
// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", cancelBooking);

// ============================================
// ROUTES ADMIN (À protéger avec middleware auth)
// ============================================

// Obtenir toutes les réservations (avec filtres et pagination)
// GET /api/bookings?status=pending&date=2024-01-15&page=1&limit=20
router.get("/", getAllBookings);

// Obtenir une réservation spécifique
// GET /api/bookings/:id
router.get("/:id", getBookingById);

// Mettre à jour le statut d'une réservation
// PATCH /api/bookings/:id/status
router.patch("/:id/status", updateBookingStatus);

// Supprimer une réservation (admin seulement)
// DELETE /api/bookings/:id
router.delete("/:id", deleteBooking);

export default router;