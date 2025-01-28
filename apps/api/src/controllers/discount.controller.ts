import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import type { User } from '@prisma/client';

interface AuthRequest extends Request {
  user?: User;
}

// Mendapatkan diskon aktif pengguna
export const getUserDiscounts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id; // Dapatkan ID pengguna dari middleware autentikasi

    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is missing',
      });
    }

    const now = new Date();

    // Ambil semua diskon aktif pengguna
    const discounts = await prisma.discount.findMany({
      where: {
        userId,
        endDate: { gt: now }, // endDate harus lebih besar dari tanggal sekarang
      },
      select: {
        id: true,
        percentage: true,
        startDate: true,
        endDate: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
};
