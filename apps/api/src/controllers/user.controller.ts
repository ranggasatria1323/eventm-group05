import { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import { User } from '@prisma/client';

interface AuthRequest extends ExpressRequest {
  user?: User;
}

export default class UserController {
  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
          data: null,
        });
      }

      res.status(200).json({
        status: "success",
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany();

      res.status(200).json({
        status: "success",
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
}
