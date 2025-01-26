import express from "express"
import ProfileController from "../controllers/profile.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { userUploader } from "../../uploader"

const router = express.Router()
const profileController = new ProfileController()

// Configure uploader
const profileImageUploader = userUploader("IMG", "images")

// Routes
router.get("/profile", authMiddleware, profileController.getProfile)
router.put("/profile", authMiddleware, profileImageUploader.single("profileImage"), profileController.updateProfile)

export default router

