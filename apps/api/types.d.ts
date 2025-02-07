import { User } from "@prisma/client"; // Adjust the import based on your User model
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Add the user property
  }
}
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Add the userId property
    }
  }
}

