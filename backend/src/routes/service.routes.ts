import express from "express";
import {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

// ============================================
// ROUTES PUBLIQUES
// ============================================

// Obtenir tous les services actifs
// GET /api/services
router.get("/", getAllServices);

// Obtenir un service par son slug
// GET /api/services/:slug
router.get("/:slug", getServiceBySlug);

// ============================================
// ROUTES ADMIN (À protéger avec middleware auth)
// ============================================

// Créer un nouveau service
// POST /api/services
router.post("/", createService);

// Modifier un service
// PUT /api/services/:slug
router.put("/:slug", updateService);

// Supprimer un service
// DELETE /api/services/:slug
router.delete("/:slug", deleteService);

export default router;
