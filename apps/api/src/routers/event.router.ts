import { Router } from 'express';
import { getEvents, createEvents } from '@/controllers/event.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { uploader } from 'uploader';

const router = Router();
router.get('/events/', getEvents);
router.post(
  '/event',
  authMiddleware,
  uploader('IMG', 'public').single('file'),
  createEvents,
);

export default router;
