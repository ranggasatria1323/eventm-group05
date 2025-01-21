import { NextFunction, Request as ExpressRequest, Response } from "express";
import prisma from "../prisma";
import { User } from "@prisma/client";

interface AuthRequest extends ExpressRequest {
  user?: User;
}

export default class ProfileController {
  // Mengambil data profil pengguna
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
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

  // Mengupdate profil pengguna
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { phoneNumber, birthdate, gender } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          phoneNumber: phoneNumber || undefined,
          birthdate: birthdate || undefined,
          gender: gender || undefined,
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
  }

  // Mengupdate gambar profil pengguna
  async updateProfileImage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({
          status: "error",
          message: "User ID is missing",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: "error",
          message: "No file uploaded",
        });
      }

      const imagePath = req.file.path; // Lokasi file gambar yang diupload

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          image: imagePath,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Profile image updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
}
