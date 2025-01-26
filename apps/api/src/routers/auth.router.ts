import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { 
  validateRegisterData, 
  validateLoginData, 
  authMiddleware, 
  attachUserToRequest,
  checkPointsExpiry
} from "../middlewares/auth.middleware";

export default class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Register route
    this.router.post(
      "/register", 
      validateRegisterData, 
      this.authController.register
    );

    // Login route (tanpa checkPointsExpiry)
    this.router.post(
      "/login", 
      validateLoginData, 
      this.authController.login
    );

    // Update interest route
    this.router.put(
      "/interest", 
      authMiddleware, 
      checkPointsExpiry, 
      this.authController.updateUserInterest
    );

    // Create discount route (requires authentication and check for points expiry)
    this.router.post(
      "/discount", 
      authMiddleware, 
      checkPointsExpiry, 
      this.authController.createDiscount
    );

    // Get active discounts route
    this.router.get(
      "/active-discounts", 
      authMiddleware, 
      checkPointsExpiry, 
      this.authController.getActiveDiscounts
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
