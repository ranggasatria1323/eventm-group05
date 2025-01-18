import { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from '@prisma/client';

interface AuthRequest extends ExpressRequest {
  user?: User;
}

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
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
          data: null,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          userType: '', // User type will be set later
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        `${process.env.JWT_KEY}` as string,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: { token },
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
          status: "error",
          message: "Invalid credentials",
          data: null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Invalid credentials",
          data: null,
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        `${process.env.JWT_KEY}` as string,
        { expiresIn: '1d' }
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

  async updateUserInterest(req: AuthRequest, res: Response, next: NextFunction) {
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
        where: { id: Number(userId) },
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
