import { Router } from 'express';
import {
  getEvents,
  createEvents,
  getOrganizerEvents,
  getEventById,
  searchEvents,
  deleteEvent,
  updateEvent, // Import the updateEvent function
  getEventsPagination
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { uploader } from 'uploader';

const router = Router();

router.get('/events/', getEvents);
router.get('/events-pagination/', getEventsPagination)
router.post(
  '/event',
  authMiddleware,
  uploader('IMG', 'event-images').single('file'),
  createEvents,
);
router.get('/events/:id', getEventById);
router.put('/events/:id', 
authMiddleware, uploader('IMG', 'event-images').single('file'), updateEvent); // Add the updateEvent route
router.delete('/events/:id', authMiddleware, deleteEvent);
router.get('/organizer-events', authMiddleware, getOrganizerEvents);
router.get('/search', searchEvents);

export default router;
