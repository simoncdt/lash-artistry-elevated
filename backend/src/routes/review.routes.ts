import { Router } from 'express';
import { getApprovedReviews, submitReview } from '../controllers/review.controller.js';

const router = Router();

router.get('/', getApprovedReviews);           // Pour afficher sur le site
router.post('/', submitReview);                // Pour soumettre un avis

export default router;