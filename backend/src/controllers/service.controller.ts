import { Request, Response } from "express";
import Service from "../models/Service.model.js";

// Obtenir tous les services actifs
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { includeInactive } = req.query;
    
    const filter = includeInactive === "true" ? {} : { active: true };
    
    const services = await Service.find(filter).sort({ createdAt: 1 });

    res.json({
      success: true,
      services: services.map(s => ({
        slug: s.slug,
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration,
        active: s.active
      }))
    });

  } catch (err) {
    console.error("Erreur getAllServices:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Obtenir un service par slug
export const getServiceBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const service = await Service.findOne({ slug: slug as string });

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: "Service introuvable" 
      });
    }

    res.json({
      success: true,
      service: {
        slug: service.slug,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        active: service.active
      }
    });

  } catch (err) {
    console.error("Erreur getServiceBySlug:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Créer un nouveau service (ADMIN)
export const createService = async (req: Request, res: Response) => {
  try {
    const { slug, name, description, price, duration, active } = req.body;

    // Validation
    if (!slug || !name || !price || !duration) {
      return res.status(400).json({ 
        success: false, 
        message: "Champs requis manquants",
        required: ["slug", "name", "price", "duration"]
      });
    }

    // Vérifier si le slug existe déjà
    const existingService = await Service.findOne({ slug: slug as string });
    if (existingService) {
      return res.status(409).json({ 
        success: false, 
        message: "Un service avec ce slug existe déjà" 
      });
    }

    const service = await Service.create({
      slug,
      name,
      description,
      price,
      duration,
      active: active !== undefined ? active : true
    });

    res.status(201).json({
      success: true,
      message: "Service créé avec succès",
      service
    });

  } catch (err) {
    console.error("Erreur createService:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Modifier un service (ADMIN)
export const updateService = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    // Ne pas permettre la modification du slug
    delete updates.slug;

    const service = await Service.findOneAndUpdate(
      { slug: slug as string },
      updates,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: "Service introuvable" 
      });
    }

    res.json({
      success: true,
      message: "Service mis à jour avec succès",
      service
    });

  } catch (err) {
    console.error("Erreur updateService:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};

// Supprimer un service (ADMIN)
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Plutôt que de supprimer, on désactive le service
    const service = await Service.findOneAndUpdate(
      { slug: slug as string },
      { active: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ 
        success: false, 
        message: "Service introuvable" 
      });
    }

    res.json({
      success: true,
      message: "Service désactivé avec succès",
      service
    });

  } catch (err) {
    console.error("Erreur deleteService:", err);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur" 
    });
  }
};