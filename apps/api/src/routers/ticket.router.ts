import express from 'express';
import {
  authMiddleware,
  verifyCustomer,
} from '../middlewares/auth.middleware'; // Middleware untuk membatasi akses hanya customer
import { getTicket } from '@/controllers/ticket.controller';

const router = express.Router();

router.get('/tickets/:ticketId',authMiddleware, verifyCustomer, getTicket);


export default router;