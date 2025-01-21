import { Router } from "express";
import { getEvents, createEvents } from "@/controllers/event.controller.ts";
import { authMiddleware } from "@/middlewares/auth.middleware";

const router = Router()
router.get('/events/', getEvents)
router.post('/event', authMiddleware, createEvents)

export default router