import { Response, NextFunction, Request } from 'express';
import { body, validationResult } from 'express-validator';
import jwt, { verify } from 'jsonwebtoken';
import { User } from '@prisma/client';


interface AuthRequest extends Request {
  user?: User;
}

export const validateRegisterData = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

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

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
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
    req.user = { id: decoded.id, email: decoded.email, userType: decoded.userType } as User;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

