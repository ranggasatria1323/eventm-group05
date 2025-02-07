import express from 'express';
import {
  authMiddleware,
  verifyEventOrganizer,
} from './../middlewares/auth.middleware';
import { getDashboardData } from './../controllers/dashboard.controller';

const router = express.Router();

// Hanya Event Organizer yang boleh mengakses dashboard
router.get(
  '/dashboard',
  authMiddleware,
  verifyEventOrganizer,
  getDashboardData,
);

export default router;
