import express from 'express';
import { getUserDiscounts, getAvailableDiscounts } from '../controllers/discount.controller';
import { authMiddleware } from '../middlewares/auth.middleware'; // Middleware autentikasi

const router = express.Router();

router.get('/discounts', authMiddleware, getUserDiscounts); // Diskon hanya bisa diakses oleh user yang sudah login
router.get('/discounts/available', getAvailableDiscounts); // Diskon yang tersedia bisa diakses oleh siapa saja


export default router;
