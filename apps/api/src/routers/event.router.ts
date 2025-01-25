import { Router } from "express";
import { getEvents, createEvents } from "@/controllers/event.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { eventUploader } from "uploader";

const router = Router()
router.get('/events/', getEvents)
router.post('/event', authMiddleware, eventUploader("IMG","event-images").single("file"), createEvents)

export default router