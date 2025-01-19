import { User } from "@prisma/client"; // Adjust the import based on your User model

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Add the user property
  }
}
