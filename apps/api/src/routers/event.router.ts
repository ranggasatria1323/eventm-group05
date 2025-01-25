import { Router } from "express";
import { getEvents, createEvents } from "../controllers/event.controller";
import { authMiddleware, restrictToEventOrganizer } from "../middlewares/auth.middleware";
import { eventUploader } from "uploader";

const router = Router();

// Apply the restrictToEventOrganizer middleware to the dashboard route
router.get('/dashboard', authMiddleware, restrictToEventOrganizer, (req, res) => {
  res.status(200).json({ message: 'Welcome to the Event Organizer Dashboard!' });
});

router.get('/events/', getEvents);
router.post('/event', authMiddleware, eventUploader("IMG","event-images").single("file"), createEvents);

export default router;
