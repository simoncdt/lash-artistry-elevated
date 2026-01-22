import express from "express";
import { getAvailability } from "../controllers/availability.controller.js";

const router = express.Router();

// Obtenir les créneaux disponibles
router.get("/", getAvailability);

export default router;