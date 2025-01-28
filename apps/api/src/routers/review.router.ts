import express from 'express';
import { addReview, getReviewsByEvent } from './../controllers/review.controller';
import { authMiddleware } from './../middlewares/auth.middleware';

const router = express.Router();

// Endpoint untuk menambahkan review
router.post('/reviews', authMiddleware, addReview);

// Endpoint untuk mengambil semua review untuk event tertentu
router.get('/reviews/:eventId', getReviewsByEvent);

export default router;
