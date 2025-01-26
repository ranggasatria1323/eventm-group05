import { Router } from 'express';
import { getEvents, createEvents } from '../controllers/event.controller';
import {
  authMiddleware,
  verifyEventOrganizer,
} from '../middlewares/auth.middleware';
import { uploader } from 'uploader';

const router = Router();

// Apply the restrictToEventOrganizer middleware to the dashboard route
router.get('/dashboard', authMiddleware, verifyEventOrganizer, (req, res) => {
  res
    .status(200)
    .json({ message: 'Welcome to the Event Organizer Dashboard!' });
});

router.get('/events/', getEvents);
router.post(
  '/event',
  authMiddleware,
  uploader('IMG', 'event-images').single('file'),
  createEvents,
);

export default router;
