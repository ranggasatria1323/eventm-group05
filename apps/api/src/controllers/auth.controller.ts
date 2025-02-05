import { NextFunction, Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Helper untuk menghasilkan kode referral
const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Middleware untuk Auth Request
interface AuthRequest extends Request {
  user?: any; // Sesuaikan dengan tipe user jika ada tipe khusus
}

export default class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, referralCode } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let discount = null;
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          userType: null, // Role not selected yet
          referralCode: null, // Not generated yet
        },
      });

      if (referralCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode },
        });

        if (!referrer) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid referral code',
          });
        }

        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            points: { increment: 10000 }, // Tambahkan 10.000 poin
          },
        });

        

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);

        discount = await prisma.discount.create({
          data: {
            userId: newUser.id, // User yang menggunakan referral mendapatkan diskon
            percentage: 10,
            startDate,
            endDate,
          },
        });
      }

      

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        `${process.env.JWT_KEY}`,
        { expiresIn: '1d' },
      );

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          token,
          discount, 
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid credentials',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid credentials',
        });
      }

      const now = new Date();
      const lastUpdated = new Date(user.pointsUpdatedAt || user.createdAt);
      const diffInMonths =
        (now.getFullYear() - lastUpdated.getFullYear()) * 12 +
        (now.getMonth() - lastUpdated.getMonth());

      if (diffInMonths >= 3) {
        await prisma.user.update({
          where: { id: user.id },
          data: { points: 0, pointsUpdatedAt: now },
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        `${process.env.JWT_KEY}`,
        { expiresIn: '1d' },
      );

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user interest (role)
  async updateUserInterest(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { userType } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'User ID is missing',
        });
      }

      // Generate referral code jika role diubah menjadi customer
      const referralCode =
        userType === 'Customer' ? generateReferralCode() : undefined;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          userType,
          referralCode,
        },
      });

      res.status(200).json({
        status: 'success',
        message: 'User role updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create a discount
  async createDiscount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { percentage } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'User ID is missing',
        });
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const discount = await prisma.discount.create({
        data: {
          userId,
          percentage,
          startDate,
          endDate,
        },
      });

      res.status(201).json({
        status: 'success',
        message: 'Discount created successfully',
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get active discounts
  async getActiveDiscounts(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'User ID is missing',
        });
      }

      const now = new Date();

      const activeDiscounts = await prisma.discount.findMany({
        where: {
          userId,
          endDate: { gt: now },
        },
      });

      res.status(200).json({
        status: 'success',
        data: activeDiscounts,
      });
    } catch (error) {
      next(error);
    }
  }
}
