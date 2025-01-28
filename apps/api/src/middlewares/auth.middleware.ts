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
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authorization header is missing',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Token is missing',
      });
    }

    const decoded = jwt.verify(token, `${process.env.JWT_KEY}`) as {
      id: number;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized - User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in attachUserToRequest:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

// Middleware: Validate Register Data
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

// Middleware: Validate Login Data
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

// Middleware: General Authentication
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

// Middleware: Check Points Expiry
export const checkPointsExpiry = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user) {
      const now = new Date();
      const lastUpdated = new Date(user.pointsUpdatedAt || user.createdAt); // Default ke createdAt jika null
      const diffInMonths =
        (now.getFullYear() - lastUpdated.getFullYear()) * 12 +
        (now.getMonth() - lastUpdated.getMonth());

      if (diffInMonths >= 3) {
        await prisma.user.update({
          where: { id: userId },
          data: { points: 0, pointsUpdatedAt: now },
        });
      }
    }

    next();
  } catch (error) {
    console.error('Error in checkPointsExpiry:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while checking points expiry.',
    });
  }
};

export const verifyEventOrganizer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Unauthorized: No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY || '') as {
      id: number;
    };
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userType: true },
    });

    if (!user || user.userType !== 'Event Organizer') {
      return res
        .status(403)
        .json({ status: 'error', message: 'Forbidden: Access denied' });
    }

    next();
  } catch (error) {
    console.error('Error in verifyEventOrganizer middleware:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
