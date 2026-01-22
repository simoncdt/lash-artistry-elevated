import express from 'express';
import {
  login,
  getMe,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  changePassword,
  deleteAdmin,
  getAllContactMessages,
  markContactAsRead,
} from '../controllers/admin.controller.js';
import {
  getAllBookingsAdmin,
  getBookingByIdAdmin,
  updateBookingStatusAdmin,
  deleteBookingAdmin,
} from '../controllers/admin.controller.js';
import { protect, requireSuperAdmin } from '../middlewares/auth.middleware.js';
import { getBlockedAvailabilities, deleteBlockedAvailability, getAdminReviews, publishReview, rejectReview } from '../controllers/admin-extra.controller.js';

const router = express.Router();

// ============================================
// ROUTES PUBLIQUES
// ============================================
router.post('/login', login);

// ============================================
// ROUTES PROTÉGÉES (admin authentifié)
// ============================================
router.get('/me', protect, getMe);
router.patch('/change-password', protect, changePassword);
router.put('/bookings/:id/status', protect, updateBookingStatusAdmin);

// Messages contact
router.get('/contacts', protect, getAllContactMessages);
router.patch('/contacts/:id/read', protect, markContactAsRead);
// Routes bookings pour admin
router.get('/bookings', protect, getAllBookingsAdmin);
router.get('/bookings/:id', protect, getBookingByIdAdmin);
router.put('/bookings/:id/status', protect, updateBookingStatusAdmin);
router.delete('/bookings/:id', protect, deleteBookingAdmin);

// ============================================
// ROUTES SUPER-ADMIN UNIQUEMENT
// ============================================
router.post('/', protect, requireSuperAdmin, createAdmin);
router.get('/', protect, requireSuperAdmin, getAllAdmins);
router.patch('/:id', protect, requireSuperAdmin, updateAdmin);
router.delete('/:id', protect, requireSuperAdmin, deleteAdmin);

router.get('/availability/blocked', protect, getBlockedAvailabilities);
router.delete('/availability/blocked/:id', protect, deleteBlockedAvailability);
// router.post('/availability/blocked', protect, createBlockedAvailability); // décommente si tu veux la création

// Avis admin
router.get('/reviews', protect, getAdminReviews);
router.patch('/reviews/:id/publish', protect, publishReview);
router.patch('/reviews/:id/reject', protect, rejectReview);

export default router;
