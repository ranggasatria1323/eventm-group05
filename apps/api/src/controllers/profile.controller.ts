// Controller/profile.controller.js
import type { NextFunction, Request as ExpressRequest, Response } from "express"
import prisma from "../prisma"
import type { User } from "@prisma/client"
import path from "path"

interface AuthRequest extends ExpressRequest {
  user?: User
  file?: Express.Multer.File
}

class ProfileController {
  getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          userType: true,
          phoneNumber: true,
          birthdate: true,
          gender: true,
          image: true,
          referralCode: true,
          points: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { phoneNumber, birthdate, gender } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      let profileImage;
      if (req.file) {
        profileImage = path.join("/images/profiles", req.file.filename);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: phoneNumber || undefined,
          birthdate: birthdate ? new Date(birthdate) : undefined,
          gender: gender || undefined,
          image: profileImage || undefined,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default ProfileController;
