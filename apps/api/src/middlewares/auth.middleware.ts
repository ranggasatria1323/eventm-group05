import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateRegisterData = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("userType").isIn(["Customer", "Event Organizer"]).withMessage("User type must be either 'Customer' or 'Event Organizer'"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: errors.array(),
        data: null
      });
      return;
    }
    next();
  },
];

export const validateLoginData = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: errors.array(),
        data: null
      });
      return;
    }
    next();
  },
];

