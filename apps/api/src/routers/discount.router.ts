import express from 'express';
import { getUserDiscounts } from '../controllers/discount.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // Middleware autentikasi

const router = express.Router();

router.get('/discounts',authMiddleware, getUserDiscounts); // Diskon hanya bisa diakses oleh user yang sudah login

export default router;
