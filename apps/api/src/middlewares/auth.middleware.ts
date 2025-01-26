import { NextFunction, Response, Request } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import prisma from '../prisma'; // Import Prisma client
import { User } from '@prisma/client';

// Define Authenticated Request interface
interface AuthRequest extends Request {
  user?: User;
}

// Middleware: Attach user to request
export const attachUserToRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authorization header is missing',
      });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is missing',
      });
    }

    // Verify and decode token
    const decoded = jwt.verify(token, `${process.env.JWT_KEY}`) as {
      id: number;
    };

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - User not found',
      });
    }

    // Attach user to the request object
    req.user = user;

    // Proceed to the next middleware or handler
    next();
  } catch (error) {
    console.error('Error in attachUserToRequest:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

// New Middleware: Restrict access to Event Organizers only
export const restrictToEventOrganizer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.userType !== 'Event Organizer') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Only Event Organizers can access this resource.',
    });
  }
  next();
};

export const validateRegisterData = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  (req: AuthRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: errors.array(),
        data: null,
      });
      return;
    }
    next();
  },
];

export const validateLoginData = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),

  (req: AuthRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: errors.array(),
        data: null,
      });
      return;
    }
    next();
  },
];

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, `${process.env.JWT_KEY}`) as {
      id: number;
      email: string;
      userType: string;
    };
    req.user = {
      id: decoded.id,
      email: decoded.email,
      userType: decoded.userType,
    } as User;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
