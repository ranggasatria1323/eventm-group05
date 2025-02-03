import { Router } from 'express';
import {
  getEvents,
  createEvents,
  getOrganizerEvents,
  getEventById,
  searchEvents,
  editEvent,
  deleteEvent,
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploader } from 'uploader';

const router = Router();

router.get('/events/', getEvents);
router.post(
  '/event',
  authMiddleware,
  uploader('IMG', 'event-images').single('file'),
  createEvents,
);
router.get('/events/:id', getEventById);
router.patch('/events/:id', authMiddleware, editEvent);
router.delete('/events/delete/:id', authMiddleware, deleteEvent);
router.get('/organizer-events', authMiddleware, getOrganizerEvents);
router.get('/search', searchEvents);

export default router;
