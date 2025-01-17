import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { validateRegisterData, validateLoginData } from "../middlewares/auth.middleware";

export default class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", validateRegisterData, this.authController.register);
    this.router.post("/login", validateLoginData, this.authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}
