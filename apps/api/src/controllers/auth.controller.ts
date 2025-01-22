import { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";

// Generate referral code
const generateReferralCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Authenticated request interface
interface AuthRequest extends ExpressRequest {
  user?: User;
}

// Middleware: Attach user to request
const attachUserToRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const decoded = jwt.verify(token, `${process.env.JWT_KEY}`) as jwt.JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default class AuthController {
  /**
   * User registration with optional referral code
   */
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, referralCode: usedReferralCode } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate referral code for the new user
      const referralCode = generateReferralCode();

      let referrerId = null;

      // Handle referral code logic
      if (usedReferralCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: usedReferralCode },
        });

        if (!referrer) {
          return res.status(400).json({
            status: "error",
            message: "Invalid referral code",
          });
        }

        // Award points to the referrer
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            points: { increment: 10000 },
          },
        });

        referrerId = referrer.id; // Save referrer ID for reference
      }

      // Create the new user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          userType: "", // Empty string, to be updated later
          referralCode,
          referrerId,
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        `${process.env.JWT_KEY}`,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: { referralCode, token },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * User login
   */
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        `${process.env.JWT_KEY}`,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user interest
   */
  async updateUserInterest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userType } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { userType },
      });

      res.status(200).json({
        status: "success",
        message: "User interest updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
