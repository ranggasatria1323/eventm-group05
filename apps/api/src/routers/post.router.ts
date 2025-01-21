import { Router } from "express";
import AuthController from "@/controllers/auth.controller";

export default class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/register", this.authController.register);
  }

  getRouter(): Router {
    return this.router;
  }
}

