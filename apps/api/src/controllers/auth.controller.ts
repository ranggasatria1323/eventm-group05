import { NextFunction, Request as ExpressRequest, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const generateReferralCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

interface AuthRequest extends ExpressRequest {
  user?: User;
}

export default class AuthController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        password,
        referralCode: usedReferralCode,
      } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const referralCode = generateReferralCode();

      let referrerId = null;

      if (usedReferralCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: usedReferralCode },
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
            points: { increment: 10000 },
          },
        });

        referrerId = referrer.id;
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          userType: '',
          referralCode,
          referrerId,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        `${process.env.JWT_KEY}`,
        { expiresIn: '1d' },
      );

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { referralCode, token },
      });
    } catch (error) {
      next(error);
    }
  }

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

      await prisma.user.update({
        where: { id: userId },
        data: { userType },
      });

      res.status(200).json({
        status: 'success',
        message: 'User interest updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
