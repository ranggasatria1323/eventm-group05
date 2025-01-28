import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

export const getDashboardData = async (req: AuthRequest, res: Response) => {
    return res.status(200).json({
      status: 'success',
      message: 'Welcome to the Event Organizer Dashboard!',
      data: {
        events: [],
        stats: {},
      },
    });
  };
  