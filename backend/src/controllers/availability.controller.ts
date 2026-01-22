import { Request, Response } from "express";
import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";

const OPENING_MINUTES = 9 * 60;     // 9h = 540 minutes
const CLOSING_MINUTES = 21 * 60;    // 21h = 1260 minutes
const STEP_MINUTES = 30;            // Créneaux de 30min
const LUNCH_START = 12 * 60 + 30;   // 12h30 = 750 minutes
const LUNCH_END = 13 * 60;          // 13h00 = 780 minutes

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ 
        message: "Paramètres manquants",
        required: ["date", "serviceId"]
      });
    }

    // ✅ CORRECTION : Chercher par slug au lieu de _id
    const service = await Service.findOne({ 
      slug: serviceId as string,
      active: true 
    });

    if (!service) {
      return res.status(404).json({ 
        message: "Service introuvable",
        serviceId 
      });
    }

    // Récupérer les réservations existantes pour cette date
    const startOfDay = new Date(date as string);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date as string);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $ne: "cancelled" },
    });

    // Créer les plages occupées
    const bookedSlots = bookings.map((b) => ({
      start: b.startTime.getTime(),
      end: b.endTime.getTime(),
    }));

    const availableSlots: string[] = [];

    // Générer tous les créneaux possibles
    for (
      let time = OPENING_MINUTES;
      time + service.duration <= CLOSING_MINUTES;
      time += STEP_MINUTES
    ) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      // ✅ Vérifier si le créneau tombe pendant la pause déjeuner
      const slotEnd = time + service.duration;
      const isDuringLunch = 
        (time >= LUNCH_START && time < LUNCH_END) || 
        (slotEnd > LUNCH_START && slotEnd <= LUNCH_END) ||
        (time < LUNCH_START && slotEnd > LUNCH_END);

      if (isDuringLunch) {
        continue; // Ignorer ce créneau
      }

      // Créer un timestamp pour ce créneau
      const slotDate = new Date(date as string);
      slotDate.setHours(hours, minutes, 0, 0);
      const start = slotDate.getTime();
      const end = start + service.duration * 60000;

      // Vérifier les conflits avec les réservations existantes
      const hasConflict = bookedSlots.some(
        (slot) => start < slot.end && end > slot.start
      );

      if (!hasConflict) {
        availableSlots.push(timeString);
      }
    }

    res.json({ 
      slots: availableSlots,
      service: {
        slug: service.slug,
        name: service.name,
        duration: service.duration
      },
      date
    });

  } catch (error) {
    console.error("Erreur getAvailability:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    });
  }
};