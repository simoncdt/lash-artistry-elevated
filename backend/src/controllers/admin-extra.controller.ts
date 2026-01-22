import { Request, Response } from "express";
import BlockedAvailability from "../models/BlockedAvailability.model.js";
import Review from "../models/Review.model.js";
import mongoose from "mongoose";

// ─── Disponibilités bloquées ──────────────────────────────────────────

export const getBlockedAvailabilities = async (req: Request, res: Response) => {
  try {
    const blocked = await BlockedAvailability.find()
      .sort({ date: 1 })
      .populate("createdBy", "name email");

    res.json({
      success: true,
      blocked,
    });
  } catch (err: any) {
    console.error("getBlockedAvailabilities:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const deleteBlockedAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blocked = await BlockedAvailability.findByIdAndDelete(id);
    if (!blocked) {
      return res.status(404).json({ success: false, message: "Créneau introuvable" });
    }

    res.json({
      success: true,
      message: "Créneau supprimé",
    });
  } catch (err: any) {
    console.error("deleteBlockedAvailability:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

// (Optionnel – si tu veux permettre la création depuis le dashboard plus tard)
export const createBlockedAvailability = async (req: Request, res: Response) => {
  try {
    const { date, reason, allDay = true, startTime, endTime } = req.body;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date requise" });
    }

    const blockedDate = new Date(date);
    if (isNaN(blockedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Date invalide" });
    }

    // Vérification existence (déjà faite par protect, mais on est parano)
    if (!req.admin?.id) {
      return res.status(401).json({ success: false, message: "Non authentifié" });
    }

    const existing = await BlockedAvailability.findOne({
      date: blockedDate,
      allDay,
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Ce créneau est déjà bloqué" });
    }

    // Correction ici : on caste explicitement en ObjectId
    const blocked = await BlockedAvailability.create({
      date: blockedDate,
      reason,
      allDay,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      createdBy: new mongoose.Types.ObjectId(req.admin.id), // ← CAST ici
    });

    res.status(201).json({
      success: true,
      message: "Créneau bloqué",
      blocked,
    });
  } catch (err: any) {
    console.error("createBlockedAvailability:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
// ─── Avis / Reviews ───────────────────────────────────────────────────

export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      reviews,
    });
  } catch (err: any) {
    console.error("getAdminReviews:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const publishReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { status: "published" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Avis introuvable" });
    }

    res.json({
      success: true,
      message: "Avis publié",
      review,
    });
  } catch (err: any) {
    console.error("publishReview:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

export const rejectReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Avis introuvable" });
    }

    res.json({
      success: true,
      message: "Avis rejeté",
      review,
    });
  } catch (err: any) {
    console.error("rejectReview:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};