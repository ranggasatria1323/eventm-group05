import { NextFunction, Request, Response } from "express";
import prisma from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, userType } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "User already exists",
          data: null
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          userType,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        `${process.env.JWT_SECRET}` as string,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: "error",
          message: "Invalid credentials",
          data: null
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Invalid credentials",
          data: null
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, userType: user.userType },
        `${process.env.JWT_SECRET}` as string,
        { expiresIn: '1d' }
      );

      res.status(200).json({
        status: "success",
        message: "Login successful",
        data: { token }
      });
    } catch (error) {
      next(error);
    }
  }
}

