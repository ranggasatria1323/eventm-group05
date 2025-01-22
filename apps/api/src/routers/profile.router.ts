import express from "express";
import ProfileController from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploader } from "../../uploader";

const router = express.Router();
const profileController = new ProfileController();

const profileImageUploader = uploader("profile_", "images/profiles", {
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Pass null for no error
    } else {
      cb(new Error("Only image files are allowed!") as Error & null, false); // Explicitly cast
    }
  },
});


// Routes
router.get("/profile", authMiddleware, profileController.getProfile.bind(profileController));
router.put(
  "/profile",
  authMiddleware,
  profileImageUploader.single("profileImage"),
  profileController.updateProfile.bind(profileController)
);

export default router;
