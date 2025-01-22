import express from "express"
import ProfileController from "../controllers/profile.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { uploader } from "../../uploader"

const router = express.Router()
const profileController = new ProfileController()

const profileImageUploader = uploader("profile_", "images/profiles")

router.get("/profile", authMiddleware, profileController.getProfile.bind(profileController))
router.put(
  "/profile",
  authMiddleware,
  profileImageUploader.single("profileImage"),
  profileController.updateProfile.bind(profileController),
)

export default router

