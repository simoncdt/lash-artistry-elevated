import { Request, Response } from 'express';
import Review from '../models/Review.model.js';

// Récupérer les avis approuvés (pour le frontend)
export const getApprovedReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort({ date: -1 })
      .limit(10); // On peut augmenter plus tard

    res.json({
      success: true,
      reviews,
      total: await Review.countDocuments({ status: 'approved' }),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Soumettre un nouvel avis (statut pending)
export const submitReview = async (req: Request, res: Response) => {
  try {
    const { name, service, rating, text } = req.body;

    if (!name || !service || !rating || !text) {
      return res.status(400).json({ success: false, message: 'Champs requis manquants' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Note entre 1 et 5 uniquement' });
    }

    const review = await Review.create({
      name: name.trim(),
      service: service.trim(),
      rating: Number(rating),
      text: text.trim(),
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Avis soumis avec succès ! Il sera visible après validation.',
      reviewId: review._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur lors de la soumission' });
  }
};